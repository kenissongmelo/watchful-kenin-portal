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
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  PlayArrow as TestIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Webhook as WebhookIcon,
  Code as CodeIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

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

interface AlertRule {
  id: string;
  name: string;
  description: string;
  provider: 'newrelic' | 'datadog' | 'grafana';
  query: string;
  condition: {
    operator: 'above' | 'below' | 'equals';
    threshold: number;
    timeWindow: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  teamId?: string;
  notificationChannels: string[];
  createdAt: string;
  updatedAt: string;
}

interface Provider {
  id: string;
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana';
  enabled: boolean;
  config: {
    apiKey?: string;
    accountId?: string;
    url?: string;
    token?: string;
  };
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: string;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'teams';
  config: Record<string, any>;
  enabled: boolean;
}

export const AlertManagementPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'New Relic Production',
      type: 'newrelic',
      enabled: true,
      config: { apiKey: '****', accountId: '1234567' },
      status: 'connected',
      lastCheck: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Datadog Monitoring',
      type: 'datadog',
      enabled: true,
      config: { apiKey: '****' },
      status: 'connected',
      lastCheck: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Grafana Dashboard',
      type: 'grafana',
      enabled: false,
      config: { url: 'http://grafana.local', token: '****' },
      status: 'disconnected',
      lastCheck: new Date().toISOString()
    }
  ]);
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([
    {
      id: '1',
      name: 'DevOps Slack',
      type: 'slack',
      config: { webhook: 'https://hooks.slack.com/...' },
      enabled: true
    },
    {
      id: '2',
      name: 'Emergency Email',
      type: 'email',
      config: { recipients: ['admin@company.com'] },
      enabled: true
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [providerDialog, setProviderDialog] = useState(false);
  const [channelDialog, setChannelDialog] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<Partial<AlertRule>>({
    name: '',
    description: '',
    provider: 'newrelic',
    query: '',
    condition: { operator: 'above', threshold: 80, timeWindow: 300 },
    severity: 'medium',
    enabled: true,
    notificationChannels: []
  });
  const [currentProvider, setCurrentProvider] = useState<Partial<Provider>>({});
  const [currentChannel, setCurrentChannel] = useState<Partial<NotificationChannel>>({});

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  // New Relic Templates
  const newRelicTemplates = [
    {
      name: 'CPU Usage High',
      query: "SELECT average(cpuPercent) FROM SystemSample FACET hostname WHERE cpuPercent > {{threshold}}",
      description: 'Alerta quando CPU está acima do limite'
    },
    {
      name: 'Memory Usage High',
      query: "SELECT average(memoryUsedPercent) FROM SystemSample FACET hostname WHERE memoryUsedPercent > {{threshold}}",
      description: 'Alerta quando memória está acima do limite'
    },
    {
      name: 'Error Rate High',
      query: "SELECT percentage(count(*), WHERE error IS true) FROM Transaction WHERE appName = '{{app_name}}'",
      description: 'Alerta quando taxa de erro está alta'
    },
    {
      name: 'Response Time Slow',
      query: "SELECT average(duration) FROM Transaction WHERE appName = '{{app_name}}' AND duration > {{threshold}}",
      description: 'Alerta quando tempo de resposta está lento'
    }
  ];

  // Datadog Templates
  const datadogTemplates = [
    {
      name: 'Docker Container Down',
      query: "avg(last_5m):avg:docker.containers.running{*} by {container_name} < {{threshold}}",
      description: 'Alerta quando container Docker para'
    },
    {
      name: 'Database Connections High',
      query: "avg(last_10m):avg:postgresql.connections{*} > {{threshold}}",
      description: 'Alerta quando conexões do banco estão altas'
    },
    {
      name: 'Disk Space Low',
      query: "avg(last_15m):avg:system.disk.free{*} by {device} < {{threshold}}",
      description: 'Alerta quando espaço em disco está baixo'
    }
  ];

  // Grafana Templates
  const grafanaTemplates = [
    {
      name: 'Prometheus Metric Alert',
      query: "up{job=\"prometheus\"} == 0",
      description: 'Alerta quando serviço Prometheus está down'
    },
    {
      name: 'HTTP 5xx Errors',
      query: "rate(http_requests_total{status=~\"5..\"}[5m]) > {{threshold}}",
      description: 'Alerta quando há muitos erros 5xx'
    }
  ];

  const getQueryTemplates = (provider: string) => {
    switch (provider) {
      case 'newrelic': return newRelicTemplates;
      case 'datadog': return datadogTemplates;
      case 'grafana': return grafanaTemplates;
      default: return [];
    }
  };

  const createAlert = async () => {
    setLoading(true);
    try {
      const newAlert: AlertRule = {
        ...currentAlert as AlertRule,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAlertRules(prev => [...prev, newAlert]);
      setAlertDialog(false);
      setCurrentAlert({
        name: '',
        description: '',
        provider: 'newrelic',
        query: '',
        condition: { operator: 'above', threshold: 80, timeWindow: 300 },
        severity: 'medium',
        enabled: true,
        notificationChannels: []
      });
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const testProvider = async (provider: Provider) => {
    setLoading(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { ...p, status: 'connected', lastCheck: new Date().toISOString() }
          : p
      ));
    } catch (error) {
      setProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { ...p, status: 'error', lastCheck: new Date().toISOString() }
          : p
      ));
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'newrelic': return '📊';
      case 'datadog': return '🐕';
      case 'grafana': return '📈';
      default: return '🔧';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#4caf50';
      case 'disconnected': return '#9e9e9e';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#ffeb3b';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Alertas
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Configure e gerencie alertas integrados com New Relic, Datadog e Grafana.
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Alertas" icon={<WarningIcon />} />
        <Tab label="Providers" icon={<SettingsIcon />} />
        <Tab label="Notificações" icon={<WebhookIcon />} />
        <Tab label="Templates" icon={<CodeIcon />} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Regras de Alerta ({alertRules.length})</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAlertDialog(true)}
          >
            Criar Alerta
          </Button>
        </Box>

        <Grid container spacing={3}>
          {alertRules.map((alert) => (
            <Grid item xs={12} md={6} lg={4} key={alert.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" gutterBottom>
                      {alert.name}
                    </Typography>
                    <Switch checked={alert.enabled} size="small" />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {alert.description}
                  </Typography>
                  
                  <Box mb={2}>
                    <Chip 
                      label={alert.provider} 
                      size="small" 
                      style={{ marginRight: 8 }}
                      icon={<span>{getProviderIcon(alert.provider)}</span>}
                    />
                    <Chip 
                      label={alert.severity} 
                      size="small"
                      style={{ 
                        backgroundColor: getSeverityColor(alert.severity),
                        color: 'white'
                      }}
                    />
                  </Box>

                  <Typography variant="caption" display="block" gutterBottom>
                    Condição: {alert.condition.operator} {alert.condition.threshold}
                  </Typography>

                  <Typography variant="caption" display="block" gutterBottom>
                    Canais: {alert.notificationChannels.length}
                  </Typography>

                  <Box mt={2} display="flex" gap={1}>
                    <IconButton size="small" onClick={() => {
                      setCurrentAlert(alert);
                      setAlertDialog(true);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => testProvider(providers[0])}>
                      <TestIcon />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Providers de Monitoramento</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setProviderDialog(true)}
          >
            Adicionar Provider
          </Button>
        </Box>

        <Grid container spacing={3}>
          {providers.map((provider) => (
            <Grid item xs={12} md={6} key={provider.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">
                        {getProviderIcon(provider.type)} {provider.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={provider.status}
                        style={{
                          backgroundColor: getStatusColor(provider.status),
                          color: 'white'
                        }}
                      />
                    </Box>
                    <Switch checked={provider.enabled} size="small" />
                  </Box>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Tipo: {provider.type.toUpperCase()}
                  </Typography>

                  <Typography variant="caption" display="block" gutterBottom>
                    Última verificação: {new Date(provider.lastCheck).toLocaleString()}
                  </Typography>

                  <Divider style={{ margin: '16px 0' }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Configuração:
                  </Typography>
                  {Object.entries(provider.config).map(([key, value]) => (
                    <Typography key={key} variant="caption" display="block">
                      {key}: {typeof value === 'string' && value.length > 10 ? '****' : value}
                    </Typography>
                  ))}

                  <Box mt={2} display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<TestIcon />}
                      onClick={() => testProvider(provider)}
                      disabled={loading}
                    >
                      Testar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setCurrentProvider(provider);
                        setProviderDialog(true);
                      }}
                    >
                      Editar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Canais de Notificação</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setChannelDialog(true)}
          >
            Adicionar Canal
          </Button>
        </Box>

        <List>
          {notificationChannels.map((channel) => (
            <Card key={channel.id} style={{ marginBottom: 16 }}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography variant="h6">{channel.name}</Typography>
                      <Chip label={channel.type} size="small" />
                      {channel.enabled ? (
                        <SuccessIcon style={{ color: '#4caf50' }} />
                      ) : (
                        <ErrorIcon style={{ color: '#f44336' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" color="textSecondary">
                        Configuração: {JSON.stringify(channel.config, null, 2)}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => {
                    setCurrentChannel(channel);
                    setChannelDialog(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Card>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          Templates de Query por Provider
        </Typography>

        {['newrelic', 'datadog', 'grafana'].map((provider) => (
          <Accordion key={provider}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {getProviderIcon(provider)} {provider.toUpperCase()} Templates
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {getQueryTemplates(provider).map((template, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {template.description}
                        </Typography>
                        <Paper variant="outlined" style={{ padding: 8, marginTop: 8 }}>
                          <pre style={{ fontSize: '12px', margin: 0 }}>
                            {template.query}
                          </pre>
                        </Paper>
                        <Button
                          size="small"
                          style={{ marginTop: 8 }}
                          onClick={() => {
                            setCurrentAlert({
                              ...currentAlert,
                              name: template.name,
                              description: template.description,
                              provider: provider as any,
                              query: template.query
                            });
                            setAlertDialog(true);
                          }}
                        >
                          Usar Template
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>

      {/* Dialog para criar/editar alerta */}
      <Dialog open={alertDialog} onClose={() => setAlertDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentAlert.id ? 'Editar Alerta' : 'Criar Novo Alerta'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Alerta"
                value={currentAlert.name || ''}
                onChange={(e) => setCurrentAlert({ ...currentAlert, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Provider</InputLabel>
                <Select
                  value={currentAlert.provider || 'newrelic'}
                  onChange={(e) => setCurrentAlert({ ...currentAlert, provider: e.target.value as any })}
                >
                  <MenuItem value="newrelic">New Relic</MenuItem>
                  <MenuItem value="datadog">Datadog</MenuItem>
                  <MenuItem value="grafana">Grafana</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={currentAlert.description || ''}
                onChange={(e) => setCurrentAlert({ ...currentAlert, description: e.target.value })}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Query/Condição"
                value={currentAlert.query || ''}
                onChange={(e) => setCurrentAlert({ ...currentAlert, query: e.target.value })}
                margin="normal"
                multiline
                rows={4}
                placeholder="Digite a query específica do provider selecionado..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Operador</InputLabel>
                <Select
                  value={currentAlert.condition?.operator || 'above'}
                  onChange={(e) => setCurrentAlert({
                    ...currentAlert,
                    condition: { ...currentAlert.condition!, operator: e.target.value as any }
                  })}
                >
                  <MenuItem value="above">Acima de</MenuItem>
                  <MenuItem value="below">Abaixo de</MenuItem>
                  <MenuItem value="equals">Igual a</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Threshold"
                type="number"
                value={currentAlert.condition?.threshold || 0}
                onChange={(e) => setCurrentAlert({
                  ...currentAlert,
                  condition: { ...currentAlert.condition!, threshold: parseFloat(e.target.value) }
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Severidade</InputLabel>
                <Select
                  value={currentAlert.severity || 'medium'}
                  onChange={(e) => setCurrentAlert({ ...currentAlert, severity: e.target.value as any })}
                >
                  <MenuItem value="low">Baixa</MenuItem>
                  <MenuItem value="medium">Média</MenuItem>
                  <MenuItem value="high">Alta</MenuItem>
                  <MenuItem value="critical">Crítica</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentAlert.enabled || false}
                    onChange={(e) => setCurrentAlert({ ...currentAlert, enabled: e.target.checked })}
                  />
                }
                label="Alerta Ativo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialog(false)}>Cancelar</Button>
          <Button onClick={createAlert} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}; 