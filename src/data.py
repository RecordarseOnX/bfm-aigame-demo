import random
import json
from pypinyin import lazy_pinyin

# -------------------------------
# 城市分层
# -------------------------------
tier1_cities = ["玉环市", "温岭市", "宁波市", "滕州市", "东莞市", "上海市", "北京市", "沈阳市"]
new_tier1_cities = ["成都市", "杭州市", "苏州市", "武汉市", "昆明市", "哈尔滨市"]
tier2_cities = ["济南市", "无锡市", "厦门市", "福州市", "温州市", "金华市",
"大连市", "贵阳市", "南宁市", "泉州市", "石家庄市", "长春市", "南昌市", "惠州市",
"常州市", "嘉兴市", "徐州市", "南通市", "太原市", "保定市", "珠海市", "中山市",
"兰州市", "临沂市", "潍坊市", "烟台市", "绍兴市"]
tier3_cities = ["台州市", "海口市", "洛阳市", "廊坊市", "汕头市", "湖州市", "咸阳市",
"盐城市", "济宁市", "呼和浩特市", "扬州市", "赣州市", "阜阳市", "唐山市", "镇江市",
"邯郸市", "银川市", "南阳市", "桂林市", "泰州市", "遵义市", "江门市", "揭阳市",
"芜湖市", "商丘市", "连云港市", "新乡市", "淮安市", "淄博市", "绵阳市", "菏泽市",
"漳州市", "周口市", "沧州市", "信阳市", "衡阳市", "湛江市", "三亚市", "上饶市",
"邢台市", "莆田市", "柳州市", "宿迁市", "九江市", "襄阳市", "驻马店市", "宜昌市",
"岳阳市", "肇庆市", "滁州市", "威海市", "德州市", "泰安市", "安阳市", "荆州市",
"运城市", "安庆市", "潮州市", "清远市", "开封市", "宿州市", "株洲市", "蚌埠市",
"许昌市", "宁德市", "六安市", "宜春市", "聊城市", "渭南市"]

# -------------------------------
# 厂家名字构造
# -------------------------------
prefixes = [
    "华东", "长江", "申科", "南方", "北方", "精密", "联合", "东方", "中科", "时代",
    "宏远", "国机", "金属", "力科", "锐达", "恒昌", "博世", "凯达", "新兴", "远东",
    "星海", "航天", "智达", "光电", "芯能", "蓝海", "龙腾", "云科", "飞越", "瑞光",
    "天工", "卓越", "新锐", "启航", "聚能", "恒力", "精锐", "赛德", "信达", "华创"
]

suffixes = [
    "机床厂", "智能制造", "精工", "工业", "科技", "设备", "集团", "有限公司",
    "数控", "机械厂", "精密机械", "制造厂", "动力", "重工",
    "智能装备", "精工科技", "自动化", "精密制造", "机电系统", "机械科技", "工业集团"
]

# -------------------------------
# 颜色增强版（鲜亮+现代）
# -------------------------------
logo_colors = [
    "007BFF", "28A745", "DC3545", "FFC107", "20C997", "6610F2",
    "FF6B6B", "17A2B8", "FF4081", "00BFA5", "3F51B5", "E91E63",
    "009688", "8E24AA", "F44336", "4CAF50", "2196F3", "FF9800",
    "9C27B0", "03A9F4"
]

# -------------------------------
# 行业终端客户更丰富
# -------------------------------
end_user_names = [
    # 汽车/新能源
    "特斯拉", "比亚迪", "上汽集团", "长城汽车", "吉利汽车", "广汽集团", "蔚来汽车", "小鹏汽车", "理想汽车",
    # 工业/制造
    "中车", "中航工业", "航发集团", "中联重科", "三一重工", "徐工集团", "潍柴动力",
    # 电子/半导体
    "台积电", "富士康", "华为", "中芯国际", "京东方", "联想", "闻泰科技", "格力电器",
    # 新能源/材料
    "宁德时代", "隆基绿能", "阳光电源", "通威股份", "天合光能", "协鑫科技",
    # 医疗/生物
    "迈瑞医疗", "联影医疗", "华大基因", "安科生物", "微创医疗",
    # 机械/装备制造
    "沈阳机床", "大连机床",  "安川电机", "三菱重工",
    # 消费电子/家电
    "美的集团", "海尔集团", "格力集团", "松下电器", "索尼", "三星",
    # 建筑/工程
    "中国建筑", "中铁集团", "中交集团", "中冶集团", "中能建"
]

end_user_tags = [
    "汽车", "新能源", "轨道交通", "3C电子", "航空航天", "半导体", "军工", "医疗器械", "机械装备", "家电制造", "建筑工程"
]

