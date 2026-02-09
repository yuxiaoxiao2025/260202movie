"""
年份识别模块 - 核心功能：识别资源年代（2025/2026 vs 经典）
支持多种格式：括号、方括号、中文描述等
"""
import re
from datetime import datetime
from typing import Dict, Optional, Tuple


class YearClassifier:
    """资源年份分类器 - 区分新剧(2024+)和经典剧"""
    
    # 新剧年份阈值（2024年及以后视为新剧）
    NEW_SHOW_THRESHOLD = 2024
    
    # 年份提取正则表达式模式
    YEAR_PATTERNS = [
        # 标准括号格式: (2025) 或 (2025-2026) 或 (2008-2013)
        (r'\((\d{4})(?:\s*[-–—]\s*(\d{4}))?\)', 'parentheses'),
        # 全角括号格式: （2025） 或 （2025-2026）
        (r'（(\d{4})(?:\s*[-–—]\s*(\d{4}))?）', 'fullwidth_parentheses'),
        # 方括号格式: [2025] 或 [2025-2026]
        (r'\[(\d{4})(?:\s*[-–—]\s*(\d{4}))?\]', 'brackets'),
        # 中文描述格式: 年代：2025 或 年份: 2025
        (r'(?:年代|年份|年份)[:：]\s*(\d{4})', 'chinese_desc'),
        # 日期格式: 2025-02-07 或 2025/02/07
        (r'(?:(?:19|20)\d{2})[/-](?:0[1-9]|1[0-2])[/-](?:0[1-9]|[12]\d|3[01])', 'date'),
        # 独立年份: 前面有空格或开头，后面有空格或结尾
        (r'(?:^|\s)(19\d{2}|20\d{2})(?:\s|$|年)', 'standalone'),
    ]
    
    # 状态识别关键词
    STATUS_PATTERNS = {
        'completed': [
            r'全\d+集', r'完结', r'全季', r'完整版', r'\d+集全',
            r'全\d+话', r'已完结', r'完结篇', r'最终季',
        ],
        'ongoing': [
            r'更新至\d+集', r'连载中', r'更新中', r'连载',
            r'第\d+集', r'\d+集更新', r'新\d+集',
        ],
    }
    
    def __init__(self, threshold: Optional[int] = None):
        """
        初始化分类器
        
        Args:
            threshold: 新剧年份阈值，默认为2024
        """
        self.threshold = threshold if threshold is not None else self.NEW_SHOW_THRESHOLD
        self.current_year = datetime.now().year
    
    def extract_year(self, text: str) -> Optional[int]:
        """
        从文本中提取年份
        
        Args:
            text: 输入文本（标题或描述）
            
        Returns:
            提取到的年份，如果未找到则返回None
        """
        if not text:
            return None
            
        text = text.strip()
        
        for pattern, pattern_type in self.YEAR_PATTERNS:
            matches = re.findall(pattern, text)
            if matches:
                if pattern_type == 'date':
                    # 日期格式，提取前4位年份
                    year_str = matches[0][:4] if isinstance(matches[0], str) else matches[0][0][:4]
                    year = int(year_str)
                    if 1900 <= year <= self.current_year + 1:
                        return year
                elif isinstance(matches[0], tuple):
                    # 有开始和结束年份，取最新的
                    start_year = int(matches[0][0])
                    end_year = int(matches[0][1]) if matches[0][1] else start_year
                    # 如果结束年份是未来或未完结，返回开始年份
                    if end_year > self.current_year:
                        return start_year
                    return max(start_year, end_year)
                else:
                    year = int(matches[0])
                    if 1900 <= year <= self.current_year + 1:
                        return year
        
        return None
    
    def detect_status(self, text: str) -> str:
        """
        检测资源状态（连载中/完结）
        
        Args:
            text: 输入文本
            
        Returns:
            'completed'（完结）, 'ongoing'（连载中）, 或 'unknown'（未知）
        """
        if not text:
            return 'unknown'
            
        text = text.lower()
        
        # 检查完结关键词
        for pattern in self.STATUS_PATTERNS['completed']:
            if re.search(pattern, text):
                return 'completed'
        
        # 检查连载中关键词
        for pattern in self.STATUS_PATTERNS['ongoing']:
            if re.search(pattern, text):
                return 'ongoing'
        
        return 'unknown'
    
    def classify_resource(self, title: str, description: str = "") -> Dict:
        """
        分类资源 - 核心函数
        
        Args:
            title: 资源标题
            description: 资源描述（可选）
            
        Returns:
            包含年份、类型、状态的字典
            {
                'year': int or None,
                'type': 'new' | 'classic' | 'unknown',
                'status': 'completed' | 'ongoing' | 'unknown',
                'confidence': 'high' | 'medium' | 'low'
            }
        """
        result = {
            'year': None,
            'type': 'unknown',
            'status': 'unknown',
            'confidence': 'low'
        }
        
        # 合并标题和描述进行年份提取
        full_text = f"{title} {description}".strip()
        
        # 优先从标题提取年份（置信度更高）
        year = self.extract_year(title)
        if year:
            result['year'] = year
            result['confidence'] = 'high'
        else:
            # 从描述提取
            year = self.extract_year(description)
            if year:
                result['year'] = year
                result['confidence'] = 'medium'
        
        # 确定类型（新剧/经典）
        if result['year']:
            if result['year'] >= self.threshold:
                result['type'] = 'new'
            else:
                result['type'] = 'classic'
        
        # 检测状态
        result['status'] = self.detect_status(full_text)
        
        return result
    
    def is_new_show(self, title: str, description: str = "") -> bool:
        """
        快速判断是否为新剧（2024+）
        
        Args:
            title: 资源标题
            description: 资源描述
            
        Returns:
            是否为新剧
        """
        classification = self.classify_resource(title, description)
        return classification['type'] == 'new'
    
    def filter_by_year(self, items: list, min_year: Optional[int] = None, max_year: Optional[int] = None) -> list:
        """
        按年份过滤资源列表
        
        Args:
            items: 资源列表，每个元素需包含'title'和可选的'description'
            min_year: 最小年份（包含）
            max_year: 最大年份（包含）
            
        Returns:
            过滤后的资源列表
        """
        min_year = min_year if min_year is not None else self.threshold
        max_year = max_year if max_year is not None else (self.current_year + 1)
        
        filtered = []
        for item in items:
            title = item.get('title', '')
            description = item.get('description', '')
            classification = self.classify_resource(title, description)
            
            if classification['year'] and min_year <= classification['year'] <= max_year:
                item['classification'] = classification
                filtered.append(item)
        
        return filtered


