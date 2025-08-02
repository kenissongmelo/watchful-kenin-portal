import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Divider,
  IconButton,
  Collapse,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Visibility,
  VisibilityOff,
  ExpandMore,
  ExpandLess,
  Add,
  Delete,
  Edit,
  Save,
  Cancel,
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
  providerCard: {
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
  configField: {
    marginBottom: theme.spacing(2),
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
    },
  },
  saveButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  helpText: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginTop: theme.spacing(1),
  },
  toggleButton: {
    margin: theme.spacing(1, 0),
  },
  iconButton: {
    margin: theme.spacing(0.5),
  },
  inputAdornment: {
    color: theme.palette.text.secondary,
  },
  secretField: {
    '& .MuiInputBase-input': {
      fontFamily: 'monospace',
    },
  },
  alert: {
    marginBottom: theme.spacing(2),
    '& .MuiAlert-message': {
      color: theme.palette.text.primary,
    },
  },
  accountsList: {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  accountItem: {
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
  statusChip: {
    margin: theme.spacing(0.5),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
  dialogContent: {
    backgroundColor: theme.palette.background.default,
    '& .MuiFormControl-root': {
      marginBottom: theme.spacing(2),
    },
  },
  testButton: {
    marginLeft: theme.spacing(1),
  },
  providerTypeChip: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    margin: theme.spacing(0.5),
  },
}));

interface ProviderAccount {
  id: string;
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana';
  enabled: boolean;
  config: Record<string, any>;
  createdAt: string;
  lastTested?: string;
  status: 'active' | 'inactive' | 'error';
}

interface ProviderTemplate {
  type: 'newrelic' | 'datadog' | 'grafana';
  name: string;
  icon: string;
  fields: {
    [key: string]: {
      label: string;
      type: 'text' | 'password' | 'url';
      required: boolean;
      placeholder: string;
      help: string;
    };
  };
}

const providerTemplates: ProviderTemplate[] = [
  {
    type: 'newrelic',
    name: 'New Relic',
    icon: '🔥',
    fields: {
      apiKey: {
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'NRAK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        help: 'Encontre em: New Relic One → Account settings → API keys'
      },
      accountId: {
        label: 'Account ID',
        type: 'text',
        required: true,
        placeholder: '1234567890',
        help: 'ID da sua conta New Relic'
      },
      region: {
        label: 'Região',
        type: 'text',
        required: false,
        placeholder: 'US',
        help: 'Região do datacenter (US ou EU)'
      }
    }
  },
  {
    type: 'datadog',
    name: 'Datadog',
    icon: '🐕',
    fields: {
      apiKey: {
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        help: 'Encontre em: Organization Settings → API Keys'
      },
      appKey: {
        label: 'Application Key',
        type: 'password',
        required: true,
        placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        help: 'Encontre em: Organization Settings → Application Keys'
      },
      site: {
        label: 'Site',
        type: 'text',
        required: false,
        placeholder: 'datadoghq.com',
        help: 'Site do Datadog (ex: datadoghq.com, datadoghq.eu)'
      }
    }
  },
  {
    type: 'grafana',
    name: 'Grafana',
    icon: '📊',
    fields: {
      url: {
        label: 'URL',
        type: 'url',
        required: true,
        placeholder: 'https://your-grafana.com',
        help: 'URL completa da sua instância Grafana'
      },
      apiKey: {
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'glsa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        help: 'Encontre em: Configuration → API Keys'
      },
      orgId: {
        label: 'Organization ID',
        type: 'text',
        required: false,
        placeholder: '1',
        help: 'ID da organização (opcional, padrão: 1)'
      }
    }
  }
];

