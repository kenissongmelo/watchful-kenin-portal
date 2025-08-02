import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  Switch,
  FormControlLabel,
  Collapse,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Add,
  Delete,
  Edit,
  PlayArrow,
  Pause,
  ExpandMore,
  ExpandLess,
  Notifications,
  Settings,
  Search,
  Filter,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useApi } from '@backstage/core-plugin-api';
import { keninDutyApiRef } from '../api';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  header: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  headerTitle: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  headerSubtitle: {
    color: theme.palette.text.secondary,
  },
  sectionCard: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(3),
  },
  alertCard: {
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: theme.shadows[4],
    },
  },
  cardContent: {
    '& .MuiTypography-root': {
      color: theme.palette.text.primary,
    },
    '& .MuiTypography-body2': {
      color: theme.palette.text.secondary,
    },
  },
  filterSection: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 1000,
  },
  statusChip: {
    margin: theme.spacing(0.5),
  },
  expandButton: {
    transition: 'transform 0.3s ease',
  },
  expandedPanel: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1, 0),
  },
  queryField: {
    backgroundColor: theme.palette.background.paper,
    '& .MuiInputBase-root': {
      color: theme.palette.text.primary,
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
  },
  severityHigh: {
    borderLeft: `4px solid ${theme.palette.error.main}`,
  },
  severityMedium: {
    borderLeft: `4px solid ${theme.palette.warning.main}`,
  },
  severityLow: {
    borderLeft: `4px solid ${theme.palette.info.main}`,
  },
  severityCritical: {
    borderLeft: `4px solid ${theme.palette.error.dark}`,
  },
  providerChip: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    margin: theme.spacing(0.5),
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  listItem: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.palette.divider}`,
    '& .MuiListItemText-primary': {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    '& .MuiListItemText-secondary': {
      color: theme.palette.text.secondary,
    },
  },
}));

interface AlertRule {
  id: string;
  name: string;
  description: string;
  provider: string;
  providerAccountId: string;
  providerAccountName: string;
  query: string;
  condition: {
    operator: 'above' | 'below' | 'equals';
    threshold: number;
    timeWindow: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  status: 'active' | 'paused' | 'error';
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProviderAccount {
  id: string;
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana';
  enabled: boolean;
  status: 'active' | 'inactive' | 'error';
}

const queryTemplates = {
  newrelic: [
    {
      name: 'CPU Usage Alert',
      query: "SELECT average(cpuPercent) FROM SystemSample WHERE hostname LIKE '%{{service}}%'",
      description: 'Monitora uso de CPU por serviço'
    },
    {
      name: 'Memory Usage Alert',
      query: "SELECT average(memoryUsedBytes/memoryTotalBytes)*100 FROM SystemSample WHERE hostname LIKE '%{{service}}%'",
      description: 'Monitora uso de memória'
    },
    {
      name: 'Response Time Alert',
      query: "SELECT percentile(duration, 95) FROM Transaction WHERE appName = '{{service}}'",
      description: 'Monitora tempo de resposta da aplicação'
    }
  ],
  datadog: [
    {
      name: 'High CPU Usage',
      query: "avg:system.cpu.user{service:{{service}}}",
      description: 'Monitora uso de CPU do serviço'
    },
    {
      name: 'Memory Usage',
      query: "avg:system.mem.used{service:{{service}}}",
      description: 'Monitora uso de memória'
    },
    {
      name: 'Error Rate',
      query: "sum:trace.http.request.errors{service:{{service}}}",
      description: 'Monitora taxa de erro da aplicação'
    }
  ],
  grafana: [
    {
      name: 'Prometheus Service Up',
      query: "up{job=\"{{service}}\"} == 0",
      description: 'Verifica se o serviço está funcionando'
    },
    {
      name: 'HTTP 5xx Errors',
      query: "rate(http_requests_total{status=~\"5..\",service=\"{{service}}\"}[5m])",
      description: 'Monitora erros 5xx do serviço'
    },
    {
      name: 'Container Memory Usage',
      query: "container_memory_usage_bytes{name=\"{{service}}\"}",
      description: 'Monitora uso de memória do container'
    }
  ]
};

export const AlertsList = () => {
  const classes = useStyles();
  const api = useApi(keninDutyApiRef);
  
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [providerAccounts, setProviderAccounts] = useState<ProviderAccount[]>([]);
  const [expandedProvider, setExpandedProvider] = useState<string>('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertRule | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    providerAccountId: '',
    query: '',
    condition: {
      operator: 'above' as 'above' | 'below' | 'equals',
      threshold: 80,
      timeWindow: 300
    },
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [alertsData, accountsData] = await Promise.all([
        api.getAlerts(),
        api.getProviderAccounts()
      ]);
      
      // Mock alerts data with provider account integration
      const mockAlerts: AlertRule[] = [
        {
          id: '1',
          name: 'High CPU Usage - Payment API',
          description: 'Alerta quando CPU do payment-api excede 80%',
          provider: 'newrelic',
          providerAccountId: '1',
          providerAccountName: 'Produção New Relic',
          query: "SELECT average(cpuPercent) FROM SystemSample WHERE hostname LIKE '%payment%'",
          condition: { operator: 'above', threshold: 80, timeWindow: 300 },
          severity: 'high',
          enabled: true,
          status: 'active',
          lastTriggered: '2 hours ago',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Database Connections - User Service',
          description: 'Monitora pool de conexões do banco de dados',
          provider: 'datadog',
          providerAccountId: '2',
          providerAccountName: 'Staging Datadog',
          query: "avg:postgresql.connections{service:user-service}",
          condition: { operator: 'above', threshold: 90, timeWindow: 300 },
          severity: 'medium',
          enabled: false,
          status: 'paused',
          createdAt: '2024-01-10T15:30:00Z',
          updatedAt: '2024-01-10T15:30:00Z'
        },
        {
          id: '3',
          name: 'Grafana Service Health',
          description: 'Verifica se serviços estão funcionando',
          provider: 'grafana',
          providerAccountId: '3',
          providerAccountName: 'Development Grafana',
          query: "up{job=\"prometheus\"} == 0",
          condition: { operator: 'equals', threshold: 0, timeWindow: 60 },
          severity: 'critical',
          enabled: true,
          status: 'error',
          lastTriggered: '1 day ago',
          createdAt: '2024-01-08T09:15:00Z',
          updatedAt: '2024-01-08T09:15:00Z'
        }
      ];
      
      setAlerts(mockAlerts);
      setProviderAccounts(accountsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleExpandProvider = (provider: string) => {
    setExpandedProvider(expandedProvider === provider ? '' : provider);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = filterProvider === 'all' || alert.provider === filterProvider;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    
    return matchesSearch && matchesProvider && matchesStatus && matchesSeverity;
  });

  const getAlertsByProvider = (provider: string) => {
    return filteredAlerts.filter(alert => alert.provider === provider);
  };

  const handleCreateAlert = async () => {
    try {
      const selectedAccount = providerAccounts.find(acc => acc.id === formData.providerAccountId);
      if (!selectedAccount) return;

      const newAlert: AlertRule = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        provider: selectedAccount.type,
        providerAccountId: formData.providerAccountId,
        providerAccountName: selectedAccount.name,
        query: formData.query,
        condition: formData.condition,
        severity: formData.severity,
        enabled: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setAlerts(prev => [...prev, newAlert]);
      setOpenCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const handleEditAlert = async () => {
    if (!editingAlert) return;
    
    try {
      const selectedAccount = providerAccounts.find(acc => acc.id === formData.providerAccountId);
      if (!selectedAccount) return;

      const updatedAlert: AlertRule = {
        ...editingAlert,
        name: formData.name,
        description: formData.description,
        providerAccountId: formData.providerAccountId,
        providerAccountName: selectedAccount.name,
        query: formData.query,
        condition: formData.condition,
        severity: formData.severity,
        updatedAt: new Date().toISOString()
      };

      setAlerts(prev => prev.map(alert => 
        alert.id === editingAlert.id ? updatedAlert : alert
      ));
      setOpenEditDialog(false);
      setEditingAlert(null);
      resetForm();
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este alerta?')) {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const handleToggleAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            enabled: !alert.enabled,
            status: !alert.enabled ? 'active' : 'paused',
            updatedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      providerAccountId: '',
      query: '',
      condition: {
        operator: 'above',
        threshold: 80,
        timeWindow: 300
      },
      severity: 'medium'
    });
  };

  const openEditForm = (alert: AlertRule) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      description: alert.description,
      providerAccountId: alert.providerAccountId,
      query: alert.query,
      condition: alert.condition,
      severity: alert.severity
    });
    setOpenEditDialog(true);
  };

  const applyTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      query: template.query,
      name: prev.name || template.name,
      description: prev.description || template.description
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return classes.severityLow;
      case 'paused': return classes.severityMedium;
      case 'error': return classes.severityHigh;
      default: return '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return classes.severityLow;
      case 'medium': return classes.severityMedium;
      case 'high': return classes.severityHigh;
      case 'critical': return classes.severityCritical;
      default: return '';
    }
  };

  const renderAlertDialog = (isEdit: boolean) => (
    <Dialog open={isEdit ? openEditDialog : openCreateDialog} onClose={() => isEdit ? setOpenEditDialog(false) : setOpenCreateDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        🚨 {isEdit ? 'Editar' : 'Criar'} Alerta
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nome do Alerta"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Conta do Provider</InputLabel>
              <Select
                value={formData.providerAccountId}
                onChange={(e) => setFormData(prev => ({ ...prev, providerAccountId: e.target.value as string }))}
              >
                {providerAccounts.filter(acc => acc.enabled).map(account => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} ({account.type.toUpperCase()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Severidade</InputLabel>
              <Select
                value={formData.severity}
                onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
              >
                <MenuItem value="low">🟢 Baixa</MenuItem>
                <MenuItem value="medium">🟡 Média</MenuItem>
                <MenuItem value="high">🟠 Alta</MenuItem>
                <MenuItem value="critical">🔴 Crítica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {formData.providerAccountId && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  📋 Templates de Query
                </Typography>
                <Box display="flex" flexWrap="wrap" style={{ gap: '8px' }}>
                  {(() => {
                    const account = providerAccounts.find(acc => acc.id === formData.providerAccountId);
                    const templates = account ? queryTemplates[account.type] || [] : [];
                    return templates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        size="small"
                        onClick={() => applyTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ));
                  })()}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Query/NRQL"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.query}
                  onChange={(e) => setFormData(prev => ({ ...prev, query: e.target.value }))}
                  margin="normal"
                  placeholder="Digite sua query de monitoramento..."
                />
              </Grid>
            </>
          )}
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Operador</InputLabel>
              <Select
                value={formData.condition.operator}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  condition: { ...prev.condition, operator: e.target.value as any }
                }))}
              >
                <MenuItem value="above">Acima de</MenuItem>
                <MenuItem value="below">Abaixo de</MenuItem>
                <MenuItem value="equals">Igual a</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              label="Threshold"
              type="number"
              fullWidth
              value={formData.condition.threshold}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                condition: { ...prev.condition, threshold: Number(e.target.value) }
              }))}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              label="Janela de Tempo (seg)"
              type="number"
              fullWidth
              value={formData.condition.timeWindow}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                condition: { ...prev.condition, timeWindow: Number(e.target.value) }
              }))}
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => isEdit ? setOpenEditDialog(false) : setOpenCreateDialog(false)}>
          Cancelar
        </Button>
        <Button onClick={isEdit ? handleEditAlert : handleCreateAlert} variant="contained" color="primary">
          {isEdit ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderProviderSection = (provider: string) => {
    const providerAlerts = getAlertsByProvider(provider);
    const isExpanded = expandedProvider === provider;
    
    const providerNames = {
      newrelic: 'New Relic',
      datadog: 'Datadog', 
      grafana: 'Grafana'
    };
    
    const providerIcons = {
      newrelic: '🔥',
      datadog: '🐕',
      grafana: '📊'
    };

    return (
      <Card key={provider} className={classes.alertCard}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" style={{ fontSize: '1.5rem' }}>
                {providerIcons[provider as keyof typeof providerIcons]} {providerNames[provider as keyof typeof providerNames]}
              </Typography>
              <Chip
                label={`${providerAlerts.length} alerta${providerAlerts.length !== 1 ? 's' : ''}`}
                color={providerAlerts.length > 0 ? 'primary' : 'default'}
                size="small"
                style={{ marginLeft: 8 }}
              />
            </Box>
            <IconButton onClick={() => handleExpandProvider(provider)}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={isExpanded}>
            {providerAlerts.length === 0 ? (
              <Alert severity="info">
                Nenhum alerta configurado para {providerNames[provider as keyof typeof providerNames]}.
              </Alert>
            ) : (
              <List>
                {providerAlerts.map((alert) => (
                  <ListItem key={alert.id} className={classes.listItem}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                              {alert.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Conta: {alert.providerAccountName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
                              {alert.description}
                            </Typography>
                          </Box>
                                                     <Box display="flex" alignItems="center" style={{ gap: '8px' }}>
                            <Chip
                              label={alert.status}
                              className={getStatusColor(alert.status)}
                              size="small"
                            />
                            <Chip
                              label={alert.severity}
                              color={getSeverityColor(alert.severity) as any}
                              size="small"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={alert.enabled}
                                  onChange={() => handleToggleAlert(alert.id)}
                                  color="primary"
                                />
                              }
                              label="Ativo"
                            />
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" style={{ backgroundColor: '#f5f5f5', padding: 8, borderRadius: 4, fontFamily: 'monospace' }}>
                            {alert.query}
                          </Typography>
                          <Box mt={1} display="flex" justifyContent="space-between">
                            <Typography variant="caption" color="textSecondary">
                              Criado: {new Date(alert.createdAt).toLocaleDateString('pt-BR')}
                            </Typography>
                            {alert.lastTriggered && (
                              <Typography variant="caption" color="textSecondary">
                                Último disparo: {alert.lastTriggered}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => openEditForm(alert)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteAlert(alert.id)} color="secondary">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 700, fontSize: '2.5rem' }}>
          🚨 Gerenciamento de Alertas
        </Typography>
        <Typography variant="h6" style={{ opacity: 0.9, fontWeight: 300 }}>
          Configure alertas integrados com suas contas de monitoramento
        </Typography>
      </Box>
      
      <Alert severity="info" style={{ marginBottom: 24 }}>
        <strong>🔗 Integração:</strong> Os alertas agora são vinculados às contas configuradas. 
        Configure suas contas na aba Configurações primeiro.
      </Alert>

      {/* Filtros */}
      <Card className={classes.filterSection}>
        <Typography variant="h6" gutterBottom>
          🔍 Filtros e Busca
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Buscar alertas"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search style={{ marginRight: 8, color: '#666' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value as string)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="newrelic">New Relic</MenuItem>
                <MenuItem value="datadog">Datadog</MenuItem>
                <MenuItem value="grafana">Grafana</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as string)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="paused">Pausado</MenuItem>
                <MenuItem value="error">Erro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Severidade</InputLabel>
              <Select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value as string)}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="low">Baixa</MenuItem>
                <MenuItem value="medium">Média</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
                <MenuItem value="critical">Crítica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              fullWidth
              style={{ height: '56px' }}
              onClick={() => {
                setSearchTerm('');
                setFilterProvider('all');
                setFilterStatus('all');
                setFilterSeverity('all');
              }}
            >
              Limpar
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Lista de Alertas por Provider */}
      <Card className={classes.sectionCard}>
        <Box className={classes.sectionHeader}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            📊 Alertas por Provider
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.9, marginTop: 8 }}>
            {filteredAlerts.length} alerta{filteredAlerts.length !== 1 ? 's' : ''} encontrado{filteredAlerts.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <CardContent style={{ padding: '24px' }}>
          {['newrelic', 'datadog', 'grafana'].map(provider => renderProviderSection(provider))}
        </CardContent>
      </Card>

      {/* Botão de Adicionar */}
      <Fab
        className={classes.addButton}
        onClick={() => setOpenCreateDialog(true)}
        disabled={providerAccounts.filter(acc => acc.enabled).length === 0}
      >
        <Add />
      </Fab>

      {/* Dialogs */}
      {renderAlertDialog(false)}
      {renderAlertDialog(true)}
    </Box>
  );
};

