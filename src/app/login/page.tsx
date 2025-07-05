import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">ChitChat Hub</h1>
        <p className="text-muted-foreground">Your new favorite place to talk.</p>
      </div>
      <LoginForm />
    </div>
  );
}
