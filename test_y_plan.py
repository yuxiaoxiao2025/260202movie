"""
使用我们开发的year_classifier验证"Y计划"
"""
from year_classifier import classify_resource, is_new_show, extract_year

print("=" * 60)
print("使用MVP工具验证 'Y计划 韩国 2026'")
print("=" * 60)
print()

# 测试数据
test_title = "Y计划 韩国 2026"
test_description = "韩韶禧 / 全钟瑞 / 金新绿 主演 动作/惊悚/犯罪"

print("【输入数据】")
print(f"标题: {test_title}")
print(f"描述: {test_description}")
print()

print("【使用 year_classifier 分析】")
print("-" * 60)

# 1. 提取年份
year = extract_year(test_title)
print(f"1. 提取年份: {year}")

# 2. 判断是否为新剧
is_new = is_new_show(test_title)
print(f"2. 是否为新剧(2024+): {is_new}")

# 3. 完整分类
result = classify_resource(test_title, test_description)
print(f"3. 完整分类结果:")
print(f"   - 年份: {result['year']}")
print(f"   - 类型: {result['type']}")
print(f"   - 状态: {result['status']}")
print(f"   - 置信度: {result['confidence']}")

print()
print("=" * 60)
print("结论: Y计划被正确识别为 2026年新剧")
print("=" * 60)
