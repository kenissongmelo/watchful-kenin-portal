import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert as MuiAlert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Avatar,
  Badge,
  Tooltip,
  Fab,
  useTheme,
  alpha,
  Pagination,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  History as HistoryIcon,
  PhoneDisabled as PhoneDisabledIcon,
  Block as BlockIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { keninDutyService } from '../services/KeninDutyService';
import { AlertCard } from './AlertCard';
import {
  GlassCard,
  ModernButton,
  ModernIconButton,
  SectionTitle,
  Subtitle,
  BodyText,
  CaptionText,
  EmptyState
} from './DesignSystem';

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  escalationPolicy: EscalationPolicy;
}

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'primary' | 'secondary' | 'escalation';
}

interface EscalationPolicy {
  retryCount: number;
  retryIntervalMinutes: number;
  escalationDelayMinutes: number;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  message?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  provider: 'datadog' | 'newrelic' | 'grafana';
  providerAlertId: string;
  teamId: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  attended?: boolean;
  attempts?: Array<{
    status: string;
    memberId?: string;
    memberName?: string;
    timestamp: string;
    notes?: string;
    callId?: string;
    duration?: number;
  }>;
  nrql?: string;
  threshold?: string;
  condition?: string;
  service?: string;
  hostname?: string;
}

interface CallAttempt {
  id: string;
  alertId: string;
  teamMemberId: string;
  status: 'pending' | 'in-progress' | 'answered' | 'no-answer' | 'failed';
  attemptNumber: number;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  notes?: string;
}

interface Stats {
  activeAlerts: number;
  totalTeams: number;
  totalMembers: number;
  totalAlerts: number;
  totalCallAttempts: number;
}

const API_BASE = 'http://localhost:7007/api/keninduty';

