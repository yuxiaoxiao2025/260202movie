import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { StatusBarTheme } from "@/components/status-bar-theme";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: `${process.env.SITE_NAME} - 免费网盘资源搜索引擎 | 夸克网盘 百度网盘 阿里云盘一站式搜索平台`,
  description: `${process.env.SITE_NAME}是专业的免费网盘资源搜索引擎，全面支持夸克网盘、百度网盘、阿里云盘等多个主流网盘平台的资源搜索与下载服务。提供快速精准的搜索体验，海量优质资源一键直达，界面简洁美观易用，完全免费且安全无广告无弹窗。立即体验高效便捷的网盘资源搜索服务，轻松快速找到您需要的各类文件、视频、文档等资源内容！`,
  keywords: `${process.env.SITE_NAME},网盘搜索,夸克网盘,百度网盘,阿里云盘,免费资源搜索,网盘资源下载,网盘搜索引擎,云盘搜索,网盘资源,资源分享,文件搜索,网盘聚合`,
  authors: [{ name: `${process.env.SITE_NAME}` }],
  robots: "index, follow",
  metadataBase: new URL("https://pan.xiaozi.cc"),
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: `${process.env.SITE_NAME} - 免费网盘资源搜索引擎 | 夸克网盘 百度网盘 阿里云盘一站式搜索平台`,
    description: `${process.env.SITE_NAME}是专业的免费网盘资源搜索引擎，全面支持夸克网盘、百度网盘、阿里云盘等多个主流网盘平台的资源搜索与下载服务。提供快速精准的搜索体验，海量优质资源一键直达，界面简洁美观易用，完全免费且安全无广告无弹窗。`,
    type: "website",
    locale: "zh_CN",
    siteName: `${process.env.SITE_NAME}`,
    url: "https://pan.xiaozi.cc",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://pan.xiaozi.cc",
    creator: "@towelong",
    title: `${process.env.SITE_NAME} - 免费网盘资源搜索引擎 | 夸克网盘 百度网盘 阿里云盘一站式搜索平台`,
    description: `${process.env.SITE_NAME}是专业的免费网盘资源搜索引擎，全面支持夸克网盘、百度网盘、阿里云盘等多个主流网盘平台的资源搜索与下载服务。提供快速精准的搜索体验，海量优质资源一键直达，界面简洁美观易用，完全免费且安全无广告无弹窗。`,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="application-name" content={process.env.SITE_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content={process.env.SITE_NAME}
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="256x256"
          href="/icons/icon-256x256.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/icons/icon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/icons/icon-256x256.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="384x384"
          href="/icons/icon-384x384.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
        >
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "um9zi4nqme");
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <StatusBarTheme />
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && (
          <Script
            src={process.env.UMAMI_API}
            data-website-id={process.env.UMAMI_ID}
            defer
          />
        )}
      </body>
    </html>
  );
}
