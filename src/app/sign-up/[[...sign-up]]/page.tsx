import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🌱</span>
          <span className="text-2xl font-bold text-bloom-700">Bloom</span>
        </div>
        <SignUp appearance={{ elements: {
          card: "rounded-3xl shadow-lg border border-bloom-100",
          formButtonPrimary: "bg-bloom-500 hover:bg-bloom-600 rounded-2xl",
          footerActionLink: "text-bloom-600",
        }}} />
      </div>
    </div>
  );
}