export const KeninDutyPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [teams, setTeams] = useState<Team[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [callAttempts, setCallAttempts] = useState<CallAttempt[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Dialog states
  const [createAlertDialog, setCreateAlertDialog] = useState(false);
  const [alertHistoryDialog, setAlertHistoryDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alertForm, setAlertForm] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    provider: 'datadog' as 'datadog' | 'newrelic' | 'grafana',
    teamId: '',
    query: ''
  });

  // Pagination states
  const [alertsPage, setAlertsPage] = useState(0);
  const [alertsRowsPerPage, setAlertsRowsPerPage] = useState(6);

  // Filter states
  const [alertSearchTerm, setAlertSearchTerm] = useState('');
  const [alertStatusFilter, setAlertStatusFilter] = useState('all');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState('all');
  const [alertProviderFilter, setAlertProviderFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, alertsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/teams`),
        fetch(`${API_BASE}/alerts`),
        fetch(`${API_BASE}/stats`)
      ]);

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        console.log('Teams loaded:', teamsData); // Debug log
        setTeams(teamsData);
      }
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
        
        // Extrair todas as tentativas dos alertas para a aba de chamadas
        const allAttempts = alertsData.flatMap(alert => 
          (alert.attempts || []).map(attempt => ({
            id: `${alert.id}-${attempt.timestamp}`,
            alertId: alert.id,
            teamMemberId: attempt.memberId || '',
            status: attempt.status,
            attemptNumber: (alert.attempts || []).indexOf(attempt) + 1,
            startedAt: attempt.timestamp,
            endedAt: attempt.timestamp,
            duration: attempt.duration,
            notes: attempt.notes
          }))
        );
        setCallAttempts(allAttempts);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || statsData);
      }
    } catch (error) {
      showSnackbar('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Filtered alerts logic
  const filteredAlerts = alerts.filter(alert => {
    // Função para obter o texto de busca baseado no provider
    const getSearchText = () => {
      switch (alert.provider) {
        case 'newrelic':
          return (alert.message || alert.description || alert.title || '').toLowerCase();
        case 'datadog':
          return (alert.title || alert.description || '').toLowerCase();
        case 'grafana':
          return (alert.description || alert.title || '').toLowerCase();
        default:
          return (alert.description || alert.title || '').toLowerCase();
      }
    };

    const searchText = getSearchText();
    const matchesSearch = alertSearchTerm === '' || 
      searchText.includes(alertSearchTerm.toLowerCase()) ||
      alert.provider?.toLowerCase().includes(alertSearchTerm.toLowerCase());
    
    const matchesStatus = alertStatusFilter === 'all' || alert.status === alertStatusFilter;
    const matchesSeverity = alertSeverityFilter === 'all' || alert.severity === alertSeverityFilter;
    const matchesProvider = alertProviderFilter === 'all' || alert.provider === alertProviderFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity && matchesProvider;
  });

  // Reset filters
  const resetAlertFilters = () => {
    setAlertSearchTerm('');
    setAlertStatusFilter('all');
    setAlertSeverityFilter('all');
    setAlertProviderFilter('all');
    setAlertsPage(0); // Reset to first page
  };

  // Glassmorphism styles
  const glassmorphismStyle = {
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
  };

  const handleCreateAlert = async () => {
    if (!alertForm.title || !alertForm.description || !alertForm.teamId) {
      showSnackbar('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    try {
      // Preparar payload baseado no provider
      let payload: any = {
        severity: alertForm.severity,
        teamId: alertForm.teamId,
        query: alertForm.query,
      };

      // Adicionar campos específicos por provider
      switch (alertForm.provider) {
        case 'newrelic':
          payload = {
            ...payload,
            title: `newrelic-${Date.now()}`, // ID técnico
            description: alertForm.description, // Descrição geral
            message: alertForm.title, // Título legível para New Relic
            nrqlQuery: alertForm.query
          };
          break;
        case 'datadog':
          payload = {
            ...payload,
            title: alertForm.title, // Título legível para Datadog
            description: alertForm.description // Descrição adicional
          };
          break;
        case 'grafana':
          payload = {
            ...payload,
            title: `grafana-${Date.now()}`, // ID técnico
            description: alertForm.title // Título legível para Grafana
          };
          break;
      }

      const response = await fetch(`${API_BASE}/providers/${alertForm.provider}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        showSnackbar(
          `Alerta criado com sucesso! Provider ID: ${result.providerAlertId}. Team ID incluído em owners: ${result.owners?.[0] || 'N/A'}`, 
          'success'
        );
        setCreateAlertDialog(false);
        setAlertForm({
          title: '',
          description: '',
          severity: 'medium',
          provider: 'datadog',
          teamId: '',
          query: ''
        });
        fetchData();
      } else {
        const error = await response.json();
        showSnackbar(`Erro ao criar alerta: ${error.error}`, 'error');
      }
    } catch (error) {
      showSnackbar('Erro ao criar alerta', 'error');
    }
  };

  const handleShowAlertHistory = (alert: Alert) => {
    setSelectedAlert(alert);
    setAlertHistoryDialog(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'error';
      case 'resolved': return 'success';
      case 'acknowledged': return 'warning';
      default: return 'default';
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'answered': return 'success';
      case 'no-answer': return 'warning';
      case 'failed': return 'error';
      case 'in-progress': return 'info';
      default: return 'default';
    }
  };

  const getCallStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'answered': return <CheckCircleIcon />;
      case 'no-answer': return <CancelIcon />;
      case 'failed': return <ErrorIcon />;
      case 'in-progress': return <PhoneIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: 'background.default',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            mb: 1
          }}
        >
          🚀 KeninDuty
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 300
          }}
        >
          Sistema de Gerenciamento de On-Call e Alertas
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <Badge badgeContent={stats?.activeAlerts || 0} color="error">
              <WarningIcon sx={{ fontSize: 40, color: '#f44336' }} />
            </Badge>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {stats?.activeAlerts || 0}
            </Typography>
            <BodyText>
              Alertas Ativos
            </BodyText>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <GroupIcon sx={{ fontSize: 40, color: '#667eea' }} />
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {stats?.totalTeams || 0}
            </Typography>
            <BodyText>
              Times
            </BodyText>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, color: '#764ba2' }} />
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {stats?.totalMembers || 0}
            </Typography>
            <BodyText>
              Membros
            </BodyText>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ height: '100%', textAlign: 'center' }}>
            <PhoneIcon sx={{ fontSize: 40, color: '#4caf50' }} />
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {stats?.totalCallAttempts || 0}
            </Typography>
            <BodyText>
              Chamadas
            </BodyText>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionTitle icon="📊">
            Alertas & Times
          </SectionTitle>
          <ModernButton
            startIcon={<AddIcon />}
            onClick={() => setCreateAlertDialog(true)}
          >
            Criar Alerta
          </ModernButton>
        </Box>

        {/* Filtros */}
        <GlassCard sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Buscar alertas"
              variant="outlined"
              size="small"
              placeholder="Título, descrição ou provider..."
              value={alertSearchTerm}
              onChange={(e) => setAlertSearchTerm(e.target.value)}
              sx={{ minWidth: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select 
                label="Status" 
                value={alertStatusFilter}
                onChange={(e) => setAlertStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Ativos</MenuItem>
                <MenuItem value="acknowledged">Reconhecidos</MenuItem>
                <MenuItem value="resolved">Resolvidos</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Severidade</InputLabel>
              <Select 
                label="Severidade" 
                value={alertSeverityFilter}
                onChange={(e) => setAlertSeverityFilter(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="critical">Crítica</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
                <MenuItem value="medium">Média</MenuItem>
                <MenuItem value="low">Baixa</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Provider</InputLabel>
              <Select 
                label="Provider" 
                value={alertProviderFilter}
                onChange={(e) => setAlertProviderFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="newrelic">New Relic</MenuItem>
                <MenuItem value="datadog">Datadog</MenuItem>
                <MenuItem value="grafana">Grafana</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              onClick={resetAlertFilters}
              startIcon={<ClearIcon />}
            >
              Limpar
            </Button>
          </Box>
        </GlassCard>

        {/* Grid de Alertas */}
        {filteredAlerts.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {filteredAlerts
                .slice(alertsPage * alertsRowsPerPage, alertsPage * alertsRowsPerPage + alertsRowsPerPage)
                .map((alert) => (
                <Grid item xs={12} md={6} lg={4} key={alert.id}>
                  <AlertCard
                    alert={alert}
                    teamName={teams.find(t => t.id === alert.teamId)?.name}
                    onShowHistory={handleShowAlertHistory}
                    onCopyTeamId={(teamId) => {
                      navigator.clipboard.writeText(teamId);
                      showSnackbar('Team ID copiado!', 'success');
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            
            {/* Paginação */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredAlerts.length / alertsRowsPerPage)}
                page={alertsPage + 1}
                onChange={(event, page) => setAlertsPage(page - 1)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {alertsPage * alertsRowsPerPage + 1} a {Math.min((alertsPage + 1) * alertsRowsPerPage, filteredAlerts.length)} de {filteredAlerts.length} alertas
              </Typography>
            </Box>
          </>
        ) : (
          <EmptyState
            icon="🚨"
            title="Nenhum alerta encontrado"
            description="Crie seu primeiro alerta clicando no botão 'Criar Alerta' ou aguarde alertas dos providers"
            action={
              <ModernButton
                startIcon={<AddIcon />}
                onClick={() => setCreateAlertDialog(true)}
              >
                Criar Primeiro Alerta
              </ModernButton>
            }
          />
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* Alert History Dialog */}
      <Dialog
        open={alertHistoryDialog}
        onClose={() => setAlertHistoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          📋 Histórico do Alerta
          {selectedAlert && (
            <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'normal' }}>
              {selectedAlert.provider === 'newrelic' 
                ? (selectedAlert.message || selectedAlert.description || 'Alerta New Relic')
                : selectedAlert.provider === 'datadog'
                ? (selectedAlert.title || selectedAlert.description || 'Alerta Datadog')
                : (selectedAlert.description || selectedAlert.title || 'Alerta sem descrição')
              }
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              {/* Alert Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Informações do Alerta
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>ID:</strong> {selectedAlert.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Provider ID:</strong> {selectedAlert.providerAlertId}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {selectedAlert.status}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Severidade:</strong> {selectedAlert.severity}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Mensagem:</strong> {
                          selectedAlert.provider === 'newrelic' 
                            ? (selectedAlert.message || selectedAlert.description || 'N/A')
                            : selectedAlert.provider === 'datadog'
                            ? (selectedAlert.title || selectedAlert.description || 'N/A')
                            : (selectedAlert.description || selectedAlert.title || 'N/A')
                        }
                      </Typography>
                      <Typography variant="body2">
                        <strong>Criado:</strong> {new Date(selectedAlert.createdAt).toLocaleString('pt-BR')}
                      </Typography>
                      {selectedAlert.acknowledgedAt && (
                        <Typography variant="body2">
                          <strong>Reconhecido:</strong> {new Date(selectedAlert.acknowledgedAt).toLocaleString('pt-BR')}
                        </Typography>
                      )}
                      {selectedAlert.resolvedAt && (
                        <Typography variant="body2">
                          <strong>Resolvido:</strong> {new Date(selectedAlert.resolvedAt).toLocaleString('pt-BR')}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>Provider:</strong> {selectedAlert.provider}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Call Attempts */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Tentativas de Chamada
                  </Typography>
                  {selectedAlert.attempts && selectedAlert.attempts.length > 0 ? (
                    <List>
                      {selectedAlert.attempts.map((attempt, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {getCallStatusIcon(attempt.status)}
                                  <Typography variant="body1">
                                    Tentativa {index + 1} - {attempt.status}
                                  </Typography>
                                  {attempt.memberName && (
                                    <Chip 
                                      label={attempt.memberName} 
                                      size="small" 
                                      color="primary" 
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2">
                                    <strong>Horário:</strong> {new Date(attempt.timestamp).toLocaleString('pt-BR')}
                                  </Typography>
                                  {attempt.duration && (
                                    <Typography variant="body2">
                                      <strong>Duração:</strong> {Math.round(attempt.duration / 1000)}s
                                    </Typography>
                                  )}
                                  {attempt.notes && (
                                    <Typography variant="body2">
                                      <strong>Notas:</strong> {attempt.notes}
                                    </Typography>
                                  )}
                                  {attempt.callId && (
                                    <Typography variant="body2">
                                      <strong>Call ID:</strong> {attempt.callId}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < selectedAlert.attempts!.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      Nenhuma tentativa de chamada registrada para este alerta.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertHistoryDialog(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 