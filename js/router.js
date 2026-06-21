// 查询字符串路由器 —— 路由级功能模块通过原生 import() 动态按需加载
import { $, setHTML } from './utils.js';

// 页面配置映射表：路由 → { loader, export, type }
const PAGE_CONFIG = {
  home:       { loader: () => import('./home.js'),          export: 'renderHome',          type: 'home' },
  china:      { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  world:      { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  continent:  { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  country:    { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  province:   { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  city:       { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  district:   { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  varieties:  { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  category:   { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  subcategory: { loader: () => import('./tea-pages.js'),    export: 'handleTeaRoutes',     type: 'tea' },
  tea:        { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  tags:       { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  tag:        { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  search:     { loader: () => import('./tea-pages.js'),     export: 'handleTeaRoutes',     type: 'tea' },
  routes:     { loader: () => import('./route-pages.js'),   export: 'handleRouteRoutes',   type: 'route' },
  route:      { loader: () => import('./route-pages.js'),   export: 'handleRouteRoutes',   type: 'route' },
  'routes-continent': { loader: () => import('./route-pages.js'), export: 'handleRouteRoutes', type: 'route' },
  'routes-country':   { loader: () => import('./route-pages.js'), export: 'handleRouteRoutes', type: 'route' },
  teahouses:  { loader: () => import('./teahouse-pages.js'), export: 'handleTeahouseRoutes', type: 'teahouse' },
  teahouse:   { loader: () => import('./teahouse-pages.js'), export: 'handleTeahouseRoutes', type: 'teahouse' },
  'teahouses-continent': { loader: () => import('./teahouse-pages.js'), export: 'handleTeahouseRoutes', type: 'teahouse' },
  'teahouses-country':   { loader: () => import('./teahouse-pages.js'), export: 'handleTeahouseRoutes', type: 'teahouse' },
  'teahouses-city':      { loader: () => import('./teahouse-pages.js'), export: 'handleTeahouseRoutes', type: 'teahouse' },
  'teahouses-province':  { loader: () => import('./teahouse-pages.js'), export: 'handleTeahouseRoutes', type: 'teahouse' },
};

class Router {
  constructor() {
    this._handlers = {}; // 仅记录已注册的有效页面名
    this._moduleCache = {}; // 缓存已加载的模块，避免重复 import()
    this._currentPage = null;
  }

  // 注册有效页面名（用于 _handleDataNav 校验）
  on(page) {
    this._handlers[page] = true;
  }

  // 解析 URL 查询参数
  parseParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }

  // 构建 URL
  buildUrl(params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    const qs = search.toString();
    return qs ? '?' + qs : window.location.pathname;
  }

  // 导航到指定页面
  navigate(params, replace = false) {
    const url = this.buildUrl(params);
    if (replace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }
    this._handleRoute();
  }

  // 动态按需加载页面模块并执行
  async _resolveHandler(page) {
    const cfg = PAGE_CONFIG[page];
    if (!cfg) return null;

    // 缓存已加载模块，避免重复 import()
    const moduleKey = cfg.type;
    if (!this._moduleCache[moduleKey]) {
      this._moduleCache[moduleKey] = await cfg.loader();
    }

    const mod = this._moduleCache[moduleKey];
    const handler = mod[cfg.export];
    if (!handler) return null;

    // 首页 renderHome 签名不同，需要适配
    if (page === 'home') {
      return (params, main) => handler(main);
    }
    return handler;
  }

  // 处理当前路由
  async _handleRoute() {
    const params = this.parseParams();
    const page = params.page || 'home';
    const main = this._mainEl || $('#main-content');
    if (!main) return;

    // 更新导航激活状态
    this._updateNavActive(page, params);

    try {
      const handler = await this._resolveHandler(page);
      if (handler) {
        await handler(params, main);
      } else {
        // 默认回首页
        const homeHandler = await this._resolveHandler('home');
        if (homeHandler) {
          await homeHandler(params, main);
        } else {
          setHTML(main, '<p style="text-align:center;padding:32px;">页面加载中...</p>');
        }
      }
    } catch (err) {
      console.error('Route error:', err);
      setHTML(main, '<p style="text-align:center;padding:32px;">页面加载出错，请稍后再试</p>');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _updateNavActive(page, params) {
    const navMap = {
      'home': 'nav-home',
      'china': 'nav-china', 'province': 'nav-china', 'city': 'nav-china', 'district': 'nav-china',
      'world': 'nav-world', 'continent': 'nav-world', 'country': 'nav-world',
      'varieties': 'nav-varieties', 'category': 'nav-varieties', 'subcategory': 'nav-varieties',
      'routes': 'nav-routes', 'route': 'nav-routes',
      'teahouses': 'nav-teahouses', 'teahouse': 'nav-teahouses',
      'tags': 'nav-tags', 'tag': 'nav-tags',
      'search': 'nav-search'
    };

    const activeId = navMap[page] || '';
    document.querySelectorAll('.site-header__nav a').forEach(link => {
      link.classList.toggle('active', link.id === activeId);
    });
  }

  // 初始化
  init() {
    // 导航链接点击
    const navIds = ['nav-home', 'nav-china', 'nav-world', 'nav-varieties', 'nav-routes', 'nav-teahouses', 'nav-tags', 'nav-search'];
    const navPages = ['home', 'china', 'world', 'varieties', 'routes', 'teahouses', 'tags', 'search'];

    navIds.forEach((id, i) => {
      const el = $('#' + id);
      if (el) {
        el.addEventListener('click', e => {
          e.preventDefault();
          this.navigate({ page: navPages[i] });
        });
      }
    });

    // 主内容区点击委托
    this._mainEl = $('#main-content');
    if (this._mainEl) {
      this._mainEl.addEventListener('click', e => {
        const navEl = e.target.closest('[data-nav]');
        if (navEl) {
          e.preventDefault();
          const nav = navEl.getAttribute('data-nav');
          this._handleDataNav(nav);
          return;
        }
        const teaEl = e.target.closest('[data-tea-id]');
        if (teaEl) {
          e.preventDefault();
          const teaId = teaEl.getAttribute('data-tea-id');
          this.navigate({ page: 'tea', id: teaId });
          return;
        }
        if (e.target.id === 'search-page-btn') {
          e.preventDefault();
          const input = document.getElementById('search-page-input');
          if (input && input.value.trim()) {
            this.navigate({ page: 'search', q: input.value.trim() });
          }
        }
      });

      this._mainEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.id === 'search-page-input') {
          e.preventDefault();
          const q = e.target.value.trim();
          if (q) this.navigate({ page: 'search', q });
        }
      });
    }

    // 浏览器前进/后退
    window.addEventListener('popstate', () => this._handleRoute());

    // 菜单切换
    const menuToggle = $('#menu-toggle');
    const headerNav = $('.site-header__nav');
    const menuOverlay = $('#site-header__menu-overlay');

    if (menuToggle && headerNav && menuOverlay) {
      const closeMenu = () => {
        headerNav.classList.remove('open');
        menuOverlay.classList.remove('open');
        menuToggle.textContent = '☰';
      };
      const openMenu = () => {
        headerNav.classList.add('open');
        menuOverlay.classList.add('open');
        menuToggle.textContent = '✕';
      };

      menuToggle.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        headerNav.classList.contains('open') ? closeMenu() : openMenu();
      });

      menuOverlay.addEventListener('click', closeMenu);

      headerNav.addEventListener('click', e => {
        if (e.target.tagName === 'A') closeMenu();
      });
    }

    // 初始路由
    this._handleRoute();
  }

  _handleDataNav(nav) {
    const parts = nav.split('-');
    if (parts.length === 1) {
      this.navigate({ page: nav });
      return;
    }
    // 尝试从最长到最短匹配已注册的 handler，
    // 以支持 "teahouses-continent-亚洲" 这类多词页面名
    for (let i = parts.length - 1; i >= 1; i--) {
      const page = parts.slice(0, i).join('-');
      if (this._handlers[page]) {
        const value = decodeURIComponent(parts.slice(i).join('-'));
        this.navigate({ page, id: value });
        return;
      }
    }
    // 回退：第一个分段作为 page，其余作为 id
    const page = parts[0];
    const value = decodeURIComponent(parts.slice(1).join('-'));
    this.navigate({ page, id: value });
  }
}

export const router = new Router();
export default router;