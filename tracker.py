"""
新剧追踪器 - 模式A：追新剧（监控2025-2026年美剧更新）
支持站点：腾讯频道(pd.qq.com)、网盘资源避难所(suenen.com)
"""
import re
import time
import hashlib
from datetime import datetime
from typing import List, Dict, Optional, Union
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, Tag

from year_classifier import YearClassifier, classify_resource


class NewShowTracker:
    """新剧追踪器 - 专门监控2025+新剧更新"""
    
    # 默认请求头
    DEFAULT_HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    }
    
    # 请求间隔（秒）- 基础反爬
    REQUEST_DELAY = 5
    
    def __init__(self, config: Optional[Dict] = None):
        """
        初始化追踪器
        
        Args:
            config: 配置字典，包含sites, threshold等
        """
        self.config = config if config is not None else {}
        self.classifier = YearClassifier(
            threshold=self.config.get('threshold', 2024)
        )
        self.session = requests.Session()
        self.session.headers.update(self.DEFAULT_HEADERS)
        
        # 已处理的链接（去重用）
        self.seen_links: set = set()
        
        # 结果存储
        self.results: List[Dict] = []
    
    def fetch_page(self, url: str, retries: int = 3) -> Optional[str]:
        """
        获取页面内容
        
        Args:
            url: 页面URL
            retries: 重试次数
            
        Returns:
            页面HTML内容，失败返回None
        """
        for attempt in range(retries):
            try:
                time.sleep(self.REQUEST_DELAY)  # 遵守请求间隔
                response = self.session.get(url, timeout=30)
                response.encoding = 'utf-8'
                
                if response.status_code == 200:
                    return response.text
                else:
                    print(f"请求失败: {url}, 状态码: {response.status_code}")
                    
            except Exception as e:
                print(f"请求异常 ({attempt + 1}/{retries}): {url}, 错误: {e}")
                if attempt < retries - 1:
                    time.sleep(self.REQUEST_DELAY * 2)
                
        return None
    
    def extract_quark_links(self, text: str) -> List[str]:
        """
        提取夸克网盘链接
        
        Args:
            text: 文本内容
            
        Returns:
            夸克链接列表
        """
        # 夸克链接模式
        patterns = [
            r'https://pan\.quark\.cn/s/[a-zA-Z0-9]+',
            r'https://pan\.quark\.cn/s/\w+',
        ]
        
        links = []
        for pattern in patterns:
            matches = re.findall(pattern, text)
            links.extend(matches)
        
        return list(set(links))  # 去重
    
    def generate_id(self, item: Dict) -> str:
        """
        生成资源唯一ID（用于去重）
        
        Args:
            item: 资源字典
            
        Returns:
            唯一ID
        """
        # 优先使用夸克链接生成ID
        if item.get('quark_links'):
            return hashlib.md5(item['quark_links'][0].encode()).hexdigest()[:16]
        
        # 否则使用标题+年份
        key = f"{item.get('title', '')}-{item.get('year', '')}"
        return hashlib.md5(key.encode()).hexdigest()[:16]
    
    def parse_suenen_item(self, element: Tag) -> Optional[Dict]:
        """
        解析网盘资源避难所(suenen.com)的单个资源项

        Args:
            element: BeautifulSoup元素

        Returns:
            资源字典或None
        """
        try:
            # 提取标题
            title_elem = element.find('h2') or element.find('h3') or element.find('a', class_='title')
            if not title_elem:
                return None

            title = title_elem.get_text(strip=True)

            # 提取描述
            desc_elem = element.find('div', class_='description') or element.find('p')
            description = desc_elem.get_text(strip=True) if desc_elem else ""

            # 提取链接
            link_attr = title_elem.get('href', '')
            link = str(link_attr) if link_attr else ''
            if link and not link.startswith('http'):
                link = urljoin('https://suenen.com', link)
            
            # 提取夸克链接
            full_text = f"{title} {description}"
            quark_links = self.extract_quark_links(full_text)
            
            # 年份分类
            classification = self.classifier.classify_resource(title, description)
            
            return {
                'title': title,
                'description': description,
                'link': link,
                'quark_links': quark_links,
                'source': 'suenen.com',
                'crawled_at': datetime.now().isoformat(),
                'classification': classification,
                'year': classification.get('year'),
                'status': classification.get('status'),
            }
            
        except Exception as e:
            print(f"解析项目失败: {e}")
            return None
    
    def parse_qqpd_item(self, element: Tag) -> Optional[Dict]:
        """
        解析腾讯频道(pd.qq.com)的单个资源项

        Args:
            element: BeautifulSoup元素

        Returns:
            资源字典或None
        """
        try:
            # 腾讯频道结构（需要根据实际页面调整）
            title_elem = element.find('div', class_='title') or element.find('span', class_='title')
            if not title_elem:
                return None
                
            title = title_elem.get_text(strip=True)
            
            # 提取描述
            desc_elem = element.find('div', class_='content') or element.find('div', class_='desc')
            description = desc_elem.get_text(strip=True) if desc_elem else ""
            
            # 提取夸克链接
            full_text = f"{title} {description}"
            quark_links = self.extract_quark_links(full_text)
            
            # 年份分类
            classification = self.classifier.classify_resource(title, description)
            
            return {
                'title': title,
                'description': description,
                'link': '',  # 腾讯频道通常是内部链接
                'quark_links': quark_links,
                'source': 'pd.qq.com',
                'crawled_at': datetime.now().isoformat(),
                'classification': classification,
                'year': classification.get('year'),
                'status': classification.get('status'),
            }
            
        except Exception as e:
            print(f"解析腾讯频道项目失败: {e}")
            return None
    
    def fetch_suenen(self, page: int = 1) -> List[Dict]:
        """
        从网盘资源避难所获取资源
        
        Args:
            page: 页码
            
        Returns:
            资源列表
        """
        url = f"https://suenen.com/page/{page}" if page > 1 else "https://suenen.com"
        html = self.fetch_page(url)
        
        if not html:
            return []
        
        soup = BeautifulSoup(html, 'html.parser')
        items = []
        
        # 查找资源项（根据实际HTML结构调整选择器）
        # 常见结构：article.post 或 div.item
        selectors = ['article.post', 'div.item', 'div.post', '.post-item', 'article']
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                for elem in elements:
                    item = self.parse_suenen_item(elem)
                    if item:
                        items.append(item)
                break
        
        return items
    
    def fetch_qqpd(self, channel_url: str) -> List[Dict]:
        """
        从腾讯频道获取资源
        
        Args:
            channel_url: 频道URL
            
        Returns:
            资源列表
        """
        html = self.fetch_page(channel_url)
        
        if not html:
            return []
        
        soup = BeautifulSoup(html, 'html.parser')
        items = []
        
        # 腾讯频道选择器（需要根据实际页面调整）
        selectors = ['.channel-post', '.post-item', '.message-item', 'article']
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                for elem in elements:
                    item = self.parse_qqpd_item(elem)
                    if item:
                        items.append(item)
                break
        
        return items
    
    def filter_new_shows(self, items: List[Dict]) -> List[Dict]:
        """
        过滤只保留新剧（2024+）
        
        Args:
            items: 资源列表
            
        Returns:
            过滤后的新剧列表
        """
        new_shows = []
        
        for item in items:
            classification = item.get('classification', {})
            
            # 只保留2024+的新剧
            if classification.get('type') == 'new':
                # 生成ID并去重
                item_id = self.generate_id(item)
                
                if item_id not in self.seen_links:
                    self.seen_links.add(item_id)
                    item['id'] = item_id
                    new_shows.append(item)
        
        return new_shows
    
    def fetch_new_resources(self, site_config: Dict) -> List[Dict]:
        """
        根据配置抓取新资源
        
        Args:
            site_config: 站点配置
                {
                    'name': 'suenen',
                    'type': 'suenen',
                    'pages': 3  # 抓取页数
                }
                
        Returns:
            新资源列表
        """
        all_items = []
        site_type = site_config.get('type', 'suenen')
        
        if site_type == 'suenen':
            pages = site_config.get('pages', 1)
            for page in range(1, pages + 1):
                print(f"正在抓取 suenen.com 第 {page} 页...")
                items = self.fetch_suenen(page)
                all_items.extend(items)
                
        elif site_type == 'qqpd':
            url = site_config.get('url', 'https://pd.qq.com')
            print(f"正在抓取腾讯频道: {url}...")
            items = self.fetch_qqpd(url)
            all_items.extend(items)
        
        # 过滤新剧
        new_shows = self.filter_new_shows(all_items)
        print(f"找到 {len(new_shows)} 部新剧")
        
        return new_shows
    
    def save_markdown(self, data: List[Dict], filename: str = "2025新剧追踪.md"):
        """
        生成Markdown报告
        
        Args:
            data: 资源数据列表
            filename: 输出文件名
        """
        # 按日期分组
        from collections import defaultdict
        
        date_groups = defaultdict(list)
        today = datetime.now().strftime('%Y-%m-%d')
        
        for item in data:
            crawled_at = item.get('crawled_at', '')
            if crawled_at:
                date = crawled_at[:10]  # 取日期部分
            else:
                date = today
            date_groups[date].append(item)
        
        # 生成Markdown
        lines = [
            "# 2025新剧追踪",
            "",
            f"> 最后更新: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "> 监控范围: 2024年及以后播出的新剧",
            "",
        ]
        
        # 按日期倒序
        for date in sorted(date_groups.keys(), reverse=True):
            lines.append(f"## {date} 更新")
            lines.append("")
            
            for item in date_groups[date]:
                title = item.get('title', '未知标题')
                year = item.get('year', '未知')
                status = item.get('status', 'unknown')
                quark_links = item.get('quark_links', [])
                
                # 状态显示
                status_display = {
                    'completed': '完结',
                    'ongoing': '连载中',
                    'unknown': ''
                }.get(status, '')
                
                # 链接显示
                if quark_links:
                    link_display = f"[链接]({quark_links[0]})"
                else:
                    link_display = "[无链接]"
                
                lines.append(f"- {link_display} | **{title}** | {year} | {status_display}")
            
            lines.append("")
        
        # 写入文件
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        
        print(f"报告已保存: {filename}")
    
    def run(self, sites: Optional[List[Dict]] = None):
        """
        运行追踪器

        Args:
            sites: 站点配置列表
        """
        sites = sites if sites is not None else self.config.get('sites', [])
        
        all_new_shows = []
        
        for site in sites:
            try:
                new_shows = self.fetch_new_resources(site)
                all_new_shows.extend(new_shows)
            except Exception as e:
                print(f"抓取站点失败 {site.get('name', 'unknown')}: {e}")
        
        # 保存结果
        if all_new_shows:
            self.save_markdown(all_new_shows)
            self.results = all_new_shows
        else:
            print("未找到新剧资源")
        
        return all_new_shows


# 便捷函数
def track_new_shows(config: Optional[Dict] = None) -> List[Dict]:
    """
    便捷函数：运行新剧追踪

    示例:
        >>> config = {
        ...     'sites': [
        ...         {'name': 'suenen', 'type': 'suenen', 'pages': 2}
        ...     ]
        ... }
        >>> results = track_new_shows(config)
    """
    tracker = NewShowTracker(config)
    return tracker.run()


if __name__ == "__main__":
    # 默认配置
    default_config = {
        'threshold': 2024,
        'sites': [
            {
                'name': 'suenen',
                'type': 'suenen',
                'pages': 2  # 抓取前2页
            },
            # {
            #     'name': 'qqpd',
            #     'type': 'qqpd',
            #     'url': 'https://pd.qq.com/g/xxx'  # 需要替换为实际频道URL
            # }
        ]
    }
    
    print("启动新剧追踪器...")
    tracker = NewShowTracker(default_config)
    results = tracker.run()
    print(f"共找到 {len(results)} 部新剧")
