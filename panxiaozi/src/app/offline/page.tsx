"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-950/40 rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            网络连接断开
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            看起来你现在没有网络连接。请检查你的网络设置后重试。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>当前页面可能无法正常加载，但你仍可以：</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• 浏览之前访问过的缓存页面</li>
              <li>• 等待网络恢复后自动重连</li>
              <li>• 手动刷新页面重试</li>
            </ul>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
            variant="default"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新加载
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full"
          >
            返回上一页
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
