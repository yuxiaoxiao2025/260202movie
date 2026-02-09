"""
美剧资源搜索 - Web服务
使用Flask提供API和静态页面
"""
from flask import Flask, render_template, request, jsonify
from typing import List, Dict
import json

from show_searcher import ShowSearcher, ResourceResult
import os

# 设置模板目录的绝对路径
template_dir = os.path.abspath('templates')
app = Flask(__name__, template_folder=template_dir)
searcher = ShowSearcher()

# 预置一些搜索结果（用于演示和测试）
PRESET_RESULTS = {
    "Y计划": [
        {
            'title': 'Y计划(2025) 1080p 韩语中字【3.9G】',
            'content': '导演: 李焕 主演: 韩韶禧 / 全钟瑞 https://pan.quark.cn/s/9a71d77f5482',
            'link': 'https://by669.org/d/58526'
        },
        {
            'title': 'Y计划 (2025) 高清完整版',
            'content': '夸克网盘资源 https://pan.quark.cn/s/334ad2043a1e',
            'link': 'https://www.jianshu.com/p/b95571235d3c'
        }
    ],
    "V世代": [
        {
            'title': 'V世代 第二季 (2025)【8集全】4K高码率',
            'content': '夸克网盘 https://pan.quark.cn/s/a5cc030eae35',
            'link': 'https://suenen.com/thread-xxx'
        }
    ],
    "安多": [
        {
            'title': '安多第二季[2025]|剧情/动作/科幻',
            'content': '腾讯频道更新 夸克网盘资源',
            'link': 'https://pd.qq.com/g/xxx'
        }
    ]
}


@app.route('/')
def index():
    """首页"""
    # 直接读取HTML文件
    template_path = os.path.join(template_dir, 'simple.html')
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()


@app.route('/api/search', methods=['POST'])
def api_search():
    """搜索API"""
    try:
        data = request.get_json()
        keyword = data.get('keyword', '').strip()
        
        if not keyword:
            return jsonify({
                'success': False,
                'error': '请输入影片名称'
            })
        
        # 获取搜索结果
        # 1. 先检查预置结果
        web_results = PRESET_RESULTS.get(keyword, [])
        
        # 2. 如果没有预置结果，返回空（实际使用时会调用web-search）
        if not web_results:
            return jsonify({
                'success': True,
                'results': [],
                'message': '未找到预置结果，请使用命令行版本或添加更多预置数据'
            })
        
        # 解析结果
        results = searcher.search_from_web_results(web_results)
        
        # 转换为字典列表
        results_dict = []
        for r in results:
            results_dict.append({
                'title': r.title,
                'year': r.year,
                'resource_type': r.resource_type,
                'quark_links': r.quark_links,
                'source_url': r.source_url,
                'source_name': r.source_name
            })
        
        return jsonify({
            'success': True,
            'results': results_dict,
            'keyword': keyword
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })


@app.route('/api/test', methods=['GET'])
def api_test():
    """测试API是否正常工作"""
    return jsonify({
        'success': True,
        'message': 'API正常工作',
        'available_presets': list(PRESET_RESULTS.keys())
    })


def run_web_server(host='0.0.0.0', port=5000, debug=True):
    """运行Web服务器"""
    print(f"=" * 60)
    print(f"美剧资源搜索工具 - Web版")
    print(f"=" * 60)
    print(f"访问地址: http://{host}:{port}")
    print(f"按 Ctrl+C 停止服务")
    print(f"=" * 60)
    print()
    
    app.run(host=host, port=port, debug=debug)


if __name__ == '__main__':
    run_web_server(port=5002)
