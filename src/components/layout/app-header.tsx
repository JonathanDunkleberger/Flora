import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="fixed top-0 w-full z-40 bg-cream-100/70 backdrop-blur-md border-b border-bloom-100/50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/garden" className="flex items-center gap-2">
          <span className="text-lg">🌱</span>
          <span className="font-bold text-bloom-700">Bloom</span>
        </Link>
        <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
      </div>
    </header>
  );
}
