import { createBackendPlugin } from '@backstage/backend-plugin-api';
import { Router } from 'express';
import { z } from 'zod';

// Types and interfaces
interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  escalationPolicy: EscalationPolicy;
}

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'primary' | 'secondary' | 'escalation';
}

interface EscalationPolicy {
  retryCount: number;
  retryIntervalMinutes: number;
  escalationDelayMinutes: number;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  message?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  provider: 'datadog' | 'newrelic' | 'grafana';
  providerAlertId: string;
  teamId: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}

interface CallAttempt {
  id: string;
  alertId: string;
  teamMemberId: string;
  status: 'pending' | 'in-progress' | 'answered' | 'no-answer' | 'failed';
  attemptNumber: number;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  notes?: string;
}

// Schemas for validation
const CreateTeamSchema = z.object({
  name: z.string().min(1),
  members: z.array(z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    role: z.enum(['primary', 'secondary', 'escalation'])
  })).min(1),
  escalationPolicy: z.object({
    retryCount: z.number().min(1).max(10),
    retryIntervalMinutes: z.number().min(1).max(60),
    escalationDelayMinutes: z.number().min(1).max(120)
  })
});

const CreateAlertSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  provider: z.enum(['datadog', 'newrelic', 'grafana']),
  teamId: z.string().min(1),
  query: z.string().optional()
});

const UpdateAlertStatusSchema = z.object({
  status: z.enum(['acknowledged', 'resolved'])
});

// Callback schema for call status updates
const CallbackSchema = z.object({
  callId: z.string(),
  status: z.enum(['answered', 'no-answer', 'failed', 'busy']),
  duration: z.number().optional(),
  notes: z.string().optional(),
  timestamp: z.string().optional()
});

// Mock data storage
const teams: Team[] = [];
const alerts: Alert[] = [];
const callAttempts: CallAttempt[] = [];

