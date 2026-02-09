"""
美剧资源搜索工具 - 主程序
用法: python search.py "影片名称"
"""
import sys
import json
from typing import List, Dict

from show_searcher import ShowSearcher, search_show


def search_with_web_api(keyword: str) -> List[Dict]:
    """
    使用web-search搜索资源
    注意: 这里需要手动执行搜索，因为MCP工具需要在主会话中调用
    """
    print(f"请执行以下搜索命令获取结果:")
    print(f"  搜索关键词: {keyword} 夸克网盘")
    print()
    return []


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python search.py \"影片名称\"")
        print("示例: python search.py \"Y计划\"")
        print("      python search.py \"V世代 第二季\"")
        sys.exit(1)
    
    keyword = sys.argv[1]
    
    print("=" * 70)
    print("美剧资源搜索工具")
    print("=" * 70)
    print()
    
    # 方式1: 如果有web搜索结果，直接传入
    # 方式2: 手动构造搜索结果（用于测试）
    
    # 这里使用之前搜索Y计划的真实结果作为示例
    if "Y计划" in keyword:
        web_results = [
            {
                'title': 'Y计划(2025) 1080p 韩语中字【3.9G】 - 网盘资源社',
                'content': '导演: 李焕 主演: 韩韶禧 / 全钟瑞 https://pan.quark.cn/s/9a71d77f5482',
                'link': 'https://by669.org/d/58526'
            },
            {
                'title': '❤️【韩国开年最顶犯罪爽片】Y计划Project Y【2026公映】BD1080P',
                'content': '韩韶禧 X 全钟瑞 两大顶流女神首度双主演',
                'link': 'https://www.kuakeba.cn/thread-29961.htm'
            },
            {
                'title': 'Y计划 (2025) 高清完整版在线观看',
                'content': '夸克网盘资源热传 https://pan.quark.cn/s/334ad2043a1e',
                'link': 'https://www.jianshu.com/p/b95571235d3c'
            }
        ]
        
        results = search_show(keyword, web_results)
        
        if results:
            print(f"\n找到 {len(results)} 个有效资源！")
        else:
            print("\n未找到有效资源")
    else:
        print(f"正在搜索: {keyword}")
        print("-" * 70)
        print()
        print("请使用以下方式之一获取结果:")
        print()
        print("方式1: 使用web-search搜索后传入结果")
        print(f"       搜索关键词: {keyword} 夸克网盘")
        print()
        print("方式2: 在代码中添加该影片的搜索结果")
        print()


if __name__ == "__main__":
    main()
