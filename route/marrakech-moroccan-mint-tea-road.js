window.TeaData = window.TeaData || {};
window.TeaData.route = window.TeaData.route || {};

window.TeaData.route['marrakech-moroccan-mint-tea-road'] = {
  id: 'marrakech-moroccan-mint-tea-road',
  name: '马拉喀什薄荷茶之路',
  nameEn: 'The Marrakech Moroccan Mint Tea Road',
  continent: '非洲',
  country: '摩洛哥',
  subtitle: '阿特拉斯山脚下的撒哈拉茶路',
  summary: '马拉喀什薄荷茶之路是摩洛哥从地中海港口经马拉喀什通往撒哈拉沙漠商队之路的茶叶支线。中国绿茶从广州经海上丝绸之路运到摩洛哥丹吉尔港，或从埃及亚历山大经陆路至此，在马拉喀什与当地新鲜薄荷叶混合，成为"摩洛哥国饮"——薄荷茶。骆驼商队从马拉喀什出发，带着薄荷茶和糖块，穿越阿特拉斯山，前往撒哈拉绿洲，用茶与图阿雷格人交换盐和椰枣。',
  difficulty: '中等偏高——穿越阿特拉斯山和撒哈拉沙漠边缘，需要应对昼夜温差和风沙',
  mainTea: '中国珠茶、摩洛哥薄荷茶、埃及甜茶',
  distance: '约400公里',
  duration: '骆驼商队单程约7-10天',
  bestSeason: '3-5月、9-11月（避开夏季酷热和冬季寒潮）',
  terrain: '阿特拉斯山地与撒哈拉沙漠边缘绿洲地形',
  detailRoute: '起点：丹吉尔港→卡萨布兰卡→拉巴特→梅克内斯→马拉喀什（中枢）→阿伊特·本·哈杜村→瓦尔扎扎特→撒哈拉沙漠绿洲。',
  stations: [
    { distKm: 0, alt: 15, name: '丹吉尔港', coord: [35.76, -5.83], distance: '0km', altitude: '15m', road: '地中海港口', desc: '起点！直布罗陀海峡南岸。中国绿茶从广州经马六甲海峡、印度洋、红海、苏伊士运河（1869年后）、地中海运抵此处——从大海开始"茶之旅"' },
    { distKm: 150, alt: 50, name: '卡萨布兰卡', coord: [33.57, -7.59], distance: '150km', altitude: '50m', road: '大西洋海岸公路', desc: '白色之城，摩洛哥最大港口。里兹咖啡馆、海滨大道上茶馆林立，薄荷茶在这里与欧洲咖啡文化碰撞' },
    { distKm: 200, alt: 80, name: '拉巴特', coord: [34.02, -6.83], distance: '200km', altitude: '80m', road: '海岸公路', desc: '摩洛哥首都。老城区麦地那的香料市场旁，老茶馆聚集——蓝白相间的建筑与薄荷茶香是拉巴特的标志' },
    { distKm: 280, alt: 550, name: '梅克内斯', coord: [33.90, -5.55], distance: '280km', altitude: '550m', road: '皇家大道', desc: '摩洛哥四大皇城之一。穆莱伊斯梅尔皇宫旁有皇家茶苑，专供皇室薄荷茶' },
    { distKm: 400, alt: 470, name: '马拉喀什', coord: [31.63, -7.99], distance: '400km', altitude: '470m', road: '红色皇城石板路', desc: '终点/中枢！"南方珍珠"，整座城市是赭红色。杰马夫纳广场上，卖薄荷茶的小贩提着银茶壶，从一米高处斟茶，划出优美弧线——广场边的老茶馆已有百年历史' },
    { distKm: 480, alt: 600, name: '阿伊特·本·哈杜村', coord: [31.05, -7.12], distance: '480km', altitude: '600m', road: '阿特拉斯山道', desc: '阿特拉斯山脚下的古堡村落。夯土建筑层层叠叠，是电影《角斗士》《权力的游戏》取景地。商队在此休整，准备翻山' },
    { distKm: 580, alt: 1140, name: '瓦尔扎扎特', coord: [30.92, -6.91], distance: '580km', altitude: '1140m', road: '阿特拉斯山道', desc: '撒哈拉门户！电影之城，沙漠之门。骆驼商队在此最后补充水和薄荷叶，前方是茫茫撒哈拉' },
    { distKm: 700, alt: 530, name: '撒哈拉绿洲', coord: [30.72, -6.28], distance: '700km', altitude: '530m', road: '沙漠商道', desc: '撒哈拉边缘绿洲。图阿雷格商人在此用椰枣和盐换取茶，围坐篝火旁，用铜壶煮薄荷茶，茶香在星空下飘散' }
  ],
  roadLegend: { legend: '薄荷茶路', color: '#228B22' },
  story: '【摩洛哥薄荷茶的起源】18世纪中叶，英国商人将中国绿茶带到摩洛哥，最初是皇室专享。19世纪初，当地人发现加上新鲜薄荷叶（学名"留兰香"）更适合北非炎热气候——不仅清凉解暑，还能掩盖劣质茶叶的苦涩。从此薄荷茶成为"摩洛哥威士忌"，斟茶时必须从高处倒下（约1米高），让茶水充分氧化，产生丰富泡沫——这样才是"地道的摩洛哥茶"！' ,
  teas: ['moroccan-mint', 'green-tea'],
  regions: ['摩洛哥', '马拉喀什', '撒哈拉', '阿特拉斯山', '丹吉尔'],
  imageIcon: '🌵',
  color: '#228B22'
};
