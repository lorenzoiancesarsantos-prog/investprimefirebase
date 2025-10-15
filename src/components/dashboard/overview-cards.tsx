import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, TrendingUp, Coins, CircleDollarSign, ArrowUp } from "lucide-react";
import type { Portfolio } from "@/lib/types";

function StatCard({ title, value, change, icon: Icon }: { title: string, value: string, change?: string, icon: React.ElementType }) {
  return (
     <div className="stat-card bg-primary/5 border border-primary/20 rounded-md p-4 text-center transition-all hover:shadow-lg hover:-translate-y-1 relative overflow-hidden before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent before:transition-all before:duration-500 hover:before:left-full">
        <div className="stat-value text-2xl font-bold text-primary mb-1">{value}</div>
        <div className="stat-label text-muted-foreground text-sm mb-1">{title}</div>
        {change && (
          <div className="stat-change text-xs text-green-400 flex items-center justify-center gap-1">
              <ArrowUp className="h-3 w-3" /> {change}
          </div>
        )}
    </div>
  )
}


export function OverviewCards({ portfolio }: { portfolio: Portfolio }) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Wallet className="text-primary" /> Minha Carteira</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Investido" value={formatCurrency(portfolio.totalInvested)} change="+5.5%" icon={Wallet} />
          <StatCard title="Ganhos Mensais" value={formatCurrency(portfolio.monthlyGains)} change="+5.5%" icon={TrendingUp} />
          <StatCard title="Royalties" value={String(portfolio.royalties)} icon={Coins} />
          <StatCard title="Disponível para Saque" value={formatCurrency(portfolio.availableBalance)} change="+100%" icon={CircleDollarSign} />
        </div>
      </CardContent>
    </Card>
  );
}
