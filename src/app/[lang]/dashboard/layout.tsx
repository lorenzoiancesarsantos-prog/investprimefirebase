
'use client';
import Link from "next/link";
import {
  Handshake,
  LayoutDashboard,
  LineChart,
  Settings,
  Landmark,
  BrainCircuit,
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
import { getUserAction } from "@/app/actions/user"; 
import { getFirebaseAuth } from "@/firebase";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";
import { useParams, useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const pathname = usePathname();
  const lang = params.lang as string;
  const auth = getFirebaseAuth();

  useEffect(() => {
    // This effect's primary purpose is to fetch the user data for the navigation bar.
    // The actual route protection is handled by the server component page.
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserAction(firebaseUser.uid); 
        setUser(userData);
      } else {
        // If the user logs out, clear the state. The page component will handle redirection.
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const getNavItems = (lang: string) => [
    { href: `/${lang}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${lang}/dashboard/history`, label: 'Histórico', icon: LineChart },
    { href: `/${lang}/dashboard/ai-advisor`, label: 'Consultor IA', icon: BrainCircuit },
    { href: `/${lang}/dashboard/referrals`, label: 'Indique e Ganhe', icon: Handshake },
    { href: `/${lang}/dashboard/withdraw`, label: 'Saques', icon: Landmark },
    { href: `/${lang}/dashboard/settings`, label: 'Configurações', icon: Settings },
  ];

  const navItems = getNavItems(lang);
  
  const checkActive = (href: string) => {
    if (href.endsWith('/dashboard')) {
        return pathname === href;
    }
    return pathname.startsWith(href);
  };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Carregando...</p>
        </div>
    )
  }

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
                <SidebarMenuButton asChild tooltip={item.label} isActive={checkActive(item.href)}>
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
           {user && <UserNav user={{ fullName: user.name, email: user.email, avatarUrl: `https://picsum.photos/seed/${user.id}/100/100` }} lang={lang} />}
        </Header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
