
'use client';
import Link from "next/link";
import {
  Handshake,
  LayoutDashboard,
  LineChart,
  Settings,
  Landmark,
  BrainCircuit
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Header } from "@/components/dashboard/header";
import { UserNav } from "@/components/dashboard/user-nav";
import { getUserAction } from "@/app/actions/user"; // Alterado para Server Action
import { getFirebaseAuth } from "@/firebase";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserAction(firebaseUser.uid); // Alterado para Server Action
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getNavItems = (lang: string) => [
    { href: `/${lang}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${lang}/dashboard/history`, label: 'Histórico', icon: LineChart },
    { href: `/${lang}/dashboard/referrals`, label: 'Indique e Ganhe', icon: Handshake },
    { href: `/${lang}/dashboard/withdraw`, label: 'Saques', icon: Landmark },
    { href: `/${lang}/dashboard/ai-advisor`, label: 'Consultor IA', icon: BrainCircuit },
    { href: `/${lang}/dashboard/settings`, label: 'Configurações', icon: Settings },
  ];

  const navItems = getNavItems(params.lang);

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header>
           {loading ? (
             <div>Carregando...</div>
           ) : user ? (
            <UserNav user={{ fullName: user.name, email: user.email, avatarUrl: `https://picsum.photos/seed/${user.id}/100/100` }} lang={params.lang} />
           ) : (
             <div></div>
           )}
        </Header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
