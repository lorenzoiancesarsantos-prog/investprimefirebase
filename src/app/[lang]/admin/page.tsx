
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUp,
  DollarSign,
  Users,
  Gem,
  LineChart,
  UserPlus,
  Bell,
  TrendingDown,
  TrendingUp,
  Target,
  Shield,
  Save,
} from 'lucide-react';
import { InvestmentChart } from '@/components/dashboard/investment-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { getUsers } from '@/services/users';
import type { User } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
  
const formatDate = (timestamp: Timestamp | Date) => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

export default function AdminDashboardPage() {
    const [investmentCeiling, setInvestmentCeiling] = useState(5000000);
    const [spendingCeiling, setSpendingCeiling] = useState(250000);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadUsers() {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        setLoading(false);
      }
      loadUsers();
    }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">
          Painel Administrativo
        </h1>
        <div className="flex gap-2">
           <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" /> Enviar Notificação
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(2547890)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" /> +12.5% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{users.filter(u => u.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" /> +8.3% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Royalties Vendidos
            </CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">25,478</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" /> +15.7% desde o mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Mensal</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(127394.5)}</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" /> +22.1% desde o mês passado
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Controle Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="superavit" className="flex items-center gap-2"><TrendingUp className="text-green-500" /> Registrar Superávit</Label>
            <Input id="superavit" type="number" placeholder="Ex: 50000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deficit" className="flex items-center gap-2"><TrendingDown className="text-red-500" /> Registrar Déficit</Label>
            <Input id="deficit" type="number" placeholder="Ex: 15000" />
          </div>
          <div className="p-4 bg-card rounded-md border flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <Target className="text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Teto de Investimento</p>
                    <p className="text-lg font-bold">{formatCurrency(investmentCeiling)}</p>
                </div>
            </div>
          </div>
           <div className="p-4 bg-card rounded-md border flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <Shield className="text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Teto de Gastos</p>
                    <p className="text-lg font-bold">{formatCurrency(spendingCeiling)}</p>
                </div>
            </div>
          </div>
        </CardContent>
        <CardContent>
             <Button>
                <Save className="mr-2 h-4 w-4" /> Salvar Controle Financeiro
            </Button>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Usuários Recentes</CardTitle>
            <div className="flex items-center pt-2">
              <Input placeholder="Buscar usuário..." className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor Investido</TableHead>
                   <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Carregando usuários...</TableCell>
                  </TableRow>
                ) : (
                  users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://picsum.photos/seed/${user.id}/40/40`}
                          />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                             ID: {user.id.substring(0, 6)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(user.invested)}</TableCell>
                     <TableCell>{formatDate(user.registrationDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'active' ? 'default' : 'destructive'
                        }
                        className={
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                        }
                      >
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
             <div className="pt-2">
                <Select defaultValue="6m">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6m">Últimos 6 meses</SelectItem>
                    <SelectItem value="1y">Último ano</SelectItem>
                    <SelectItem value="all">Todo o período</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <InvestmentChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    