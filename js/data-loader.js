// 数据加载器 —— 统一通过 hashSearch 单例加载数据
import hashSearch from './hash-search.js';
import cache from './cache.js';
import { CONFIG } from './config.js';
import { getSubCategories } from './utils.js';

class DataLoader {
  constructor() {
    this._loadingPromises = {};
  }

  _ensureTeaData() {
    window.TeaData = window.TeaData || {};
  }

  // 通用：加载目录下所有 JSON 文件并合并为数组
  async _loadJsonArray(ns, key, base, files) {
    if (cache.has(key)) return cache.get(key);

    this._ensureTeaData();
    window.TeaData[ns] = window.TeaData[ns] || {};

    await hashSearch.loadDataFiles(base, files);

    const data = [];
    const src = window.TeaData[ns];
    files.forEach(f => {
      const arr = src[f];
      if (Array.isArray(arr)) data.push(...arr);
    });

    cache.set(key, data);
    return data;
  }

  // 获取所有茶叶
  async getAllTeas() {
    if (this._loadingPromises.teas) return this._loadingPromises.teas;

    this._loadingPromises.teas = (async () => {
      const [chinaData, worldData] = await Promise.all([
        this._loadJsonArray('chinatea', 'china_data', CONFIG.CHINA_BASE, CONFIG.chinaFiles),
        this._loadJsonArray('worldtea', 'world_data', CONFIG.WORLD_BASE, CONFIG.worldFiles)
      ]);
      const teas = [...chinaData, ...worldData];
      teas.forEach(t => {
        if (!t.subCategory) t.subCategory = getSubCategories(t)[0] || t.category;
      });
      cache.set('all_teas', teas);
      return teas;
    })();

    return this._loadingPromises.teas;
  }

  // 获取所有茶路
  async getAllRoutes() {
    if (this._loadingPromises.routes) return this._loadingPromises.routes;

    this._loadingPromises.routes = (async () => {
      this._ensureTeaData();
      window.TeaData.route = window.TeaData.route || {};

      await hashSearch.loadDataFiles(CONFIG.ROUTE_BASE, CONFIG.routeFiles);

      const routes = [];
      CONFIG.routeFiles.forEach(f => {
        const r = window.TeaData.route[f];
        if (r && r.id) routes.push(r);
      });

      cache.set('all_routes', routes);
      return routes;
    })();

    return this._loadingPromises.routes;
  }

  // 获取所有茶馆
  async getAllTeahouses() {
    if (this._loadingPromises.teahouses) return this._loadingPromises.teahouses;

    this._loadingPromises.teahouses = (async () => {
      this._ensureTeaData();
      window.TeaData.chinateahouse = window.TeaData.chinateahouse || {};
      window.TeaData.worldteahouse = window.TeaData.worldteahouse || {};

      await Promise.all([
        hashSearch.loadDataFiles(CONFIG.TEAHOUSE_CHINA_BASE, CONFIG.teahouseChinaFiles),
        hashSearch.loadDataFiles(CONFIG.TEAHOUSE_WORLD_BASE, CONFIG.teahouseWorldFiles)
      ]);

      const teahouses = [];
      const collect = (arr) => {
        if (Array.isArray(arr)) {
          arr.forEach(item => { if (item && item.id) teahouses.push(item); });
        }
      };

      CONFIG.teahouseChinaFiles.forEach(f => collect(window.TeaData.chinateahouse[f]));
      CONFIG.teahouseWorldFiles.forEach(f => collect(window.TeaData.worldteahouse[f]));

      cache.set('all_teahouses', teahouses);
      return teahouses;
    })();

    return this._loadingPromises.teahouses;
  }

  // 获取标签映射
  async getTagMap() {
    const cached = cache.get('tag_map');
    if (cached) return cached;
    const teas = await this.getAllTeas();
    const map = {};
    teas.forEach(t => {
      if (t.tags) {
        t.tags.forEach(tag => {
          if (!map[tag]) map[tag] = [];
          map[tag].push(t);
        });
      }
    });
    cache.set('tag_map', map);
    return map;
  }

  // 获取分类分组
  async getCategoryGroups() {
    const cached = cache.get('category_groups');
    if (cached) return cached;
    const teas = await this.getAllTeas();
    const map = {};
    teas.forEach(t => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    cache.set('category_groups', map);
    return map;
  }
}

export const dataLoader = new DataLoader();
export default dataLoader;