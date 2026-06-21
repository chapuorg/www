// 全局配置常量
export const CONFIG = {
  chinaFiles: ['anhui', 'chongqing', 'fujian', 'gansu', 'guangdong', 'guangxi', 'guizhou', 'hainan', 'henan', 'hubei', 'hunan', 'jiangsu', 'jiangxi', 'shaanxi', 'shandong', 'shanghai', 'sichuan', 'taiwan', 'xizang', 'yunnan', 'zhejiang'],
  worldFiles: ['japan', 'india', 'sri-lanka', 'kenya', 'uk', 'turkey', 'korea', 'vietnam', 'indonesia', 'nepal', 'argentina', 'malawi', 'russia', 'morocco', 'thailand', 'tanzania', 'uganda', 'rwanda', 'myanmar', 'bangladesh', 'malaysia', 'iran', 'georgia', 'azerbaijan', 'bhutan', 'laos', 'cambodia', 'philippines', 'uzbekistan', 'ethiopia', 'mozambique', 'zimbabwe', 'south-africa', 'burundi', 'cameroon', 'congo', 'mauritius', 'nigeria', 'germany', 'france', 'portugal', 'brazil', 'peru', 'colombia', 'usa', 'canada', 'australia', 'new-zealand', 'papua-new-guinea'],
  routeFiles: ['tea-horse-road', 'great-tea-road', 'tang-tubo-road', 'southern-silk-road', 'shu-road', 'yunnan-burma-india-road', 'zhangye-ruancha-road', 'maritime-tea-route', 'silk-road-tea', 'ancient-tea-road', 'darjeeling-heritage', 'clipper-tea-race', 'voc-tea-route', 'kyoto-edo-cha-road', 'marrakech-moroccan-mint-tea-road', 'kyrgyz-pamir-tea-road', 'wuyi-pan-ancient-tea-road', 'sikkim-darjeeling-tea-road', 'brazil-parana-tea-road', 'korean-tea-road', 'persian-tea-road', 'mate-road', 'tibet-nepal-tea-road', 'vietnam-tea-road', 'fujian-guangdong-tea-road', 'arabian-tea-route'],
  teahouseChinaFiles: ['anhui', 'beijing', 'chongqing', 'fujian', 'gansu', 'guangdong', 'hongkong', 'hubei', 'hunan', 'jiangsu', 'macau', 'shaanxi', 'shandong', 'shanghai', 'sichuan', 'taiwan', 'tianjin', 'xinjiang', 'xizang', 'yunnan', 'zhejiang'],
  teahouseWorldFiles: ['argentina', 'australia', 'austria', 'brazil', 'canada', 'czech', 'egypt', 'france', 'germany', 'greece', 'hungary', 'india', 'indonesia', 'iran', 'italy', 'japan', 'kenya', 'korea', 'malaysia', 'morocco', 'myanmar', 'netherlands', 'new-zealand', 'portugal', 'russia', 'singapore', 'south-africa', 'spain', 'sri-lanka', 'thailand', 'turkey', 'uk', 'usa', 'uzbekistan', 'vietnam'],
  categoryOrder: ['绿茶', '红茶', '乌龙茶', '白茶', '黄茶', '黑茶', '普洱茶', '花茶', '调味茶', '代茶类'],
  cacheVersion: 'v8',
  CHINA_BASE: 'zh/chinatea/',
  WORLD_BASE: 'zh/worldtea/',
  ROUTE_BASE: 'zh/route/',
  TEAHOUSE_CHINA_BASE: 'zh/chinateahouse/',
  TEAHOUSE_WORLD_BASE: 'zh/worldteahouse/'
};

export const categoryDefaultIcon = {
  '绿茶': '🍃', '红茶': '🫖', '乌龙茶': '🏺', '白茶': '🤍', '黄茶': '💛',
  '黑茶': '🖤', '普洱茶': '🧱', '代茶类': '🌿', '调味茶': '🌺', '花茶': '🌸'
};

export const categoryColors = {
  '绿茶': '#3d8b37', '红茶': '#c0392b', '乌龙茶': '#d4a017',
  '白茶': '#a0a8b0', '黄茶': '#e6a817', '黑茶': '#5d4037',
  '普洱茶': '#795548', '代茶类': '#2980b9', '调味茶': '#e84393', '花茶': '#e91e63'
};

export const continentIcons = {
  '亚洲': '🌏', '欧洲': '🏰', '非洲': '🦁', '南美洲': '💃', '北美洲': '🦅', '大洋洲': '🐨', '跨洲际': '🌐'
};

export const continentColors = {
  '亚洲': '#e67e22', '欧洲': '#2980b9', '非洲': '#27ae60', '南美洲': '#8e44ad', '北美洲': '#c0392b', '大洋洲': '#16a085'
};

