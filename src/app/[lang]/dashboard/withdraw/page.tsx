
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPortfolioAction } from "@/app/actions/user"; // Alterado para Server Action
import { CircleDollarSign, Info, Clock, CalendarCheck, Download, Loader2 } from "lucide-react";
import { getFirebaseAuth } from "@/firebase";
import { useEffect, useState, useTransition } from "react";
import type { Portfolio } from "@/lib/types";
import { withdrawAction } from "@/app/actions/investment";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";


export default function WithdrawPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const params = useParams();
  const lang = params.lang as string;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const portfolioData = await getPortfolioAction(user.uid); // Alterado para Server Action
        setPortfolio(portfolioData);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const handleWithdraw = (formData: FormData) => {
    if (!userId) {
        toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
        return;
    }
    const auth = getFirebaseAuth();
    if (!auth.currentUser) {
        toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
        return;
    }

    formData.set('userId', auth.currentUser.uid);

    startTransition(async () => {
      const result = await withdrawAction(formData);
      if (result?.error) {
        toast({
          title: "Erro no Saque",
          description: result.error,
          variant: "destructive",
        });
      } else if (result?.success) {
        toast({
          title: "Sucesso!",
          description: result.success,
        });
        setAmount(''); 
        if(auth.currentUser) {
           const portfolioData = await getPortfolioAction(auth.currentUser.uid); // Alterado para Server Action
           setPortfolio(portfolioData);
        }
      }
    });
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Área de Saques</h1>
        <p className="text-muted-foreground">
          Gerencie seu saldo disponível e solicite saques.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Solicitar Saque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="balance-display text-center p-4 bg-green-500/10 border border-green-500/30 rounded-md">
              <span className="balance-label block text-muted-foreground mb-1 text-sm">Saldo Disponível</span>
              <span className="balance-value text-2xl font-bold text-green-400">{formatCurrency(portfolio?.availableBalance ?? 0)}</span>
            </div>

            <form action={handleWithdraw} className="space-y-4">
              <input type="hidden" name="lang" value={lang} />
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Valor do Saque (R$)</label>
                <div className="relative">
                   <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input 
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    required
                    max={portfolio?.availableBalance ?? 0}
                    step="0.01"
                   />
                </div>
              </div>
              <Button className="w-full" type="submit" disabled={isPending || parseFloat(amount) <= 0 || !amount}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                {isPending ? 'Processando...' : 'Solicitar Saque'}
              </Button>
            </form>
            
            <div className="space-y-4 pt-4 border-t">
              <div className="rule-item flex items-start gap-4 p-4 bg-background/50 border border-border rounded-md">
                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Prazo Mínimo</strong>
                  <p className="text-sm text-muted-foreground">12 meses para saque do investimento principal</p>
                </div>
              </div>
              <div className="rule-item flex items-start gap-4 p-4 bg-background/50 border border-border rounded-md">
                <CalendarCheck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Rendimentos</strong>
                  <p className="text-sm text-muted-foreground">Podem ser sacados mensalmente</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Histórico de Saques</CardTitle>
          </CardHeader>
          <CardContent>
            {/* This will be dynamic in a future step */}
            <div className="text-center text-muted-foreground py-8">
              <Info className="mx-auto h-8 w-8 mb-2" />
              <p>Nenhum saque realizado ainda.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
