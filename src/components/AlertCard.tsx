import React from 'react';
import {
  Box,
  Grid,
  Tooltip,
  Stack,
  Divider,
  alpha
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  ContentCopy as CopyIcon,
  Schedule as ScheduleIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import {
  GlassCard,
  StatusChip,
  SeverityChip,
  ProviderChip,
  ModernButton,
  ModernIconButton,
  Subtitle,
  BodyText,
  CaptionText
} from './DesignSystem';

interface AlertAttempt {
  status: string;
  memberId?: string;
  memberName?: string;
  timestamp: string;
  notes?: string;
  callId?: string;
  duration?: number;
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
  attempts?: AlertAttempt[];
  nrql?: string;
  threshold?: string;
  condition?: string;
  service?: string;
  hostname?: string;
}

interface AlertCardProps {
  alert: Alert;
  teamName?: string;
  onShowHistory: (alert: Alert) => void;
  onUpdateStatus: (alertId: string, status: 'acknowledged' | 'resolved') => void;
  onRetryCall: (alertId: string) => void;
  onCopyTeamId: (teamId: string) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  teamName,
  onShowHistory,
  onUpdateStatus,
  onRetryCall,
  onCopyTeamId
}) => {
  const isAttended = alert.attended || (alert.attempts && alert.attempts.some(attempt => 
    attempt.status === 'answered' || attempt.status === 'success'
  ));

  const isResolvedByProvider = alert.status === 'resolved' && alert.resolvedAt;

  const isWaitingForProvider = alert.status === 'acknowledged' && !isResolvedByProvider;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  return (
    <GlassCard sx={{ height: '100%', cursor: 'pointer' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Subtitle sx={{ mb: 1, fontSize: '1.1rem' }}>
            {alert.title}
          </Subtitle>
          <BodyText sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary', fontSize: '1rem' }}>
            {alert.description}
          </BodyText>
        </Box>
        <SeverityChip severity={alert.severity} size="small" />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <ProviderChip provider={alert.provider} size="small" />
        <Tooltip title="Team ID usado no campo owners do provider">
          <Box
            onClick={(e) => {
              e.stopPropagation();
              onCopyTeamId(alert.teamId);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <StatusChip 
              status="pending" 
              label={`Team: ${alert.teamId}`} 
              size="small" 
            />
          </Box>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Stack direction="row" spacing={1}>
          {isAttended && (
            <StatusChip status="attended" label="Atendida" size="small" />
          )}
          {isResolvedByProvider && (
            <StatusChip status="resolved" label="Resolvido" size="small" />
          )}
          {isWaitingForProvider && (
            <StatusChip status="pending" label="Aguardando Provider" size="small" />
          )}
          {!isAttended && !isResolvedByProvider && !isWaitingForProvider && (
            <StatusChip status={alert.status} label={alert.status.toUpperCase()} size="small" />
          )}
        </Stack>
        <CaptionText>
          {teamName || 'Time não encontrado'}
        </CaptionText>
      </Box>

      {alert.attempts && alert.attempts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneIcon sx={{ fontSize: 16 }} />
            <CaptionText>
              {alert.attempts.length} tentativa{alert.attempts.length > 1 ? 's' : ''}
            </CaptionText>
            {alert.attempts.length > 0 && (
              <CaptionText>
                • Última: {formatTimeAgo(new Date(alert.attempts[alert.attempts.length - 1].timestamp))}
              </CaptionText>
            )}
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {alert.nrql && (
        <Box sx={{ mb: 2 }}>
          <CaptionText sx={{ display: 'block', mb: 0.5 }}>
            <strong>NRQL:</strong>
          </CaptionText>
          <Box sx={{ 
            backgroundColor: alpha('#000000', 0.05), 
            p: 1, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {alert.nrql}
          </Box>
        </Box>
      )}

      {alert.threshold && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <CaptionText>
            <strong>Threshold:</strong> {alert.threshold}
          </CaptionText>
          {alert.condition && (
            <CaptionText>
              <strong>Condição:</strong> {alert.condition}
            </CaptionText>
          )}
        </Stack>
      )}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <ModernButton
          size="small"
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => onShowHistory(alert)}
        >
          Histórico
        </ModernButton>
        
        {alert.status === 'active' && (
          <ModernButton
            size="small"
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => onUpdateStatus(alert.id, 'acknowledged')}
          >
            Reconhecer
          </ModernButton>
        )}
        
        {alert.status === 'acknowledged' && (
          <ModernButton
            size="small"
            variant="contained"
            color="success"
            startIcon={<DoneIcon />}
            onClick={() => onUpdateStatus(alert.id, 'resolved')}
          >
            Resolver
          </ModernButton>
        )}
        
        {!isAttended && alert.status === 'active' && (
          <ModernButton
            size="small"
            variant="contained"
            color="primary"
            startIcon={<PhoneIcon />}
            onClick={() => onRetryCall(alert.id)}
          >
            Retry Call
          </ModernButton>
        )}
      </Box>
    </GlassCard>
  );
}; 