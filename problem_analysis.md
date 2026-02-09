# MVP工具问题分析报告

## 测试场景
搜索影片: "Y计划 韩国 2026"

## 工具能力评估

### ✅ 能正常工作的部分

**year_classifier.py**
- 输入: "Y计划 韩国 2026"
- 输出: 年份=2026, 类型=new, 置信度=high
- 结论: **年份识别功能正常**

### ❌ 不能正常工作的部分

**tracker.py**
- 问题: 只能被动监控站点列表页，不能主动搜索特定影片
- 方法限制:
  - `fetch_suenen(page)` - 只能抓取第N页列表
  - `fetch_qqpd(url)` - 只能抓取指定频道
- 缺失: `search(keyword)` 方法

## 问题根源

1. **需求理解偏差**
   - 你要求的是"搜索工具"
   - 我开发的是"监控工具"

2. **功能不完整**
   - 有年份识别 ✅
   - 有站点抓取 ✅
   - 缺少搜索功能 ❌
   - 缺少结果聚合 ❌

## 改进方案

### 方案A: 给 tracker 添加搜索功能

```python
def search(self, keyword: str) -> List[Dict]:
    """
    搜索特定影片
    
    实现方式:
    1. 使用 web-search 搜索 "keyword + 夸克网盘"
    2. 访问搜索结果页面
    3. 用 year_classifier 验证年份
    4. 返回符合2025+的结果
    """
```

### 方案B: 新建 search_module.py

专门负责:
1. 网络搜索 (web-search)
2. 结果解析 (BeautifulSoup)
3. 年份验证 (year_classifier)
4. 链接提取 (正则匹配)

### 方案C: 集成到现有工作流

```
用户输入关键词
    ↓
search_module 搜索网络
    ↓
year_classifier 验证年份
    ↓
tracker 格式化为标准输出
    ↓
生成报告
```

## 建议

当前MVP工具只能做**监控**（模式A的一部分），不能做**搜索**。

如果要完成你的需求，需要:
1. 新增搜索模块
2. 或者集成 web-search MCP 到工具链中

你希望我采用哪个方案来改进？
