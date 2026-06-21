// 茶馆相关页面
import { setHTML, getAutoTagColor } from './utils.js';
import { continentIcons, continentColors, countryIcons, countryColors, provinceIcons } from './config.js';
import dataLoader from './data-loader.js';
import { renderBreadcrumb, renderWaterfall, processTeaPlaceholders } from './components.js';

// 茶馆列表
function renderTeahousesList(teahouses) {
  let html = '<h1 class="page-title break-word">🏠 世界茶馆</h1>';
  html += '<p class="page-subtitle break-word">探索全球最著名的品茶圣地——从东方茶楼到西方茶室</p>';

  const continentGroups = {};
  teahouses.forEach(th => {
    const c = th.continent || '其他';
    if (!continentGroups[c]) continentGroups[c] = [];
    continentGroups[c].push(th);
  });

  const order = ['亚洲', '欧洲', '非洲', '南美洲', '北美洲', '大洋洲', '跨洲际', '其他'];
  order.forEach(cont => {
    const group = continentGroups[cont];
    if (!group || group.length === 0) return;
    const contIcon = continentIcons[cont] || '🌐';
    const contColor = continentColors[cont] || '#555';

    const countryMap = {};
    group.forEach(th => {
      const cty = th.country || '其他';
      if (!countryMap[cty]) countryMap[cty] = 0;
      countryMap[cty]++;
    });
    const countryKeys = Object.keys(countryMap).sort();

    html += '<div class="section-group">';
    html += '<div class="section-group__header" style="border-left:3px solid ' + contColor + '">';
    html += '<span class="section-group__header-label">' + contIcon + ' ' + cont + '</span>';
    html += '<span class="section-group__header-count">' + group.length + ' 家茶馆 · ' + countryKeys.length + ' 个国家</span>';
    html += '</div>';
    html += '<div class="category__grid">';
    countryKeys.forEach(cty => {
      const cIcon = countryIcons[cty] || contIcon;
      html += '<div class="category-card" data-nav="teahouses-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + contColor + '">';
      html += '<div class="category-card__icon" style="font-size:1.8rem;">' + cIcon + '</div>';
      html += '<div class="category-card__name break-word">' + cty + '</div>';
      html += '<div class="category-card__count break-word">' + countryMap[cty] + ' 家茶馆</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  return html;
}

// 茶馆大洲页
function renderTeahousesContinentPage(continent, teahouses) {
  const icon = continentIcons[continent] || '🌐';
  const color = continentColors[continent] || '#555';

  const countryGroups = {};
  teahouses.forEach(th => {
    const cty = th.country || '其他';
    if (!countryGroups[cty]) countryGroups[cty] = [];
    countryGroups[cty].push(th);
  });

  let html = renderBreadcrumb([{ label: '世界茶馆', nav: 'teahouses' }, { label: continent }]);
  html += '<h1 class="page-title break-word">' + icon + ' ' + continent + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + teahouses.length + ' 家茶馆，分布在 ' + Object.keys(countryGroups).length + ' 个国家</p>';
  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + color + '">';
  html += '<span class="section-group__header-label">🌍 国家/地区</span>';
  html += '<span class="section-group__header-count">' + Object.keys(countryGroups).length + ' 个国家</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  Object.keys(countryGroups).forEach(cty => {
    const cIcon = countryIcons[cty] || icon;
    html += '<div class="category-card" data-nav="teahouses-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + color + '">';
    html += '<div class="category-card__icon" style="font-size:1.8rem;">' + cIcon + '</div>';
    html += '<div class="category-card__name break-word">' + cty + '</div>';
    html += '<div class="category-card__count break-word">' + countryGroups[cty].length + ' 家茶馆</div>';
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

// 茶馆国家页
function renderTeahousesCountryPage(country, teahouses) {
  const icon = countryIcons[country] || '🌍';
  const color = countryColors[country] || '#8B4513';
  const continent = teahouses[0] ? teahouses[0].continent : '';

  const provGroups = {};
  teahouses.forEach(th => {
    const p = th.province || th.country;
    if (!provGroups[p]) provGroups[p] = { teahouses: [], cities: {} };
    provGroups[p].teahouses.push(th);
    const c = th.city || '其他';
    provGroups[p].cities[c] = true;
  });
  const provKeys = Object.keys(provGroups).sort();

  let html = renderBreadcrumb([
    { label: '世界茶馆', nav: 'teahouses' },
    continent ? { label: continent, nav: 'teahouses-continent-' + encodeURIComponent(continent) } : null,
    { label: country }
  ].filter(Boolean));
  html += '<h1 class="page-title break-word">' + icon + ' ' + country + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + provKeys.length + ' 个省/地区，' + teahouses.length + ' 家茶馆</p>';

  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + color + '">';
  html += '<span class="section-group__header-label">🏞️ 省/地区</span>';
  html += '<span class="section-group__header-count">' + provKeys.length + ' 个</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  provKeys.forEach(prov => {
    const pIcon = provinceIcons[prov] || '🏞️';
    html += '<div class="category-card" data-nav="teahouses-province-' + encodeURIComponent(prov) + '" style="border-top:3px solid ' + color + '">';
    html += '<div class="category-card__icon" style="font-size:1.8rem;">' + pIcon + '</div>';
    html += '<div class="category-card__name break-word">' + prov + '</div>';
    html += '<div class="category-card__count break-word">' + provGroups[prov].teahouses.length + ' 家茶馆</div>';
    html += '</div>';
  });
  html += '</div></div>';

  provKeys.forEach(prov => {
    const provData = provGroups[prov];
    const cityKeys = Object.keys(provData.cities).sort();
    html += '<div class="section-group">';
    html += '<div class="section-group__header clickable" data-nav="teahouses-province-' + encodeURIComponent(prov) + '" style="border-left:3px solid ' + color + '">';
    html += '<span class="section-group__header-label">🏞️ ' + prov + '</span>';
    html += '<span class="section-group__header-count">' + cityKeys.length + ' 个城市 · ' + provData.teahouses.length + ' 家茶馆</span>';
    html += '<span class="section-group__header-arrow">→</span>';
    html += '</div>';
    html += '<div class="category__grid">';
    cityKeys.forEach(city => {
      const cityCount = provData.teahouses.filter(th => th.city === city).length;
      html += '<div class="category-card" data-nav="teahouses-city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + color + '">';
      html += '<div class="category-card__icon" style="font-size:1.5rem;">🏙️</div>';
      html += '<div class="category-card__name break-word">' + city + '</div>';
      html += '<div class="category-card__count break-word">' + cityCount + ' 家茶馆</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  return html;
}

// 茶馆省份页
function renderTeahousesProvincePage(province, teahouses) {
  const first = teahouses[0];
  const continent = first ? first.continent : '';
  const country = first ? first.country : '';
  const pIcon = provinceIcons[province] || '🏞️';
  const color = countryColors[country] || '#8B4513';

  const cityGroups = {};
  teahouses.forEach(th => {
    const c = th.city || '其他';
    if (!cityGroups[c]) cityGroups[c] = [];
    cityGroups[c].push(th);
  });
  const cityKeys = Object.keys(cityGroups).sort();

  let html = renderBreadcrumb([
    { label: '世界茶馆', nav: 'teahouses' },
    continent ? { label: continent, nav: 'teahouses-continent-' + encodeURIComponent(continent) } : null,
    country ? { label: country, nav: 'teahouses-country-' + encodeURIComponent(country) } : null,
    { label: province }
  ].filter(Boolean));
  html += '<h1 class="page-title break-word">' + pIcon + ' ' + province + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + cityKeys.length + ' 个城市，' + teahouses.length + ' 家茶馆</p>';

  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + color + '">';
  html += '<span class="section-group__header-label">🏙️ 城市</span>';
  html += '<span class="section-group__header-count">' + cityKeys.length + ' 个</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  cityKeys.forEach(city => {
    html += '<div class="category-card" data-nav="teahouses-city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + color + '">';
    html += '<div class="category-card__icon" style="font-size:1.5rem;">🏙️</div>';
    html += '<div class="category-card__name break-word">' + city + '</div>';
    html += '<div class="category-card__count break-word">' + cityGroups[city].length + ' 家茶馆</div>';
    html += '</div>';
  });
  html += '</div></div>';

  cityKeys.forEach(city => {
    const cityThs = cityGroups[city];
    html += '<div class="section-group">';
    html += '<div class="section-group__header clickable" data-nav="teahouses-city-' + encodeURIComponent(city) + '" style="border-left:3px solid ' + color + '">';
    html += '<span class="section-group__header-label">🏙️ ' + city + '</span>';
    html += '<span class="section-group__header-count">' + cityThs.length + ' 家茶馆</span>';
    html += '<span class="section-group__header-arrow">→</span>';
    html += '</div>';
    html += '<div class="category__grid">';
    cityThs.forEach(th => {
      const tcol = th.color || '#8B4513';
      html += '<div class="category-card" data-nav="teahouse-' + th.id + '" style="border-top:3px solid ' + tcol + '">';
      html += '<div class="category-card__icon" style="font-size:1.8rem;">' + (th.imageIcon || '🏠') + '</div>';
      html += '<div class="category-card__name break-word">' + th.name + '</div>';
      html += '<div class="category-card__subtitle break-word">' + th.country + ' · ' + th.city + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  return html;
}

// 茶馆城市页
function renderTeahousesCityPage(city, teahouses) {
  const first = teahouses[0];
  const color = (first && first.color) || '#8B4513';
  const continent = first ? first.continent : '';
  const country = first ? first.country : '';
  const province = first ? first.province : '';

  let html = renderBreadcrumb([
    { label: '世界茶馆', nav: 'teahouses' },
    continent ? { label: continent, nav: 'teahouses-continent-' + encodeURIComponent(continent) } : null,
    country ? { label: country, nav: 'teahouses-country-' + encodeURIComponent(country) } : null,
    province ? { label: province, nav: 'teahouses-province-' + encodeURIComponent(province) } : null,
    { label: city }
  ].filter(Boolean));
  html += '<h1 class="page-title break-word">🏙️ ' + city + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + teahouses.length + ' 家茶馆</p>';
  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + color + '">';
  html += '<span class="section-group__header-label">🏠 茶馆</span>';
  html += '<span class="section-group__header-count">' + teahouses.length + ' 家</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  teahouses.forEach(th => {
    const tcol = th.color || '#8B4513';
    html += '<div class="category-card" data-nav="teahouse-' + th.id + '" style="border-top:3px solid ' + tcol + '">';
    html += '<div class="category-card__icon" style="font-size:1.8rem;">' + (th.imageIcon || '🏠') + '</div>';
    html += '<div class="category-card__name break-word">' + th.name + '</div>';
    html += '<div class="category-card__subtitle break-word">' + th.country + ' · ' + th.city + '</div>';
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

// 茶馆详情页
function renderTeahouseDetail(th, relatedTeas) {
  const teaMap = {};
  (relatedTeas || []).forEach(t => { teaMap[t.id] = t; });
  const bc = [
    { label: '世界茶馆', nav: 'teahouses' },
    th.continent ? { label: th.continent, nav: 'teahouses-continent-' + encodeURIComponent(th.continent) } : null,
    th.country ? { label: th.country, nav: 'teahouses-country-' + encodeURIComponent(th.country) } : null,
    th.province ? { label: th.province, nav: 'teahouses-province-' + encodeURIComponent(th.province) } : null,
    th.city ? { label: th.city, nav: 'teahouses-city-' + encodeURIComponent(th.city) } : null,
    { label: th.name }
  ].filter(Boolean);
  const tcol = th.color || '#8B4513';
  let html = renderBreadcrumb(bc);
  html += '<div class="teahouse-detail">';
  html += '<div class="route-detail-header">';
  html += '<div class="route-detail-header__icon">' + (th.imageIcon || '🏠') + '</div>';
  html += '<h1 class="route-detail-header__name break-word">' + th.name + '</h1>';
  if (th.nameEn) html += '<div class="route-detail-header__subtitle break-word">' + th.nameEn + '</div>';
  html += '</div>';

  html += '<div class="route-detail__info-grid">';
  if (th.description) {
    html += '<div class="route-info-card route-info-full"><div class="route-info-card__label">📋 概述</div><div class="route-info-card__text break-word">' + processTeaPlaceholders(th.description, teaMap) + '</div></div>';
  }

  if (th.address) {
    const addrText = th.country + ' · ' + th.city + ' · ' + th.address;
    const mapSearchAddr = encodeURIComponent(addrText);
    html += '<div class="route-info-card">';
    html += '<div class="route-info-card__label">📍 地址</div>';
    html += '<div class="route-info-card__text break-word" style="margin-bottom:6px;">' + addrText + '</div>';
    html += '<div class="route-info-card__links">';
    html += '<a class="route-info-card__link-btn route-info-card__link--amap" href="https://uri.amap.com/search?keyword=' + mapSearchAddr + '" target="_blank" rel="noopener">🗺️ 高德地图</a>';
    html += '<a class="route-info-card__link-btn route-info-card__link--google" href="https://www.google.com/maps/search/' + mapSearchAddr + '" target="_blank" rel="noopener">🌍 Google 地图</a>';
    html += '</div>';
    html += '</div>';
  }
  if (th.style) html += '<div class="route-info-card"><div class="route-info-card__label">🏛️ 风格</div><div class="route-info-card__text break-word">' + th.style + '</div></div>';
  if (th.established) html += '<div class="route-info-card"><div class="route-info-card__label">📅 创立</div><div class="route-info-card__text break-word">' + th.established + '</div></div>';
  if (th.specialty) html += '<div class="route-info-card"><div class="route-info-card__label">🍵 特色茶品</div><div class="route-info-card__text break-word">' + th.specialty + '</div></div>';
  if (th.highlight) html += '<div class="route-info-card"><div class="route-info-card__label">✨ 亮点</div><div class="route-info-card__text break-word">' + th.highlight + '</div></div>';

  const searchName = encodeURIComponent(th.name);
  html += '<div class="route-info-card">';
  html += '<div class="route-info-card__label">📹 视频资料</div>';
  html += '<div class="route-info-card__links">';
  html += '<a class="route-info-card__link-btn route-info-card__link--dy" href="https://www.douyin.com/search/' + searchName + '" target="_blank" rel="noopener">🎵 抖音</a>';
  html += '<a class="route-info-card__link-btn route-info-card__link--bl" href="https://search.bilibili.com/all?keyword=' + searchName + '" target="_blank" rel="noopener">📺 哔哩哔哩</a>';
  html += '<a class="route-info-card__link-btn route-info-card__link--xs" href="https://www.xiaohongshu.com/search_result?keyword=' + searchName + '" target="_blank" rel="noopener">📖 小红书</a>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '<div class="teahouse-detail__body">';

  if (th.chronology && th.chronology.length > 0) {
    html += '<h3 class="teahouse-detail__section-title">📜 历史沿革</h3>';
    html += '<div class="teahouse-detail__timeline">';
    th.chronology.forEach(item => {
      const isTeaCard = !item.period && !item.title && item.content && /^\{\{tea:/.test(item.content);
      if (isTeaCard) {
        html += '<div class="teahouse-detail__tea-card">';
        html += processTeaPlaceholders(item.content, teaMap);
        html += '</div>';
        return;
      }
      html += '<div class="teahouse-detail__timeline-item">';
      html += '<div class="teahouse-detail__timeline-marker"></div>';
      html += '<div class="teahouse-detail__timeline-card">';
      if (item.period) html += '<div class="teahouse-detail__timeline-period break-word">' + item.period + '</div>';
      if (item.title) html += '<div class="teahouse-detail__timeline-title break-word">' + item.title + '</div>';
      html += '<div class="teahouse-detail__timeline-content break-word">' + processTeaPlaceholders(item.content, teaMap) + '</div>';
      html += '</div></div>';
    });
    html += '</div>';
  }

  if (th.tags && th.tags.length > 0) {
    html += '<div class="teahouse-detail__tags-section">';
    html += '<div class="th-tags-title">🏷️ 标签</div>';
    html += '<div class="th-tags">';
    th.tags.forEach(tag => {
      const tc = getAutoTagColor(tag);
      html += '<span class="th-tag" data-nav="tag-' + encodeURIComponent(tag) + '" style="background:' + tc + '20;color:' + tc + ';border:1px solid ' + tc + '40">' + tag + '</span>';
    });
    html += '</div></div>';
  }
  html += '</div></div>';

  if (relatedTeas && relatedTeas.length > 0) {
    html += '<div class="route-detail__related-teas">';
    html += '<h2 class="home__section-title">🍵 相关茶叶品种</h2>';
    html += renderWaterfall(relatedTeas, []);
    html += '</div>';
  }

  html += '<div class="detail-page__disclaimer">⚠️ 免责声明：内容整理自公开信息，不保证准确完整，仅供学习参考，不构成任何建议。</div>';

  return html;
}

// 主导出函数
export async function handleTeahouseRoutes(params, main) {
  const page = params.page;
  const id = params.id;
  const allTeahouses = await dataLoader.getAllTeahouses();

  switch (page) {
    case 'teahouses': {
      setHTML(main, renderTeahousesList(allTeahouses));
      break;
    }
    case 'teahouse': {
      const thData = allTeahouses.find(r => r.id === id);
      if (thData) {
        const allTeas = await dataLoader.getAllTeas();
        const relatedTeas = allTeas.filter(t => (thData.teas || []).includes(t.id));
        setHTML(main, renderTeahouseDetail(thData, relatedTeas));
      } else {
        setHTML(main, '<p style="text-align:center;padding:32px;">未找到该茶馆信息</p>');
      }
      break;
    }
    case 'teahouses-continent': {
      const contTh = allTeahouses.filter(th => th.continent === id);
      setHTML(main, renderTeahousesContinentPage(id, contTh));
      break;
    }
    case 'teahouses-country': {
      const ctyTh = allTeahouses.filter(th => th.country === id);
      setHTML(main, renderTeahousesCountryPage(id, ctyTh));
      break;
    }
    case 'teahouses-city': {
      const cityTh = allTeahouses.filter(th => th.city === id);
      setHTML(main, renderTeahousesCityPage(id, cityTh));
      break;
    }
    case 'teahouses-province': {
      const provTh = allTeahouses.filter(th => th.province === id);
      setHTML(main, renderTeahousesProvincePage(id, provTh));
      break;
    }
    default:
      break;
  }
}