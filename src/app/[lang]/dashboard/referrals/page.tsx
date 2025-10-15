
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { getUser } from "@/services/users";
import type { User } from "@/lib/types";
import { getFirebaseAuth } from "@/firebase";

export default function ReferralsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Example data, replace with real data fetching
  const mockData: any[] = [];
  const totalReferrals = mockData.length;
  const totalEarnings = mockData.reduce((acc, ref) => acc + ref.earnings, 0);

   useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copiado!",
        description: "Código de indicação copiado para a área de transferência.",
      });
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Indique e Ganhe</h1>
        <p className="text-muted-foreground">
          Compartilhe seu código e ganhe benefícios a cada novo indicado.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
           <div className="referral-stat text-center p-4 bg-primary/5 border border-primary/20 rounded-md">
                <div className="stat-value text-2xl font-bold text-primary">{totalReferrals}</div>
                <div className="stat-label text-sm text-muted-foreground">Indicados</div>
            </div>
             <div className="referral-stat text-center p-4 bg-primary/5 border border-primary/20 rounded-md">
                <div className="stat-value text-2xl font-bold text-primary">{formatCurrency(totalEarnings)}</div>
                <div className="stat-label text-sm text-muted-foreground">Ganhos</div>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Seu Código de Indicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" value={user?.referralCode || ''} readOnly className="font-mono"/>
              <Button type="submit" size="icon" onClick={copyReferralCode} disabled={!user?.referralCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Como funciona:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li><strong>1º nível:</strong> 1% dos lucros dos seus indicados diretos</li>
                    <li><strong>2º nível:</strong> 0.5% dos lucros dos indicados dos seus indicados</li>
                </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Seus Indicados</CardTitle>
          </CardHeader>
          <CardContent>
             {mockData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    <Users className="mx-auto h-8 w-8 mb-2" />
                    <p>Você ainda não tem indicados.</p>
                </div>
            ) : (
                 <div className="space-y-4">
                    {mockData.map((referral, index) => (
                        <div key={index} className="referral-item flex flex-col sm:flex-row items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border transition-all hover:border-primary">
                            <div className="referral-info text-center sm:text-left">
                                <div className="font-medium text-foreground">{referral.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    <span>{referral.level}º nível</span> - <span>Desde {formatDate(referral.joinDate)}</span>
                                </div>
                            </div>
                            <div className="referral-earnings text-center sm:text-right mt-2 sm:mt-0">
                                <div className="font-semibold text-green-400">{formatCurrency(referral.earnings)}</div>
                                <div className="text-xs text-muted-foreground">seus ganhos</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
