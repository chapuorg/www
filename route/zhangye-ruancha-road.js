window.TeaData = window.TeaData || {};
window.TeaData.route = window.TeaData.route || {};

window.TeaData.route['zhangye-ruancha-road'] = {
  id: 'zhangye-ruancha-road',
  name: '张掖砖茶之路',
  nameEn: 'The Zhangye Brick Tea Road',
  continent: '亚洲',
  country: '中国',
  subtitle: '河西走廊上的明清茶贸走廊',
  summary: '张掖砖茶之路是明清时期从中国南方茶区经河西走廊通往新疆、蒙古乃至俄罗斯的重要支线茶路。湖南安化砖茶、湖北羊楼洞砖茶经汉水北上至襄阳，再经潼关、西安、兰州、武威抵达张掖，在此集散后分两路：一路向北经额济纳旗通往蒙古，一路向西经嘉峪关、敦煌通往新疆。张掖作为河西走廊咽喉，是这条茶路最重要的中转站——古城内至今仍有明清茶马司遗址和茶商大院。',
  difficulty: '中等——主要是戈壁沙漠地形，夏季炎热干燥，冬季寒冷多尘沙',
  mainTea: '湖南安化黑砖茶、湖北羊楼洞青米砖茶、四川雅安藏茶、云南普洱砖茶',
  distance: '约1800公里',
  duration: '单程约2-3个月',
  bestSeason: '3-5月、9-11月（避开盛夏酷暑和严冬寒潮）',
  terrain: '河西走廊戈壁绿洲地形，穿越祁连山北麓戈壁、沙漠和绿洲',
  detailRoute: '起点：湖南安化→湖北羊楼洞（砖茶产地）→襄阳（汉水船运终点）→西安→兰州→武威→张掖（中转枢纽）→酒泉→嘉峪关→敦煌→新疆哈密，或张掖向北→额济纳旗→蒙古乌兰巴托。',
  stations: [
    { distKm: 0, alt: 100, name: '湖南安化', coord: [28.38, 111.22], distance: '0km', altitude: '100m', road: '茶园古道', desc: '起点，安化黑茶发源地。资水沿岸遍布茶园，明清茶商在此收茶压制砖茶。至今安化茶马古道遗迹尚存' },
    { distKm: 200, alt: 80, name: '湖北羊楼洞', coord: [29.62, 113.82], distance: '200km', altitude: '80m', road: '茶园古道', desc: '青砖茶之乡，"中国砖茶之都"。羊楼洞青米砖茶是这条路上的主流茶品，曾有茶庄百余家' },
    { distKm: 400, alt: 70, name: '汉口', coord: [30.58, 114.28], distance: '400km', altitude: '70m', road: '水路转陆路', desc: '汉水船运终点。砖茶从羊楼洞经汉水船运至此，再装车经樊城、老河口北上' },
    { distKm: 600, alt: 110, name: '襄阳樊城', coord: [32.05, 112.15], distance: '600km', altitude: '110m', road: '驿道石板路', desc: '汉水中游茶贸枢纽。樊城明清茶商云集，山陕会馆、抚州会馆等见证了当年茶市繁华' },
    { distKm: 900, alt: 400, name: '西安', coord: [34.34, 108.94], distance: '900km', altitude: '400m', road: '驿道石板路', desc: '千年古都，茶路重要节点。唐代长安茶市繁荣，明清仍是西北茶贸中心' },
    { distKm: 1100, alt: 1520, name: '兰州', coord: [36.06, 103.83], distance: '1100km', altitude: '1520m', road: '驿道石板路', desc: '黄河上游茶贸重镇。黄河边的兰州水车轮转，为茶路补充水源，茶商在此休整' },
    { distKm: 1300, alt: 1530, name: '武威', coord: [37.92, 102.63], distance: '1300km', altitude: '1530m', road: '戈壁驿道', desc: '河西走廊东端门户。武威文庙内曾有茶商捐建的碑刻，雷台汉墓旁是古驿道遗址' },
    { distKm: 1500, alt: 1480, name: '张掖', coord: [38.93, 100.45], distance: '1500km', altitude: '1480m', road: '古城石板路', desc: '终点/中转枢纽！"金张掖"，河西走廊最大茶市。明清茶马司设在此，城内山西会馆、陕西会馆等茶商大院林立。甘州市场的砖茶交易是当年河西走廊最热闹的风景' },
    { distKm: 1650, alt: 1470, name: '酒泉', coord: [39.73, 98.49], distance: '1650km', altitude: '1470m', road: '戈壁驿道', desc: '张掖西行第一站。酒泉古街两旁商铺林立，茶商与丝绸商人合住一处' },
    { distKm: 1800, alt: 1650, name: '嘉峪关', coord: [39.77, 98.28], distance: '1800km', altitude: '1650m', road: '戈壁驿道', desc: '万里长城西端终点。关城脚下仍有车辙深深的驿道，出关后即为茫茫戈壁——"出了嘉峪关，两眼泪不干"' }
  ],
  roadLegend: { legend: '砖茶之路', color: '#8B4513' },
  story: '【左宗棠与西北茶政】晚清同治年间，陕甘回民起义后西北茶路受阻。左宗棠任陕甘总督后整顿茶政，制定《茶务章程》，将西北茶引发放权交给湖南茶商——从此安化砖茶、羊楼洞砖茶大规模输入西北。甘肃兰州黄河铁桥建成前，茶商在黄河边用皮筏渡河，茶船倾覆时往往河面上漂流起大片砖茶，人称"黄河流茶"。',
  teas: ['anhua-dark-tea', 'yunnan-puer', 'yaan-cangcha', 'sichuan-biancha'],
  regions: ['湖南', '湖北', '陕西', '甘肃', '河西走廊', '新疆', '蒙古'],
  imageIcon: '🏔️',
  color: '#8B4513'
};
