import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider
} from '@material-ui/core';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  callId?: string;
  details?: any;
}

interface RealTimeLogsProps {
  callId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const RealTimeLogs: React.FC<RealTimeLogsProps> = ({
  callId,
  autoRefresh = true,
  refreshInterval = 5000
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Mock data for now
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Sistema iniciado',
          callId: callId || 'call-123'
        },
        {
          id: '2',
          timestamp: new Date().toISOString(),
          level: 'success',
          message: 'Plugin KeninDuty carregado com sucesso',
          callId: callId || 'call-123'
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'success': return 'success';
      default: return 'primary';
    }
  };

  const getLevelSymbol = (level: string) => {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <Box style={{ padding: 16 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Logs em Tempo Real</Typography>
        <Button 
          variant="outlined" 
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? 'Carregando...' : '🔄 Atualizar'}
        </Button>
      </Box>

      <Card>
        <CardContent>
          {logs.length === 0 ? (
            <Typography color="textSecondary">
              Nenhum log disponível
            </Typography>
          ) : (
            <Box>
              {logs.map((log, index) => (
                <Box key={log.id} mb={index < logs.length - 1 ? 2 : 0}>
                  <Box display="flex" alignItems="center" style={{ gap: 16 }}>
                    <Typography variant="body2">
                      {getLevelSymbol(log.level)}
                    </Typography>
                    <Chip 
                      label={log.level.toUpperCase()} 
                      size="small" 
                      color={getLevelColor(log.level) as any}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2" style={{ flexGrow: 1 }}>
                      {log.message}
                    </Typography>
                  </Box>
                  {index < logs.length - 1 && <Divider style={{ marginTop: 8 }} />}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 