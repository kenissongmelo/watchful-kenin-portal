
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Code,
  Settings
} from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating alert:', formData);
    // Here you would typically send the data to your backend
  };

  const selectedProvider = providers.find(p => p.id === formData.provider);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create New Alert</h2>
        <p className="text-gray-600">Configure a new monitoring alert for your services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>Alert Configuration</span>
              </CardTitle>
              <CardDescription>
                Define your alert parameters and monitoring query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Alert Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., High CPU Usage Alert"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Input
                      id="service"
                      placeholder="e.g., payment-api"
                      value={formData.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Monitoring Provider</Label>
                  <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a monitoring provider" />
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
                      placeholder="Enter your monitoring query..."
                      value={formData.query}
                      onChange={(e) => handleInputChange('query', e.target.value)}
                      className="font-mono text-sm min-h-24"
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
                  <Label htmlFor="threshold">Alert Threshold</Label>
                  <Input
                    id="threshold"
                    placeholder="e.g., > 80%, > 2000ms, > 100"
                    value={formData.threshold}
                    onChange={(e) => handleInputChange('threshold', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this alert monitors and when it should trigger..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Create Alert
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
              <CardDescription>How your alert will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium">{formData.name || 'Alert Name'}</h4>
                  <Badge variant="outline">
                    {selectedProvider?.name || 'Provider'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Service:</strong> {formData.service || 'service-name'}</div>
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
                <CardTitle className="text-lg">Sample Queries</CardTitle>
                <CardDescription>Common {selectedProvider.name} queries</CardDescription>
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
                <span>Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Test your queries in the provider's console first</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use specific service tags for better targeting</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Set reasonable thresholds to avoid alert fatigue</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
