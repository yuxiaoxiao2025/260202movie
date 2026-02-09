# 代码审查报告

## 项目概览
- **项目名称**: 美剧资源搜索工具
- **审查日期**: 2026-02-09
- **审查范围**: 所有Python文件
- **总体评分**: B（良好，有改进空间）

---

## 发现的问题

### 1. 潜在的索引越界风险

**位置**: `show_searcher.py` 第50行
```python
if r.quark_links[0] not in seen_links:
```

**问题**: 如果 `r.quark_links` 为空列表，访问 `[0]` 会导致 IndexError。

**建议修复**:
```python
if r.quark_links and r.quark_links[0] not in seen_links:
    seen_links.add(r.quark_links[0])
    unique_results.append(r)
```

---

### 2. 硬编码端口号

**位置**: `test_server.py` 第76行
```python
app.run(host='0.0.0.0', port=5002, debug=False)
```

**问题**: 端口号5002硬编码，缺乏灵活性。

**建议修复**:
```python
import os
port = int(os.getenv('PORT', '5000'))
app.run(host='0.0.0.0', port=port, debug=False)
```

---

### 3. 硬编码搜索关键词

**位置**: `web_app.py` 第34行
```python
if keyword == "Y计划":
```

**问题**: 只支持"Y计划"一个关键词，不实用。

**建议修复**:
- 集成真实的web-search API
- 或者移除硬编码，返回空结果
- 添加"搜索功能开发中"的提示

---

### 4. 缺少输入验证

**位置**: `year_classifier.py` 多处
```python
text = text.strip()  # 如果text是None会报错
```

**问题**: 在 `extract_year` 中，如果 `text` 为 `None`，调用 `text.strip()` 会抛出 AttributeError。

**建议修复**:
已在第64行添加了检查，但建议在所有函数入口处统一验证。

---

### 5. 缺少日志系统

**影响范围**: 全局
**问题**: 当前只有 `print()` 输出，难以在生产环境调试和监控。

**建议添加**:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

---

### 6. 异常处理不够细致

**位置**: `test_server.py` 第67-71行
```python
except Exception as e:
    return jsonify({
        'success': False,
        'error': str(e)  # 暴露完整错误信息给用户
    })
```

**问题**: 
1. 暴露内部错误信息可能泄露敏感信息
2. 缺少具体的异常类型判断

**建议修复**:
```python
except FileNotFoundError as e:
    logger.error(f"模板文件未找到: {e}")
    return jsonify({'success': False, 'error': '服务器配置错误'})
except Exception as e:
    logger.exception("搜索失败")
    return jsonify({'success': False, 'error': '搜索失败，请稍后重试'})
```

---

### 7. 代码重复

**位置**: `show_searcher.py` 第39行和第59行
```python
quark_links = self._extract_quark_links(f"{title} {content}")  # 第39行
quark_links = self._extract_quark_links(f"{title} {description}")  # 第59行
```

**问题**: 同样的逻辑在两个方法中重复。

**建议重构**: 提取到单独的辅助方法。

---

## 安全问题

### 8. 缺少CORS配置

**位置**: Flask应用
**问题**: 当前没有配置CORS，如果从其他域调用API会失败。

**建议添加**:
```python
from flask_cors import CORS

CORS(app)
```

---

### 9. 潜在的路径遍历漏洞

**位置**: `web_app.py` 第52行
```python
template_path = os.path.join(template_dir, 'simple.html')
```

**问题**: 如果 `simple.html` 被篡改为 `../etc/passwd`，可能导致文件泄露。

**建议**:
```python
# 验证文件名
allowed_files = {'simple.html', 'index.html'}
filename = os.path.basename(template_path)
if filename not in allowed_files:
    raise ValueError("无效的模板文件")
```

---

## 性能问题

### 10. 每次请求都重新创建ShowSearcher实例

**位置**: `web_app.py` 第30行
```python
searcher = ShowSearcher()  # 每次请求都创建新实例
```

**建议优化**: 使用单例模式或全局实例。

---

## 代码质量

### ✅ 做得好的地方

1. **类型提示完善**: 使用了 `typing` 模块
2. **文档字符串齐全**: 每个函数都有docstring
3. **模块化清晰**: year_classifier, show_searcher, web_app 职责分明
4. **数据类使用**: `@dataclass` 定义ResourceResult，代码清晰

---

## 改进建议总结

### 高优先级（安全相关）
1. 添加CORS配置
2. 改进异常处理，避免泄露内部信息
3. 添加路径遍历防护

### 中优先级（稳定性）
1. 修复索引越界风险
2. 添加日志系统
3. 移除硬编码

### 低优先级（代码质量）
1. 重构重复代码
2. 优化实例创建
3. 添加单元测试

---

## 建议的文件结构

```
project/
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   └── search.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── resource.py
│   └── services/
│       ├── __init__.py
│       ├── year_classifier.py
│       └── show_searcher.py
├── tests/
│   ├── __init__.py
│   ├── test_year_classifier.py
│   └── test_show_searcher.py
├── config.py
├── requirements.txt
└── README.md
```

---

## 下一步行动

1. ✅ 完成代码审查
2. ⏳ 生成 CLAUDE.md
3. ⏳ 初始化Git仓库
4. ⏳ 推送到GitHub
