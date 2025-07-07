import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
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

      console.log('Fetching logs from:', `http://localhost:7007/api/keninduty/logs/realtime?${params}`);
      const response = await fetch(`http://localhost:7007/api/keninduty/logs/realtime?${params}`);
      const data = await response.json();

      console.log('Logs response:', data);

      if (data.success) {
        setLogs(data.data.logs || []);
      } else {
        console.error('Failed to fetch logs:', data.error);
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

  const getCallStatusFromMessage = (message: string) => {
    const msg = message.toUpperCase();
    
    // Status de atendimento
    if (msg.includes('ATENDIDA') || msg.includes('ATENDIDO') || msg.includes('RESPONDIDA') || msg.includes('RESPONDIDO')) 
      return 'answered';
    
    // Status de retry
    if (msg.includes('RETRY') || msg.includes('TENTATIVA') || msg.includes('REPETINDO') || msg.includes('REPETIR')) 
      return 'retry';
    
    // Status de escalonamento
    if (msg.includes('ESCALONAMENTO') || msg.includes('ESCALONADO') || msg.includes('PRÓXIMO NÍVEL') || msg.includes('NEXT LEVEL')) 
      return 'escalation';
    
    // Status de esgotado
    if (msg.includes('ESGOTADOS') || msg.includes('ESGOTADO') || msg.includes('EXAUSTADO') || msg.includes('FALHOU TODAS')) 
      return 'exhausted';
    
    // Status de inicialização
    if (msg.includes('INICIALIZANDO') || msg.includes('INICIANDO') || msg.includes('CRIANDO CHAMADA') || msg.includes('SETUP')) 
      return 'init';
    
    // Status de sucesso
    if (msg.includes('SUCESSO') || msg.includes('SUCCESS') || msg.includes('CONCLUÍDA') || msg.includes('FINALIZADA')) 
      return 'success';
    
    // Status de erro
    if (msg.includes('ERRO') || msg.includes('ERROR') || msg.includes('FALHA') || msg.includes('FAILED')) 
      return 'error';
    
    // Status de informação
    if (msg.includes('MEMBROS') || msg.includes('DISPONÍVEIS') || msg.includes('INFO') || msg.includes('INFORMATION')) 
      return 'info';
    
    return 'info';
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return '#4caf50'; // Verde vibrante para atendida
      case 'retry':
        return '#ff9800'; // Laranja para retry
      case 'escalation':
        return '#f57c00'; // Laranja escuro para escalonamento
      case 'exhausted':
        return '#f44336'; // Vermelho para esgotado
      case 'init':
        return '#2196f3'; // Azul para inicialização
      case 'success':
        return '#4caf50'; // Verde para sucesso
      case 'error':
        return '#d32f2f'; // Vermelho escuro para erro
      default:
        return '#757575'; // Cinza para info
    }
  };

  const getCallStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return '✅';
      case 'retry':
        return '🔄';
      case 'escalation':
        return '⬆️';
      case 'exhausted':
        return '❌';
      case 'init':
        return '🚀';
      case 'success':
        return '✅';
      case 'error':
        return '💥';
      default:
        return 'ℹ️';
    }
  };

  const getCallStatusLabel = (status: string) => {
    switch (status) {
      case 'answered':
        return 'ATENDIDA';
      case 'retry':
        return 'RETRY';
      case 'escalation':
        return 'ESCALONAMENTO';
      case 'exhausted':
        return 'ESGOTADO';
      case 'init':
        return 'INICIANDO';
      case 'success':
        return 'SUCESSO';
      case 'error':
        return 'ERRO';
      default:
        return 'INFO';
    }
  };

  const getBackgroundColor = (status: string, level: string) => {
    const statusColor = getCallStatusColor(status);
    return `${statusColor}15`; // 15% de opacidade
  };

  const getBorderColor = (status: string) => {
    return getCallStatusColor(status);
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

        {expanded && (
          <>
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

          {/* Legenda de Status */}
          <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              📊 Legenda de Status:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: '#4caf50', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  ✅
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ATENDIDA - Chamada foi atendida com sucesso
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: '#ff9800', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  🔄
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  RETRY - Tentativa de recontato
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: '#f57c00', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  ⬆️
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ESCALONAMENTO - Passou para próximo nível
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: '#f44336', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  ❌
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ESGOTADO - Retries esgotados
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: '#2196f3', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  🚀
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  INICIANDO - Chamada sendo inicializada
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: '#d32f2f', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  💥
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  ERRO - Falha ou erro na operação
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Lista de Logs */}
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredLogs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {loading ? 'Carregando logs...' : 'Nenhum log encontrado'}
                </Typography>
                {!loading && (
                  <Box sx={{ textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Para gerar logs:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      1. Crie um alerta na aba "Alertas"
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      2. Inicialize uma chamada usando o endpoint: POST /api/keninduty/calls/init
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      3. Faça callbacks usando: POST /api/keninduty/calls/callback
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      4. Os logs aparecerão automaticamente aqui
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <List dense>
                {filteredLogs.map((log, index) => {
                  const callStatus = getCallStatusFromMessage(log.message);
                  const statusColor = getCallStatusColor(callStatus);
                  const statusIcon = getCallStatusIcon(callStatus);
                  const statusLabel = getCallStatusLabel(callStatus);
                  const backgroundColor = getBackgroundColor(callStatus, log.level);
                  const borderColor = getBorderColor(callStatus);
                  
                  return (
                    <React.Fragment key={log.id}>
                      <ListItem 
                        sx={{ 
                          bgcolor: backgroundColor,
                          borderRadius: 2,
                          mb: 1.5,
                          border: `2px solid ${borderColor}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: 2
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: `${statusColor}20`,
                            border: `2px solid ${statusColor}`,
                            fontSize: '1.2rem'
                          }}>
                            {statusIcon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body2" component="span" sx={{ 
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: statusColor
                              }}>
                                {log.message}
                              </Typography>
                              <Chip
                                label={statusLabel}
                                size="small"
                                sx={{
                                  bgcolor: statusColor,
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  height: 20
                                }}
                              />
                              {log.callId && (
                                <Chip
                                  label={`Call: ${log.callId.slice(-8)}`}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" sx={{ 
                                color: 'text.secondary',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}>
                                📅 {formatTimestamp(log.timestamp)}
                              </Typography>
                              {log.details && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" sx={{ 
                                    color: 'text.secondary',
                                    fontSize: '0.7rem',
                                    fontWeight: 500
                                  }}>
                                    📋 Detalhes:
                                  </Typography>
                                  <pre style={{ 
                                    fontSize: '0.7rem', 
                                    margin: '4px 0', 
                                    padding: '8px', 
                                    backgroundColor: 'rgba(0,0,0,0.04)', 
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    maxHeight: '80px',
                                    border: '1px solid rgba(0,0,0,0.1)'
                                  }}>
                                    {JSON.stringify(log.details, null, 2)}
                                  </pre>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < filteredLogs.length - 1 && (
                        <Divider sx={{ 
                          my: 1, 
                          borderColor: 'rgba(0,0,0,0.1)',
                          opacity: 0.5
                        }} />
                      )}
                    </React.Fragment>
                  );
                })}
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
          </>
        )}
      </CardContent>
    </Card>
  );
}; 