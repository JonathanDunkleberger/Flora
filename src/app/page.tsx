import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/garden");

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "'DM Sans',-apple-system,sans-serif", color: "#1a1a2e" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(248,248,246,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 500 }}>
            tend<span style={{ color: "#4caf50" }}>.</span>
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/sign-in" style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.4)", textDecoration: "none", padding: "6px 12px" }}>
              Sign In
            </Link>
            <Link href="/sign-up" style={{ fontSize: 13, fontWeight: 600, color: "white", background: "#4caf50", padding: "8px 18px", borderRadius: 10, textDecoration: "none" }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "120px 24px 60px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(76,175,80,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="28" height="32" viewBox="0 0 28 32"><ellipse cx="14" cy="18" rx="11" ry="14" fill="#c8d8c0" /><ellipse cx="11" cy="14" rx="3" ry="4" fill="white" opacity="0.3" /></svg>
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 38, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 14 }}>
          grow habits,<br />evolve creatures
        </h1>
        <p style={{ fontSize: 15, color: "rgba(0,0,0,0.35)", lineHeight: 1.5, maxWidth: 380, margin: "0 auto 28px" }}>
          Every day you show up, your creatures evolve. Watch your terrarium come alive as you build the life you want.
        </p>
        <Link href="/sign-up" style={{ display: "inline-block", fontSize: 14, fontWeight: 600, color: "white", background: "#4caf50", padding: "12px 28px", borderRadius: 12, textDecoration: "none", boxShadow: "0 4px 14px rgba(76,175,80,0.25)" }}>
          Start Growing — Free
        </Link>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "M12 2C6.48 2 2 8 2 14.5C2 21 6.48 27 12 27S22 21 22 14.5C22 8 17.52 2 12 2Z", color: "#4caf50", title: "Creature evolution", desc: "5 stages from egg to evolved — powered by your consistency" },
            { icon: "M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0", color: "#3b82f6", title: "Your terrarium", desc: "A living scene that grows with every habit you build" },
            { icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", color: "#f59e0b", title: "Earn coins", desc: "Hit milestones and earn coins as you reach streaks" },
            { icon: "M3 3v18h18M7 16l4-8 4 4 4-6", color: "#8b5cf6", title: "Heatmaps", desc: "Beautiful activity charts to visualize your progress" },
          ].map((f, i) => (
            <div key={i} style={{ background: "white", borderRadius: 14, padding: 18, border: "1px solid rgba(0,0,0,0.04)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}><path d={f.icon} /></svg>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.3)", lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "30px 20px 40px", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 500, color: "rgba(0,0,0,0.15)" }}>
          tend<span style={{ color: "#4caf50" }}>.</span>
        </span>
        <p style={{ fontSize: 11, color: "rgba(0,0,0,0.15)", marginTop: 6 }}>
          © {new Date().getFullYear()} Tend. Every good day grows your world.
        </p>
      </footer>
    </main>
  );
}
