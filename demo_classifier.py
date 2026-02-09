"""
年份识别功能演示
展示如何识别不同格式的年份
"""
from year_classifier import classify_resource, extract_year, is_new_show

print("=" * 60)
print("年份识别功能演示")
print("=" * 60)
print()

# 演示 1: 提取年份
demo_titles = [
    "V世代 第二季 (2025)【8集全】",
    "安多第二季[2025]|剧情/动作/科幻",
    "异形：地球（2025） 更新03集",
    "最后生还者 第二季",
    "权力的游戏",
]

print("【演示 1】从标题提取年份")
print("-" * 60)
for title in demo_titles:
    year = extract_year(title)
    if year:
        print(f"标题: {title}")
        print(f"  → 提取到年份: {year}")
    else:
        print(f"标题: {title}")
        print(f"  → 未找到年份")
    print()

# 演示 2: 完整分类
print("【演示 2】完整资源分类")
print("-" * 60)

test_cases = [
    ("V世代 第二季 (2025)【8集全】4K高码率", ""),
    ("安多第二季[2025]|剧情/动作/科幻", ""),
    ("异形：地球（2025） 科幻/惊悚/恐怖 更新03集", ""),
    ("最后生还者 第二季", "年代：2025 动作/科幻/惊悚"),
    ("绝命毒师 (2008-2013)", ""),
    ("权力的游戏", "年代：2011 完结"),
]

for title, desc in test_cases:
    result = classify_resource(title, desc)
    print(f"标题: {title}")
    if desc:
        print(f"描述: {desc}")
    print(f"  → 年份: {result['year']}")
    print(f"  → 类型: {result['type']} ({'新剧' if result['type'] == 'new' else '经典剧' if result['type'] == 'classic' else '未知'})")
    print(f"  → 状态: {result['status']}")
    print(f"  → 置信度: {result['confidence']}")
    print()

# 演示 3: 判断是否为新剧
print("【演示 3】快速判断是否为新剧")
print("-" * 60)

test_titles = [
    "V世代 第二季 (2025)",
    "安多第二季[2025]",
    "绝命毒师 (2008)",
    "权力的游戏 年代：2011",
]

for title in test_titles:
    is_new = is_new_show(title)
    status = "[新剧]" if is_new else "[经典剧]"
    print(f"{status} | {title}")

print()
print("=" * 60)
print("演示完成！")
print("=" * 60)
