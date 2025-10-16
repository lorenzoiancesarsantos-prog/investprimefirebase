export const dynamic = 'force-dynamic';

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-accent px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card className="shadow-2xl bg-gradient-to-br from-card to-accent border-border">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Bem-vindo de volta!</CardTitle>
            <CardDescription>Faça login para acessar sua carteira.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
