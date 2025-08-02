import { Router } from 'express';
import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
}

// Interfaces para tipagem das requisições
interface CallInitRequest {
  callId: string;
  teamId: string;
  alertId: string;
}

interface CallStatusRequest {
  callId: string;
  status: string;
  duration: number;
  notes?: string;
  timestamp?: string;
  incidentId?: string;
  provider?: string;
}

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  status?: 'available' | 'busy' | 'offline';
}

interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  oncall: string; // ID do membro de plantão atual
  schedule?: ScheduleShift[];
  createdAt: string;
  updatedAt: string;
  retryPolicy?: {
    maxRetries: number;
    retryInterval: number; // em segundos
    escalationDelay: number; // em segundos
    enabled: boolean;
  };
}

interface ScheduleShift {
  userId: string;
  userName: string;
  phone: string;
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  daysOfWeek: number[]; // 0=Sunday, 1=Monday, etc.
}

interface AlertRequest {
  teamId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  provider?: string;
}

interface OnCallSchedule {
  id: string;
  name: string;
  teamId: string;
  timezone: string;
  shifts: ScheduleShift[];
  isActive: boolean;
}

// Provider account interfaces
interface ProviderAccount {
  id: string;
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana';
  enabled: boolean;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  lastTested?: string;
  status: 'active' | 'inactive' | 'error';
}

interface CreateProviderAccountRequest {
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana';
  config: Record<string, any>;
}

interface UpdateProviderAccountRequest {
  name?: string;
  enabled?: boolean;
  config?: Record<string, any>;
}

