import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Stack,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Phone as PhoneIcon,
  Api as ApiIcon
} from '@mui/icons-material';
import { keninDutyService, KeninDutyConfig } from '../services/KeninDutyService';

const KeninDutyConfigPage: React.FC = () => {
  const [config, setConfig] = useState<KeninDutyConfig>(keninDutyService.getConfig());
  const [isValid, setIsValid] = useState<boolean>(true);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details: any } | null>(null);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleConfigChange = (field: keyof KeninDutyConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    
    // Validate URLs
    if (field === 'pluginApiUrl' || field === 'pluginHealthUrl' || field === 'callsApiUrl' || field === 'callsHealthUrl') {
      setIsValid(validateUrl(value));
    }
  };

  const handleSave = () => {
    keninDutyService.updateConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('');
    setTestResult(null);
    
    try {
      const result = await keninDutyService.testConnection();
      if (result.success) {
        setTestStatus('success');
        setTestMessage(result.message);
        setTestResult(result);
      } else {
        setTestStatus('error');
        setTestMessage(result.message);
        setTestResult(result);
      }
    } catch (error: any) {
      setTestStatus('error');
      setTestMessage(`Erro de conexão: ${error.message}`);
      setTestResult(null);
    }
  };

  const handleReset = () => {
    const defaultConfig: KeninDutyConfig = {
      pluginApiUrl: 'http://localhost:7007',
      pluginHealthUrl: 'http://localhost:7007/health',
      callsApiUrl: 'http://localhost:8080',
      callsHealthUrl: 'http://localhost:8080/stats',
      timeout: 5000,
      autoRefresh: false,
      refreshInterval: 30,
      enableLogs: true,
      logLevel: 'info'
    };
    setConfig(defaultConfig);
    setIsValid(true);
    setTestStatus('idle');
    setTestMessage('');
    setSaved(false);
  };

  const predefinedPluginPorts = [
    { port: 7007, label: 'Padrão (7007)', description: 'Porta padrão do plugin KeninDuty' },
    { port: 7008, label: 'Alternativa (7008)', description: 'Porta alternativa do plugin' },
    { port: 7009, label: 'Desenvolvimento (7009)', description: 'Porta para desenvolvimento' }
  ];

  const predefinedCallsPorts = [
    { port: 8080, label: 'Padrão (8080)', description: 'Porta padrão da API de ligações' },
    { port: 3001, label: 'Alternativa (3001)', description: 'Porta alternativa da API de ligações' },
    { port: 3002, label: 'Desenvolvimento (3002)', description: 'Porta para desenvolvimento' },
    { port: 9000, label: 'Web (9000)', description: 'Porta comum para APIs web' }
  ];

  const handlePluginPortChange = (port: number) => {
    const newConfig = {
      ...config,
      pluginApiUrl: `http://localhost:${port}`,
      pluginHealthUrl: `http://localhost:${port}/health`
    };
    setConfig(newConfig);
    setSaved(false);
  };

  const handleCallsPortChange = (port: number) => {
    const newConfig = {
      ...config,
      callsApiUrl: `http://localhost:${port}`,
      callsHealthUrl: `http://localhost:${port}/health`
    };
    setConfig(newConfig);
    setSaved(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <SettingsIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Configurações KeninDuty
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Plugin API Configuration */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ApiIcon color="primary" />
                API do Plugin KeninDuty
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configuração da API do plugin que gerencia times, alertas e políticas
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL da API do Plugin"
                    value={config.pluginApiUrl}
                    onChange={(e) => handleConfigChange('pluginApiUrl', e.target.value)}
                    helperText="URL base da API do plugin KeninDuty"
                    placeholder="http://localhost:7007"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL de Health Check do Plugin"
                    value={config.pluginHealthUrl}
                    onChange={(e) => handleConfigChange('pluginHealthUrl', e.target.value)}
                    helperText="URL para verificar se o plugin está funcionando"
                    placeholder="http://localhost:7007/health"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Portas Pré-definidas do Plugin:
              </Typography>
              
              <Stack spacing={1}>
                {predefinedPluginPorts.map(({ port, label, description }) => (
                  <Chip
                    key={port}
                    label={`${label} - ${description}`}
                    onClick={() => handlePluginPortChange(port)}
                    variant={config.pluginApiUrl.includes(`:${port}`) ? "filled" : "outlined"}
                    color={config.pluginApiUrl.includes(`:${port}`) ? "primary" : "default"}
                    sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Calls API Configuration */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                API de Ligações
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configuração da API que realiza as ligações reais e gerencia chamadas
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL da API de Ligações"
                    value={config.callsApiUrl}
                    onChange={(e) => handleConfigChange('callsApiUrl', e.target.value)}
                    helperText="URL base da API que faz as ligações"
                    placeholder="http://localhost:3001"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL de Health Check das Ligações"
                    value={config.callsHealthUrl}
                    onChange={(e) => handleConfigChange('callsHealthUrl', e.target.value)}
                    helperText="URL para verificar se a API de ligações está funcionando"
                    placeholder="http://localhost:3001/health"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Portas Pré-definidas das Ligações:
              </Typography>
              
              <Stack spacing={1}>
                {predefinedCallsPorts.map(({ port, label, description }) => (
                  <Chip
                    key={port}
                    label={`${label} - ${description}`}
                    onClick={() => handleCallsPortChange(port)}
                    variant={config.callsApiUrl.includes(`:${port}`) ? "filled" : "outlined"}
                    color={config.callsApiUrl.includes(`:${port}`) ? "primary" : "default"}
                    sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* General Configuration */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configurações Gerais
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Timeout (ms)"
                    value={config.timeout}
                    onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                    helperText="Tempo limite para requisições"
                    inputProps={{ min: 1000, max: 30000 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Intervalo de Refresh (s)"
                    value={config.refreshInterval}
                    onChange={(e) => handleConfigChange('refreshInterval', parseInt(e.target.value))}
                    helperText="Intervalo para atualização automática"
                    inputProps={{ min: 5, max: 300 }}
                    disabled={!config.autoRefresh}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.enableLogs}
                        onChange={(e) => handleConfigChange('enableLogs', e.target.checked)}
                      />
                    }
                    label="Habilitar Logs"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.autoRefresh}
                        onChange={(e) => handleConfigChange('autoRefresh', e.target.checked)}
                      />
                    }
                    label="Auto Refresh"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!config.enableLogs}>
                    <InputLabel>Nível de Log</InputLabel>
                    <Select
                      value={config.logLevel}
                      label="Nível de Log"
                      onChange={(e: SelectChangeEvent) => handleConfigChange('logLevel', e.target.value)}
                    >
                      <MenuItem value="debug">Debug</MenuItem>
                      <MenuItem value="info">Info</MenuItem>
                      <MenuItem value="warn">Warning</MenuItem>
                      <MenuItem value="error">Error</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!isValid || saved}
        >
          {saved ? 'Salvo!' : 'Salvar Configuração'}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleTestConnection}
          disabled={!isValid || testStatus === 'testing'}
        >
          Testar Conexões
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleReset}
        >
          Restaurar Padrões
        </Button>
      </Box>

      {/* Test Results */}
      {testResult && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resultado dos Testes de Conexão
            </Typography>
            
            <Alert 
              severity={testResult.success ? 'success' : 'warning'} 
              sx={{ mb: 2 }}
            >
              {testResult.message}
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Plugin API:
                </Typography>
                <Alert 
                  severity={testResult.details.plugin.success ? 'success' : 'error'}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {testResult.details.plugin.message}
                </Alert>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Calls API:
                </Typography>
                <Alert 
                  severity={testResult.details.calls.success ? 'success' : 'error'}
                  sx={{ fontSize: '0.875rem' }}
                >
                  {testResult.details.calls.message}
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Configuration Status */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Status da Configuração
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Plugin API:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                {config.pluginApiUrl}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Health: {config.pluginHealthUrl}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Calls API:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                {config.callsApiUrl}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Health: {config.callsHealthUrl}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Timeout: {config.timeout}ms
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Logs: {config.enableLogs ? `Habilitado (${config.logLevel})` : 'Desabilitado'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default KeninDutyConfigPage; 