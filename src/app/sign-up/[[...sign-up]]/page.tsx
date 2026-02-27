import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500 }}>tend<span style={{ color: "#4caf50" }}>.</span></span>
        </div>
        <SignUp appearance={{ elements: {
          card: "rounded-3xl shadow-lg border border-green-100",
          formButtonPrimary: "bg-green-500 hover:bg-green-600 rounded-2xl",
          footerActionLink: "text-green-600",
        }}} />
      </div>
    </div>
  );
}