export const provinceIcons = {
  '浙江省': '🏯', '福建省': '🏮', '云南省': '🦚', '安徽省': '⛰️', '台湾省': '🌊',
  '广东省': '🐉', '湖南省': '🏞️', '四川省': '🐼', '江苏省': '⛲', '湖北省': '🏛️',
  '广西壮族自治区': '🎋', '江西省': '🏔️', '河南省': '🛕', '贵州省': '🏗️', '陕西省': '🐴',
  '山东省': '⛩️', '重庆市': '🌉', '海南省': '🌴', '甘肃省': '🐪', '西藏自治区': '🏔️', '上海市': '🌆',
  '北京市': '🏯', '天津市': '🏛️', '香港特别行政区': '🏙️', '澳门特别行政区': '🎰', '新疆维吾尔自治区': '🍇'
};

export const regionColors = {
  '浙江省': '#4A8B3F', '福建省': '#C0392B', '云南省': '#E67E22', '安徽省': '#8E44AD',
  '台湾省': '#2980B9', '广东省': '#E74C3C', '湖南省': '#D35400', '四川省': '#27AE60',
  '江苏省': '#16A085', '湖北省': '#F39C12', '广西壮族自治区': '#1ABC9C',
  '江西省': '#2ECC71', '河南省': '#E84393', '贵州省': '#6C5CE7', '陕西省': '#B8860B',
  '山东省': '#E74C3C', '重庆市': '#D35400', '海南省': '#2ECC71', '甘肃省': '#F39C12', '西藏自治区': '#9B59B6', '上海市': '#3498DB',
  '北京市': '#C0392B', '天津市': '#2980B9', '香港特别行政区': '#E84393', '澳门特别行政区': '#16A085', '新疆维吾尔自治区': '#8E44AD'
};

export const countryIcons = {
  '中国': '🐉', '日本': '🗾', '印度': '🕌', '斯里兰卡': '🏝️', '肯尼亚': '🦁', '英国': '🏰',
  '土耳其': '🕌', '韩国': '🏯', '越南': '🌴', '印度尼西亚': '🌋', '尼泊尔': '🏔️',
  '阿根廷': '💃', '马拉维': '🏞️', '俄罗斯': '❄️', '摩洛哥': '🏜️', '泰国': '🛕',
  '法国': '🗼', '缅甸': '🪷', '孟加拉国': '🌊', '马来西亚': '🌴', '伊朗': '🕌',
  '格鲁吉亚': '🏔️', '阿塞拜疆': '🔥', '不丹': '🏔️', '老挝': '🌴', '柬埔寨': '🛕', '菲律宾': '🏝️',
  '乌兹别克斯坦': '🐪', '埃塞俄比亚': '☕', '莫桑比克': '🌊', '津巴布韦': '🦁',
  '南非': '🏞️', '布隆迪': '🌋', '卢旺达': '⛰️', '坦桑尼亚': '🏔️', '乌干达': '🌿', '喀麦隆': '🌴',
  '刚果（金）': '🌴', '毛里求斯': '🏝️', '尼日利亚': '🌴', '德国': '🏰', '葡萄牙': '⛵', '巴西': '💃',
  '秘鲁': '🏔️', '哥伦比亚': '💃', '美国': '🦅', '加拿大': '🍁', '澳大利亚': '🦘', '新西兰': '🥝',
  '巴布亚新几内亚': '🏝️', '中国/蒙古/俄罗斯': '🛤️',
  '新加坡': '🏙️', '匈牙利': '🏛️', '西班牙': '💃', '希腊': '🏛️', '埃及': '🔺', '奥地利': '🏔️',
  '捷克': '🏰', '意大利': '🍝', '荷兰': '🌷', '刚果': '🦍'
};

export const countryColors = {
  '中国': '#c0392b', '日本': '#c0392b', '印度': '#e67e22', '斯里兰卡': '#f39c12', '肯尼亚': '#27ae60',
  '英国': '#2980b9', '土耳其': '#c0392b', '韩国': '#e74c3c', '越南': '#d35400',
  '印度尼西亚': '#e67e22', '尼泊尔': '#8e44ad', '阿根廷': '#5dade2', '马拉维': '#27ae60',
  '俄罗斯': '#2c3e50', '摩洛哥': '#16a085', '泰国': '#f1c40f', '法国': '#002395',
  '缅甸': '#e67e22', '孟加拉国': '#27ae60', '马来西亚': '#e74c3c', '伊朗': '#16a085',
  '格鲁吉亚': '#c0392b', '阿塞拜疆': '#e67e22', '不丹': '#8e44ad', '老挝': '#d35400',
  '柬埔寨': '#c0392b', '菲律宾': '#2980b9', '乌兹别克斯坦': '#16a085', '埃塞俄比亚': '#27ae60',
  '莫桑比克': '#e67e22', '津巴布韦': '#f39c12', '南非': '#27ae60', '布隆迪': '#c0392b',
  '卢旺达': '#2980b9', '坦桑尼亚': '#d35400', '乌干达': '#e67e22', '喀麦隆': '#27ae60',
  '刚果（金）': '#8e44ad', '毛里求斯': '#16a085', '尼日利亚': '#27ae60', '德国': '#2c3e50',
  '葡萄牙': '#e74c3c', '巴西': '#27ae60', '秘鲁': '#c0392b', '哥伦比亚': '#f1c40f',
  '美国': '#2980b9', '加拿大': '#c0392b', '澳大利亚': '#16a085', '新西兰': '#2c3e50',
  '巴布亚新几内亚': '#e67e22', '中国/蒙古/俄罗斯': '#8B4513',
  '新加坡': '#e74c3c', '匈牙利': '#27ae60', '西班牙': '#c0392b', '希腊': '#2980b9',
  '埃及': '#d35400', '奥地利': '#c0392b', '捷克': '#2980b9', '意大利': '#27ae60',
  '荷兰': '#e67e22', '刚果': '#8e44ad'
};

