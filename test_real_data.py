"""
真实数据验证测试 - 使用已验证的2025新剧数据测试年份识别

测试数据来源：
- 《V世代 第二季》(2025) - https://pan.quark.cn/s/a5cc030eae35
- 《安多 第二季》[2025] - 腾讯频道更新
- 《异形：地球》(2025) - 更新至03集
"""
import sys
from year_classifier import YearClassifier, classify_resource, is_new_show, extract_year


class TestData:
    """真实测试数据集 - 基于2026-02-08搜索验证的真实资源"""
    
    # 2025新剧（已验证的真实数据）
    NEW_SHOWS_2025 = [
        {
            "title": "V世代 第二季 (2025)【8集全】4K高码率",
            "description": "夸克网盘资源分享",
            "expected_year": 2025,
            "expected_type": "new",
            "expected_status": "completed",
            "source": "网盘资源避难所 suenen.com",
            "quark_link": "https://pan.quark.cn/s/a5cc030eae35"
        },
        {
            "title": "安多第二季[2025]|剧情/动作/科幻",
            "description": "夸克网盘影视资源",
            "expected_year": 2025,
            "expected_type": "new",
            "expected_status": "unknown",
            "source": "腾讯频道 pd.qq.com"
        },
        {
            "title": "异形：地球（2025） 科幻/惊悚/恐怖 更新03集",
            "description": "2025年最新美剧",
            "expected_year": 2025,
            "expected_type": "new",
            "expected_status": "ongoing",
            "source": "腾讯频道"
        },
        {
            "title": "最后生还者 第二季",
            "description": "年代：2025 动作/科幻/惊悚",
            "expected_year": 2025,
            "expected_type": "new",
            "expected_status": "unknown",
            "source": "豆瓣日记"
        },
        {
            "title": "黑镜 第七季 (2025)",
            "description": "更新至第3集",
            "expected_year": 2025,
            "expected_type": "new",
            "expected_status": "ongoing",
            "source": "资源站"
        },
        {
            "title": "人生复本 第二季 [2025]",
            "description": "科幻悬疑美剧",
            "expected_year": 2025,
            "expected_type": "new",
            "expected_status": "unknown",
            "source": "资源站"
        },
        {
            "title": "白莲花度假村 第三季",
            "description": "2025-02-07 更新",
            "expected_year": 2025,
            "expected_type": "new",
            "expected_status": "unknown",
            "source": "资源站"
        },
    ]
    
    # 经典老剧（应该被过滤掉）
    CLASSIC_SHOWS = [
        {
            "title": "绝命毒师 (2008-2013)",
            "description": "经典美剧",
            "expected_year": 2013,
            "expected_type": "classic",
            "expected_status": "completed",
            "source": "经典库"
        },
        {
            "title": "权力的游戏",
            "description": "年代：2011 完结",
            "expected_year": 2011,
            "expected_type": "classic",
            "expected_status": "completed",
            "source": "经典库"
        },
        {
            "title": "老友记 (1994-2004)",
            "description": "全10季",
            "expected_year": 2004,
            "expected_type": "classic",
            "expected_status": "completed",
            "source": "经典库"
        },
        {
            "title": "火线 (2002-2008)",
            "description": "全5季完结",
            "expected_year": 2008,
            "expected_type": "classic",
            "expected_status": "completed",
            "source": "经典库"
        },
        {
            "title": "风骚律师 (2015-2022)",
            "description": "完结",
            "expected_year": 2022,
            "expected_type": "classic",  # 2022 < 2024阈值
            "expected_status": "completed",
            "source": "经典库"
        },
    ]
    
    # 边界测试数据
    EDGE_CASES = [
        {
            "title": "某剧 (2024)",
            "description": "",
            "expected_year": 2024,
            "expected_type": "new",  # 2024 >= 2024阈值
            "expected_status": "unknown",
            "note": "边界年份2024"
        },
        {
            "title": "某剧 (2023)",
            "description": "",
            "expected_year": 2023,
            "expected_type": "classic",  # 2023 < 2024阈值
            "expected_status": "unknown",
            "note": "边界年份2023"
        },
        {
            "title": "无年份标题",
            "description": "年代：2026",
            "expected_year": 2026,
            "expected_type": "new",
            "expected_status": "unknown",
            "note": "年份只在描述中"
        },
        {
            "title": "",
            "description": "",
            "expected_year": None,
            "expected_type": "unknown",
            "expected_status": "unknown",
            "note": "空数据"
        },
    ]


