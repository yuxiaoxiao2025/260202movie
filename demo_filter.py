"""
过滤功能演示
展示如何过滤只保留2025+新剧
"""
from year_classifier import YearClassifier

print("=" * 60)
print("过滤功能演示")
print("=" * 60)
print()

# 模拟从网站抓取的数据
raw_data = [
    {"title": "V世代 第二季 (2025)【8集全】", "quark_link": "https://pan.quark.cn/s/a5cc030eae35"},
    {"title": "绝命毒师 (2008-2013) 全5季", "quark_link": ""},
    {"title": "安多第二季[2025]", "quark_link": ""},
    {"title": "权力的游戏", "description": "年代：2011 完结"},
    {"title": "异形：地球（2025） 更新03集", "quark_link": ""},
    {"title": "老友记 (1994-2004) 全10季", "quark_link": ""},
    {"title": "黑镜 第七季 (2025)", "description": "更新至第3集"},
]

print("【原始数据】从网站抓取的所有资源:")
print("-" * 60)
for i, item in enumerate(raw_data, 1):
    title = item.get("title", "")
    print(f"{i}. {title}")
print()

# 使用分类器过滤
classifier = YearClassifier()

print("【过滤过程】只保留2025+新剧:")
print("-" * 60)

filtered = []
for item in raw_data:
    title = item.get("title", "")
    description = item.get("description", "")

    classification = classifier.classify_resource(title, description)

    if classification["type"] == "new":
        item["classification"] = classification
        filtered.append(item)
        print(f"[保留] {title}")
        print(f"       年份: {classification['year']}, 类型: {classification['type']}")
    else:
        print(f"[过滤] {title}")
        print(f"       年份: {classification['year']}, 类型: {classification['type']} (经典剧)")

print()
print("=" * 60)
print("【过滤结果】")
print("=" * 60)
print(f"原始数据: {len(raw_data)} 部")
print(f"过滤后: {len(filtered)} 部 (只保留2025+新剧)")
print()
print("保留的新剧列表:")
for i, item in enumerate(filtered, 1):
    cls = item.get("classification", {})
    print(f"{i}. {item['title']} ({cls.get('year')}年)")

print()
print("=" * 60)
print("演示完成!")
print("=" * 60)
