
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { signupAction } from "@/app/actions/auth";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Nome completo é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "A confirmação de senha é obrigatória." }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos de usuário.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});


export function SignupForm() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const result = await signupAction({
        fullName: values.fullName,
        email: values.email,
        password: values.password
      });

      if (result?.success) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Sua conta foi criada. Você já pode fazer login.",
        });
        router.push(`/${lang}/login`);
      } else if (result?.error) {
        throw new Error(result.error);
      } else {
        throw new Error("Ocorreu um erro inesperado. Tente novamente.");
      }

    } catch (error: any) {
        toast({
            title: "Erro no Cadastro",
            description: error.message || "Não foi possível processar seu cadastro. Verifique seus dados e tente novamente.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="João da Silva" {...field} autoComplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} autoComplete="email" />
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
                    autoComplete="new-password"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                 <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                    autoComplete="new-password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-muted-foreground">
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>                  
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Eu aceito os <Link href={`/${lang}/terms`} className="underline" target="_blank" rel="noopener noreferrer">termos de usuário</Link>.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : "Criar Conta"}
        </Button>
        <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
            Já tem uma conta?{" "}
            <Link href={`/${lang}/login`} className="font-semibold text-primary hover:underline">
                Faça login
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