def run_tests():
    """运行所有测试"""
    classifier = YearClassifier()
    
    print("=" * 70)
    print("2025新剧追踪器 - 真实数据验证测试")
    print("=" * 70)
    print()
    
    all_passed = 0
    all_failed = 0
    
    # 测试1: 2025新剧识别
    print("【测试1】2025新剧识别（已验证的真实数据）")
    print("-" * 70)
    
    passed = 0
    failed = 0
    
    for test_case in TestData.NEW_SHOWS_2025:
        title = test_case["title"]
        desc = test_case.get("description", "")
        
        result = classifier.classify_resource(title, desc)
        
        # 验证
        checks = [
            (result["year"] == test_case["expected_year"], f"年份 {result['year']} == {test_case['expected_year']}"),
            (result["type"] == test_case["expected_type"], f"类型 {result['type']} == {test_case['expected_type']}"),
            (result["status"] == test_case["expected_status"], f"状态 {result['status']} == {test_case['expected_status']}"),
        ]
        
        all_match = all(check[0] for check in checks)
        
        if all_match:
            passed += 1
            status = "[PASS]"
        else:
            failed += 1
            status = "[FAIL]"

        print(f"{status} | {title[:40]}...")
        print(f"       来源: {test_case.get('source', '未知')}")
        print(f"       结果: 年份={result['year']}, 类型={result['type']}, 状态={result['status']}")

        if not all_match:
            for check, msg in checks:
                if not check:
                    print(f"       [X] {msg}")
        print()
    
    print(f"测试1结果: 通过 {passed}/{len(TestData.NEW_SHOWS_2025)}, 失败 {failed}/{len(TestData.NEW_SHOWS_2025)}")
    print()
    
    all_passed += passed
    all_failed += failed
    
    # 测试2: 经典剧过滤
    print("【测试2】经典剧过滤（应被识别为classic）")
    print("-" * 70)
    
    passed = 0
    failed = 0
    
    for test_case in TestData.CLASSIC_SHOWS:
        title = test_case["title"]
        desc = test_case.get("description", "")
        
        result = classifier.classify_resource(title, desc)
        
        checks = [
            (result["year"] == test_case["expected_year"], f"年份 {result['year']} == {test_case['expected_year']}"),
            (result["type"] == test_case["expected_type"], f"类型 {result['type']} == {test_case['expected_type']}"),
        ]
        
        all_match = all(check[0] for check in checks)
        
        if all_match:
            passed += 1
            status = "[PASS]"
        else:
            failed += 1
            status = "[FAIL]"

        print(f"{status} | {title}")
        print(f"       结果: 年份={result['year']}, 类型={result['type']}")

        if not all_match:
            for check, msg in checks:
                if not check:
                    print(f"       [X] {msg}")
        print()
    
    print(f"测试2结果: 通过 {passed}/{len(TestData.CLASSIC_SHOWS)}, 失败 {failed}/{len(TestData.CLASSIC_SHOWS)}")
    print()
    
    all_passed += passed
    all_failed += failed
    
    # 测试3: 边界情况
    print("【测试3】边界情况测试")
    print("-" * 70)
    
    passed = 0
    failed = 0
    
    for test_case in TestData.EDGE_CASES:
        title = test_case.get("title", "")
        desc = test_case.get("description", "")
        note = test_case.get("note", "")
        
        result = classifier.classify_resource(title, desc)
        
        checks = [
            (result["year"] == test_case["expected_year"], f"年份 {result['year']} == {test_case['expected_year']}"),
            (result["type"] == test_case["expected_type"], f"类型 {result['type']} == {test_case['expected_type']}"),
        ]
        
        all_match = all(check[0] for check in checks)
        
        if all_match:
            passed += 1
            status = "[PASS]"
        else:
            failed += 1
            status = "[FAIL]"

        display_title = title if title else "[空标题]"
        print(f"{status} | {display_title} ({note})")
        print(f"       结果: 年份={result['year']}, 类型={result['type']}")

        if not all_match:
            for check, msg in checks:
                if not check:
                    print(f"       [X] {msg}")
        print()
    
    print(f"测试3结果: 通过 {passed}/{len(TestData.EDGE_CASES)}, 失败 {failed}/{len(TestData.EDGE_CASES)}")
    print()
    
    all_passed += passed
    all_failed += failed
    
    # 测试4: 便捷函数
    print("【测试4】便捷函数测试")
    print("-" * 70)
    
    # is_new_show测试
    new_show_check = is_new_show("V世代 第二季 (2025)")
    classic_check = is_new_show("绝命毒师 (2008)")
    
    func_passed = 0
    func_failed = 0
    
    if new_show_check == True:
        print("[PASS] | is_new_show('V世代 第二季 (2025)') == True")
        func_passed += 1
    else:
        print("[FAIL] | is_new_show('V世代 第二季 (2025)') 应为 True")
        func_failed += 1

    if classic_check == False:
        print("[PASS] | is_new_show('绝命毒师 (2008)') == False")
        func_passed += 1
    else:
        print("[FAIL] | is_new_show('绝命毒师 (2008)') 应为 False")
        func_failed += 1

    # extract_year测试
    year = extract_year("安多第二季[2025]")
    if year == 2025:
        print("[PASS] | extract_year('安多第二季[2025]') == 2025")
        func_passed += 1
    else:
        print(f"[FAIL] | extract_year('安多第二季[2025]') 应为 2025, 实际 {year}")
        func_failed += 1
    
    print(f"测试4结果: 通过 {func_passed}/3, 失败 {func_failed}/3")
    print()
    
    all_passed += func_passed
    all_failed += func_failed
    
    # 汇总
    total = all_passed + all_failed
    print("=" * 70)
    print("【测试汇总】")
    print("=" * 70)
    print(f"总测试数: {total}")
    print(f"通过: {all_passed} ({all_passed/total*100:.1f}%)")
    print(f"失败: {all_failed} ({all_failed/total*100:.1f}%)")
    print()
    
    if all_failed == 0:
        print("[SUCCESS] 所有测试通过！年份识别模块工作正常。")
        return 0
    else:
        print(f"[WARNING] 有 {all_failed} 个测试失败，请检查年份识别逻辑。")
        return 1


