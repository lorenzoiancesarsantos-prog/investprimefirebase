
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Plus, BarChart, Target, Trash, Edit, PlayCircle, PauseCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo, useState, useEffect } from 'react';
import { getCampaigns as fetchCampaigns } from '@/services/campaigns';

type Campaign = {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'ended';
    description: string;
    startDate: string;
    endDate: string;
    conversion: string;
}

export default function AdminCampaignsPage() {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true);
      const fetchedCampaigns = await fetchCampaigns();
      setAllCampaigns(fetchedCampaigns as Campaign[]);
      setLoading(false);
    }
    loadCampaigns();
  }, []);

  const campaigns = useMemo(() => {
    return allCampaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allCampaigns, searchTerm, statusFilter]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'ended':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
        case 'active':
          return 'Ativa';
        case 'paused':
          return 'Pausada';
        case 'ended':
          return 'Finalizada';
        default:
          return 'Desconhecido';
      }
  }

  if (loading) {
    return <div>Carregando campanhas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">
          Gestão de Campanhas
        </h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Campanha
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Campanhas Ativas
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{allCampaigns.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" /> +3 desde a semana passada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conversão
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">8.7%</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <ArrowUp className="h-4 w-4 mr-1" /> +1.2% desde o mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Campanhas</CardTitle>
           <div className="flex items-center pt-2 gap-4">
              <Input 
                placeholder="Buscar campanha..." 
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="paused">Pausadas</SelectItem>
                    <SelectItem value="ended">Finalizadas</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="shadow-none">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={getStatusVariant(campaign.status) + ' hover:' + getStatusVariant(campaign.status)}>
                      {getStatusLabel(campaign.status)}
                    </Badge>
                    <CardTitle className="mt-2">{campaign.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground h-20">
                  {campaign.description}
                </p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                  <span>
                    <strong>Início:</strong> {campaign.startDate}
                  </span>
                  <span>
                    <strong>Término:</strong> {campaign.endDate}
                  </span>
                  <span className='font-bold text-primary'>
                    <strong>Conversão:</strong> {campaign.conversion}
                  </span>
                </div>
                 <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className='w-full'>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <Button variant={campaign.status === 'active' ? 'destructive' : 'default'} size="sm" className='w-full'>
                      {campaign.status === 'active' ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                      {campaign.status === 'active' ? 'Pausar' : 'Reativar'}
                    </Button>
                  </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
