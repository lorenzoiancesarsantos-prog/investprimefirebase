
import { SignupForm } from "@/components/auth/signup-form";
import { Logo } from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-lg mx-auto">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Crie sua conta</CardTitle>
            <CardDescription>Comece a investir em royalties hoje mesmo.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
