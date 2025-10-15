
'use client';
import { AiAdvisorClient } from "@/components/dashboard/ai-advisor-client";
import { getPortfolio } from "@/services/users";
import { getFirebaseAuth } from "@/firebase";
import { useEffect, useState } from "react";
import type { Portfolio } from "@/lib/types";

export default function AiAdvisorPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const portfolioData = await getPortfolio(user.uid);
        setPortfolio(portfolioData);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!portfolio) {
    // This case can happen if the user is not logged in or portfolio doesn't exist
    return <div>Não foi possível carregar os dados do portfólio.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Consultor de Investimentos IA</h1>
        <p className="text-muted-foreground">
          Receba sugestões de estratégia de compra de royalties com base em seus objetivos.
        </p>
      </div>
      <AiAdvisorClient balance={portfolio.availableBalance} />
    </div>
  );
}
