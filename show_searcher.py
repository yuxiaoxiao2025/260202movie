"""
美剧资源搜索器 - 完整版
集成web搜索、年份识别、链接提取
"""
import re
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict

from year_classifier import classify_resource


@dataclass
class ResourceResult:
    """资源搜索结果"""
    title: str
    year: Optional[int]
    resource_type: str
    quark_links: List[str]
    source_url: str
    source_name: str


class ShowSearcher:
    """美剧/网剧资源搜索器"""
    
    def __init__(self):
        self.results: List[ResourceResult] = []
    
    def search_from_web_results(self, web_results: List[Dict]) -> List[ResourceResult]:
        """从web搜索结果中解析资源"""
        results = []
        
        for item in web_results:
            title = item.get('title', '')
            content = item.get('content', '')
            link = item.get('link', '')
            
            # 检查是否包含夸克链接
            quark_links = self._extract_quark_links(f"{title} {content}")
            
            if quark_links:
                result = self.parse_search_result(title, content, link)
                if result:
                    results.append(result)
        
        # 去重
        seen_links = set()
        unique_results = []
        for r in results:
            if r.quark_links[0] not in seen_links:
                seen_links.add(r.quark_links[0])
                unique_results.append(r)
        
        return unique_results
    
    def parse_search_result(self, title: str, description: str, url: str) -> Optional[ResourceResult]:
        """解析单个搜索结果"""
        classification = classify_resource(title, description)
        quark_links = self._extract_quark_links(f"{title} {description}")
        
        if not quark_links:
            return None
        
        source_name = self._extract_source_name(url)
        
        return ResourceResult(
            title=title,
            year=classification.get('year'),
            resource_type=classification.get('type', 'unknown'),
            quark_links=quark_links,
            source_url=url,
            source_name=source_name
        )
    
    def _extract_quark_links(self, text: str) -> List[str]:
        """提取夸克网盘链接"""
        pattern = r'https://pan\.quark\.cn/s/[a-zA-Z0-9]+'
        links = re.findall(pattern, text)
        return list(set(links))
    
    def _extract_source_name(self, url: str) -> str:
        """提取来源站点名称"""
        if 'suenen.com' in url:
            return '网盘资源避难所'
        elif 'kuakeba.cn' in url:
            return '夸克吧'
        elif 'by669.org' in url:
            return '网盘资源社'
        elif 'dalao.motewan.com' in url:
            return '大佬资源网'
        elif 'douban.com' in url:
            return '豆瓣'
        elif 'jianshu.com' in url:
            return '简书'
        else:
            match = re.search(r'https?://([^/]+)', url)
            if match:
                return match.group(1)
            return '未知来源'
    
    def display_results(self, results: List[ResourceResult], keyword: str = ""):
        """显示搜索结果"""
        if not results:
            print(f"未找到 '{keyword}' 的资源")
            return
        
        print("\n" + "=" * 70)
        print(f"搜索: {keyword}")
        print(f"找到 {len(results)} 个夸克网盘资源")
        print("=" * 70)
        
        for i, result in enumerate(results, 1):
            print(f"\n【{i}】{result.title}")
            
            if result.year:
                year_type = "新剧" if result.resource_type == 'new' else "经典剧"
                print(f"    年份: {result.year} ({year_type})")
            else:
                print(f"    年份: 未知")
                
            print(f"    来源: {result.source_name}")
            print(f"    夸克链接:")
            for link in result.quark_links:
                print(f"      -> {link}")
        
        print("\n" + "=" * 70)
        print("提示: 复制链接到浏览器打开，即可保存到夸克网盘")
        print("=" * 70)


def search_show(keyword: str, web_results: List[Dict]) -> List[ResourceResult]:
    """便捷函数：搜索影片"""
    searcher = ShowSearcher()
    results = searcher.search_from_web_results(web_results)
    searcher.display_results(results, keyword)
    return results
