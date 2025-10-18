
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  LayoutGrid,
  LineChart,
  LogOut,
  Settings,
  Users,
  PanelLeft,
  Cog,
  Megaphone,
  User,
  Activity,
} from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/firebase';
import { checkUserRoleAction } from '@/app/actions/user';

function AdminUserNav() {
  const params = useParams();
  const lang = params.lang as string;
  const userInitials = 'AS';
  const auth = getFirebaseAuth();
  const router = useRouter();


  const handleSignOut = () => {
    auth.signOut().then(() => {
      router.push(`/${lang}/login`);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors hover:bg-primary/10">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://picsum.photos/seed/2/100/100"
              alt="André Silva (Admin)"
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">
              André Silva
            </p>
            <p className="text-xs leading-none text-green-400 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Online
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              André Silva (Admin)
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@grupoinvestprimebrazil.com.br
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${lang}/admin/settings`}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${lang}/admin/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const getNavItems = (lang: string) => [
  { href: `/${lang}/admin`, label: 'Dashboard', icon: LayoutGrid },
  { href: `/${lang}/admin/users`, label: 'Usuários', icon: Users },
  { href: `/${lang}/admin/investments`, label: 'Investimentos', icon: LineChart },
  { href: `/${lang}/admin/campaigns`, label: 'Campanhas', icon: Megaphone },
  { href: `/${lang}/admin/notifications`, label: 'Notificações', icon: Bell },
  { href: `/${lang}/admin/settings`, label: 'Configurações', icon: Cog },
  { href: `/${lang}/admin/health`, label: 'Diagnóstico', icon: Activity },
];

function NavLink({ href, label, icon: Icon, isActive }: { href: string; label: string; icon: React.ElementType; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-primary/10 text-primary'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = getNavItems(params.lang);
  const auth = getFirebaseAuth();


  const checkActive = (href: string) => {
    if (href.endsWith('/admin')) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
  
  const handleSignOut = () => {
    auth.signOut().then(() => {
        router.push(`/${params.lang}/login`);
    });
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[250px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-4">
          <div className="flex h-20 items-center border-b px-6">
            <Link href={`/${params.lang}`}>
              <Logo />
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {navItems.map((item) => (
                <NavLink 
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  isActive={checkActive(item.href)}
                />
              ))}
            </nav>
          </div>
          <div className="mt-auto border-t p-4">
             <Button size="sm" className="w-full" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-20 items-center gap-4 border-b bg-card px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href={`/${params.lang}`}
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo />
                  <span className="sr-only">Invest Prime</span>
                </Link>
                {navItems.map((item) => (
                  <NavLink 
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    isActive={checkActive(item.href)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-2xl font-bold font-headline">Painel Administrativo</h1>
          </div>
          <AdminUserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
