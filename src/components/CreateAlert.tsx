
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Code,
  Settings,
  Loader2
} from 'lucide-react';
import { AlertProviderService, AlertData } from '@/services/alertProviders';

export const CreateAlert = () => {
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    provider: '',
    query: '',
    threshold: '',
    description: ''
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const providers = [
    { id: 'newrelic', name: 'New Relic', queryType: 'NRQL' },
    { id: 'datadog', name: 'Datadog', queryType: 'Datadog Query Language' }
  ];

  const sampleQueries = {
    newrelic: [
      "SELECT average(cpuPercent) FROM SystemSample WHERE hostname LIKE '%service%'",
      "SELECT percentile(duration, 95) FROM Transaction WHERE appName = 'your-app'",
      "SELECT count(*) FROM TransactionError WHERE appName = 'your-app'"
    ],
    datadog: [
      "avg:system.cpu.user{service:your-service}",
      "avg:postgresql.connections{service:your-service}",
      "sum:nginx.net.request_per_s{service:your-service}"
    ]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStoredCredentials = (provider: string) => {
    const stored = localStorage.getItem(`${provider}_credentials`);
    return stored ? JSON.parse(stored) : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.service || !formData.provider || !formData.query || !formData.threshold) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const credentials = getStoredCredentials(formData.provider);
    if (!credentials) {
      toast({
        title: "Erro",
        description: "Credenciais não encontradas. Configure o provedor primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    console.log('Creating alert:', formData);

    try {
      const alertData: AlertData = {
        name: formData.name,
        service: formData.service,
        query: formData.query,
        threshold: formData.threshold,
        description: formData.description
      };

      const provider = AlertProviderService.createProvider(
        formData.provider as 'newrelic' | 'datadog',
        credentials
      );

      const result = await provider.createAlert(alertData);
      console.log('Alert created successfully:', result);

      toast({
        title: "Sucesso!",
        description: `Alerta "${formData.name}" criado com sucesso no ${providers.find(p => p.id === formData.provider)?.name}.`,
      });

      // Reset form
      setFormData({
        name: '',
        service: '',
        provider: '',
        query: '',
        threshold: '',
        description: ''
      });

    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Erro",
        description: `Falha ao criar alerta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const selectedProvider = providers.find(p => p.id === formData.provider);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Criar Novo Alerta</h2>
        <p className="text-gray-600">Configure um novo alerta de monitoramento para seus serviços</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>Configuração do Alerta</span>
              </CardTitle>
              <CardDescription>
                Defina os parâmetros do seu alerta e query de monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Alerta</Label>
                    <Input
                      id="name"
                      placeholder="ex: Alerta de Alto Uso de CPU"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Serviço</Label>
                    <Input
                      id="service"
                      placeholder="ex: payment-api"
                      value={formData.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provedor de Monitoramento</Label>
                  <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um provedor de monitoramento" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="query">
                    Query ({selectedProvider?.queryType || 'Query Language'})
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="query"
                      placeholder="Digite sua query de monitoramento..."
                      value={formData.query}
                      onChange={(e) => handleInputChange('query', e.target.value)}
                      className="font-mono text-sm min-h-24"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                      {isPreviewMode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">Threshold do Alerta</Label>
                  <Input
                    id="threshold"
                    placeholder="ex: 80, 2000, 100"
                    value={formData.threshold}
                    onChange={(e) => handleInputChange('threshold', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o que este alerta monitora e quando deve ser disparado..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Criar Alerta
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
              <CardDescription>Como seu alerta aparecerá</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium">{formData.name || 'Nome do Alerta'}</h4>
                  <Badge variant="outline">
                    {selectedProvider?.name || 'Provedor'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Serviço:</strong> {formData.service || 'nome-do-serviço'}</div>
                  <div><strong>Threshold:</strong> {formData.threshold || 'threshold'}</div>
                </div>
                {formData.query && (
                  <div className="mt-3 p-2 bg-white rounded border">
                    <code className="text-xs break-all">{formData.query}</code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sample Queries */}
          {selectedProvider && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Queries de Exemplo</CardTitle>
                <CardDescription>Queries comuns do {selectedProvider.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleQueries[selectedProvider.id]?.map((query, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleInputChange('query', query)}
                    >
                      <code className="text-xs text-gray-700 break-all">{query}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Dicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Teste suas queries no console do provedor primeiro</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use tags específicas de serviço para melhor segmentação</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Configure thresholds razoáveis para evitar fadiga de alertas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
