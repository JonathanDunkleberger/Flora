import Link from "next/link";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section className="py-20 px-4 bg-bloom-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Simple, Fair Pricing</h2>
        <p className="text-slate-500 mb-10">Start free. Grow when you&apos;re ready.</p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-left">
            <h3 className="font-bold text-lg text-slate-800 mb-1">Free</h3>
            <p className="text-3xl font-bold text-slate-800">$0</p>
            <p className="text-sm text-slate-400 mb-4">forever</p>
            <ul className="space-y-2 mb-6">
              {["3 habits", "Fern plant only", "30-day history", "Basic garden"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-slate-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up"
              className="block text-center py-2.5 bg-slate-100 text-slate-600 font-medium rounded-2xl">
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white rounded-3xl border-2 border-bloom-400 p-6 text-left shadow-lg shadow-bloom-500/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bloom-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Bloom Pro</h3>
            <p className="text-3xl font-bold text-slate-800">$4.99<span className="text-base font-normal text-slate-400">/mo</span></p>
            <p className="text-sm text-bloom-600 mb-4">or $39.99/year (save 33%)</p>
            <ul className="space-y-2 mb-6">
              {[
                "Unlimited habits",
                "All 6 plant types",
                "Full history & heat maps",
                "All garden effects",
                "Advanced analytics",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-bloom-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up"
              className="block text-center py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white font-semibold rounded-2xl shadow-md shadow-bloom-500/25 transition-colors">
              Start Growing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
