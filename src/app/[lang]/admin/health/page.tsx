
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { testFirestoreConnection } from '@/services/health';
import { Loader2, CheckCircle, XCircle, Database, Server, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type TestStatus = 'idle' | 'pending' | 'success' | 'error';
type TestResult = {
  status: TestStatus;
  message: string;
};

export default function HealthCheckPage() {
  const [writeTest, setWriteTest] = useState<TestResult>({ status: 'idle', message: 'Aguardando teste.' });
  const [readTest, setReadTest] = useState<TestResult>({ status: 'idle', message: 'Aguardando teste.' });
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    setWriteTest({ status: 'pending', message: 'Executando teste de escrita...' });
    setReadTest({ status: 'idle', message: 'Aguardando teste de escrita.' });

    const result = await testFirestoreConnection();

    setWriteTest({
      status: result.write.success ? 'success' : 'error',
      message: result.write.message,
    });

    if (result.write.success) {
      setReadTest({ status: 'pending', message: 'Executando teste de leitura...' });
      // The read test result is part of the same check
      setReadTest({
        status: result.read.success ? 'success' : 'error',
        message: result.read.message,
      });
    } else {
      setReadTest({ status: 'error', message: 'Teste de leitura não executado devido à falha na escrita.' });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getOverallStatus = () => {
    if (writeTest.status === 'error' || readTest.status === 'error') {
      return 'error';
    }
    if (writeTest.status === 'success' && readTest.status === 'success') {
      return 'success';
    }
    if (isRunning) {
        return 'pending';
    }
    return 'idle';
  }

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Diagnóstico do Sistema</h1>
      </div>

      {overallStatus === 'success' && (
        <Alert variant="default" className="bg-green-500/10 border-green-500/50">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle className="text-green-400">Tudo Certo!</AlertTitle>
            <AlertDescription className="text-green-400/80">
                A conexão com o banco de dados Firebase Firestore está funcionando corretamente.
            </AlertDescription>
        </Alert>
      )}

      {overallStatus === 'error' && (
        <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Problema de Conexão Detectado</AlertTitle>
            <AlertDescription>
                Não foi possível ler ou escrever no banco de dados. Verifique as regras de segurança do Firestore e as configurações de conexão.
            </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Teste de Conexão com o Banco de Dados</CardTitle>
          <CardDescription>
            Clique no botão abaixo para verificar se a aplicação consegue ler e escrever dados no Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={handleRunTests} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Activity className="mr-2 h-4 w-4" />
            )}
            {isRunning ? 'Executando...' : 'Iniciar Testes'}
          </Button>

          <div className="space-y-4 rounded-lg border p-4">
             <h3 className="font-semibold text-lg">Resultados:</h3>
             <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Teste de Escrita (Write)</p>
                        {getStatusIcon(writeTest.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{writeTest.message}</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Server className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Teste de Leitura (Read)</p>
                        {getStatusIcon(readTest.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{readTest.message}</p>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
