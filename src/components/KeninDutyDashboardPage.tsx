import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE = 'http://localhost:7007/api/keninduty';

export const KeninDutyDashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/stats`);
        setStats(res.data.data || res.data);
      } catch (e: any) {
        console.error('Erro ao carregar dashboard:', e);
        setError(e.message || 'Erro ao carregar dados');
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Carregando dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar dashboard: {error}
        </Alert>
        <Typography>Verifique se o backend está rodando em http://localhost:7007</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography>Nenhum dado disponível</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        📊 Dashboard KeninDuty
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                🚨 Alertas Ativos
              </Typography>
              <Typography variant="h3" color="error.main" sx={{ fontWeight: 'bold' }}>
                {stats.activeAlerts || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📋 Total de Alertas
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.totalAlerts || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                👥 Times
              </Typography>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.totalTeams || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                👤 Membros
              </Typography>
              <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                {stats.totalMembers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                📞 Tentativas de Chamada
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.totalCallAttempts || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                ✅ Alertas Resolvidos
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                {(stats.totalAlerts || 0) - (stats.activeAlerts || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Atividade Recente */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📈 Atividade Recente
            </Typography>
            <Grid container spacing={2}>
              {stats.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {activity.message}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={activity.status === 'active' ? 'error.main' : 'success.main'}
                    >
                      {activity.status}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}; 