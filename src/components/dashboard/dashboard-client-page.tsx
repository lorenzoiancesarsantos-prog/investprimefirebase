
'use client';

import { OverviewCards } from "@/components/dashboard/overview-cards";
import { InvestmentChart } from "@/components/dashboard/investment-chart";
import { RecentPurchases } from "@/components/dashboard/recent-purchases";
import { HistoryPage } from "../../app/[lang]/dashboard/history/page";
import type { User, Portfolio } from "@/lib/types";

interface DashboardClientPageProps {
  user: User;
  portfolio: Portfolio;
}

export default function DashboardClientPage({ user, portfolio }: DashboardClientPageProps) {
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
