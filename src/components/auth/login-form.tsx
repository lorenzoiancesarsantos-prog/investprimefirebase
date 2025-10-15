
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/firebase";
import { checkUserRole } from "@/services/users";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = getFirebaseAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const { email, password } = values;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const role = await checkUserRole(userId);

      setIsLoading(false);

      if (role === 'admin') {
        toast({
            title: "Login de Admin bem-sucedido!",
            description: "Redirecionando para o painel de admin.",
        });
        router.push(`/${lang}/admin`);
      } else {
        toast({
            title: "Login bem-sucedido!",
            description: "Redirecionando para o seu painel.",
        });
        router.push(`/${lang}/dashboard`);
      }

    } catch (error: any) {
      setIsLoading(false);
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = "E-mail ou senha inválidos.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'A configuração do Firebase para este aplicativo não foi encontrada. Verifique se sua chave de API está correta.';
      }
      toast({
        title: "Erro de Login",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground">
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
        </Button>
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>
            Não tem uma conta?{" "}
            <Link href={`/${lang}/signup`} className="font-semibold text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
           <p>
            <Link href={`/${lang}/`} className="hover:underline">
              Voltar para a página inicial
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
