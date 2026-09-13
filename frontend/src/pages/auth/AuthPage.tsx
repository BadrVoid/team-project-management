import { AuthCard } from "@/components/auth/AuthCard";
import { Logo } from "@/components/Logo";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-6 py-7">
      <div className="mb-10">
        <Logo />
      </div>

      <div className="w-full max-w-5xl">
        <AuthCard />
      </div>
    </main>
  );
}