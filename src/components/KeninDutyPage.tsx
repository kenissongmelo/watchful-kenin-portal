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
  Block as BlockIcon
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
  const [createTeamDialog, setCreateTeamDialog] = useState(false);
  const [editTeamDialog, setEditTeamDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
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
  const [teamForm, setTeamForm] = useState({
    name: '',
    members: [{ name: '', phone: '', email: '', role: 'primary' as 'primary' | 'secondary' | 'escalation' }],
    escalationPolicy: {
      retryCount: 3,
      retryIntervalMinutes: 5,
      escalationDelayMinutes: 15
    }
  });

  // Pagination states
  const [alertsPage, setAlertsPage] = useState(0);
  const [alertsRowsPerPage, setAlertsRowsPerPage] = useState(6);
  const [teamsPage, setTeamsPage] = useState(0);
  const [teamsRowsPerPage, setTeamsRowsPerPage] = useState(4);

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
      const response = await fetch(`${API_BASE}/providers/${alertForm.provider}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: alertForm.title,
          description: alertForm.description,
          severity: alertForm.severity,
          teamId: alertForm.teamId,
          query: alertForm.query,
          ...(alertForm.provider === 'newrelic' && { nrqlQuery: alertForm.query })
        }),
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

  const handleCreateTeam = async () => {
    try {
      const response = await fetch(`${API_BASE}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showSnackbar('Time criado com sucesso!', 'success');
          setCreateTeamDialog(false);
          setTeamForm({
            name: '',
            members: [{ name: '', phone: '', email: '', role: 'primary' }],
            escalationPolicy: { retryCount: 3, retryIntervalMinutes: 5, escalationDelayMinutes: 15 }
          });
          fetchData();
        } else {
          showSnackbar(result.error || 'Erro ao criar time', 'error');
        }
      } else {
        showSnackbar('Erro ao criar time', 'error');
      }
    } catch (error) {
      showSnackbar('Erro ao criar time', 'error');
    }
  };

  const handleEditTeam = (team: Team) => {
    // Verifica se o time ainda existe na lista atual
    const currentTeam = teams.find(t => t.id === team.id);
    if (!currentTeam) {
      showSnackbar('Time não encontrado. Pode ter sido excluído.', 'error');
      fetchData(); // Recarrega os dados
      return;
    }

    setEditingTeam(currentTeam);
    setTeamForm({
      name: currentTeam.name,
      members: currentTeam.members.map(member => ({
        name: member.name,
        phone: member.phone,
        email: member.email,
        role: member.role
      })),
      escalationPolicy: currentTeam.escalationPolicy
    });
    setEditTeamDialog(true);
  };

  const handleUpdateTeam = async () => {
    if (!editingTeam) return;
    
    try {
      const response = await fetch(`${API_BASE}/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showSnackbar('Time atualizado com sucesso!', 'success');
          setEditTeamDialog(false);
          setEditingTeam(null);
          setTeamForm({
            name: '',
            members: [{ name: '', phone: '', email: '', role: 'primary' }],
            escalationPolicy: { retryCount: 3, retryIntervalMinutes: 5, escalationDelayMinutes: 15 }
          });
          fetchData();
        } else {
          showSnackbar(result.error || 'Erro ao atualizar time', 'error');
        }
      } else if (response.status === 404) {
        showSnackbar('Time não encontrado. Pode ter sido excluído.', 'error');
        setEditTeamDialog(false);
        setEditingTeam(null);
        fetchData(); // Recarrega os dados para atualizar a lista
      } else {
        const errorData = await response.json().catch(() => ({}));
        showSnackbar(errorData.error || `Erro ${response.status}: ${response.statusText}`, 'error');
      }
    } catch (error) {
      console.error('Erro ao atualizar time:', error);
      showSnackbar('Erro de conexão ao atualizar time', 'error');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este time?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/teams/${teamId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showSnackbar('Time excluído com sucesso!', 'success');
          fetchData();
        } else {
          showSnackbar(result.error || 'Erro ao excluir time', 'error');
        }
      } else if (response.status === 404) {
        showSnackbar('Time não encontrado. Pode ter sido excluído anteriormente.', 'error');
        fetchData(); // Recarrega os dados para atualizar a lista
      } else {
        const errorData = await response.json().catch(() => ({}));
        showSnackbar(errorData.error || `Erro ${response.status}: ${response.statusText}`, 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir time:', error);
      showSnackbar('Erro de conexão ao excluir time', 'error');
    }
  };

  const handleRetryCall = async (alertId: string) => {
    try {
      const response = await fetch(`${API_BASE}/calls/${alertId}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        showSnackbar('Tentativa de chamada iniciada', 'success');
        fetchData();
      } else {
        showSnackbar('Erro ao tentar chamada', 'error');
      }
    } catch (error) {
      showSnackbar('Erro ao tentar chamada', 'error');
    }
  };

  const handleUpdateAlertStatus = async (alertId: string, status: 'acknowledged' | 'resolved') => {
    try {
      const response = await fetch(`${API_BASE}/alerts/${alertId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        showSnackbar(`Alerta ${status === 'acknowledged' ? 'reconhecido' : 'resolvido'}`, 'success');
        fetchData();
      } else {
        showSnackbar('Erro ao atualizar status', 'error');
      }
    } catch (error) {
      showSnackbar('Erro ao atualizar status', 'error');
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
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Buscar alertas"
              variant="outlined"
              size="small"
              placeholder="Título, descrição ou provider..."
              sx={{ minWidth: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="all">
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Ativos</MenuItem>
                <MenuItem value="acknowledged">Reconhecidos</MenuItem>
                <MenuItem value="resolved">Resolvidos</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Severidade</InputLabel>
              <Select label="Severidade" defaultValue="all">
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="critical">Crítica</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
                <MenuItem value="medium">Média</MenuItem>
                <MenuItem value="low">Baixa</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Provider</InputLabel>
              <Select label="Provider" defaultValue="all">
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="newrelic">New Relic</MenuItem>
                <MenuItem value="datadog">Datadog</MenuItem>
                <MenuItem value="grafana">Grafana</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </GlassCard>

        {/* Grid de Alertas */}
        {alerts.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {alerts
                .slice(alertsPage * alertsRowsPerPage, alertsPage * alertsRowsPerPage + alertsRowsPerPage)
                .map((alert) => (
                <Grid item xs={12} md={6} lg={4} key={alert.id}>
                  <AlertCard
                    alert={alert}
                    teamName={teams.find(t => t.id === alert.teamId)?.name}
                    onShowHistory={handleShowAlertHistory}
                    onUpdateStatus={handleUpdateAlertStatus}
                    onRetryCall={handleRetryCall}
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
                count={Math.ceil(alerts.length / alertsRowsPerPage)}
                page={alertsPage + 1}
                onChange={(event, page) => setAlertsPage(page - 1)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {alertsPage * alertsRowsPerPage + 1} a {Math.min((alertsPage + 1) * alertsRowsPerPage, alerts.length)} de {alerts.length} alertas
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

      {/* Seção de Times */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionTitle icon="👥">
            Times
          </SectionTitle>
          <ModernButton
            startIcon={<AddIcon />}
            onClick={() => setCreateTeamDialog(true)}
          >
            Criar Time
          </ModernButton>
        </Box>

        {teams.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {teams
                .slice(teamsPage * teamsRowsPerPage, teamsPage * teamsRowsPerPage + teamsRowsPerPage)
                .map((team) => (
                <Grid item xs={12} md={6} key={team.id}>
                  <GlassCard>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {team.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <ModernIconButton
                            size="small"
                            onClick={() => handleEditTeam(team)}
                          >
                            <EditIcon />
                          </ModernIconButton>
                          <ModernIconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            <DeleteIcon />
                          </ModernIconButton>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {team.members.length} membros
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Membros:
                        </Typography>
                        <Stack spacing={1}>
                          {team.members.slice(0, 3).map((member, index) => (
                            <Box key={member.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label={member.role} 
                                size="small" 
                                color={member.role === 'primary' ? 'primary' : 'secondary'}
                                variant="outlined"
                              />
                              <Typography variant="body2">
                                {member.name}
                              </Typography>
                            </Box>
                          ))}
                          {team.members.length > 3 && (
                            <Typography variant="body2" color="text.secondary">
                              +{team.members.length - 3} mais...
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Política de Escalonamento:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Retry: {team.escalationPolicy.retryCount}x | 
                          Intervalo: {team.escalationPolicy.retryIntervalMinutes}min | 
                          Delay: {team.escalationPolicy.escalationDelayMinutes}min
                        </Typography>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
            
            {/* Paginação para Times */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(teams.length / teamsRowsPerPage)}
                page={teamsPage + 1}
                onChange={(event, page) => setTeamsPage(page - 1)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Mostrando {teamsPage * teamsRowsPerPage + 1} a {Math.min((teamsPage + 1) * teamsRowsPerPage, teams.length)} de {teams.length} times
              </Typography>
            </Box>
          </>
        ) : (
          <EmptyState
            icon="👥"
            title="Nenhum time encontrado"
            description="Crie seu primeiro time clicando no botão 'Criar Time'"
            action={
              <ModernButton
                startIcon={<AddIcon />}
                onClick={() => setCreateTeamDialog(true)}
              >
                Criar Primeiro Time
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
              {selectedAlert.title}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              {/* Alert Info */}
              <GlassCard sx={{ mb: 3 }}>
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
              </GlassCard>

              {/* Call Attempts */}
              <GlassCard>
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
              </GlassCard>
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