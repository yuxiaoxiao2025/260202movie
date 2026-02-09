# 260202movie - 美剧资源搜索工具

一个帮助美剧爱好者快速找到夸克网盘资源的工具，支持年份识别、类型分类和资源链接提取。

## 🎯 项目概述

### 核心功能

1. **智能年份识别** - 自动识别影片年份，区分新剧(2024+)和经典剧
2. **资源搜索** - 搜索夸克网盘资源链接
3. **Web界面** - 简洁的Web界面，支持一键复制链接
4. **年份分类** - 自动标记新剧/经典剧，方便筛选

### 使用场景

- 你只有夸克网盘会员
- 想看美剧但找不到资源
- 需要快速获取新剧更新
- 需要补看经典老剧

## 🚀 快速开始

### 安装依赖

```bash
pip install -r requirements.txt
```

### 启动Web服务

```bash
python test_server.py
```

访问 http://127.0.0.1:5002

### 命令行使用

```bash
python search.py "Y计划"
```

## 📁 项目结构

```
260202movie/
├── year_classifier.py      # 年份识别核心模块
├── show_searcher.py      # 资源搜索器
├── web_app.py            # Web应用（完整版，暂未使用）
├── test_server.py        # 简化版Web服务（当前使用）
├── search.py             # 命令行搜索工具
├── templates/
│   └── simple.html       # Web前端页面
├── test_real_data.py     # 真实数据验证测试
├── demo_*.py            # 演示脚本
├── config.yaml           # 配置文件
├── requirements.txt       # Python依赖
└── CODE_REVIEW.md       # 代码审查报告
```

## 🔧 核心模块

### year_classifier.py

**功能**：识别资源年份和类型

**核心类**：
- `YearClassifier` - 年份分类器
- `extract_year()` - 从文本提取年份
- `classify_resource()` - 完整分类

**支持的格式**：
- 括号: `(2025)`, `(2025-2026)`
- 方括号: `[2025]`
- 全角括号: `（2025）`
- 中文描述: `年代：2025`
- 日期格式: `2025-02-07`

**年份阈值**：
- 新剧: 2024年及以后
- 经典剧: 2023年及之前

### show_searcher.py

**功能**：搜索和解析资源

**核心类**：
- `ShowSearcher` - 资源搜索器
- `ResourceResult` - 资源结果数据类

**方法**：
- `search_from_web_results()` - 从搜索结果解析
- `_extract_quark_links()` - 提取夸克链接
- `_extract_source_name()` - 识别来源站点
- `display_results()` - 显示搜索结果

**支持的资源站**：
- 网盘资源避难所 (suenen.com)
- 夸克吧 (kuakeba.cn)
- 网盘资源社 (by669.org)
- 大佬资源网 (dalao.motewan.com)
- 豆瓣 (douban.com)
- 简书 (jianshu.com)

### web_app.py / test_server.py

**功能**：Flask Web服务

**API端点**：
- `GET /` - 返回Web页面
- `POST /api/search` - 搜索API

**请求格式**：
```json
{
  "keyword": "Y计划"
}
```

**响应格式**：
```json
{
  "success": true,
  "results": [
    {
      "title": "Y计划(2025) 1080p 韩语中字【3.9G】",
      "year": 2025,
      "resource_type": "new",
      "quark_links": ["https://pan.quark.cn/s/9a71d77f5482"],
      "source_url": "https://by669.org/d/58526",
      "source_name": "网盘资源社"
    }
  ]
}
```

## 🎨 前端设计

### 页面特点

1. **简洁设计** - 紫色渐变背景，白色卡片布局
2. **响应式** - 支持移动端和桌面端
3. **一键复制** - 夸克链接可一键复制到剪贴板
4. **实时搜索** - 点击搜索按钮，立即显示结果
5. **状态标签** - 新剧/经典剧标签不同颜色

### 使用流程

1. 输入影片名称（如：Y计划）
2. 点击"搜索"按钮
3. 查看搜索结果
4. 点击"复制链接"按钮
5. 在浏览器打开链接
6. 保存到夸克网盘

## 📊 技术栈

### 后端
- **Python 3.12+**
- Flask 2.0+ (Web框架)
- requests (HTTP请求)
- BeautifulSoup4 (HTML解析)
- re (正则表达式)
- dataclasses (数据类)

### 前端
- **HTML5**
- **CSS3** (渐变、Flexbox布局)
- **Vanilla JavaScript** (无框架依赖)
- **Fetch API** (异步请求)

## 🧪 测试

### 运行测试

```bash
# 年份识别测试
python test_real_data.py

# 演示年份识别
python demo_classifier.py

# 演示过滤功能
python demo_filter.py
```

### 测试覆盖

- ✅ 年份提取（多种格式）
- ✅ 新剧/经典剧分类
- ✅ 夸克链接提取
- ✅ 来源站点识别
- ✅ 结果去重

## 🔒 安全考虑

### 当前实现

1. **文件读取安全** - 验证文件路径
2. **错误处理** - 不暴露内部错误信息
3. **输入验证** - 检查空输入和非法字符

### 改进建议

1. **CORS配置** - 添加跨域支持
2. **日志系统** - 记录所有操作
3. **环境变量** - 配置敏感信息
4. **速率限制** - 防止API滥用

## 📈 未来计划

### v0.2.0 功能
- [ ] 集成真实web-search API
- [ ] 支持用户收藏功能
- [ ] 添加搜索历史记录
- [ ] 支持多语言（英文、韩文）
- [ ] 添加批量搜索功能

### v0.3.0 功能
- [ ] 用户登录系统
- [ ] 搜索结果评分
- [ ] 推荐系统
- [ ] 移动端App
- [ ] 浏览器插件

## 🤝 贡献指南

### 开发环境

1. Fork本仓库
2. 创建特性分支：`git checkout -b feature/xxx`
3. 提交更改：`git commit -m "Add xxx"`
4. 推送到分支：`git push origin feature/xxx`
5. 创建Pull Request

### 代码规范

1. 遵循PEP 8编码规范
2. 添加类型提示（Type Hints）
3. 编写文档字符串（Docstrings）
4. 添加单元测试

## 📝 License

MIT License

## 👥 联系方式

- GitHub Issues: https://github.com/yuxiaoxiao2025/260202movie/issues
- 项目地址: https://github.com/yuxiaoxiao2025/260202movie

---

**最后更新**: 2026-02-09
**版本**: v0.1.0
