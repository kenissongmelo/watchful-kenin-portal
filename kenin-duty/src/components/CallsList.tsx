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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ExpandMore,
  ExpandLess,
  Phone,
  Refresh,
  Search,
  Schedule,
  CheckCircle,
  Cancel,
  Replay,
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
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  callCard: {
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
  statusChip: {
    margin: theme.spacing(0.5),
  },
  expandButton: {
    transition: 'transform 0.3s ease',
  },
  expandedContent: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
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
  statusAnswered: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  statusNoAnswer: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  statusBusy: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
  statusFailed: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  statusPending: {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.common.white,
  },
  retryBadge: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontSize: '0.75rem',
    margin: theme.spacing(0.5),
  },
  teamChip: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    margin: theme.spacing(0.5),
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
}));

interface CallAttempt {
  id: string;
  memberName: string;
  teamId: string;
  teamName: string;
  phone: string;
  status: 'answered' | 'no_answer' | 'busy' | 'failed' | 'pending';
  duration?: number;
  retryCount: number;
  timestamp: string;
  alertId?: string;
  notes?: string;
}

interface Team {
  id: string;
  name: string;
}

export const CallsList = () => {
  const classes = useStyles();
  const api = useApi(keninDutyApiRef);
  
  const [callAttempts, setCallAttempts] = useState<CallAttempt[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<string>('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [callsData, teamsData] = await Promise.all([
        api.getCallAttempts(),
        api.getTeams()
      ]);
      
      // Mock call attempts data with better integration
      const mockCalls: CallAttempt[] = [
        {
          id: '1',
          memberName: 'João Silva',
          teamId: 'team-1751955256027',
          teamName: 'DevOps Team',
          phone: '+5511999999999',
          status: 'answered',
          duration: 45,
          retryCount: 0,
          timestamp: '2024-01-15T14:30:00Z',
          alertId: 'alert-1',
          notes: 'Incidente resolvido com sucesso'
        },
        {
          id: '2',
          memberName: 'Maria Santos',
          teamId: 'team-1751955256027',
          teamName: 'DevOps Team',
          phone: '+5511888888888',
          status: 'no_answer',
          retryCount: 2,
          timestamp: '2024-01-15T13:15:00Z',
          alertId: 'alert-2',
          notes: 'Tentativa de contato durante horário de almoço'
        },
        {
          id: '3',
          memberName: 'Carlos Oliveira',
          teamId: 'team-1751955256027',
          teamName: 'DevOps Team',
          phone: '+5511777777777',
          status: 'busy',
          retryCount: 1,
          timestamp: '2024-01-15T12:00:00Z',
          alertId: 'alert-3',
        },
        {
          id: '4',
          memberName: 'Ana Costa',
          teamId: 'team-1751955256027',
          teamName: 'DevOps Team',
          phone: '+5511666666666',
          status: 'failed',
          retryCount: 3,
          timestamp: '2024-01-15T11:45:00Z',
          alertId: 'alert-4',
          notes: 'Falha na conectividade da operadora'
        },
        {
          id: '5',
          memberName: 'Pedro Ferreira',
          teamId: 'team-1751955256027',
          teamName: 'DevOps Team',
          phone: '+5511555555555',
          status: 'pending',
          retryCount: 0,
          timestamp: '2024-01-15T16:00:00Z',
          alertId: 'alert-5',
          notes: 'Chamada agendada para próxima tentativa'
        }
      ];
      
      setCallAttempts(mockCalls);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandTeam = (teamId: string) => {
    setExpandedTeam(expandedTeam === teamId ? '' : teamId);
  };

  const filteredCalls = callAttempts.filter(call => {
    const matchesSearch = call.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.phone.includes(searchTerm) ||
                         call.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === 'all' || call.teamId === filterTeam;
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const getCallsByTeam = (teamId: string) => {
    return filteredCalls.filter(call => call.teamId === teamId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return classes.statusAnswered;
      case 'no_answer':
      case 'busy': return classes.statusPending;
      case 'failed': return classes.statusFailed;
      case 'pending': return '';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered': return <CheckCircle />;
      case 'no_answer': return <Cancel />;
      case 'busy': return <Schedule />;
      case 'failed': return <Cancel />;
      case 'pending': return <Replay />;
      default: return <Phone />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'answered': return 'Atendida';
      case 'no_answer': return 'Não Atendeu';
      case 'busy': return 'Ocupado';
      case 'failed': return 'Falhou';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const renderTeamSection = (teamId: string, teamName: string) => {
    const teamCalls = getCallsByTeam(teamId);
    const isExpanded = expandedTeam === teamId;

    if (teamCalls.length === 0) return null;

    return (
      <Card key={teamId} className={classes.callCard}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" style={{ fontSize: '1.5rem' }}>
                👥 {teamName}
              </Typography>
              <Chip
                label={`${teamCalls.length} chamada${teamCalls.length !== 1 ? 's' : ''}`}
                color={teamCalls.length > 0 ? 'primary' : 'default'}
                size="small"
                style={{ marginLeft: 8 }}
              />
            </Box>
            <IconButton onClick={() => handleExpandTeam(teamId)}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={isExpanded}>
            <List>
              {teamCalls.map((call) => (
                <ListItem key={call.id} className={classes.listItem}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                            📞 {call.memberName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Telefone: {call.phone}
                          </Typography>
                          {call.notes && (
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: 4 }}>
                              💬 {call.notes}
                            </Typography>
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" style={{ gap: '8px' }}>
                          <Chip
                            icon={getStatusIcon(call.status)}
                            label={getStatusLabel(call.status)}
                            className={getStatusColor(call.status)}
                            size="small"
                          />
                          {call.retryCount > 0 && (
                            <Chip
                              label={`${call.retryCount + 1}ª tentativa`}
                              color="secondary"
                              size="small"
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box mt={1}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="caption" color="textSecondary">
                              <strong>Duração:</strong> {formatDuration(call.duration)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="caption" color="textSecondary">
                              <strong>Tentativas:</strong> {call.retryCount + 1}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" color="textSecondary">
                              <strong>Data:</strong> {new Date(call.timestamp).toLocaleString('pt-BR')}
                            </Typography>
                          </Grid>
                        </Grid>
                        {call.alertId && (
                          <Typography variant="caption" color="textSecondary" style={{ marginTop: 8, display: 'block' }}>
                            🚨 ID do Alerta: {call.alertId}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  // Get unique teams from calls
  const teamsWithCalls = Array.from(new Set(filteredCalls.map(call => call.teamId)))
    .map(teamId => {
      const call = filteredCalls.find(c => c.teamId === teamId);
      return { id: teamId, name: call?.teamName || 'Time Desconhecido' };
    });

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 700, fontSize: '2.5rem' }}>
          📞 Histórico de Chamadas
        </Typography>
        <Typography variant="h6" style={{ opacity: 0.9, fontWeight: 300 }}>
          Acompanhe todas as tentativas de contato e seus resultados
        </Typography>
      </Box>
      
      <Alert severity="info" style={{ marginBottom: 24 }}>
        <strong>📊 Monitoramento:</strong> Visualize o histórico completo de chamadas, 
        incluindo status, duração e número de tentativas por time.
      </Alert>

      {/* Filtros */}
      <Card className={classes.filterSection}>
        <Typography variant="h6" gutterBottom>
          🔍 Filtros e Busca
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Buscar chamadas"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search style={{ marginRight: 8, color: '#666' }} />
              }}
              placeholder="Nome, telefone ou time..."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Time</InputLabel>
              <Select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value as string)}
              >
                <MenuItem value="all">Todos os Times</MenuItem>
                {teams.map(team => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as string)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="answered">Atendidas</MenuItem>
                <MenuItem value="no_answer">Não Atendeu</MenuItem>
                <MenuItem value="busy">Ocupado</MenuItem>
                <MenuItem value="failed">Falhou</MenuItem>
                <MenuItem value="pending">Pendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              className={classes.actionButton}
              startIcon={<Refresh />}
              onClick={loadData}
              disabled={loading}
              style={{ height: '56px' }}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Lista de Chamadas por Time */}
      <Card className={classes.sectionCard}>
        <Box className={classes.sectionHeader}>
          <Typography variant="h5" style={{ fontWeight: 600 }}>
            📊 Chamadas por Time
          </Typography>
          <Typography variant="body2" style={{ opacity: 0.9, marginTop: 8 }}>
            {filteredCalls.length} chamada{filteredCalls.length !== 1 ? 's' : ''} encontrada{filteredCalls.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <CardContent style={{ padding: '24px' }}>
          {teamsWithCalls.length === 0 ? (
            <Alert severity="info">
              Nenhuma chamada encontrada com os filtros aplicados.
            </Alert>
          ) : (
            teamsWithCalls.map(team => renderTeamSection(team.id, team.name))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 