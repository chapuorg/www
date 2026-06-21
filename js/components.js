// 共享 UI 组件渲染函数
import { shuffleStable, escHtml, escRegex, getAutoTagColor, getTagIcon, getTeaColor, getTeaIcon, getRegionIcon, getRegionColor, getSubCategories } from './utils.js';
import { subCategoryIcons, roadColorMap } from './config.js';

// 面包屑导航
export function renderBreadcrumb(items) {
  if (!items || items.length === 0) return '';
  let html = '<nav class="breadcrumb flex-center">';
  html += '<a href="#" data-nav="home">🏠 首页</a>';
  items.forEach((item, i) => {
    html += '<span class="sep">›</span>';
    if (i === items.length - 1) {
      html += '<span class="current">' + item.label + '</span>';
    } else {
      html += '<a href="#" data-nav="' + item.nav + '">' + item.label + '</a>';
    }
  });
  html += '</nav>';
  return html;
}

// 高亮文本中的搜索词
function highlightText(text, query) {
  if (!query) return escHtml(text);
  const escaped = escHtml(text);
  const re = new RegExp('(' + escRegex(escHtml(query)) + ')', 'gi');
  return escaped.replace(re, '<mark>$1</mark>');
}

// 瀑布流卡片
export function renderWaterfall(teas, breadcrumbItems, searchQuery) {
  const sorted = shuffleStable(teas);
  const parts = [renderBreadcrumb(breadcrumbItems || [])];
  parts.push('<div class="waterfall">');
  const barColors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#16a085', '#2980b9', '#8e44ad', '#e84393', '#d4a017', '#00bcd4'];

  sorted.forEach((tea, idx) => {
    const catColor = getTeaColor(tea);
    const regIcon = getRegionIcon(tea);
    const barColor = barColors[idx % barColors.length];
    const q = searchQuery || (tea._query || '');

    parts.push('<div class="waterfall__item" data-tea-id="' + tea.id + '" style="--bar:' + barColor + '">');
    parts.push('<div class="waterfall__item-header flex-center">');
    parts.push('<span class="waterfall__item-cat-dot" style="background:' + catColor + '"></span>');
    parts.push('<span class="waterfall__item-name" title="' + escHtml(tea.name) + '">' + highlightText(tea.name, q) + '</span>');
    parts.push('<span class="waterfall__item-cat-tag" style="background:' + catColor + '">' + tea.category + '</span>');
    parts.push('</div>');
    parts.push('<div class="waterfall__item-body">');
    parts.push('<div class="waterfall__item-subtitle">' + tea.nameEn + '</div>');
    parts.push('<div class="waterfall__item-location">' + (regIcon || '📍') + ' ' + highlightText(tea.country + (tea.province ? ' · ' + tea.province : '') + (tea.city ? ' · ' + tea.city : ''), q) + '</div>');
    parts.push('<div class="waterfall__item-desc">' + highlightText(tea.description.substring(0, 100), q) + '…</div>');
    // 搜索匹配信息
    if (tea._matches && tea._matches.length > 0) {
      const labels = tea._matches.slice(0, 3).map(m => '<span class="map__tag">' + m.label + '</span>').join('');
      const more = tea._matches.length > 3 ? '<span class="map__tag">+' + (tea._matches.length - 3) + '</span>' : '';
      parts.push('<div class="waterfall__item-match"><div class="waterfall__item-match-labels">' + labels + more + '</div>');
      // 显示第一个有 snippet 的匹配片段
      const firstSnippet = tea._matches.find(m => m.snippet);
      if (firstSnippet) {
        parts.push('<div class="waterfall__item-match-snippet break-word">' + firstSnippet.snippet + '</div>');
      }
      parts.push('</div>');
    }
    parts.push('</div>');
    parts.push('<div class="waterfall__item-tags">');
    (tea.tags || []).slice(0, 3).forEach(tag => {
      const tc = getAutoTagColor(tag);
      const ti = getTagIcon(tag);
      parts.push('<span class="waterfall__item-tag" style="background:' + tc + '18;color:' + tc + ';border-color:' + tc + '33">' + (ti || '') + ' ' + tag + '</span>');
    });
    parts.push('</div></div>');
  });
  parts.push('</div>');
  return parts.join('');
}

