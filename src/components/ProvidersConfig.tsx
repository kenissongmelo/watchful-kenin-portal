
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
  Loader2
} from 'lucide-react';
import { AlertProviderService } from '@/services/alertProviders';

interface Provider {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected';
  apiKey: string;
  lastSync: string;
  alertsCount: number;
  logo: string;
  accountId?: string;
  appKey?: string;
}

const initialProvidersData: Provider[] = [
  {
    id: 'newrelic',
    name: 'New Relic',
    description: 'Application Performance Monitoring and Infrastructure Monitoring',
    status: 'disconnected',
    apiKey: '',
    lastSync: 'Nunca',
    alertsCount: 0,
    logo: '🔴',
    accountId: ''
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Cloud monitoring service for IT infrastructure and applications',
    status: 'disconnected',
    apiKey: '',
    lastSync: 'Nunca',
    alertsCount: 0,
    logo: '🐕',
    appKey: ''
  }
];

export const ProvidersConfig = () => {
  const [providers, setProviders] = useState<Provider[]>(initialProvidersData);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const { toast } = useToast();

  // Load saved credentials on mount
  useEffect(() => {
    const savedProviders = providers.map(provider => {
      const savedCredentials = localStorage.getItem(`${provider.id}_credentials`);
      if (savedCredentials) {
        const credentials = JSON.parse(savedCredentials);
        return {
          ...provider,
          apiKey: credentials.apiKey || '',
          accountId: credentials.accountId || '',
          appKey: credentials.appKey || '',
          status: 'connected' as const
        };
      }
      return provider;
    });
    setProviders(savedProviders);
  }, []);

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const handleProviderToggle = (providerId: string, enabled: boolean) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, status: enabled ? 'connected' : 'disconnected' }
        : provider
    ));
  };

  const handleInputChange = (providerId: string, field: string, value: string) => {
    setProviders(prev => prev.map(provider =>
      provider.id === providerId
        ? { ...provider, [field]: value }
        : provider
    ));
  };

  const testConnection = async (provider: Provider) => {
    if (!provider.apiKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira a API key primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (provider.id === 'newrelic' && !provider.accountId) {
      toast({
        title: "Erro",
        description: "Por favor, insira o Account ID do New Relic.",
        variant: "destructive",
      });
      return;
    }

    if (provider.id === 'datadog' && !provider.appKey) {
      toast({
        title: "Erro",
        description: "Por favor, insira a Application Key do Datadog.",
        variant: "destructive",
      });
      return;
    }

    setTestingProvider(provider.id);

    try {
      const credentials = {
        apiKey: provider.apiKey,
        accountId: provider.accountId,
        appKey: provider.appKey
      };

      const providerService = AlertProviderService.createProvider(
        provider.id as 'newrelic' | 'datadog',
        credentials
      );

      const isConnected = await providerService.testConnection();

      if (isConnected) {
        toast({
          title: "Sucesso!",
          description: `Conexão com ${provider.name} estabelecida com sucesso.`,
        });

        // Save credentials to localStorage
        localStorage.setItem(`${provider.id}_credentials`, JSON.stringify(credentials));

        // Update provider status
        setProviders(prev => prev.map(p =>
          p.id === provider.id
            ? { ...p, status: 'connected', lastSync: 'Agora' }
            : p
        ));
      } else {
        throw new Error('Falha na conexão');
      }

    } catch (error) {
      console.error('Connection test failed:', error);
      toast({
        title: "Erro",
        description: `Falha ao conectar com ${provider.name}. Verifique suas credenciais.`,
        variant: "destructive",
      });

      // Update provider status
      setProviders(prev => prev.map(p =>
        p.id === provider.id
          ? { ...p, status: 'disconnected' }
          : p
      ));
    } finally {
      setTestingProvider(null);
    }
  };

  const saveSettings = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;

    const credentials = {
      apiKey: provider.apiKey,
      accountId: provider.accountId,
      appKey: provider.appKey
    };

    localStorage.setItem(`${providerId}_credentials`, JSON.stringify(credentials));
    setEditingProvider(null);

    toast({
      title: "Sucesso!",
      description: "Configurações salvas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuração de Provedores</h2>
        <p className="text-gray-600">Gerencie suas integrações com provedores de monitoramento e API keys</p>
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Aviso de Segurança</h3>
              <p className="text-sm text-blue-700 mt-1">
                As API keys são armazenadas localmente no seu navegador. Elas são usadas apenas para criar e gerenciar alertas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      <div className="grid gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{provider.logo}</div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{provider.name}</span>
                      <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'}>
                        {provider.status === 'connected' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Conectado
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Desconectado
                          </>
                        )}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={provider.status === 'connected'}
                    onCheckedChange={(checked) => handleProviderToggle(provider.id, checked)}
                  />
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{provider.alertsCount}</div>
                  <div className="text-sm text-gray-600">Alertas Ativos</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{provider.lastSync}</div>
                  <div className="text-sm text-gray-600">Última Sincronização</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-green-600">
                    {provider.status === 'connected' ? 'Saudável' : 'Inativo'}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>

              {/* API Key Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${provider.id}-api-key`} className="text-sm font-medium">
                    API Key
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleApiKeyVisibility(provider.id)}
                  >
                    {showApiKeys[provider.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    id={`${provider.id}-api-key`}
                    type={showApiKeys[provider.id] ? 'text' : 'password'}
                    placeholder="Insira sua API key..."
                    value={provider.apiKey}
                    onChange={(e) => handleInputChange(provider.id, 'apiKey', e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testConnection(provider)}
                    disabled={testingProvider === provider.id}
                  >
                    {testingProvider === provider.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Testar'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingProvider(provider.id === editingProvider ? null : provider.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                {editingProvider === provider.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <h4 className="font-medium text-gray-900">Configurações Avançadas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {provider.id === 'newrelic' && (
                        <div>
                          <Label className="text-xs text-gray-600">Account ID</Label>
                          <Input 
                            placeholder="Account ID..." 
                            className="mt-1"
                            value={provider.accountId || ''}
                            onChange={(e) => handleInputChange(provider.id, 'accountId', e.target.value)}
                          />
                        </div>
                      )}
                      {provider.id === 'datadog' && (
                        <div>
                          <Label className="text-xs text-gray-600">Application Key</Label>
                          <Input 
                            placeholder="Application Key..." 
                            className="mt-1"
                            value={provider.appKey || ''}
                            onChange={(e) => handleInputChange(provider.id, 'appKey', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingProvider(null)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => saveSettings(provider.id)}
                      >
                        Salvar Configurações
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Provider */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 mb-4">
            <Settings className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Adicionar Novo Provedor</h3>
          <p className="text-gray-600 mb-4">
            Conecte provedores de monitoramento adicionais para expandir sua cobertura de alertas
          </p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Provedor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
