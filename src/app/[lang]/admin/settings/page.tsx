
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

function SettingToggle({
  id,
  title,
  description,
  defaultChecked,
}: {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-base">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">
          Configurações do Sistema
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Ajuste as configurações globais da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              Preferências da Plataforma
            </h3>
            <SettingToggle
              id="maintenance-mode"
              title="Modo de Manutenção"
              description="Ativar modo de manutenção para todos os usuários."
            />
            <SettingToggle
              id="new-users-registration"
              title="Registro de Novos Usuários"
              description="Permitir que novos usuários se cadastrem na plataforma."
              defaultChecked
            />
            <SettingToggle
              id="email-notifications"
              title="Notificações por E-mail"
              description="Enviar notificações por e-mail para os usuários."
              defaultChecked
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              Configurações de Segurança
            </h3>
            <SettingToggle
              id="two-factor-auth"
              title="Autenticação de Dois Fatores (Admin)"
              description="Requerer 2FA para administradores."
              defaultChecked
            />
            <SettingToggle
              id="activity-log"
              title="Log de Atividades"
              description="Manter registro de todas as atividades administrativas."
              defaultChecked
            />
            <SettingToggle
              id="login-attempts"
              title="Limite de Tentativas de Login"
              description="Bloquear após 5 tentativas de login malsucedidas."
              defaultChecked
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">
              Configurações de Taxas
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="fee-percentage">Taxa de Administração (%)</Label>
                <Input
                  id="fee-percentage"
                  type="number"
                  defaultValue="2.5"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-investment">
                  Investimento Mínimo (R$)
                </Label>
                <Input id="min-investment" type="number" defaultValue="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payout-interval">Intervalo de Pagamento</Label>
                <Select defaultValue="quarterly">
                  <SelectTrigger id="payout-interval">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="semiannual">Semestral</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" /> Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    