window.TeaData = window.TeaData || {};
window.TeaData.route = window.TeaData.route || {};

window.TeaData.route['kyrgyz-pamir-tea-road'] = {
  id: 'kyrgyz-pamir-tea-road',
  name: '吉尔吉斯帕米尔茶路',
  nameEn: 'The Kyrgyz Pamir Tea Road',
  continent: '亚洲',
  country: '吉尔吉斯斯坦',
  subtitle: '天山与帕米尔高原之间的游牧茶路',
  summary: '吉尔吉斯帕米尔茶路是古代丝绸之路在中亚的重要支线，连接新疆喀什与吉尔吉斯斯坦比什凯克，再延伸至乌兹别克斯坦撒马尔罕。中国茶叶经此路进入中亚，与游牧民族的马奶、奶皮子结合，形成独特的中亚奶茶文化。至今，吉尔吉斯牧民的蒙古包里，奶茶仍是招待贵客的第一道礼节——奶茶的醇美里，还藏着千年前丝路商队的茶香。',
  difficulty: '高——翻越天山山脉和帕米尔高原，海拔高，气候严寒，氧气稀薄',
  mainTea: '湖北青砖茶、湖南黑茶、新疆茯砖茶、云南普洱、中亚咸奶茶',
  distance: '约800公里',
  duration: '骆驼商队单程约1个月',
  bestSeason: '5-9月（夏季高原温暖，其他季节大雪封山）',
  terrain: '天山与帕米尔高原山地草原，平均海拔3000米以上',
  detailRoute: '起点：新疆喀什→伊尔克什坦口岸→奥什→纳伦→比什凯克→碎叶城→塔什干→撒马尔罕（终点）。',
  stations: [
    { distKm: 0, alt: 1290, name: '新疆喀什', coord: [39.47, 75.99], distance: '0km', altitude: '1290m', road: '西域古城石板路', desc: '起点！"丝路明珠"，南疆最大城市。喀什噶尔古城的老茶馆里，维吾尔族老人用茯砖茶熬制奶茶——千年茶香从未中断' },
    { distKm: 100, alt: 3000, name: '伊尔克什坦口岸', coord: [39.71, 73.98], distance: '100km', altitude: '3000m', road: '天山山口', desc: '中国西陲，海拔3000米的山口。"西陲第一哨"在此，中国茶叶在此报关出境，骆驼商队在此接受检查' },
    { distKm: 250, alt: 950, name: '奥什', coord: [40.53, 72.80], distance: '250km', altitude: '950m', road: '中亚牧道', desc: '吉尔吉斯斯坦第二大城市，"中亚巴米扬"。大巴扎里茶铺林立，奶茶与香料的香气混合，是帕米尔茶路最重要的中转站' },
    { distKm: 400, alt: 2040, name: '纳伦', coord: [41.43, 76.06], distance: '400km', altitude: '2040m', road: '天山牧道', desc: '天山深处的草原城市。吉尔吉斯牧民在此夏季转场，蒙古包周围茶香阵阵——客人来首先奉上一碗咸奶茶' },
    { distKm: 550, alt: 760, name: '比什凯克', coord: [42.87, 74.59], distance: '550km', altitude: '760m', road: '中亚古道', desc: '吉尔吉斯斯坦首都，"碎叶城"在其附近（李白出生地传说）。阿拉套山下的茶园中，奶茶与马奶子的香气交织' },
    { distKm: 700, alt: 500, name: '塔什干', coord: [41.31, 69.28], distance: '700km', altitude: '500m', road: '中亚古道', desc: '乌兹别克斯坦首都。古驿站改建的茶馆里，人们一边品奶茶一边听阿肯弹唱——哈萨克民间诗人以史诗伴奏茶会' },
    { distKm: 800, alt: 710, name: '撒马尔罕', coord: [39.65, 66.97], distance: '800km', altitude: '710m', road: '丝路石板路', desc: '终点！帖木儿帝国古都，雷吉斯坦广场壮丽辉煌。古商队客栈"里贾斯坦"内，茶炊日夜不熄——来自东方的茶与西方的香料在此交融' }
  ],
  roadLegend: { legend: '帕米尔茶路', color: '#CD853F' },
  story: '【奶茶与游牧文化】中亚咸奶茶的配方来自中国砖茶：将茯砖茶敲碎，加清水熬煮，滤去茶叶，兑入牛奶或马奶，加盐。吉尔吉斯有句谚语："无茶不成席"——客人来，第一碗必须是奶茶，不喝就是不给主人面子。奶茶熬制过程中，女主人会在旁边念经祈祷，愿茶香带来平安与友谊。' ,
  teas: ['fu-brick', 'yunnan-puer', 'sichuan-biancha', 'yaan-cangcha'],
  regions: ['吉尔吉斯斯坦', '乌兹别克斯坦', '帕米尔', '天山', '撒马尔罕', '喀什'],
  imageIcon: '🏔️',
  color: '#CD853F'
};
