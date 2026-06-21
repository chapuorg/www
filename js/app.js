// 茶谱 chapu.org —— 主入口
// 页面模块通过 router.js 中的原生 import() 动态按需加载，无需静态导入
import router from './router.js';
import cache from './cache.js';
import { $ } from './utils.js';

// 注册所有有效页面路由（handler 由 router 内部动态 import() 解析）
const allPages = [
  'home',
  'china', 'world', 'continent', 'country', 'province', 'city', 'district',
  'varieties', 'category', 'subcategory', 'tea', 'tags', 'tag', 'search',
  'routes', 'route', 'routes-continent', 'routes-country',
  'teahouses', 'teahouse', 'teahouses-continent', 'teahouses-country', 'teahouses-city', 'teahouses-province'
];
allPages.forEach(page => router.on(page));

// 主题切换
function initTheme() {
  const themeBtn = $('#theme-btn');
  if (!themeBtn) return;
  const saved = cache.getRaw('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    cache.setRaw('theme', next);
  });
}

// 初始化（模块脚本自动延迟执行，DOM 已就绪）
initTheme();
router.init();