def test_filter_functionality():
    """测试过滤功能"""
    print()
    print("=" * 70)
    print("【过滤功能测试】验证只保留2025+新剧")
    print("=" * 70)
    print()
    
    classifier = YearClassifier()
    
    # 混合数据
    mixed_items = [
        {"title": "V世代 第二季 (2025)", "description": ""},
        {"title": "绝命毒师 (2008)", "description": ""},
        {"title": "安多第二季[2025]", "description": ""},
        {"title": "权力的游戏", "description": "年代：2011"},
        {"title": "异形：地球（2025）", "description": ""},
    ]
    
    # 过滤2025+
    filtered = classifier.filter_by_year(mixed_items, min_year=2025)
    
    print("原始数据:")
    for item in mixed_items:
        print(f"  - {item['title']}")
    print()
    
    print("过滤后（只保留2025+）:")
    for item in filtered:
        cls = item.get('classification', {})
        print(f"  - {item['title']} (年份: {cls.get('year')})")
    print()
    
    # 验证
    expected_titles = {"V世代 第二季 (2025)", "安多第二季[2025]", "异形：地球（2025）"}
    actual_titles = {item['title'] for item in filtered}
    
    if actual_titles == expected_titles:
        print("[PASS] | 过滤功能正确，只保留了2025+新剧")
        return True
    else:
        print(f"[FAIL] | 过滤结果不匹配")
        print(f"       期望: {expected_titles}")
        print(f"       实际: {actual_titles}")
        return False


if __name__ == "__main__":
    exit_code = run_tests()
    
    # 额外测试过滤功能
    filter_passed = test_filter_functionality()
    
    if exit_code == 0 and filter_passed:
        print()
        print("[SUCCESS] 所有验证通过！系统可以正确处理2025新剧数据。")
        sys.exit(0)
    else:
        print()
        print("[WARNING] 部分验证失败，请检查代码。")
        sys.exit(1)
