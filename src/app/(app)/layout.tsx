import { AppNav } from "@/components/layout/app-nav";
import { AppHeader } from "@/components/layout/app-header";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100 pb-20">
      <AppHeader />
      <main className="page-transition">{children}</main>
      <AppNav />
    </div>
  );
}