// Mock database - expandido para gerenciamento completo
let mockProviderAccounts: ProviderAccount[] = [
  {
    id: '1',
    name: 'Produção New Relic',
    type: 'newrelic',
    enabled: true,
    config: {
      apiKey: 'NRAK-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      accountId: '12345',
      region: 'US'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Staging Datadog',
    type: 'datadog',
    enabled: true,
    config: {
      apiKey: 'dd-staging-api-key',
      appKey: 'dd-staging-app-key',
      site: 'datadoghq.com'
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Development Grafana',
    type: 'grafana',
    enabled: false,
    config: {
      url: 'https://dev-grafana.company.com',
      apiKey: 'glsa_dev_key_here',
      orgId: '1'
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    status: 'inactive'
  }
];

let mockTeams: Team[] = [
  {
    id: 'team-1751955256027',
    name: 'DevOps Team',
    description: 'Equipe responsável por infraestrutura e deployments',
    members: [
      {
        id: 'user1',
        name: 'João Silva',
        phone: '+5511999999999',
        email: 'joao@empresa.com',
        role: 'Senior DevOps',
        status: 'available'
      },
      {
        id: 'user2',
        name: 'Maria Santos',
        phone: '+5511888888888',
        email: 'maria@empresa.com',
        role: 'DevOps Engineer',
        status: 'available'
      },
      {
        id: 'user3',
        name: 'Carlos Oliveira',
        phone: '+5511777777777',
        email: 'carlos@empresa.com',
        role: 'SRE',
        status: 'available'
      }
    ],
    oncall: 'user1',
    schedule: [
      {
        userId: 'user1',
        userName: 'João Silva',
        phone: '+5511999999999',
        startTime: '09:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5] // Segunda a Sexta
      },
      {
        userId: 'user2',
        userName: 'Maria Santos',
        phone: '+5511888888888',
        startTime: '18:00',
        endTime: '02:00',
        daysOfWeek: [1, 2, 3, 4, 5] // Noite Segunda a Sexta
      },
      {
        userId: 'user3',
        userName: 'Carlos Oliveira',
        phone: '+5511777777777',
        startTime: '00:00',
        endTime: '23:59',
        daysOfWeek: [0, 6] // Final de semana
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    retryPolicy: {
      maxRetries: 3,
      retryInterval: 5,
      escalationDelay: 10,
      enabled: true,
    }
  },
  {
    id: 'team-backend-dev',
    name: 'Backend Development',
    description: 'Equipe de desenvolvimento backend',
    members: [
      {
        id: 'user4',
        name: 'Ana Costa',
        phone: '+5511666666666',
        email: 'ana@empresa.com',
        role: 'Tech Lead',
        status: 'available'
      },
      {
        id: 'user5',
        name: 'Roberto Lima',
        phone: '+5511555555555',
        email: 'roberto@empresa.com',
        role: 'Senior Developer',
        status: 'busy'
      }
    ],
    oncall: 'user4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    retryPolicy: {
      maxRetries: 2,
      retryInterval: 3,
      escalationDelay: 5,
      enabled: true,
    }
  }
];

let callAttempts: Array<{
  id: string;
  callId: string;
  teamId: string;
  memberId: string;
  memberName: string;
  phone: string;
  status: string;
  timestamp: string;
  duration?: number;
  alertId?: string;
  provider?: string;
  retryCount: number;
}> = [];

let alerts: Array<{
  id: string;
  teamId: string;
  message: string;
  severity: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  provider?: string;
  incidentId?: string;
}> = [];

let schedules: OnCallSchedule[] = [
  {
    id: 'schedule-1',
    name: 'DevOps Rotation',
    teamId: 'team-1751955256027',
    timezone: 'America/Sao_Paulo',
    isActive: true,
    shifts: [
      {
        userId: 'user1',
        userName: 'João Silva',
        phone: '+5511999999999',
        startTime: '09:00',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      {
        userId: 'user2',
        userName: 'Maria Santos',
        phone: '+5511888888888',
        startTime: '18:00',
        endTime: '02:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    ]
  }
];

// Função para determinar quem está de plantão baseado no horário
function getCurrentOnCallMember(team: Team): TeamMember | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
  const currentTime = currentHour * 60 + currentMinute; // em minutos

  if (!team.schedule || team.schedule.length === 0) {
    // Se não há schedule, usar o membro padrão de plantão
    return team.members.find(m => m.id === team.oncall) || team.members[0] || null;
  }

  // Procurar por um shift ativo no momento atual
  for (const shift of team.schedule) {
    if (!shift.daysOfWeek.includes(currentDay)) {
      continue;
    }

    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    let endTime = endHour * 60 + endMinute;
    
    // Handle overnight shifts (e.g., 18:00 to 02:00)
    if (endTime <= startTime) {
      endTime += 24 * 60; // Add 24 hours
      
      // Check if current time is in the overnight period
      if (currentTime >= startTime || currentTime <= (endTime - 24 * 60)) {
        const member = team.members.find(m => m.id === shift.userId);
        if (member && member.status === 'available') {
          return member;
        }
      }
    } else {
      // Normal shift within the same day
      if (currentTime >= startTime && currentTime <= endTime) {
        const member = team.members.find(m => m.id === shift.userId);
        if (member && member.status === 'available') {
          return member;
        }
      }
    }
  }

  // Se nenhum shift ativo, usar o membro padrão de plantão
  return team.members.find(m => m.id === team.oncall && m.status === 'available') || 
         team.members.find(m => m.status === 'available') || 
         team.members[0] || null;
}

// Função para obter próximo membro para escalação
function getNextMemberForEscalation(team: Team, currentMemberId: string): TeamMember | null {
  const currentIndex = team.members.findIndex(m => m.id === currentMemberId);
  
  // Tentar próximos membros disponíveis
  for (let i = 1; i < team.members.length; i++) {
    const nextIndex = (currentIndex + i) % team.members.length;
    const nextMember = team.members[nextIndex];
    
    if (nextMember.status === 'available') {
      return nextMember;
    }
  }
  
  return null;
}

export async function createRouter(options: RouterOptions): Promise<express.Router> {
  const { logger, config } = options;
  const router = Router();

  router.use(express.json());

  // Endpoint de teste sem autenticação (DEVE VIR PRIMEIRO)
  router.get('/test', (_req, res) => {
    res.json({ 
      status: 'success',
      message: 'Endpoint de teste funcionando!',
      timestamp: new Date().toISOString()
    });
  });

  // ========== ENDPOINTS DE PROVIDER ACCOUNTS ==========

  // Listar todas as contas de providers
  router.get('/provider-accounts', async (req, res) => {
    try {
      const { type } = req.query;
      
      let accounts = mockProviderAccounts;
      if (type) {
        accounts = accounts.filter(account => account.type === type);
      }
      
      logger.info(`Fetching provider accounts, type filter: ${type || 'all'}`);
      res.json(accounts);
    } catch (error) {
      logger.error('Error fetching provider accounts');
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Obter uma conta específica
  router.get('/provider-accounts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const account = mockProviderAccounts.find(acc => acc.id === id);
      
      if (!account) {
        return res.status(404).json({ error: 'Provider account not found' });
      }
      
      logger.info(`Fetching provider account: ${id}`);
      res.json(account);
    } catch (error) {
      logger.error('Error fetching provider account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Criar uma nova conta de provider
  router.post('/provider-accounts', async (req, res) => {
    try {
      const accountData: CreateProviderAccountRequest = req.body;
      
      // Validação básica
      if (!accountData.name || !accountData.type || !accountData.config) {
        return res.status(400).json({ error: 'Missing required fields: name, type, config' });
      }

      if (!['newrelic', 'datadog', 'grafana'].includes(accountData.type)) {
        return res.status(400).json({ error: 'Invalid provider type' });
      }

      const newAccount: ProviderAccount = {
        id: Date.now().toString(),
        name: accountData.name,
        type: accountData.type,
        enabled: true,
        config: accountData.config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      mockProviderAccounts.push(newAccount);
      
      logger.info(`Created new provider account: ${newAccount.name} (${newAccount.type})`);
      res.status(201).json(newAccount);
    } catch (error) {
      logger.error('Error creating provider account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Atualizar uma conta existente
  router.put('/provider-accounts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData: UpdateProviderAccountRequest = req.body;
      
      const accountIndex = mockProviderAccounts.findIndex(acc => acc.id === id);
      if (accountIndex === -1) {
        return res.status(404).json({ error: 'Provider account not found' });
      }

      const existingAccount = mockProviderAccounts[accountIndex];
      const updatedAccount: ProviderAccount = {
        ...existingAccount,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      mockProviderAccounts[accountIndex] = updatedAccount;
      
      logger.info(`Updated provider account: ${id}`);
      res.json(updatedAccount);
    } catch (error) {
      logger.error('Error updating provider account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Deletar uma conta
  router.delete('/provider-accounts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const accountIndex = mockProviderAccounts.findIndex(acc => acc.id === id);
      if (accountIndex === -1) {
        return res.status(404).json({ error: 'Provider account not found' });
      }

      const deletedAccount = mockProviderAccounts.splice(accountIndex, 1)[0];
      
      logger.info(`Deleted provider account: ${deletedAccount.name} (${deletedAccount.type})`);
      res.json({ message: 'Provider account deleted successfully', account: deletedAccount });
    } catch (error) {
      logger.error('Error deleting provider account:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Testar conexão de uma conta específica
  router.post('/provider-accounts/:id/test-connection', async (req, res) => {
    try {
      const { id } = req.params;
      
      const account = mockProviderAccounts.find(acc => acc.id === id);
      if (!account) {
        return res.status(404).json({ error: 'Provider account not found' });
      }

      // Simular teste de conexão baseado no tipo
      let testResult = {
        success: false,
        message: '',
        details: {}
      };

      switch (account.type) {
        case 'newrelic':
          testResult = {
            success: true,
            message: 'Conexão com New Relic estabelecida com sucesso',
            details: {
              accountId: account.config.accountId,
              region: account.config.region || 'US'
            }
          };
          break;
        case 'datadog':
          testResult = {
            success: true,
            message: 'Conexão com Datadog estabelecida com sucesso',
            details: {
              site: account.config.site || 'datadoghq.com'
            }
          };
          break;
        case 'grafana':
          testResult = {
            success: true,
            message: 'Conexão com Grafana estabelecida com sucesso',
            details: {
              url: account.config.url,
              orgId: account.config.orgId || '1'
            }
          };
          break;
      }

      // Atualizar último teste
      const accountIndex = mockProviderAccounts.findIndex(acc => acc.id === id);
      mockProviderAccounts[accountIndex] = {
        ...account,
        lastTested: new Date().toISOString(),
        status: testResult.success ? 'active' : 'error',
        updatedAt: new Date().toISOString()
      };

      logger.info(`Tested connection for provider account: ${account.name} - ${testResult.success ? 'SUCCESS' : 'FAILED'}`);
      res.json(testResult);
    } catch (error) {
      logger.error('Error testing provider connection:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Listar contas por tipo com estatísticas
  router.get('/provider-accounts/stats/by-type', async (req, res) => {
    try {
      const stats = {
        newrelic: {
          total: mockProviderAccounts.filter(acc => acc.type === 'newrelic').length,
          active: mockProviderAccounts.filter(acc => acc.type === 'newrelic' && acc.enabled).length,
          accounts: mockProviderAccounts.filter(acc => acc.type === 'newrelic').map(acc => ({
            id: acc.id,
            name: acc.name,
            enabled: acc.enabled,
            status: acc.status
          }))
        },
        datadog: {
          total: mockProviderAccounts.filter(acc => acc.type === 'datadog').length,
          active: mockProviderAccounts.filter(acc => acc.type === 'datadog' && acc.enabled).length,
          accounts: mockProviderAccounts.filter(acc => acc.type === 'datadog').map(acc => ({
            id: acc.id,
            name: acc.name,
            enabled: acc.enabled,
            status: acc.status
          }))
        },
        grafana: {
          total: mockProviderAccounts.filter(acc => acc.type === 'grafana').length,
          active: mockProviderAccounts.filter(acc => acc.type === 'grafana' && acc.enabled).length,
          accounts: mockProviderAccounts.filter(acc => acc.type === 'grafana').map(acc => ({
            id: acc.id,
            name: acc.name,
            enabled: acc.enabled,
            status: acc.status
          }))
        }
      };

      logger.info('Fetching provider accounts statistics');
      res.json(stats);
    } catch (error) {
      logger.error('Error fetching provider statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ========== ENDPOINTS DE TEAMS ==========

  // Listar todos os times
  router.get('/teams', (_req, res) => {
    logger.info('Fetching all teams');
    res.json(mockTeams);
  });

  // Obter um time específico
  router.get('/teams/:id', (req, res) => {
    const { id } = req.params;
    const team = mockTeams.find(t => t.id === id);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    return res.json(team);
  });

  // Criar um novo time
  router.post('/teams', (req, res) => {
    const { name, description, members } = req.body;
    
    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Name and members are required' });
    }

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      description: description || '',
      members: members.map((member: any, index: number) => ({
        id: member.id || `user-${Date.now()}-${index}`,
        name: member.name,
        phone: member.phone,
        email: member.email,
        role: member.role,
        status: member.status || 'available'
      })),
      oncall: members[0]?.id || `user-${Date.now()}-0`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      retryPolicy: {
        maxRetries: 3,
        retryInterval: 5,
        escalationDelay: 10,
        enabled: true,
      }
    };

    mockTeams.push(newTeam);
    
    logger.info(`Created new team: ${newTeam.id}`);
    res.status(201).json(newTeam);
  });

  // Atualizar um time
  router.put('/teams/:id', (req, res) => {
    const { id } = req.params;
    const teamIndex = mockTeams.findIndex(t => t.id === id);
    
    if (teamIndex === -1) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const updatedTeam = {
      ...mockTeams[teamIndex],
      ...req.body,
      id, // Keep original ID
      updatedAt: new Date().toISOString()
    };

    mockTeams[teamIndex] = updatedTeam;
    
    logger.info(`Updated team: ${id}`);
    res.json(updatedTeam);
  });

  // Deletar um time
  router.delete('/teams/:id', (req, res) => {
    const { id } = req.params;
    const teamIndex = mockTeams.findIndex(t => t.id === id);
    
    if (teamIndex === -1) {
      return res.status(404).json({ error: 'Team not found' });
    }

    mockTeams.splice(teamIndex, 1);
    
    logger.info(`Deleted team: ${id}`);
    res.status(204).send();
  });

  // ========== ENDPOINTS DE MEMBROS ==========

  // Adicionar membro ao time
  router.post('/teams/:teamId/members', (req, res) => {
    const { teamId } = req.params;
    const team = mockTeams.find(t => t.id === teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      role: req.body.role,
      status: req.body.status || 'available'
    };

    team.members.push(newMember);
    team.updatedAt = new Date().toISOString();

    logger.info(`Added member ${newMember.id} to team ${teamId}`);
    res.status(201).json(newMember);
  });

  // Remover membro do time
  router.delete('/teams/:teamId/members/:memberId', (req, res) => {
    const { teamId, memberId } = req.params;
    const team = mockTeams.find(t => t.id === teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const memberIndex = team.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Se era o membro de plantão, escolher outro
    if (team.oncall === memberId) {
      team.oncall = team.members.find(m => m.id !== memberId)?.id || '';
    }

    team.members.splice(memberIndex, 1);
    team.updatedAt = new Date().toISOString();

    logger.info(`Removed member ${memberId} from team ${teamId}`);
    res.status(204).send();
  });

  // Atualizar status do membro
  router.patch('/teams/:teamId/members/:memberId/status', (req, res) => {
    const { teamId, memberId } = req.params;
    const { status } = req.body;
    
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const member = team.members.find(m => m.id === memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    member.status = status;
    team.updatedAt = new Date().toISOString();

    logger.info(`Updated member ${memberId} status to ${status}`);
    res.json(member);
  });

  // Atualizar dados completos do membro
  router.patch('/teams/:teamId/members/:memberId', (req, res) => {
    const { teamId, memberId } = req.params;
    const updateData = req.body;
    
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const member = team.members.find(m => m.id === memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Atualizar apenas os campos fornecidos
    if (updateData.name !== undefined) member.name = updateData.name;
    if (updateData.phone !== undefined) member.phone = updateData.phone;
    if (updateData.email !== undefined) member.email = updateData.email;
    if (updateData.role !== undefined) member.role = updateData.role;
    if (updateData.status !== undefined) member.status = updateData.status;

    team.updatedAt = new Date().toISOString();

    logger.info(`Updated member ${memberId} data: ${JSON.stringify(updateData)}`);
    res.json(member);
  });

  // ========== ENDPOINTS DE PLANTÃO ==========

  // Obter informações de quem está de plantão
  router.get('/teams/:teamId/oncall', (req, res) => {
    const { teamId } = req.params;
    const team = mockTeams.find(t => t.id === teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const onCallMember = getCurrentOnCallMember(team);
    
    if (!onCallMember) {
      return res.status(404).json({ error: 'No member currently on call' });
    }

    res.json({
      teamId: team.id,
      teamName: team.name,
      onCallMember,
      schedule: team.schedule
    });
  });

  // Definir membro de plantão atual
  router.post('/teams/:teamId/oncall', (req, res) => {
    const { teamId } = req.params;
    const { memberId } = req.body;
    
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const member = team.members.find(m => m.id === memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    team.oncall = memberId;
    team.updatedAt = new Date().toISOString();

    logger.info(`Set member ${memberId} as on-call for team ${teamId}`);
    res.json({
      teamId: team.id,
      teamName: team.name,
      onCallMember: member
    });
  });

  // ========== ENDPOINTS DE SCHEDULE ==========

  // Obter schedules de um time
  router.get('/teams/:teamId/schedules', (req, res) => {
    const { teamId } = req.params;
    const teamSchedules = schedules.filter(s => s.teamId === teamId);
    res.json(teamSchedules);
  });

  // Criar novo schedule
  router.post('/teams/:teamId/schedules', (req, res) => {
    const { teamId } = req.params;
    const { name, timezone, shifts } = req.body;

    const newSchedule: OnCallSchedule = {
      id: `schedule-${Date.now()}`,
      name,
      teamId,
      timezone: timezone || 'America/Sao_Paulo',
      shifts: shifts || [],
      isActive: true
    };

    schedules.push(newSchedule);

    // Atualizar o schedule do time
    const team = mockTeams.find(t => t.id === teamId);
    if (team) {
      team.schedule = shifts;
      team.updatedAt = new Date().toISOString();
    }

    logger.info(`Created schedule ${newSchedule.id} for team ${teamId}`);
    res.status(201).json(newSchedule);
  });

  // ========== ENDPOINTS DE ALERTAS ==========

  // Listar alertas
  router.get('/alerts', (req, res) => {
    const { teamId, status, provider } = req.query;
    
    let filteredAlerts = alerts;
    
    if (teamId) {
      filteredAlerts = filteredAlerts.filter(a => a.teamId === teamId);
    }
    
    if (status) {
      filteredAlerts = filteredAlerts.filter(a => a.status === status);
    }
    
    if (provider) {
      filteredAlerts = filteredAlerts.filter(a => a.provider === provider);
    }

    res.json(filteredAlerts);
  });

  // Criar novo alerta e disparar chamada
  router.post('/alerts', (req, res) => {
    const { teamId, message, severity, provider } = req.body as AlertRequest;
    
    if (!teamId || !message) {
      return res.status(400).json({ error: 'teamId and message are required' });
    }

    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const alert = {
      id: `alert-${Date.now()}`,
      teamId,
      message,
      severity: severity || 'medium',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      provider,
      incidentId: `incident-${Date.now()}`
    };

    alerts.push(alert);

    // Simular chamada automática
    const onCallMember = getCurrentOnCallMember(team);
    if (onCallMember) {
      const callAttempt = {
        id: `attempt-${Date.now()}`,
        callId: alert.id,
        teamId,
        memberId: onCallMember.id,
        memberName: onCallMember.name,
        phone: onCallMember.phone,
        status: 'initiated',
        timestamp: new Date().toISOString(),
        alertId: alert.id,
        provider,
        retryCount: 0
      };

      callAttempts.push(callAttempt);

      logger.info(`Alert ${alert.id} created and call initiated to ${onCallMember.name}`);
    }

    res.status(201).json(alert);
  });

  // ========== INTEGRAÇÃO COM API GO ==========

  // Rota de health check
  router.get('/health', (_req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'kenin-duty',
      timestamp: new Date().toISOString(),
      message: 'Plugin funcionando! 🎉'
    });
  });



  // **NOVO ENDPOINT: Inicializar chamada**
  router.post('/calls/init', (req, res) => {
    logger.info('Call init request received:', { body: req.body });
    
    const { callId, teamId, alertId }: CallInitRequest = req.body;

    if (!callId || !teamId || !alertId) {
      return res.status(400).json({
        success: false,
        message: 'callId, teamId and alertId are required'
      });
    }

    // Buscar o time
    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: `Team not found: ${teamId}`
      });
    }

    // Buscar o membro de plantão baseado no schedule
    const onCallMember = getCurrentOnCallMember(team);
    if (!onCallMember) {
      return res.status(404).json({
        success: false,
        message: `No member currently on call for team: ${teamId}`
      });
    }

    // Registrar a tentativa de chamada
    const callAttempt = {
      id: `attempt-${Date.now()}`,
      callId,
      teamId,
      memberId: onCallMember.id,
      memberName: onCallMember.name,
      phone: onCallMember.phone,
      status: 'initiated',
      timestamp: new Date().toISOString(),
      alertId,
      retryCount: 0
    };

    callAttempts.push(callAttempt);

    logger.info(`Call initialized for team ${teamId}, member: ${onCallMember.name}`);

    res.json({
      success: true,
      message: 'Call initialized successfully',
      data: {
        callId,
        teamId,
        teamName: team.name,
        firstMember: {
          id: onCallMember.id,
          name: onCallMember.name,
          phone: onCallMember.phone,
          email: onCallMember.email,
          role: onCallMember.role
        },
        maxRetries: 3,
        availableMembers: team.members.filter(m => m.status === 'available').length
      }
    });
  });

  // **NOVO ENDPOINT: Callback de status da chamada**
  router.post('/callback/call-status', (req, res) => {
    logger.info('Call status callback received:', { body: req.body });
    
    const { callId, status, duration, incidentId, provider }: CallStatusRequest = req.body;

    if (!callId || !status) {
      return res.status(400).json({
        success: false,
        message: 'callId and status are required'
      });
    }

    // Encontrar a tentativa de chamada
    const attemptIndex = callAttempts.findIndex(a => a.callId === callId);
    if (attemptIndex === -1) {
      logger.warn(`Call attempt not found for callId: ${callId}`);
      return res.json({
        success: true,
        message: 'Call status received but attempt not found'
      });
    }

    const attempt = callAttempts[attemptIndex];
    attempt.status = status;
    attempt.duration = duration;

    const team = mockTeams.find(t => t.id === attempt.teamId);
    
    let nextAction = null;
    let nextNumber = null;

    // Determinar próxima ação baseada no status
    if (status === 'no-answer' || status === 'failed' || status === 'busy') {
      const team = mockTeams.find(t => t.id === attempt.teamId);
      const maxRetries = team?.retryPolicy?.maxRetries || 3;
      
      if (attempt.retryCount < maxRetries - 1) { // Usar configuração do time
        // Tentar novamente com o mesmo membro
        attempt.retryCount++;
        nextAction = 'retry';
        nextNumber = attempt.phone;
        
        logger.info(`Scheduling retry ${attempt.retryCount + 1} for ${attempt.memberName} (max: ${maxRetries})`);
      } else if (team) {
        // Escalar para próximo membro
        const nextMember = getNextMemberForEscalation(team, attempt.memberId);
        if (nextMember) {
          nextAction = 'escalate';
          nextNumber = nextMember.phone;
          
          // Criar nova tentativa para o próximo membro
          const escalationAttempt = {
            id: `attempt-${Date.now()}`,
            callId: `${callId}-escalation-${Date.now()}`,
            teamId: attempt.teamId,
            memberId: nextMember.id,
            memberName: nextMember.name,
            phone: nextMember.phone,
            status: 'initiated',
            timestamp: new Date().toISOString(),
            alertId: attempt.alertId,
            retryCount: 0
          };
          
          callAttempts.push(escalationAttempt);
          
          logger.info(`Escalating to next member: ${nextMember.name} (${nextMember.phone})`);
        }
      }
    } else if (status === 'answered') {
      // Chamada atendida, resolver alerta se existir
      const alert = alerts.find(a => a.id === attempt.alertId);
      if (alert) {
        alert.status = 'acknowledged';
        logger.info(`Alert ${alert.id} acknowledged by ${attempt.memberName}`);
      }
    }

    logger.info(`Call status updated: ${callId} -> ${status}, next action: ${nextAction}`);

    res.json({
      success: true,
      message: 'Call status processed successfully',
      data: {
        callId,
        status,
        duration,
        nextAction,
        nextNumber,
        member: {
          id: attempt.memberId,
          name: attempt.memberName,
          phone: attempt.phone
        }
      }
    });
  });

  // **NOVO ENDPOINT: Buscar tentativas de chamada**
  router.get('/call-attempts', (req, res) => {
    const { teamId, status, alertId } = req.query;
    
    let filteredAttempts = callAttempts;
    
    if (teamId) {
      filteredAttempts = filteredAttempts.filter(a => a.teamId === teamId);
    }
    
    if (status) {
      filteredAttempts = filteredAttempts.filter(a => a.status === status);
    }
    
    if (alertId) {
      filteredAttempts = filteredAttempts.filter(a => a.alertId === alertId);
    }

    // Ordenar por timestamp mais recente
    filteredAttempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(filteredAttempts);
  });

  // **NOVO ENDPOINT: Criar tentativa de chamada manual**
  router.post('/call-attempts', (req, res) => {
    const { teamId, memberId, message, alertId } = req.body;
    
    if (!teamId || !memberId) {
      return res.status(400).json({ error: 'teamId and memberId are required' });
    }

    const team = mockTeams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const member = team.members.find(m => m.id === memberId);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const callAttempt = {
      id: `attempt-${Date.now()}`,
      callId: `manual-${Date.now()}`,
      teamId,
      memberId: member.id,
      memberName: member.name,
      phone: member.phone,
      status: 'initiated',
        timestamp: new Date().toISOString(),
      alertId,
      retryCount: 0
    };

    callAttempts.push(callAttempt);

    logger.info(`Manual call attempt created for ${member.name}`);

    res.status(201).json(callAttempt);
  });

  // **NOVO ENDPOINT: Estatísticas do dashboard**
  router.get('/dashboard/stats', (req, res) => {
    const { timeframe = '24h' } = req.query;
    
    const now = new Date();
    let startTime: Date;
    
    switch (timeframe) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const recentAttempts = callAttempts.filter(a => 
      new Date(a.timestamp) >= startTime
    );

    const recentAlerts = alerts.filter(a => 
      new Date(a.createdAt) >= startTime
    );

    const stats = {
      totalTeams: mockTeams.length,
      totalMembers: mockTeams.reduce((sum, team) => sum + team.members.length, 0),
      activeAlerts: alerts.filter(a => a.status === 'active').length,
      totalCalls: recentAttempts.length,
      successfulCalls: recentAttempts.filter(a => a.status === 'answered').length,
      failedCalls: recentAttempts.filter(a => ['no-answer', 'failed', 'busy'].includes(a.status)).length,
      averageResponseTime: recentAttempts.length > 0 
        ? Math.round(recentAttempts.reduce((sum, a) => sum + (a.duration || 0), 0) / recentAttempts.length)
        : 0,
      alertsByProvider: {
        newrelic: recentAlerts.filter(a => a.provider === 'newrelic').length,
        datadog: recentAlerts.filter(a => a.provider === 'datadog').length,
        grafana: recentAlerts.filter(a => a.provider === 'grafana').length,
        manual: recentAlerts.filter(a => !a.provider).length
      },
      callsByStatus: {
        answered: recentAttempts.filter(a => a.status === 'answered').length,
        'no-answer': recentAttempts.filter(a => a.status === 'no-answer').length,
        failed: recentAttempts.filter(a => a.status === 'failed').length,
        busy: recentAttempts.filter(a => a.status === 'busy').length,
        initiated: recentAttempts.filter(a => a.status === 'initiated').length
      }
    };

    res.json(stats);
  });

  // **NOVO ENDPOINT: Configurações**
  router.get('/config', (req, res) => {
    const config = {
      maxRetries: 3,
      retryInterval: 300, // 5 minutes
      escalationDelay: 600, // 10 minutes
      providers: {
        twilio: {
          enabled: true,
          webhook: '/status'
        },
        google: {
          enabled: true,
          bucket: 'keninduty-audio'
        }
      },
      notifications: {
        slack: { enabled: false },
        email: { enabled: true },
        teams: { enabled: false }
      }
    };

    res.json(config);
  });

  router.put('/config', (req, res) => {
    // Mock config update
    const updatedConfig = req.body;
    res.json(updatedConfig);
  });

  // ========== TEAM RETRY POLICY MANAGEMENT ==========

  router.get('/teams/:teamId/retry-policy', (req, res) => {
    const { teamId } = req.params;
    const team = mockTeams.find(t => t.id === teamId);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    const retryPolicy = team.retryPolicy || {
      maxRetries: 3,
      retryInterval: 5,
      escalationDelay: 10,
      enabled: true,
    };
    
    res.json(retryPolicy);
  });

  router.put('/teams/:teamId/retry-policy', (req, res) => {
    const { teamId } = req.params;
    const retryPolicy = req.body;
    
    const teamIndex = mockTeams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    mockTeams[teamIndex].retryPolicy = retryPolicy;
    mockTeams[teamIndex].updatedAt = new Date().toISOString();
    
    logger.info(`Retry policy updated for team ${teamId}:`, retryPolicy);
    
    res.json(mockTeams[teamIndex]);
  });

  // ==============================================
  // 🔥 NOVAS FUNCIONALIDADES - NEW RELIC, DATADOG, GRAFANA
  // ==============================================

  // Lista de providers disponíveis
  router.get('/alerts/providers', (req, res) => {
    const providers = [
      {
        id: 'newrelic',
        name: 'New Relic',
        enabled: config.getOptionalBoolean('keninDuty.providers.newrelic.enabled') || false,
        description: 'Monitoring e observabilidade',
        color: '#1CE783',
        icon: 'newrelic'
      },
      {
        id: 'datadog',
        name: 'Datadog',
        enabled: config.getOptionalBoolean('keninDuty.providers.datadog.enabled') || false,
        description: 'Monitoramento de infraestrutura',
        color: '#632CA6',
        icon: 'datadog'
      },
      {
        id: 'grafana',
        name: 'Grafana',
        enabled: config.getOptionalBoolean('keninDuty.providers.grafana.enabled') || false,
        description: 'Dashboards e visualização',
        color: '#F46800',
        icon: 'grafana'
      }
    ];
    
    logger.info('Retrieved available alert providers');
    res.json(providers);
  });

  // Criar alertas nos providers
  router.post('/providers/:provider/alerts', async (req, res) => {
    try {
      const { provider } = req.params;
      const alertData = req.body;
      
      const webhookEndpoint = config.getOptionalString('keninDuty.webhook.endpoint') || 
                             config.getOptionalString(`keninDuty.webhook.${provider}`) ||
                             'http://localhost:8080/webhook/alerts';

      logger.info(`Creating alert in ${provider}:`, alertData);

      // Simula criação do alerta no provider
      const alertId = `${provider.substring(0, 2)}-${Date.now()}`;
      
      let providerAlert;
      
      switch (provider) {
        case 'newrelic':
          providerAlert = {
            id: alertId,
            provider: 'newrelic',
            type: 'nrql_condition',
            name: alertData.title || alertData.name,
            description: alertData.description,
            nrql: alertData.nrql || alertData.query,
            enabled: true,
            violation_time_limit: 'TWENTY_FOUR_HOURS',
            value_function: 'SINGLE_VALUE',
            terms: [{
              duration: '5',
              operator: 'ABOVE',
              priority: alertData.severity === 'critical' ? 'CRITICAL' : 'WARNING',
              threshold: alertData.threshold || '1',
              time_function: 'ALL'
            }],
            webhook_url: webhookEndpoint,
            created_at: new Date().toISOString(),
            status: 'active'
          };
          break;

        case 'datadog':
          providerAlert = {
            id: alertId,
            provider: 'datadog',
            name: alertData.title || alertData.name,
            query: alertData.query,
            message: alertData.description,
            tags: alertData.tags || [`team:${alertData.teamId}`, 'source:keninduty'],
            type: 'metric alert',
            options: {
              thresholds: {
                critical: alertData.threshold || 0.8,
                warning: (alertData.threshold || 0.8) * 0.8
              },
              notify_audit: false,
              timeout_h: 0,
              include_tags: true,
              no_data_timeframe: 20,
              require_full_window: false,
              new_host_delay: 300,
              notify_no_data: false,
              renotify_interval: 0,
              evaluation_delay: 60
            },
            webhook_url: webhookEndpoint,
            created_at: new Date().toISOString(),
            status: 'active'
          };
          break;

        case 'grafana':
          providerAlert = {
            id: alertId,
            provider: 'grafana',
            title: alertData.title || alertData.name,
            condition: alertData.query,
            message: alertData.description,
            frequency: '10s',
            handler: 1,
            severity: alertData.severity || 'medium',
            tags: alertData.tags || [`team:${alertData.teamId}`, 'source:keninduty'],
            webhook_url: webhookEndpoint,
            created_at: new Date().toISOString(),
            state: 'alerting'
          };
          break;

        default:
          return res.status(400).json({ 
            error: 'Provider não suportado',
            supportedProviders: ['newrelic', 'datadog', 'grafana']
          });
      }

      logger.info(`Alert created successfully in ${provider}:`, { alertId, webhookEndpoint });

      res.status(201).json({
        success: true,
        alert: providerAlert,
        webhook_configured: !!webhookEndpoint,
        message: `Alerta criado com sucesso no ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
      });

    } catch (error) {
      logger.error(`Error creating alert in ${req.params.provider}:`, error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: 'Erro ao criar alerta no provider'
      });
    }
  });



  // Webhook para receber alertas dos providers e encaminhar para API Golang
  router.post('/webhook/alerts', async (req, res) => {
    try {
      const source = req.headers['x-keninduty-source'] as string || 'unknown';
      const alertData = req.body;

      logger.info('Webhook alert received:', {
        source: source,
        alert_data: alertData,
        timestamp: new Date().toISOString(),
      });

      // Obter endpoints da API Golang da configuração
      const webhookEndpoint = config.getOptionalString('keninDuty.webhook.endpoint');
      const specificEndpoint = source ? config.getOptionalString(`keninDuty.webhook.${source}`) : null;

      const targetEndpoint = specificEndpoint || webhookEndpoint;

      if (targetEndpoint) {
        logger.info(`Forwarding webhook to Golang API: ${targetEndpoint}`);

        try {
          // Encaminhar para API Golang
          const response = await fetch(targetEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-KeninDuty-Source': source,
              'X-Forwarded-From': 'backstage',
            },
            body: JSON.stringify(alertData),
          });

          const responseData = await response.text();

          if (!response.ok) {
            logger.error(`Golang API returned error ${response.status}: ${responseData}`);
          } else {
            logger.info(`Successfully forwarded to Golang API. Response: ${responseData}`);
          }
        } catch (forwardError) {
          logger.error(`Error forwarding to Golang API: ${forwardError.message}`);
        }
      } else {
        logger.warn('No webhook endpoint configured - webhook not forwarded');
      }

      // Sempre responder com sucesso para o provider
      res.status(200).json({
        success: true,
        message: 'Webhook recebido e processado',
        source: source,
        forwarded: !!targetEndpoint,
        received_at: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error processing webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Falha ao processar webhook',
        error: error.message,
      });
    }
  });

  return router;
} 