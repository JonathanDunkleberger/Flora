import Link from "next/link";

export function HeroSection() {
  return (
    <section className="pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated garden emoji cluster */}
        <div className="text-6xl mb-6 animate-float">🌱</div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Every Good Day{" "}
          <span className="text-bloom-500">Grows Your World</span>
        </h1>

        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Build positive habits and quit destructive ones. Watch your garden bloom
          as you improve your life — one check-in at a time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/sign-up"
            className="px-8 py-3.5 text-base font-semibold text-white bg-bloom-500 hover:bg-bloom-600 rounded-2xl shadow-lg shadow-bloom-500/25 transition-all tap-bounce"
          >
            Start Growing — It&apos;s Free
          </Link>
          <Link
            href="#features"
            className="px-6 py-3 text-sm font-medium text-bloom-700 hover:text-bloom-800"
          >
            See How It Works ↓
          </Link>
        </div>

        {/* Garden preview */}
        <div className="mt-16 relative max-w-md mx-auto">
          <div className="bg-gradient-to-b from-bloom-50 to-bloom-100 rounded-3xl p-8 border border-bloom-200">
            <div className="flex justify-center gap-6 text-4xl">
              <span className="animate-sway" style={{ animationDelay: "0s" }}>🌿</span>
              <span className="animate-sway" style={{ animationDelay: "0.5s" }}>🌸</span>
              <span className="animate-sway" style={{ animationDelay: "1s" }}>🌻</span>
              <span className="animate-sway" style={{ animationDelay: "1.5s" }}>🌳</span>
              <span className="animate-sway" style={{ animationDelay: "2s" }}>🌵</span>
            </div>
            <div className="flex justify-center gap-8 mt-2 text-2xl">
              <span className="animate-sway" style={{ animationDelay: "0.3s" }}>🎋</span>
              <span className="animate-sway" style={{ animationDelay: "0.8s" }}>🌺</span>
              <span className="animate-sway" style={{ animationDelay: "1.3s" }}>🌴</span>
            </div>
            <p className="text-sm text-bloom-700 font-medium mt-4">Your life, as a garden</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-3 -right-3 text-2xl animate-float" style={{ animationDelay: "0.5s" }}>🦋</div>
          <div className="absolute -bottom-2 -left-2 text-xl animate-float" style={{ animationDelay: "1.5s" }}>✨</div>
        </div>
      </div>
    </section>
  );
}
