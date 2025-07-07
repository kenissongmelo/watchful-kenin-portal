import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Button,
  IconButton,
  Chip,
  Stack,
  Pagination,
  Alert as MuiAlert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  GlassCard,
  ModernButton,
  ModernIconButton,
  SectionTitle,
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

const API_BASE = 'http://localhost:7007/api/keninduty';

export const KeninDutyTeamsPage = () => {
  const theme = useTheme();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [createTeamDialog, setCreateTeamDialog] = useState(false);
  const [editTeamDialog, setEditTeamDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamsPage, setTeamsPage] = useState(0);
  const [teamsRowsPerPage] = useState(6);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
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

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/teams`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      showSnackbar('Erro ao carregar times', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
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
          fetchTeams();
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
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      members: team.members.map(member => ({
        name: member.name,
        phone: member.phone,
        email: member.email,
        role: member.role
      })),
      escalationPolicy: team.escalationPolicy
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
          fetchTeams();
        } else {
          showSnackbar(result.error || 'Erro ao atualizar time', 'error');
        }
      } else {
        showSnackbar('Erro ao atualizar time', 'error');
      }
    } catch (error) {
      showSnackbar('Erro ao atualizar time', 'error');
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
          fetchTeams();
        } else {
          showSnackbar(result.error || 'Erro ao excluir time', 'error');
        }
      } else {
        showSnackbar('Erro ao excluir time', 'error');
      }
    } catch (error) {
      showSnackbar('Erro ao excluir time', 'error');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'primary': return 'primary';
      case 'secondary': return 'secondary';
      case 'escalation': return 'warning';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'primary': return '1º';
      case 'secondary': return '2º';
      case 'escalation': return 'ESC';
      default: return role;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionTitle icon="👥">
          Gerenciamento de Times
        </SectionTitle>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ModernButton
            startIcon={<RefreshIcon />}
            onClick={fetchTeams}
            disabled={loading}
          >
            Atualizar
          </ModernButton>
          <ModernButton
            startIcon={<AddIcon />}
            onClick={() => setCreateTeamDialog(true)}
          >
            Criar Time
          </ModernButton>
        </Box>
      </Box>

      {/* Teams Grid */}
      {teams.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {teams
              .slice(teamsPage * teamsRowsPerPage, teamsPage * teamsRowsPerPage + teamsRowsPerPage)
              .map((team) => (
              <Grid item xs={12} md={6} lg={4} key={team.id}>
                <GlassCard sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Team Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.5,
                          color: theme.palette.primary.main,
                          fontSize: '1.1rem'
                        }}>
                          {team.name}
                        </Typography>
                        <Chip 
                          label={`${team.members.length} membros`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditTeam(team)}
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1), 
                            color: theme.palette.primary.main,
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTeam(team.id)}
                          sx={{ 
                            bgcolor: alpha(theme.palette.error.main, 0.1), 
                            color: theme.palette.error.main,
                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Team Members */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem',
                        mb: 1
                      }}>
                        👥 Membros
                      </Typography>
                      <Stack spacing={1}>
                        {team.members.slice(0, 3).map((member, index) => (
                          <Box key={member.id} sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 1,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.background.paper, 0.5),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                          }}>
                            <Chip 
                              label={getRoleLabel(member.role)} 
                              size="small" 
                              color={getRoleColor(member.role)}
                              sx={{ 
                                minWidth: 35,
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 500,
                                fontSize: '0.8rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {member.name}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: theme.palette.text.secondary,
                                fontSize: '0.7rem'
                              }}>
                                {member.phone}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                        {team.members.length > 3 && (
                          <Typography variant="body2" color="text.secondary" sx={{ 
                            fontStyle: 'italic',
                            fontSize: '0.75rem',
                            textAlign: 'center'
                          }}>
                            +{team.members.length - 3} membros adicionais
                          </Typography>
                        )}
                      </Stack>
                    </Box>

                    {/* Escalation Policy */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem',
                        mb: 1
                      }}>
                        ⚙️ Política de Escalonamento
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 1, 
                            bgcolor: alpha(theme.palette.primary.main, 0.1), 
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                          }}>
                            <Typography variant="h6" color="primary.main" sx={{ fontSize: '1rem' }}>
                              {team.escalationPolicy.retryCount}
                            </Typography>
                            <Typography variant="caption" color="primary.main" sx={{ fontSize: '0.65rem' }}>
                              Retries
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 1, 
                            bgcolor: alpha(theme.palette.secondary.main, 0.1), 
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
                          }}>
                            <Typography variant="h6" color="secondary.main" sx={{ fontSize: '1rem' }}>
                              {team.escalationPolicy.retryIntervalMinutes}
                            </Typography>
                            <Typography variant="caption" color="secondary.main" sx={{ fontSize: '0.65rem' }}>
                              Min
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ 
                            textAlign: 'center', 
                            p: 1, 
                            bgcolor: alpha(theme.palette.warning.main, 0.1), 
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                          }}>
                            <Typography variant="h6" color="warning.main" sx={{ fontSize: '1rem' }}>
                              {team.escalationPolicy.escalationDelayMinutes}
                            </Typography>
                            <Typography variant="caption" color="warning.main" sx={{ fontSize: '0.65rem' }}>
                              Delay
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
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

      {/* Create Team Dialog */}
      <Dialog
        open={createTeamDialog}
        onClose={() => setCreateTeamDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            <Typography variant="h6">Criar Novo Time</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome do Time"
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Membros do Time
            </Typography>
            {teamForm.members.map((member, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...teamForm.members];
                        newMembers[index].name = e.target.value;
                        setTeamForm({ ...teamForm, members: newMembers });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={member.phone}
                      onChange={(e) => {
                        const newMembers = [...teamForm.members];
                        newMembers[index].phone = e.target.value;
                        setTeamForm({ ...teamForm, members: newMembers });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={member.email}
                      onChange={(e) => {
                        const newMembers = [...teamForm.members];
                        newMembers[index].email = e.target.value;
                        setTeamForm({ ...teamForm, members: newMembers });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Função</InputLabel>
                      <Select
                        value={member.role}
                        label="Função"
                        onChange={(e) => {
                          const newMembers = [...teamForm.members];
                          newMembers[index].role = e.target.value as 'primary' | 'secondary' | 'escalation';
                          setTeamForm({ ...teamForm, members: newMembers });
                        }}
                      >
                        <MenuItem value="primary">Primário</MenuItem>
                        <MenuItem value="secondary">Secundário</MenuItem>
                        <MenuItem value="escalation">Escalação</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {teamForm.members.length > 1 && (
                  <IconButton
                    onClick={() => {
                      const newMembers = teamForm.members.filter((_, i) => i !== index);
                      setTeamForm({ ...teamForm, members: newMembers });
                    }}
                    sx={{ mt: 1 }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Card>
            ))}
            
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setTeamForm({
                  ...teamForm,
                  members: [...teamForm.members, { name: '', phone: '', email: '', role: 'primary' }]
                });
              }}
              sx={{ mb: 3 }}
            >
              Adicionar Membro
            </Button>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Política de Escalonamento
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Número de Retries"
                  value={teamForm.escalationPolicy.retryCount}
                  onChange={(e) => setTeamForm({
                    ...teamForm,
                    escalationPolicy: {
                      ...teamForm.escalationPolicy,
                      retryCount: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Intervalo entre Retries (min)"
                  value={teamForm.escalationPolicy.retryIntervalMinutes}
                  onChange={(e) => setTeamForm({
                    ...teamForm,
                    escalationPolicy: {
                      ...teamForm.escalationPolicy,
                      retryIntervalMinutes: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Delay de Escalonamento (min)"
                  value={teamForm.escalationPolicy.escalationDelayMinutes}
                  onChange={(e) => setTeamForm({
                    ...teamForm,
                    escalationPolicy: {
                      ...teamForm.escalationPolicy,
                      escalationDelayMinutes: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTeamDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateTeam} variant="contained" color="primary">
            Criar Time
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog
        open={editTeamDialog}
        onClose={() => setEditTeamDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            <Typography variant="h6">Editar Time</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nome do Time"
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Membros do Time
            </Typography>
            {teamForm.members.map((member, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...teamForm.members];
                        newMembers[index].name = e.target.value;
                        setTeamForm({ ...teamForm, members: newMembers });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      value={member.phone}
                      onChange={(e) => {
                        const newMembers = [...teamForm.members];
                        newMembers[index].phone = e.target.value;
                        setTeamForm({ ...teamForm, members: newMembers });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={member.email}
                      onChange={(e) => {
                        const newMembers = [...teamForm.members];
                        newMembers[index].email = e.target.value;
                        setTeamForm({ ...teamForm, members: newMembers });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Função</InputLabel>
                      <Select
                        value={member.role}
                        label="Função"
                        onChange={(e) => {
                          const newMembers = [...teamForm.members];
                          newMembers[index].role = e.target.value as 'primary' | 'secondary' | 'escalation';
                          setTeamForm({ ...teamForm, members: newMembers });
                        }}
                      >
                        <MenuItem value="primary">Primário</MenuItem>
                        <MenuItem value="secondary">Secundário</MenuItem>
                        <MenuItem value="escalation">Escalação</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {teamForm.members.length > 1 && (
                  <IconButton
                    onClick={() => {
                      const newMembers = teamForm.members.filter((_, i) => i !== index);
                      setTeamForm({ ...teamForm, members: newMembers });
                    }}
                    sx={{ mt: 1 }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Card>
            ))}
            
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setTeamForm({
                  ...teamForm,
                  members: [...teamForm.members, { name: '', phone: '', email: '', role: 'primary' }]
                });
              }}
              sx={{ mb: 3 }}
            >
              Adicionar Membro
            </Button>

            <Typography variant="h6" sx={{ mb: 2 }}>
              Política de Escalonamento
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Número de Retries"
                  value={teamForm.escalationPolicy.retryCount}
                  onChange={(e) => setTeamForm({
                    ...teamForm,
                    escalationPolicy: {
                      ...teamForm.escalationPolicy,
                      retryCount: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Intervalo entre Retries (min)"
                  value={teamForm.escalationPolicy.retryIntervalMinutes}
                  onChange={(e) => setTeamForm({
                    ...teamForm,
                    escalationPolicy: {
                      ...teamForm.escalationPolicy,
                      retryIntervalMinutes: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Delay de Escalonamento (min)"
                  value={teamForm.escalationPolicy.escalationDelayMinutes}
                  onChange={(e) => setTeamForm({
                    ...teamForm,
                    escalationPolicy: {
                      ...teamForm.escalationPolicy,
                      escalationDelayMinutes: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTeamDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateTeam} variant="contained" color="primary">
            Atualizar Time
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}; 