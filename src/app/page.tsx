import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { PricingSection } from "@/components/landing/pricing-section";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/garden");

  return (
    <main className="min-h-screen bg-cream-100">
      <nav className="fixed top-0 w-full z-50 bg-cream-100/80 backdrop-blur-md border-b border-bloom-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl text-bloom-700">Bloom</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="px-4 py-2 text-sm font-medium text-bloom-700 hover:text-bloom-800">
              Sign In
            </Link>
            <Link href="/sign-up" className="px-5 py-2.5 text-sm font-semibold text-white bg-bloom-500 hover:bg-bloom-600 rounded-2xl shadow-md shadow-bloom-500/25">
              Start Growing Free
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />
      <FeaturesSection />
      <PricingSection />

      <footer className="bg-bloom-900 text-white py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🌱</span>
          <span className="font-bold text-xl">Bloom</span>
        </div>
        <p className="text-bloom-200 text-sm">Every good day grows your world.</p>
        <p className="text-bloom-300 text-xs mt-4">© {new Date().getFullYear()} Bloom. All rights reserved.</p>
      </footer>
    </main>
  );
}
