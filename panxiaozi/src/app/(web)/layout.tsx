import type { Metadata } from "next";
import "@/app/globals.css";
import { Layout } from "@/components/layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
