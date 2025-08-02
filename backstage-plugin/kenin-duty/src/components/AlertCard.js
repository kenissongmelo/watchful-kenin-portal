"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertCard = void 0;
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var DesignSystem_1 = require("./DesignSystem");
var AlertCard = function (_a) {
    var alert = _a.alert, teamName = _a.teamName, onShowHistory = _a.onShowHistory, onUpdateStatus = _a.onUpdateStatus, onRetryCall = _a.onRetryCall, onCopyTeamId = _a.onCopyTeamId;
    var isAttended = alert.attended || (alert.attempts && alert.attempts.some(function (attempt) {
        return attempt.status === 'answered' || attempt.status === 'success';
    }));
    var isResolvedByProvider = alert.status === 'resolved' && alert.resolvedAt;
    var isWaitingForProvider = alert.status === 'acknowledged' && !isResolvedByProvider;
    var getDisplayTitle = function () {
        switch (alert.provider) {
            case 'newrelic':
                return alert.message || alert.description || 'Alerta New Relic';
            case 'datadog':
                return alert.title || alert.description || 'Alerta Datadog';
            case 'grafana':
                return alert.description || alert.title || 'Alerta Grafana';
            default:
                return alert.description || alert.title || 'Alerta sem descrição';
        }
    };
    var getTechnicalId = function () {
        switch (alert.provider) {
            case 'newrelic':
                return alert.title || alert.providerAlertId;
            case 'datadog':
                return alert.providerAlertId || alert.title;
            case 'grafana':
                return alert.providerAlertId || alert.title;
            default:
                return alert.title || alert.providerAlertId;
        }
    };
    var formatTimeAgo = function (date) {
        var now = new Date();
        var diff = now.getTime() - new Date(date).getTime();
        var minutes = Math.floor(diff / 60000);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        if (days > 0)
            return "".concat(days, "d atr\u00E1s");
        if (hours > 0)
            return "".concat(hours, "h atr\u00E1s");
        if (minutes > 0)
            return "".concat(minutes, "m atr\u00E1s");
        return 'Agora';
    };
    return (<DesignSystem_1.GlassCard sx={{ height: '100%', cursor: 'pointer' }}>
      <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <material_1.Box sx={{ flex: 1 }}>
          <DesignSystem_1.Subtitle sx={{ mb: 1, fontSize: '1.1rem', fontWeight: 'bold' }}>
            {getDisplayTitle()}
          </DesignSystem_1.Subtitle>
          <DesignSystem_1.BodyText sx={{ mb: 2, color: 'text.secondary', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            ID: {getTechnicalId()}
          </DesignSystem_1.BodyText>
        </material_1.Box>
        <DesignSystem_1.SeverityChip severity={alert.severity} size="small"/>
      </material_1.Box>

      <material_1.Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <DesignSystem_1.ProviderChip provider={alert.provider} size="small"/>
        <material_1.Tooltip title="Team ID usado no campo owners do provider">
          <material_1.Box onClick={function (e) {
            e.stopPropagation();
            onCopyTeamId(alert.teamId);
        }} sx={{ cursor: 'pointer' }}>
            <DesignSystem_1.StatusChip status="pending" label={"Team: ".concat(alert.teamId)} size="small"/>
          </material_1.Box>
        </material_1.Tooltip>
      </material_1.Box>

      <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <material_1.Stack direction="row" spacing={1}>
          {isAttended && (<DesignSystem_1.StatusChip status="attended" label="Atendida" size="small"/>)}
          {isResolvedByProvider && (<DesignSystem_1.StatusChip status="resolved" label="Resolvido" size="small"/>)}
          {isWaitingForProvider && (<DesignSystem_1.StatusChip status="pending" label="Aguardando Provider" size="small"/>)}
          {!isAttended && !isResolvedByProvider && !isWaitingForProvider && (<DesignSystem_1.StatusChip status={alert.status} label={alert.status.toUpperCase()} size="small"/>)}
        </material_1.Stack>
        <DesignSystem_1.CaptionText>
          {teamName || 'Time não encontrado'}
        </DesignSystem_1.CaptionText>
      </material_1.Box>

      {alert.attempts && alert.attempts.length > 0 && (<material_1.Box sx={{ mb: 2 }}>
          <material_1.Stack direction="row" spacing={1} alignItems="center">
            <icons_material_1.Phone sx={{ fontSize: 16 }}/>
            <DesignSystem_1.CaptionText>
              {alert.attempts.length} tentativa{alert.attempts.length > 1 ? 's' : ''}
            </DesignSystem_1.CaptionText>
            {alert.attempts.length > 0 && (<DesignSystem_1.CaptionText>
                • Última: {formatTimeAgo(new Date(alert.attempts[alert.attempts.length - 1].timestamp))}
              </DesignSystem_1.CaptionText>)}
          </material_1.Stack>
        </material_1.Box>)}

      <material_1.Divider sx={{ my: 2 }}/>

      {alert.nrql && (<material_1.Box sx={{ mb: 2 }}>
          <DesignSystem_1.CaptionText sx={{ display: 'block', mb: 0.5 }}>
            <strong>NRQL:</strong>
          </DesignSystem_1.CaptionText>
          <material_1.Box sx={{
                backgroundColor: (0, material_1.alpha)('#000000', 0.05),
                p: 1,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}>
            {alert.nrql}
          </material_1.Box>
        </material_1.Box>)}

      {alert.threshold && (<material_1.Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <DesignSystem_1.CaptionText>
            <strong>Threshold:</strong> {alert.threshold}
          </DesignSystem_1.CaptionText>
          {alert.condition && (<DesignSystem_1.CaptionText>
              <strong>Condição:</strong> {alert.condition}
            </DesignSystem_1.CaptionText>)}
        </material_1.Stack>)}

      <material_1.Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <DesignSystem_1.ModernButton size="small" variant="outlined" startIcon={<icons_material_1.History />} onClick={function () { return onShowHistory(alert); }}>
          Histórico
        </DesignSystem_1.ModernButton>
        
        {alert.status === 'active' && (<DesignSystem_1.ModernButton size="small" variant="contained" color="success" startIcon={<icons_material_1.CheckCircle />} onClick={function () { return onUpdateStatus(alert.id, 'acknowledged'); }}>
            Reconhecer
          </DesignSystem_1.ModernButton>)}
        
        {alert.status === 'acknowledged' && (<DesignSystem_1.ModernButton size="small" variant="contained" color="success" startIcon={<icons_material_1.Done />} onClick={function () { return onUpdateStatus(alert.id, 'resolved'); }}>
            Resolver
          </DesignSystem_1.ModernButton>)}
        
        {!isAttended && alert.status === 'active' && (<DesignSystem_1.ModernButton size="small" variant="contained" color="primary" startIcon={<icons_material_1.Phone />} onClick={function () { return onRetryCall(alert.id); }}>
            Retry Call
          </DesignSystem_1.ModernButton>)}
      </material_1.Box>
    </DesignSystem_1.GlassCard>);
};
exports.AlertCard = AlertCard;
