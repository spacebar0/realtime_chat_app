import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Zync</h1>
        <p className="text-muted-foreground">Join the conversation.</p>
      </div>
      <SignupForm />
    </div>
  );
}