// 茶叶详情页
export function renderTeaDetail(tea) {
  const catColor = getTeaColor(tea);
  const regColor = getRegionColor(tea);
  const regIcon = getRegionIcon(tea);

  const bc = [];
  if (tea.continent) bc.push({ label: tea.continent, nav: 'continent-' + encodeURIComponent(tea.continent) });
  bc.push({ label: tea.country, nav: tea.country === '中国' ? 'china' : 'country-' + encodeURIComponent(tea.country) });
  if (tea.province) bc.push({ label: tea.province, nav: 'province-' + encodeURIComponent(tea.province) });
  if (tea.city) bc.push({ label: tea.city, nav: 'city-' + encodeURIComponent(tea.city) });
  if (tea.district) bc.push({ label: tea.district, nav: 'district-' + encodeURIComponent(tea.district) });
  bc.push({ label: tea.name });

  const parts = [renderBreadcrumb(bc)];
  parts.push('<div class="detail-page">');
  parts.push('<div class="detail-page__header">');
  parts.push('<h1 class="detail-page__name">' + tea.name + '</h1>');
  parts.push('<div class="detail-page__name-en">' + tea.nameEn + '</div>');
  parts.push('<div class="detail-page__meta">');
  parts.push('<a class="detail-page__cat-tag flex-center" data-nav="category-' + encodeURIComponent(tea.category) + '" style="background:' + catColor + '">' + tea.category + '</a>');
  const subs = getSubCategories(tea);
  subs.forEach(sub => {
    if (sub === tea.category) return;
    const subIcon = subCategoryIcons[sub] || '';
    parts.push('<a class="detail-page__sub-tag" data-nav="subcategory-' + encodeURIComponent(sub) + '" style="border:1px solid ' + catColor + ';color:' + catColor + '">' + subIcon + ' ' + sub + '</a>');
  });
  parts.push('<span class="detail-page__loc-text">' + (regIcon || '📍') + ' ');
  if (tea.continent) parts.push('<a data-nav="continent-' + encodeURIComponent(tea.continent) + '">' + tea.continent + '</a> · ');
  parts.push('<a data-nav="' + (tea.country === '中国' ? 'china' : 'country-' + encodeURIComponent(tea.country)) + '">' + tea.country + '</a>');
  if (tea.province) parts.push(' · <a data-nav="province-' + encodeURIComponent(tea.province) + '">' + tea.province + '</a>');
  if (tea.city) parts.push(' · <a data-nav="city-' + encodeURIComponent(tea.city) + '">' + tea.city + '</a>');
  if (tea.district) parts.push(' · <a data-nav="district-' + encodeURIComponent(tea.district) + '">' + tea.district + '</a>');
  parts.push('</span></div></div>');

  parts.push('<div class="detail-page__section" style="border-left:3px solid ' + catColor + '">');
  parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">✨</span> 特色介绍</div>');
  parts.push('<p>' + escHtml(tea.description || '') + '</p></div>');

  if (tea.chronology && tea.chronology.length > 0) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid ' + regColor + '">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">📜</span> 历史沿革</div>');
    parts.push('<div class="teahouse-detail__timeline">');
    tea.chronology.forEach(item => {
      parts.push('<div class="teahouse-detail__timeline-item">');
      parts.push('<div class="teahouse-detail__timeline-marker"></div>');
      parts.push('<div class="teahouse-detail__timeline-card">');
      if (item.period) parts.push('<div class="teahouse-detail__timeline-period break-word">' + item.period + '</div>');
      if (item.title) parts.push('<div class="teahouse-detail__timeline-title break-word">' + item.title + '</div>');
      parts.push('<div class="teahouse-detail__timeline-content break-word">' + item.content + '</div>');
      parts.push('</div></div>');
    });
    parts.push('</div></div>');
    if (tea.historyDetail) {
      parts.push('<div class="detail-page__section" style="border-left:3px solid ' + regColor + '">');
      parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">📖</span> 详细历史</div>');
      parts.push('<p>' + tea.historyDetail + '</p></div>');
    }
  } else if (tea.historyDetail) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid ' + regColor + '">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">📖</span> 详细历史</div>');
    parts.push('<p>' + tea.historyDetail + '</p></div>');
  } else {
    parts.push('<div class="detail-page__section" style="border-left:3px solid ' + regColor + '">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">📜</span> 历史文化</div>');
    parts.push('<p>' + escHtml(tea.history || '') + '</p></div>');
  }

  if (tea.legends) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid #e84393">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">📚</span> 传说故事</div>');
    parts.push('<p>' + tea.legends + '</p></div>');
  }

  if (tea.originDetail) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid #16a085">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">🏔️</span> 产地详情</div>');
    parts.push('<p>' + tea.originDetail + '</p></div>');
  }

  if (tea.cultivars) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid #27ae60">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">🌱</span> 茶树品种</div>');
    parts.push('<p>' + tea.cultivars + '</p></div>');
  }

  if (tea.production) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid #e67e22">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">🔧</span> 制作工艺</div>');
    parts.push('<p>' + tea.production + '</p></div>');
  }

  if (tea.grades) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid #d4a017">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">🏅</span> 品质等级</div>');
    parts.push('<p>' + tea.grades + '</p></div>');
  }

  parts.push('<div class="detail-page__section" style="border-left:3px solid #2980b9">');
  parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">🔬</span> 品种特点</div>');
  parts.push('<p>' + tea.characteristics + '</p></div>');

  if (tea.tags && tea.tags.length > 0) {
    parts.push('<div class="detail-page__section" style="border-left:3px solid #8e44ad">');
    parts.push('<div class="detail-page__section-title flex-center"><span class="detail-page__section-icon">🏷️</span> 相关标签</div>');
    parts.push('<div class="detail-page__tags">');
    tea.tags.forEach(tag => {
      const tc = getAutoTagColor(tag);
      const ti = getTagIcon(tag);
      parts.push('<span class="detail-page__tag" data-nav="tag-' + encodeURIComponent(tag) + '" style="background:' + tc + '14;color:' + tc + ';border-color:' + tc + '33">' + (ti || '#') + ' ' + tag + '</span>');
    });
    parts.push('</div></div>');
  }
  parts.push('<div class="detail-page__disclaimer">⚠️ 免责声明：内容整理自公开信息，不保证准确完整，仅供学习参考，不构成任何建议。</div>');
  parts.push('</div>');
  return parts.join('');
}

