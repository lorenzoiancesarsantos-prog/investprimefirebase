
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { buyRoyaltiesAction } from "@/app/actions/investment";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { getFirebaseAuth } from "@/firebase";

export function RecentPurchases() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const lang = params.lang as string;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const pricePerRoyalty = 100;
  const monthlyReturnRate = 0.055;
  const totalCost = quantity * pricePerRoyalty;
  const monthlyReturn = totalCost * monthlyReturnRate;

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (newQuantity > 100) return 100;
      return newQuantity;
    });
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
        toast({ title: "Erro", description: "Você precisa estar logado para comprar.", variant: "destructive" });
        return;
    }
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set('totalCost', String(totalCost));
    formData.set('lang', lang);
    formData.set('userId', userId);
    
    const result = await buyRoyaltiesAction(formData);

    if (result?.error) {
      toast({
        title: "Erro na Compra",
        description: result.error,
        variant: "destructive",
      });
    } else if (result?.success) {
      toast({
        title: "Sucesso!",
        description: result.success,
      });
      setQuantity(1);
    }
    
    setLoading(false);
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Compra de Royalties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="royalty-info grid grid-cols-2 gap-4 mb-4 p-4 bg-primary/5 border border-primary/20 rounded-md">
            <div className="royalty-price text-center">
                <span className="price block text-lg font-bold text-primary">{formatCurrency(pricePerRoyalty)}</span>
                <span className="label text-xs text-muted-foreground">por royalty</span>
            </div>
            <div className="royalty-return text-center">
                <span className="return block text-lg font-bold text-primary">{monthlyReturnRate * 100}%</span>
                <span className="label text-xs text-muted-foreground">retorno mensal</span>
            </div>
        </div>
        
        <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantidade</label>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(-1)} disabled={loading}>-</Button>
                    <Input id="quantity" name="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))} className="text-center" readOnly={loading} />
                    <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(1)} disabled={loading}>+</Button>
                </div>
            </div>
             <div className="purchase-summary bg-background/50 border border-border rounded-md p-3 space-y-1">
                <div className="summary-row flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <strong className="text-primary font-semibold">{formatCurrency(totalCost)}</strong>
                </div>
                <div className="summary-row flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Retorno mensal:</span>
                    <strong className="text-primary font-semibold">{formatCurrency(monthlyReturn)}</strong>
                </div>
            </div>
          <Button type="submit" className="w-full" disabled={loading || !userId}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            {loading ? 'Processando...' : 'Comprar Agora'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
