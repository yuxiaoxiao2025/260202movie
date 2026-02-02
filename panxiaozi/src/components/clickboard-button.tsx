"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ToastContainer, toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Loader2, QrCode } from "lucide-react";
import dynamic from "next/dynamic";

// 动态导入QRCode组件，避免SSR问题
const QRCode = dynamic(() => import("react-qr-code"), {
  ssr: false,
  loading: () => <Loader2 className="h-8 w-8 animate-spin text-primary" />,
});

interface ClickboardButtonProps {
  text: string;
  children?: React.ReactNode; // 子元素
  [key: string]: unknown; // 允许任意其他 props
}

const ClickboardButton = ({
  text,
  children,
  ...restProps
}: ClickboardButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent,
        );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <Button onClick={handleButtonClick} {...restProps}>
        {children}
      </Button>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>扫描二维码</DialogTitle>
            <DialogDescription>
              请使用手机扫描二维码访问资源链接
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="bg-white p-4 rounded-md">
              {text && <QRCode value={text} size={200} />}
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <div className="flex-1 flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                关闭
              </Button>
              {/* 只在移动端显示打开链接按钮 */}
              {isMobile && (
                <Button
                  onClick={() => {
                    window.open(text, "_blank");
                    setDialogOpen(false);
                  }}
                >
                  打开链接
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-center" limit={1} />
    </>
  );
};

export default ClickboardButton;
