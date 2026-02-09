from flask import Flask, jsonify
import os

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():
    template_path = os.path.join('templates', 'simple.html')
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error: {e}"

@app.route('/api/search', methods=['POST'])
def search():
    from flask import request
    try:
        data = request.get_json()
        keyword = data.get('keyword', '').strip()
        
        if not keyword:
            return jsonify({
                'success': False,
                'error': '请输入影片名称'
            })
        
        # 导入搜索器
        from show_searcher import ShowSearcher
        searcher = ShowSearcher()
        
        # 预置结果
        web_results = []
        if keyword == "Y计划":
            web_results = [
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
            ]
        
        results = searcher.search_from_web_results(web_results)
        
        # 转换为字典
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

if __name__ == '__main__':
    print("Starting test server on port 5002...")
    print(f"Template folder: {app.template_folder}")
    app.run(host='0.0.0.0', port=5002, debug=False)
