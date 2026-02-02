"use client";

import { ImagePreview } from "@/components/image-preview";

interface WechatQRModalProps {
  src: string;
  alt: string;
  className?: string; // 触发端尺寸，默认与之前一致
}

export function WechatQRModal({ src, alt, className }: WechatQRModalProps) {
  return (
    <ImagePreview
      src={src}
      alt={alt}
      className={className ?? "max-w-[200px] h-auto"}
    />
  );
}
