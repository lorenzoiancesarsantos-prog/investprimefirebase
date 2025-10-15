
'use client';

import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileEdit,
  Trash2,
  MoreHorizontal,
  Plus,
  BarChart,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvestmentChart } from '@/components/dashboard/investment-chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo, useState, useEffect } from 'react';
import { getInvestments as fetchInvestments } from '@/services/investments';

type Investment = {
    id: number;
    userId: number;
    userName: string;
    amount: number;
    expectedReturn: number;
    startDate: string;
    duration: string;
    status: 'active' | 'completed';
}

const performanceData = [
  { name: 'Tesouro Direto', value: 12.5 },
  { name: 'Ações', value: 18.7 },
  { name: 'FIIs', value: 15.2 },
  { name: 'CDB', value: 10.8 },
  { name: 'LCI/LCA', value: 9.5 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function AdminInvestmentsPage() {
  const [allInvestments, setAllInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadInvestments() {
      setLoading(true);
      const fetchedInvestments = await fetchInvestments();
      setAllInvestments(fetchedInvestments as Investment[]);
      setLoading(false);
    }
    loadInvestments();
  }, []);
  
  const investments = useMemo(() => {
    return allInvestments.filter(investment => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        investment.userName.toLowerCase().includes(searchLower) ||
        String(investment.id).includes(searchLower);

      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'high_return' && investment.expectedReturn / investment.amount > 1.2) ||
                            investment.status === statusFilter;
                            
      return matchesSearch && matchesStatus;
    });
  }, [allInvestments, searchTerm, statusFilter]);

  if (loading) {
    return <div>Carregando investimentos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">
          Gestão de Investimentos
        </h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Investimento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><PieChart className="h-5 w-5 text-primary" /> Distribuição de Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <InvestmentChart />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><TrendingUp className="h-5 w-5 text-primary" /> Performance de Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={performanceData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Investimentos</CardTitle>
           <div className="flex items-center pt-2 gap-4">
              <Input 
                placeholder="Buscar por nome ou ID..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="completed">Finalizados</SelectItem>
                    <SelectItem value="high_return">Alto Retorno</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor Investido</TableHead>
                <TableHead>Retorno Esperado</TableHead>
                <TableHead>Data de Início</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>{investment.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://picsum.photos/seed/${investment.userId}/40/40`}
                        />
                        <AvatarFallback>
                          {investment.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{investment.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {investment.userId}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(investment.amount)}</TableCell>
                  <TableCell>
                    {formatCurrency(investment.expectedReturn)}
                  </TableCell>
                  <TableCell>{investment.startDate}</TableCell>
                  <TableCell>{investment.duration}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        investment.status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                      className={
                        investment.status === 'active'
                          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                      }
                    >
                      {investment.status === 'active'
                        ? 'Ativo'
                        : 'Finalizado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileEdit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
