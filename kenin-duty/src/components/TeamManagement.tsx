import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tabs,
  Tab,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';
import { useApi } from '@backstage/core-plugin-api';
import { keninDutyApiRef, Team, EscalationPolicy, ContactMethod, OnCallSchedule } from '../api/KeninDutyApi';

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

export const TeamManagement = () => {
  const keninDutyApi = useApi(keninDutyApiRef);
  const [teams, setTeams] = useState<Team[]>([]);
  const [escalationPolicies, setEscalationPolicies] = useState<EscalationPolicy[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEscalationDialog, setOpenEscalationDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Form states
  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    members: [''],
    oncall: '',
    contactMethods: [] as ContactMethod[],
  });

  const [escalationForm, setEscalationForm] = useState({
    name: '',
    rules: [] as any[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsData, escalationData] = await Promise.all([
        keninDutyApi.getTeams(),
        keninDutyApi.getEscalationPolicies(),
      ]);
      setTeams(teamsData);
      setEscalationPolicies(escalationData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleCreateTeam = async () => {
    try {
      setLoading(true);
      const newTeam = await keninDutyApi.createTeam({
        name: teamForm.name,
        description: teamForm.description,
        members: teamForm.members.filter(m => m.trim() !== ''),
        oncall: teamForm.oncall,
        contactMethods: teamForm.contactMethods,
      });
      setTeams([...teams, newTeam]);
      setOpenDialog(false);
      resetTeamForm();
    } catch (error) {
      console.error('Erro ao criar time:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      const updatedTeam = await keninDutyApi.updateTeam(selectedTeam.id, {
        name: teamForm.name,
        description: teamForm.description,
        members: teamForm.members.filter(m => m.trim() !== ''),
        oncall: teamForm.oncall,
        contactMethods: teamForm.contactMethods,
      });
      setTeams(teams.map(t => t.id === selectedTeam.id ? updatedTeam : t));
      setOpenDialog(false);
      resetTeamForm();
    } catch (error) {
      console.error('Erro ao atualizar time:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este time?')) return;

    try {
      await keninDutyApi.deleteTeam(teamId);
      setTeams(teams.filter(t => t.id !== teamId));
    } catch (error) {
      console.error('Erro ao excluir time:', error);
    }
  };

  const handleCreateEscalationPolicy = async () => {
    try {
      setLoading(true);
      const newPolicy = await keninDutyApi.createEscalationPolicy({
        name: escalationForm.name,
        rules: escalationForm.rules,
      });
      setEscalationPolicies([...escalationPolicies, newPolicy]);
      setOpenEscalationDialog(false);
      resetEscalationForm();
    } catch (error) {
      console.error('Erro ao criar política de escalation:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: '',
      description: '',
      members: [''],
      oncall: '',
      contactMethods: [],
    });
    setSelectedTeam(null);
  };

  const resetEscalationForm = () => {
    setEscalationForm({
      name: '',
      rules: [],
    });
  };

  const openEditDialog = (team: Team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description,
      members: team.members.length > 0 ? team.members : [''],
      oncall: team.oncall,
      contactMethods: team.contactMethods || [],
    });
    setOpenDialog(true);
  };

  const addMemberField = () => {
    setTeamForm({
      ...teamForm,
      members: [...teamForm.members, ''],
    });
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...teamForm.members];
    newMembers[index] = value;
    setTeamForm({
      ...teamForm,
      members: newMembers,
    });
  };

  const removeMember = (index: number) => {
    if (teamForm.members.length > 1) {
      const newMembers = teamForm.members.filter((_, i) => i !== index);
      setTeamForm({
        ...teamForm,
        members: newMembers,
      });
    }
  };

  const addContactMethod = () => {
    setTeamForm({
      ...teamForm,
      contactMethods: [
        ...teamForm.contactMethods,
        { id: Date.now().toString(), type: 'phone', value: '', enabled: true },
      ],
    });
  };

  const updateContactMethod = (index: number, field: keyof ContactMethod, value: any) => {
    const newMethods = [...teamForm.contactMethods];
    newMethods[index] = { ...newMethods[index], [field]: value };
    setTeamForm({
      ...teamForm,
      contactMethods: newMethods,
    });
  };

  const removeContactMethod = (index: number) => {
    const newMethods = teamForm.contactMethods.filter((_, i) => i !== index);
    setTeamForm({
      ...teamForm,
      contactMethods: newMethods,
    });
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gerenciamento de Times</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Novo Time
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Times" />
        <Tab label="Políticas de Escalation" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} md={6} key={team.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <div>
                      <Typography variant="h6">{team.name}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {team.description}
                      </Typography>
                      <Box mt={1}>
                        <Chip
                          icon={<ScheduleIcon />}
                          label={`On-call: ${team.oncall}`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                      <Box mt={1}>
                        <Typography variant="body2">
                          Membros: {team.members.join(', ')}
                        </Typography>
                      </Box>
                    </div>
                    <Box>
                      <IconButton onClick={() => openEditDialog(team)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTeam(team.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Políticas de Escalation</Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<WarningIcon />}
            onClick={() => setOpenEscalationDialog(true)}
          >
            Nova Política
          </Button>
        </Box>

        <Grid container spacing={3}>
          {escalationPolicies.map((policy) => (
            <Grid item xs={12} md={6} key={policy.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{policy.name}</Typography>
                  <Typography color="textSecondary">
                    {policy.rules.length} regras configuradas
                  </Typography>
                  <List dense>
                    {policy.rules.map((rule, index) => (
                      <ListItem key={rule.id}>
                        <ListItemText
                          primary={`Nível ${rule.level}`}
                          secondary={`Delay: ${rule.delayMinutes} min | Targets: ${rule.targets.length}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Dialog para criar/editar time */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTeam ? 'Editar Time' : 'Criar Novo Time'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome do Time"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pessoa de Plantão"
                value={teamForm.oncall}
                onChange={(e) => setTeamForm({ ...teamForm, oncall: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={teamForm.description}
                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Membros do Time
              </Typography>
              {teamForm.members.map((member, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <TextField
                    fullWidth
                    label={`Membro ${index + 1}`}
                    value={member}
                    onChange={(e) => updateMember(index, e.target.value)}
                    margin="dense"
                  />
                  <IconButton onClick={() => removeMember(index)} disabled={teamForm.members.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={addMemberField} startIcon={<AddIcon />}>
                Adicionar Membro
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Métodos de Contato
              </Typography>
              {teamForm.contactMethods.map((method, index) => (
                                 <Box key={index} display="flex" alignItems="center" mb={1} style={{ gap: '8px' }}>
                  <FormControl margin="dense" style={{ minWidth: 120 }}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={method.type}
                      onChange={(e) => updateContactMethod(index, 'type', e.target.value)}
                    >
                      <MenuItem value="phone">Telefone</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="sms">SMS</MenuItem>
                      <MenuItem value="webhook">Webhook</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Valor"
                    value={method.value}
                    onChange={(e) => updateContactMethod(index, 'value', e.target.value)}
                    margin="dense"
                  />
                  <IconButton onClick={() => removeContactMethod(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={addContactMethod} startIcon={<AddIcon />}>
                Adicionar Contato
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={selectedTeam ? handleUpdateTeam : handleCreateTeam}
            color="primary"
            disabled={loading}
          >
            {selectedTeam ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para criar política de escalation */}
      <Dialog open={openEscalationDialog} onClose={() => setOpenEscalationDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Criar Política de Escalation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome da Política"
            value={escalationForm.name}
            onChange={(e) => setEscalationForm({ ...escalationForm, name: e.target.value })}
            margin="normal"
          />
          <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
            Regras de Escalation
          </Typography>
          <Typography color="textSecondary">
            Configure as regras de escalation para definir como os alertas serão escalonados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEscalationDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateEscalationPolicy}
            color="primary"
            disabled={loading}
          >
            Criar Política
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}; 