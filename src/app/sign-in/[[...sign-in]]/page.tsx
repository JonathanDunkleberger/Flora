import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500 }}>bloom<span style={{ color: "#4caf50" }}>.</span></span>
        </div>
        <SignIn appearance={{ elements: {
          card: "rounded-3xl shadow-lg border border-bloom-100",
          formButtonPrimary: "bg-bloom-500 hover:bg-bloom-600 rounded-2xl",
          footerActionLink: "text-bloom-600",
        }}} />
      </div>
    </div>
  );
}
