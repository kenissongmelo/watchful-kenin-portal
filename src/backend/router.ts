import express from 'express';
import { Logger } from 'winston';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(options: RouterOptions): Promise<express.Router> {
  const { logger } = options;
  const router = express.Router();

  // Middleware para parsing JSON
  router.use(express.json());

  // Mock data storage
  let teams: any[] = [];
  let alerts: any[] = [];
  let callAttempts: any[] = [];

  const DATA_PATH = path.join(__dirname, 'keninduty-data.json');
  const LOGS_PATH = path.join(__dirname, 'keninduty-logs.json');

  function saveData() {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ teams, alerts, callAttempts }, null, 2));
  }

  function loadData() {
    if (fs.existsSync(DATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
      teams = data.teams || [];
      alerts = data.alerts || [];
      callAttempts = data.callAttempts || [];
    }
  }

  // Sistema de logs persistente
  let systemLogs: Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'success';
    category: 'system' | 'alert' | 'call' | 'team' | 'user';
    message: string;
    callId?: string;
    alertId?: string;
    teamId?: string;
    userId?: string;
    details?: any;
  }> = [];

  function loadLogs() {
    if (fs.existsSync(LOGS_PATH)) {
      try {
        const data = JSON.parse(fs.readFileSync(LOGS_PATH, 'utf-8'));
        systemLogs = data.logs || [];
      } catch (error) {
        logger.error('Error loading logs:', error);
        systemLogs = [];
      }
    }
  }

  function saveLogs() {
    try {
      fs.writeFileSync(LOGS_PATH, JSON.stringify({ 
        logs: systemLogs,
        lastUpdated: new Date().toISOString()
      }, null, 2));
    } catch (error) {
      logger.error('Error saving logs:', error);
    }
  }

  function addSystemLog(
    level: 'info' | 'warning' | 'error' | 'success',
    category: 'system' | 'alert' | 'call' | 'team' | 'user',
    message: string,
    callId?: string,
    alertId?: string,
    teamId?: string,
    userId?: string,
    details?: any
  ) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      callId,
      alertId,
      teamId,
      userId,
      details
    };
    
    systemLogs.push(log);
    
    // Manter apenas os últimos 1000 logs
    if (systemLogs.length > 1000) {
      systemLogs = systemLogs.slice(-1000);
    }
    
    // Salvar logs a cada 10 entradas para não sobrecarregar o disco
    if (systemLogs.length % 10 === 0) {
      saveLogs();
    }
    
    // Também adicionar ao realTimeLogs para o frontend
    const realTimeLog = {
      id: log.id,
      timestamp: log.timestamp,
      level: log.level,
      message: log.message,
      callId: log.callId,
      details: log.details
    };
    
    realTimeLogs.push(realTimeLog);
    
    // Manter apenas os últimos 100 logs em tempo real
    if (realTimeLogs.length > 100) {
      realTimeLogs = realTimeLogs.slice(-100);
    }
    
    logger.info(`[${level.toUpperCase()}] [${category.toUpperCase()}] ${message}`, details);
  }

  loadData();
  loadLogs();

  // 1. Estatísticas de Sessões
  router.get('/sessions/stats', async (req, res) => {
    try {
      logger.info('GET /api/keninduty/sessions/stats called');
      
      // Calcular estatísticas reais baseadas nos alertas
      const totalSessions = alerts.length;
      const activeSessions = alerts.filter(a => a.status === 'active').length;
      const completedSessions = alerts.filter(a => a.status === 'resolved').length;
      
      // Calcular duração média das sessões
      const sessionsWithDuration = alerts.filter(a => a.attempts && a.attempts.length > 0);
      const totalDuration = sessionsWithDuration.reduce((sum, alert) => {
        const alertDuration = alert.attempts?.reduce((alertSum, attempt) => 
          alertSum + (attempt.duration || 0), 0) || 0;
        return sum + alertDuration;
      }, 0);
      const averageSessionDuration = sessionsWithDuration.length > 0 ? 
        totalDuration / sessionsWithDuration.length : 0;
      
      // Calcular sessões desta semana e mês
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const sessionsThisWeek = alerts.filter(a => 
        new Date(a.createdAt) >= oneWeekAgo
      ).length;
      
      const sessionsThisMonth = alerts.filter(a => 
        new Date(a.createdAt) >= oneMonthAgo
      ).length;
      
      // Top times por número de alertas
      const teamStats = teams.map(team => ({
        name: team.name,
        sessions: alerts.filter(a => a.teamId === team.id).length
      })).sort((a, b) => b.sessions - a.sessions).slice(0, 5);

      const stats = {
        totalSessions,
        activeSessions,
        completedSessions,
        averageSessionDuration: Math.round(averageSessionDuration * 100) / 100,
        sessionsThisWeek,
        sessionsThisMonth,
        topTeams: teamStats
      };

      res.json(stats);
    } catch (error) {
      logger.error('Error in sessions stats endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 2. Status de Chamada (Webhook)
  const callStatusSchema = z.object({
    callId: z.string(),
    status: z.enum(['pending', 'in_progress', 'resolved', 'escalated']),
    assignee: z.string().optional(),
    notes: z.string().optional(),
    timestamp: z.string().optional()
  });

  router.post('/webhook/call-status', async (req, res) => {
    try {
      logger.info('POST /api/keninduty/webhook/call-status called', { body: req.body });
      
      const payload = callStatusSchema.parse(req.body);
      
      // Processar status real da chamada
      logger.info('Processing call status update:', payload);
      
      // Buscar alerta relacionado ao callId
      const alert = alerts.find(a => a.id === payload.callId || a.callId === payload.callId);
      
      if (alert) {
        // Atualizar status do alerta baseado no payload
        if (payload.status === 'resolved') {
          alert.status = 'resolved';
          alert.resolvedAt = new Date().toISOString();
        } else if (payload.status === 'escalated') {
          alert.status = 'active';
        }
        
        // Adicionar tentativa ao histórico se houver assignee
        if (payload.assignee) {
          if (!alert.attempts) alert.attempts = [];
          alert.attempts.push({
            status: payload.status,
            memberName: payload.assignee,
            timestamp: payload.timestamp || new Date().toISOString(),
            notes: payload.notes || '',
            callId: payload.callId
          });
        }
        
        saveData();
      }
      
      const response = {
        success: true,
        message: 'Call status updated successfully',
        callId: payload.callId,
        processedAt: new Date().toISOString(),
        nextAction: payload.status === 'resolved' ? 'close_call' : 'monitor_call',
        alertUpdated: !!alert
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in call status webhook:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Invalid payload', 
          details: error.errors 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // 3. Consulta de Plantonista Atual (dados reais)
  router.get('/oncall/current', async (req, res) => {
    try {
      const { teamId, alertId } = req.query;
      logger.info('GET /api/keninduty/oncall/current called', { teamId, alertId });
      if (!teamId || !alertId) {
        return res.status(400).json({ success: false, error: 'teamId and alertId parameters are required' });
      }
      const team = teams.find(t => t.id === teamId);
      if (!team) {
        return res.status(404).json({ success: false, error: 'Team not found' });
      }
      // Buscar ou criar alerta
      let alert = alerts.find(a => a.id === alertId);
      if (!alert) {
        alert = {
          id: alertId,
          title: `Alerta ${alertId}`,
          teamId,
          status: 'active',
          createdAt: new Date().toISOString(),
          attempts: [],
        };
        alerts.push(alert);
        if (typeof saveData === 'function') saveData();
      }
      // Retornar membros do time e dados do alerta
      const oncallData = team.members.map((member) => ({
        userID: member.id,
        userName: member.name,
        phone: member.phone,
        email: member.email,
        teamID: team.id,
        teamName: team.name,
        role: member.role,
        scheduleID: '',
        scheduleName: '',
        startTime: '',
        endTime: '',
        timezone: ''
      }));
      res.json({
        success: true,
        data: {
          team: { id: team.id, name: team.name },
          alert,
          oncall: oncallData
        }
      });
    } catch (error) {
      logger.error('Error in current oncall endpoint:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // 4. Endpoint de disponibilidade do on-call
  router.get('/oncall/availability', async (req, res) => {
    try {
      const { teamId } = req.query;
      logger.info('GET /api/keninduty/oncall/availability called', { teamId });
      
      if (!teamId) {
        return res.status(400).json({ 
          success: false, 
          error: 'teamId parameter is required' 
        });
      }

      // Buscar time real no banco de dados
      const team = teams.find(t => t.id === teamId);
      if (!team) {
        return res.status(404).json({ 
          success: false, 
          error: 'Team not found' 
        });
      }

      // Encontrar membros disponíveis (primários e secundários)
      const availableMembers = team.members.filter(m => 
        m.role === 'primary' || m.role === 'secondary'
      );

      // Verificar disponibilidade baseada na hora atual
      const currentHour = new Date().getHours();
      const isAvailable = currentHour >= 8 && currentHour <= 22; // Disponível entre 8h e 22h

      const onCallData = availableMembers.map(member => ({
        userName: member.name,
        phone: member.phone,
        teamName: team.name,
        role: member.role,
        email: member.email
      }));

      res.json({
        success: true,
        data: {
          available: isAvailable && onCallData.length > 0,
          onCall: onCallData,
          count: onCallData.length,
          escalationPolicy: {
            maxRetries: team.escalationPolicy.retryCount,
            retryIntervalMinutes: team.escalationPolicy.retryIntervalMinutes,
            escalationDelayMinutes: team.escalationPolicy.escalationDelayMinutes
          },
          teamInfo: {
            id: team.id,
            name: team.name,
            totalMembers: team.members.length
          }
        }
      });
    } catch (error) {
      logger.error('Error in oncall availability endpoint:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  // 5. Endpoint de callback para status de chamadas
  const callbackSchema = z.object({
    callId: z.string(),
    status: z.enum(['answered', 'no-answer', 'failed', 'busy']),
    duration: z.number().optional(),
    notes: z.string().optional(),
    timestamp: z.string().optional(),
    incidentId: z.string().optional(),
    provider: z.string().optional()
  }).passthrough(); // Allow additional fields

  // Estado em memória para tentativas de chamada por callId
  let callAttemptsMap: Record<string, { teamId: string, memberIndex: number, retries: number }> = {};
  
  // Logs em tempo real para o frontend
  let realTimeLogs: Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'warning' | 'error' | 'success';
    message: string;
    callId?: string;
    details?: any;
  }> = [];
  
  function addLog(level: 'info' | 'warning' | 'error' | 'success', message: string, callId?: string, details?: any) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      callId,
      details
    };
    realTimeLogs.push(log);
    
    // Manter apenas os últimos 100 logs
    if (realTimeLogs.length > 100) {
      realTimeLogs = realTimeLogs.slice(-100);
    }
    
    logger.info(`[${level.toUpperCase()}] ${message}`, details);
  }

  // Endpoint para inicializar uma chamada (chamado pelo sistema de chamadas)
  const initCallSchema = z.object({
    callId: z.string(),
    teamId: z.string(),
    alertId: z.string().optional()
  });

  router.post('/calls/init', async (req, res) => {
    try {
      const payload = initCallSchema.parse(req.body);
      logger.info('POST /api/keninduty/calls/init called', { payload });

      const { callId, teamId, alertId } = payload;
      
      // Verificar se o time existe
      const team = teams.find(t => t.id === teamId);
      if (!team) {
        addSystemLog('error', 'system', `Time não encontrado: ${teamId}`, callId);
        return res.status(404).json({ success: false, error: 'Team not found' });
      }
      
      addSystemLog('info', 'system', `Inicializando chamada para time: ${team.name}`, callId, undefined, teamId, undefined, {
        teamId,
        teamName: team.name,
        membersCount: team.members.length
      });

      // Filtrar membros disponíveis (primary e secondary)
      const availableMembers = team.members.filter(m => m.role === 'primary' || m.role === 'secondary');
      if (availableMembers.length === 0) {
        addSystemLog('error', 'system', `Nenhum membro disponível no time: ${team.name}`, callId);
        return res.status(400).json({ success: false, error: 'No available members in team' });
      }
      
      addSystemLog('info', 'system', `Membros disponíveis encontrados: ${availableMembers.length}`, callId, undefined, teamId, undefined, {
        members: availableMembers.map(m => ({ name: m.name, role: m.role, phone: m.phone }))
      });

      // Inicializar estado da chamada com o primeiro membro (primary)
      const firstMember = availableMembers.find(m => m.role === 'primary') || availableMembers[0];
      const firstMemberIndex = availableMembers.findIndex(m => m.id === firstMember.id);

      callAttemptsMap[callId] = {
        teamId,
        memberIndex: firstMemberIndex,
        retries: 0
      };
      
      addSystemLog('success', 'system', `Chamada inicializada com sucesso`, callId, undefined, teamId, undefined, {
        firstMember: {
          name: firstMember.name,
          phone: firstMember.phone,
          role: firstMember.role
        },
        maxRetries: team.escalationPolicy.retryCount,
        retryInterval: team.escalationPolicy.retryIntervalMinutes
      });

      // Criar ou atualizar alerta se alertId fornecido
      if (alertId) {
        let alert = alerts.find(a => a.id === alertId);
        if (!alert) {
          alert = {
            id: alertId,
            title: `Alerta ${alertId}`,
            teamId,
            status: 'active',
            createdAt: new Date().toISOString(),
            attempts: []
          };
          alerts.push(alert);
        }
      }

      saveData();

      res.json({
        success: true,
        message: 'Call initialized successfully',
        data: {
          callId,
          teamId,
          teamName: team.name,
          firstMember: {
            id: firstMember.id,
            name: firstMember.name,
            phone: firstMember.phone,
            email: firstMember.email,
            role: firstMember.role
          },
          maxRetries: team.escalationPolicy.retryCount,
          availableMembers: availableMembers.length
        }
      });
    } catch (error) {
      logger.error('Error in call init:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false,
          error: 'Invalid payload', 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }
    }
  });

  router.post('/callback/call-status', async (req, res) => {
    try {
      const payload = callbackSchema.parse(req.body);
      logger.info('POST /api/keninduty/callback/call-status called', { payload });

      const { callId, status, timestamp, notes } = payload;
      let callState = callAttemptsMap[callId];
      if (!callState) {
        addSystemLog('error', 'call', `CallId não encontrado: ${callId}`, callId);
        return res.status(400).json({ 
          success: false, 
          error: 'Unknown callId. Use /calls/init first to initialize the call with teamId.' 
        });
      }
      
      addSystemLog('info', 'call', `Callback recebido: ${status}`, callId, undefined, callState.teamId, undefined, {
        status,
        timestamp: payload.timestamp,
        notes: payload.notes,
        duration: payload.duration
      });
      
      const team = teams.find(t => t.id === callState.teamId);
      if (!team) {
        addSystemLog('error', 'call', `Time não encontrado para callId: ${callId}`, callId);
        return res.status(404).json({ success: false, error: 'Team not found' });
      }
      
      // Usar membros reais do time cadastrado
      const availableMembers = team.members.filter(m => m.role === 'primary' || m.role === 'secondary');
      const maxRetries = team.escalationPolicy.retryCount || 3;
      let nextAction = 'close';
      let nextNumber = null;
      let escalationReason = '';

      // Buscar alerta relacionado ao callId
      const alert = alerts.find(a => a.id === callId || a.callId === callId);
      if (alert) {
        if (!alert.attempts) alert.attempts = [];
        
        // Adicionar tentativa ao histórico do alerta
        const currentMember = availableMembers[callState.memberIndex];
        alert.attempts.push({
          status,
          memberId: currentMember?.id,
          memberName: currentMember?.name,
          timestamp: timestamp || new Date().toISOString(),
          notes: notes || '',
          callId: callId,
          duration: payload.duration
        });
        
        // Atualizar status do alerta
        if (status === 'answered') {
          alert.status = 'resolved';
        } else if (status === 'no-answer' || status === 'busy' || status === 'failed') {
          alert.status = 'active';
        }
      }

      let nextMember = null;

      // Debug: Log do estado atual
      logger.info('📞 CALLBACK PROCESSING START', {
        callId,
        status,
        currentRetries: callState.retries,
        maxRetries,
        memberIndex: callState.memberIndex,
        totalMembers: availableMembers.length,
        currentMember: availableMembers[callState.memberIndex]?.name,
        currentPhone: availableMembers[callState.memberIndex]?.phone
      });

      // Lógica de Escalação Automática usando configurações reais do time
      if (status === 'answered') {
        // answered: encerra o processo
        nextAction = 'close';
        escalationReason = 'Chamada atendida com sucesso';
        delete callAttemptsMap[callId];
        
        addSystemLog('success', 'call', `✅ CHAMADA ATENDIDA - Alerta resolvido!`, callId, undefined, callState.teamId, undefined, {
          memberName: availableMembers[callState.memberIndex]?.name,
          memberPhone: availableMembers[callState.memberIndex]?.phone,
          duration: payload.duration,
          totalAttempts: callState.retries + 1,
          reason: 'Chamada atendida com sucesso'
        });
        
        logger.info('✅ CALL ANSWERED - ALERT RESOLVED', {
          callId,
          memberName: availableMembers[callState.memberIndex]?.name,
          memberPhone: availableMembers[callState.memberIndex]?.phone,
          duration: payload.duration,
          totalAttempts: callState.retries + 1,
          reason: 'Chamada atendida com sucesso',
          alertStatus: alert?.status,
          timestamp: new Date().toISOString()
        });
      } else if (status === 'no-answer' || status === 'busy' || status === 'failed') {
        // Para todos os status de falha: tentar retry até o máximo configurado
        // callState.retries começa em 0, então se maxRetries = 3, podemos fazer 3 tentativas (0, 1, 2)
        logger.info('📞 CALL FAILED - PROCESSING RETRY LOGIC', {
          callId,
          status,
          memberName: availableMembers[callState.memberIndex]?.name,
          memberPhone: availableMembers[callState.memberIndex]?.phone,
          currentRetries: callState.retries,
          maxRetries,
          canRetry: callState.retries < maxRetries - 1,
          reason: `Status: ${status} - Processando lógica de retry`
        });
        
        if (callState.retries < maxRetries - 1) {
          callState.retries += 1;
          nextAction = 'retry';
          nextMember = availableMembers[callState.memberIndex]; // Mesmo membro
          nextNumber = nextMember?.phone; // Mesmo número até completar retries
          escalationReason = `Retry automático ${callState.retries + 1}/${maxRetries} para ${nextMember?.name}`;
          
          addSystemLog('warning', 'call', `🔄 RETRY AGENDADO - Tentativa ${callState.retries + 1}/${maxRetries}`, callId, undefined, callState.teamId, undefined, {
            memberName: nextMember?.name,
            memberPhone: nextMember?.phone,
            retryNumber: callState.retries + 1,
            maxRetries,
            status,
            reason: `Retry automático para ${nextMember?.name}`
          });
          
          logger.info('🔄 RETRY SCHEDULED', {
            callId,
            memberName: nextMember?.name,
            memberPhone: nextMember?.phone,
            retryNumber: callState.retries + 1,
            maxRetries,
            nextAction,
            reason: `Tentativa ${callState.retries + 1} de ${maxRetries} para ${nextMember?.name}`,
            timestamp: new Date().toISOString()
          });
        } else {
          // Máximo de tentativas atingido, escalar para próximo membro
          logger.info('⚠️ MAX RETRIES REACHED - ESCALATING');
          
          if (callState.memberIndex < availableMembers.length - 1) {
            callState.memberIndex += 1;
            callState.retries = 0; // Reset retries para novo membro
            nextAction = 'escalate';
            nextMember = availableMembers[callState.memberIndex];
            nextNumber = nextMember?.phone;
            escalationReason = `Escalonamento após ${maxRetries} tentativas falhadas`;
            
            addSystemLog('warning', 'call', `⬆️ ESCALONAMENTO - Próximo membro: ${nextMember?.name}`, callId, undefined, callState.teamId, undefined, {
              previousMember: availableMembers[callState.memberIndex - 1]?.name,
              newMember: nextMember?.name,
              newMemberPhone: nextMember?.phone,
              newMemberRole: nextMember?.role,
              memberIndex: callState.memberIndex,
              totalMembers: availableMembers.length,
              reason: `Escalonamento após ${maxRetries} tentativas falhadas`
            });
            
            logger.info('⬆️ ESCALATION TO NEXT MEMBER', {
              callId,
              previousMember: availableMembers[callState.memberIndex - 1]?.name,
              newMember: nextMember?.name,
              newMemberPhone: nextMember?.phone,
              newMemberRole: nextMember?.role,
              memberIndex: callState.memberIndex,
              totalMembers: availableMembers.length,
              reason: `Escalonamento após ${maxRetries} tentativas falhadas com ${availableMembers[callState.memberIndex - 1]?.name}`,
              timestamp: new Date().toISOString()
            });
          } else {
            nextAction = 'close';
            escalationReason = 'Todos os membros foram tentados com máximo de retries';
            delete callAttemptsMap[callId];
            if (alert) alert.status = 'failed';
            
            addSystemLog('error', 'call', `❌ TODOS OS MEMBROS ESGOTADOS - Chamada encerrada`, callId, undefined, callState.teamId, undefined, {
              totalMembersTried: availableMembers.length,
              maxRetriesPerMember: maxRetries,
              totalAttempts: callState.retries + 1,
              reason: 'Todos os membros foram tentados com máximo de retries'
            });
            
            logger.info('❌ ALL MEMBERS EXHAUSTED - CALL CLOSED', {
              callId,
              totalMembersTried: availableMembers.length,
              maxRetriesPerMember: maxRetries,
              totalAttempts: callState.retries + 1,
              reason: 'Todos os membros foram tentados com máximo de retries',
              alertStatus: alert?.status,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
      
      // Atualizar estado da chamada
      callAttemptsMap[callId] = callState;
      
      // Salvar dados se houve mudanças no alerta
      if (alert) {
        saveData();
      }
      
      const responseData: any = {
        callId: payload.callId,
        status: payload.status,
        duration: payload.duration,
        updatedAt: new Date().toISOString(),
        nextAction,
        nextNumber,
        currentRetries: callState.retries,
        maxRetries: maxRetries,
        teamId: callState.teamId,
        teamName: team.name,
        escalationReason,
        currentMember: availableMembers[callState.memberIndex] ? {
          id: availableMembers[callState.memberIndex].id,
          name: availableMembers[callState.memberIndex].name,
          phone: availableMembers[callState.memberIndex].phone,
          role: availableMembers[callState.memberIndex].role
        } : null,
        totalMembers: availableMembers.length,
        currentMemberIndex: callState.memberIndex
      };

      // Adicionar dados do próximo membro se houver
      if (nextMember) {
        responseData.nextMember = {
          id: nextMember.id,
          name: nextMember.name,
          phone: nextMember.phone,
          email: nextMember.email,
          role: nextMember.role
        };
      }

      logger.info('📤 CALLBACK RESPONSE SENT', {
        callId,
        nextAction,
        nextMember: nextMember?.name,
        nextNumber: nextNumber,
        escalationReason,
        responseData
      });

      res.json({
        success: true,
        message: 'Call status updated successfully',
        data: responseData
      });
    } catch (error) {
      logger.error('Error in call status callback:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false,
          error: 'Invalid payload', 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false,
          error: 'Internal server error' 
        });
      }
    }
  });

  // 4. Logs em Tempo Real
  router.get('/logs/realtime', async (req, res) => {
    try {
      const { callId, limit = 50 } = req.query;
      
      let filteredLogs = realTimeLogs;
      
      if (callId) {
        filteredLogs = realTimeLogs.filter(log => log.callId === callId);
      }
      
      // Retornar os logs mais recentes primeiro
      const recentLogs = filteredLogs
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, parseInt(limit as string));
      
      res.json({
        success: true,
        data: {
          logs: recentLogs,
          total: filteredLogs.length,
          filtered: !!callId
        }
      });
    } catch (error) {
      logger.error('Error fetching realtime logs:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // 5. Configuração de Retry
  const retryConfigSchema = z.object({
    maxRetries: z.number().min(1).max(10),
    retryDelay: z.number().min(1000).max(60000),
    backoffMultiplier: z.number().min(1).max(5),
    timeout: z.number().min(5000).max(300000)
  });

  router.get('/config/retry', async (req, res) => {
    try {
      logger.info('GET /api/keninduty/config/retry called');
      
      // Calcular configuração média baseada nos times reais
      if (teams.length === 0) {
        return res.json({
          maxRetries: 3,
          retryDelay: 5000,
          backoffMultiplier: 2,
          timeout: 30000,
          lastUpdated: new Date().toISOString(),
          note: "No teams configured - using default values"
        });
      }
      
      const avgRetryCount = Math.round(
        teams.reduce((sum, team) => sum + team.escalationPolicy.retryCount, 0) / teams.length
      );
      
      const avgRetryInterval = Math.round(
        teams.reduce((sum, team) => sum + team.escalationPolicy.retryIntervalMinutes, 0) / teams.length
      ) * 60 * 1000; // Converter para milissegundos
      
      const avgEscalationDelay = Math.round(
        teams.reduce((sum, team) => sum + team.escalationPolicy.escalationDelayMinutes, 0) / teams.length
      ) * 60 * 1000; // Converter para milissegundos
      
      const config = {
        maxRetries: avgRetryCount,
        retryDelay: avgRetryInterval,
        backoffMultiplier: 2,
        timeout: 30000,
        lastUpdated: new Date().toISOString(),
        teamsCount: teams.length,
        note: "Calculated from actual team configurations"
      };

      res.json(config);
    } catch (error) {
      logger.error('Error in retry config GET endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/config/retry', async (req, res) => {
    try {
      logger.info('PUT /api/keninduty/config/retry called', { body: req.body });
      
      const newConfig = retryConfigSchema.parse(req.body);
      
      // Mock update - substitua por lógica real de persistência
      logger.info('Updating retry configuration:', newConfig);
      
      const updatedConfig = {
        ...newConfig,
        lastUpdated: new Date().toISOString()
      };

      res.json({
        success: true,
        message: 'Retry configuration updated successfully',
        config: updatedConfig
      });
    } catch (error) {
      logger.error('Error in retry config PUT endpoint:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: 'Invalid configuration', 
          details: error.errors 
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Health check endpoint
  router.get('/health', async (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Team management endpoints
  router.get('/teams', async (req, res) => {
    try {
      logger.info('GET /api/keninduty/teams called');
      res.json(teams);
    } catch (error) {
      logger.error('Error in teams GET endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/teams', async (req, res) => {
    try {
      logger.info('POST /api/keninduty/teams called', { body: req.body });
      
      const { name, members, escalationPolicy } = req.body;
      
      if (!name || !members || !escalationPolicy) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: name, members, escalationPolicy' 
        });
      }

      const newTeam = {
        id: `team-${Date.now()}`,
        name,
        members: members.map((member: any, index: number) => ({
          id: `member-${Date.now()}-${index}`,
          ...member
        })),
        escalationPolicy
      };

      teams.push(newTeam);
      
      addSystemLog('success', 'team', `Time criado: ${name}`, undefined, undefined, newTeam.id, undefined, {
        teamId: newTeam.id,
        teamName: newTeam.name,
        membersCount: newTeam.members.length,
        escalationPolicy: newTeam.escalationPolicy
      });
      
      logger.info('Team created successfully:', { teamId: newTeam.id, teamName: newTeam.name });
      
      res.status(201).json({
        success: true,
        data: newTeam
      });
      saveData();
    } catch (error) {
      logger.error('Error in teams POST endpoint:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  router.put('/teams/:id', async (req, res) => {
    try {
      const { id } = req.params;
      logger.info('PUT /api/keninduty/teams/:id called', { teamId: id, body: req.body });
      
      const { name, members, escalationPolicy } = req.body;
      
      if (!name || !members || !escalationPolicy) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: name, members, escalationPolicy' 
        });
      }

      const teamIndex = teams.findIndex(t => t.id === id);
      if (teamIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Team not found' 
        });
      }

      const updatedTeam = {
        ...teams[teamIndex],
        name,
        members: members.map((member: any, index: number) => ({
          id: member.id || `member-${Date.now()}-${index}`,
          ...member
        })),
        escalationPolicy
      };

      teams[teamIndex] = updatedTeam;
      
      logger.info('Team updated successfully:', { teamId: id, teamName: updatedTeam.name });
      
      res.json({
        success: true,
        data: updatedTeam
      });
      saveData();
    } catch (error) {
      logger.error('Error in teams PUT endpoint:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  router.delete('/teams/:id', async (req, res) => {
    try {
      const { id } = req.params;
      logger.info('DELETE /api/keninduty/teams/:id called', { teamId: id });
      
      const teamIndex = teams.findIndex(t => t.id === id);
      if (teamIndex === -1) {
        return res.status(404).json({ 
          success: false, 
          error: 'Team not found' 
        });
      }

      const deletedTeam = teams.splice(teamIndex, 1)[0];
      
      logger.info('Team deleted successfully:', { teamId: id, teamName: deletedTeam.name });
      
      res.json({
        success: true,
        message: 'Team deleted successfully',
        data: deletedTeam
      });
      saveData();
    } catch (error) {
      logger.error('Error in teams DELETE endpoint:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  // Alert management endpoints
  router.get('/alerts', async (req, res) => {
    try {
      logger.info('GET /api/keninduty/alerts called');
      // Adiciona resumo de tentativas e status
      const alertsWithDetails = alerts.map(alert => ({
        ...alert,
        attempts: alert.attempts || [],
        attemptsCount: (alert.attempts || []).length,
        resolved: alert.status === 'resolved',
        failed: alert.status === 'failed',
        active: alert.status === 'active',
        lastAttempt: (alert.attempts || []).slice(-1)[0] || null
      }));
      res.json(alertsWithDetails);
    } catch (error) {
      logger.error('Error in alerts GET endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/alerts', async (req, res) => {
    try {
      logger.info('POST /api/keninduty/alerts called', { body: req.body });
      
      const { title, description, severity, provider, teamId, query } = req.body;
      
      if (!title || !severity || !provider || !teamId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: title, severity, provider, teamId' 
        });
      }

      const newAlert = {
        id: `alert-${Date.now()}`,
        title,
        description: description || '',
        severity,
        provider,
        teamId,
        status: 'active',
        createdAt: new Date().toISOString(),
        query: query || null
      };

      alerts.push(newAlert);
      
      logger.info('Alert created successfully:', { alertId: newAlert.id, title: newAlert.title });
      
      res.status(201).json({
        success: true,
        data: newAlert
      });
      saveData();
    } catch (error) {
      logger.error('Error in alerts POST endpoint:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  // Call attempts endpoints
  router.get('/calls', async (req, res) => {
    try {
      logger.info('GET /api/keninduty/calls called');
      res.json(callAttempts);
    } catch (error) {
      logger.error('Error in calls GET endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Sessions endpoints - Retorna dados reais de sessões de chamada
  
  // Listar todas as sessões
  router.get('/sessions', async (req, res) => {
    try {
      logger.info('GET /api/keninduty/sessions called');
      
      const sessions = alerts.map(alert => {
        const team = teams.find(t => t.id === alert.teamId);
        const alertAttempts = alert.attempts || [];
        
        // Determinar status da sessão
        let sessionStatus = 'pending';
        if (alert.status === 'resolved') {
          sessionStatus = 'completed';
        } else if (alertAttempts.length > 0) {
          const lastAttempt = alertAttempts[alertAttempts.length - 1];
          if (lastAttempt.status === 'answered') {
            sessionStatus = 'completed';
          } else if (lastAttempt.status === 'failed' && team && alertAttempts.length >= team.escalationPolicy.retryCount) {
            sessionStatus = 'failed';
          } else {
            sessionStatus = 'in_progress';
          }
        }

        return {
          id: alert.id,
          alert_id: alert.id,
          status: sessionStatus,
          created_at: alert.createdAt,
          attempts_count: alertAttempts.length,
          team_name: team?.name || 'Unknown Team'
        };
      });

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      logger.error('Error in sessions list GET endpoint:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }
  });

  // Buscar sessão específica
  router.get('/sessions/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      logger.info('GET /api/keninduty/sessions/:sessionId called', { sessionId });

      // Buscar alerta correspondente ao sessionId
      // Assumindo que sessionId pode ser o alertId ou um ID relacionado
  
      let alert = alerts.find(a => a.id === sessionId || a.id.includes(sessionId));
      
      if (!alert) {
        return res.status(404).json({ 
          success: false, 
          error: 'Session not found' 
        });
      }

      // Buscar o time do alerta
      const team = teams.find(t => t.id === alert.teamId);
      if (!team) {
        return res.status(404).json({ 
          success: false, 
          error: 'Team not found for this session' 
        });
      }

      // Buscar tentativas de chamada relacionadas a este alerta
      const alertAttempts = alert.attempts || [];
      
      // Determinar o status da sessão baseado nas tentativas
      let sessionStatus = 'pending';
      if (alert.status === 'resolved') {
        sessionStatus = 'completed';
      } else if (alertAttempts.length > 0) {
        const lastAttempt = alertAttempts[alertAttempts.length - 1];
        if (lastAttempt.status === 'answered') {
          sessionStatus = 'completed';
        } else if (lastAttempt.status === 'failed' && alertAttempts.length >= team.escalationPolicy.retryCount) {
          sessionStatus = 'failed';
        } else {
          sessionStatus = 'in_progress';
        }
      }

      // Calcular retry_count e max_retries
      const currentMemberAttempts = alertAttempts.length > 0 ? 
        alertAttempts.filter(a => a.memberId === alertAttempts[alertAttempts.length - 1].memberId).length : 0;
      const maxRetries = team.escalationPolicy.retryCount;

      // Gerar call_sids baseado nas tentativas (mais realista)
      const callSids = alertAttempts.map((attempt, index) => {
        const timestamp = new Date(attempt.timestamp || alert.createdAt).getTime();
        return `CA${timestamp}${index.toString().padStart(6, '0')}`;
      });

      // Determinar phone e message
      let phone = '';
      let message = '';
      
      if (alertAttempts.length > 0) {
        const lastAttempt = alertAttempts[alertAttempts.length - 1];
        const lastMember = team.members.find(m => m.id === lastAttempt.memberId);
        phone = lastMember?.phone || '';
        message = alert.description || alert.title || 'Alerta do sistema';
      } else {
        // Primeira tentativa - usar membro primary
        const primaryMember = team.members.find(m => m.role === 'primary');
        phone = primaryMember?.phone || '';
        message = alert.description || alert.title || 'Alerta do sistema';
      }

      // Gerar audio_url baseado no alerta (mais realista)
      const alertTimestamp = new Date(alert.createdAt).getTime();
      const audioUrl = `https://storage.googleapis.com/keninduty/audio_${alertTimestamp}.mp3`;

      // Determinar timestamps
      const createdAt = alert.createdAt;
      const lastAttempt = alertAttempts.length > 0 ? 
        alertAttempts[alertAttempts.length - 1].timestamp : createdAt;
      const completedAt = sessionStatus === 'completed' ? 
        alertAttempts.find(a => a.status === 'answered')?.timestamp : null;

      const callSession = {
        id: sessionId,
        phone: phone,
        message: message,
        audio_url: audioUrl,
        alert_id: alert.id,
        retry_count: currentMemberAttempts,
        max_retries: maxRetries,
        status: sessionStatus,
        call_sids: callSids,
        last_attempt: lastAttempt,
        created_at: createdAt,
        completed_at: completedAt
      };

      res.json({
        success: true,
        data: callSession
      });
    } catch (error) {
      logger.error('Error in sessions GET endpoint:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }
  });

  // Stats endpoint
  router.get('/stats', async (req, res) => {
    try {
      logger.info('GET /api/keninduty/stats called');
      
      const stats = {
        activeAlerts: alerts.filter(a => a.status === 'active').length,
        totalTeams: teams.length,
        totalMembers: teams.reduce((sum, team) => sum + team.members.length, 0),
        totalAlerts: alerts.length,
        totalCallAttempts: callAttempts.length,
        recentActivity: alerts.slice(-5).map(alert => ({
          id: alert.id,
          type: 'alert',
          message: alert.title,
          timestamp: alert.createdAt,
          status: alert.status
        }))
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error in stats GET endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Endpoint para receber callbacks de status de chamadas do KeninDuty
  const webhookCallStatusSchema = z.object({
    alertId: z.string(),
    status: z.enum(['answered', 'no-answer', 'failed', 'busy']),
    memberId: z.string().optional(),
    memberName: z.string().optional(),
    timestamp: z.string().optional(),
    notes: z.string().optional(),
    callId: z.string().optional(),
    duration: z.number().optional()
  });

  router.post('/webhook/call-status', async (req, res) => {
    try {
      const payload = webhookCallStatusSchema.parse(req.body);
      logger.info('POST /api/keninduty/webhook/call-status called', { payload });
      const { alertId, status, memberId, memberName, timestamp, notes, callId, duration } = payload;
      
      // Localizar o alerta correspondente
      let alert = alerts.find(a => a.id === alertId);
      if (!alert) {
        return res.status(404).json({ success: false, error: 'Alert not found' });
      }

      // Localizar o time do alerta
      const team = teams.find(t => t.id === alert.teamId);
      if (!team) {
        return res.status(404).json({ success: false, error: 'Team not found' });
      }

      // Atualizar status do alerta
      if (status === 'answered') {
        alert.status = 'resolved';
      } else if (status === 'no-answer' || status === 'busy' || status === 'failed') {
        alert.status = 'active';
      }

      // Registrar histórico da chamada
      if (!alert.attempts) alert.attempts = [];
      alert.attempts.push({
        status,
        memberId,
        memberName,
        timestamp: timestamp || new Date().toISOString(),
        notes: notes || '',
        callId,
        duration
      });

      // Lógica de escalonamento
      let nextAction = 'close';
      let nextMember = null;
      const maxRetries = team.escalationPolicy.retryCount || 3;

      if (status === 'answered') {
        nextAction = 'close';
      } else if (status === 'no-answer' || status === 'busy' || status === 'failed') {
        // Contar tentativas para este membro específico
        const memberAttempts = alert.attempts.filter(a => a.memberId === memberId);
        const currentRetries = memberAttempts.length;

        if (currentRetries < maxRetries) {
          nextAction = 'retry';
          // Encontrar o membro atual
          const currentMember = team.members.find(m => m.id === memberId);
          if (currentMember) {
            nextMember = currentMember;
          }
        } else {
          // Escalonar para o próximo membro
          const availableMembers = team.members.filter(m => m.role === 'primary' || m.role === 'secondary');
          const currentMemberIndex = availableMembers.findIndex(m => m.id === memberId);
          
          if (currentMemberIndex < availableMembers.length - 1) {
            nextAction = 'escalate';
            nextMember = availableMembers[currentMemberIndex + 1];
          } else {
            nextAction = 'close';
            alert.status = 'failed';
          }
        }
      }

      const responseData: any = {
        alertId,
        status: alert.status,
        attemptsCount: alert.attempts.length,
        lastAttempt: alert.attempts.slice(-1)[0],
        nextAction,
        currentRetries: alert.attempts.filter(a => a.memberId === memberId).length,
        maxRetries: maxRetries,
        teamId: team.id,
        teamName: team.name
      };

      // Adicionar dados do próximo membro se houver
      if (nextMember) {
        responseData.nextMember = {
          id: nextMember.id,
          name: nextMember.name,
          phone: nextMember.phone,
          email: nextMember.email,
          role: nextMember.role
        };
      }

      res.json({
        success: true,
        message: 'Call status processed',
        data: responseData
      });
    } catch (error) {
      logger.error('Error in webhook call status:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: 'Invalid payload', details: error.errors });
      } else {
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    }
  });

  return router;
} 