export const keninDutyPlugin = createBackendPlugin({
  pluginId: 'kenin-duty',
  register(reg) {
    reg.registerInit({
      deps: {
        http: '@backstage/backend-plugin-api/alpha#httpRouter',
      },
      async init({ http }) {
        const router = Router();

        // Health check
        router.get('/health', (req, res) => {
          res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        // Get statistics
        router.get('/stats', (req, res) => {
          const activeAlerts = alerts.filter(a => a.status === 'active').length;
          const totalTeams = teams.length;
          const totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
          
          res.json({
            activeAlerts,
            totalTeams,
            totalMembers,
            totalAlerts: alerts.length,
            totalCallAttempts: callAttempts.length
          });
        });

        // Team management
        router.get('/teams', (req, res) => {
          res.json(teams);
        });

        router.post('/teams', async (req, res) => {
          try {
            const data = CreateTeamSchema.parse(req.body);
            const newTeam: Team = {
              id: `team-${Date.now()}`,
              name: data.name,
              members: data.members.map((member, index) => ({
                id: `member-${Date.now()}-${index}`,
                name: member.name,
                phone: member.phone,
                email: member.email,
                role: member.role
              })),
              escalationPolicy: {
                retryCount: data.escalationPolicy.retryCount,
                retryIntervalMinutes: data.escalationPolicy.retryIntervalMinutes,
                escalationDelayMinutes: data.escalationPolicy.escalationDelayMinutes
              }
            };
            
            teams.push(newTeam);
            console.log('Team created successfully:', { teamId: newTeam.id, teamName: newTeam.name });
            res.status(201).json({ success: true, data: newTeam });
          } catch (error) {
            res.status(400).json({ error: 'Invalid team data' });
          }
        });

        router.get('/teams/:id', (req, res) => {
          const team = teams.find(t => t.id === req.params.id);
          if (!team) {
            return res.status(404).json({ error: 'Team not found' });
          }
          res.json(team);
        });

        // Alert management
        router.get('/alerts', (req, res) => {
          const { status, teamId, provider } = req.query;
          let filteredAlerts = alerts;

          if (status) {
            filteredAlerts = filteredAlerts.filter(a => a.status === status);
          }
          if (teamId) {
            filteredAlerts = filteredAlerts.filter(a => a.teamId === teamId);
          }
          if (provider) {
            filteredAlerts = filteredAlerts.filter(a => a.provider === provider);
          }

          res.json(filteredAlerts);
        });

        router.post('/alerts', async (req, res) => {
          try {
            const data = CreateAlertSchema.parse(req.body);
            
            // Validate team exists
            const team = teams.find(t => t.id === data.teamId);
            if (!team) {
              return res.status(400).json({ error: 'Team not found' });
            }

            const newAlert: Alert = {
              id: `alert-${Date.now()}`,
              title: data.title,
              description: data.description,
              message: data.message,
              severity: data.severity,
              provider: data.provider,
              providerAlertId: `provider-${Date.now()}`, // Generate provider alert ID
              teamId: data.teamId,
              status: 'active',
              createdAt: new Date()
            };

            alerts.push(newAlert);

            // Create initial call attempt
            const primaryMember = team.members.find(m => m.role === 'primary');
            if (primaryMember) {
              const callAttempt: CallAttempt = {
                id: `call-${Date.now()}`,
                alertId: newAlert.id,
                teamMemberId: primaryMember.id,
                status: 'pending',
                attemptNumber: 1,
                startedAt: new Date()
              };
              callAttempts.push(callAttempt);
            }

            res.status(201).json(newAlert);
          } catch (error) {
            res.status(400).json({ error: 'Invalid alert data' });
          }
        });

        router.patch('/alerts/:id/status', async (req, res) => {
          try {
            const { id } = req.params;
            const data = UpdateAlertStatusSchema.parse(req.body);
            
            const alert = alerts.find(a => a.id === id);
            if (!alert) {
              return res.status(404).json({ error: 'Alert not found' });
            }

            alert.status = data.status;
            if (data.status === 'acknowledged') {
              alert.acknowledgedAt = new Date();
            } else if (data.status === 'resolved') {
              alert.resolvedAt = new Date();
            }

            res.json(alert);
          } catch (error) {
            res.status(400).json({ error: 'Invalid status update' });
          }
        });

        // Call attempts management
        router.get('/calls', (req, res) => {
          const { alertId, status } = req.query;
          let filteredCalls = callAttempts;

          if (alertId) {
            filteredCalls = filteredCalls.filter(c => c.alertId === alertId);
          }
          if (status) {
            filteredCalls = filteredCalls.filter(c => c.status === status);
          }

          res.json(filteredCalls);
        });

        router.post('/calls/:alertId/retry', async (req, res) => {
          const { alertId } = req.params;
          const alert = alerts.find(a => a.id === alertId);
          
          if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
          }

          const team = teams.find(t => t.id === alert.teamId);
          if (!team) {
            return res.status(404).json({ error: 'Team not found' });
          }

          // Find next member to call based on escalation policy
          const existingCalls = callAttempts.filter(c => c.alertId === alertId);
          const lastCall = existingCalls[existingCalls.length - 1];
          
          let nextMember: TeamMember | undefined;
          let attemptNumber = 1;

          if (lastCall) {
            attemptNumber = lastCall.attemptNumber + 1;
            const currentMemberIndex = team.members.findIndex(m => m.id === lastCall.teamMemberId);
            
            if (attemptNumber <= team.escalationPolicy.retryCount) {
              // Retry same member
              nextMember = team.members[currentMemberIndex];
            } else {
              // Escalate to next member
              const nextIndex = (currentMemberIndex + 1) % team.members.length;
              nextMember = team.members[nextIndex];
              attemptNumber = 1; // Reset attempt number for new member
            }
          } else {
            // First call - start with primary member
            nextMember = team.members.find(m => m.role === 'primary');
          }

          if (!nextMember) {
            return res.status(400).json({ error: 'No team members available' });
          }

          const newCallAttempt: CallAttempt = {
            id: `call-${Date.now()}`,
            alertId,
            teamMemberId: nextMember.id,
            status: 'pending',
            attemptNumber,
            startedAt: new Date()
          };

          callAttempts.push(newCallAttempt);
          res.status(201).json(newCallAttempt);
        });

        router.patch('/calls/:id/status', async (req, res) => {
          const { id } = req.params;
          const { status, notes } = req.body;

          const call = callAttempts.find(c => c.id === id);
          if (!call) {
            return res.status(404).json({ error: 'Call attempt not found' });
          }

          call.status = status;
          call.endedAt = new Date();
          if (notes) {
            call.notes = notes;
          }

          if (call.startedAt && call.endedAt) {
            call.duration = call.endedAt.getTime() - call.startedAt.getTime();
          }

          res.json(call);
        });

        // Webhook endpoint for Go API
        router.post('/webhook/alert', async (req, res) => {
          try {
            const { providerAlertId, provider } = req.body;
            
            // Find alert by provider alert ID
            const alert = alerts.find(a => a.providerAlertId === providerAlertId && a.provider === provider);
            
            if (!alert) {
              return res.status(404).json({ error: 'Alert not found' });
            }

            // Return team information for the Go API
            const team = teams.find(t => t.id === alert.teamId);
            if (!team) {
              return res.status(404).json({ error: 'Team not found' });
            }

            res.json({
              alertId: alert.id,
              team: {
                id: team.id,
                name: team.name,
                members: team.members,
                escalationPolicy: team.escalationPolicy
              }
            });
          } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
          }
        });

        // Provider-specific alert creation
        router.post('/providers/datadog/alerts', async (req, res) => {
          try {
            const { query, title, description, severity, teamId } = req.body;
            
            // Here you would integrate with Datadog API to create the alert
            // For now, we'll simulate the creation
            const providerAlertId = `dd-${Date.now()}`;
            
            // Create alert with title field for Datadog (title is the main alert text)
            const newAlert: Alert = {
              id: `alert-${Date.now()}`,
              title: title, // Datadog uses title as the main alert text
              description: description || '',
              severity,
              provider: 'datadog',
              providerAlertId,
              teamId,
              status: 'active',
              createdAt: new Date()
            };

            alerts.push(newAlert);
            
            // Return response with owners field for provider integration
            res.status(201).json({ 
              alert: newAlert, 
              providerAlertId,
              owners: [teamId], // Include teamId in owners field
              metadata: {
                teamId,
                createdBy: 'keninduty-plugin',
                integrationType: 'datadog'
              }
            });
          } catch (error) {
            res.status(500).json({ error: 'Failed to create Datadog alert' });
          }
        });

        router.post('/providers/newrelic/alerts', async (req, res) => {
          try {
            const { nrqlQuery, title, description, message, severity, teamId } = req.body;
            
            // Here you would integrate with New Relic API to create the alert
            // For now, we'll simulate the creation
            const providerAlertId = `nr-${Date.now()}`;
            
            // Create alert with message field for New Relic (message is the main alert text)
            const newAlert: Alert = {
              id: `alert-${Date.now()}`,
              title: title, // Technical ID
              description: description || '',
              message: message, // New Relic uses message field for the actual alert text
              severity,
              provider: 'newrelic',
              providerAlertId,
              teamId,
              status: 'active',
              createdAt: new Date()
            };

            alerts.push(newAlert);
            
            // Return response with owners field for provider integration
            res.status(201).json({ 
              alert: newAlert, 
              providerAlertId,
              owners: [teamId], // Include teamId in owners field
              metadata: {
                teamId,
                createdBy: 'keninduty-plugin',
                integrationType: 'newrelic'
              }
            });
          } catch (error) {
            res.status(500).json({ error: 'Failed to create New Relic alert' });
          }
        });

        router.post('/providers/grafana/alerts', async (req, res) => {
          try {
            const { query, title, description, severity, teamId } = req.body;
            
            // Here you would integrate with Grafana API to create the alert
            // For now, we'll simulate the creation
            const providerAlertId = `gf-${Date.now()}`;
            
            // Create alert with description field for Grafana (description is the main alert text)
            const newAlert: Alert = {
              id: `alert-${Date.now()}`,
              title: title || '', // Technical ID or name
              description: description, // Grafana uses description as the main alert text
              severity,
              provider: 'grafana',
              providerAlertId,
              teamId,
              status: 'active',
              createdAt: new Date()
            };

            alerts.push(newAlert);
            
            // Return response with owners field for provider integration
            res.status(201).json({ 
              alert: newAlert, 
              providerAlertId,
              owners: [teamId], // Include teamId in owners field
              metadata: {
                teamId,
                createdBy: 'keninduty-plugin',
                integrationType: 'grafana'
              }
            });
          } catch (error) {
            res.status(500).json({ error: 'Failed to create Grafana alert' });
          }
        });

        // Consulta de Plantonista Atual
        router.get('/oncall/current', async (req, res) => {
          try {
            const { teamId } = req.query;
            console.log('GET /api/keninduty/oncall/current called', { teamId });
            
            if (!teamId) {
              return res.status(400).json({ 
                success: false, 
                error: 'teamId parameter is required' 
              });
            }

            // Mock data - substitua por dados reais da sua implementação
            const oncallData = [
              {
                userID: "user_123",
                userName: "João Silva",
                phone: "+5511999999999",
                email: "joao.silva@empresa.com",
                teamID: teamId as string,
                teamName: "Infrastructure Alerts",
                scheduleID: "schedule_789",
                scheduleName: "Plantão DevOps",
                startTime: "2025-07-06T08:00:00Z",
                endTime: "2025-07-06T18:00:00Z",
                timezone: "America/Sao_Paulo"
              },
              {
                userID: "user_456",
                userName: "Maria Santos",
                phone: "+5511888888888",
                email: "maria.santos@empresa.com",
                teamID: teamId as string,
                teamName: "Infrastructure Alerts",
                scheduleID: "schedule_790",
                scheduleName: "Plantão DevOps Backup",
                startTime: "2025-07-06T18:00:00Z",
                endTime: "2025-07-07T08:00:00Z",
                timezone: "America/Sao_Paulo"
              }
            ];

            res.json({
              success: true,
              data: oncallData
            });
          } catch (error) {
            console.error('Error in current oncall endpoint:', error);
            res.status(500).json({ 
              success: false, 
              error: 'Internal server error' 
            });
          }
        });

        // Endpoint de disponibilidade do on-call
        router.get('/oncall/availability', async (req, res) => {
          try {
            const { teamId } = req.query;
            console.log('GET /api/keninduty/oncall/availability called', { teamId });
            
            if (!teamId) {
              return res.status(400).json({ 
                success: false, 
                error: 'teamId parameter is required' 
              });
            }

            // Encontrar o time
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

            // Mock: simular disponibilidade baseada na hora atual
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
            console.error('Error in oncall availability endpoint:', error);
            res.status(500).json({ 
              success: false, 
              error: 'Internal server error' 
            });
          }
        });

        // Endpoint de callback para status de chamadas
        router.post('/callback/call-status', async (req, res) => {
          try {
            const payload = CallbackSchema.parse(req.body);
            console.log('POST /api/keninduty/callback/call-status called', { payload });
            
            // Encontrar a tentativa de chamada
            const callAttempt = callAttempts.find(c => c.id === payload.callId);
            if (!callAttempt) {
              return res.status(404).json({ 
                success: false, 
                error: 'Call attempt not found' 
              });
            }

            // Atualizar status da chamada
            callAttempt.status = payload.status === 'answered' ? 'answered' : 
                                payload.status === 'no-answer' ? 'no-answer' : 'failed';
            callAttempt.endedAt = new Date();
            callAttempt.duration = payload.duration;
            callAttempt.notes = payload.notes;

            // Calcular duração se não fornecida
            if (!callAttempt.duration && callAttempt.startedAt && callAttempt.endedAt) {
              callAttempt.duration = callAttempt.endedAt.getTime() - callAttempt.startedAt.getTime();
            }

            // Se a chamada foi atendida, atualizar o status do alerta
            if (payload.status === 'answered') {
              const alert = alerts.find(a => a.id === callAttempt.alertId);
              if (alert) {
                alert.status = 'acknowledged';
                alert.acknowledgedAt = new Date();
              }
            }

            // Log da atualização
            console.log('Call status updated', {
              callId: payload.callId,
              status: payload.status,
              duration: callAttempt.duration,
              alertId: callAttempt.alertId
            });

            res.json({
              success: true,
              message: 'Call status updated successfully',
              data: {
                callId: payload.callId,
                status: callAttempt.status,
                duration: callAttempt.duration,
                updatedAt: callAttempt.endedAt
              }
            });
          } catch (error) {
            console.error('Error in call status callback:', error);
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

        http.use('/api/keninduty', router);
      },
    });
  },
}); 