export const subCategoryIcons = {
  '炒青绿茶': '🍳', '烘青绿茶': '🔥', '晒青绿茶': '☀️', '蒸青绿茶': '♨️',
  '工夫红茶': '🫖', '小种红茶': '🏕️', '红碎茶': '⚙️', '调味红茶': '🍊',
  '闽北乌龙': '⛰️', '闽南乌龙': '🏮', '广东乌龙': '🐉', '台湾乌龙': '🏔️',
  '白毫银针': '🤍', '白牡丹': '🌺', '寿眉': '🌿', '贡眉': '🌿',
  '黄芽茶': '💛', '生普': '🍃', '熟普': '🧱',
  '湖南黑茶': '🖤', '广西六堡茶': '🫙', '湖北青砖茶': '🧱', '四川藏茶': '🏔️',
  '茉莉花茶': '🤍', '花草代茶': '🌼', '果味代茶': '🍓',
  '花香调味茶': '💐', '果香调味茶': '🍊', '薄荷调味茶': '🌿', '马黛茶': '🧉'
};

export const roadColorMap = {
  '古镇石板路': '#8B6914', '山间马道': '#A0522D', '森林小径': '#4A7C59',
  '碎石山路': '#808080', '乡间土路': '#C4A35A', '峡谷险道': '#6B3A2A',
  '草原牧道': '#7B9E5A', '雪山垭口': '#B0C4DE', '公路': '#4682B4',
  '沙漠驼道': '#D2B48C', '戈壁荒漠': '#C4A882', '茶园小径': '#6B8E4E',
  '悬崖栈道': '#555', '水路/渡口': '#1B5E84', '村庄小路': '#A0522D'
};

export const teaQuotes = [
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
  { text: '「一碗喉吻润，二碗破孤闷」', source: '卢仝《走笔谢孟谏议寄新茶》' },
  { text: '「三碗搜枯肠，唯有文字五千卷」', source: '卢仝《走笔谢孟谏议寄新茶》' },
  { text: '「七碗吃不得也，唯觉两腋习习清风生」', source: '卢仝《走笔谢孟谏议寄新茶》' },
  { text: '「活水还须活火烹」', source: '苏轼《汲江煎茶》' },
  { text: '「大瓢贮月归春瓮，小杓分江入夜瓶」', source: '苏轼《汲江煎茶》' },
  { text: '「雪乳已翻煎处脚，松风忽作泻时声」', source: '苏轼《汲江煎茶》' },
  { text: '「日长何所事，茗碗自赍持」', source: '唐寅《事茗图》' },
  { text: '「一饮涤昏寐，情来朗爽满天地」', source: '皎然《饮茶歌诮崔石使君》' },
  { text: '「再饮清我神，忽如飞雨洒轻尘」', source: '皎然《饮茶歌诮崔石使君》' },
  { text: '「三饮便得道，何须苦心破烦恼」', source: '皎然《饮茶歌诮崔石使君》' },
  { text: '「君不可一日无茶」', source: '乾隆典故' },
  { text: '「有好茶喝，会喝好茶，是一种清福」', source: '鲁迅《喝茶》' },
  { text: '「喝茶当于瓦屋纸窗之下，清泉绿茶，同二三人共饮，得半日之闲，可抵十年尘梦」', source: '周作人《喝茶》' },
  { text: '「吃茶去」', source: '赵州禅师' },
  { text: '「琴里知闻唯渌水，茶中故旧是蒙山」', source: '白居易《琴茶》' },
  { text: '「且将新火试新茶，诗酒趁年华」', source: '苏轼《望江南·超然台作》' },
  { text: '「雪沫乳花浮午盏，人间有味是清欢」', source: '苏轼《浣溪沙》' },
  { text: '「宁可三日无盐，不可一日无茶」', source: '游牧民族茶谚' },
  { text: '「神农尝百草，日遇七十二毒，得荼而解之」', source: '《神农本草经》' },
  { text: '「茶禅一味」', source: '圆悟克勤' },
  { text: '「自秦人取蜀，始有茗饮之事」', source: '顾炎武《日知录》' }
];