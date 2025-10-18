
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Portfolio } from "@/lib/types";

interface OverviewCardsProps {
  portfolio: Portfolio | null;
}

export function OverviewCards({ portfolio }: OverviewCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (!portfolio) {
    return (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-4/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Valor Total da Carteira</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ganhos Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(portfolio.monthlyGains)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Royalties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(portfolio.royalties)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Saldo Disponível</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(portfolio.availableBalance)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
