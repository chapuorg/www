// 茶叶相关页面（地区、分类、详情、标签等）
import { setHTML, getAutoTagColor, getTagIcon, getSubCategories, groupTeasBySubCategory, getSubCategoriesForCategory, escHtml, escRegex } from './utils.js';
import { CONFIG, categoryDefaultIcon, categoryColors, continentIcons, continentColors, provinceIcons, regionColors, countryIcons, countryColors, subCategoryIcons } from './config.js';
import dataLoader from './data-loader.js';
import router from './router.js';
import { renderBreadcrumb, renderWaterfall, renderTeaDetail } from './components.js';

// ── 共享搜索字段定义（不含 tags —— tags 的 getter 依赖 q/ql 动态生成）──
const SEARCH_TEA_FIELDS_BASE = [
  { field: 'name', label: '茶名', get: t => t.name },
  { field: 'nameEn', label: '英文名', get: t => t.nameEn },
  { field: 'country', label: '国家', get: t => t.country },
  { field: 'province', label: '产地', get: t => t.province },
  { field: 'city', label: '产地', get: t => t.city },
  { field: 'district', label: '产地', get: t => t.district },
  { field: 'category', label: '分类', get: t => t.category },
  { field: 'description', label: '描述', get: t => t.description },
  { field: 'history', label: '历史', get: t => t.historyDetail }
];

const SEARCH_ROUTE_FIELDS = [
  { field: 'name', label: '名称', get: r => r.name },
  { field: 'subtitle', label: '副标题', get: r => r.subtitle },
  { field: 'continent', label: '地区', get: r => r.continent },
  { field: 'mainTea', label: '主要茶种', get: r => r.mainTea },
  { field: 'summary', label: '概要', get: r => r.summary },
  { field: 'story', label: '故事', get: r => r.story },
  { field: 'detailRoute', label: '路线', get: r => r.detailRoute }
];

const SEARCH_TH_FIELDS_BASE = [
  { field: 'name', label: '名称', get: t => t.name },
  { field: 'nameEn', label: '英文名', get: t => t.nameEn },
  { field: 'country', label: '国家', get: t => t.country },
  { field: 'city', label: '城市', get: t => t.city },
  { field: 'specialty', label: '特色茶品', get: t => t.specialty },
  { field: 'style', label: '风格', get: t => t.style },
  { field: 'description', label: '描述', get: t => t.description }
];

function _searchTagsField(q, ql) {
  return { field: 'tags', label: '标签', get: t => t.tags && t.tags.some(tg => tg.indexOf(q) >= 0 || tg.toLowerCase().indexOf(ql) >= 0) ? 'hit' : null };
}

// ── 搜索匹配度评分 ──
// 权重：名称精确匹配 > 名称部分匹配 > 标签匹配 > 类别/产地 > 描述匹配
const MATCH_WEIGHTS = {
  nameExact: 100,    // 名称完全等于关键词
  namePartial: 50,   // 名称包含关键词
  nameEn: 40,        // 英文名匹配
  subtitle: 35,      // 副标题匹配
  tags: 30,          // 标签匹配
  category: 25,      // 分类匹配
  specialty: 20,     // 特色茶品匹配
  style: 20,         // 风格匹配
  country: 18,       // 国家匹配
  province: 18,      // 省份匹配
  city: 16,          // 城市匹配
  district: 15,      // 区县匹配
  mainTea: 15,       // 主要茶种匹配
  history: 15,       // 历史匹配
  description: 10,   // 描述匹配（每出现一次加分）
  summary: 10,
  story: 10,
  detailRoute: 8
};

// 对单项打分，返回 { score, matches: [{field, label, snippet}] }
function scoreItem(item, q, ql, fieldDefs) {
  let score = 0;
  const matches = [];

  fieldDefs.forEach(def => {
    const val = def.get(item);
    if (!val) return;
    const str = typeof val === 'string' ? val : '';
    const idx = ql ? str.toLowerCase().indexOf(ql) : str.indexOf(q);
    if (idx === -1) return;

    // 名称精确匹配给满分
    if (def.field === 'name' && str === q) {
      score += MATCH_WEIGHTS.nameExact;
    } else {
      score += MATCH_WEIGHTS[def.field] || 10;
      // 描述类字段每多出现一次额外加分
      if (['description', 'story', 'summary', 'detailRoute'].includes(def.field)) {
        const count = (str.match(new RegExp(escRegex(q), 'gi')) || []).length;
        score += (count - 1) * 3;
      }
    }

    // 生成匹配片段：关键字前后各10个字符
    const start = Math.max(0, idx - 10);
    const end = Math.min(str.length, idx + q.length + 10);
    let snippet = (start > 0 ? '...' : '') + str.substring(start, end) + (end < str.length ? '...' : '');
    // 高亮匹配词
    const re = new RegExp('(' + escRegex(q) + ')', 'gi');
    snippet = escHtml(snippet).replace(re, '<mark>$1</mark>');

    matches.push({ field: def.field, label: def.label, snippet });
  });

  // 标签匹配多个时额外加分
  if (item.tags && Array.isArray(item.tags)) {
    const matchedTags = item.tags.filter(tg => tg.indexOf(q) >= 0 || (ql && tg.toLowerCase().indexOf(ql) >= 0));
    if (matchedTags.length > 0) {
      score += (matchedTags.length - 1) * 5;
    }
  }

  return { score, matches };
}