export const KeninDutyConfigPage = () => {
  const classes = useStyles();
  const api = useApi(keninDutyApiRef);
  
  const [accounts, setAccounts] = useState<ProviderAccount[]>([]);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [expandedProvider, setExpandedProvider] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProviderType, setSelectedProviderType] = useState<'newrelic' | 'datadog' | 'grafana'>('newrelic');
  const [editingAccount, setEditingAccount] = useState<ProviderAccount | null>(null);
  const [formData, setFormData] = useState<{[key: string]: string}>({});

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    twilio: {
      enabled: false,
      accountSid: '',
      authToken: '',
      fromNumber: '',
    },
    webhook: {
      enabled: false,
      url: '',
      method: 'POST',
      headers: '',
    }
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const loadedAccounts = await api.getProviderAccounts();
      setAccounts(loadedAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const togglePasswordVisibility = (fieldKey: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleExpandProvider = (providerId: string) => {
    setExpandedProvider(expandedProvider === providerId ? '' : providerId);
  };

  const handleAddAccount = () => {
    const template = providerTemplates.find(p => p.type === selectedProviderType);
    if (template) {
      const defaultData: {[key: string]: string} = {};
      Object.keys(template.fields).forEach(field => {
        defaultData[field] = '';
      });
      setFormData(defaultData);
      setOpenAddDialog(true);
    }
  };

  const handleEditAccount = (account: ProviderAccount) => {
    setEditingAccount(account);
    setFormData(account.config);
    setOpenEditDialog(true);
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await api.deleteProviderAccount(accountId);
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleSaveAccount = async () => {
    try {
      setSaveStatus('saving');
      
      if (editingAccount) {
        // Update existing account
        const updatedAccount = await api.updateProviderAccount(editingAccount.id, {
          name: formData.name,
          config: formData
        });
        setAccounts(prev => prev.map(acc => 
          acc.id === editingAccount.id ? updatedAccount : acc
        ));
        setOpenEditDialog(false);
      } else {
        // Add new account
        const { name, ...config } = formData;
        const newAccount = await api.createProviderAccount({
          name: name || `${providerTemplates.find(p => p.type === selectedProviderType)?.name} Account`,
          type: selectedProviderType,
          config
        });
        setAccounts(prev => [...prev, newAccount]);
        setOpenAddDialog(false);
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAccountsByType = (type: string) => {
    return accounts.filter(acc => acc.type === type);
  };

  const renderAccountDialog = (isEdit: boolean) => {
    const template = providerTemplates.find(p => p.type === (isEdit ? editingAccount?.type : selectedProviderType));
    if (!template) return null;

    return (
      <Dialog open={isEdit ? openEditDialog : openAddDialog} onClose={() => isEdit ? setOpenEditDialog(false) : setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {template.icon} {isEdit ? 'Editar' : 'Adicionar'} Conta {template.name}
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Nome da Conta"
              fullWidth
              value={formData.name || ''}
              onChange={(e) => handleFormDataChange('name', e.target.value)}
              placeholder={`Ex: ${template.name} Produção`}
              margin="normal"
            />
          </Box>
          
          {Object.entries(template.fields).map(([fieldKey, field]) => (
            <Box key={fieldKey} mb={2}>
              <TextField
                label={field.label}
                fullWidth
                required={field.required}
                type={field.type === 'password' && !showPasswords[fieldKey] ? 'password' : 'text'}
                value={formData[fieldKey] || ''}
                onChange={(e) => handleFormDataChange(fieldKey, e.target.value)}
                placeholder={field.placeholder}
                margin="normal"
                InputProps={field.type === 'password' ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility(fieldKey)}>
                        {showPasswords[fieldKey] ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                } : undefined}
              />
              <Typography variant="caption" className={classes.helpText}>
                {field.help}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => isEdit ? setOpenEditDialog(false) : setOpenAddDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveAccount} variant="contained" color="primary">
            {isEdit ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderProviderSection = (template: ProviderTemplate) => {
    const providerAccounts = getAccountsByType(template.type);
    const isExpanded = expandedProvider === template.type;

    return (
      <Card key={template.type} className={classes.providerCard}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" style={{ fontSize: '1.5rem' }}>
                {template.icon} {template.name}
              </Typography>
              <Chip
                label={`${providerAccounts.length} conta${providerAccounts.length !== 1 ? 's' : ''}`}
                color={providerAccounts.length > 0 ? 'primary' : 'default'}
                size="small"
                className={classes.statusChip}
              />
            </Box>
            <Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Add />}
                onClick={() => {
                  setSelectedProviderType(template.type);
                  handleAddAccount();
                }}
                style={{ marginRight: 8 }}
              >
                Adicionar Conta
              </Button>
              <IconButton onClick={() => handleExpandProvider(template.type)}>
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={isExpanded}>
            {providerAccounts.length === 0 ? (
              <Alert severity="info">
                Nenhuma conta configurada para {template.name}.
              </Alert>
            ) : (
              <List>
                {providerAccounts.map((account) => (
                  <ListItem key={account.id} className={classes.accountItem}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                            {account.name}
                          </Typography>
                          <Chip
                            label={account.status}
                            color={account.status === 'active' ? 'primary' : 'default'}
                            size="small"
                            style={{ marginLeft: 8 }}
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={account.enabled}
                                onChange={async (e) => {
                                  try {
                                    const updatedAccount = await api.updateProviderAccount(account.id, {
                                      enabled: e.target.checked
                                    });
                                    setAccounts(prev => prev.map(acc => 
                                      acc.id === account.id ? updatedAccount : acc
                                    ));
                                  } catch (error) {
                                    console.error('Error updating account status:', error);
                                  }
                                }}
                                color="primary"
                              />
                            }
                            label="Ativo"
                            style={{ marginLeft: 16 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body2" color="textSecondary">
                            Criado em: {new Date(account.createdAt).toLocaleDateString('pt-BR')}
                          </Typography>
                          {account.lastTested && (
                            <Typography variant="body2" color="textSecondary">
                              Último teste: {new Date(account.lastTested).toLocaleDateString('pt-BR')}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        onClick={async () => {
                          try {
                            await api.testProviderConnection(account.id);
                            await loadAccounts(); // Reload to get updated status
                          } catch (error) {
                            console.error('Test connection failed:', error);
                          }
                        }}
                        style={{ marginRight: 8 }}
                      >
                        Testar
                      </Button>
                      <IconButton onClick={() => handleEditAccount(account)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteAccount(account.id)} color="secondary">
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
          ⚙️ Configurações do KeninDuty
        </Typography>
        <Typography variant="h6" style={{ opacity: 0.9, fontWeight: 300 }}>
          Configure suas integrações e notificações
        </Typography>
      </Box>
      
      <Alert severity="info" style={{ marginBottom: 24 }}>
        <strong>📋 Múltiplas Contas:</strong> Agora você pode configurar múltiplas contas para cada provider. 
        Isso permite monitorar diferentes ambientes ou organizações separadamente.
      </Alert>

      <Card className={classes.sectionCard}>
        <Box className={classes.sectionHeader}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            🔌 Integrações de Monitoramento
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.9, marginTop: 8 }}>
            Configure múltiplas contas para cada provider de monitoramento
          </Typography>
        </Box>
        <CardContent style={{ padding: '24px' }}>
          {providerTemplates.map(template => renderProviderSection(template))}
        </CardContent>
      </Card>

      <Card className={classes.sectionCard}>
        <Box className={classes.sectionHeader}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            📱 Configurações de Notificação
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.9, marginTop: 8 }}>
            Configure como e para onde enviar notificações
          </Typography>
        </Box>
        <CardContent style={{ padding: '24px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card style={{ padding: 16, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                  📞 SMS via Twilio
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.twilio.enabled}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        twilio: { ...prev.twilio, enabled: e.target.checked }
                      }))}
                      color="primary"
                    />
                  }
                  label="Habilitar SMS"
                />
                {notificationSettings.twilio.enabled && (
                  <Box mt={2}>
                    <TextField
                      label="Account SID"
                      fullWidth
                      margin="normal"
                      value={notificationSettings.twilio.accountSid}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        twilio: { ...prev.twilio, accountSid: e.target.value }
                      }))}
                    />
                    <TextField
                      label="Auth Token"
                      type="password"
                      fullWidth
                      margin="normal"
                      value={notificationSettings.twilio.authToken}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        twilio: { ...prev.twilio, authToken: e.target.value }
                      }))}
                    />
                    <TextField
                      label="Número de Origem"
                      fullWidth
                      margin="normal"
                      value={notificationSettings.twilio.fromNumber}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        twilio: { ...prev.twilio, fromNumber: e.target.value }
                      }))}
                    />
                  </Box>
                )}
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card style={{ padding: 16, backgroundColor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                  🔗 Webhook Personalizado
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.webhook.enabled}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        webhook: { ...prev.webhook, enabled: e.target.checked }
                      }))}
                      color="primary"
                    />
                  }
                  label="Habilitar Webhook"
                />
                {notificationSettings.webhook.enabled && (
                  <Box mt={2}>
                    <TextField
                      label="URL do Webhook"
                      fullWidth
                      margin="normal"
                      value={notificationSettings.webhook.url}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        webhook: { ...prev.webhook, url: e.target.value }
                      }))}
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Método HTTP</InputLabel>
                      <Select
                        value={notificationSettings.webhook.method}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          webhook: { ...prev.webhook, method: e.target.value as string }
                        }))}
                      >
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          size="large"
          className={classes.saveButton}
          startIcon={<Save />}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Salvando...' : 
           saveStatus === 'saved' ? 'Salvo!' : 
           saveStatus === 'error' ? 'Erro ao salvar' : 
           'Salvar Configurações'}
        </Button>
      </Box>

      {renderAccountDialog(false)}
      {renderAccountDialog(true)}
    </Box>
  );
}; 