// 处理茶路/茶馆描述中的 {{tea:xxx}} 占位符
export function processTeaPlaceholders(text, teaMap) {
  if (!text) return text;
  return text.replace(/\{\{tea:([\w-]+)\}\}/g, (match, teaId) => {
    const tea = teaMap[teaId];
    if (!tea) return '';
    const icon = getTeaIcon(tea);
    const tc = getTeaColor(tea);
    const ri = getRegionIcon(tea);
    return '<div class="route-detail__tea-card flex-center" data-tea-id="' + tea.id + '" style="border-left:3px solid ' + tc + '">' +
      '<div class="rtc-icon">' + icon + '</div>' +
      '<div class="rtc-info">' +
      '<div class="rtc-name">' + tea.name + ' <span class="rtc-cat" style="background:' + tc + '">' + tea.category + '</span></div>' +
      '<div class="rtc-loc">' + (ri || '📍') + ' ' + tea.country + (tea.province ? ' · ' + tea.province : '') + (tea.city ? ' · ' + tea.city : '') + '</div>' +
      '<div class="rtc-desc">' + tea.description.substring(0, 80) + '…</div>' +
      '</div></div>';
  });
}

// 高程图渲染
export function renderElevationChart(stations, roadLegend, routeColor) {
  const W = 620, H = 240;
  const pad = { t: 14, r: 10, b: 66, l: 44 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const n = stations.length;

  let maxAlt = -Infinity, minAlt = Infinity;
  for (let i = 0; i < n; i++) {
    maxAlt = Math.max(maxAlt, stations[i].alt);
    minAlt = Math.min(minAlt, stations[i].alt);
  }
  let altR = maxAlt - minAlt || 500;
  minAlt = Math.floor(minAlt / 200) * 200;
  maxAlt = Math.ceil(maxAlt / 200) * 200;
  altR = maxAlt - minAlt;

  const maxKm = stations[n - 1].distKm;
  const x = d => pad.l + (d / maxKm) * iW;
  const y = a => pad.t + iH - ((a - minAlt) / altR) * iH;

  const parts = ['<div class="elevation-container">'];
  parts.push('<svg viewBox="0 0 ' + W + ' ' + H + '" class="elevation-chart">');

  const clipperId = 'clip-' + Math.random().toString(36).slice(2, 8);
  parts.push('<defs><clipPath id="' + clipperId + '"><rect x="' + pad.l + '" y="' + pad.t + '" width="' + iW + '" height="' + iH + '"/></clipPath></defs>');

  for (let g = 0; g <= 4; g++) {
    const ay = pad.t + (g / 4) * iH;
    const av = Math.round(maxAlt - (g / 4) * altR);
    parts.push('<line x1="' + pad.l + '" y1="' + ay + '" x2="' + (W - pad.r) + '" y2="' + ay + '" stroke="#e0e0e0" stroke-dasharray="3,3"/>');
    parts.push('<text x="' + (pad.l - 5) + '" y="' + (ay + 4) + '" text-anchor="end" font-size="9" fill="#999">' + av + 'm</text>');
  }

  const baseline = pad.t + iH;
  parts.push('<g clip-path="url(#' + clipperId + ')">');
  for (let i = 0; i < n - 1; i++) {
    const sx = x(stations[i].distKm), sy = y(stations[i].alt);
    const ex = x(stations[i + 1].distKm), ey = y(stations[i + 1].alt);
    const rcol = roadColorMap[stations[i + 1].road] || routeColor;

    parts.push('<polygon points="' + sx + ',' + sy + ' ' + ex + ',' + ey + ' ' + ex + ',' + baseline + ' ' + sx + ',' + baseline + '" fill="' + rcol + '" fill-opacity="0.12"/>');
    parts.push('<line x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '" stroke="' + rcol + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><title>' + stations[i + 1].road + ': ' + stations[i].name + ' → ' + stations[i + 1].name + '</title></line>');
  }
  parts.push('</g>');

  for (let i = 0; i < n; i++) {
    const cx = x(stations[i].distKm), cy = y(stations[i].alt);
    parts.push('<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="' + routeColor + '" stroke="#fff" stroke-width="1.5"><title>' + stations[i].name + ' ' + stations[i].altitude + '</title></circle>');
  }

  const bl = pad.t + iH + 6;
  for (let i = 0; i < n; i++) {
    const bx = x(stations[i].distKm);
    parts.push('<line x1="' + bx + '" y1="' + bl + '" x2="' + bx + '" y2="' + (bl + 4) + '" stroke="#ddd" stroke-width="0.3"/>');
  }

  const minGap = 50;
  let lastLabelX = -Infinity;
  let labelRow = 0;
  const labelOrder = [];
  for (let i = 0; i < n; i++) {
    const bx = x(stations[i].distKm);
    const isFirst = i === 0;
    const isLast = i === n - 1;
    if (!isFirst && !isLast && (bx - lastLabelX) < minGap) continue;
    labelOrder.push({ idx: i, bx, row: labelRow, first: isFirst, last: isLast });
    labelRow = 1 - labelRow;
    lastLabelX = bx;
  }

  for (const lo of labelOrder) {
    const ly = bl + 12 + lo.row * 13;
    const name = stations[lo.idx].name;
    const anchor = lo.first ? 'start' : lo.last ? 'end' : 'middle';
    parts.push('<text x="' + lo.bx + '" y="' + ly + '" text-anchor="' + anchor + '" font-size="6" fill="#555" font-weight="600">' + name + '</text>');
  }

  parts.push('</svg>');

  if (roadLegend && roadLegend.length > 0) {
    parts.push('<div class="ec-legend">');
    parts.push('<div class="ec-l-title">🛤️ 路况</div>');
    roadLegend.forEach(rl => {
      parts.push('<div class="ec-l-item"><span class="ec-l-dot" style="background:' + rl.color + '"></span><span class="ec-l-label">' + rl.type + '</span></div>');
    });
    parts.push('</div>');
  }

  parts.push('</div>');
  return parts.join('');
}