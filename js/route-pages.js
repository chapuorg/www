// 茶路相关页面
import { setHTML } from './utils.js';
import { continentIcons, continentColors, countryIcons, countryColors } from './config.js';
import dataLoader from './data-loader.js';
import { renderBreadcrumb, renderWaterfall, renderElevationChart, processTeaPlaceholders } from './components.js';

// 茶路列表
function renderRoutesList(routes) {
  let html = '<h1 class="page-title break-word">🛤️ 茶叶之路</h1>';
  html += '<p class="page-subtitle break-word">探索与茶相关的古老贸易路线和文化走廊</p>';

  const continentGroups = {};
  routes.forEach(route => {
    const c = route.continent || '跨洲际';
    if (!continentGroups[c]) continentGroups[c] = [];
    continentGroups[c].push(route);
  });

  const order = ['亚洲', '欧洲', '非洲', '南美洲', '北美洲', '大洋洲', '跨洲际'];
  order.forEach(cont => {
    const group = continentGroups[cont];
    if (!group || group.length === 0) return;
    const contIcon = continentIcons[cont] || '🌐';
    const contColor = continentColors[cont] || '#555';

    const countryMap = {};
    group.forEach(r => {
      const cty = r.country || '跨洲际';
      if (!countryMap[cty]) countryMap[cty] = [];
      countryMap[cty].push(r);
    });
    const countryKeys = Object.keys(countryMap).sort();

    html += '<div class="section-group">';
    html += '<div class="section-group__header" style="border-left:3px solid ' + contColor + '">';
    html += '<span class="section-group__header-label">' + contIcon + ' ' + cont + '</span>';
    html += '<span class="section-group__header-count">' + group.length + ' 条古道 · ' + countryKeys.length + ' 个国家</span>';
    html += '</div>';
    html += '<div class="category__grid">';
    countryKeys.forEach(cty => {
      const cIcon = countryIcons[cty] || contIcon;
      const ctyRoutes = countryMap[cty];
      html += '<div class="category-card" data-nav="routes-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + contColor + '">';
      html += '<div class="category-card__icon" style="font-size:1.8rem;">' + cIcon + '</div>';
      html += '<div class="category-card__name break-word">' + cty + '</div>';
      html += '<div class="category-card__count break-word">' + ctyRoutes.length + ' 条古道</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });
  return html;
}

// 茶路大洲页
function renderRoutesContinentPage(continent, routes) {
  const icon = continentIcons[continent] || '🌐';
  const color = continentColors[continent] || '#555';

  const countryGroups = {};
  routes.forEach(r => {
    const cty = r.country || '跨洲际';
    if (!countryGroups[cty]) countryGroups[cty] = [];
    countryGroups[cty].push(r);
  });

  let html = renderBreadcrumb([{ label: '茶叶之路', nav: 'routes' }, { label: continent }]);
  html += '<h1 class="page-title break-word">' + icon + ' ' + continent + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + routes.length + ' 条古道，分布在 ' + Object.keys(countryGroups).length + ' 个国家/地区</p>';
  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + color + '">';
  html += '<span class="section-group__header-label">🌍 国家/地区</span>';
  html += '<span class="section-group__header-count">' + Object.keys(countryGroups).length + ' 个国家</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  Object.keys(countryGroups).forEach(cty => {
    const cIcon = countryIcons[cty] || icon;
    html += '<div class="category-card" data-nav="routes-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + color + '">';
    html += '<div class="category-card__icon" style="font-size:1.8rem;">' + cIcon + '</div>';
    html += '<div class="category-card__name break-word">' + cty + '</div>';
    html += '<div class="category-card__count break-word">' + countryGroups[cty].length + ' 条古道</div>';
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

// 茶路国家页
function renderRoutesCountryPage(country, routes) {
  const icon = countryIcons[country] || '🌍';
  const color = countryColors[country] || '#8B4513';
  const continent = routes[0] ? routes[0].continent : '';

  let html = renderBreadcrumb([
    { label: '茶叶之路', nav: 'routes' },
    continent ? { label: continent, nav: 'routes-continent-' + encodeURIComponent(continent) } : null,
    { label: country }
  ].filter(Boolean));
  html += '<h1 class="page-title break-word">' + icon + ' ' + country + '</h1>';
  html += '<p class="page-subtitle break-word">共 ' + routes.length + ' 条古道</p>';
  html += '<div class="section-group">';
  html += '<div class="section-group__header" style="border-left:3px solid ' + color + '">';
  html += '<span class="section-group__header-label">🛤️ 古道路线</span>';
  html += '<span class="section-group__header-count">' + routes.length + ' 条</span>';
  html += '</div>';
  html += '<div class="category__grid">';
  routes.forEach(route => {
    const rc = route.color || '#8B4513';
    html += '<div class="category-card" data-nav="route-' + route.id + '" style="border-top:3px solid ' + rc + '">';
    html += '<div class="category-card__icon" style="font-size:1.8rem;">' + (route.imageIcon || '🛤️') + '</div>';
    html += '<div class="category-card__name break-word">' + route.name + '</div>';
    html += '<div class="category-card__subtitle break-word">' + route.subtitle + '</div>';
    html += '</div>';
  });
  html += '</div></div>';
  return html;
}

// 茶路详情页
function renderRouteDetail(route, relatedTeas) {
  const bc = [
    { label: '茶叶之路', nav: 'routes' },
    route.continent ? { label: route.continent, nav: 'routes-continent-' + encodeURIComponent(route.continent) } : null,
    route.country && route.country !== route.continent ? { label: route.country, nav: 'routes-country-' + encodeURIComponent(route.country) } : null,
    { label: route.name }
  ].filter(Boolean);
  const rc = route.color || '#8B4513';
  let html = renderBreadcrumb(bc);
  html += '<div class="route-detail">';
  html += '<div class="route-detail-header">';
  html += '<div class="route-detail-header__icon">' + (route.imageIcon || '🛤️') + '</div>';
  html += '<h1 class="route-detail-header__name break-word">' + route.name + '</h1>';
  html += '<div class="route-detail-header__subtitle break-word">' + route.subtitle + '</div>';
  html += '</div>';

  html += '<div class="route-detail__info-grid">';
  if (route.summary) html += '<div class="route-info-card route-info-full"><div class="route-info-card__label">📋 概述</div><div class="route-info-card__text break-word">' + route.summary + '</div></div>';
  if (route.distance) html += '<div class="route-info-card"><div class="route-info-card__label">📏 总距离</div><div class="route-info-card__text break-word">' + route.distance + '</div></div>';
  if (route.duration) html += '<div class="route-info-card"><div class="route-info-card__label">⏱️ 历时</div><div class="route-info-card__text break-word">' + route.duration + '</div></div>';
  if (route.difficulty) html += '<div class="route-info-card"><div class="route-info-card__label">⚠️ 难度</div><div class="route-info-card__text break-word">' + route.difficulty + '</div></div>';
  if (route.bestSeason) html += '<div class="route-info-card"><div class="route-info-card__label">📅 最佳季节</div><div class="route-info-card__text break-word">' + route.bestSeason + '</div></div>';
  if (route.terrain) html += '<div class="route-info-card"><div class="route-info-card__label">⛰️ 地形特征</div><div class="route-info-card__text break-word">' + route.terrain + '</div></div>';
  if (route.mainTea) html += '<div class="route-info-card"><div class="route-info-card__label">🍵 主要运送茶叶</div><div class="route-info-card__text break-word">' + route.mainTea + '</div></div>';
  const routeSearchName = encodeURIComponent(route.name);
  html += '<div class="route-info-card">';
  html += '<div class="route-info-card__label">📹 视频资料</div>';
  html += '<div class="route-info-card__links">';
  html += '<a class="route-info-card__link-btn route-info-card__link--dy" href="https://www.douyin.com/search/' + routeSearchName + '" target="_blank" rel="noopener">🎵 抖音</a>';
  html += '<a class="route-info-card__link-btn route-info-card__link--bl" href="https://search.bilibili.com/all?keyword=' + routeSearchName + '" target="_blank" rel="noopener">📺 哔哩哔哩</a>';
  html += '<a class="route-info-card__link-btn route-info-card__link--xs" href="https://www.xiaohongshu.com/search_result?keyword=' + routeSearchName + '" target="_blank" rel="noopener">📖 小红书</a>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  html += '<div class="route-map">';
  html += '<div class="satellite-map-header flex-center">🛰️ 卫星路线图</div>';
  html += '<div id="route-map-' + route.id + '" class="route-satellite-map"></div>';
  html += '</div>';

  if (route.stations && route.stations.length > 0) {
    html += '<div class="route-map">';
    html += '<div class="rm-header flex-center">🗺️ 路线全览';
    if (route.distance) html += '<span class="rm-distance-label">总长约' + route.distance + '</span>';
    html += '</div>';
    html += renderElevationChart(route.stations, route.roadLegend, rc);
    html += '<div class="rm-timeline">';
    route.stations.forEach((st, i) => {
      html += '<div class="rm-station">';
      html += '<div class="rms-line" style="--rc:' + rc + '"><div class="rms-dot" style="--rc:' + rc + '"><span class="rms-num">' + (i + 1) + '</span></div></div>';
      html += '<div class="rms-content">';
      html += '<div class="rms-name">' + st.name + '</div>';
      html += '<div class="rms-meta">';
      if (st.distance) html += '<span class="rms-dist">' + st.distance + '</span>';
      if (st.altitude) html += '<span class="rms-alt">⛰️ ' + st.altitude + '</span>';
      html += '</div>';
      if (st.desc) html += '<div class="rms-desc">' + st.desc + '</div>';
      html += '</div></div>';
    });
    html += '</div></div>';
  }

  const teaMap = {};
  relatedTeas.forEach(t => { teaMap[t.id] = t; });

  let storyHtml = route.story;
  storyHtml = processTeaPlaceholders(storyHtml, teaMap);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = storyHtml;
  const children = tempDiv.childNodes;
  let processed = '';
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.nodeType === 1) {
      if (node.classList && node.classList.contains('route-detail__tea-card')) {
        processed += node.outerHTML;
      } else if (node.tagName === 'P') {
        processed += '<div class="route-detail__story-block break-word" style="border-left:3px solid ' + rc + '">';
        processed += '<div class="rsb-header flex-center"><span class="rsb-dot" style="background:' + rc + '"></span><span class="rsb-label">' + node.textContent.trim().substring(0, 18) + '…</span></div>';
        processed += '<p>' + node.innerHTML + '</p>';
        processed += '</div>';
      } else {
        processed += node.outerHTML;
      }
    } else if (node.nodeType === 3 && node.textContent.trim()) {
      processed += '<p>' + node.textContent.trim() + '</p>';
    }
  }
  html += processed;

  if (relatedTeas.length > 0) {
    html += '<div class="route-detail__related-teas">';
    html += '<h2 class="home__section-title">🍵 相关茶叶品种</h2>';
    html += renderWaterfall(relatedTeas, []);
    html += '</div>';
  }
  html += '<div class="detail-page__disclaimer">⚠️ 免责声明：内容整理自公开信息，不保证准确完整，仅供学习参考，不构成任何建议。</div>';
  html += '</div>';
  return html;
}

// 初始化卫星地图（使用 Leaflet）
function initRouteSatelliteMap(route) {
  const containerId = 'route-map-' + route.id;
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!route.stations || route.stations.length < 2) return;
  const hasCoords = route.stations.some(s => s.coord && s.coord.length === 2);
  if (!hasCoords) return;

  if (typeof L === 'undefined') return;

  const map = L.map(container, { zoomControl: true, attributionControl: false });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: 'Esri'
  }).addTo(map);

  // 右下角版权信息
  const copyright = L.control({ position: 'bottomright' });
  copyright.onAdd = function () {
    const div = L.DomUtil.create('div', 'map-copyright');
    div.innerHTML = 'Esri';
    return div;
  };
  copyright.addTo(map);

  const latlngs = [];
  route.stations.forEach((st, i) => {
    if (!st.coord || st.coord.length !== 2) return;
    const latlng = [st.coord[0], st.coord[1]];
    latlngs.push(latlng);

    const marker = L.circleMarker(latlng, {
      radius: i === 0 || i === route.stations.length - 1 ? 8 : 5,
      fillColor: i === 0 ? '#22c55e' : i === route.stations.length - 1 ? '#ef4444' : (route.color || '#8B4513'),
      color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.9
    }).addTo(map);

    const label = i === 0 ? '🟢 起点' : i === route.stations.length - 1 ? '🔴 终点' : '📍 途经点';
    let popupHtml = '<strong>' + st.name + '</strong>';
    popupHtml += '<div class="popup-meta">' + label;
    if (st.distance) popupHtml += ' · ' + st.distance;
    if (st.altitude) popupHtml += ' · ⛰️' + st.altitude;
    if (st.road) popupHtml += ' · ' + st.road;
    popupHtml += '</div>';
    if (st.desc) popupHtml += '<div style="margin-top:4px;font-size:0.8rem;color:var(--text-secondary);">' + st.desc.substring(0, 60) + (st.desc.length > 60 ? '…' : '') + '</div>';
    marker.bindPopup(popupHtml);
    marker.on('mouseover', function () { this.openPopup(); });
    marker.on('mouseout', function () { this.closePopup(); });
  });

  if (latlngs.length < 2) return;
  const polyline = L.polyline(latlngs, {
    color: route.color || '#8B4513', weight: 3, opacity: 0.7, dashArray: '8, 6'
  }).addTo(map);
  map.fitBounds(polyline.getBounds().pad(0.1));
  setTimeout(() => map.invalidateSize(), 100);
}

// 主导出函数
export async function handleRouteRoutes(params, main) {
  const page = params.page;
  const id = params.id;
  const allRoutes = await dataLoader.getAllRoutes();

  switch (page) {
    case 'routes': {
      setHTML(main, renderRoutesList(allRoutes));
      break;
    }
    case 'route': {
      const routeData = allRoutes.find(r => r.id === id);
      if (routeData) {
        const allTeas = await dataLoader.getAllTeas();
        const relatedTeas = allTeas.filter(t => (routeData.teas || []).includes(t.id));
        setHTML(main, renderRouteDetail(routeData, relatedTeas));
        initRouteSatelliteMap(routeData);
      } else {
        setHTML(main, '<p style="text-align:center;padding:32px;">未找到该古道信息</p>');
      }
      break;
    }
    case 'routes-continent': {
      const contRoutes = allRoutes.filter(r => r.continent === id);
      setHTML(main, renderRoutesContinentPage(id, contRoutes));
      break;
    }
    case 'routes-country': {
      const ctyRoutes = allRoutes.filter(r => r.country === id);
      setHTML(main, renderRoutesCountryPage(id, ctyRoutes));
      break;
    }
    default:
      break;
  }
}