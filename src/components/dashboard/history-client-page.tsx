
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Handshake, Landmark, Info } from 'lucide-react';
import { useState, useEffect } from "react";
import type { Transaction } from "@/lib/types";

export function HistoryClientPage({ initialTransactions }: { initialTransactions: Transaction[] }) {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sort on the client to ensure consistency and avoid hydration mismatches
    const sortedHistory = [...initialTransactions].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });
    setHistory(sortedHistory);
    setLoading(false);
  }, [initialTransactions]);


  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'purchase':
        return <ShoppingCart className="h-5 w-5 text-green-400" />;
      case 'withdrawal':
        return <Landmark className="h-5 w-5 text-yellow-400" />;
      case 'referral':
        return <Handshake className="h-5 w-5 text-blue-400" />;
      default:
        return null;
    }
  }

  const getTransactionDescription = (transaction: Transaction) => {
    switch(transaction.type) {
        case 'purchase':
            return `Compra de ${transaction.quantity} royalties`;
        case 'withdrawal':
            return `Saque de rendimentos`;
        case 'referral':
            return `Ganhos de indicação`;
        default:
            return 'Transação';
    }
  }

  if (loading) {
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="text-center text-muted-foreground py-8">
                <p>Carregando histórico...</p>
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
            {history.length === 0 ? (
                 <div className="text-center text-muted-foreground py-8">
                    <Info className="mx-auto h-8 w-8 mb-2" />
                    <p>Nenhuma transação ainda.</p>
                </div>
            ) : (
                 <div className="space-y-4">
                    {history.map((transaction) => (
                        <div key={transaction.id} className="timeline-item flex gap-4 p-4 bg-background/50 border border-border rounded-md transition-colors hover:border-primary">
                           <div className={`timeline-icon w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10`}>
                               {getTransactionIcon(transaction.type)}
                           </div>
                           <div className="timeline-content flex-1">
                                <div className="timeline-header flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-foreground">{getTransactionDescription(transaction)}</h4>
                                    <span className={`timeline-amount font-semibold text-sm ${transaction.type === 'withdrawal' ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {transaction.type === 'withdrawal' ? '-' : '+'}
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                </div>
                                <div className="timeline-date text-xs text-muted-foreground">
                                    {formatDate(transaction.date)}
                                </div>
                           </div>
                        </div>
                    ))}
                 </div>
            )}
        </CardContent>
      </Card>
  );
}
