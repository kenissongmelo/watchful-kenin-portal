
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

const providersData = [
  {
    id: 'newrelic',
    name: 'New Relic',
    description: 'Application Performance Monitoring and Infrastructure Monitoring',
    status: 'connected',
    apiKey: 'NRAK-***************',
    lastSync: '2 minutes ago',
    alertsCount: 15,
    logo: '🔴'
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Cloud monitoring service for IT infrastructure and applications',
    status: 'disconnected',
    apiKey: '',
    lastSync: 'Never',
    alertsCount: 0,
    logo: '🐕'
  }
];

export const ProvidersConfig = () => {
  const [providers, setProviders] = useState(providersData);
  const [showApiKeys, setShowApiKeys] = useState({});
  const [editingProvider, setEditingProvider] = useState(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Provider Configuration</h2>
        <p className="text-gray-600">Manage your monitoring provider integrations and API keys</p>
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Security Notice</h3>
              <p className="text-sm text-blue-700 mt-1">
                API keys are encrypted and stored securely. They are only used to create and manage alerts on your behalf.
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
                            Connected
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Disconnected
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
                  <div className="text-sm text-gray-600">Active Alerts</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{provider.lastSync}</div>
                  <div className="text-sm text-gray-600">Last Sync</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-green-600">
                    {provider.status === 'connected' ? 'Healthy' : 'Inactive'}
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
                    placeholder="Enter your API key..."
                    value={provider.apiKey}
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Test
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
                    <h4 className="font-medium text-gray-900">Advanced Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">Account ID</Label>
                        <Input placeholder="Account ID..." className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Region</Label>
                        <Input placeholder="us, eu..." className="mt-1" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Save Settings
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Provider</h3>
          <p className="text-gray-600 mb-4">
            Connect additional monitoring providers to expand your alert coverage
          </p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
