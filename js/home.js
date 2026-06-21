// 首页渲染
import { setHTML, pickRandom, escHtml } from './utils.js';
import { teaQuotes } from './config.js';
import dataLoader from './data-loader.js';

// 渲染静态内容（无需数据，立即展示）
function renderStaticHome() {
  const quote = pickRandom(teaQuotes);
  let html = '<div class="home-hero">';
  html += '<div class="home-quote">' + escHtml(quote.text) + '<span class="hq-source">—— ' + escHtml(quote.source) + '</span></div>';
  html += '</div>';

  // 骨架屏占位
  html += '<div class="home__feature-area" id="home-feature">';
  html += '<div class="home__feature-card"><div class="home-skeleton"><span class="home-skeleton-icon">🍵</span>正在加载推荐...</div></div>';
  html += '</div>';

  return html;
}

function renderFeatureCard(isRoute, item) {
  if (isRoute) return renderRouteFeature(item);
  return renderTeahouseFeature(item);
}

function renderRouteFeature(route) {
  const emoji = route.imageIcon || '🛤️';
  const c = route.color || '#8B4513';
  let html = '<div class="home-card">';
  html += '<div class="home-card-inner">';
  html += '<div class="home-card-header">';
  html += '<div class="home-card-icon">' + emoji + '</div>';
  html += '<div>';
  html += '<h2 class="home-card-title">' + escHtml(route.name) + '</h2>';
  html += '<div class="home-card-subtitle">' + escHtml(route.subtitle || route.country || '') + '</div>';
  html += '</div></div>';
  html += '<p class="home-card-desc">' + escHtml(route.summary || '') + '</p>';
  html += '<div class="home-card-grid">';
  if (route.distance) html += '<div class="home-card-stat"><div class="home-card-stat-label">距离</div><div class="home-card-stat-value">📏 ' + escHtml(route.distance) + '</div></div>';
  if (route.duration) html += '<div class="home-card-stat"><div class="home-card-stat-label">行程</div><div class="home-card-stat-value">⏱️ ' + escHtml(route.duration) + '</div></div>';
  if (route.difficulty) html += '<div class="home-card-stat"><div class="home-card-stat-label">难度</div><div class="home-card-stat-value">⚠️ ' + escHtml(route.difficulty) + '</div></div>';
  if (route.bestSeason) html += '<div class="home-card-stat"><div class="home-card-stat-label">最佳季节</div><div class="home-card-stat-value">📅 ' + escHtml(route.bestSeason) + '</div></div>';
  html += '</div>';
  html += '<div class="home-card-highlight" style="--card-color:' + c + '">';
  html += '<div class="home-card-highlight-title">✨ 今日推荐</div>';
  html += '<div class="home-card-highlight-text">这条茶路藏着太多精彩故事！建议你从起点开始，沿着古老的茶香轨迹，感受历史与自然的交融。</div></div>';
  html += '<div class="home-card-actions">';
  html += '<button data-nav="route-' + route.id + '" class="home-card-btn-primary" style="--card-color:' + c + '">🚀 探索这条茶路</button>';
  html += '<button data-nav="routes" class="home-card-btn-secondary">查看所有茶路</button>';
  html += '</div></div></div>';
  return html;
}

function renderTeahouseFeature(teahouse) {
  const emoji = teahouse.imageIcon || '🏠';
  const c = teahouse.color || '#4CAF50';
  let html = '<div class="home-card">';
  html += '<div class="home-card-inner">';
  html += '<div class="home-card-header">';
  html += '<div class="home-card-icon">' + emoji + '</div>';
  html += '<div>';
  html += '<h2 class="home-card-title">' + escHtml(teahouse.name) + '</h2>';
  html += '<div class="home-card-subtitle">' + escHtml(teahouse.city || teahouse.country || '') + '</div>';
  html += '</div></div>';
  html += '<p class="home-card-desc">' + escHtml(teahouse.description || '') + '</p>';
  html += '<div class="home-card-grid">';
  if (teahouse.established) html += '<div class="home-card-stat"><div class="home-card-stat-label">创立年代</div><div class="home-card-stat-value">📅 ' + escHtml(teahouse.established) + '</div></div>';
  if (teahouse.style) html += '<div class="home-card-stat"><div class="home-card-stat-label">风格</div><div class="home-card-stat-value">🎨 ' + escHtml(teahouse.style) + '</div></div>';
  if (teahouse.specialty) html += '<div class="home-card-stat"><div class="home-card-stat-label">特色</div><div class="home-card-stat-value">🍵 ' + escHtml(teahouse.specialty) + '</div></div>';
  if (teahouse.address) html += '<div class="home-card-stat"><div class="home-card-stat-label">地址</div><div class="home-card-stat-value" style="font-size:0.9rem;">📍 ' + escHtml(teahouse.address.substring(0, 30)) + (teahouse.address.length > 30 ? '...' : '') + '</div></div>';
  html += '</div>';
  html += '<div class="home-card-highlight" style="--card-color:' + c + '">';
  html += '<div class="home-card-highlight-title">✨ 今日推荐</div>';
  html += '<div class="home-card-highlight-text">' + escHtml(teahouse.highlight || '这是一家值得寻访的茶馆！建议你找个悠闲的下午，在这里品一杯好茶，感受时光的味道。') + '</div></div>';
  html += '<div class="home-card-actions">';
  html += '<button data-nav="teahouse-' + teahouse.id + '" class="home-card-btn-primary" style="--card-color:' + c + '">🏠 了解这家茶馆</button>';
  html += '<button data-nav="teahouses" class="home-card-btn-secondary">查看所有茶馆</button>';
  html += '</div></div></div>';
  return html;
}

export async function renderHome(main) {
  // 第一步：立即渲染静态内容，用户马上看到页面
  setHTML(main, renderStaticHome());

  // 第二步：先加载茶路和茶馆（数据量小，~30个文件），快速展示推荐卡片
  const [allRoutes, allTeahouses] = await Promise.all([
    dataLoader.getAllRoutes(),
    dataLoader.getAllTeahouses()
  ]);

  const featureArea = document.getElementById('home-feature');
  if (featureArea) {
    const isRoute = Math.random() > 0.5;
    const pool = isRoute ? allRoutes : allTeahouses;
    const item = pool.length > 0 ? pickRandom(pool) : (allRoutes.length > 0 ? pickRandom(allRoutes) : pickRandom(allTeahouses));
    const actualIsRoute = allRoutes.includes(item);
    featureArea.classList.add('fade-in');
    setHTML(featureArea, '<div class="home__feature-card">' + renderFeatureCard(actualIsRoute, item) + '</div>');
  }

  // 第三步：后台加载茶叶数据
  await dataLoader.getAllTeas();
}