# -------------------------------
# 附加说明
# -------------------------------
supplementary_infos = [
    "该公司计划扩大生产线，对高端机床有潜在需求。",
    "正在进行数字化转型，对我们的MES系统表现出兴趣。",
    "新成立的创业公司，专注于精密模具制造，资金充足。",
    "传统国企，决策流程较慢。",
    "我们的长期战略合作伙伴，合作稳定。",
    "正在引入自动化生产线，需求增长明显。",
    "计划建设新能源工厂，对大型铣床有需求。",
    "涉足半导体封装测试设备，潜在采购可能。",
    "军工背景，对五轴联动机床有需求。",
    "医疗器械扩张，需求以小型精密机床为主。",
    "积极参与智能制造示范区建设项目。",
    "近期获得政府专项资金支持，产能即将翻倍。"
]

# -------------------------------
# 函数定义
# -------------------------------
def random_company_name():
    return random.choice(prefixes) + random.choice(suffixes)

def generate_letters(name):
    first_two = name[:2]
    return "".join([p[0].upper() for p in lazy_pinyin(first_two)])

def generate_company(city_prefix, idx, positioning):
    name = random_company_name()

    if positioning == "大客户":
        last_year_orders = random.randint(500, 1500)
    elif positioning == "重点客户":
        last_year_orders = random.randint(100, 200)
    elif positioning == "潜力客户":
        last_year_orders = random.randint(20, 100)
    else:
        last_year_orders = random.randint(1, 10)

    this_year_orders = last_year_orders + random.randint(-last_year_orders // 5, last_year_orders // 5)
    last_quarter_orders = max(0, last_year_orders // 4 + random.randint(-last_year_orders // 10, last_year_orders // 10))
    this_quarter_orders = max(0, this_year_orders // 4 + random.randint(-this_year_orders // 10, this_year_orders // 10))

    info_count = random.randint(0, 2)
    supplementary_info = None
    if info_count > 0:
        supplementary_info = " ".join(random.sample(supplementary_infos, info_count))

    return {
        "id": f"{city_prefix}-{idx:03d}",
        "name": name,
        "letters": generate_letters(name),
        "logoColor": random.choice(logo_colors),
        "positioning": positioning,
        "supplementaryInfo": supplementary_info,
        "competitorsList": random.sample(["西门子", "三菱", "广数", "华数"], random.randint(0, 2)),
        "lastYearDemand": last_year_orders,
        "thisYearOrders": this_year_orders,
        "lastYearOrders": last_year_orders,
        "thisQuarterOrders": this_quarter_orders,
        "lastQuarterOrders": last_quarter_orders,
        "machineTypes": random.sample(
            ["车床", "铣床", "磨床", "钻床", "镗床", "切断机床", "刨床", "加工中心", "五轴机床"],
            random.randint(1, 3)
        ),
        "endUsers": [
            {"name": random.choice(end_user_names), "tag": random.choice(end_user_tags)}
            for _ in range(random.randint(1, 3))
        ]
    }

# -------------------------------
# 数据生成
# -------------------------------
def generate_city_data():
    mtb_data = {}
    total_orders = 0

    def process_city(city_list, patterns):
        nonlocal total_orders
        for city in city_list:
            city_companies = []
            company_idx = 1
            prefix = "".join([c for c in city[:2]])

            for positioning, count_range in patterns:
                for _ in range(random.randint(*count_range)):
                    company = generate_company(prefix, company_idx, positioning)
                    city_companies.append(company)
                    total_orders += company["thisYearOrders"]
                    company_idx += 1
            mtb_data[city] = city_companies

    process_city(tier1_cities, [("大客户", (5, 10)), ("重点客户", (5, 8)), ("潜力客户", (5, 8)), ("小客户", (2, 4))])
    process_city(new_tier1_cities, [("重点客户", (4, 6)), ("潜力客户", (3, 5)), ("小客户", (2, 3))])
    process_city(tier2_cities, [("重点客户", (2, 4)), ("潜力客户", (1, 3)), ("小客户", (1, 2))])
    process_city(tier3_cities, [("重点客户", (1, 3)), ("潜力客户", (1, 2)), ("小客户", (1, 2))])

    print(f"预计总订单量: {total_orders:,}")
    return mtb_data

mtb_data = generate_city_data()
total_companies = sum(len(v) for v in mtb_data.values())

# -------------------------------
# 输出 JS 文件
# -------------------------------
with open("mockData.js", "w", encoding="utf-8") as f:
    f.write("export const mtbData = ")
    json.dump(mtb_data, f, ensure_ascii=False, indent=2)
    f.write(";")

print("\n生成完毕！")
print(f"  - 共生成城市: {len(mtb_data)}")
print(f"  - 共生成公司: {total_companies}")
