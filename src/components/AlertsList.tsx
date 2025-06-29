
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink,
  Play,
  Pause,
  Plus,
  Bell
} from 'lucide-react';

const mockAlerts = [
  {
    id: 1,
    name: 'High CPU Usage Alert',
    service: 'payment-api',
    provider: 'New Relic',
    query: "SELECT average(cpuPercent) FROM SystemSample WHERE hostname LIKE '%payment%'",
    status: 'active',
    threshold: '> 80%',
    lastTriggered: '2 hours ago',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Database Connection Pool',
    service: 'user-service',
    provider: 'Datadog',
    query: "avg:postgresql.connections{service:user-service}",
    status: 'paused',
    threshold: '> 90',
    lastTriggered: 'Never',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: 'API Response Time',
    service: 'auth-service',
    provider: 'New Relic',
    query: "SELECT percentile(duration, 95) FROM Transaction WHERE appName = 'auth-service'",
    status: 'active',
    threshold: '> 2000ms',
    lastTriggered: '1 day ago',
    createdAt: '2024-01-08'
  }
];

export const AlertsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alerts, setAlerts] = useState(mockAlerts);
  const { toast } = useToast();

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === 'all' || alert.provider.toLowerCase().includes(filterProvider.toLowerCase());
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesProvider && matchesStatus;
  });

  const handleCreateAlert = () => {
    toast({
      title: "Criar Alerta",
      description: "Redirecionando para página de criação de alerta...",
    });
    // Navegação será implementada com router
    window.location.href = '/create';
  };

  const handleToggleStatus = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: alert.status === 'active' ? 'paused' : 'active' }
        : alert
    ));
    
    const alert = alerts.find(a => a.id === alertId);
    const newStatus = alert?.status === 'active' ? 'pausado' : 'ativado';
    
    toast({
      title: "Status Alterado",
      description: `Alerta "${alert?.name}" foi ${newStatus}`,
    });
  };

  const handleEditAlert = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    toast({
      title: "Editar Alerta",
      description: `Editando alerta: ${alert?.name}`,
    });
    console.log('Editing alert:', alertId);
  };

  const handleViewExternal = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    toast({
      title: "Link Externo",
      description: `Abrindo ${alert?.provider} para o alerta: ${alert?.name}`,
    });
    console.log('Opening external link for alert:', alertId);
  };

  const handleDeleteAlert = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    
    if (confirm(`Tem certeza que deseja excluir o alerta "${alert?.name}"?`)) {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast({
        title: "Alerta Excluído",
        description: `Alerta "${alert?.name}" foi removido com sucesso`,
        variant: "destructive",
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterProvider('all');
    setFilterStatus('all');
    toast({
      title: "Filtros Limpos",
      description: "Todos os filtros foram removidos",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
          <p className="text-gray-600">Manage and configure your monitoring alerts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateAlert}>
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search alerts or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="new relic">New Relic</SelectItem>
                <SelectItem value="datadog">Datadog</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Grid */}
      <div className="grid gap-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.name}</h3>
                    <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                      {alert.status}
                    </Badge>
                    <Badge variant="outline">{alert.provider}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Service:</span> {alert.service}
                    </div>
                    <div>
                      <span className="font-medium">Threshold:</span> {alert.threshold}
                    </div>
                    <div>
                      <span className="font-medium">Last Triggered:</span> {alert.lastTriggered}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {alert.createdAt}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-1">Query:</div>
                    <code className="text-sm font-mono text-gray-800 break-all">{alert.query}</code>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleToggleStatus(alert.id)}
                    title={alert.status === 'active' ? 'Pausar alerta' : 'Ativar alerta'}
                  >
                    {alert.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditAlert(alert.id)}
                    title="Editar alerta"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewExternal(alert.id)}
                    title="Ver no provider externo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteAlert(alert.id)}
                    title="Excluir alerta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Bell className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
