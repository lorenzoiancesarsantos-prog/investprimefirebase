
'use client';

import { OverviewCards } from "@/components/dashboard/overview-cards";
import { InvestmentChart } from "@/components/dashboard/investment-chart";
import { RecentPurchases } from "@/components/dashboard/recent-purchases";
import { HistoryPage } from "./history/page";
import { getUserAction, getPortfolioAction } from "@/app/actions/user"; // Alterado para Server Action
import { getFirebaseAuth } from "@/firebase";
import { useEffect, useState } from "react";
import type { User, Portfolio } from "@/lib/types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const [userData, portfolioData] = await Promise.all([
          getUserAction(firebaseUser.uid), // Alterado para Server Action
          getPortfolioAction(firebaseUser.uid) // Alterado para Server Action
        ]);
        setUser(userData);
        setPortfolio(portfolioData);
      } else {
        // Handle user not logged in, maybe redirect
        setUser(null);
        setPortfolio(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando dashboard...</div>;
  }

  if (!user || !portfolio) {
    return <div>Não foi possível carregar os dados. Faça o login novamente.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Olá, {user.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">Aqui está um resumo da sua carteira de investimentos.</p>
      </div>
      
      <OverviewCards portfolio={portfolio} />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <InvestmentChart />
        </div>
        <div className="lg:col-span-2">
          <RecentPurchases />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-5">
         <div className="lg:col-span-5">
            <HistoryPage />
         </div>
      </div>
    </div>
  );
}
