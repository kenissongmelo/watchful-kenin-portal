import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

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
  refreshInterval = 2000
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (callId) params.append('callId', callId);
      params.append('limit', '100');

      const response = await fetch(`http://localhost:7007/api/keninduty/logs/realtime?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
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
  }, [callId, autoRefresh, refreshInterval]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <SuccessIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesLevel && matchesSearch;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCallStatusFromMessage = (message: string) => {
    if (message.includes('ATENDIDA')) return 'answered';
    if (message.includes('RETRY')) return 'retry';
    if (message.includes('ESCALONAMENTO')) return 'escalation';
    if (message.includes('ESGOTADOS')) return 'exhausted';
    return 'info';
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" />
            <Typography variant="h6" component="h3">
              📞 Logs em Tempo Real
            </Typography>
            <Chip 
              label={`${filteredLogs.length} logs`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={fetchLogs} 
              disabled={loading}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          {/* Filtros */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Buscar nos logs"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Nível</InputLabel>
              <Select
                value={filterLevel}
                label="Nível"
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm('');
                setFilterLevel('all');
              }}
              startIcon={<ClearIcon />}
            >
              Limpar
            </Button>
          </Box>

          {/* Lista de Logs */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredLogs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  {loading ? 'Carregando logs...' : 'Nenhum log encontrado'}
                </Typography>
              </Box>
            ) : (
              <List dense>
                {filteredLogs.map((log, index) => (
                  <React.Fragment key={log.id}>
                    <ListItem 
                      sx={{ 
                        bgcolor: log.level === 'error' ? 'error.light' : 
                                log.level === 'warning' ? 'warning.light' :
                                log.level === 'success' ? 'success.light' : 'background.paper',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        {getLevelIcon(log.level)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" component="span" fontWeight="bold">
                              {log.message}
                            </Typography>
                            <Chip
                              label={log.level.toUpperCase()}
                              size="small"
                              color={getLevelColor(log.level) as any}
                              variant="outlined"
                            />
                            {log.callId && (
                              <Chip
                                label={`Call: ${log.callId.slice(-8)}`}
                                size="small"
                                variant="outlined"
                                color="default"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(log.timestamp)}
                            </Typography>
                            {log.details && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  <strong>Detalhes:</strong> {JSON.stringify(log.details, null, 2)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredLogs.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Status */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Última atualização: {new Date().toLocaleTimeString('pt-BR')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                size="small"
                color={autoRefresh ? 'success' : 'default'}
                variant="outlined"
              />
              {callId && (
                <Chip
                  label={`Filtrado por: ${callId.slice(-8)}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}; 