// 正则搜索并排序
function searchAndSort(items, q, ql, fieldDefs) {
  const scored = [];
  items.forEach(item => {
    const { score, matches } = scoreItem(item, q, ql, fieldDefs);
    if (score > 0) scored.push({ item, score, matches });
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

// 格式化匹配描述
function formatMatchDesc(matches, maxShow = 3) {
  const shown = matches.slice(0, maxShow);
  return shown.map(m => '<span class="map__tag">' + m.label + '</span>').join('') +
    (matches.length > maxShow ? '<span class="map__tag">+' + (matches.length - maxShow) + '</span>' : '');
}

// 简洁匹配片段
function formatMatchSnippet(matches, maxShow = 2) {
  return matches.slice(0, maxShow)
    .filter(m => m.snippet)
    .map(m => '<div class="map__snippet break-word">' + m.snippet + '</div>')
    .join('');
}

function getContinentGroups(teas) {
  const map = {};
  teas.forEach(t => {
    if (!map[t.continent]) map[t.continent] = { count: 0, countries: {} };
    map[t.continent].count++;
    map[t.continent].countries[t.country] = (map[t.continent].countries[t.country] || 0) + 1;
  });
  return map;
}

function getCountryGroups(teas, continent) {
  const map = {};
  teas.filter(t => t.continent === continent).forEach(t => {
    if (!map[t.country]) map[t.country] = { count: 0, provinces: {} };
    map[t.country].count++;
    if (t.province) map[t.country].provinces[t.province] = true;
  });
  return map;
}

function getCityTeas(teas) {
  const map = {};
  teas.forEach(t => {
    const c = t.city || t.province;
    if (!map[c]) map[c] = [];
    map[c].push(t);
  });
  return map;
}

function getDistrictTeas(teas, city) {
  const map = {};
  teas.filter(t => t.city === city).forEach(t => {
    const d = t.district || t.city;
    if (!map[d]) map[d] = [];
    map[d].push(t);
  });
  return map;
}

// 大洲页
function renderContinentPage(continent, teas) {
  const groups = getCountryGroups(teas, continent);
  const icon = continentIcons[continent] || '🌏';
  const color = continentColors[continent] || '#8B4513';
  let html = renderBreadcrumb([{ label: continent }]);
  html += '<h1 class="page-title break-word">' + icon + ' ' + continent + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + teas.length + ' 个茶叶品种，分布在 ' + Object.keys(groups).length + ' 个国家</p>';
  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + color + '">';
  html += '<span class="section-group__header-label">🌍 国家/地区</span>';
  html += '<span class="section-group__header-count">' + Object.keys(groups).length + ' 个国家</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  Object.keys(groups).forEach(country => {
    const cIcon = countryIcons[country] || icon;
    html += '<div class="category-card" data-nav="' + (country === '中国' ? 'china' : 'country-' + encodeURIComponent(country)) + '" style="border-top:3px solid ' + color + '">';
    html += '<div class="category-card__icon" style="font-size:1.8rem;">' + cIcon + '</div>';
    html += '<div class="category-card__name break-word">' + country + '</div>';
    html += '<div class="category-card__count break-word">' + groups[country].count + ' 个品种</div>';
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

// 国家页
function renderCountryPage(country, teas) {
  const cIcon = countryIcons[country] || '🌍';
  const cColor = countryColors[country] || '#8B4513';

  const provMap = {};
  teas.forEach(t => {
    const p = t.province || country;
    if (!provMap[p]) provMap[p] = [];
    provMap[p].push(t);
  });
  const provKeys = Object.keys(provMap).sort();

  const continent = teas[0] ? teas[0].continent : '';
  const bc = continent ? [{ label: continent, nav: 'continent-' + encodeURIComponent(continent) }, { label: country }] : [{ label: country }];

  let html = renderBreadcrumb(bc);
  html += '<h1 class="page-title break-word">' + cIcon + ' ' + country + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + provKeys.length + ' 个省份/地区，' + teas.length + ' 个茶叶品种</p>';

  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + cColor + '">';
  html += '<span class="section-group__header-label">🏞️ 省份/地区</span>';
  html += '<span class="section-group__header-count">' + provKeys.length + ' 个</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  provKeys.forEach(prov => {
    const pIcon = provinceIcons[prov] || '🏞️';
    const pColor = regionColors[prov] || cColor;
    html += '<div class="category-card" data-nav="province-' + encodeURIComponent(prov) + '" style="border-top:3px solid ' + pColor + '">';
    html += '<div class="category-card__icon" style="font-size:1.8rem;">' + pIcon + '</div>';
    html += '<div class="category-card__name break-word">' + prov + '</div>';
    html += '<div class="category-card__count break-word">' + provMap[prov].length + ' 个品种</div>';
    html += '</div>';
  });
  html += '</div></div>';

  provKeys.forEach(prov => {
    const provTeas = provMap[prov];
    const cityGroups = getCityTeas(provTeas);
    const cityKeys = Object.keys(cityGroups).sort();
    const pIcon = provinceIcons[prov] || '🏞️';
    html += '<div class="section-group">';
    html += '<div class="section-group__header clickable" data-nav="province-' + encodeURIComponent(prov) + '" style="border-left:3px solid ' + cColor + '">';
    html += '<span class="section-group__header-label">' + pIcon + ' ' + prov + '</span>';
    html += '<span class="section-group__header-count">' + cityKeys.length + ' 个城市 · ' + provTeas.length + ' 个品种</span>';
    html += '<span class="section-group__header-arrow">→</span>';
    html += '</div>';
    html += '<div class="category__grid">';
    cityKeys.forEach(city => {
      html += '<div class="category-card" data-nav="city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + cColor + '">';
      html += '<div class="category-card__icon" style="font-size:1.5rem;">🏙️</div>';
      html += '<div class="category-card__name break-word">' + city + '</div>';
      html += '<div class="category-card__count break-word">' + cityGroups[city].length + ' 个品种</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  return html;
}

// 省份页
function renderProvincePage(province, teas) {
  const pIcon = provinceIcons[province] || '🏞️';
  const pColor = regionColors[province] || '#8B4513';
  const cityGroups = getCityTeas(teas);
  const cityKeys = Object.keys(cityGroups).sort();

  const first = teas[0];
  const bc = [];
  if (first && first.continent) bc.push({ label: first.continent, nav: 'continent-' + encodeURIComponent(first.continent) });
  const cty = first ? first.country : '中国';
  bc.push({ label: cty, nav: cty === '中国' ? 'china' : 'country-' + encodeURIComponent(cty) });
  bc.push({ label: province });

  let html = renderBreadcrumb(bc);
  html += '<h1 class="page-title break-word">' + pIcon + ' ' + province + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + cityKeys.length + ' 个城市，' + teas.length + ' 个茶叶品种</p>';

  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + pColor + '">';
  html += '<span class="section-group__header-label">🏙️ 城市</span>';
  html += '<span class="section-group__header-count">' + cityKeys.length + ' 个</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  cityKeys.forEach(city => {
    html += '<div class="category-card" data-nav="city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + pColor + '">';
    html += '<div class="category-card__icon" style="font-size:1.5rem;">🏙️</div>';
    html += '<div class="category-card__name break-word">' + city + '</div>';
    html += '<div class="category-card__count break-word">' + cityGroups[city].length + ' 个品种</div>';
    html += '</div>';
  });
  html += '</div></div>';

  cityKeys.forEach(city => {
    const cityTeas = cityGroups[city];
    const distGroups = getDistrictTeas(cityTeas, city);
    const distKeys = Object.keys(distGroups).sort();
    const hasDistricts = distKeys.length > 1 || (distKeys.length === 1 && distKeys[0] !== city);

    if (hasDistricts) {
      html += '<div class="section-group">';
      html += '<div class="section-group__header clickable" data-nav="city-' + encodeURIComponent(city) + '" style="border-left:3px solid ' + pColor + '">';
      html += '<span class="section-group__header-label">🏙️ ' + city + '</span>';
      html += '<span class="section-group__header-count">' + distKeys.length + ' 个县区 · ' + cityTeas.length + ' 个品种</span>';
      html += '<span class="section-group__header-arrow">→</span>';
      html += '</div>';
      html += '<div class="category__grid">';
      distKeys.forEach(dist => {
        html += '<div class="category-card" data-nav="district-' + encodeURIComponent(dist) + '" style="border-top:3px solid ' + pColor + '">';
        html += '<div class="category-card__icon" style="font-size:1.5rem;">🏘️</div>';
        html += '<div class="category-card__name break-word">' + dist + '</div>';
        html += '<div class="category-card__count break-word">' + distGroups[dist].length + ' 个品种</div>';
        html += '</div>';
      });
      html += '</div></div>';
    }
  });
  return html;
}

// 城市页
function renderCityPage(city, teas) {
  const distGroups = getDistrictTeas(teas, city);
  const firstTea = teas[0];
  const cityColor = firstTea ? (regionColors[firstTea.province] || '#8B4513') : '#8B4513';
  const distKeys = Object.keys(distGroups).sort();
  const hasDistricts = distKeys.length > 1 || (distKeys.length === 1 && distKeys[0] !== city);

  const province = firstTea ? firstTea.province : '';
  const bc = [];
  if (firstTea && firstTea.continent) bc.push({ label: firstTea.continent, nav: 'continent-' + encodeURIComponent(firstTea.continent) });
  const cty = firstTea ? firstTea.country : '中国';
  bc.push({ label: cty, nav: cty === '中国' ? 'china' : 'country-' + encodeURIComponent(cty) });
  if (province) bc.push({ label: province, nav: 'province-' + encodeURIComponent(province) });
  bc.push({ label: city });

  let html = renderBreadcrumb(bc);
  html += '<h1 class="page-title break-word">🏙️ ' + city + '</h1>';
  html += '<p class="page-subtitle break-word">' + (hasDistricts ? '共 ' + distKeys.length + ' 个县/区，' : '') + teas.length + ' 个茶叶品种</p>';

  if (hasDistricts) {
    html += '<div class="section-group">';
    html += '<div class="section-group__header" style="border-left:3px solid ' + cityColor + '">';
    html += '<span class="section-group__header-label">🏘️ 县/区</span>';
    html += '<span class="section-group__header-count">' + distKeys.length + ' 个</span>';
    html += '</div>';
    html += '<div class="category__grid">';
    distKeys.forEach(dist => {
      html += '<div class="category-card" data-nav="district-' + encodeURIComponent(dist) + '" style="border-top:3px solid ' + cityColor + '">';
      html += '<div class="category-card__icon" style="font-size:1.8rem;">🏘️</div>';
      html += '<div class="category-card__name break-word">' + dist + '</div>';
      html += '<div class="category-card__count break-word">' + distGroups[dist].length + ' 个品种</div>';
      html += '</div>';
    });
    html += '</div></div>';

    distKeys.forEach(dist => {
      const distTeas = distGroups[dist];
      html += '<div class="section-group">';
      html += '<div class="section-group__header clickable" data-nav="district-' + encodeURIComponent(dist) + '" style="border-left:3px solid ' + cityColor + '">';
      html += '<span class="section-group__header-label">🏘️ ' + dist + '</span>';
      html += '<span class="section-group__header-count">' + distTeas.length + ' 个品种</span>';
      html += '<span class="section-group__header-arrow">→</span>';
      html += '</div>';
      html += renderWaterfall(distTeas, []);
      html += '</div>';
    });
  } else {
    html += renderWaterfall(teas, []);
  }
  return html;
}

// 区县页
function renderDistrictPage(district, teas) {
  const first = teas[0];
  const city = first ? first.city : '';
  const province = first ? first.province : '';
  const bc = [];
  if (first && first.continent) bc.push({ label: first.continent, nav: 'continent-' + encodeURIComponent(first.continent) });
  const cty = first ? first.country : '中国';
  bc.push({ label: cty, nav: cty === '中国' ? 'china' : 'country-' + encodeURIComponent(cty) });
  if (province) bc.push({ label: province, nav: 'province-' + encodeURIComponent(province) });
  if (city) bc.push({ label: city, nav: 'city-' + encodeURIComponent(city) });
  bc.push({ label: district });

  let html = renderBreadcrumb(bc);
  html += '<h1 class="page-title break-word">🏘️ ' + district + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + teas.length + ' 个茶叶品种</p>';
  html += renderWaterfall(teas, []);
  return html;
}

// 分类页
function renderCategoryPage(category, teas) {
  const icon = categoryDefaultIcon[category] || '🍵';
  const color = categoryColors[category] || '#8B4513';
  let html = renderBreadcrumb([{ label: '茶叶种类', nav: 'varieties' }, { label: category }]);
  html += '<h1 class="page-title break-word">' + icon + ' ' + category + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + teas.length + ' 个茶叶品种</p>';

  const subGroups = groupTeasBySubCategory(teas);
  const subKeys = Object.keys(subGroups);

  if (subKeys.length >= 1) {
    subKeys.forEach(subCat => {
      const subTeas = subGroups[subCat];
      html += '<div class="section-group">';
      html += '<div class="section-group__header clickable" data-nav="subcategory-' + encodeURIComponent(subCat) + '" style="border-left:3px solid ' + color + '">';
      html += '<span class="section-group__header-label">' + (subCategoryIcons[subCat] || '🍵') + ' ' + subCat + '</span>';
      html += '<span class="section-group__header-count">' + subTeas.length + ' 种</span>';
      html += '<span class="section-group__header-arrow">→</span>';
      html += '</div>';
      html += renderWaterfall(subTeas, []);
      html += '</div>';
    });
  } else {
    html += renderWaterfall(teas, []);
  }
  return html;
}

// 子分类页
function renderSubCategoryPage(subCat, teas) {
  if (teas.length === 0) return '<p style="text-align:center;padding:32px;">未找到该子类茶叶</p>';
  const parentCat = teas[0].category;
  const pcIcon = categoryDefaultIcon[parentCat] || '🍵';
  let html = renderBreadcrumb([{ label: '茶叶种类', nav: 'varieties' }, { label: parentCat, nav: 'category-' + encodeURIComponent(parentCat) }, { label: subCat }]);
  html += '<h1 class="page-title break-word">' + (subCategoryIcons[subCat] || '🍵') + ' ' + subCat + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + teas.length + ' 个茶叶品种</p>';
  html += renderWaterfall(teas, []);
  return html;
}

// 茶叶种类菜单
function renderVarietiesMenu(categories) {
  let html = '<h1 class="page-title break-word">🌿 茶叶种类</h1>';
  html += '<p class="page-subtitle break-word">按照加工工艺和发酵程度逐级浏览全球茶叶品种</p>';

  CONFIG.categoryOrder.forEach(cat => {
    const teas = categories[cat];
    if (!teas || teas.length === 0) return;
    const subCats = getSubCategoriesForCategory(cat, teas);
    const subKeys = Object.keys(subCats);

    const icon = categoryDefaultIcon[cat] || '🍵';
    const color = categoryColors[cat] || '#8B4513';

    html += '<div class="section-group">';
    html += '<div class="section-group__header clickable" data-nav="category-' + encodeURIComponent(cat) + '" style="border-left:3px solid ' + color + '">';
    html += '<span class="section-group__header-label">' + icon + ' ' + cat + '</span>';
    html += '<span class="section-group__header-count">' + teas.length + ' 种' + (subKeys.length > 1 ? ' · ' + subKeys.length + ' 个子类' : '') + '</span>';
    html += '<span class="section-group__header-arrow">→</span>';
    html += '</div>';

    html += '<div class="category__grid">';
    subKeys.forEach(subCat => {
      html += '<div class="category-card" data-nav="subcategory-' + encodeURIComponent(subCat) + '" style="border-top:3px solid ' + color + '">';
      html += '<div class="category-card__icon" style="font-size:1.5rem;">' + (subCategoryIcons[subCat] || '🍵') + '</div>';
      html += '<div class="category-card__name break-word">' + subCat + '</div>';
      html += '<div class="category-card__count break-word">' + subCats[subCat] + ' 种</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '</div>';
  });
  return html;
}

// 标签总览页
function renderTagsPage(tagMap) {
  const sorted = Object.keys(tagMap).map(k => [k, tagMap[k]]);
  sorted.sort((a, b) => b[1].length - a[1].length);

  let html = '<h1 class="page-title break-word">🏷️ 标签总览</h1>';
  html += '<p class="page-subtitle break-word">共 ' + sorted.length + ' 个标签</p>';

  const groupColors = {
    '茶类品种': '#3d8b37', '品质等级': '#d4a017', '外形品相': '#795548', '工艺制法': '#e67e22',
    '风味香气': '#e84393', '口感滋味': '#f39c12', '产地地点': '#2980b9',
    '人物': '#c0392b', '历史文化': '#8e44ad', '民族习俗': '#1abc9c',
    '功效健康': '#16a085', '市场品牌': '#c0392b', '国际': '#607d8b', '茶馆建筑': '#795548'
  };

  const categoryMap = {};
  sorted.forEach(entry => {
    const tag = entry[0];
    let group = '其他';
    // 茶类品种
    if (/[茶茶]类$|品类|品种/.test(tag) || ['绿茶类', '红茶类', '乌龙茶类', '白茶类', '黄茶类', '黑茶类', '普洱茶类'].includes(tag)) group = '茶类品种';
    else if (/工夫红茶|红碎茶|CTC红茶|小种红茶|炒青绿茶|蒸青绿茶|晒青绿茶|烘青绿茶/.test(tag)) group = '茶类品种';
    else if (/红茶$|绿茶$|白茶$|黄茶$|黑茶$|花茶$|青茶$/.test(tag)) group = '茶类品种';
    else if (/藏茶|边茶|饼茶|沱茶|砖茶|紧茶|散茶|代茶|调味茶/.test(tag)) group = '茶类品种';
    else if (/铁观音|岩茶|凤凰单丛|水仙|工夫茶|英国茶/.test(tag)) group = '茶类品种';
    // 品质等级
    else if (/名茶|珍品|极品|金奖|贡茶|十大|优质|精品|皇后|之王|之冠|顶级|高端|珍稀|非遗|古树|有机|地理|纯种|纯料|野生|老树|老丛|百年|御茶|御用|皇室|特级|精选/.test(tag)) group = '品质等级';
    // 外形品相
    else if (/卷曲|扁平|针形|条形|球形|螺形|片形|颗粒|紧结|匀整|显毫|白毫|金毫|银毫|雀舌|毛峰|松针|金芽|银芽|单芽|一芽一叶|一芽二叶/.test(tag)) group = '外形品相';
    // 工艺制法
    else if (/炒|蒸|晒|烘|焙|揉|捻|发酵|工艺|窨花|制作|加工|熏|磨|萎凋|杀青|焙火|炭焙|拼配|渥堆|手制|机制/.test(tag)) group = '工艺制法';
    // 风味香气
    else if (/香|味|韵|兰|桂|蜜|果|花|槟榔|糖|薄荷|松烟|木香|草香|豆香|米香|奶香|焦香|甜香|药香|陈香|玫瑰|茉莉|桂花|栀子|肉桂/.test(tag) && !/[茶茶]类/.test(tag)) group = '风味香气';
    // 口感滋味
    else if (/甜|甘|醇|爽|滑|浓|鲜|涩|厚|润|柔|细|腻|饱满|生津/.test(tag)) group = '口感滋味';
    // 产地地点
    else if (/省|市|县|山|岛|湖|海|江|河|高原|盆地|北|南|东|西|茶园|茶区|产地|原产|高山|丘陵|关|渡|口岸|古都/.test(tag) && !/国际|世界|国饮/.test(tag)) group = '产地地点';
    else if (/州$|阳$|都$|陵$|宁$|安$/.test(tag) && !/国际|世界|国饮/.test(tag) && tag.length <= 4) group = '产地地点';
    // 人物
    else if (/陆羽|吴理真|卓文君|宋徽宗|苏东坡|乾隆|康熙/.test(tag)) group = '人物';
    // 历史文化
    else if (/文化|传统|历史|故事|传说|仪式|禅|皇家|女王|皇帝|乾隆|康熙|诗人|作家|茶祖|起源|古道|之路|诗词|典故|习俗|寺庙|佛教|道教/.test(tag)) group = '历史文化';
    // 民族习俗
    else if (/民族|藏族|羌族|瑶族|侗族|苗族|土家族|汉族|蒙古族/.test(tag) || /族$/.test(tag)) group = '民族习俗';
    // 功效健康
    else if (/健康|养生|安神|提神|养胃|消食|祛湿|药|营养|抗衰|保健|补|抗氧化|降脂|降压|助消化|解毒|美容|养颜/.test(tag)) group = '功效健康';
    // 市场品牌
    else if (/热门|推荐|礼品|日常|品牌|出口|市场|明星|爆款|性价比|外汇|畅销|热销|收藏|投资|口粮|亲民/.test(tag)) group = '市场品牌';
    // 国际
    else if (/英式|日式|韩式|法式|俄式|摩洛哥|土耳其|越南|印度|阿根廷|泰国|锡兰|爪哇|印尼|大吉岭|阿萨姆|尼尔吉里|肯尼亚|斯里兰卡|马来西亚|日本/.test(tag) || /国饮|国民|国宝/.test(tag) || /国家|洲际|国际|世界/.test(tag)) group = '国际';
    // 茶馆建筑
    else if (/茶馆|茶楼|茶室|茶屋|茶行|园林|建筑|酒店/.test(tag)) group = '茶馆建筑';
    if (!categoryMap[group]) categoryMap[group] = [];
    categoryMap[group].push(entry);
  });

  const groupOrder = ['茶类品种', '品质等级', '外形品相', '工艺制法', '风味香气', '口感滋味', '产地地点', '人物', '历史文化', '民族习俗', '功效健康', '市场品牌', '国际', '茶馆建筑', '其他'];

  groupOrder.forEach(group => {
    const entries = categoryMap[group];
    if (!entries || entries.length === 0) return;
    const gc = groupColors[group] || '#607d8b';

    html += '<div class="tag-group">';
    html += '<div class="tag-group__header" style="border-left:3px solid ' + gc + '">';
    html += '<span class="tag-group__header-label">' + group + '</span>';
    html += '<span class="tag-group__header-count">' + entries.length + ' 个标签</span>';
    html += '</div>';
    html += '<div class="tag-cloud">';
    entries.forEach(entry => {
      const tag = entry[0];
      const teasList = entry[1];
      const tc = getAutoTagColor(tag);
      const ti = getTagIcon(tag);
      html += '<span class="tag-chip flex-center" data-nav="tag-' + encodeURIComponent(tag) + '" style="background:' + tc + '15;color:' + tc + ';border-color:' + tc + '40">';
      html += '<span class="tag-chip__icon">' + (ti || '#') + '</span>';
      html += '<span class="tag-chip__name">' + tag + '</span>';
      html += '<span class="tag-chip__count">' + teasList.length + '</span>';
      html += '</span>';
    });
    html += '</div></div>';
  });

  return html;
}

// 标签结果页
function renderTagResultPage(tag, teas) {
  const bc = [{ label: '标签总览', nav: 'tags' }, { label: '#' + tag }];
  const tc = getAutoTagColor(tag);
  const ti = getTagIcon(tag);
  let html = renderBreadcrumb(bc);
  html += '<h1 class="page-title break-word">' + (ti || '🏷️') + ' #' + tag + '</h1>';
  html += '<p class="page-subtitle break-word">找到 ' + teas.length + ' 个相关茶叶品种</p>';
  html += renderWaterfall(teas, []);
  return html;
}

// 世界茶叶总览页
function renderWorldPage(allTeas) {
  const contGroups = getContinentGroups(allTeas);
  let html = '<h1 class="page-title break-word">🌍 世界茶叶</h1>';
  html += '<p class="page-subtitle break-word">共 ' + allTeas.length + ' 个茶叶品种，分布在 ' + Object.keys(contGroups).length + ' 个大洲</p>';
  const contOrder = ['亚洲', '欧洲', '非洲', '南美洲', '北美洲', '大洋洲'];

  contOrder.forEach(cont => {
    if (!contGroups[cont]) return;
    const contColor = continentColors[cont] || '#8B4513';
    const contIcon = continentIcons[cont] || '🌏';
    const countryCount = Object.keys(contGroups[cont].countries).length;
    html += '<div class="section-group">';
    html += '<div class="section-group__header clickable" data-nav="continent-' + encodeURIComponent(cont) + '" style="border-left:3px solid ' + contColor + '">';
    html += '<span class="section-group__header-label">' + contIcon + ' ' + cont + '</span>';
    html += '<span class="section-group__header-count">' + contGroups[cont].count + ' 种 · ' + countryCount + ' 国</span>';
    html += '<span class="section-group__header-arrow">→</span>';
    html += '</div>';
    html += '<div class="category__grid">';
    Object.keys(contGroups[cont].countries).forEach(country => {
      const cIcon = countryIcons[country] || '🌍';
      html += '<div class="category-card" data-nav="' + (country === '中国' ? 'china' : 'country-' + encodeURIComponent(country)) + '" style="border-top:3px solid ' + contColor + '">';
      html += '<div class="category-card__icon" style="font-size:1.8rem;">' + cIcon + '</div>';
      html += '<div class="category-card__name break-word">' + country + '</div>';
      html += '<div class="category-card__count break-word">' + contGroups[cont].countries[country] + ' 个品种</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  return html;
}

// 搜索页
function renderSearchPage(query, teas, routes, teahouses) {
  let html = '<h1 class="page-title break-word">🔍 搜索茶谱</h1>';
  html += '<p class="page-subtitle break-word">搜索茶叶品种、产地、标签、古道、茶馆...</p>';
  html += '<div class="search__form">';
  html += '<input type="text" id="search-page-input" placeholder="输入关键词搜索..." value="' + escHtml(query) + '" autocomplete="off">';
  html += '<button id="search-page-btn">🔍 搜索</button>';
  html += '</div>';
  // 实时建议面板
  html += '<div class="search__suggestions" id="search__suggestions"></div>';

  if (query) {
    teahouses = teahouses || [];
    const total = teas.length + (routes || []).length + teahouses.length;
    if (total === 0) {
      html += '<p style="text-align:center;color:var(--text-muted);padding:32px;">未找到匹配的结果，请尝试其他关键词</p>';
    } else {
      if (teas.length > 0) {
        html += '<div class="search-results-section">';
        html += '<div class="search-results-section__heading">🍵 茶叶品种 <span class="search-results-section__count">' + teas.length + ' 个结果</span></div>';
        html += renderWaterfall(teas, [], query);
        html += '</div>';
      }
      if (routes.length > 0) {
        html += '<div class="search-results-section">';
        html += '<div class="search-results-section__heading">🛤️ 茶叶之路 <span class="search-results-section__count">' + routes.length + ' 个结果</span></div>';
        html += '<div class="category__grid">';
        routes.forEach(route => {
          const rc = route.color || '#8B4513';
          html += '<div class="category-card search__match-card" data-nav="route-' + route.id + '" style="border-top:3px solid ' + rc + '">';
          html += '<div class="category-card__icon" style="font-size:1.8rem;">' + (route.imageIcon || '🛤️') + '</div>';
          html += '<div class="category-card__name break-word">' + route.name + '</div>';
          html += '<div class="category-card__subtitle break-word">' + route.subtitle + '</div>';
          if (route._matches) {
            html += '<div class="map__desc">' + formatMatchDesc(route._matches) + '</div>';
            html += formatMatchSnippet(route._matches);
          }
          html += '</div>';
        });
        html += '</div></div>';
      }
      if (teahouses.length > 0) {
        html += '<div class="search-results-section">';
        html += '<div class="search-results-section__heading">🏠 世界茶馆 <span class="search-results-section__count">' + teahouses.length + ' 个结果</span></div>';
        html += '<div class="category__grid">';
        teahouses.forEach(th => {
          const tcol = th.color || '#8B4513';
          html += '<div class="category-card search__match-card" data-nav="teahouse-' + th.id + '" style="border-top:3px solid ' + tcol + '">';
          html += '<div class="category-card__icon" style="font-size:1.8rem;">' + (th.imageIcon || '🏠') + '</div>';
          html += '<div class="category-card__name break-word">' + th.name + '</div>';
          html += '<div class="category-card__subtitle break-word">' + th.country + ' · ' + th.city + '</div>';
          if (th._matches) {
            html += '<div class="map__desc">' + formatMatchDesc(th._matches) + '</div>';
            html += formatMatchSnippet(th._matches);
          }
          html += '</div>';
        });
        html += '</div></div>';
      }
    }
  }
  return html;
}

// ── 实时搜索建议 ──
let _suggestDebounce = null;
let _suggestClickHandler = null;

function renderSuggestions(teas, routes, teahouses, q) {
  const panel = document.getElementById('search__suggestions');
  if (!panel) return;

  if (!q || q.trim().length < 1) {
    panel.className = 'search__suggestions';
    setHTML(panel, '');
    return;
  }

  const ql = q.toLowerCase();
  const MAX_PER = 5; // 每类最多显示条数

  // 茶叶
  const teaFieldDefs = [...SEARCH_TEA_FIELDS_BASE, _searchTagsField(q, ql)];
  const scoredTeas = searchAndSort(teas, q, ql, teaFieldDefs).slice(0, MAX_PER);

  // 茶路
  const scoredRoutes = searchAndSort(routes, q, ql, SEARCH_ROUTE_FIELDS).slice(0, MAX_PER);

  // 茶馆
  const thFieldDefs = [...SEARCH_TH_FIELDS_BASE, _searchTagsField(q, ql)];
  const scoredTeahouses = searchAndSort(teahouses, q, ql, thFieldDefs).slice(0, MAX_PER);

  const total = scoredTeas.length + scoredRoutes.length + scoredTeahouses.length;
  if (total === 0) {
    panel.className = 'search__suggestions';
    setHTML(panel, '');
    return;
  }

  let html = '';
  if (scoredTeas.length > 0) {
    html += '<div class="search__suggestions-section">🍵 茶叶</div>';
    scoredTeas.forEach(s => {
      html += '<div class="search__suggestions-item flex-center" data-nav="tea-' + s.item.id + '">';
      html += '<span class="search__suggestions-icon">' + (s.item.imageIcon || '🍵') + '</span>';
      html += '<div class="search__suggestions-info"><div class="search__suggestions-name">' + s.item.name + '</div>';
      html += '<div class="ss-sub">' + s.item.category + ' · ' + s.item.country + (s.item.province ? ' · ' + s.item.province : '') + '</div></div>';
      html += '<div class="ss-matches">' + s.matches.slice(0, 2).map(m => '<span class="map__tag">' + m.label + '</span>').join('') + '</div>';
      html += '</div>';
    });
  }
  if (scoredRoutes.length > 0) {
    html += '<div class="search__suggestions-section">🛤️ 茶路</div>';
    scoredRoutes.forEach(s => {
      html += '<div class="search__suggestions-item flex-center" data-nav="route-' + s.item.id + '">';
      html += '<span class="search__suggestions-icon">' + (s.item.imageIcon || '🛤️') + '</span>';
      html += '<div class="search__suggestions-info"><div class="search__suggestions-name">' + s.item.name + '</div>';
      html += '<div class="ss-sub">' + (s.item.subtitle || '') + '</div></div>';
      html += '<div class="ss-matches">' + s.matches.slice(0, 2).map(m => '<span class="map__tag">' + m.label + '</span>').join('') + '</div>';
      html += '</div>';
    });
  }
  if (scoredTeahouses.length > 0) {
    html += '<div class="search__suggestions-section">🏠 茶馆</div>';
    scoredTeahouses.forEach(s => {
      html += '<div class="search__suggestions-item flex-center" data-nav="teahouse-' + s.item.id + '">';
      html += '<span class="search__suggestions-icon">' + (s.item.imageIcon || '🏠') + '</span>';
      html += '<div class="search__suggestions-info"><div class="search__suggestions-name">' + s.item.name + '</div>';
      html += '<div class="ss-sub">' + s.item.country + ' · ' + s.item.city + '</div></div>';
      html += '<div class="ss-matches">' + s.matches.slice(0, 2).map(m => '<span class="map__tag">' + m.label + '</span>').join('') + '</div>';
      html += '</div>';
    });
  }
  // 底部"查看全部"链接
  html += '<div class="search__suggestions-more" id="ss-view-all">查看全部 ' + (scoredTeas.length + scoredRoutes.length + scoredTeahouses.length) + '+ 个结果 →</div>';

  setHTML(panel, html);
  panel.className = 'search__suggestions active';
}

function setupSearchSuggestions(allTeas, allRoutes, allTeahouses) {
  const input = document.getElementById('search-page-input');
  if (!input) return;

  // 移除旧的监听器（通过克隆替换）
  const newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);

  newInput.addEventListener('input', () => {
    const q = newInput.value;
    clearTimeout(_suggestDebounce);
    _suggestDebounce = setTimeout(() => {
      renderSuggestions(allTeas, allRoutes, allTeahouses, q);
    }, 150);
  });

  // 聚焦时也显示建议
  newInput.addEventListener('focus', () => {
    if (newInput.value.trim()) {
      renderSuggestions(allTeas, allRoutes, allTeahouses, newInput.value);
    }
  });

  // 点击建议面板
  const panel = document.getElementById('search__suggestions');
  if (panel) {
    panel.addEventListener('click', e => {
      const item = e.target.closest('.search__suggestions-item');
      if (item) {
        const nav = item.getAttribute('data-nav');
        if (nav) {
          panel.className = 'search__suggestions';
          const parts = nav.split('-');
          const page = parts[0];
          const id = parts.slice(1).join('-');
          router.navigate({ page, id });
        }
        return;
      }
      if (e.target.id === 'ss-view-all') {
        const q = newInput.value.trim();
        if (q) {
          panel.className = 'search__suggestions';
          router.navigate({ page: 'search', q });
        }
      }
    });
  }

  // 点击外部关闭建议（先移除旧的监听器避免泄漏）
  if (_suggestClickHandler) {
    document.removeEventListener('click', _suggestClickHandler);
  }
  _suggestClickHandler = e => {
    if (panel && !panel.contains(e.target) && e.target !== newInput) {
      panel.className = 'search__suggestions';
    }
  };
  document.addEventListener('click', _suggestClickHandler);
}

// 主导出函数 —— 处理所有茶叶相关路由
export async function handleTeaRoutes(params, main) {
  const page = params.page;
  const id = params.id;
  const q = params.q;

  const allTeas = await dataLoader.getAllTeas();
  let routes, teahouses;

  switch (page) {
    case 'china': {
      const chinaTeas = allTeas.filter(t => t.country === '中国');
      setHTML(main, renderCountryPage('中国', chinaTeas));
      break;
    }
    case 'world': {
      setHTML(main, renderWorldPage(allTeas));
      break;
    }
    case 'continent': {
      const contTeas = allTeas.filter(t => t.continent === id);
      setHTML(main, renderContinentPage(id, contTeas));
      break;
    }
    case 'country': {
      const countryTeas = allTeas.filter(t => t.country === id);
      setHTML(main, renderCountryPage(id, countryTeas));
      break;
    }
    case 'province': {
      const provTeas = allTeas.filter(t => t.province === id);
      setHTML(main, renderProvincePage(id, provTeas));
      break;
    }
    case 'city': {
      const cityTeas = allTeas.filter(t => t.city === id);
      setHTML(main, renderCityPage(id, cityTeas));
      break;
    }
    case 'district': {
      const distTeas = allTeas.filter(t => t.district === id || t.city === id);
      setHTML(main, renderDistrictPage(id, distTeas));
      break;
    }
    case 'varieties': {
      const categories = await dataLoader.getCategoryGroups();
      setHTML(main, renderVarietiesMenu(categories));
      break;
    }
    case 'category': {
      const categories = await dataLoader.getCategoryGroups();
      const catTeas = categories[id] || [];
      setHTML(main, renderCategoryPage(id, catTeas));
      break;
    }
    case 'subcategory': {
      const subCatTeas = allTeas.filter(t => getSubCategories(t).includes(id));
      setHTML(main, renderSubCategoryPage(id, subCatTeas));
      break;
    }
    case 'tea': {
      const tea = allTeas.find(t => t.id === id);
      if (tea) {
        setHTML(main, renderTeaDetail(tea));
      } else {
        setHTML(main, '<p style="text-align:center;padding:32px;">未找到该茶叶品种</p>');
      }
      break;
    }
    case 'tags': {
      const tagMap = await dataLoader.getTagMap();
      setHTML(main, renderTagsPage(tagMap));
      break;
    }
    case 'tag': {
      const tagMap = await dataLoader.getTagMap();
      const tagTeas = tagMap[id] || [];
      setHTML(main, renderTagResultPage(id, tagTeas));
      break;
    }
    case 'search': {
      // 始终预加载数据以支持实时搜索建议
      routes = await dataLoader.getAllRoutes();
      teahouses = await dataLoader.getAllTeahouses();

      let searchTeas = [];
      let searchRoutes = [];
      let searchTeahouses = [];
      if (q) {
        const ql = q.toLowerCase();
        searchTeas = searchAndSort(allTeas, q, ql, [...SEARCH_TEA_FIELDS_BASE, _searchTagsField(q, ql)]).map(s => ({ ...s.item, _score: s.score, _matches: s.matches, _query: q }));

        searchRoutes = searchAndSort(routes, q, ql, SEARCH_ROUTE_FIELDS).map(s => ({ ...s.item, _score: s.score, _matches: s.matches }));

        searchTeahouses = searchAndSort(teahouses, q, ql, [...SEARCH_TH_FIELDS_BASE, _searchTagsField(q, ql)]).map(s => ({ ...s.item, _score: s.score, _matches: s.matches }));
      }
      setHTML(main, renderSearchPage(q || '', searchTeas, searchRoutes, searchTeahouses));
      // 绑定实时搜索建议
      setupSearchSuggestions(allTeas, routes, teahouses);
      break;
    }
    default: {
      // 尝试作为茶叶 ID 直接查找
      const tea = allTeas.find(t => t.id === page);
      if (tea) {
        setHTML(main, renderTeaDetail(tea));
      }
      break;
    }
  }
}