"use client";

import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImagePreviewProps = {
  src: string;
  alt: string;
  className?: string; // 触发端（缩略图）尺寸与样式
};

export function ImagePreview({ src, alt, className }: ImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="预览图片"
          className={cn(
            "p-0 border-0 bg-transparent cursor-pointer hover:opacity-90 transition-opacity",
          )}
        >
          <img src={src} alt={alt} className={className} />
        </button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            // 全屏容器，内部放一个可点击关闭的“遮罩层”和置顶的图片容器
            "fixed inset-0 z-50 p-0 bg-transparent border-0 shadow-none outline-none",
          )}
        >
          {/* 无障碍标题，供屏幕阅读器使用 */}
          <DialogPrimitive.Title className="sr-only">
            {alt || "图片预览"}
          </DialogPrimitive.Title>

          {/* 可点击关闭的全屏层（图片外区域） */}
          <DialogClose asChild>
            <div
              className="absolute inset-0 cursor-zoom-out"
              aria-hidden="true"
            />
          </DialogClose>

          {/* 关闭按钮：固定在视口右上角，不遮挡图片 */}
          <DialogClose
            className="fixed right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-ring z-20"
            aria-label="关闭预览"
          >
            <X className="h-4 w-4" />
          </DialogClose>

          {/* 预览区域：允许事件穿透到蒙层以实现点击关闭 */}
          <div className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none">
            <div className="flex items-center justify-center w-[95vw] max-w-[1200px] h-[85vh]">
              <DialogClose asChild>
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full object-contain rounded-md shadow-lg cursor-zoom-out pointer-events-auto"
                />
              </DialogClose>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
