
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateSuggestionAction, FormState } from '@/app/actions/investment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, BarChart, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { getPortfolio } from '@/services/users';
import { getFirebaseAuth } from '@/firebase';
import type { Portfolio } from '@/lib/types';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Gerar Sugestão
        </>
      )}
    </Button>
  );
}

export default function AiAdvisorPage() {
  const [state, formAction] = useFormState(generateSuggestionAction, initialState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>();
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

  useEffect(() => {
    setFieldErrors(state.fieldErrors);
  }, [state.fieldErrors]);

  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!portfolio) {
    return <div>Não foi possível carregar os dados do portfólio.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Consultor IA</h1>
        <p className="text-muted-foreground">
          Receba uma sugestão de investimento personalizada com base no seu perfil.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Seu Perfil</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para que nossa IA crie a melhor estratégia para você.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="investmentObjective">Objetivo de Investimento</Label>
                <Textarea
                  id="investmentObjective"
                  name="investmentObjective"
                  placeholder="Ex: Crescimento a longo prazo, aposentadoria, renda passiva..."
                  required
                />
                {fieldErrors?.investmentObjective && (
                  <p className="text-sm font-medium text-destructive">{fieldErrors.investmentObjective}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Perfil de Risco</Label>
                <Select name="riskProfile" defaultValue="moderado" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu perfil de risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservador">Conservador</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="agressivo">Agressivo</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors?.riskProfile && (
                  <p className="text-sm font-medium text-destructive">{fieldErrors.riskProfile}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableBalance">Saldo Disponível (R$)</Label>
                  <Input
                    id="availableBalance"
                    name="availableBalance"
                    type="number"
                    defaultValue={portfolio.availableBalance}
                    required
                  />
                  {fieldErrors?.availableBalance && (
                    <p className="text-sm font-medium text-destructive">{fieldErrors.availableBalance}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyInvestment">Investimento Mensal (R$)</Label>
                  <Input
                    id="monthlyInvestment"
                    name="monthlyInvestment"
                    type="number"
                    placeholder="500"
                    required
                  />
                  {fieldErrors?.monthlyInvestment && (
                    <p className="text-sm font-medium text-destructive">{fieldErrors.monthlyInvestment}</p>
                  )}
                </div>
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {!state.suggestedStrategy && !state.error && (
            <Card className="flex h-full flex-col items-center justify-center text-center p-8 bg-card/50 border-dashed shadow-none">
              <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Aguardando suas informações</h3>
              <p className="text-muted-foreground">
                Sua estratégia de investimento personalizada aparecerá aqui.
              </p>
            </Card>
          )}

          {state.error && !state.fieldErrors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.analysisSummary && (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline text-primary">Resumo da Análise</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-card-foreground prose-p:text-card-foreground">
                <p>{state.analysisSummary}</p>
              </CardContent>
            </Card>
          )}

          {state.suggestedStrategy && (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline text-primary">Estratégia Sugerida</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-card-foreground prose-p:text-card-foreground">
                <p>{state.suggestedStrategy}</p>
              </CardContent>
            </Card>
          )}

          {state.rationale && (
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline text-primary">Análise da IA</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-card-foreground prose-p:text-card-foreground">
                <p>{state.rationale}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
