// 工具函数
import { categoryDefaultIcon, categoryColors, provinceIcons, countryIcons, continentIcons, regionColors, countryColors, continentColors } from './config.js';

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// 稳定伪随机排序：基于 ID 哈希，同一列表总是返回相同顺序，避免每次渲染抖动
export function shuffleStable(arr) {
  return arr.slice().sort((a, b) => {
    const ha = hashStr(a.id || a.name || '');
    const hb = hashStr(b.id || b.name || '');
    return ha - hb;
  });
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function escRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function $(sel) {
  return document.querySelector(sel);
}

export function setHTML(el, html) {
  const target = typeof el === 'string' ? $(el) : el;
  if (target) target.innerHTML = html;
}

// Tag 颜色相关
const tagColors = {
  '名茶': '#c0392b', '传统': '#8B4513', '贡茶': '#d4a017', '手工': '#e67e22',
  '非遗': '#c0392b', '古树': '#5d4037', '有机': '#27ae60', '地理标志': '#2980b9',
  '花香': '#e84393', '果香': '#e67e22', '清香': '#16a085', '浓香': '#c0392b',
  '甘甜': '#f39c12', '回甘': '#d4a017', '醇厚': '#5d4037', '鲜爽': '#27ae60',
  '绿茶类': '#3d8b37', '红茶类': '#c0392b', '乌龙茶类': '#d4a017', '白茶类': '#a0a8b0',
  '黄茶类': '#e6a817', '黑茶类': '#5d4037', '普洱茶类': '#795548',
  '炒青': '#e67e22', '蒸青': '#16a085', '晒青': '#f39c12', '烘青': '#8B4513',
  '发酵': '#c0392b', '半发酵': '#d4a017', '不发酵': '#27ae60', '后发酵': '#5d4037',
  '健康': '#27ae60', '养生': '#16a085', '提神': '#e67e22', '安神': '#8e44ad',
  '高端': '#8e44ad', '珍稀': '#d4a017', '日常': '#2980b9', '礼品': '#c0392b',
  '热门': '#e74c3c', '推荐': '#e67e22', '经典': '#8B4513'
};

const tagColorPalette = [
  '#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#16a085',
  '#2980b9', '#8e44ad', '#c0392b', '#d35400', '#2ecc71',
  '#1abc9c', '#3498db', '#9b59b6', '#e84393', '#00bcd4',
  '#ff5722', '#795548', '#607d8b', '#f44336', '#4caf50'
];

export function getAutoTagColor(tag) {
  return tagColors[tag] || tagColorPalette[hashStr(tag) % tagColorPalette.length];
}

// Tag 图标
const tagIcons = {
  '名茶': '⭐', '传统': '🏮', '贡茶': '👑', '手工': '🤲', '非遗': '🎭',
  '古树': '🌳', '有机': '🌱', '地理标志': '📍',
  '花香': '🌸', '果香': '🍑', '清香': '💨', '浓香': '🔥',
  '甘甜': '🍯', '回甘': '🔄', '醇厚': '🍷', '鲜爽': '💧',
  '炒青': '🍳', '蒸青': '♨️', '晒青': '☀️', '烘青': '🔥',
  '发酵': '🫙', '半发酵': '⚗️', '不发酵': '🧊', '后发酵': '📦',
  '健康': '💚', '养生': '🧘', '提神': '⚡', '安神': '🌙',
  '高端': '💎', '珍稀': '💠', '日常': '🏠', '礼品': '🎁',
  '热门': '🔥', '推荐': '👍', '经典': '📜',
  '绿茶类': '🍃', '红茶类': '🫖', '乌龙茶类': '🏺', '白茶类': '🤍',
  '黄茶类': '💛', '黑茶类': '🖤', '普洱茶类': '🧱',
  '十大名茶': '🏆', '中国十大名茶': '🏆', '非物质文化遗产': '🎭',
  '历史文化': '📚', '历史名茶': '📜', '寺庙茶': '🛕', '禅茶': '🧘',
  '岩茶': '⛰️', '高山茶': '🏔️', '云雾茶': '☁️', '春茶': '🌸',
  '明前茶': '🌱', '雨前茶': '🌧️', '秋茶': '🍂', '冬茶': '❄️',
  '红茶': '🫖', '绿茶': '🍃', '乌龙茶': '🏺', '白茶': '🤍', '黄茶': '💛',
  '黑茶': '🖤', '普洱茶': '🧱', '花茶': '🌸', '调味茶': '🌺', '代茶类': '🌿',
  '工夫茶': '🫖', '紧压茶': '🧱', '散茶': '🍃', '茶饼': '🫓', '茶砖': '🧱',
  '龙井': '🐉', '碧螺春': '🐚', '铁观音': '🧘', '大红袍': '🧥', '普洱': '🧱',
  '毛尖': '🌱', '毛峰': '⛰️', '银针': '🤍', '瓜片': '🍈', '雀舌': '🐦',
  '茉莉花茶': '🤍', '桂花茶': '🌼', '玫瑰花茶': '🌹', '菊花茶': '🌼',
  '国际': '🌍', '中国特色': '🐉', '地方特色': '📍', '节日': '🎉',
  '百年老店': '🏛️', '历史建筑': '🏯', '园林茶馆': '🏞️', '现代茶馆': '🏢',
  '茶道': '🍵', '茶艺': '🎨', '品茶': '☕', '茶文化': '📖'
};

export function getTagIcon(tag) {
  return tagIcons[tag] || '';
}

// 获取茶叶图标
export function getTeaIcon(tea) {
  if (!tea || !tea.category) return '🍵';
  return categoryDefaultIcon[tea.category] || '🍵';
}

// 获取茶叶颜色
export function getTeaColor(tea) {
  if (!tea || !tea.category) return '#8B4513';
  return categoryColors[tea.category] || '#8B4513';
}

// 获取地区图标
export function getRegionIcon(tea) {
  if (!tea) return '';
  if (tea.province && provinceIcons[tea.province]) return provinceIcons[tea.province];
  if (tea.country && countryIcons[tea.country]) return countryIcons[tea.country];
  if (tea.continent && continentIcons[tea.continent]) return continentIcons[tea.continent];
  return '';
}

// 获取地区颜色
export function getRegionColor(tea) {
  if (!tea) return '#8B4513';
  if (tea.province && regionColors[tea.province]) return regionColors[tea.province];
  if (tea.country && countryColors[tea.country]) return countryColors[tea.country];
  if (tea.continent && continentColors[tea.continent]) return continentColors[tea.continent];
  return '#8B4513';
}

// 子分类相关
export function getSubCategories(tea) {
  if (tea.subCategories && tea.subCategories.length > 0) return tea.subCategories;
  const sub = getSubCategoryLegacy(tea);
  return sub ? [sub] : [];
}

function getSubCategoryLegacy(tea) {
  const tags = tea.tags || [];
  const tagsStr = tags.join(' ');
  const cat = tea.category;
  const name = tea.name || '';
  const id = tea.id || '';

  if (cat === '绿茶') {
    if (/炒青|炒制|炒茶/.test(tagsStr)) return '炒青绿茶';
    if (/烘青|烘制|烘焙/.test(tagsStr)) return '烘青绿茶';
    if (/蒸青|蒸制/.test(tagsStr)) return '蒸青绿茶';
    if (/晒青|晒制/.test(tagsStr)) return '晒青绿茶';
    if (/龙井|碧螺春|毛尖|竹叶青|雀舌|仙毫|松萝|翠芽|甘露|银毫/.test(name)) return '炒青绿茶';
    if (/毛峰|瓜片|猴魁|云雾|雪芽|安吉白/.test(name)) return '烘青绿茶';
    if (/玉露|抹茶|煎茶/.test(name)) return '蒸青绿茶';
    return '炒青绿茶';
  }
  if (cat === '红茶') {
    if (/小种|正山小种|松烟|烟熏/.test(tagsStr)) return '小种红茶';
    if (/CTC|红碎|crush|tear|curl/i.test(tagsStr) || id.indexOf('ctc') >= 0) return '红碎茶';
    if (/调味|伯爵|佛手柑|earl|flavored/i.test(tagsStr)) return '调味红茶';
    if (/工夫|祁门|滇红|英红|金芽/.test(tagsStr)) return '工夫红茶';
    if (id.indexOf('earl-grey') >= 0 || id.indexOf('earl_grey') >= 0) return '调味红茶';
    if (id.indexOf('ctc') >= 0) return '红碎茶';
    if (id.indexOf('lapsang') >= 0) return '小种红茶';
    return '工夫红茶';
  }
  if (cat === '乌龙茶') {
    if (/武夷|岩茶|大红袍/.test(tagsStr)) return '闽北乌龙';
    if (/安溪|观音|铁观音/.test(tagsStr)) return '闽南乌龙';
    if (/凤凰|单丛|潮汕/.test(tagsStr)) return '广东乌龙';
    if (/台湾/.test(tagsStr)) return '台湾乌龙';
    if (/台湾/.test(name) || id.indexOf('dongfang') >= 0 || id.indexOf('dong-ding') >= 0 || id.indexOf('alishan') >= 0) return '台湾乌龙';
    return '闽南乌龙';
  }
  if (cat === '白茶') {
    if (/银针|白毫密披|单芽/.test(tagsStr)) return '白毫银针';
    if (/牡丹/.test(tagsStr)) return '白牡丹';
    if (/寿眉|贡眉/.test(tagsStr)) return '寿眉/贡眉';
    if (id.indexOf('baihao-yinzhen') >= 0) return '白毫银针';
    if (id.indexOf('baimudan') >= 0) return '白牡丹';
    if (id.indexOf('shoumei') >= 0 || id.indexOf('gongmei') >= 0) return '寿眉/贡眉';
    return '白牡丹';
  }
  if (cat === '黄茶') {
    if (/银针|君山|黄芽/.test(tagsStr)) return '黄芽茶';
    if (id.indexOf('junshan') >= 0) return '黄芽茶';
    return '黄芽茶';
  }
  if (cat === '黑茶') {
    if (/茯砖|湖南|安化/.test(tagsStr)) return '湖南黑茶';
    if (/六堡|广西/.test(tagsStr)) return '广西六堡茶';
    if (/青砖/.test(tagsStr)) return '湖北青砖茶';
    if (/藏族|藏茶/.test(tagsStr)) return '四川藏茶';
    if (id.indexOf('liubao') >= 0) return '广西六堡茶';
    if (id.indexOf('anhua') >= 0) return '湖南黑茶';
    return '湖南黑茶';
  }
  if (cat === '普洱茶') {
    if (/生茶|生普|晒青毛茶/.test(tagsStr)) return '生普';
    if (/熟茶|熟普|渥堆|勐海味/.test(tagsStr)) return '熟普';
    if (id.indexOf('sheng-puer') >= 0 || id.indexOf('sheng-cha') >= 0) return '生普';
    if (id.indexOf('shou-puer') >= 0 || id.indexOf('shou-cha') >= 0) return '熟普';
    return '生普';
  }
  if (cat === '代茶类') {
    if (/马黛/.test(name) || /yerba/i.test(id)) return '马黛茶';
    if (/花|玫瑰|菊花|茉莉/.test(tagsStr)) return '花草代茶';
    if (/果|水果/.test(tagsStr)) return '果味代茶';
    return '花草代茶';
  }
  if (cat === '调味茶') {
    if (/薄荷/.test(tagsStr) || /薄荷/.test(name)) return '薄荷调味茶';
    if (/花/.test(tagsStr)) return '花香调味茶';
    if (/果|柑橘|佛手柑|伯爵/.test(tagsStr)) return '果香调味茶';
    return '果香调味茶';
  }
  if (cat === '花茶') {
    if (/茉莉/.test(tagsStr) || /茉莉/.test(name)) return '茉莉花茶';
    return '茉莉花茶';
  }
  return '';
}

export function groupTeasBySubCategory(teas) {
  const map = {};
  teas.forEach(t => {
    const subs = getSubCategories(t);
    subs.forEach(sub => {
      if (!map[sub]) map[sub] = [];
      if (!map[sub].includes(t)) map[sub].push(t);
    });
    if (subs.length === 0) {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    }
  });
  return map;
}

export function getSubCategoriesForCategory(cat, teas) {
  const map = {};
  teas.forEach(t => {
    const subs = getSubCategories(t);
    subs.forEach(sub => {
      if (!map[sub]) map[sub] = 0;
      map[sub]++;
    });
  });
  return map;
}