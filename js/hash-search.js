import { CONFIG } from './config.js';

// 全局唯一 HashSearch 单例 —— 所有业务数据请求必须经由该单例完成
class HashSearch {
  constructor() {
    this._pending = new Map();
    this._loadedFiles = new Set();
  }

  static getInstance() {
    if (!HashSearch._instance) HashSearch._instance = new HashSearch();
    return HashSearch._instance;
  }

  // 核心 fetch 封装 —— 所有网络请求必须通过此方法
  async fetch(url, options = {}) {
    const key = url;
    if (this._pending.has(key)) return this._pending.get(key);

    const promise = (async () => {
      try {
        const res = await window.fetch(url, {
          headers: { 'Accept': 'application/json' },
          ...options
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
        return await res.text();
      } finally {
        this._pending.delete(key);
      }
    })();

    this._pending.set(key, promise);
    return promise;
  }

  // 加载 JSON 数据文件 —— 通过 fetch + JSON.parse
  async loadDataFile(src) {
    // 避免重复加载
    if (this._loadedFiles.has(src)) return true;

    // 添加缓存破坏参数
    const cacheBust = '?v=' + CONFIG.cacheVersion;

    try {
      const text = await this.fetch(src + cacheBust);
      const data = JSON.parse(text);

      // 解析路径确定 namespace 和 key
      // src 格式: "zh/chinatea/anhui.json" 或 "zh/route/tea-horse-road.json"
      const parts = src.replace('.json', '').split('/');
      const namespace = parts[1]; // chinatea, worldtea, route, chinateahouse, worldteahouse
      const key = parts[2];       // anhui, india, tea-horse-road, beijing

      window.TeaData = window.TeaData || {};
      window.TeaData[namespace] = window.TeaData[namespace] || {};
      window.TeaData[namespace][key] = data;

      this._loadedFiles.add(src);
      return true;
    } catch (e) {
      console.error('Failed to load', src, e);
      return false;
    }
  }

  // 批量加载数据文件（并行加载）
  async loadDataFiles(basePath, files) {
    const results = await Promise.allSettled(
      files.map(f => this.loadDataFile(basePath + f + '.json'))
    );
    return results.map(r => r.status === 'fulfilled' ? r.value : false);
  }
}

export const hashSearch = HashSearch.getInstance();
export default hashSearch;