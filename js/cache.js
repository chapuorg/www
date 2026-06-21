// 双层缓存体系：内存缓存 + localStorage 持久化缓存
import { CONFIG } from './config.js';

class CacheManager {
  constructor() {
    this._mem = {};
    this._prefix = 'chapu_cache_';
    this._version = CONFIG.cacheVersion;
  }

  _key(name) {
    return this._prefix + this._version + '_' + name;
  }

  // 内存读取
  get(name) {
    if (this._mem[name] !== undefined) return this._mem[name];
    // 尝试从 localStorage 恢复
    try {
      const raw = localStorage.getItem(this._key(name));
      if (raw) {
        const parsed = JSON.parse(raw);
        this._mem[name] = parsed;
        return parsed;
      }
    } catch (e) { /* ignore */ }
    return undefined;
  }

  // 写入双层缓存
  set(name, data) {
    this._mem[name] = data;
    try {
      localStorage.setItem(this._key(name), JSON.stringify(data));
    } catch (e) { /* quota exceeded, ignore */ }
  }

  // 清除指定缓存
  clear(name) {
    delete this._mem[name];
    try {
      localStorage.removeItem(this._key(name));
    } catch (e) { /* ignore */ }
  }

  // 清除所有缓存
  clearAll() {
    this._mem = {};
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith(this._prefix)) localStorage.removeItem(k);
      });
    } catch (e) { /* ignore */ }
  }

  // 检查缓存是否存在且有效
  has(name) {
    return this._mem[name] !== undefined || localStorage.getItem(this._key(name)) !== null;
  }

  // 无版本前缀的简单存取（用于主题等不随缓存版本失效的持久化数据）
  getRaw(name) {
    try {
      const raw = localStorage.getItem(this._prefix + name);
      return raw ? JSON.parse(raw) : undefined;
    } catch (e) { return undefined; }
  }

  setRaw(name, data) {
    try {
      localStorage.setItem(this._prefix + name, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }
}

export const cache = new CacheManager();
export default cache;