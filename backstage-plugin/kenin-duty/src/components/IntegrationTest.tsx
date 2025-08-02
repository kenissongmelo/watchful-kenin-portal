import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Phone as PhoneIcon,
  Http as WebhookIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@material-ui/icons';
import { useApi } from '@backstage/core-plugin-api';
import { keninDutyApiRef, CallTest, WebhookTest, IntegrationConfig, DashboardData } from '../api/KeninDutyApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

export const IntegrationTest = () => {
  const keninDutyApi = useApi(keninDutyApiRef);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Call Test States
  const [callTest, setCallTest] = useState<CallTest>({
    phone: '',
    message: '',
  });
  const [callResult, setCallResult] = useState<CallTest | null>(null);
  const [callLoading, setCallLoading] = useState(false);

  // Webhook Test States
  const [webhookProvider, setWebhookProvider] = useState('newrelic');
  const [webhookPayload, setWebhookPayload] = useState('{\n  "alert": {\n    "id": "test-alert",\n    "title": "Test Alert",\n    "severity": "critical"\n  }\n}');
  const [webhookResult, setWebhookResult] = useState<WebhookTest | null>(null);
  const [webhookLoading, setWebhookLoading] = useState(false);

  // Config States
  const [config, setConfig] = useState<IntegrationConfig>({
    apiBaseUrl: 'http://localhost:7007',
    healthUrl: 'http://localhost:7007/health',
    timeout: 5000,
    autoRefresh: false,
    refreshInterval: 30,
    enableLogs: true,
    logLevel: 'info',
    maxLogs: 1000,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [configData, dashData] = await Promise.all([
        keninDutyApi.getConfig(),
        keninDutyApi.getDashboardData(),
      ]);
      setConfig(configData.integration);
      setDashboardData(dashData);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      const result = await keninDutyApi.testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCallTest = async () => {
    if (!callTest.phone || !callTest.message) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setCallLoading(true);
      const result = await keninDutyApi.testCall(callTest);
      setCallResult(result);
    } catch (error) {
      console.error('Erro no teste de chamada:', error);
      setCallResult({
        ...callTest,
        status: 'error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setCallLoading(false);
    }
  };

  const handleWebhookTest = async () => {
    if (!webhookProvider || !webhookPayload) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    try {
      setWebhookLoading(true);
      const payload = JSON.parse(webhookPayload);
      const result = await keninDutyApi.testWebhook(webhookProvider, payload);
      setWebhookResult(result);
    } catch (error) {
      console.error('Erro no teste de webhook:', error);
      setWebhookResult({
        provider: webhookProvider,
        payload: webhookPayload,
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleConfigUpdate = async () => {
    try {
      setLoading(true);
      await keninDutyApi.updateConfig(config);
      alert('Configuração atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      alert('Erro ao atualizar configuração');
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    try {
      setLoading(true);
      const dashData = await keninDutyApi.getDashboardData();
      setDashboardData(dashData);
    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'primary';
      case 'error': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      default: return <RefreshIcon />;
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Teste de Integração</Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={testConnection}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            style={{ marginRight: 8 }}
          >
            Testar Conexão
          </Button>
          <Chip
            icon={getStatusIcon(connectionStatus)}
            label={connectionStatus === 'connected' ? 'Conectado' : connectionStatus === 'error' ? 'Erro' : 'Desconhecido'}
            color={getStatusColor(connectionStatus)}
          />
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Dashboard" />
        <Tab label="Teste de Chamada" />
        <Tab label="Teste de Webhook" />
        <Tab label="Configuração" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Dashboard de Integração</Typography>
          <Button
            variant="outlined"
            onClick={refreshDashboard}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            Atualizar
          </Button>
        </Box>

        {dashboardData && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Times
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.totalTeams}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Alertas
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.totalAlerts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Alertas Ativos
                  </Typography>
                  <Typography variant="h4" color="error">
                    {dashboardData.activeAlerts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Alertas Críticos
                  </Typography>
                  <Typography variant="h4" color="error">
                    {dashboardData.criticalAlerts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Última Atualização
                  </Typography>
                  <Typography>
                    {new Date(dashboardData.lastUpdated).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Teste de Chamada
                </Typography>
                <TextField
                  fullWidth
                  label="Número de Telefone"
                  value={callTest.phone}
                  onChange={(e) => setCallTest({ ...callTest, phone: e.target.value })}
                  margin="normal"
                  placeholder="+55 11 99999-9999"
                />
                <TextField
                  fullWidth
                  label="Mensagem"
                  value={callTest.message}
                  onChange={(e) => setCallTest({ ...callTest, message: e.target.value })}
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder="Mensagem de teste para a chamada"
                />
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCallTest}
                    disabled={callLoading}
                    startIcon={callLoading ? <CircularProgress size={20} /> : <PhoneIcon />}
                  >
                    {callLoading ? 'Testando...' : 'Testar Chamada'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            {callResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resultado do Teste
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={callResult.status || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Session ID"
                        secondary={callResult.sessionId || 'N/A'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Timestamp"
                        secondary={callResult.timestamp ? new Date(callResult.timestamp).toLocaleString() : 'N/A'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Teste de Webhook
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Provider</InputLabel>
                  <Select
                    value={webhookProvider}
                    onChange={(e) => setWebhookProvider(e.target.value as string)}
                  >
                    <MenuItem value="newrelic">New Relic</MenuItem>
                    <MenuItem value="datadog">Datadog</MenuItem>
                    <MenuItem value="grafana">Grafana</MenuItem>
                    <MenuItem value="generic">Generic</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Payload JSON"
                  value={webhookPayload}
                  onChange={(e) => setWebhookPayload(e.target.value)}
                  margin="normal"
                  multiline
                  rows={10}
                  variant="outlined"
                />
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleWebhookTest}
                    disabled={webhookLoading}
                    startIcon={webhookLoading ? <CircularProgress size={20} /> : <WebhookIcon />}
                  >
                    {webhookLoading ? 'Testando...' : 'Testar Webhook'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            {webhookResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resultado do Teste
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Provider"
                        secondary={webhookResult.provider}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={
                          <Chip
                            label={webhookResult.success ? 'Sucesso' : 'Erro'}
                            color={webhookResult.success ? 'primary' : 'secondary'}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Mensagem"
                        secondary={webhookResult.message}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Timestamp"
                        secondary={webhookResult.timestamp ? new Date(webhookResult.timestamp).toLocaleString() : 'N/A'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configuração de Integração
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL Base da API"
                  value={config.apiBaseUrl}
                  onChange={(e) => setConfig({ ...config, apiBaseUrl: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL de Health Check"
                  value={config.healthUrl}
                  onChange={(e) => setConfig({ ...config, healthUrl: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Timeout (ms)"
                  type="number"
                  value={config.timeout}
                  onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Intervalo de Refresh (s)"
                  type="number"
                  value={config.refreshInterval}
                  onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Nível de Log</InputLabel>
                  <Select
                    value={config.logLevel}
                    onChange={(e) => setConfig({ ...config, logLevel: e.target.value as string })}
                  >
                    <MenuItem value="debug">Debug</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Máximo de Logs"
                  type="number"
                  value={config.maxLogs}
                  onChange={(e) => setConfig({ ...config, maxLogs: parseInt(e.target.value) })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.autoRefresh}
                      onChange={(e) => setConfig({ ...config, autoRefresh: e.target.checked })}
                    />
                  }
                  label="Auto Refresh"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.enableLogs}
                      onChange={(e) => setConfig({ ...config, enableLogs: e.target.checked })}
                    />
                  }
                  label="Habilitar Logs"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfigUpdate}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SettingsIcon />}
                >
                  {loading ? 'Salvando...' : 'Salvar Configuração'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>
    </div>
  );
}; 