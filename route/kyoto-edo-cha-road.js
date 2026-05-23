window.TeaData = window.TeaData || {};
window.TeaData.route = window.TeaData.route || {};

window.TeaData.route['kyoto-edo-cha-road'] = {
  id: 'kyoto-edo-cha-road',
  name: '京都江户茶路',
  nameEn: 'The Kyoto-Edo Tea Road',
  continent: '亚洲',
  country: '日本',
  subtitle: '东海道上的抹茶与煎茶香',
  summary: '京都江户茶路是日本江户时代（1603-1868）从京都通往江户（今东京）的官方驿道"东海道"上的茶叶贸易之路。京都宇治抹茶、奈良煎茶、静冈玉露等茶品，经东海道五十三次驿站，由"茶飞脚"（专业茶邮差）肩挑背扛或用马驮，送往江户城。日本浮世绘大师歌川广重《东海道五十三次》系列名画，生动记录了这条茶路上的风景。',
  difficulty: '容易——主要是平原丘陵地形，驿站体系成熟，茶路安全舒适',
  mainTea: '宇治抹茶、煎茶、玉露、焙茶、玄米茶',
  distance: '约500公里',
  duration: '步行约10-15天，骑马约5-7天，茶飞脚3天可达',
  bestSeason: '3-4月樱花季、10-11月红叶季（风景最美，气候宜人）',
  terrain: '日本关东到关西的平原丘陵地带，依东海道而行',
  detailRoute: '起点：京都宇治→伏见→大津→京都三条大桥→东海道五十三次→江户日本桥（终点）。',
  stations: [
    { distKm: 0, alt: 50, name: '京都宇治', coord: [34.89, 135.80], distance: '0km', altitude: '50m', road: '宇治川茶路', desc: '起点，抹茶之乡！平等院凤凰堂倒映在宇治川中，两岸茶园连绵。宇治抹茶是皇室专供，每年第一釜新茶要由伏见稻荷大社祝福后才启程' },
    { distKm: 10, alt: 45, name: '伏见稻荷大社', coord: [34.96, 135.77], distance: '10km', altitude: '45m', road: '鸟居参道', desc: '稻荷大神是商人守护神，茶商出发前必来参拜。千本鸟居从山脚蔓延至山顶，茶路上的商人们会在鸟居上留下姓名' },
    { distKm: 30, alt: 85, name: '大津', coord: [35.01, 135.86], distance: '30km', altitude: '85m', road: '琵琶湖堤岸', desc: '东海道第一站，近江国首府。滨街临琵琶湖，是京都东大门。茶商在湖景茶馆饮茶休息，遥望比叡山' },
    { distKm: 80, alt: 50, name: '京都三条大桥', coord: [35.01, 135.77], distance: '80km', altitude: '50m', road: '东海道起点', desc: '东海道正式起点！三条大桥东头有"东海道起点"石碑，茶飞脚在此集结出发，桥旁的老字号茶屋"一保堂"已经营300多年' },
    { distKm: 130, alt: 100, name: '箱根', coord: [35.22, 139.00], distance: '130km', altitude: '100m', road: '箱根山道', desc: '富士山下温泉乡，浮世绘《神奈川冲浪里》的背景。箱根关卡是幕府检查货物的地方，茶包需一一打开检查——走私抹茶可是大罪' },
    { distKm: 200, alt: 60, name: '沼津', coord: [35.09, 138.86], distance: '200km', altitude: '60m', road: '海岸茶路', desc: '骏河湾畔渔港小镇。海风扑面，茶飞脚在此用新鲜海产佐茶——鱿鱼干配煎茶是途中奢侈享受' },
    { distKm: 300, alt: 50, name: '静冈', coord: [34.98, 138.38], distance: '300km', altitude: '50m', road: '茶园古道', desc: '玉露之乡！茶园面积全日本第一。富士山雪水灌溉的茶园产出极品玉露，茶飞脚在静冈茶市补充新茶' },
    { distKm: 400, alt: 30, name: '品川', coord: [35.61, 139.74], distance: '400km', altitude: '30m', road: '江户前街道', desc: '江户南郊，东海道最后一站。品川宿屋林立，茶商在此沐浴更衣，准备进城' },
    { distKm: 500, alt: 10, name: '江户日本桥', coord: [35.68, 139.77], distance: '500km', altitude: '10m', road: '江户城石板路', desc: '终点！日本桥是"天下道路起点"，也是东海道终点。桥旁的鱼河岸、茶屋、料亭云集，新鲜茶品在此发往江户全城' }
  ],
  roadLegend: { legend: '江户茶路', color: '#8B0000' },
  story: '【千利休与茶道】千利休是日本茶道大师，曾侍奉丰臣秀吉。虽未亲自走过东海道，但他确立的侘寂茶道美学，通过这条茶路从京都传到江户。江户后期，"煎茶道"从中国传入，经黄檗宗禅僧发扬光大，东海道上的文人雅士纷纷在驿站旁设茶室，一边品茗一边创作汉诗与浮世绘。' ,
  teas: ['kyoto-matcha', 'sencha', 'gyokuro', 'hojicha', 'genmaicha'],
  regions: ['京都', '宇治', '奈良', '静冈', '江户', '东海道', '箱根'],
  imageIcon: '🌸',
  color: '#8B0000'
};
