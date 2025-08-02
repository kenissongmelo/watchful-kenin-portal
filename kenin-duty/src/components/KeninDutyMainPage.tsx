import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  FormControlLabel,
} from '@material-ui/core';
import {
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import { useApi, errorApiRef, alertApiRef } from '@backstage/core-plugin-api';
import { keninDutyApiRef } from '../api';
import { KeninDutyConfigPage } from './KeninDutyConfigPage';
import { AlertsList } from './AlertsList';
import { CallsList } from './CallsList';
import type { 
  Team, 
  TeamMember, 
  DashboardStats, 
  Alert as KeninAlert,
  CallAttempt,
  OnCallInfo,
  CreateTeamRequest,
  CreateAlertRequest,
} from '../api';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
  statCard: {
    textAlign: 'center',
    padding: theme.spacing(2),
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
    },
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  alertCard: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
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
  teamCard: {
    marginBottom: theme.spacing(3),
    position: 'relative',
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  },
  onCallBadge: {
    position: 'absolute',
    top: theme.spacing(1.5),
    right: theme.spacing(1.5),
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    fontWeight: 600,
    borderRadius: 20,
    zIndex: 1,
  },
  membersList: {
    maxHeight: 200,
    overflow: 'auto',
  },
  tabContent: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  statusChip: {
    marginRight: theme.spacing(1),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  headerBox: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  headerTitle: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  headerSubtitle: {
    color: theme.palette.text.secondary,
  },
  cardContent: {
    '& .MuiTypography-root': {
      color: theme.palette.text.primary,
    },
    '& .MuiTypography-body2': {
      color: theme.palette.text.secondary,
    },
  },
  teamHeaderContent: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  teamTitle: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: '1.25rem',
    marginBottom: theme.spacing(0.5),
  },
  teamDescription: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  policySection: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(2, 0),
    border: `1px solid ${theme.palette.divider}`,
  },
  policyTitle: {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  policyChip: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    margin: theme.spacing(0.5),
  },
  memberItem: {
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
  tabsContainer: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& .MuiTab-root': {
      color: theme.palette.text.secondary,
      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const KeninDutyMainPage = () => {
  const classes = useStyles();
  const api = useApi(keninDutyApiRef);
  const errorApi = useApi(errorApiRef);
  const alertApi = useApi(alertApiRef);

  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [alerts, setAlerts] = useState<KeninAlert[]>([]);
  const [callAttempts, setCallAttempts] = useState<CallAttempt[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Dialog states
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [openEditMemberDialog, setOpenEditMemberDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [newTeam, setNewTeam] = useState<CreateTeamRequest>({
    name: '',
    description: '',
    members: [],
    retryPolicy: {
      maxRetries: 3,
      retryInterval: 5,
      escalationDelay: 10,
      enabled: true,
    },
  });
  const [newAlert, setNewAlert] = useState<CreateAlertRequest>({
    teamId: '',
    title: '',
    description: '',
    severity: 'medium',
    provider: 'newrelic',
    nrql: '',
  });
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    status: 'available' as const,
  });
  const [editMemberForm, setEditMemberForm] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    status: 'available' as 'available' | 'busy' | 'offline',
  });

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, alertsData, attemptsData, statsData] = await Promise.all([
        api.getTeams(),
        api.getAlerts(),
        api.getCallAttempts(),
        api.getDashboardStats('24h'),
      ]);

      setTeams(teamsData);
      setAlerts(alertsData);
      setCallAttempts(attemptsData);
      setStats(statsData);
    } catch (error) {
      errorApi.post(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateTeam = async () => {
    try {
      if (!newTeam.name || newTeam.members.length === 0) {
        alertApi.post({ message: 'Nome do time e pelo menos um membro são obrigatórios', severity: 'error' });
        return;
      }

      if (editingTeam) {
        // For updating a team, we'll convert CreateTeamRequest to Partial<Team>
        const updateData: Partial<Team> = {
          name: newTeam.name,
          description: newTeam.description,
          retryPolicy: newTeam.retryPolicy,
        };
        await api.updateTeam(editingTeam.id, updateData);
        
        // Update retry policy separately if it changed
        if (newTeam.retryPolicy) {
          await api.updateRetryPolicy(editingTeam.id, newTeam.retryPolicy);
        }
        
        alertApi.post({ message: 'Time atualizado com sucesso!', severity: 'success' });
      } else {
        await api.createTeam(newTeam);
        alertApi.post({ message: 'Time criado com sucesso!', severity: 'success' });
      }

      setOpenTeamDialog(false);
      setEditingTeam(null);
      setNewTeam({ 
        name: '', 
        description: '', 
        members: [],
        retryPolicy: {
          maxRetries: 3,
          retryInterval: 5,
          escalationDelay: 10,
          enabled: true,
        },
      });
      await loadData();
    } catch (error) {
      errorApi.post(error as Error);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.')) {
      try {
        await api.deleteTeam(teamId);
        await loadData();
        alertApi.post({ message: 'Time removido com sucesso!', severity: 'success' });
      } catch (error) {
        errorApi.post(error as Error);
      }
    }
  };



  const handleCreateAlert = async () => {
    try {
      if (!newAlert.teamId || !newAlert.title || !newAlert.description || !newAlert.provider) {
        alertApi.post({ message: 'Time, título, descrição e provider são obrigatórios', severity: 'error' });
        return;
      }

      if ((newAlert.provider === 'newrelic' || newAlert.provider === 'datadog' || newAlert.provider === 'grafana') && !newAlert.nrql) {
        alertApi.post({ message: 'Query/NRQL é obrigatória para o provider selecionado', severity: 'error' });
        return;
      }

      await api.createAlert(newAlert);
      setOpenAlertDialog(false);
      setNewAlert({ 
        teamId: '', 
        title: '', 
        description: '', 
        severity: 'medium', 
        provider: 'newrelic',
        nrql: '',
      });
      await loadData();
      alertApi.post({ message: `Alerta criado no ${newAlert.provider.toUpperCase()} e chamada iniciada!`, severity: 'success' });
    } catch (error) {
      errorApi.post(error as Error);
    }
  };

  const handleAddMember = async () => {
    try {
      if (!selectedTeam || !newMember.name || !newMember.phone || !newMember.email) {
        alertApi.post({ message: 'Todos os campos são obrigatórios', severity: 'error' });
        return;
      }

      await api.addMember(selectedTeam.id, newMember);
      setOpenMemberDialog(false);
      setNewMember({ name: '', phone: '', email: '', role: '', status: 'available' });
      await loadData();
      alertApi.post({ message: 'Membro adicionado com sucesso!', severity: 'success' });
    } catch (error) {
      errorApi.post(error as Error);
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    try {
      await api.removeMember(teamId, memberId);
      await loadData();
      alertApi.post({ message: 'Membro removido com sucesso!', severity: 'success' });
    } catch (error) {
      errorApi.post(error as Error);
    }
  };

  const handleUpdateMemberStatus = async (teamId: string, memberId: string, status: 'available' | 'busy' | 'offline') => {
    try {
      await api.updateMemberStatus(teamId, memberId, status);
      await loadData();
      alertApi.post({ message: 'Status atualizado com sucesso!', severity: 'success' });
    } catch (error) {
      errorApi.post(error as Error);
    }
  };

  const handleEditMember = (team: Team, member: TeamMember) => {
    setSelectedTeam(team);
    setEditingMember(member);
    setEditMemberForm({
      name: member.name,
      phone: member.phone,
      email: member.email,
      role: member.role,
      status: member.status || 'available',
    });
    setOpenEditMemberDialog(true);
  };

    const handleUpdateMember = async () => {
    try {
      if (!selectedTeam || !editingMember) return;
      
      // Validar campos obrigatórios
      if (!editMemberForm.name || !editMemberForm.phone || !editMemberForm.email) {
        alertApi.post({ 
          message: 'Nome, telefone e email são obrigatórios', 
          severity: 'error' 
        });
        return;
      }
      
      // Atualizar todos os dados do membro
      await api.updateMember(selectedTeam.id, editingMember.id, {
        name: editMemberForm.name,
        phone: editMemberForm.phone,
        email: editMemberForm.email,
        role: editMemberForm.role,
        status: editMemberForm.status,
      });
      
      setOpenEditMemberDialog(false);
      setEditingMember(null);
      setEditMemberForm({ name: '', phone: '', email: '', role: '', status: 'available' });
      await loadData();
      alertApi.post({ message: 'Dados do membro atualizados com sucesso!', severity: 'success' });
    } catch (error) {
      errorApi.post(error as Error);
    }
  };

  const handleSetOnCall = async (teamId: string, memberId: string) => {
    try {
      await api.setOnCall(teamId, memberId);
      await loadData();
      alertApi.post({ message: 'Plantão definido com sucesso!', severity: 'success' });
    } catch (error) {
      errorApi.post(error as Error);
    }
  };

  const addMemberToTeamForm = () => {
    if (!newMember.name || !newMember.phone || !newMember.email) {
      alertApi.post({ message: 'Nome, telefone e email são obrigatórios', severity: 'error' });
      return;
    }

    const memberToAdd = {
      ...newMember,
      // Don't add ID here since CreateTeamRequest expects members without ID
    };

    setNewTeam({
      ...newTeam,
      members: [...newTeam.members, memberToAdd],
    });

    setNewMember({ name: '', phone: '', email: '', role: '', status: 'available' });
  };

  const removeMemberFromTeamForm = (index: number) => {
    const updatedMembers = newTeam.members.filter((_, i) => i !== index);
    setNewTeam({ ...newTeam, members: updatedMembers });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available': return 'primary';
      case 'busy': return 'secondary';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return classes.severityHigh;
      case 'medium':
        return classes.severityMedium;
      case 'low':
        return classes.severityLow;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className={classes.root}>
      <Box className={classes.headerBox}>
        <Typography variant="h4" className={classes.headerTitle}>
          KeninDuty
        </Typography>
        <Typography variant="subtitle1" className={classes.headerSubtitle}>
          Sistema de Gestão de Plantões e Alertas
        </Typography>
      </Box>

      <Paper className={classes.tabsContainer}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" icon={<DashboardIcon />} />
          <Tab label="Times" icon={<GroupIcon />} />
          <Tab label="Alertas" icon={<WarningIcon />} />
          <Tab label="Chamadas" icon={<PhoneIcon />} />
          <Tab label="Configurações" icon={<SettingsIcon />} />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <div className={classes.tabContent}>
            <Box className={classes.headerBox}>
              <Typography variant="h4" className={classes.headerTitle}>
                📊 Dashboard
              </Typography>
              <Typography variant="body1" className={classes.headerSubtitle}>
                Visão geral das operações e estatísticas
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={loadData}
                style={{ marginTop: 16 }}
              >
                Atualizar Dados
              </Button>
            </Box>

            {stats && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card className={classes.statCard}>
                    <CardContent className={classes.cardContent}>
                      <GroupIcon color="primary" fontSize="large" />
                      <Typography className={classes.statNumber}>
                        {stats.totalTeams}
                      </Typography>
                      <Typography variant="body2">Times</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Card className={classes.statCard}>
                    <CardContent className={classes.cardContent}>
                      <PersonIcon color="secondary" fontSize="large" />
                      <Typography className={classes.statNumber}>
                        {stats.totalMembers}
                      </Typography>
                      <Typography variant="body2">Membros</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card className={classes.statCard}>
                    <CardContent className={classes.cardContent}>
                      <WarningIcon color="error" fontSize="large" />
                      <Typography className={classes.statNumber}>
                        {stats.activeAlerts}
                      </Typography>
                      <Typography variant="body2">Alertas Ativos</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card className={classes.statCard}>
                    <CardContent className={classes.cardContent}>
                      <PhoneIcon color="primary" fontSize="large" />
                      <Typography className={classes.statNumber}>
                        {stats.successfulCalls}
                      </Typography>
                      <Typography variant="body2">Chamadas Atendidas</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card className={classes.statCard}>
                    <CardContent className={classes.cardContent}>
                      <Typography variant="h6" gutterBottom className={classes.headerTitle}>
                        📋 Alertas Recentes
                      </Typography>
                      {alerts.slice(0, 5).map((alert) => (
                        <Card key={alert.id} className={`${classes.alertCard} ${getSeverityClass(alert.severity)}`}>
                          <CardContent className={classes.cardContent}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body1" style={{ fontWeight: 'bold', color: 'inherit' }}>
                                  {alert.message}
                                </Typography>
                                <Typography variant="body2" className={classes.headerSubtitle}>
                                  Time: {teams.find(t => t.id === alert.teamId)?.name || alert.teamId}
                                </Typography>
                              </Box>
                              <Box>
                                <Chip
                                  label={alert.severity}
                                  size="small"
                                  color={alert.severity === 'critical' ? 'secondary' : 'primary'}
                                  variant="outlined"
                                />
                                <Chip
                                  label={alert.status}
                                  size="small"
                                  style={{ marginLeft: 8 }}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </div>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <div className={classes.tabContent}>
            <Box className={classes.headerBox}>
              <Typography variant="h4" className={classes.headerTitle}>
                👥 Gerenciamento de Times
              </Typography>
              <Typography variant="body1" className={classes.headerSubtitle}>
                Gerencie suas equipes e políticas de escalação
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setOpenTeamDialog(true)}
                style={{ marginTop: 16 }}
              >
                Criar Time
              </Button>
            </Box>

            <Grid container spacing={3}>
              {teams.map((team) => (
                <Grid item xs={12} md={6} lg={4} key={team.id}>
                  <Card className={classes.teamCard}>
                    {team.oncall && (
                      <Chip
                        label="🟢 Em Plantão"
                        size="small"
                        className={classes.onCallBadge}
                      />
                    )}
                    <CardContent className={classes.teamHeaderContent}>
                      <Typography variant="h5" gutterBottom className={classes.teamTitle}>
                        {team.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom className={classes.teamDescription}>
                        {team.description}
                      </Typography>
                      
                      {/* Retry Policy Info */}
                      {team.retryPolicy && (
                        <Box className={classes.policySection}>
                          <Typography variant="subtitle1" gutterBottom className={classes.policyTitle}>
                            📋 Política de Tentativas
                          </Typography>
                          <Box display="flex" flexWrap="wrap">
                            <Chip
                              size="medium"
                              label={`🔄 ${team.retryPolicy.maxRetries} tentativas`}
                              className={classes.policyChip}
                            />
                            <Chip
                              size="medium"
                              label={`⏱️ ${team.retryPolicy.retryInterval}min intervalo`}
                              color="secondary"
                              className={classes.policyChip}
                            />
                            <Chip
                              size="medium"
                              label={team.retryPolicy.enabled ? '✅ Ativo' : '❌ Inativo'}
                              color={team.retryPolicy.enabled ? 'primary' : 'default'}
                              className={classes.policyChip}
                            />
                          </Box>
                        </Box>
                      )}
                      
                      <Typography variant="subtitle1" gutterBottom className={classes.policyTitle}>
                        👥 Membros ({team.members.length})
                      </Typography>
                      <List dense className={classes.membersList}>
                        {team.members.map((member) => (
                          <ListItem key={member.id} className={classes.memberItem}>
                            <ListItemText
                              primary={member.name}
                              secondary={`${member.role} - ${member.phone}`}
                            />
                            <ListItemSecondaryAction>
                              <Box display="flex" alignItems="center">
                                <Chip
                                  label={member.status}
                                  size="small"
                                  color={getStatusColor(member.status) as any}
                                  className={classes.statusChip}
                                  style={{ marginRight: 8 }}
                                />
                                {team.oncall === member.id && (
                                  <Chip
                                    label="Plantão"
                                    size="small"
                                    color="primary"
                                    style={{ marginRight: 8 }}
                                  />
                                )}
                                <Tooltip title="Editar membro">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditMember(team, member)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Remover membro">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveMember(team.id, member.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                {team.oncall !== member.id && member.status === 'available' && (
                                  <Tooltip title="Definir como plantão">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleSetOnCall(team.id, member.id)}
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions style={{ padding: '16px 24px', backgroundColor: '#f8f9fa' }}>
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setSelectedTeam(team);
                          setOpenMemberDialog(true);
                        }}
                        style={{
                          borderRadius: 20,
                          fontWeight: 600,
                          textTransform: 'none',
                          borderColor: '#2196f3',
                          color: '#2196f3',
                          marginRight: 8,
                        }}
                      >
                        Adicionar Membro
                      </Button>
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setEditingTeam(team);
                          setNewTeam({
                            name: team.name,
                            description: team.description || '',
                            members: team.members.map(m => ({ 
                              name: m.name, 
                              phone: m.phone, 
                              email: m.email, 
                              role: m.role,
                              status: m.status || 'available'
                            })),
                            retryPolicy: team.retryPolicy || {
                              maxRetries: 3,
                              retryInterval: 5,
                              escalationDelay: 10,
                              enabled: true,
                            },
                          });
                          setOpenTeamDialog(true);
                        }}
                        style={{
                          borderRadius: 20,
                          fontWeight: 600,
                          textTransform: 'none',
                          background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                          marginRight: 8,
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteTeam(team.id)}
                        style={{
                          borderRadius: 20,
                          fontWeight: 600,
                          textTransform: 'none',
                          borderColor: '#f44336',
                          color: '#f44336',
                        }}
                      >
                        Excluir
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <AlertsList />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <CallsList />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <KeninDutyConfigPage />
        </TabPanel>
      </Paper>

      {/* Dialog para criar/editar time */}
      <Dialog open={openTeamDialog} onClose={() => setOpenTeamDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTeam ? 'Editar Time' : 'Criar Novo Time'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome do Time"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            className={classes.formField}
          />
          <TextField
            fullWidth
            label="Descrição"
            value={newTeam.description}
            onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
            className={classes.formField}
            multiline
            rows={2}
          />
          <Typography variant="subtitle1" gutterBottom>
            Membros:
          </Typography>
          {newTeam.members.map((member, index) => (
            <Box key={`member-${index}`} display="flex" alignItems="center" mb={1}>
              <TextField
                fullWidth
                label={`Membro ${index + 1}`}
                value={member.name}
                onChange={(e) => {
                  const updatedMembers = newTeam.members.map((m, i) =>
                    i === index ? { ...m, name: e.target.value } : m
                  );
                  setNewTeam({ ...newTeam, members: updatedMembers });
                }}
                className={classes.formField}
              />
              <TextField
                fullWidth
                label="Telefone"
                value={member.phone}
                onChange={(e) => {
                  const updatedMembers = newTeam.members.map((m, i) =>
                    i === index ? { ...m, phone: e.target.value } : m
                  );
                  setNewTeam({ ...newTeam, members: updatedMembers });
                }}
                className={classes.formField}
              />
              <TextField
                fullWidth
                label="Email"
                value={member.email}
                onChange={(e) => {
                  const updatedMembers = newTeam.members.map((m, i) =>
                    i === index ? { ...m, email: e.target.value } : m
                  );
                  setNewTeam({ ...newTeam, members: updatedMembers });
                }}
                className={classes.formField}
              />
              <TextField
                fullWidth
                label="Função"
                value={member.role}
                onChange={(e) => {
                  const updatedMembers = newTeam.members.map((m, i) =>
                    i === index ? { ...m, role: e.target.value } : m
                  );
                  setNewTeam({ ...newTeam, members: updatedMembers });
                }}
                className={classes.formField}
              />
              <FormControl fullWidth className={classes.formField}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={member.status}
                  onChange={(e) => {
                    const updatedMembers = newTeam.members.map((m, i) =>
                      i === index ? { ...m, status: e.target.value as 'available' | 'busy' | 'offline' } : m
                    );
                    setNewTeam({ ...newTeam, members: updatedMembers });
                  }}
                >
                  <MenuItem value="available">Disponível</MenuItem>
                  <MenuItem value="busy">Ocupado</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={() => removeMemberFromTeamForm(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addMemberToTeamForm}
            fullWidth
            className={classes.actionButton}
          >
            Adicionar Membro
          </Button>

          {/* Retry Policy Configuration */}
          <Typography variant="subtitle1" gutterBottom style={{ marginTop: 24 }}>
            Política de Tentativas:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Máximo de Tentativas"
                value={newTeam.retryPolicy?.maxRetries || 3}
                onChange={(e) => setNewTeam({
                  ...newTeam,
                  retryPolicy: {
                    ...newTeam.retryPolicy!,
                    maxRetries: parseInt(e.target.value) || 3,
                  }
                })}
                inputProps={{ min: 1, max: 10 }}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Intervalo (minutos)"
                value={newTeam.retryPolicy?.retryInterval || 5}
                onChange={(e) => setNewTeam({
                  ...newTeam,
                  retryPolicy: {
                    ...newTeam.retryPolicy!,
                    retryInterval: parseInt(e.target.value) || 5,
                  }
                })}
                inputProps={{ min: 1, max: 60 }}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Delay Escalação (min)"
                value={newTeam.retryPolicy?.escalationDelay || 10}
                onChange={(e) => setNewTeam({
                  ...newTeam,
                  retryPolicy: {
                    ...newTeam.retryPolicy!,
                    escalationDelay: parseInt(e.target.value) || 10,
                  }
                })}
                inputProps={{ min: 1, max: 120 }}
                className={classes.formField}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newTeam.retryPolicy?.enabled || true}
                      onChange={(e) => setNewTeam({
                        ...newTeam,
                        retryPolicy: {
                          ...newTeam.retryPolicy!,
                          enabled: e.target.checked,
                        }
                      })}
                    />
                  }
                  label="Política de Tentativas Ativa"
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeamDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateTeam} color="primary" variant="contained">
            {editingTeam ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para criar alerta */}
      <Dialog open={openAlertDialog} onClose={() => setOpenAlertDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Criar Novo Alerta</DialogTitle>
        <DialogContent>
          <FormControl fullWidth className={classes.formField}>
            <InputLabel>Provider</InputLabel>
            <Select
              value={newAlert.provider}
              onChange={(e) => setNewAlert({ ...newAlert, provider: e.target.value as 'newrelic' | 'datadog' | 'grafana' })}
            >
              <MenuItem value="newrelic">🔴 New Relic</MenuItem>
              <MenuItem value="datadog">🟣 Datadog</MenuItem>
              <MenuItem value="grafana">🟠 Grafana</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth className={classes.formField}>
            <InputLabel>Time</InputLabel>
            <Select
              value={newAlert.teamId}
              onChange={(e) => setNewAlert({ ...newAlert, teamId: e.target.value as string })}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Título do Alerta"
            value={newAlert.title}
            onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
            className={classes.formField}
            required
          />
          
          <TextField
            fullWidth
            label="Descrição"
            value={newAlert.description}
            onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
            className={classes.formField}
            multiline
            rows={2}
          />
          
          {newAlert.provider === 'newrelic' && (
            <TextField
              fullWidth
              label="NRQL Query"
              value={newAlert.nrql || ''}
              onChange={(e) => setNewAlert({ ...newAlert, nrql: e.target.value })}
              className={classes.formField}
              multiline
              rows={3}
              placeholder="SELECT * FROM Transaction WHERE responseTime > 2"
              required
            />
          )}
          
          {newAlert.provider === 'datadog' && (
            <TextField
              fullWidth
              label="Query Datadog"
              value={newAlert.nrql || ''}
              onChange={(e) => setNewAlert({ ...newAlert, nrql: e.target.value })}
              className={classes.formField}
              multiline
              rows={3}
              placeholder="avg(last_5m):avg:system.cpu.user{*} > 0.8"
              required
            />
          )}
          
          {newAlert.provider === 'grafana' && (
            <TextField
              fullWidth
              label="Query/Expression Grafana"
              value={newAlert.nrql || ''}
              onChange={(e) => setNewAlert({ ...newAlert, nrql: e.target.value })}
              className={classes.formField}
              multiline
              rows={3}
              placeholder="up == 0"
              required
            />
          )}
          
          <FormControl fullWidth className={classes.formField}>
            <InputLabel>Severidade</InputLabel>
            <Select
              value={newAlert.severity}
              onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as any })}
            >
              <MenuItem value="low">Baixa</MenuItem>
              <MenuItem value="medium">Média</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
              <MenuItem value="critical">Crítica</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlertDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateAlert} color="secondary" variant="contained">
            Criar e Disparar Chamada
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para adicionar membro */}
      <Dialog open={openMemberDialog} onClose={() => setOpenMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Membro ao Time</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className={classes.formField}
          />
          <TextField
            fullWidth
            label="Telefone"
            value={newMember.phone}
            onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
            className={classes.formField}
          />
          <TextField
            fullWidth
            label="Email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            className={classes.formField}
          />
          <TextField
            fullWidth
            label="Função"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            className={classes.formField}
          />
          <FormControl fullWidth className={classes.formField}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newMember.status}
              onChange={(e) => setNewMember({ ...newMember, status: e.target.value as any })}
            >
              <MenuItem value="available">Disponível</MenuItem>
              <MenuItem value="busy">Ocupado</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddMember} color="primary" variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar membro */}
      <Dialog open={openEditMemberDialog} onClose={() => setOpenEditMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Membro</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={editMemberForm.name}
            onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
            className={classes.formField}
          />
          <TextField
            fullWidth
            label="Telefone"
            value={editMemberForm.phone}
            onChange={(e) => setEditMemberForm({ ...editMemberForm, phone: e.target.value })}
            className={classes.formField}
          />
          <TextField
            fullWidth
            label="Email"
            value={editMemberForm.email}
            onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
            className={classes.formField}
          />
          <TextField
            fullWidth
            label="Função"
            value={editMemberForm.role}
            onChange={(e) => setEditMemberForm({ ...editMemberForm, role: e.target.value })}
            className={classes.formField}
          />
          <FormControl fullWidth className={classes.formField}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editMemberForm.status}
              onChange={(e) => setEditMemberForm({ ...editMemberForm, status: e.target.value as any })}
            >
              <MenuItem value="available">Disponível</MenuItem>
              <MenuItem value="busy">Ocupado</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditMemberDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateMember} color="primary" variant="contained">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}; 