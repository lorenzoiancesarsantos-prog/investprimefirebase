
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BrainCircuit, Bot, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { getInvestmentSuggestion, InvestmentProfile, InvestmentProfileSchema, InvestmentSuggestion } from '@/ai/flows/ai-investment-suggestions';

export default function AIAdvisorPage() {
  const [suggestion, setSuggestion] = useState<InvestmentSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InvestmentProfile>({
    resolver: zodResolver(InvestmentProfileSchema),
    defaultValues: {
      investmentObjective: '',
      riskProfile: 'moderado',
      availableBalance: 1000,
      monthlyInvestment: 200,
    },
  });

  const onSubmit = async (data: InvestmentProfile) => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const result = await getInvestmentSuggestion(data);
      setSuggestion(result);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao gerar a sugestão. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Consultor de Investimentos IA
        </h1>
        <p className="text-muted-foreground">
          Preencha seu perfil para receber uma sugestão de investimento personalizada.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Seu Perfil de Investidor</CardTitle>
            <CardDescription>
              Quanto mais precisas as informações, melhor será a recomendação.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="investmentObjective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual seu objetivo principal?</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Aposentadoria, comprar um imóvel..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil de Risco</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="conservador">Conservador</SelectItem>
                          <SelectItem value="moderado">Moderado</SelectItem>
                          <SelectItem value="agressivo">Agressivo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="availableBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Disponível (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aporte Mensal (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Analisando...' : 'Gerar Sugestão'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="text-primary" />
              Sugestão da IA
            </CardTitle>
            <CardDescription>
              Com base nos seus dados, aqui está uma estratégia recomendada.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {isLoading && (
              <div className="text-center text-muted-foreground">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Processando sua solicitação...</p>
              </div>
            )}
            {error && (
              <div className="text-center text-destructive-foreground bg-destructive/20 p-6 rounded-lg">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                <p className="mt-4 font-semibold">Erro ao gerar sugestão</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {suggestion && (
              <div className="space-y-6 text-sm animate-fade-in">
                <div>
                  <h4 className="font-bold text-primary text-base mb-1">Resumo da Análise</h4>
                  <p className="text-muted-foreground">{suggestion.analysisSummary}</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-base mb-1">Estratégia Sugerida</h4>
                  <p className="text-muted-foreground">{suggestion.suggestedStrategy}</p>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-base mb-1">Justificativa</h4>
                  <p className="text-muted-foreground">{suggestion.rationale}</p>
                </div>
              </div>
            )}
            {!isLoading && !suggestion && !error && (
              <div className="text-center text-muted-foreground">
                <p>Preencha o formulário para ver sua sugestão.</p>
              </div>
            )}
          </CardContent>
           <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Atenção: Esta é uma sugestão gerada por IA e não constitui uma recomendação financeira profissional. Invista com consciência dos riscos.
                </p>
           </CardFooter>
        </Card>
      </div>
    </div>
  );
}
