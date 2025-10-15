
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const MAX_CHARACTERS = 500;

export default function AdminNotificationsPage() {
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim().length === 0) {
      toast({
        title: 'Erro',
        description: 'A mensagem não pode estar vazia.',
        variant: 'destructive',
      });
      return;
    }

    // Lógica de envio da notificação (simulada)
    console.log('Enviando mensagem:', message);

    toast({
      title: 'Sucesso!',
      description: 'Sua notificação foi enviada para os usuários selecionados.',
    });

    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">
          Enviar Notificação
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Compor Mensagem</CardTitle>
          <CardDescription>
            Escreva e envie uma mensagem para os usuários da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="notification-target">Destinatários</Label>
            <Select defaultValue="all">
              <SelectTrigger id="notification-target" className="w-[280px]">
                <SelectValue placeholder="Selecione os destinatários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Usuários</SelectItem>
                <SelectItem value="active">Apenas Ativos</SelectItem>
                <SelectItem value="premium">Apenas Premium</SelectItem>
                <SelectItem value="inactive">Apenas Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_CHARACTERS}
              className="min-h-[150px]"
            />
            <p className="text-sm text-muted-foreground text-right">
              {message.length} / {MAX_CHARACTERS}
            </p>
          </div>
          <Button onClick={handleSendMessage}>
            <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    