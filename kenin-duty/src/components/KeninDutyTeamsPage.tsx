import React, { useState, useEffect } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export const KeninDutyTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createTeamDialog, setCreateTeamDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchTeams = async () => {
    setLoading(true);
    // Mock data for now
    setTimeout(() => {
      setTeams([
        { id: '1', name: 'DevOps Team', description: 'Equipe de DevOps' },
        { id: '2', name: 'Backend Team', description: 'Equipe de Backend' }
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = () => {
    setCreateTeamDialog(false);
    setSnackbar({ open: true, message: 'Time criado com sucesso!', severity: 'success' });
  };

  return (
    <Page themeId="tool">
      <Header title="Times" subtitle="Gerenciamento de Times de Plantão" />
      <Content>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Times Cadastrados</Typography>
          <Box display="flex" style={{ gap: 16 }}>
            <Button variant="outlined" onClick={fetchTeams} disabled={loading}>
              🔄 Atualizar
            </Button>
            <Button variant="contained" color="primary" onClick={() => setCreateTeamDialog(true)}>
              ➕ Criar Time
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} md={6} key={team.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {team.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {team.description}
                  </Typography>
                                     <Box mt={2} display="flex" style={{ gap: 8 }}>
                    <Button size="small" color="primary">
                      ✏️ Editar
                    </Button>
                    <Button size="small" color="secondary">
                      🗑️ Excluir
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {teams.length === 0 && !loading && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="textSecondary">
              Nenhum time encontrado
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Crie seu primeiro time clicando no botão 'Criar Time'
            </Typography>
          </Box>
        )}

        {/* Create Team Dialog */}
        <Dialog open={createTeamDialog} onClose={() => setCreateTeamDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Criar Novo Time</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Time"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateTeamDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTeam} color="primary" variant="contained">
              Criar Time
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
                     <Alert severity={snackbar.severity as any}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Content>
    </Page>
  );
}; 