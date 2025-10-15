
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Save,
  User,
  CreditCard,
  Bell,
  Shield,
  Trash2,
  Upload,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import { getUser } from '@/services/users';
import type { User as UserType } from '@/lib/types';
import { getFirebaseAuth } from "@/firebase";


function NotificationToggle({
  id,
  title,
  description,
  defaultChecked,
}: {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-base font-medium">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

export default function UserSettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !user) {
    return <div>Carregando configurações...</div>;
  }

  const userInitials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('') || 'U';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, segurança e preferências.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coluna da Esquerda */}
        <div className="lg:col-span-2 space-y-8">
          {/* Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Perfil Público
              </CardTitle>
              <CardDescription>
                Suas informações que serão visíveis para outros usuários.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`https://picsum.photos/seed/${user.id}/100/100`}
                    alt={user.name}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Alterar Foto
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF ou PNG. Tamanho máximo de 800K.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input id="fullName" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Endereço de E-mail</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Segurança
              </CardTitle>
              <CardDescription>
                Altere sua senha e gerencie a segurança da sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <Button>Atualizar Senha</Button>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita */}
        <div className="space-y-8">
          {/* Cartão de Crédito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Cartão de Crédito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border bg-secondary p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  <span className="font-mono text-sm">•••• •••• •••• 1234</span>
                </div>
                <span className="text-xs text-muted-foreground">08/28</span>
              </div>
              <Button variant="outline" className="w-full">
                Alterar Cartão
              </Button>
            </CardContent>
          </Card>
          
          {/* Excluir Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" /> Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className='text-sm text-muted-foreground'>
                A exclusão da sua conta é uma ação irreversível. Todos os seus dados, investimentos e histórico serão perdidos permanentemente.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Excluir Minha Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction>Sim, excluir minha conta</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
      
       {/* Notificações */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Notificações
              </CardTitle>
              <CardDescription>
                Escolha como você quer ser notificado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <NotificationToggle
                id="email-notifications"
                title="Notificações por E-mail"
                description="Receba e-mails sobre atividades da sua conta e novidades."
                defaultChecked
              />
               <NotificationToggle
                id="push-notifications"
                title="Notificações Push"
                description="Receba notificações push no seu dispositivo sobre alertas importantes."
              />
               <NotificationToggle
                id="monthly-reports"
                title="Relatórios Mensais"
                description="Receba um relatório mensal do desempenho dos seus investimentos."
                defaultChecked
              />
            </CardContent>
        </Card>
    </div>
  );
}
