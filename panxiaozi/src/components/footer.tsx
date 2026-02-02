import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-foreground">
              {process.env.SITE_NAME}
            </h3>
            <p className="text-sm text-muted-foreground">
              {process.env.SITE_NAME}
              致力于打造一站式网盘资源搜索平台。我们仅提供搜索服务，不存储、上传或分发任何网盘内容。所有资源均来自第三方网盘，请用户自行判断资源的真实性与安全性。本站秉承非营利原则运营，完全免费使用。如发现任何侵权内容，请发送邮件至
              i@xiaozi.cc，我们将及时处理。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  title="首页"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/resource"
                  title="资源列表"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  资源列表
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  title="联系我们"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">热门网盘</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://pan.quark.cn"
                  title="夸克网盘"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  夸克网盘
                </Link>
              </li>
              <li>
                <Link
                  href="https://pan.baidu.com"
                  title="百度网盘"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  百度网盘
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.alipan.com"
                  title="阿里云盘"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  阿里云盘
                </Link>
              </li>
              <li>
                <Link
                  href="https://pan.xunlei.com"
                  title="迅雷网盘"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  迅雷网盘
                </Link>
              </li>
              <li>
                <Link
                  href="https://drive.uc.cn"
                  title="UC网盘"
                  className="text-sm text-muted-foreground hover:text-blue-500"
                >
                  UC网盘
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground mt-0.5"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="text-sm text-muted-foreground">
                  i@xiaozi.cc
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground mt-0.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-sm text-muted-foreground">全球</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {process.env.SITE_NAME}. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