# 便捷函数
def classify_resource(title: str, description: str = "") -> Dict:
    """
    便捷函数：分类单个资源
    
    示例:
        >>> classify_resource("V世代 第二季 (2025)【8集全】")
        {'year': 2025, 'type': 'new', 'status': 'completed', 'confidence': 'high'}
        
        >>> classify_resource("绝命毒师 (2008-2013)")
        {'year': 2013, 'type': 'classic', 'status': 'unknown', 'confidence': 'high'}
    """
    classifier = YearClassifier()
    return classifier.classify_resource(title, description)


def extract_year(text: str) -> Optional[int]:
    """便捷函数：从文本提取年份"""
    classifier = YearClassifier()
    return classifier.extract_year(text)


def is_new_show(title: str, description: str = "") -> bool:
    """便捷函数：判断是否为新剧"""
    classifier = YearClassifier()
    return classifier.is_new_show(title, description)


if __name__ == "__main__":
    # 简单测试
    test_cases = [
        ("V世代 第二季 (2025)【8集全】4K高码率", ""),
        ("安多第二季[2025]|剧情/动作/科幻", ""),
        ("异形：地球（2025） 科幻/惊悚/恐怖 更新03集", ""),
        ("绝命毒师 (2008-2013)", ""),
        ("权力的游戏", "年代：2011"),
    ]
    
    classifier = YearClassifier()
    print("年份识别测试:")
    print("-" * 60)
    for title, desc in test_cases:
        result = classifier.classify_resource(title, desc)
        print(f"标题: {title}")
        print(f"结果: {result}")
        print("-" * 60)
