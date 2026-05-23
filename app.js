var App = (function() {
  'use strict';
  var CHINA_BASE = './china/';
  var WORLD_BASE = './world/';
  var ROUTE_BASE = './route/';
  var TEAHOUSE_BASE = './teahouse/';

  var config = {
    chinaFiles: ['anhui', 'chongqing', 'fujian', 'gansu', 'guangdong', 'guangxi', 'guizhou', 'hainan', 'henan', 'hubei', 'hunan', 'jiangsu', 'jiangxi', 'shaanxi', 'shandong', 'shanghai', 'sichuan', 'taiwan', 'xizang', 'yunnan', 'zhejiang'],
    worldFiles: ['japan', 'india', 'sri-lanka', 'kenya', 'uk', 'turkey', 'korea', 'vietnam', 'indonesia', 'nepal', 'argentina', 'malawi', 'russia', 'morocco', 'thailand', 'tanzania', 'uganda', 'rwanda', 'myanmar', 'bangladesh', 'malaysia', 'iran', 'georgia', 'azerbaijan', 'bhutan', 'laos', 'cambodia', 'philippines', 'uzbekistan', 'ethiopia', 'mozambique', 'zimbabwe', 'south-africa', 'burundi', 'cameroon', 'congo', 'mauritius', 'nigeria', 'germany', 'france', 'portugal', 'brazil', 'peru', 'colombia', 'usa', 'canada', 'australia', 'new-zealand', 'papua-new-guinea'],
    routeFiles: ['tea-horse-road', 'great-tea-road', 'tang-tubo-road', 'southern-silk-road', 'shu-road', 'yunnan-burma-india-road', 'zhangye-ruancha-road', 'kyoto-edo-cha-road', 'marrakech-moroccan-mint-tea-road', 'kyrgyz-pamir-tea-road', 'wuyi-pan-ancient-tea-road', 'sikkim-darjeeling-tea-road', 'congo-african-tea-road', 'brazil-parana-tea-road', 'taiwan-alishan-tea-road'],
    teahouseFiles: [
      'china', 'sichuan', 'beijing', 'jiangsu-shanghai', 
      'japan', 'korea-taiwan', 'uk-europe',
      'india-srilanka', 'turkey-middle-east',
      'southeast-asia', 'americas',
      'hongkong-macau-guangdong', 'fujian-yunnan', 'china-other',
      'russia-africa', 'oceania-others',
      'more-china-teahouses', 'more-international-teahouses',
      'more-china-teahouses-2', 'more-international-teahouses-2'
    ],
    categoryOrder: ['绿茶', '红茶', '乌龙茶', '白茶', '黄茶', '黑茶', '普洱茶', '花茶', '调味茶', '代茶类']
  };

  var cache = {
    teas: null,
    routes: null,
    teahouses: null,
    tagMap: null,
    categoryGroups: null
  };

  var loadingPromises = {
    teas: null,
    routes: null,
    teahouses: null
  };

  var categoryIcons = {
    '绿茶': ['🍃', '🌱', '🍀'],
    '红茶': ['🫖', '🔴', '☕'],
    '乌龙茶': ['🏺', '🍂', '🟠'],
    '白茶': ['🤍', '☁️', '🪶'],
    '黄茶': ['💛', '🌟', '🌼'],
    '黑茶': ['🖤', '🍫', '🏿'],
    '普洱茶': ['🧱', '🌰', '🧉'],
    '代茶类': ['🌿', '🫚', '🍯'],
    '调味茶': ['🌺', '🍊', '🍋'],
    '花茶': ['🌸', '🌷', '💐']
  };

  var categoryDefaultIcon = {
    '绿茶': '🍃', '红茶': '🫖', '乌龙茶': '🏺', '白茶': '🤍',
    '黄茶': '💛', '黑茶': '🖤', '普洱茶': '🧱', '代茶类': '🌿',
    '调味茶': '🌺', '花茶': '🌸'
  };

  var categoryColors = {
    '绿茶': '#3d8b37', '红茶': '#c0392b', '乌龙茶': '#d4a017',
    '白茶': '#a0a8b0', '黄茶': '#e6a817', '黑茶': '#5d4037',
    '普洱茶': '#795548', '代茶类': '#2980b9', '调味茶': '#e84393', '花茶': '#e91e63'
  };

  var continentIcons = {
    '亚洲': '🌏', '欧洲': '🏰', '非洲': '🦁', '南美洲': '💃',
    '北美洲': '🦅', '大洋洲': '🐨', '跨洲际': '🌐'
  };

  var continentColors = {
    '亚洲': '#e67e22', '欧洲': '#2980b9', '非洲': '#27ae60',
    '南美洲': '#8e44ad', '北美洲': '#c0392b', '大洋洲': '#16a085'
  };

  var provinceIcons = {
    '浙江省': '🏯', '福建省': '🏮', '云南省': '🦚', '安徽省': '⛰️', '台湾省': '🌊',
    '广东省': '🐉', '湖南省': '🏞️', '四川省': '🐼', '江苏省': '⛲', '湖北省': '🏛️',
    '广西壮族自治区': '🎋', '江西省': '🏔️', '河南省': '🛕', '贵州省': '🏗️', '陕西省': '🐴',
    '山东省': '⛩️', '重庆市': '🌉', '海南省': '🌴', '甘肃省': '🐪', '西藏自治区': '🏔️', '上海市': '🌆'
  };

  var regionColors = {
    '浙江省': '#4A8B3F', '福建省': '#C0392B', '云南省': '#E67E22', '安徽省': '#8E44AD',
    '台湾省': '#2980B9', '广东省': '#E74C3C', '湖南省': '#D35400', '四川省': '#27AE60',
    '江苏省': '#16A085', '湖北省': '#F39C12', '广西壮族自治区': '#1ABC9C',
    '江西省': '#2ECC71', '河南省': '#E84393', '贵州省': '#6C5CE7', '陕西省': '#B8860B',
    '山东省': '#E74C3C', '重庆市': '#D35400', '海南省': '#2ECC71', '甘肃省': '#F39C12', '西藏自治区': '#9B59B6', '上海市': '#3498DB'
  };

  var countryIcons = {
    '中国': '🐉', '日本': '🗾', '印度': '🕌', '斯里兰卡': '🏝️', '肯尼亚': '🦁', '英国': '🏰',
    '土耳其': '🕌', '韩国': '🏯', '越南': '🌴', '印度尼西亚': '🌋', '尼泊尔': '🏔️',
    '阿根廷': '💃', '马拉维': '🏞️', '俄罗斯': '❄️', '摩洛哥': '🏜️', '泰国': '🛕',
    '法国': '🗼', '跨洲际': '🌐',
    '缅甸': '🪷', '孟加拉国': '🌊', '马来西亚': '🌴', '伊朗': '🕌',
    '格鲁吉亚': '🏔️', '阿塞拜疆': '🔥', '不丹': '🏔️', '老挝': '🌴',
    '柬埔寨': '🛕', '菲律宾': '🏝️', '乌兹别克斯坦': '🐪',
    '埃塞俄比亚': '☕', '莫桑比克': '🌊', '津巴布韦': '🦁',
    '南非': '🏞️', '布隆迪': '🌋', '卢旺达': '⛰️',
    '坦桑尼亚': '🏔️', '乌干达': '🌿', '喀麦隆': '🌴',
    '刚果民主共和国': '🌴', '毛里求斯': '🏝️', '尼日利亚': '🌴',
    '德国': '🏰', '葡萄牙': '⛵', '巴西': '💃',
    '秘鲁': '🏔️', '哥伦比亚': '💃', '美国': '🦅',
    '加拿大': '🍁', '澳大利亚': '🦘', '新西兰': '🥝',
    '巴布亚新几内亚': '🏝️', '中国/蒙古/俄罗斯': '🛤️'
  };

  var countryColors = {
    '中国': '#c0392b', '日本': '#c0392b', '印度': '#e67e22', '斯里兰卡': '#f39c12', '肯尼亚': '#27ae60',
    '英国': '#2980b9', '土耳其': '#c0392b', '韩国': '#e74c3c', '越南': '#d35400',
    '印度尼西亚': '#e67e22', '尼泊尔': '#8e44ad', '阿根廷': '#5dade2', '马拉维': '#27ae60',
    '俄罗斯': '#2c3e50', '摩洛哥': '#16a085', '泰国': '#f1c40f', '法国': '#002395',
    '跨洲际': '#555'
  };

  var tagColors = {
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

  var tagIcons = {
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
    '绿茶皇后': '👑', '乾隆御茶': '🐉', '色绿香郁': '💚', '西湖名胜': '🏞️',
    '明前珍品': '🌅', '手工炒制': '🤲', '非遗技艺': '🎭',
    '氨基酸之王': '🧬', '低温白化': '❄️', '千年茶祖': '🧓', '滋味鲜爽': '💧',
    '宋徽宗赞赏': '📜', '叶白脉绿': '🌿', '烘青绿茶': '🔥',
    '岩茶之王': '👑', '母树珍稀': '💠', '岩骨花香': '⛰️', '七泡余香': '🫧',
    '武夷山': '⛰️', '状元报恩': '🎓', '半壁江山': '🏔️',
    '乌龙极品': '💫', '观音韵': '🧘', '绿叶红镶边': '🍂', '安溪': '🏘️', '春秋茶': '🍂',
    '茶中美女': '👩', '白毫密披': '🤍', '毫香蜜韵': '🍯', '不炒不揉': '🧊',
    '一年茶三年药七年宝': '💊', '福鼎太姥山': '⛰️', '白茶始祖': '🧓',
    '形似牡丹': '🌺', '毫香花香': '🌸', '性价比之选': '💰', '福鼎白茶': '🤍',
    '牡丹王': '🌺', '清甜醇爽': '💧', '陈年药香': '💊',
    '红茶鼻祖': '🧓', '松烟香桂圆汤': '🔥', '桐木关': '🏔️', '荷兰东印度公司': '⛵',
    '马尾松熏焙': '🪵', '青楼工艺': '🏚️', '世界红茶之源': '🌍',
    '北包种南冻顶': '🏔️', '半球形': '🔵', '金黄琥珀': '🟡', '林凤池引进': '📥',
    '中度发酵': '⚗️', '焙火工艺': '🔥', '台湾名茶': '🇹🇼',
    '高山冷韵': '❄️', '蜜绿清澈': '💚', '清香型': '💨', '高海拔': '🏔️',
    '云雾滋养': '☁️', '台湾高山茶': '⛰️', '奶香花韵': '🥛',
    '维多利亚女王': '👸', '小绿叶蝉': '🦗', '蜂蜜果香': '🍯', '五色相间': '🎨',
    '琥珀茶汤': '🟠', '无农药茶园': '🌱', '椪风传奇': '📖',
    '黄山云雾': '☁️', '鱼叶金黄': '✨', '白兰花香': '🌼', '谢正安': '👤',
    '雀舌象牙': '🐦', '板栗香气': '🌰',
    '无芽无梗': '🍂', '单片叶': '🍃', '拉老火': '🔥', '大别山': '⛰️',
    '国礼茶': '🎁', '大别山珍': '💎',
    '世界三大高香红茶': '🌍', '祁门香': '🌸', '蜜糖兰花香': '🍯',
    '红茶皇后': '👑', '巴拿马金奖': '🏅', '余干臣': '👤', '英国皇室': '👑',
    '越陈越香': '⏳', '可以喝的古董': '🏺', '老班章': '🏘️', '易武冰岛': '🏝️',
    '茶马古道': '🐴', '晒青毛茶': '☀️', '云南大叶种': '🌿', '古树茶': '🌳',
    '渥堆发酵': '🫙', '红汤普洱': '🟤', '勐海味': '🏷️', '养胃暖身': '🔥',
    '1973年创制': '📅', '老茶头': '🪨', '7572': '🔢', '大益': '🏭',
    '凤庆大叶种': '🌿', '金芽金毫': '✨', '蜜糖玫瑰香': '🌹', '国宴奶茶': '🥛',
    '英女王赞颂': '👸', '外汇红茶': '💷', '云南红茶': '🟤',
    '红茶香槟': '🍾', '麝香葡萄': '🍇', '喜马拉雅山麓': '🏔️', '英国皇室至爱': '👑',
    '三季采摘': '📅',
    '印度大叶种': '🌿', '麦芽香型': '🌾', '早餐茶灵魂': '🌅', '野生茶树': '🌳',
    '布拉马普特拉': '🌊', '加奶上品': '🥛',
    '蓝山红茶': '⛰️', '花香果韵': '🍇', '冰茶上选': '🧊', '四季采摘': '📅',
    '东欧名品': '🏰', '柔和不涩': '🤍',
    '蒸青工艺': '♨️', '日本国民茶': '🗾', '荣西禅僧': '🧘', '鲜爽草香': '🌿',
    '每日健康': '💚', '静冈名产': '🗻',
    '遮光栽培': '🌑', '石磨碾粉': '🪨', '宇治名品': '🏯',
    '点茶遗风': '📜', '营养全面': '💪',
    '韩式绿茶': '🇰🇷', '宝城郡': '🏘️', '茶祖大廉': '🧓', '智异山': '⛰️',
    '茶禅一味': '🧘', '雀舌形': '🐦',
    '越南之味': '🇻🇳', '炒米香型': '🍚', '市井冰茶': '🧊', '太原山茶': '⛰️',
    '历史悠久': '📜',
    '茉莉花香': '🤍', '爪哇高原': '⛰️', '火山沃土': '🌋', '赤道茶园': '🌴',
    '多次窨花': '🌸', '万隆明珠': '💎',
    '喜马拉雅南麓': '🏔️', '大吉岭近邻': '🏔️', '麝香花香': '🌸',
    '小众精品': '💎', '伊拉姆名品': '⭐', '手工小茶园': '🤲',
    '南美传奇': '💃', '瓜拉尼传统': '🧓', '友谊之杯': '🤝', '马黛树': '🌿',
    '耶稣会茶': '✝️', '阿根廷国饮': '🇦🇷', '高乔文化': '🐎',
    '非洲茶仓': '🏭', 'Mulanje神山': '⛰️', 'CTC主力': '⚙️', '拼配基石': '🧱',
    '马拉维经济支柱': '💰',
    '茶炊国粹': '🫖', '万里茶道': '🛤️', '恰克图贸易': '🤝', '索契茶园': '🏔️',
    '最北茶区': '❄️', '扎瓦尔卡': '🫗', '果酱配茶': '🍓',
    '薄荷绿茶': '🌿', '中国珠茶': '🔴', '三次斟茶': '🫖', '非遗仪式': '🎭',
    '摩洛哥国饮': '🇲🇦', '茶糖薄荷': '🍬', '沙漠之礼': '🏜️',
    '橘橙艳美': '🍊', '炼奶冰茶': '🧊', '美斯乐茶园': '🏔️', '替代种植': '🌱',
    '泰北乌龙': '🏺', '金三角重生': '🔄',
    '英式经典': '🇬🇧', '佛手柑清香': '🍊', '格雷伯爵': '👤', '下午茶标配': '🕒',
    '调味茶之王': '👑',
    '清晨力量': '🌅', '多源调配': '🧪', '加奶醇香': '🥛', '浓郁提神': '⚡',
    '英式传统': '🏰', '早餐伴侣': '🥐',
    '里泽海岸': '🌊', '人均第一': '🥇', '凯末尔推动': '👤', '郁金香小杯': '🌷',
    '社交灵魂': '💬', '双层茶壶': '🫖',
    '黄金液体': '🟡', '三大高香红茶': '🏆', '詹姆斯·泰勒': '👤', '高海拔茶园': '🏔️',
    '柑橘花香': '🍊', '锡兰品牌': '🇱🇰',
    '焦糖木香': '🍮', '中海拔名品': '⛰️', '干冷季巅峰': '❄️', '出口主力': '🚢',
    '质感饱满': '💪',
    'CTC工艺': '⚙️', '世界第一出口': '🥇', '小农模式': '👨‍🌾',
    '浓郁麦香': '🌾', '茶包主力': '📦',
    '槟榔香': '🥜', '侨销茶': '🚢', '祛湿圣品': '💧', '陈年珍品': '⏳',
    '两广名茶': '🐉', '矿区恩物': '⛏️',
    '汉水之源': '🌊', '丝绸之路': '🐪', '茶马交汇': '🐴',
    '秦巴高山': '⛰️', '北方佳茗': '❄️',
    '毛主席命名': '⭐', '富锌富硒': '🧪', '卷曲披毫': '🌀',
    '高原绿茶': '⛰️', '贵州名片': '🏞️',
    '细圆光直': '📏', '苏东坡赞誉': '👤',
    '卷曲如螺': '🌀', '康熙赐名': '👑', '太湖洞庭': '🌊',
    '吓煞人香': '😲', '一嫩三鲜': '🌱',
    '金镶玉': '✨', '三起三落': '🔄', '刀枪林立': '⚔️',
    '黄茶之冠': '👑', '贡茶珍品': '💎', '君山岛': '🏝️',
    '茶马互市': '🐴', '金花菌': '🍄', '茯砖名品': '🧱',
    '生命之茶': '💚', '官茶传奇': '📖', '消食解腻': '🍽️',
    '陈毅命名': '⭐', '峨眉之宝': '⛰️', '形似竹叶': '🎋',
    '嫩栗香': '🌰', '清明珍品': '🌅', '三大绿茶': '🍃',
    '茶中故旧': '📜', '千年贡茶': '👑', '吴理真种茶': '🧓',
    '茶祖圣地': '⛩️', '卷曲形绿茶': '🌀', '蒙顶仙山': '⛰️',
    '宋种古树': '🌳', '鸭屎香': '🦆', '一树一香': '🌿',
    '潮汕工夫茶': '🫖', '七百年历史': '📅', '山韵独特': '⛰️',
    '中国三大红茶': '🇨🇳', '英国女王赞誉': '👸', '浓强鲜爽': '💪',
    '金圈明亮': '✨', '奶茶上品': '🥛', '英红九号': '🔢',
    '庐山胜境': '⛰️', '云雾滋养': '☁️', '东汉起源': '📜',
    '香馨味醇': '🌸', '佛教名茶': '🛕',
    '蒸青活化石': '🦴', '唐代工艺': '📜', '松针形': '🌲',
    '恩施特产': '🏷️', '富硒茶园': '🧪', '传统绿茗': '🍃',
    '京味文化': '🏮', '戏曲茶馆': '🎭', '传统茶艺': '🍵', '历史地标': '📍',
    '园林茶楼': '🏯', '上海地标': '🌆', '古建筑': '🏛️', '江南茶文化': '🌸',
    '成都慢生活': '🐼', '露天茶馆': '🌳', '百年老店': '🏚️', '川茶文化': '🎋',
    '广式早茶': '🥟', '一盅两件': '🍵', '岭南文化': '🐉',
    '日本茶道': '🍵', '抹茶': '💚', '京都': '🏯', '国宝建筑': '🏛️', '千利休': '🧓',
    '日本庭园': '🏞️', '金泽': '🏯', '江户文化': '🎎',
    '韩屋': '🏘️', '花茶': '🌸', '首尔': '🏯', '传统文化街': '🏮',
    '大吉岭红茶': '🍂', '喜马拉雅': '🏔️', '殖民建筑': '🏛️',
    '英式下午茶': '🕒', '约克': '🏰', 'Art Deco': '🎨',
    '皇家茶室': '👑', '英国王室': '👑', '下午茶': '🕒',
    '奢华酒店': '🏨', '伦敦': '🏛️', '爱德华时代': '📅',
    '法式茶': '🥐', '巴黎': '🗼', '茶博物馆': '🏛️', '调香茶': '🧪',
    '摩洛哥薄荷茶': '🌿', '北非': '🏜️', '拉茶仪式': '🫖', '摩尔建筑': '🕌',
    '土耳其红茶': '🫖', '博斯普鲁斯': '🌊', '郁金香杯': '🌷', '欧亚交界': '🌉',
    '俄式茶炊': '🫖', '莫斯科': '🏰', '贵族文化': '👑', 'Samovar': '🫖',
    '红茶': '🫖', '绿茶': '🍃', '白茶': '🤍', '黄茶': '💛', '黑茶': '🖤',
    '花茶': '🌸', '青茶': '🏺', '代茶': '🌿', '调味茶': '🌺',
    '工夫红茶': '🫖', '红碎茶': '🔴', 'CTC红茶': '⚙️', '小种红茶': '🔥',
    '炒青绿茶': '🍳', '蒸青绿茶': '♨️', '晒青绿茶': '☀️', '烘青绿茶': '🔥',
    '滇红': '🦚', '祁红': '🌸', '川红': '🐼', '英红': '🇨🇳',
    '闽红': '🏮', '湖红': '🏞️', '宁红': '⭐', '宜红': '🏔️', '越红': '🎋',
    '中国十大名茶': '🏆', '茶叶': '🍵',
    '萎凋': '☀️', '杀青': '🔥', '焙火': '🔥', '炭焙': '🪵',
    '拼配': '🧩', '渥堆': '📦', '手制': '🤲', '机制': '⚙️',
    '木香': '🪵', '草香': '🌿', '豆香': '🫘', '米香': '🍚',
    '奶香': '🥛', '焦香': '🔥', '甜香': '🍯', '药香': '💊',
    '陈香': '⏳', '玫瑰': '🌹', '茉莉': '🤍', '桂花': '🌼',
    '栀子': '🌺', '肉桂': '🥧',
    '润': '💧', '柔': '🫧', '细': '✨', '腻': '🍯',
    '饱满': '💪', '生津': '💦', '醇和': '🍷', '润滑': '🫧',
    '产地': '🏷️', '原产': '📌', '高山': '🏔️', '丘陵': '⛰️',
    '峰': '🗻', '岩': '🪨', '溪': '💧', '涧': '🌊',
    '古道': '🛤️', '之路': '🛤️', '诗词': '📝', '典故': '📖',
    '习俗': '🎎', '寺庙': '🛕', '佛教': '☸️', '茶马古道': '🐴',
    '抗氧化': '🛡️', '降脂': '📉', '降压': '🩸', '助消化': '🍽️',
    '解毒': '💚', '美容': '💅', '养颜': '✨',
    '畅销': '📈', '热销': '🔥', '收藏': '🏛️', '投资': '💹',
    '口粮': '🍚', '亲民': '🤝',
    '大吉岭': '🏔️', '阿萨姆': '🌿', '尼尔吉里': '⛰️',
    '肯尼亚': '🦁', '斯里兰卡': '🏝️', '马来西亚': '🌴',
    '日本': '🗾', '国宝': '🏛️', '三大高香红茶': '🏆',
    '卷曲': '🌀', '扁平': '📏', '针形': '📌', '条形': '📏', '球形': '🔵',
    '螺形': '🐚', '片形': '🔘', '颗粒': '⚪', '紧结': '🔗', '匀整': '✨',
    '显毫': '🤍', '白毫': '🤍', '金毫': '✨', '银毫': '💫',
    '雀舌': '🐦', '毛峰': '🌿', '松针': '🌲', '金芽': '🌱', '银芽': '🌱',
    '单芽': '🌱', '一芽一叶': '🌱', '一芽二叶': '🌿',
    '陈毅': '👤', '郭沫若': '👤', '柳宗元': '👤', '吴理真': '🧓',
    '卓文君': '👩', '陆羽': '📖', '宋祖英': '👩', '唐睿宗': '👑',
    '宋徽宗': '👑', '朱元璋': '👑', '白居易': '📝', '欧阳修': '📝',
    '王安石': '📝', '赵匡胤': '👑', '蔡襄': '📝',
    '藏茶': '🏔️', '饼茶': '🥮', '沱茶': '🥣', '砖茶': '🧱',
    '紧茶': '📦', '散茶': '🍃', '边茶': '🛣️'
  };

  

  

  

  

  function loadScripts(basePath, files) {
    return Promise.all(files.map(function(f) {
      return loadScript(basePath + f + '.js');
    }));
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  function hashStr(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      if (document.querySelector('script[data-src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.setAttribute('data-src', src);
      s.onload = function() { resolve(src); };
      s.onerror = function(err) {
        console.warn('Failed to load script:', src, err);
        resolve(src);
      };
      document.head.appendChild(s);
    });
  }

  function loadAllChinaData() {
    return loadScripts(CHINA_BASE, config.chinaFiles);
  }

  function loadAllWorldData() {
    return loadScripts(WORLD_BASE, config.worldFiles);
  }

  function loadAllRouteData() {
    return loadScripts(ROUTE_BASE, config.routeFiles);
  }

  function loadAllTeahouseData() {
    return loadScripts(TEAHOUSE_BASE, config.teahouseFiles);
  }

  async function getAllTeas() {
    if (cache.teas) return cache.teas;
    if (loadingPromises.teas) return loadingPromises.teas;
    
    loadingPromises.teas = (async function() {
      await Promise.all([loadAllChinaData(), loadAllWorldData()]);
      cache.teas = [];
      var d = window.TeaData || {};
      var ch = d.china || {};
      var wr = d.world || {};
      Object.keys(ch).forEach(function(k) {
        if (Array.isArray(ch[k])) cache.teas = cache.teas.concat(ch[k]);
      });
      Object.keys(wr).forEach(function(k) {
        if (Array.isArray(wr[k])) cache.teas = cache.teas.concat(wr[k]);
      });
      cache.teas.forEach(function(t) {
        if (!t.subCategory) t.subCategory = getPrimarySubCategory(t);
      });
      window.__teasCache = cache.teas;
      loadingPromises.teas = null;
      return cache.teas;
    })();
    
    return loadingPromises.teas;
  }

  async function getAllRoutes() {
    if (cache.routes) return cache.routes;
    if (loadingPromises.routes) return loadingPromises.routes;
    
    loadingPromises.routes = (async function() {
      await loadAllRouteData();
      cache.routes = [];
      var rt = (window.TeaData || {}).route || {};
      Object.keys(rt).forEach(function(k) {
        if (rt[k] && rt[k].id) cache.routes.push(rt[k]);
      });
      window.__routesCache = cache.routes;
      loadingPromises.routes = null;
      return cache.routes;
    })();
    
    return loadingPromises.routes;
  }

  async function getAllTeahouses() {
    if (cache.teahouses) return cache.teahouses;
    if (loadingPromises.teahouses) return loadingPromises.teahouses;
    
    loadingPromises.teahouses = (async function() {
      await loadAllTeahouseData();
      cache.teahouses = [];
      var th = (window.TeaData || {}).teahouse || {};
      Object.keys(th).forEach(function(k) {
        var val = th[k];
        if (Array.isArray(val)) {
          val.forEach(function(item) { if (item && item.id) cache.teahouses.push(item); });
        } else if (val && val.id) {
          cache.teahouses.push(val);
        }
      });
      window.__teahousesCache = cache.teahouses;
      loadingPromises.teahouses = null;
      return cache.teahouses;
    })();
    
    return loadingPromises.teahouses;
  }

  async function getTagMap() {
    if (cache.tagMap) return cache.tagMap;
    var teas = await getAllTeas();
    cache.tagMap = getTagMapFromTeas(teas);
    return cache.tagMap;
  }

  async function getCategoryGroups() {
    if (cache.categoryGroups) return cache.categoryGroups;
    var teas = await getAllTeas();
    cache.categoryGroups = getCategoryGroupsFromTeas(teas);
    return cache.categoryGroups;
  }

  function getTagMapFromTeas(teas) {
    var map = {};
    teas.forEach(function(t) {
      if (t.tags) {
        t.tags.forEach(function(tag) {
          if (!map[tag]) map[tag] = [];
          map[tag].push(t);
        });
      }
    });
    return map;
  }

  function getCategoryGroupsFromTeas(teas) {
    var map = {};
    teas.forEach(function(t) {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return map;
  }

  function getContinentGroups(teas) {
    var map = {};
    teas.forEach(function(t) {
      if (!map[t.continent]) map[t.continent] = { count: 0, countries: {} };
      map[t.continent].count++;
      map[t.continent].countries[t.country] = (map[t.continent].countries[t.country] || 0) + 1;
    });
    return map;
  }

  function getCountryGroups(teas, continent) {
    var map = {};
    teas.filter(function(t) { return t.continent === continent; }).forEach(function(t) {
      if (!map[t.country]) map[t.country] = { count: 0, provinces: {} };
      map[t.country].count++;
      if (t.province) map[t.country].provinces[t.province] = true;
    });
    return map;
  }

  function getDistrictTeas(teas, city) {
    var map = {};
    teas.filter(function(t) { return t.city === city; }).forEach(function(t) {
      var d = t.district || t.city;
      if (!map[d]) map[d] = [];
      map[d].push(t);
    });
    return map;
  }

  

  function getSubCategories(tea) {
    if (tea.subCategories && tea.subCategories.length > 0) return tea.subCategories;
    var sub = getSubCategoryLegacy(tea);
    return sub ? [sub] : [];
  }

  function getPrimarySubCategory(tea) {
    var subs = getSubCategories(tea);
    return subs.length > 0 ? subs[0] : tea.category;
  }

  function getSubCategoryLegacy(tea) {
    var tags = tea.tags || [];
    var tagsStr = tags.join(' ');
    var cat = tea.category;
    var name = tea.name || '';
    var id = tea.id || '';

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

  function groupTeasBySubCategory(teas) {
    var map = {};
    teas.forEach(function(t) {
      var subs = getSubCategories(t);
      subs.forEach(function(sub) {
        if (!map[sub]) map[sub] = [];
        if (map[sub].indexOf(t) === -1) map[sub].push(t);
      });
      if (subs.length === 0) {
        if (!map[t.category]) map[t.category] = [];
        map[t.category].push(t);
      }
    });
    return map;
  }

  function getSubCategoriesForCategory(cat, teas) {
    var map = {};
    teas.forEach(function(t) {
      var subs = getSubCategories(t);
      subs.forEach(function(sub) {
        if (!map[sub]) map[sub] = 0;
        map[sub]++;
      });
    });
    return map;
  }

  var subCategoryIcons = {
    '炒青绿茶': '🍳', '烘青绿茶': '🔥', '晒青绿茶': '☀️', '蒸青绿茶': '♨️',
    '工夫红茶': '🫖', '小种红茶': '🏕️', '红碎茶': '⚙️', '调味红茶': '🍊',
    '闽北乌龙': '⛰️', '闽南乌龙': '🏮', '广东乌龙': '🐉', '台湾乌龙': '🏔️',
    '白毫银针': '🤍', '白牡丹': '🌺', '寿眉': '🌿', '贡眉': '🌿',
    '黄芽茶': '💛', '生普': '🍃', '熟普': '🧱',
    '湖南黑茶': '🖤', '广西六堡茶': '🫙', '湖北青砖茶': '🧱', '四川藏茶': '🏔️',
    '茉莉花茶': '🤍', '花草代茶': '🌼', '果味代茶': '🍓',
    '花香调味茶': '💐', '果香调味茶': '🍊', '薄荷调味茶': '🌿',
    '马黛茶': '🧉'
  };

  function getTeaIcon(tea) {
    if (!tea || !tea.category) return '🍵';
    var icons = categoryIcons[tea.category];
    if (icons && icons.length > 0) {
      return icons[tea.id ? hashStr(tea.id) % icons.length : 0];
    }
    return categoryDefaultIcon[tea.category] || '🍵';
  }

  function getTeaColor(tea) {
    if (!tea || !tea.category) return '#8B4513';
    return categoryColors[tea.category] || '#8B4513';
  }

  function getRegionIcon(tea) {
    if (!tea) return '';
    if (tea.province && provinceIcons[tea.province]) return provinceIcons[tea.province];
    if (tea.country && countryIcons[tea.country]) return countryIcons[tea.country];
    if (tea.continent && continentIcons[tea.continent]) return continentIcons[tea.continent];
    return '';
  }

  function getRegionColor(tea) {
    if (!tea) return '#8B4513';
    if (tea.province && regionColors[tea.province]) return regionColors[tea.province];
    if (tea.country && countryColors[tea.country]) return countryColors[tea.country];
    if (tea.continent && continentColors[tea.continent]) return continentColors[tea.continent];
    return '#8B4513';
  }

  function getTagIcon(tag) {
    return tagIcons[tag] || '';
  }

  var tagColorPalette = [
    '#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#16a085',
    '#2980b9', '#8e44ad', '#c0392b', '#d35400', '#2ecc71',
    '#1abc9c', '#3498db', '#9b59b6', '#e84393', '#00bcd4',
    '#ff5722', '#795548', '#607d8b', '#f44336', '#4caf50'
  ];

  function getAutoTagColor(tag) {
    var c = tagColors[tag];
    if (c) return c;
    return tagColorPalette[hashStr(tag) % tagColorPalette.length];
  }

  function renderBreadcrumb(items) {
    if (!items || items.length === 0) return '';
    var html = '<nav class="breadcrumb">';
    html += '<a href="#" data-nav="home">🏠 首页</a>';
    items.forEach(function(item, i) {
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

  function renderWaterfall(teas, breadcrumbItems) {
    var shuffled = shuffle(teas);
    var html = renderBreadcrumb(breadcrumbItems || []);
    html += '<div class="waterfall">';
    shuffled.forEach(function(tea, idx) {
      var catColor = getTeaColor(tea);
      var regIcon = getRegionIcon(tea);
      var barColors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#16a085', '#2980b9', '#8e44ad', '#e84393', '#d4a017', '#00bcd4'];
      var barColor = barColors[idx % barColors.length];

      html += '<div class="waterfall-item" data-tea-id="' + tea.id + '" style="--bar:' + barColor + '">';
      html += '<div class="wi-header">';
      html += '<span class="wi-cat-dot" style="background:' + catColor + '"></span>';
      html += '<span class="wi-name" title="' + tea.name + '">' + tea.name + '</span>';
      html += '<span class="wi-cat-tag" style="background:' + catColor + '">' + tea.category + '</span>';
      html += '</div>';
      html += '<div class="wi-body">';
      html += '<div class="wi-subtitle">' + tea.nameEn + '</div>';
      html += '<div class="wi-location">' + (regIcon || '📍') + ' ' + tea.country + (tea.province ? ' · ' + tea.province : '') + (tea.city ? ' · ' + tea.city : '') + '</div>';
      html += '<div class="wi-desc">' + tea.description.substring(0, 100) + '…</div>';
      html += '</div>';
      html += '<div class="wi-tags">';
      (tea.tags || []).slice(0, 3).forEach(function(tag) {
        var tc = getAutoTagColor(tag);
        var ti = getTagIcon(tag);
        html += '<span class="wi-tag" style="background:' + tc + '18;color:' + tc + ';border-color:' + tc + '33">' + (ti || '') + ' ' + tag + '</span>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  }

  function renderTeaDetail(tea) {
    var catColor = getTeaColor(tea);
    var regColor = getRegionColor(tea);
    var regIcon = getRegionIcon(tea);

    var bc = [];
    if (tea.continent) bc.push({ label: tea.continent, nav: 'continent-' + encodeURIComponent(tea.continent) });
    bc.push({ label: tea.country, nav: tea.country === '中国' ? 'china' : 'country-' + encodeURIComponent(tea.country) });
    if (tea.province) bc.push({ label: tea.province, nav: 'province-' + encodeURIComponent(tea.province) });
    if (tea.city) bc.push({ label: tea.city, nav: 'city-' + encodeURIComponent(tea.city) });
    if (tea.district) bc.push({ label: tea.district, nav: 'district-' + encodeURIComponent(tea.district) });
    bc.push({ label: tea.name });

    var html = renderBreadcrumb(bc);
    html += '<div class="detail-page">';
    html += '<div class="detail-header">';
    html += '<h1 class="dh-name">' + tea.name + '</h1>';
    html += '<div class="dh-name-en">' + tea.nameEn + '</div>';
    html += '<div class="dh-meta">';
    html += '<a class="dh-cat-tag" data-nav="category-' + encodeURIComponent(tea.category) + '" style="background:' + catColor + '">' + tea.category + '</a>';
    var subs = getSubCategories(tea);
    subs.forEach(function(sub) {
      if (sub === tea.category) return;
      var subIcon = subCategoryIcons[sub] || '';
      html += '<a class="dh-sub-tag" data-nav="subcategory-' + encodeURIComponent(sub) + '" style="border:1px solid ' + catColor + ';color:' + catColor + '">' + subIcon + ' ' + sub + '</a>';
    });
    html += '<span class="dh-loc-text">' + (regIcon || '📍') + ' ';
    if (tea.continent) html += '<a data-nav="continent-' + encodeURIComponent(tea.continent) + '">' + tea.continent + '</a> · ';
    html += '<a data-nav="' + (tea.country === '中国' ? 'china' : 'country-' + encodeURIComponent(tea.country)) + '">' + tea.country + '</a>';
    if (tea.province) html += ' · <a data-nav="province-' + encodeURIComponent(tea.province) + '">' + tea.province + '</a>';
    if (tea.city) html += ' · <a data-nav="city-' + encodeURIComponent(tea.city) + '">' + tea.city + '</a>';
    if (tea.district) html += ' · <a data-nav="district-' + encodeURIComponent(tea.district) + '">' + tea.district + '</a>';
    html += '</span></div></div>';

    html += '<div class="detail-section" style="border-left:3px solid ' + catColor + '">';
    html += '<div class="ds-title"><span class="ds-icon">✨</span> 特色介绍</div>';
    html += '<p>' + tea.description + '</p></div>';

    if (tea.chronology && tea.chronology.length > 0) {
      html += '<div class="detail-section" style="border-left:3px solid ' + regColor + '">';
      html += '<div class="ds-title"><span class="ds-icon">📜</span> 历史沿革</div>';
      html += '<div class="th-timeline">';
      tea.chronology.forEach(function(item) {
        html += '<div class="th-timeline-item">';
        html += '<div class="th-timeline-marker"></div>';
        html += '<div class="th-timeline-card">';
        if (item.period) html += '<div class="th-timeline-period">' + item.period + '</div>';
        if (item.title) html += '<div class="th-timeline-title">' + item.title + '</div>';
        html += '<div class="th-timeline-content">' + item.content + '</div>';
        html += '</div></div>';
      });
      html += '</div></div>';
      if (tea.historyDetail) {
        html += '<div class="detail-section" style="border-left:3px solid ' + regColor + '">';
        html += '<div class="ds-title"><span class="ds-icon">📖</span> 详细历史</div>';
        html += '<p>' + tea.historyDetail + '</p></div>';
      }
    } else if (tea.historyDetail) {
      html += '<div class="detail-section" style="border-left:3px solid ' + regColor + '">';
      html += '<div class="ds-title"><span class="ds-icon">📖</span> 详细历史</div>';
      html += '<p>' + tea.historyDetail + '</p></div>';
    } else {
      html += '<div class="detail-section" style="border-left:3px solid ' + regColor + '">';
      html += '<div class="ds-title"><span class="ds-icon">📜</span> 历史文化</div>';
      html += '<p>' + tea.history + '</p></div>';
    }

    if (tea.legends) {
      html += '<div class="detail-section" style="border-left:3px solid #e84393">';
      html += '<div class="ds-title"><span class="ds-icon">📚</span> 传说故事</div>';
      html += '<p>' + tea.legends + '</p></div>';
    }

    if (tea.originDetail) {
      html += '<div class="detail-section" style="border-left:3px solid #16a085">';
      html += '<div class="ds-title"><span class="ds-icon">🏔️</span> 产地详情</div>';
      html += '<p>' + tea.originDetail + '</p></div>';
    }

    if (tea.cultivars) {
      html += '<div class="detail-section" style="border-left:3px solid #27ae60">';
      html += '<div class="ds-title"><span class="ds-icon">🌱</span> 茶树品种</div>';
      html += '<p>' + tea.cultivars + '</p></div>';
    }

    if (tea.production) {
      html += '<div class="detail-section" style="border-left:3px solid #e67e22">';
      html += '<div class="ds-title"><span class="ds-icon">🔧</span> 制作工艺</div>';
      html += '<p>' + tea.production + '</p></div>';
    }

    if (tea.grades) {
      html += '<div class="detail-section" style="border-left:3px solid #d4a017">';
      html += '<div class="ds-title"><span class="ds-icon">🏅</span> 品质等级</div>';
      html += '<p>' + tea.grades + '</p></div>';
    }

    html += '<div class="detail-section" style="border-left:3px solid #2980b9">';
    html += '<div class="ds-title"><span class="ds-icon">🔬</span> 品种特点</div>';
    html += '<p>' + tea.characteristics + '</p></div>';

    if (tea.tags && tea.tags.length > 0) {
      html += '<div class="detail-section" style="border-left:3px solid #8e44ad">';
      html += '<div class="ds-title"><span class="ds-icon">🏷️</span> 相关标签</div>';
      html += '<div class="detail-tags">';
      tea.tags.forEach(function(tag) {
        var tc = getAutoTagColor(tag);
        var ti = getTagIcon(tag);
        html += '<span class="detail-tag" data-nav="tag-' + encodeURIComponent(tag) + '" style="background:' + tc + '14;color:' + tc + ';border-color:' + tc + '33">' + (ti || '#') + ' ' + tag + '</span>';
      });
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function renderContinentPage(continent, teas, breadcrumbItems) {
    var groups = getCountryGroups(teas, continent);
    var icon = continentIcons[continent] || '🌏';
    var color = continentColors[continent] || '#8B4513';
    var html = renderBreadcrumb(breadcrumbItems);
    html += '<h1 class="page-title">' + icon + ' ' + continent + '</h1>';
    html += '<p class="page-subtitle">共 ' + teas.length + ' 个茶叶品种，分布在 ' + Object.keys(groups).length + ' 个国家</p>';
    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + color + '">';
    html += '<span class="sgh-label">🌍 国家/地区</span>';
    html += '<span class="sgh-count">' + Object.keys(groups).length + ' 个国家</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    Object.keys(groups).forEach(function(country) {
      var cIcon = countryIcons[country] || icon;
      html += '<div class="category-card" data-nav="country-' + encodeURIComponent(country) + '" style="border-top:3px solid ' + color + '">';
      html += '<div class="cc-icon" style="font-size:1.8rem;">' + cIcon + '</div>';
      html += '<div class="cc-name">' + country + '</div>';
      html += '<div class="cc-count">' + groups[country].count + ' 个品种</div>';
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderCountryPage(country, teas, breadcrumbItems) {
    var cIcon = countryIcons[country] || '🌍';
    var cColor = countryColors[country] || '#8B4513';
    var html = renderBreadcrumb(breadcrumbItems);

    var provMap = {};
    teas.forEach(function(t) {
      var p = t.province || country;
      if (!provMap[p]) provMap[p] = [];
      provMap[p].push(t);
    });
    var provKeys = Object.keys(provMap).sort();

    html += '<h1 class="page-title">' + cIcon + ' ' + country + '</h1>';
    html += '<p class="page-subtitle">共 ' + provKeys.length + ' 个省份/地区，' + teas.length + ' 个茶叶品种</p>';

    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + cColor + '">';
    html += '<span class="sgh-label">🏞️ 省份/地区</span>';
    html += '<span class="sgh-count">' + provKeys.length + ' 个</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    provKeys.forEach(function(prov) {
      var pIcon = provinceIcons[prov] || '🏞️';
      var pColor = regionColors[prov] || cColor;
      html += '<div class="category-card" data-nav="province-' + encodeURIComponent(prov) + '" style="border-top:3px solid ' + pColor + '">';
      html += '<div class="cc-icon" style="font-size:1.8rem;">' + pIcon + '</div>';
      html += '<div class="cc-name">' + prov + '</div>';
      html += '<div class="cc-count">' + provMap[prov].length + ' 个品种</div>';
      html += '</div>';
    });
    html += '</div></div>';

    provKeys.forEach(function(prov) {
      var provTeas = provMap[prov];
      var cityGroups = getCityTeas(provTeas);
      var cityKeys = Object.keys(cityGroups).sort();
      var pIcon = provinceIcons[prov] || '🏞️';
      html += '<div class="section-group">';
      html += '<div class="section-group-header clickable" data-nav="province-' + encodeURIComponent(prov) + '" style="border-left:3px solid ' + cColor + '">';
      html += '<span class="sgh-label">' + pIcon + ' ' + prov + '</span>';
      html += '<span class="sgh-count">' + cityKeys.length + ' 个城市 · ' + provTeas.length + ' 个品种</span>';
      html += '<span class="sgh-arrow">→</span>';
      html += '</div>';
      html += '<div class="category-grid">';
      cityKeys.forEach(function(city) {
        var cityCount = cityGroups[city].length;
        html += '<div class="category-card" data-nav="city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + cColor + '">';
        html += '<div class="cc-icon" style="font-size:1.5rem;">🏙️</div>';
        html += '<div class="cc-name">' + city + '</div>';
        html += '<div class="cc-count">' + cityCount + ' 个品种</div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    });
    return html;
  }

  function getCityTeas(teas) {
    var map = {};
    teas.forEach(function(t) {
      var c = t.city || t.province;
      if (!map[c]) map[c] = [];
      map[c].push(t);
    });
    return map;
  }

  function renderProvincePage(province, teas, breadcrumbItems) {
    var pIcon = provinceIcons[province] || '🏞️';
    var pColor = regionColors[province] || '#8B4513';
    var html = renderBreadcrumb(breadcrumbItems);

    var cityGroups = getCityTeas(teas);
    var cityKeys = Object.keys(cityGroups).sort();

    html += '<h1 class="page-title">' + pIcon + ' ' + province + '</h1>';
    html += '<p class="page-subtitle">共 ' + cityKeys.length + ' 个城市，' + teas.length + ' 个茶叶品种</p>';

    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + pColor + '">';
    html += '<span class="sgh-label">🏙️ 城市</span>';
    html += '<span class="sgh-count">' + cityKeys.length + ' 个</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    cityKeys.forEach(function(city) {
      var cityCount = cityGroups[city].length;
      html += '<div class="category-card" data-nav="city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + pColor + '">';
      html += '<div class="cc-icon" style="font-size:1.5rem;">🏙️</div>';
      html += '<div class="cc-name">' + city + '</div>';
      html += '<div class="cc-count">' + cityCount + ' 个品种</div>';
      html += '</div>';
    });
    html += '</div></div>';

    cityKeys.forEach(function(city) {
      var cityTeas = cityGroups[city];
      var distGroups = getDistrictTeas(cityTeas, city);
      var distKeys = Object.keys(distGroups).sort();
      var hasDistricts = distKeys.length > 1 || (distKeys.length === 1 && distKeys[0] !== city);

      if (hasDistricts) {
        html += '<div class="section-group">';
        html += '<div class="section-group-header clickable" data-nav="city-' + encodeURIComponent(city) + '" style="border-left:3px solid ' + pColor + '">';
        html += '<span class="sgh-label">🏙️ ' + city + '</span>';
        html += '<span class="sgh-count">' + distKeys.length + ' 个县区 · ' + cityTeas.length + ' 个品种</span>';
        html += '<span class="sgh-arrow">→</span>';
        html += '</div>';
        html += '<div class="category-grid">';
        distKeys.forEach(function(dist) {
          html += '<div class="category-card" data-nav="district-' + encodeURIComponent(dist) + '" style="border-top:3px solid ' + pColor + '">';
          html += '<div class="cc-icon" style="font-size:1.5rem;">🏘️</div>';
          html += '<div class="cc-name">' + dist + '</div>';
          html += '<div class="cc-count">' + distGroups[dist].length + ' 个品种</div>';
          html += '</div>';
        });
        html += '</div>';
        html += '</div>';
      }
    });
    return html;
  }

  function renderCityPage(city, teas, breadcrumbItems) {
    var distGroups = getDistrictTeas(teas, city);
    var firstTea = teas[0];
    var cityColor = firstTea ? getRegionColor(firstTea) : '#8B4513';
    var html = renderBreadcrumb(breadcrumbItems);

    var distKeys = Object.keys(distGroups).sort();
    var hasDistricts = distKeys.length > 1 || (distKeys.length === 1 && distKeys[0] !== city);

    html += '<h1 class="page-title">🏙️ ' + city + '</h1>';
    html += '<p class="page-subtitle">' + (hasDistricts ? '共 ' + distKeys.length + ' 个县/区，' : '') + teas.length + ' 个茶叶品种</p>';

    if (hasDistricts) {
      html += '<div class="section-group">';
      html += '<div class="section-group-header" style="border-left:3px solid ' + cityColor + '">';
      html += '<span class="sgh-label">🏘️ 县/区</span>';
      html += '<span class="sgh-count">' + distKeys.length + ' 个</span>';
      html += '</div>';
      html += '<div class="category-grid">';
      distKeys.forEach(function(dist) {
        html += '<div class="category-card" data-nav="district-' + encodeURIComponent(dist) + '" style="border-top:3px solid ' + cityColor + '">';
        html += '<div class="cc-icon" style="font-size:1.8rem;">🏘️</div>';
        html += '<div class="cc-name">' + dist + '</div>';
        html += '<div class="cc-count">' + distGroups[dist].length + ' 个品种</div>';
        html += '</div>';
      });
      html += '</div></div>';

      distKeys.forEach(function(dist) {
        var distTeas = distGroups[dist];
        html += '<div class="section-group">';
        html += '<div class="section-group-header clickable" data-nav="district-' + encodeURIComponent(dist) + '" style="border-left:3px solid ' + cityColor + '">';
        html += '<span class="sgh-label">🏘️ ' + dist + '</span>';
        html += '<span class="sgh-count">' + distTeas.length + ' 个品种</span>';
        html += '<span class="sgh-arrow">→</span>';
        html += '</div>';
        html += renderWaterfall(distTeas, []);
        html += '</div>';
      });
    } else {
      html += renderWaterfall(teas, []);
    }
    return html;
  }

  function renderDistrictPage(district, teas, breadcrumbItems) {
    var html = renderBreadcrumb(breadcrumbItems);
    html += '<h1 class="page-title">🏘️ ' + district + '</h1>';
    html += '<p class="page-subtitle">共 ' + teas.length + ' 个茶叶品种</p>';
    html += renderWaterfall(teas, []);
    return html;
  }

  function renderCategoryPage(category, teas, breadcrumbItems) {
    var icon = categoryDefaultIcon[category] || '🍵';
    var color = categoryColors[category] || '#8B4513';
    var html = renderBreadcrumb(breadcrumbItems);
    html += '<h1 class="page-title">' + icon + ' ' + category + '</h1>';
    html += '<p class="page-subtitle">共 ' + teas.length + ' 个茶叶品种</p>';

    var subGroups = groupTeasBySubCategory(teas);
    var subKeys = Object.keys(subGroups);

    if (subKeys.length >= 1) {
      subKeys.forEach(function(subCat) {
        var subTeas = subGroups[subCat];
        html += '<div class="section-group">';
        html += '<div class="section-group-header clickable" data-nav="subcategory-' + encodeURIComponent(subCat) + '" style="border-left:3px solid ' + color + '">';
        html += '<span class="sgh-label">' + (subCategoryIcons[subCat] || '🍵') + ' ' + subCat + '</span>';
        html += '<span class="sgh-count">' + subTeas.length + ' 种</span>';
        html += '<span class="sgh-arrow">→</span>';
        html += '</div>';
        html += renderWaterfall(subTeas, []);
        html += '</div>';
      });
    } else {
      html += renderWaterfall(teas, []);
    }
    return html;
  }

  function renderTagsPage(tagMap) {
    var sorted = Object.keys(tagMap).map(function(k) { return [k, tagMap[k]]; });
    sorted.sort(function(a, b) { return b[1].length - a[1].length; });

    var html = '<h1 class="page-title">🏷️ 标签总览</h1>';
    html += '<p class="page-subtitle">共 ' + sorted.length + ' 个标签</p>';

    var groupColors = {
      '茶类品种': '#3d8b37', '品质等级': '#d4a017', '外形品相': '#795548', '工艺制法': '#e67e22',
      '风味香气': '#e84393', '口感滋味': '#f39c12', '产地地点': '#2980b9',
      '人物': '#c0392b', '历史文化': '#8e44ad', '民族习俗': '#1abc9c',
      '功效健康': '#16a085', '市场品牌': '#c0392b',
      '国际': '#607d8b', '茶馆建筑': '#795548'
    };

    var categoryMap = {};
    sorted.forEach(function(entry) {
      var tag = entry[0];
      var group = '其他';
      if (/[茶茶]类$|品类|品种/.test(tag) || ['绿茶类', '红茶类', '乌龙茶类', '白茶类', '黄茶类', '黑茶类', '普洱茶类'].indexOf(tag) >= 0) group = '茶类品种';
      else if (/工夫红茶|红碎茶|CTC红茶|小种红茶|炒青绿茶|蒸青绿茶|晒青绿茶|烘青绿茶/.test(tag)) group = '茶类品种';
      else if (/红茶$|绿茶$|白茶$|黄茶$|黑茶$|花茶$|青茶$/.test(tag)) group = '茶类品种';
      else if (/藏茶|边茶|饼茶|沱茶|砖茶|紧茶|散茶|代茶|调味茶/.test(tag)) group = '茶类品种';
      else if (/滇红|祁红|川红|英红|闽红|湖红|宁红|宜红|越红/.test(tag)) group = '茶类品种';
      else if (/名茶|珍品|极品|金奖|贡茶|十大|优质|精品|皇后|之王|之冠|顶级|高端|珍稀|非遗|古树|有机|地理|纯种|纯料|野生|老树|老丛|百年|御茶|御用|皇室|特级|精选/.test(tag)) group = '品质等级';
      else if (/卷曲|扁平|针形|条形|球形|螺形|片形|颗粒|紧结|匀整|显毫|白毫|金毫|银毫|雀舌|毛峰|松针|金芽|银芽|单芽|一芽一叶|一芽二叶/.test(tag)) group = '外形品相';
      else if (/炒|蒸|晒|烘|焙|揉|捻|发酵|工艺|窨花|制作|加工|熏|磨|萎凋|杀青|焙火|炭焙|拼配|渥堆|手制|机制/.test(tag)) group = '工艺制法';
      else if (/香|味|韵|兰|桂|蜜|果|花|槟榔|糖|薄荷|松烟|木香|草香|豆香|米香|奶香|焦香|甜香|药香|陈香|玫瑰|茉莉|桂花|栀子|肉桂/.test(tag) && !/[茶茶]类/.test(tag)) group = '风味香气';
      else if (/甜|甘|醇|爽|滑|浓|鲜|涩|厚|润|柔|细|腻|饱满|生津/.test(tag)) group = '口感滋味';
      else if (/省|市|县|山|岛|湖|海|江|河|高原|盆地|北|南|东|西|茶园|茶区|产地|原产|高山|丘陵|关|渡|口岸|古都/.test(tag) && !/国际|世界|国饮/.test(tag)) group = '产地地点';
      else if (/州$|阳$|都$|陵$|宁$|安$/.test(tag) && !/国际|世界|国饮/.test(tag) && tag.length <= 4) group = '产地地点';
      else if (/陈毅|郭沫若|柳宗元|吴理真|卓文君|陆羽|宋祖英|唐睿宗|宋徽宗|朱元璋|白居易|欧阳修|王安石|赵匡胤|蔡襄/.test(tag)) group = '人物';
      else if (/文化|传统|历史|故事|传说|仪式|禅|圣诞|皇家|女王|皇帝|乾隆|康熙|苏东坡|诗人|作家|茶祖|起源|古道|之路|诗词|典故|习俗|寺庙|佛教|道教|儒教/.test(tag)) group = '历史文化';
      else if (/民族|藏族|羌族|瑶族|侗族|苗族|土家族|汉族|蒙古族/.test(tag)) group = '民族习俗';
      else if (/健康|养生|安神|提神|养胃|消食|祛湿|药|营养|抗衰|保健|补|抗氧化|降脂|降压|助消化|解毒|美容|养颜/.test(tag)) group = '功效健康';
      else if (/热门|推荐|礼品|日常|品牌|出口|市场|明星|爆款|性价比|外汇|畅销|热销|收藏|投资|口粮|亲民/.test(tag)) group = '市场品牌';
      else if (/英式|日式|韩式|法式|俄式|摩洛哥|土耳其|越南|印度|阿根廷|泰国|锡兰|爪哇|印尼|大吉岭|阿萨姆|尼尔吉里|肯尼亚|斯里兰卡|马来西亚|日本/.test(tag) || /国饮|国民|国宝/.test(tag) || /国家|洲际|国际|世界/.test(tag)) group = '国际';
      else if (/茶馆|茶楼|茶室|茶屋|茶行|园林|建筑|酒店/.test(tag)) group = '茶馆建筑';
      if (!categoryMap[group]) categoryMap[group] = [];
      categoryMap[group].push(entry);
    });

    var groupOrder = ['茶类品种', '品质等级', '外形品相', '工艺制法', '风味香气', '口感滋味', '产地地点', '人物', '历史文化', '民族习俗', '功效健康', '市场品牌', '国际', '茶馆建筑', '其他'];

    groupOrder.forEach(function(group) {
      var entries = categoryMap[group];
      if (!entries || entries.length === 0) return;
      var gc = groupColors[group] || '#607d8b';

      html += '<div class="tag-group">';
      html += '<div class="tag-group-header" style="border-left:3px solid ' + gc + '">';
      html += '<span class="tgh-label">' + group + '</span>';
      html += '<span class="tgh-count">' + entries.length + ' 个标签</span>';
      html += '</div>';
      html += '<div class="tag-cloud">';
      entries.forEach(function(entry) {
        var tag = entry[0];
        var teasList = entry[1];
        var tc = getAutoTagColor(tag);
        var ti = getTagIcon(tag);
        html += '<span class="tag-chip" data-nav="tag-' + encodeURIComponent(tag) + '" style="background:' + tc + '15;color:' + tc + ';border-color:' + tc + '40">';
        html += '<span class="tc-icon">' + (ti || '#') + '</span>';
        html += '<span class="tc-name">' + tag + '</span>';
        html += '<span class="tc-count">' + teasList.length + '</span>';
        html += '</span>';
      });
      html += '</div></div>';
    });

    return html;
  }

  function renderTagResultPage(tag, teas) {
    var bc = [{ label: '标签总览', nav: 'tags' }, { label: '#' + tag }];
    var tc = getAutoTagColor(tag);
    var ti = getTagIcon(tag);
    var html = renderBreadcrumb(bc);
    html += '<h1 class="page-title">' + (ti || '🏷️') + ' #' + tag + '</h1>';
    html += '<p class="page-subtitle">找到 ' + teas.length + ' 个相关茶叶品种</p>';
    html += renderWaterfall(teas, []);
    return html;
  }

  function renderRoutesList(routes) {
    var html = '<h1 class="page-title">🛤️ 茶叶之路</h1>';
    html += '<p class="page-subtitle">探索与茶相关的古老贸易路线和文化走廊</p>';

    var continentGroups = {};
    routes.forEach(function(route) {
      var c = route.continent || '跨洲际';
      if (!continentGroups[c]) continentGroups[c] = [];
      continentGroups[c].push(route);
    });

    var order = ['亚洲', '欧洲', '非洲', '南美洲', '北美洲', '大洋洲', '跨洲际'];
    order.forEach(function(cont) {
      var group = continentGroups[cont];
      if (!group || group.length === 0) return;
      var contIcon = continentIcons[cont] || '🌐';
      var contColor = continentColors[cont] || '#555';

      var countryMap = {};
      group.forEach(function(r) {
        var cty = r.country || '跨洲际';
        if (!countryMap[cty]) countryMap[cty] = [];
        countryMap[cty].push(r);
      });
      var countryKeys = Object.keys(countryMap).sort();

      html += '<div class="section-group">';
      html += '<div class="section-group-header" style="border-left:3px solid ' + contColor + '">';
      html += '<span class="sgh-label">' + contIcon + ' ' + cont + '</span>';
      html += '<span class="sgh-count">' + group.length + ' 条古道 · ' + countryKeys.length + ' 个国家</span>';
      html += '<span class="sgh-arrow">→</span>';
      html += '</div>';
      html += '<div class="category-grid">';
      countryKeys.forEach(function(cty) {
        var cIcon = countryIcons[cty] || contIcon;
        var ctyRoutes = countryMap[cty];
        html += '<div class="category-card" data-nav="routes-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + contColor + '">';
        html += '<div class="cc-icon" style="font-size:1.8rem;">' + cIcon + '</div>';
        html += '<div class="cc-name">' + cty + '</div>';
        html += '<div class="cc-count">' + ctyRoutes.length + ' 条古道</div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    });
    return html;
  }

  function renderRoutesContinentPage(continent, routes) {
    var icon = continentIcons[continent] || '🌐';
    var color = continentColors[continent] || '#555';

    var countryGroups = {};
    routes.forEach(function(r) {
      var cty = r.country || '跨洲际';
      if (!countryGroups[cty]) countryGroups[cty] = [];
      countryGroups[cty].push(r);
    });

    var html = renderBreadcrumb([{ label: '茶叶之路', nav: 'routes' }, { label: continent }]);
    html += '<h1 class="page-title">' + icon + ' ' + continent + '</h1>';
    html += '<p class="page-subtitle">共 ' + routes.length + ' 条古道，分布在 ' + Object.keys(countryGroups).length + ' 个国家/地区</p>';
    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + color + '">';
    html += '<span class="sgh-label">🌍 国家/地区</span>';
    html += '<span class="sgh-count">' + Object.keys(countryGroups).length + ' 个国家</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    Object.keys(countryGroups).forEach(function(cty) {
      var cIcon = countryIcons[cty] || icon;
      html += '<div class="category-card" data-nav="routes-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + color + '">';
      html += '<div class="cc-icon" style="font-size:1.8rem;">' + cIcon + '</div>';
      html += '<div class="cc-name">' + cty + '</div>';
      html += '<div class="cc-count">' + countryGroups[cty].length + ' 条古道</div>';
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderRoutesCountryPage(country, routes) {
    var icon = countryIcons[country] || '🌍';
    var color = countryColors[country] || '#8B4513';
    var continent = routes[0] ? routes[0].continent : '';

    var html = renderBreadcrumb([
      { label: '茶叶之路', nav: 'routes' },
      continent ? { label: continent, nav: 'routes-continent-' + encodeURIComponent(continent) } : null,
      { label: country }
    ].filter(Boolean));
    html += '<h1 class="page-title">' + icon + ' ' + country + '</h1>';
    html += '<p class="page-subtitle">共 ' + routes.length + ' 条古道</p>';
    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + color + '">';
    html += '<span class="sgh-label">🛤️ 古道路线</span>';
    html += '<span class="sgh-count">' + routes.length + ' 条</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    routes.forEach(function(route) {
      var rc = route.color || '#8B4513';
      html += '<div class="category-card" data-nav="route-' + route.id + '" style="border-top:3px solid ' + rc + '">';
      html += '<div class="cc-icon" style="font-size:1.8rem;">' + (route.imageIcon || '🛤️') + '</div>';
      html += '<div class="cc-name">' + route.name + '</div>';
      html += '<div class="cc-subtitle">' + route.subtitle + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderTeahousesList(teahouses) {
    var html = '<h1 class="page-title">🏠 世界茶馆</h1>';
    html += '<p class="page-subtitle">探索全球最著名的品茶圣地——从东方茶楼到西方茶室</p>';

    var continentGroups = {};
    teahouses.forEach(function(th) {
      var c = th.continent || '其他';
      if (!continentGroups[c]) continentGroups[c] = [];
      continentGroups[c].push(th);
    });

    var order = ['亚洲', '欧洲', '非洲', '南美洲', '北美洲', '大洋洲', '跨洲际', '其他'];
    order.forEach(function(cont) {
      var group = continentGroups[cont];
      if (!group || group.length === 0) return;
      var contIcon = continentIcons[cont] || '🌐';
      var contColor = continentColors[cont] || '#555';

      var countryMap = {};
      group.forEach(function(th) {
        var cty = th.country || '其他';
        if (!countryMap[cty]) countryMap[cty] = 0;
        countryMap[cty]++;
      });
      var countryKeys = Object.keys(countryMap).sort();

      html += '<div class="section-group">';
      html += '<div class="section-group-header" style="border-left:3px solid ' + contColor + '">';
      html += '<span class="sgh-label">' + contIcon + ' ' + cont + '</span>';
      html += '<span class="sgh-count">' + group.length + ' 家茶馆 · ' + countryKeys.length + ' 个国家</span>';
      html += '<span class="sgh-arrow">→</span>';
      html += '</div>';
      html += '<div class="category-grid">';
      countryKeys.forEach(function(cty) {
        var cIcon = countryIcons[cty] || contIcon;
        html += '<div class="category-card" data-nav="teahouses-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + contColor + '">';
        html += '<div class="cc-icon" style="font-size:1.8rem;">' + cIcon + '</div>';
        html += '<div class="cc-name">' + cty + '</div>';
        html += '<div class="cc-count">' + countryMap[cty] + ' 家茶馆</div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    });
    return html;
  }

  function renderTeahousesContinentPage(continent, teahouses) {
    var icon = continentIcons[continent] || '🌐';
    var color = continentColors[continent] || '#555';

    var countryGroups = {};
    teahouses.forEach(function(th) {
      var cty = th.country || '其他';
      if (!countryGroups[cty]) countryGroups[cty] = [];
      countryGroups[cty].push(th);
    });

    var html = renderBreadcrumb([{ label: '世界茶馆', nav: 'teahouses' }, { label: continent }]);
    html += '<h1 class="page-title">' + icon + ' ' + continent + '</h1>';
    html += '<p class="page-subtitle">共 ' + teahouses.length + ' 家茶馆，分布在 ' + Object.keys(countryGroups).length + ' 个国家</p>';
    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + color + '">';
    html += '<span class="sgh-label">🌍 国家/地区</span>';
    html += '<span class="sgh-count">' + Object.keys(countryGroups).length + ' 个国家</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    Object.keys(countryGroups).forEach(function(cty) {
      var cIcon = countryIcons[cty] || icon;
      html += '<div class="category-card" data-nav="teahouses-country-' + encodeURIComponent(cty) + '" style="border-top:3px solid ' + color + '">';
      html += '<div class="cc-icon" style="font-size:1.8rem;">' + cIcon + '</div>';
      html += '<div class="cc-name">' + cty + '</div>';
      html += '<div class="cc-count">' + countryGroups[cty].length + ' 家茶馆</div>';
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderTeahousesCountryPage(country, teahouses) {
    var icon = countryIcons[country] || '🌍';
    var color = countryColors[country] || '#8B4513';
    var continent = teahouses[0] ? teahouses[0].continent : '';

    var provGroups = {};
    teahouses.forEach(function(th) {
      var p = th.province || th.country;
      if (!provGroups[p]) provGroups[p] = { teahouses: [], cities: {} };
      provGroups[p].teahouses.push(th);
      var c = th.city || '其他';
      provGroups[p].cities[c] = true;
    });
    var provKeys = Object.keys(provGroups).sort();

    var html = renderBreadcrumb([
      { label: '世界茶馆', nav: 'teahouses' },
      continent ? { label: continent, nav: 'teahouses-continent-' + encodeURIComponent(continent) } : null,
      { label: country }
    ].filter(Boolean));
    html += '<h1 class="page-title">' + icon + ' ' + country + '</h1>';
    html += '<p class="page-subtitle">共 ' + provKeys.length + ' 个省/地区，' + teahouses.length + ' 家茶馆</p>';

    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + color + '">';
    html += '<span class="sgh-label">🏞️ 省/地区</span>';
    html += '<span class="sgh-count">' + provKeys.length + ' 个</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    provKeys.forEach(function(prov) {
      var pIcon = provinceIcons[prov] || '🏞️';
      html += '<div class="category-card" data-nav="teahouses-province-' + encodeURIComponent(prov) + '" style="border-top:3px solid ' + color + '">';
      html += '<div class="cc-icon" style="font-size:1.8rem;">' + pIcon + '</div>';
      html += '<div class="cc-name">' + prov + '</div>';
      html += '<div class="cc-count">' + provGroups[prov].teahouses.length + ' 家茶馆</div>';
      html += '</div>';
    });
    html += '</div></div>';

    provKeys.forEach(function(prov) {
      var provData = provGroups[prov];
      var cityKeys = Object.keys(provData.cities).sort();
      html += '<div class="section-group">';
      html += '<div class="section-group-header clickable" data-nav="teahouses-province-' + encodeURIComponent(prov) + '" style="border-left:3px solid ' + color + '">';
      html += '<span class="sgh-label">🏞️ ' + prov + '</span>';
      html += '<span class="sgh-count">' + cityKeys.length + ' 个城市 · ' + provData.teahouses.length + ' 家茶馆</span>';
      html += '<span class="sgh-arrow">→</span>';
      html += '</div>';
      html += '<div class="category-grid">';
      cityKeys.forEach(function(city) {
        var cityCount = provData.teahouses.filter(function(th) { return th.city === city; }).length;
        html += '<div class="category-card" data-nav="teahouses-city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + color + '">';
        html += '<div class="cc-icon" style="font-size:1.5rem;">🏙️</div>';
        html += '<div class="cc-name">' + city + '</div>';
        html += '<div class="cc-count">' + cityCount + ' 家茶馆</div>';
        html += '</div>';
      });
      html += '</div></div>';
    });
    return html;
  }

  function renderTeahousesProvincePage(province, teahouses) {
    var first = teahouses[0];
    var continent = first ? first.continent : '';
    var country = first ? first.country : '';
    var pIcon = provinceIcons[province] || '🏞️';
    var color = countryColors[country] || '#8B4513';

    var cityGroups = {};
    teahouses.forEach(function(th) {
      var c = th.city || '其他';
      if (!cityGroups[c]) cityGroups[c] = [];
      cityGroups[c].push(th);
    });
    var cityKeys = Object.keys(cityGroups).sort();

    var html = renderBreadcrumb([
      { label: '世界茶馆', nav: 'teahouses' },
      continent ? { label: continent, nav: 'teahouses-continent-' + encodeURIComponent(continent) } : null,
      country ? { label: country, nav: 'teahouses-country-' + encodeURIComponent(country) } : null,
      { label: province }
    ].filter(Boolean));
    html += '<h1 class="page-title">' + pIcon + ' ' + province + '</h1>';
    html += '<p class="page-subtitle">共 ' + cityKeys.length + ' 个城市，' + teahouses.length + ' 家茶馆</p>';

    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + color + '">';
    html += '<span class="sgh-label">🏙️ 城市</span>';
    html += '<span class="sgh-count">' + cityKeys.length + ' 个</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    cityKeys.forEach(function(city) {
      html += '<div class="category-card" data-nav="teahouses-city-' + encodeURIComponent(city) + '" style="border-top:3px solid ' + color + '">';
      html += '<div class="cc-icon" style="font-size:1.5rem;">🏙️</div>';
      html += '<div class="cc-name">' + city + '</div>';
      html += '<div class="cc-count">' + cityGroups[city].length + ' 家茶馆</div>';
      html += '</div>';
    });
    html += '</div></div>';

    cityKeys.forEach(function(city) {
      var cityThs = cityGroups[city];
      html += '<div class="section-group">';
      html += '<div class="section-group-header clickable" data-nav="teahouses-city-' + encodeURIComponent(city) + '" style="border-left:3px solid ' + color + '">';
      html += '<span class="sgh-label">🏙️ ' + city + '</span>';
      html += '<span class="sgh-count">' + cityThs.length + ' 家茶馆</span>';
      html += '<span class="sgh-arrow">→</span>';
      html += '</div>';
      html += '<div class="category-grid">';
      cityThs.forEach(function(th) {
        var tcol = th.color || '#8B4513';
        html += '<div class="category-card" data-nav="teahouse-' + th.id + '" style="border-top:3px solid ' + tcol + '">';
        html += '<div class="cc-icon" style="font-size:1.8rem;">' + (th.imageIcon || '🏠') + '</div>';
        html += '<div class="cc-name">' + th.name + '</div>';
        html += '<div class="cc-subtitle">' + th.country + ' · ' + th.city + '</div>';
        html += '</div>';
      });
      html += '</div></div>';
    });
    return html;
  }

  function renderTeahousesCityPage(city, teahouses) {
    var first = teahouses[0];
    var color = (first && first.color) || '#8B4513';
    var continent = first ? first.continent : '';
    var country = first ? first.country : '';
    var province = first ? first.province : '';

    var html = renderBreadcrumb([
      { label: '世界茶馆', nav: 'teahouses' },
      continent ? { label: continent, nav: 'teahouses-continent-' + encodeURIComponent(continent) } : null,
      country ? { label: country, nav: 'teahouses-country-' + encodeURIComponent(country) } : null,
      province ? { label: province, nav: 'teahouses-province-' + encodeURIComponent(province) } : null,
      { label: city }
    ].filter(Boolean));
    html += '<h1 class="page-title">🏙️ ' + city + '</h1>';
    html += '<p class="page-subtitle">共 ' + teahouses.length + ' 家茶馆</p>';
    html += '<div class="section-group">';
    html += '<div class="section-group-header" style="border-left:3px solid ' + color + '">';
    html += '<span class="sgh-label">🏠 茶馆</span>';
    html += '<span class="sgh-count">' + teahouses.length + ' 家</span>';
    html += '</div>';
    html += '<div class="category-grid">';
    teahouses.forEach(function(th) {
      var tcol = th.color || '#8B4513';
      html += '<div class="category-card" data-nav="teahouse-' + th.id + '" style="border-top:3px solid ' + tcol + '">';
      html += '<div class="cc-icon" style="font-size:1.8rem;">' + (th.imageIcon || '🏠') + '</div>';
      html += '<div class="cc-name">' + th.name + '</div>';
      html += '<div class="cc-subtitle">' + th.country + ' · ' + th.city + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function processTeaPlaceholders(text, teaMap) {
    if (!text) return text;
    return text.replace(/\{\{tea:([\w-]+)\}\}/g, function(match, teaId) {
      var tea = teaMap[teaId];
      if (!tea) return '';
      var icon = getTeaIcon(tea);
      var tc = getTeaColor(tea);
      var ri = getRegionIcon(tea);
      return '<div class="route-tea-card" data-tea-id="' + tea.id + '" style="border-left:3px solid ' + tc + '">' +
        '<div class="rtc-icon">' + icon + '</div>' +
        '<div class="rtc-info">' +
        '<div class="rtc-name">' + tea.name + ' <span class="rtc-cat" style="background:' + tc + '">' + tea.category + '</span></div>' +
        '<div class="rtc-loc">' + (ri || '📍') + ' ' + tea.country + (tea.province ? ' · ' + tea.province : '') + (tea.city ? ' · ' + tea.city : '') + '</div>' +
        '<div class="rtc-desc">' + tea.description.substring(0, 80) + '…</div>' +
        '</div></div>';
    });
  }

  function renderTeahouseDetail(th, relatedTeas) {
    var teaMap = {};
    (relatedTeas || []).forEach(function(t) { teaMap[t.id] = t; });
    var bc = [
      { label: '世界茶馆', nav: 'teahouses' },
      th.continent ? { label: th.continent, nav: 'teahouses-continent-' + encodeURIComponent(th.continent) } : null,
      th.country ? { label: th.country, nav: 'teahouses-country-' + encodeURIComponent(th.country) } : null,
      th.province ? { label: th.province, nav: 'teahouses-province-' + encodeURIComponent(th.province) } : null,
      th.city ? { label: th.city, nav: 'teahouses-city-' + encodeURIComponent(th.city) } : null,
      { label: th.name }
    ].filter(Boolean);
    var tcol = th.color || '#8B4513';
    var html = renderBreadcrumb(bc);
    html += '<div class="teahouse-detail">';
    html += '<div class="route-detail-header">';
    html += '<div class="rdh-icon">' + (th.imageIcon || '🏠') + '</div>';
    html += '<h1 class="rdh-name">' + th.name + '</h1>';
    if (th.nameEn) html += '<div class="rdh-subtitle">' + th.nameEn + '</div>';
    html += '</div>';

    html += '<div class="route-info-grid">';

    if (th.description) {
      html += '<div class="route-info-card route-info-full"><div class="ric-label">📋 概述</div><div class="ric-text">' + processTeaPlaceholders(th.description, teaMap) + '</div></div>';
    }

    if (th.address) {
      var addrText = th.country + ' · ' + th.city + ' · ' + th.address;
      var mapSearchAddr = encodeURIComponent(addrText);
      html += '<div class="route-info-card">';
      html += '<div class="ric-label">📍 地址</div>';
      html += '<div class="ric-text" style="margin-bottom:6px;">' + addrText + '</div>';
      html += '<div class="ric-links">';
      html += '<a class="ric-link-btn ric-link-amap" href="https://uri.amap.com/search?keyword=' + mapSearchAddr + '" target="_blank" rel="noopener">🗺️ 高德地图</a>';
      html += '<a class="ric-link-btn ric-link-google" href="https://www.google.com/maps/search/' + mapSearchAddr + '" target="_blank" rel="noopener">🌍 Google 地图</a>';
      html += '</div>';
      html += '</div>';
    }
    if (th.style) html += '<div class="route-info-card"><div class="ric-label">🏛️ 风格</div><div class="ric-text">' + th.style + '</div></div>';
    if (th.established) html += '<div class="route-info-card"><div class="ric-label">📅 创立</div><div class="ric-text">' + th.established + '</div></div>';
    if (th.specialty) html += '<div class="route-info-card"><div class="ric-label">🍵 特色茶品</div><div class="ric-text">' + th.specialty + '</div></div>';
    if (th.highlight) html += '<div class="route-info-card"><div class="ric-label">✨ 亮点</div><div class="ric-text">' + th.highlight + '</div></div>';

    var searchName = encodeURIComponent(th.name);
    html += '<div class="route-info-card">';
    html += '<div class="ric-label">📹 视频资料</div>';
    html += '<div class="ric-links">';
    html += '<a class="ric-link-btn ric-link-dy" href="https://www.douyin.com/search/' + searchName + '" target="_blank" rel="noopener">🎵 抖音</a>';
    html += '<a class="ric-link-btn ric-link-bl" href="https://search.bilibili.com/all?keyword=' + searchName + '" target="_blank" rel="noopener">📺 哔哩哔哩</a>';
    html += '<a class="ric-link-btn ric-link-xs" href="https://www.xiaohongshu.com/search_result?keyword=' + searchName + '" target="_blank" rel="noopener">📖 小红书</a>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="th-body">';

    if (th.chronology && th.chronology.length > 0) {
      html += '<h3 class="th-section-title">📜 历史沿革</h3>';
      html += '<div class="th-timeline">';
      th.chronology.forEach(function(item) {
        var isTeaCard = !item.period && !item.title && item.content && /^\{\{tea:/.test(item.content);
        if (isTeaCard) {
          html += '<div class="th-tea-card-standalone">';
          html += processTeaPlaceholders(item.content, teaMap);
          html += '</div>';
          return;
        }
        html += '<div class="th-timeline-item">';
        html += '<div class="th-timeline-marker"></div>';
        html += '<div class="th-timeline-card">';
        if (item.period) html += '<div class="th-timeline-period">' + item.period + '</div>';
        if (item.title) html += '<div class="th-timeline-title">' + item.title + '</div>';
        html += '<div class="th-timeline-content">' + processTeaPlaceholders(item.content, teaMap) + '</div>';
        html += '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    if (th.tags && th.tags.length > 0) {
      html += '<div class="th-tags-section">';
      html += '<div class="th-tags-title">🏷️ 标签</div>';
      html += '<div class="th-tags">';
      th.tags.forEach(function(tag) {
        var tc = getAutoTagColor(tag);
        html += '<span class="th-tag" data-nav="tag-' + encodeURIComponent(tag) + '" style="background:' + tc + '20;color:' + tc + ';border:1px solid ' + tc + '40">' + tag + '</span>';
      });
      html += '</div></div>';
    }
    html += '</div>';
    html += '</div>';

    if (relatedTeas && relatedTeas.length > 0) {
      html += '<div class="route-related-teas">';
      html += '<h2 class="home-section-title">🍵 相关茶叶品种</h2>';
      html += renderWaterfall(relatedTeas, []);
      html += '</div>';
    }

    return html;
  }

  function renderElevationChart(stations, roadLegend, routeColor) {
    var W = 620, H = 240;
    var pad = { t: 14, r: 10, b: 66, l: 44 };
    var iW = W - pad.l - pad.r;
    var iH = H - pad.t - pad.b;
    var n = stations.length;

    var maxAlt = -Infinity, minAlt = Infinity;
    for (var i = 0; i < n; i++) {
      maxAlt = Math.max(maxAlt, stations[i].alt);
      minAlt = Math.min(minAlt, stations[i].alt);
    }
    var altR = maxAlt - minAlt || 500;
    minAlt = Math.floor(minAlt / 200) * 200;
    maxAlt = Math.ceil(maxAlt / 200) * 200;
    altR = maxAlt - minAlt;

    var maxKm = stations[n - 1].distKm;
    function x(d) { return pad.l + (d / maxKm) * iW; }
    function y(a) { return pad.t + iH - ((a - minAlt) / altR) * iH; }

    var html = '<div class="elevation-container">';
    html += '<svg viewBox="0 0 ' + W + ' ' + H + '" class="elevation-chart">';

    var clipperId = 'clip-' + Math.random().toString(36).slice(2, 8);
    html += '<defs><clipPath id="' + clipperId + '"><rect x="' + pad.l + '" y="' + pad.t + '" width="' + iW + '" height="' + iH + '"/></clipPath></defs>';

    for (var g = 0; g <= 4; g++) {
      var ay = pad.t + (g / 4) * iH;
      var av = Math.round(maxAlt - (g / 4) * altR);
      html += '<line x1="' + pad.l + '" y1="' + ay + '" x2="' + (W - pad.r) + '" y2="' + ay + '" stroke="#e0e0e0" stroke-dasharray="3,3"/>';
      html += '<text x="' + (pad.l - 5) + '" y="' + (ay + 4) + '" text-anchor="end" font-size="9" fill="#999">' + av + 'm</text>';
    }

    var baseline = pad.t + iH;
    html += '<g clip-path="url(#' + clipperId + ')">';
    for (var i = 0; i < n - 1; i++) {
      var sx = x(stations[i].distKm), sy = y(stations[i].alt);
      var ex = x(stations[i + 1].distKm), ey = y(stations[i + 1].alt);
      var rcol = roadColorMap[stations[i + 1].road] || routeColor;

      html += '<polygon points="' + sx + ',' + sy + ' ' + ex + ',' + ey + ' ' + ex + ',' + baseline + ' ' + sx + ',' + baseline + '" fill="' + rcol + '" fill-opacity="0.12"/>';
      html += '<line x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '" stroke="' + rcol + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><title>' + stations[i+1].road + ': ' + stations[i].name + ' → ' + stations[i+1].name + '</title></line>';
    }
    html += '</g>';

    for (var i = 0; i < n; i++) {
      var cx = x(stations[i].distKm), cy = y(stations[i].alt);
      html += '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="' + routeColor + '" stroke="#fff" stroke-width="1.5"><title>' + stations[i].name + ' ' + stations[i].altitude + '</title></circle>';
    }

    var bl = pad.t + iH + 6;
    for (var i = 0; i < n; i++) {
      var bx = x(stations[i].distKm);
      html += '<line x1="' + bx + '" y1="' + bl + '" x2="' + bx + '" y2="' + (bl + 4) + '" stroke="#ddd" stroke-width="0.3"/>';
    }

    var minGap = 50;
    var lastLabelX = -Infinity;
    var labelRow = 0;
    var labelOrder = [];
    for (var i = 0; i < n; i++) {
      var bx = x(stations[i].distKm);
      var isFirst = (i === 0);
      var isLast = (i === n - 1);
      if (!isFirst && !isLast && (bx - lastLabelX) < minGap) continue;
      labelOrder.push({ idx: i, bx: bx, row: labelRow, first: isFirst, last: isLast });
      labelRow = 1 - labelRow;
      lastLabelX = bx;
    }

    for (var k = 0; k < labelOrder.length; k++) {
      var lo = labelOrder[k];
      var ly = bl + 12 + lo.row * 13;
      var name = stations[lo.idx].name;
      var anchor = lo.first ? 'start' : lo.last ? 'end' : 'middle';
      html += '<text x="' + lo.bx + '" y="' + ly + '" text-anchor="' + anchor + '" font-size="6" fill="#555" font-weight="600">' + name + '</text>';
    }

    html += '</svg>';

    if (roadLegend && roadLegend.length > 0) {
      html += '<div class="ec-legend">';
      html += '<div class="ec-l-title">🛤️ 路况</div>';
      roadLegend.forEach(function(rl) {
        html += '<div class="ec-l-item"><span class="ec-l-dot" style="background:' + rl.color + '"></span><span class="ec-l-label">' + rl.type + '</span></div>';
      });
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  var roadColorMap = {
    '古镇石板路': '#8B6914', '山间马道': '#A0522D', '森林小径': '#4A7C59',
    '碎石山路': '#808080', '乡间土路': '#C4A35A', '峡谷险道': '#6B3A2A',
    '草原牧道': '#7B9E5A', '雪山垭口': '#B0C4DE', '公路': '#4682B4',
    '沙漠驼道': '#D2B48C', '戈壁荒漠': '#C4A882', '茶园小径': '#6B8E4E',
    '悬崖栈道': '#555', '水路/渡口': '#1B5E84', '村庄小路': '#A0522D'
  };

  

  

  function renderRouteDetail(route, relatedTeas) {
    var bc = [
      { label: '茶叶之路', nav: 'routes' },
      route.continent ? { label: route.continent, nav: 'routes-continent-' + encodeURIComponent(route.continent) } : null,
      route.country && route.country !== route.continent ? { label: route.country, nav: 'routes-country-' + encodeURIComponent(route.country) } : null,
      { label: route.name }
    ].filter(Boolean);
    var rc = route.color || '#8B4513';
    var html = renderBreadcrumb(bc);
    html += '<div class="route-detail">';
    html += '<div class="route-detail-header">';
    html += '<div class="rdh-icon">' + (route.imageIcon || '🛤️') + '</div>';
    html += '<h1 class="rdh-name">' + route.name + '</h1>';
    html += '<div class="rdh-subtitle">' + route.subtitle + '</div>';
    html += '</div>';

    html += '<div class="route-info-grid">';
    if (route.summary) html += '<div class="route-info-card route-info-full"><div class="ric-label">📋 概述</div><div class="ric-text">' + route.summary + '</div></div>';
    if (route.distance) html += '<div class="route-info-card"><div class="ric-label">📏 总距离</div><div class="ric-text">' + route.distance + '</div></div>';
    if (route.duration) html += '<div class="route-info-card"><div class="ric-label">⏱️ 历时</div><div class="ric-text">' + route.duration + '</div></div>';
    if (route.difficulty) html += '<div class="route-info-card"><div class="ric-label">⚠️ 难度</div><div class="ric-text">' + route.difficulty + '</div></div>';
    if (route.bestSeason) html += '<div class="route-info-card"><div class="ric-label">📅 最佳季节</div><div class="ric-text">' + route.bestSeason + '</div></div>';
    if (route.terrain) html += '<div class="route-info-card"><div class="ric-label">⛰️ 地形特征</div><div class="ric-text">' + route.terrain + '</div></div>';
    if (route.mainTea) html += '<div class="route-info-card"><div class="ric-label">🍵 主要运送茶叶</div><div class="ric-text">' + route.mainTea + '</div></div>';
    var routeSearchName = encodeURIComponent(route.name);
    html += '<div class="route-info-card">';
    html += '<div class="ric-label">📹 视频资料</div>';
    html += '<div class="ric-links">';
    html += '<a class="ric-link-btn ric-link-dy" href="https://www.douyin.com/search/' + routeSearchName + '" target="_blank" rel="noopener">🎵 抖音</a>';
    html += '<a class="ric-link-btn ric-link-bl" href="https://search.bilibili.com/all?keyword=' + routeSearchName + '" target="_blank" rel="noopener">📺 哔哩哔哩</a>';
    html += '<a class="ric-link-btn ric-link-xs" href="https://www.xiaohongshu.com/search_result?keyword=' + routeSearchName + '" target="_blank" rel="noopener">📖 小红书</a>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="route-map">';
    html += '<div class="satellite-map-header">🛰️ 卫星路线图</div>';
    html += '<div id="route-map-' + route.id + '" class="route-satellite-map"></div>';
    html += '</div>';

    if (route.stations && route.stations.length > 0) {
      html += '<div class="route-map">';
      html += '<div class="rm-header">🗺️ 路线全览';
      if (route.distance) html += '<span class="rm-distance-label">总长约' + route.distance + '</span>';
      html += '</div>';
      html += renderElevationChart(route.stations, route.roadLegend, rc);
      html += '<div class="rm-timeline">';
      route.stations.forEach(function(st, i) {
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

    var teaMap = {};
    relatedTeas.forEach(function(t) { teaMap[t.id] = t; });

    var storyHtml = route.story;
    storyHtml = processTeaPlaceholders(storyHtml, teaMap);

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = storyHtml;
    var children = tempDiv.childNodes;
    var processed = '';
    for (var i = 0; i < children.length; i++) {
      var node = children[i];
      if (node.nodeType === 1) {
        if (node.classList && node.classList.contains('route-tea-card')) {
          processed += node.outerHTML;
        } else if (node.tagName === 'P') {
          processed += '<div class="route-story-block" style="border-left:3px solid ' + rc + '">';
          processed += '<div class="rsb-header"><span class="rsb-dot" style="background:' + rc + '"></span><span class="rsb-label">' + node.textContent.trim().substring(0, 18) + '…</span></div>';
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
      html += '<div class="route-related-teas">';
      html += '<h2 class="home-section-title">🍵 相关茶叶品种</h2>';
      html += renderWaterfall(relatedTeas, []);
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderVarietiesMenu(categories) {
    var html = '<h1 class="page-title">🌿 茶叶种类</h1>';
    html += '<p class="page-subtitle">按照加工工艺和发酵程度逐级浏览全球茶叶品种</p>';

    config.categoryOrder.forEach(function(cat) {
      var teas = categories[cat];
      if (!teas || teas.length === 0) return;
      var subCats = getSubCategoriesForCategory(cat, teas);
      var subKeys = Object.keys(subCats);

      var icon = categoryDefaultIcon[cat] || '🍵';
      var color = categoryColors[cat] || '#8B4513';

      html += '<div class="section-group">';
      html += '<div class="section-group-header clickable" data-nav="category-' + encodeURIComponent(cat) + '" style="border-left:3px solid ' + color + '">';
      html += '<span class="sgh-label">' + icon + ' ' + cat + '</span>';
      html += '<span class="sgh-count">' + teas.length + ' 种' + (subKeys.length > 1 ? ' · ' + subKeys.length + ' 个子类' : '') + '</span>';
      html += '<span class="sgh-arrow">→</span>';
      html += '</div>';

      html += '<div class="category-grid">';
      subKeys.forEach(function(subCat) {
        html += '<div class="category-card" data-nav="subcategory-' + encodeURIComponent(subCat) + '" style="border-top:3px solid ' + color + '">';
        html += '<div class="cc-icon" style="font-size:1.5rem;">' + (subCategoryIcons[subCat] || '🍵') + '</div>';
        html += '<div class="cc-name">' + subCat + '</div>';
        html += '<div class="cc-count">' + subCats[subCat] + ' 种</div>';
        html += '</div>';
      });
      html += '</div>';
      html += '</div>';
    });
    return html;
  }

  function $(sel) { return document.querySelector(sel); }

  function setHTML(sel, html) {
    var el = typeof sel === 'string' ? $(sel) : sel;
    if (el) el.innerHTML = html;
  }

  function updateNavActive(hashStr) {
    var prefix = hashStr;
    if (hashStr.indexOf('-') > 0) {
      var p = hashStr.split('-');
      prefix = p[0];
      if (p.length >= 3 && (p[0] === 'routes' || p[0] === 'teahouses')) prefix = p[0];
    }

    var map = {
      'home': 'nav-home',
      'china': 'nav-china', 'province': 'nav-china', 'city': 'nav-china', 'district': 'nav-china',
      'world': 'nav-world', 'continent': 'nav-world', 'country': 'nav-world',
      'varieties': 'nav-varieties', 'category': 'nav-varieties', 'subcategory': 'nav-varieties',
      'routes': 'nav-routes', 'route': 'nav-routes',
      'teahouses': 'nav-teahouses', 'teahouse': 'nav-teahouses',
      'tags': 'nav-tags', 'tag': 'nav-tags',
      'search': 'nav-search'
    };

    var activeId = map[prefix] || '';
    var allLinks = document.querySelectorAll('.header-nav a');
    for (var i = 0; i < allLinks.length; i++) {
      var link = allLinks[i];
      if (link.id === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  }

  async function navigate(hash) {
    var main = $('#main-content');

    var hashStr = hash || (window.location.hash || '#').replace('#', '') || 'home';
    if (!hashStr || hashStr === 'home') {
      updateNavActive('home');
      await renderHome();
      return;
    }

    var parts = hashStr.split('-');
    var route, param;

    if (parts.length >= 3 && (parts[0] === 'routes' || parts[0] === 'teahouses')) {
      var twoPart = parts[0] + '-' + parts[1];
      if (twoPart === 'routes-continent' || twoPart === 'routes-country' ||
          twoPart === 'teahouses-continent' || twoPart === 'teahouses-country' ||
          twoPart === 'teahouses-city' || twoPart === 'teahouses-province') {
        route = twoPart;
        param = decodeURIComponent(parts.slice(2).join('-'));
      } else {
        route = parts[0];
        param = decodeURIComponent(parts.slice(1).join('-'));
      }
    } else {
      route = parts[0];
      param = decodeURIComponent(parts.slice(1).join('-'));
    }

    try {
      updateNavActive(hashStr);
      var allTeas = await getAllTeas();
      var tagMap = await getTagMap();
      var categories = await getCategoryGroups();

      var routes, teahouses;

      switch (route) {
        case 'continent': {
          var contTeas = allTeas.filter(function(t) { return t.continent === param; });
          setHTML(main, renderContinentPage(param, contTeas, [{ label: param }]));
          break;
        }
        case 'country': {
          var countryTeas = allTeas.filter(function(t) { return t.country === param; });
          var continent = countryTeas[0] ? countryTeas[0].continent : '';
          var bc = continent ? [{ label: continent, nav: 'continent-' + encodeURIComponent(continent) }, { label: param }] : [{ label: param }];
          setHTML(main, renderCountryPage(param, countryTeas, bc));
          break;
        }
        case 'china': {
          var chinaTeas = allTeas.filter(function(t) { return t.country === '中国'; });
          setHTML(main, renderCountryPage('中国', chinaTeas, [{ label: '亚洲', nav: 'continent-亚洲' }, { label: '中国' }]));
          break;
        }
        case 'world': {
          var worldTeas = allTeas;
          var contGroups = getContinentGroups(worldTeas);
          var html = '<h1 class="page-title">🌍 世界茶叶</h1>';
          html += '<p class="page-subtitle">共 ' + worldTeas.length + ' 个茶叶品种，分布在 ' + Object.keys(contGroups).length + ' 个大洲</p>';
          var contOrder = ['亚洲', '欧洲', '非洲', '南美洲', '北美洲', '大洋洲'];
          contOrder.forEach(function(cont) {
            if (!contGroups[cont]) return;
            var contColor = continentColors[cont] || '#8B4513';
            var contIcon = continentIcons[cont] || '🌏';
            var countryCount = Object.keys(contGroups[cont].countries).length;
            html += '<div class="section-group">';
            html += '<div class="section-group-header clickable" data-nav="continent-' + encodeURIComponent(cont) + '" style="border-left:3px solid ' + contColor + '">';
            html += '<span class="sgh-label">' + contIcon + ' ' + cont + '</span>';
            html += '<span class="sgh-count">' + contGroups[cont].count + ' 种 · ' + countryCount + ' 国</span>';
            html += '<span class="sgh-arrow">→</span>';
            html += '</div>';
            html += '<div class="category-grid">';
            Object.keys(contGroups[cont].countries).forEach(function(country) {
              var cIcon = countryIcons[country] || '🌍';
              html += '<div class="category-card" data-nav="' + (country === '中国' ? 'china' : 'country-' + encodeURIComponent(country)) + '" style="border-top:3px solid ' + contColor + '">';
              html += '<div class="cc-icon" style="font-size:1.8rem;">' + cIcon + '</div>';
              html += '<div class="cc-name">' + country + '</div>';
              html += '<div class="cc-count">' + contGroups[cont].countries[country] + ' 个品种</div>';
              html += '</div>';
            });
            html += '</div></div>';
          });
          setHTML(main, html);
          break;
        }
        case 'varieties': {
          setHTML(main, renderVarietiesMenu(categories));
          break;
        }
        case 'province': {
          var provTeas = allTeas.filter(function(t) { return t.province === param; });
          var first = provTeas[0];
          var bc = [];
          if (first && first.continent) bc.push({ label: first.continent, nav: 'continent-' + encodeURIComponent(first.continent) });
          var cty = first ? first.country : '中国';
          bc.push({ label: cty, nav: cty === '中国' ? 'china' : 'country-' + encodeURIComponent(cty) });
          bc.push({ label: param });
          setHTML(main, renderProvincePage(param, provTeas, bc));
          break;
        }
        case 'city': {
          var cityTeas = allTeas.filter(function(t) { return t.city === param; });
          var first = cityTeas[0];
          var province = first ? first.province : '';
          var bc = [];
          if (first && first.continent) bc.push({ label: first.continent, nav: 'continent-' + encodeURIComponent(first.continent) });
          var cty = first ? first.country : '中国';
          bc.push({ label: cty, nav: cty === '中国' ? 'china' : 'country-' + encodeURIComponent(cty) });
          if (province) bc.push({ label: province, nav: 'province-' + encodeURIComponent(province) });
          bc.push({ label: param });
          setHTML(main, renderCityPage(param, cityTeas, bc));
          break;
        }
        case 'district': {
          var distTeas = allTeas.filter(function(t) { return t.district === param || t.city === param; });
          var first = distTeas[0];
          var city = first ? first.city : '';
          var province = first ? first.province : '';
          var bc = [];
          if (first && first.continent) bc.push({ label: first.continent, nav: 'continent-' + encodeURIComponent(first.continent) });
          var cty = first ? first.country : '中国';
          bc.push({ label: cty, nav: cty === '中国' ? 'china' : 'country-' + encodeURIComponent(cty) });
          if (province) bc.push({ label: province, nav: 'province-' + encodeURIComponent(province) });
          if (city) bc.push({ label: city, nav: 'city-' + encodeURIComponent(city) });
          bc.push({ label: param });
          setHTML(main, renderDistrictPage(param, distTeas, bc));
          break;
        }
        case 'category': {
          var catTeas = categories[param] || [];
          setHTML(main, renderCategoryPage(param, catTeas, [{ label: '茶叶种类', nav: 'varieties' }, { label: param }]));
          break;
        }
        case 'subcategory': {
          var subCatTeas = allTeas.filter(function(t) { return getSubCategories(t).indexOf(param) !== -1; });
          if (subCatTeas.length > 0) {
            var parentCat = subCatTeas[0].category;
            var pcIcon = categoryDefaultIcon[parentCat] || '🍵';
            var pcColor = categoryColors[parentCat] || '#8B4513';
            var html = renderBreadcrumb([{ label: '茶叶种类', nav: 'varieties' }, { label: parentCat, nav: 'category-' + encodeURIComponent(parentCat) }, { label: param }]);
            html += '<h1 class="page-title">' + (subCategoryIcons[param] || '🍵') + ' ' + param + '</h1>';
            html += '<p class="page-subtitle">共 ' + subCatTeas.length + ' 个茶叶品种</p>';
            html += renderWaterfall(subCatTeas, []);
            setHTML(main, html);
          } else {
            setHTML(main, '<p style="text-align:center;padding:32px;">未找到该子类茶叶</p>');
          }
          break;
        }
        case 'tea': {
          var tea = allTeas.find(function(t) { return t.id === param; });
          if (tea) {
            setHTML(main, renderTeaDetail(tea));
          } else {
            setHTML(main, '<p style="text-align:center;padding:32px;">未找到该茶叶品种</p>');
          }
          break;
        }
        case 'tags': {
          setHTML(main, renderTagsPage(tagMap));
          break;
        }
        case 'tag': {
          var tagTeas = tagMap[param] || [];
          setHTML(main, renderTagResultPage(param, tagTeas));
          break;
        }
        case 'routes': {
          routes = await getAllRoutes();
          setHTML(main, renderRoutesList(routes));
          break;
        }
        case 'route': {
          routes = routes || await getAllRoutes();
          var routeData = routes.find(function(r) { return r.id === param; });
          if (routeData) {
            var relatedTeas = allTeas.filter(function(t) { return (routeData.teas || []).indexOf(t.id) >= 0; });
            setHTML(main, renderRouteDetail(routeData, relatedTeas));
            initRouteSatelliteMap(routeData);
          } else {
            setHTML(main, '<p style="text-align:center;padding:32px;">未找到该古道信息</p>');
          }
          break;
        }
        case 'routes-continent': {
          routes = routes || await getAllRoutes();
          var contRoutes = routes.filter(function(r) { return r.continent === param; });
          setHTML(main, renderRoutesContinentPage(param, contRoutes));
          break;
        }
        case 'routes-country': {
          routes = routes || await getAllRoutes();
          var ctyRoutes = routes.filter(function(r) { return r.country === param; });
          setHTML(main, renderRoutesCountryPage(param, ctyRoutes));
          break;
        }
        case 'teahouses': {
          teahouses = await getAllTeahouses();
          setHTML(main, renderTeahousesList(teahouses));
          break;
        }
        case 'teahouse': {
          teahouses = teahouses || await getAllTeahouses();
          var thData = teahouses.find(function(r) { return r.id === param; });
          if (thData) {
            var relatedTeas = allTeas.filter(function(t) { return (thData.teas || []).indexOf(t.id) >= 0; });
            setHTML(main, renderTeahouseDetail(thData, relatedTeas));
          } else {
            setHTML(main, '<p style="text-align:center;padding:32px;">未找到该茶馆信息</p>');
          }
          break;
        }
        case 'teahouses-continent': {
          teahouses = teahouses || await getAllTeahouses();
          var contTh = teahouses.filter(function(th) { return th.continent === param; });
          setHTML(main, renderTeahousesContinentPage(param, contTh));
          break;
        }
        case 'teahouses-country': {
          teahouses = teahouses || await getAllTeahouses();
          var ctyTh = teahouses.filter(function(th) { return th.country === param; });
          setHTML(main, renderTeahousesCountryPage(param, ctyTh));
          break;
        }
        case 'teahouses-city': {
          teahouses = teahouses || await getAllTeahouses();
          var cityTh = teahouses.filter(function(th) { return th.city === param; });
          setHTML(main, renderTeahousesCityPage(param, cityTh));
          break;
        }
        case 'teahouses-province': {
          teahouses = teahouses || await getAllTeahouses();
          var provTh = teahouses.filter(function(th) { return th.province === param; });
          setHTML(main, renderTeahousesProvincePage(param, provTh));
          break;
        }
        case 'search': {
          var searchTeas = [];
          var searchRoutes = [];
          var searchTeahouses = [];
          if (param) {
            var q = param;
            var ql = q.toLowerCase();
            searchTeas = allTeas.filter(function(t) {
              return t.name.indexOf(q) >= 0 || (t.nameEn && t.nameEn.toLowerCase().indexOf(ql) >= 0) ||
                t.country.indexOf(q) >= 0 || (t.province && t.province.indexOf(q) >= 0) ||
                (t.city && t.city.indexOf(q) >= 0) || (t.district && t.district.indexOf(q) >= 0) ||
                t.description.indexOf(q) >= 0 || t.category.indexOf(q) >= 0 ||
                (t.tags && t.tags.some(function(tg) { return tg.indexOf(q) >= 0; }));
            });
            routes = routes || await getAllRoutes();
            searchRoutes = routes.filter(function(r) {
              return r.name.indexOf(q) >= 0 || (r.subtitle && r.subtitle.indexOf(q) >= 0) ||
                (r.continent && r.continent.indexOf(q) >= 0) || r.story.indexOf(q) >= 0 ||
                (r.summary && r.summary.indexOf(q) >= 0) || (r.mainTea && r.mainTea.indexOf(q) >= 0) ||
                (r.detailRoute && r.detailRoute.indexOf(q) >= 0);
            });
            teahouses = teahouses || await getAllTeahouses();
            searchTeahouses = teahouses.filter(function(th) {
              return th.name.indexOf(q) >= 0 || (th.nameEn && th.nameEn.toLowerCase().indexOf(ql) >= 0) ||
                th.country.indexOf(q) >= 0 || th.city.indexOf(q) >= 0 ||
                th.description.indexOf(q) >= 0 || (th.specialty && th.specialty.indexOf(q) >= 0) ||
                (th.style && th.style.indexOf(q) >= 0) ||
                (th.tags && th.tags.some(function(tg) { return tg.indexOf(q) >= 0; }));
            });
          }
          setHTML(main, renderSearchPage(param || '', searchTeas, searchRoutes, searchTeahouses));
          break;
        }
        default: {
          var t = allTeas.find(function(tt) { return tt.id === hashStr; });
          if (t) {
            setHTML(main, renderTeaDetail(t));
          } else {
            await renderHome();
          }
        }
      }
    } catch (err) {
      console.error('Navigation error:', err);
      setHTML(main, '<p style="text-align:center;padding:32px;">页面加载出错，请稍后再试</p>');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderSearchPage(query, teas, routes, teahouses) {
    var html = '<h1 class="page-title">🔍 搜索茶谱</h1>';
    html += '<p class="page-subtitle">搜索茶叶品种、产地、标签、古道、茶馆...</p>';
    html += '<div class="search-form">';
    html += '<input type="text" id="search-page-input" placeholder="输入关键词搜索..." value="' + escHtml(query) + '">';
    html += '<button id="search-page-btn">🔍 搜索</button>';
    html += '</div>';

    if (query) {
      teahouses = teahouses || [];
      if (teas.length === 0 && routes.length === 0 && teahouses.length === 0) {
        html += '<p style="text-align:center;color:var(--text-muted);padding:32px;">未找到匹配的结果，请尝试其他关键词</p>';
      } else {
        if (teas.length > 0) {
          html += '<div class="search-results-section">';
          html += '<div class="srs-heading">🍵 茶叶品种 <span class="srs-count">' + teas.length + ' 个结果</span></div>';
          html += renderWaterfall(teas, []);
          html += '</div>';
        }
        if (routes.length > 0) {
          html += '<div class="search-results-section">';
          html += '<div class="srs-heading">🛤️ 茶叶之路 <span class="srs-count">' + routes.length + ' 个结果</span></div>';
          html += '<div class="category-grid">';
          routes.forEach(function(route) {
            var rc = route.color || '#8B4513';
            html += '<div class="category-card" data-nav="route-' + route.id + '" style="border-top:3px solid ' + rc + '">';
            html += '<div class="cc-icon" style="font-size:1.8rem;">' + (route.imageIcon || '🛤️') + '</div>';
            html += '<div class="cc-name">' + route.name + '</div>';
            html += '<div class="cc-subtitle">' + route.subtitle + '</div>';
            html += '</div>';
          });
          html += '</div></div>';
        }
        if (teahouses.length > 0) {
          html += '<div class="search-results-section">';
          html += '<div class="srs-heading">🏠 世界茶馆 <span class="srs-count">' + teahouses.length + ' 个结果</span></div>';
          html += '<div class="category-grid">';
          teahouses.forEach(function(th) {
            var tcol = th.color || '#8B4513';
            html += '<div class="category-card" data-nav="teahouse-' + th.id + '" style="border-top:3px solid ' + tcol + '">';
            html += '<div class="cc-icon" style="font-size:1.8rem;">' + (th.imageIcon || '🏠') + '</div>';
            html += '<div class="cc-name">' + th.name + '</div>';
            html += '<div class="cc-subtitle">' + th.country + ' · ' + th.city + '</div>';
            html += '</div>';
          });
          html += '</div></div>';
        }
      }
    }
    return html;
  }

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function initRouteSatelliteMap(route) {
    var containerId = 'route-map-' + route.id;
    var container = document.getElementById(containerId);
    if (!container) return;
    if (!route.stations || route.stations.length < 2) return;
    var hasCoords = route.stations.some(function(s) { return s.coord && s.coord.length === 2; });
    if (!hasCoords) return;

    var map = L.map(container, {
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Esri'
    }).addTo(map);

    var latlngs = [];
    var markers = [];
    route.stations.forEach(function(st, i) {
      if (!st.coord || st.coord.length !== 2) return;
      var latlng = [st.coord[0], st.coord[1]];
      latlngs.push(latlng);

      var marker = L.circleMarker(latlng, {
        radius: i === 0 || i === route.stations.length - 1 ? 8 : 5,
        fillColor: i === 0 ? '#22c55e' : i === route.stations.length - 1 ? '#ef4444' : (route.color || '#8B4513'),
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      var label = (i === 0 ? '🟢 起点' : i === route.stations.length - 1 ? '🔴 终点' : '📍 途经点');
      var popupHtml = '<strong>' + st.name + '</strong>';
      popupHtml += '<div class="popup-meta">' + label;
      if (st.distance) popupHtml += ' · ' + st.distance;
      if (st.altitude) popupHtml += ' · ⛰️' + st.altitude;
      if (st.road) popupHtml += ' · ' + st.road;
      popupHtml += '</div>';
      if (st.desc) popupHtml += '<div style="margin-top:4px;font-size:0.8rem;color:var(--text-secondary);">' + st.desc.substring(0, 60) + (st.desc.length > 60 ? '…' : '') + '</div>';
      marker.bindPopup(popupHtml);

      marker.on('mouseover', function() { this.openPopup(); });
      marker.on('mouseout', function() { this.closePopup(); });

      markers.push(marker);
    });

    if (latlngs.length < 2) return;

    var polyline = L.polyline(latlngs, {
      color: route.color || '#8B4513',
      weight: 3,
      opacity: 0.7,
      dashArray: '8, 6'
    }).addTo(map);

    map.fitBounds(polyline.getBounds().pad(0.1));

    setTimeout(function() {
      map.invalidateSize();
    }, 100);
  }

  var teaQuotes = [
    { text: '「茶者，南方之嘉木也」', source: '陆羽《茶经》' },
    { text: '「从来佳茗似佳人」', source: '苏轼' },
    { text: '「寒夜客来茶当酒」', source: '杜耒' },
    { text: '「一杯春露暂留客，两腋清风几欲仙」', source: '郑清之' },
    { text: '「茶之为饮，发乎神农氏」', source: '陆羽《茶经》' },
    { text: '「一器成名只为茗，悦来客满是茶香」', source: '茶谚' },
    { text: '「万丈红尘三杯酒，千秋大业一壶茶」', source: '茶谚' },
    { text: '「茶亦醉人何必酒，书能香我无须花」', source: '茶谚' },
    { text: '「竹下忘言对紫茶，全胜羽客醉流霞」', source: '钱起《与赵莒茶宴》' },
    { text: '「半壁山房待明月，一盏清茗酬知音」', source: '茶谚' },
    { text: '「淡中有味茶偏好，清茗一杯情更真」', source: '茶谚' },
    { text: '「无由持一碗，寄与爱茶人」', source: '白居易《山泉煎茶有怀》' },
    { text: '「坐酌泠泠水，看煎瑟瑟尘」', source: '白居易《山泉煎茶有怀》' },
    { text: '「茶香一缕，足以慰风尘」', source: '茶谚' },
    { text: '「人间有仙品，茶为草木珍」', source: '茶谚' },
    { text: '「美酒千杯难成知己，清茶一盏也能醉人」', source: '茶谚' },
    { text: '「茶里乾坤大，壶中日月长」', source: '茶谚' },
    { text: '「山间一壶茶，静听松风眠」', source: '茶谚' },
    { text: '「品茶如品人生，拿起放下间皆是智慧」', source: '茶谚' },
    { text: '「一盏清茗酬知音，半卷闲书慰平生」', source: '茶谚' },
    { text: '「焚香引幽步，酌茗开静筵」', source: '苏轼《端午遍游诸寺得禅字》' },
    { text: '「茶映盏毫新乳上，琴横荐石细泉鸣」', source: '陆游《午枕》' },
    { text: '「矮纸斜行闲作草，晴窗细乳戏分茶」', source: '陆游《临安春雨初霁》' },
    { text: '「被酒莫惊春睡重，赌书消得泼茶香」', source: '纳兰性德《浣溪沙》' },
    { text: '「酒困路长惟欲睡，日高人渴漫思茶」', source: '苏轼《浣溪沙》' },
  { text: "「一碗喉吻润，二碗破孤闷」", source: "卢仝《走笔谢孟谏议寄新茶》" },
  { text: "「三碗搜枯肠，唯有文字五千卷」", source: "卢仝《走笔谢孟谏议寄新茶》" },
  { text: "「七碗吃不得也，唯觉两腋习习清风生」", source: "卢仝《走笔谢孟谏议寄新茶》" },
  { text: "「活水还须活火烹」", source: "苏轼《汲江煎茶》" },
  { text: "「大瓢贮月归春瓮，小杓分江入夜瓶」", source: "苏轼《汲江煎茶》" },
  { text: "「雪乳已翻煎处脚，松风忽作泻时声」", source: "苏轼《汲江煎茶》" },
  { text: "「日长何所事，茗碗自赍持」", source: "唐寅《事茗图》" },
  { text: "「一饮涤昏寐，情来朗爽满天地」", source: "皎然《饮茶歌诮崔石使君》" },
  { text: "「再饮清我神，忽如飞雨洒轻尘」", source: "皎然《饮茶歌诮崔石使君》" },
  { text: "「三饮便得道，何须苦心破烦恼」", source: "皎然《饮茶歌诮崔石使君》" },
  { text: "「孰知茶道全尔真，唯有丹丘得如此」", source: "皎然《饮茶歌诮崔石使君》" },
  { text: "「茶之为用，最宜精行俭德之人」", source: "陆羽《茶经》" },
  { text: "「其水，用山水上，江水中，井水下」", source: "陆羽《茶经·五之煮》" },
  { text: "「茶性俭，不宜广」", source: "陆羽《茶经》" },
  { text: "「要知冰雪心肠好，不是膏油首面新」", source: "苏轼《次韵曹辅寄壑源试焙新茶》" },
  { text: "君不可一日无茶", source: "乾隆典故" },
  { text: "「有好茶喝，会喝好茶，是一种清福」", source: "鲁迅《喝茶》" },
  { text: "「喝茶当于瓦屋纸窗之下，清泉绿茶，同二三人共饮，得半日之闲，可抵十年尘梦」", source: "周作人《喝茶》" },
  { text: "「吃茶去」", source: "赵州禅师" },
  { text: "「琴里知闻唯渌水，茶中故旧是蒙山」", source: "白居易《琴茶》" },
  { text: "「商人重利轻别离，前月浮梁买茶去」", source: "白居易《琵琶行》" },
  { text: "「扫来竹叶烹茶叶，劈碎松根煮菜根」", source: "郑板桥茶联" },
  { text: "「汲来江水烹新茗，买尽青山当画屏」", source: "郑板桥茶联" },
  { text: "「墨兰数枝宣德纸，苦茗一杯成化窑」", source: "郑板桥" },
  { text: "「茶鼎夜烹千古雪，花幡晨动九天风」", source: "黄镇成《天台山》" },
  { text: "「小桥小店沽酒，初火新烟煮茶」", source: "杨基" },
  { text: "「山中何事？松花酿酒，春水煎茶」", source: "张可久《人月圆·山中书事》" },
  { text: "「豆蔻连梢煎熟水，莫分茶」", source: "李清照《摊破浣溪沙》" },
  { text: "「酒阑更喜团茶苦」", source: "李清照《鹧鸪天》" },
  { text: "「生香熏袖，活火分茶」", source: "李清照《转调满庭芳》" },
  { text: "「且将新火试新茶，诗酒趁年华」", source: "苏轼《望江南·超然台作》" },
  { text: "「雪沫乳花浮午盏，人间有味是清欢」", source: "苏轼《浣溪沙》" },
  { text: "「不寄他人先寄我，因缘我是别茶人」", source: "白居易《谢李六郎中寄新蜀茶》" },
  { text: "「食罢一觉睡，起来两碗茶」", source: "白居易《两碗茶》" },
  { text: "「闽中茶品天下高，倾身事茶不知劳」", source: "苏辙《和子瞻煎茶》" },
  { text: "「恰如灯下，故人万里，归来对影」", source: "黄庭坚《品令·茶词》" },
  { text: "「口不能言，心下快活自省」", source: "黄庭坚《品令·茶词》" },
  { text: "「青灯耿窗户，设茗听雪落」", source: "陆游《斋中杂题》" },
  { text: "「细啜襟灵爽，微吟齿颊香」", source: "陆游" },
  { text: "「茶烟袅细香」", source: "朱熹《茶坂》" },
  { text: "「寒灯新茗月同煎，浅瓯吹雪试新茶」", source: "文征明《煎茶》" },
  { text: "「谷雨乍过茶事好，鼎汤初沸有朋来」", source: "文征明" },
  { text: "「一片青山入座，半潭秋水烹茶」", source: "郑板桥茶联" },
  { text: "「客至心常热，人走茶不凉」", source: "茶谚" },
  { text: "「水是茶之母，器为茶之父」", source: "茶谚" },
  { text: "「宁可三日无盐，不可一日无茶」", source: "游牧民族茶谚" },
  { text: "「早茶一盅，一天威风；午茶一盅，劳动轻松；晚茶一盅，提神去痛」", source: "茶谚" },
  { text: "「从来名士能评水，自古高僧爱斗茶」", source: "茶联" },
  { text: "「松涛烹雪醒诗梦，竹院浮烟荡俗尘」", source: "茶联" },
  { text: "「烹茶尽具，武阳买茶」", source: "王褒《僮约》" },
  { text: "「神农尝百草，日遇七十二毒，得荼而解之」", source: "《神农本草经》" },
  { text: "茶兴于唐而盛于宋", source: "茶史" },
  { text: "以茶代酒，始于三国孙皓", source: "茶史典故" },
  { text: "「茶禅一味」", source: "圆悟克勤" },
  { text: "「自秦人取蜀，始有茗饮之事」", source: "顾炎武《日知录》" }
  ];

  async function renderHome() {
    var main = $('#main-content');
    
    var allTeas = cache.teas || await getAllTeas();
    var allRoutes = cache.routes || await getAllRoutes();
    var allTeahouses = cache.teahouses || await getAllTeahouses();
    
    var isRoute = Math.random() > 0.5;
    var content = isRoute ? pickRandom(allRoutes) : pickRandom(allTeahouses);
    
    var quote = pickRandom(teaQuotes);
    
    var html = '<div class="home-hero">';
    html += '<div class="home-quote">' + quote.text + '<span class="hq-source">—— ' + quote.source + '</span></div>';
    html += '</div>';
    
    html += '<div class="home-feature-area">';
    html += '<div class="hfa-card">';
    html += renderRandomFeature(isRoute, content);
    html += '</div></div>';
    
    html += '<div class="home-section-title">🚀 快速探索</div>';
    html += '<div class="home-quick-nav">';
    html += '<div data-nav="routes" class="hqn-card" style="background:linear-gradient(135deg, #8B4513, #D2691E)"><div class="hqn-icon">🛤️</div>茶路探索</div>';
    html += '<div data-nav="teahouses" class="hqn-card" style="background:linear-gradient(135deg, #4CAF50, #8BC34A)"><div class="hqn-icon">🏠</div>茶馆寻访</div>';
    html += '<div data-nav="world" class="hqn-card" style="background:linear-gradient(135deg, #2196F3, #03A9F4)"><div class="hqn-icon">🍃</div>茶叶百科</div>';
    html += '</div>';
    
    html += '<div class="home-stats-bar">';
    html += '<span>🍃 ' + allTeas.length + ' 款茶叶</span>';
    html += '<span class="hsm-dot">·</span>';
    html += '<span>🛤️ ' + allRoutes.length + ' 条茶路</span>';
    html += '<span class="hsm-dot">·</span>';
    html += '<span>🏠 ' + allTeahouses.length + ' 家茶馆</span>';
    html += '</div>';
    
    setHTML(main, html);
    
    document.querySelectorAll('.hqn-card').forEach(function(card) {
      card.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-2px)'; });
      card.addEventListener('mouseleave', function() { this.style.transform = ''; });
    });
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function renderRandomFeature(isRoute, data) {
    if (isRoute) {
      return renderRouteFeature(data);
    } else {
      return renderTeahouseFeature(data);
    }
  }

  function renderRouteFeature(route) {
    var emoji = route.imageIcon || '🛤️';
    var html = '<div class="route-info-card" style="overflow:hidden; border-radius:16px;">';
    html += '<div style="padding:24px;">';
    html += '<div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">';
    html += '<div style="font-size:3.5rem;">' + emoji + '</div>';
    html += '<div>';
    html += '<h2 style="margin:0 0 4px; font-size:1.6rem; color:var(--text-primary);">' + route.name + '</h2>';
    html += '<div style="color:var(--text-secondary); font-size:0.95rem;">' + (route.subtitle || route.country || '') + '</div>';
    html += '</div></div>';
    
    html += '<p style="font-size:1.05rem; line-height:1.7; color:var(--text-primary); margin-bottom:16px;">';
    html += route.summary || '';
    html += '</p>';
    
    // 亮点信息
    html += '<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; margin-bottom:20px;">';
    if (route.distance) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">距离</div><div style="font-weight:600;">📏 ' + route.distance + '</div></div>';
    if (route.duration) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">行程</div><div style="font-weight:600;">⏱️ ' + route.duration + '</div></div>';
    if (route.difficulty) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">难度</div><div style="font-weight:600;">⚠️ ' + route.difficulty + '</div></div>';
    if (route.bestSeason) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">最佳季节</div><div style="font-weight:600;">📅 ' + route.bestSeason + '</div></div>';
    html += '</div>';
    
    // 推荐语
    html += '<div style="background:linear-gradient(135deg, ' + (route.color || '#8B4513') + '20, ' + (route.color || '#8B4513') + '10); padding:16px; border-radius:12px; border-left:4px solid ' + (route.color || '#8B4513') + '; margin-bottom:20px;">';
    html += '<div style="font-weight:600; margin-bottom:6px; color:var(--text-primary);">✨ 今日推荐</div>';
    html += '<div style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6;">';
    html += '这条茶路藏着太多精彩故事！建议你从起点开始，沿着古老的茶香轨迹，感受历史与自然的交融。';
    html += '</div></div>';
    
    html += '<div style="display:flex; gap:12px;">';
    html += '<button data-nav="route-' + route.id + '" style="flex:1; padding:12px 20px; background:' + (route.color || '#8B4513') + '; color:white; border:none; border-radius:10px; font-size:1rem; font-weight:600; cursor:pointer;">';
    html += '🚀 探索这条茶路';
    html += '</button>';
    html += '<button data-nav="routes" style="padding:12px 20px; background:var(--bg-card); color:var(--text-primary); border:1px solid var(--border-color); border-radius:10px; font-size:1rem; cursor:pointer;">';
    html += '查看所有茶路';
    html += '</button>';
    html += '</div>';
    html += '</div></div>';
    return html;
  }

  function renderTeahouseFeature(teahouse) {
    var emoji = teahouse.imageIcon || '🏠';
    var html = '<div class="route-info-card" style="overflow:hidden; border-radius:16px;">';
    html += '<div style="padding:24px;">';
    html += '<div style="display:flex; align-items:center; gap:16px; margin-bottom:16px;">';
    html += '<div style="font-size:3.5rem;">' + emoji + '</div>';
    html += '<div>';
    html += '<h2 style="margin:0 0 4px; font-size:1.6rem; color:var(--text-primary);">' + teahouse.name + '</h2>';
    html += '<div style="color:var(--text-secondary); font-size:0.95rem;">' + (teahouse.city || teahouse.country || '') + '</div>';
    html += '</div></div>';
    
    html += '<p style="font-size:1.05rem; line-height:1.7; color:var(--text-primary); margin-bottom:16px;">';
    html += teahouse.description || '';
    html += '</p>';
    
    // 亮点信息
    html += '<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; margin-bottom:20px;">';
    if (teahouse.established) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">创立年代</div><div style="font-weight:600;">📅 ' + teahouse.established + '</div></div>';
    if (teahouse.style) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">风格</div><div style="font-weight:600;">🎨 ' + teahouse.style + '</div></div>';
    if (teahouse.specialty) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">特色</div><div style="font-weight:600;">🍵 ' + teahouse.specialty + '</div></div>';
    if (teahouse.address) html += '<div style="background:var(--bg-card); padding:12px; border-radius:8px;"><div style="color:var(--text-muted); font-size:0.8rem;">地址</div><div style="font-weight:600; font-size:0.9rem;">📍 ' + teahouse.address.substring(0, 30) + (teahouse.address.length > 30 ? '...' : '') + '</div></div>';
    html += '</div>';
    
    // 推荐语
    html += '<div style="background:linear-gradient(135deg, ' + (teahouse.color || '#4CAF50') + '20, ' + (teahouse.color || '#4CAF50') + '10); padding:16px; border-radius:12px; border-left:4px solid ' + (teahouse.color || '#4CAF50') + '; margin-bottom:20px;">';
    html += '<div style="font-weight:600; margin-bottom:6px; color:var(--text-primary);">✨ 今日推荐</div>';
    html += '<div style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6;">';
    html += teahouse.highlight || '这是一家值得寻访的茶馆！建议你找个悠闲的下午，在这里品一杯好茶，感受时光的味道。';
    html += '</div></div>';
    
    html += '<div style="display:flex; gap:12px;">';
    html += '<button data-nav="teahouse-' + teahouse.id + '" style="flex:1; padding:12px 20px; background:' + (teahouse.color || '#4CAF50') + '; color:white; border:none; border-radius:10px; font-size:1rem; font-weight:600; cursor:pointer;">';
    html += '🏠 了解这家茶馆';
    html += '</button>';
    html += '<button data-nav="teahouses" style="padding:12px 20px; background:var(--bg-card); color:var(--text-primary); border:1px solid var(--border-color); border-radius:10px; font-size:1rem; cursor:pointer;">';
    html += '查看所有茶馆';
    html += '</button>';
    html += '</div>';
    html += '</div></div>';
    return html;
  }

  function initNavigation() {
    $('#main-content').addEventListener('click', function(e) {
      var navEl = e.target.closest('[data-nav]');
      if (navEl) {
        e.preventDefault();
        var nav = navEl.getAttribute('data-nav');
        window.location.hash = nav;
        navigate(nav);
        return;
      }
      var teaEl = e.target.closest('[data-tea-id]');
      if (teaEl) {
        e.preventDefault();
        var teaId = teaEl.getAttribute('data-tea-id');
        var nav = 'tea-' + teaId;
        window.location.hash = nav;
        navigate(nav);
        return;
      }
      if (e.target.id === 'search-page-btn') {
        e.preventDefault();
        var input = document.getElementById('search-page-input');
        if (input && input.value.trim()) {
          var q = input.value.trim();
          window.location.hash = 'search-' + encodeURIComponent(q);
          navigate('search-' + encodeURIComponent(q));
        }
      }
    });

    $('#main-content').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.id === 'search-page-input') {
        e.preventDefault();
        var q = e.target.value.trim();
        if (q) {
          window.location.hash = 'search-' + encodeURIComponent(q);
          navigate('search-' + encodeURIComponent(q));
        }
      }
    });

    var debouncedSearch = debounce(function(q) {
      if (q.trim()) {
        window.location.hash = 'search-' + encodeURIComponent(q.trim());
        navigate('search-' + encodeURIComponent(q.trim()));
      }
    }, 300);

    $('#main-content').addEventListener('input', function(e) {
      if (e.target.id === 'search-page-input') {
        debouncedSearch(e.target.value);
      }
    });

    var ids = ['nav-home', 'nav-china', 'nav-world', 'nav-varieties', 'nav-routes', 'nav-teahouses', 'nav-tags', 'nav-search'];
    var hashes = ['home', 'china', 'world', 'varieties', 'routes', 'teahouses', 'tags', 'search'];
    ids.forEach(function(id, i) {
      var el = $('#' + id);
      if (el) {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.hash = hashes[i];
          navigate(hashes[i]);
        });
      }
    });

    window.addEventListener('hashchange', function() {
      navigate(window.location.hash.replace('#', '') || 'home');
    });

    var menuToggle = $('#menu-toggle');
    var headerNav = $('.header-nav');
    var menuOverlay = $('#menu-overlay');

    function openMenu() {
      headerNav.classList.add('open');
      menuOverlay.classList.add('open');
      menuToggle.textContent = '✕';
    }
    function closeMenu() {
      headerNav.classList.remove('open');
      menuOverlay.classList.remove('open');
      menuToggle.textContent = '☰';
    }

    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (headerNav.classList.contains('open')) { closeMenu(); }
      else { openMenu(); }
    });

    menuOverlay.addEventListener('click', function() { closeMenu(); });

    headerNav.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') { closeMenu(); }
    });
  }

  function initTheme() {
    var themeBtn = $('#theme-btn');
    var saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';

    themeBtn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  async function init() {
    initNavigation();
    initTheme();
    var initHash = window.location.hash.replace('#', '') || 'home';
    await navigate(initHash);
  }

  return { init: init, navigate: navigate, getAllTeas: getAllTeas, getAllRoutes: getAllRoutes };
})();

document.addEventListener('DOMContentLoaded', function() { App.init(); });
