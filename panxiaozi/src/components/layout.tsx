import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="min-h-screen flex flex-col antialiased">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </main>
  );
}
