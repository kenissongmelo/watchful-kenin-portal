const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 7007;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data storage
let teams = [
  {
    id: 'team-1',
    name: 'Infrastructure Team',
    members: [
      {
        id: 'member-1',
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john@company.com',
        role: 'primary'
      },
      {
        id: 'member-2',
        name: 'Jane Smith',
        phone: '+1234567891',
        email: 'jane@company.com',
        role: 'secondary'
      }
    ],
    escalationPolicy: {
      retryCount: 3,
      retryIntervalMinutes: 5,
      escalationDelayMinutes: 15
    },
    provider: 'datadog'
  },
  {
    id: 'team-2',
    name: 'Application Team',
    members: [
      {
        id: 'member-3',
        name: 'Bob Wilson',
        phone: '+1234567892',
        email: 'bob@company.com',
        role: 'primary'
      }
    ],
    escalationPolicy: {
      retryCount: 2,
      retryIntervalMinutes: 10,
      escalationDelayMinutes: 30
    },
    provider: 'newrelic'
  }
];

let alerts = [
  {
    id: 'alert-1',
    title: 'High CPU Usage - Payment Service',
    description: 'CPU usage exceeded 90% for more than 5 minutes',
    severity: 'critical',
    provider: 'newrelic',
    providerAlertId: 'nr-12345',
    teamId: 'team-2',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: 'alert-2',
    title: 'Database Connection Pool Exhausted',
    description: 'All database connections are in use',
    severity: 'high',
    provider: 'datadog',
    providerAlertId: 'dd-67890',
    teamId: 'team-1',
    status: 'acknowledged',
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'alert-3',
    title: 'API Response Time Degradation',
    description: 'Average response time increased by 200%',
    severity: 'medium',
    provider: 'newrelic',
    providerAlertId: 'nr-11111',
    teamId: 'team-2',
    status: 'resolved',
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000)
  }
];

let callAttempts = [
  {
    id: 'call-1',
    alertId: 'alert-1',
    teamMemberId: 'member-3',
    status: 'in-progress',
    attemptNumber: 1,
    startedAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
  },
  {
    id: 'call-2',
    alertId: 'alert-2',
    teamMemberId: 'member-1',
    status: 'answered',
    attemptNumber: 1,
    startedAt: new Date(Date.now() - 12 * 60 * 1000),
    endedAt: new Date(Date.now() - 10 * 60 * 1000),
    duration: 120000, // 2 minutes
    notes: 'Issue acknowledged, working on resolution'
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'keninduty-backend'
  });
});

// Get statistics
app.get('/api/keninduty/stats', (req, res) => {
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
app.get('/api/keninduty/teams', (req, res) => {
  res.json(teams);
});

app.post('/api/keninduty/teams', (req, res) => {
  try {
    const data = req.body;
    const newTeam = {
      id: `team-${Date.now()}`,
      name: data.name,
      members: data.members.map((member, index) => ({
        id: `member-${Date.now()}-${index}`,
        ...member
      })),
      escalationPolicy: data.escalationPolicy,
      provider: data.provider
    };
    
    teams.push(newTeam);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ error: 'Invalid team data' });
  }
});

app.get('/api/keninduty/teams/:id', (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json(team);
});

// Alert management
app.get('/api/keninduty/alerts', (req, res) => {
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

app.post('/api/keninduty/alerts', (req, res) => {
  try {
    const data = req.body;
    
    // Validate team exists
    const team = teams.find(t => t.id === data.teamId);
    if (!team) {
      return res.status(400).json({ error: 'Team not found' });
    }

    const newAlert = {
      id: `alert-${Date.now()}`,
      title: data.title,
      description: data.description,
      severity: data.severity,
      provider: data.provider,
      providerAlertId: data.providerAlertId,
      teamId: data.teamId,
      status: 'active',
      createdAt: new Date()
    };

    alerts.push(newAlert);

    // Create initial call attempt
    const primaryMember = team.members.find(m => m.role === 'primary');
    if (primaryMember) {
      const callAttempt = {
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

app.patch('/api/keninduty/alerts/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const alert = alerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = status;
    if (status === 'acknowledged') {
      alert.acknowledgedAt = new Date();
    } else if (status === 'resolved') {
      alert.resolvedAt = new Date();
    }

    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: 'Invalid status update' });
  }
});

// Call attempts management
app.get('/api/keninduty/calls', (req, res) => {
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

app.post('/api/keninduty/calls/:alertId/retry', (req, res) => {
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
  
  let nextMember;
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

  const newCallAttempt = {
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

app.patch('/api/keninduty/calls/:id/status', (req, res) => {
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
app.post('/api/keninduty/webhook/alert', (req, res) => {
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
app.post('/api/keninduty/providers/datadog/alerts', (req, res) => {
  try {
    const { title, description, severity, teamId } = req.body;
    
    // Here you would integrate with Datadog API to create the alert
    // For now, we'll simulate the creation
    const providerAlertId = `dd-${Date.now()}`;
    
    const newAlert = {
      id: `alert-${Date.now()}`,
      title,
      description,
      severity,
      provider: 'datadog',
      providerAlertId,
      teamId,
      status: 'active',
      createdAt: new Date()
    };

    alerts.push(newAlert);
    res.status(201).json({ alert: newAlert, providerAlertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Datadog alert' });
  }
});

app.post('/api/keninduty/providers/newrelic/alerts', (req, res) => {
  try {
    const { nrqlQuery, title, description, severity, teamId } = req.body;
    
    // Here you would integrate with New Relic API to create the alert
    // For now, we'll simulate the creation
    const providerAlertId = `nr-${Date.now()}`;
    
    const newAlert = {
      id: `alert-${Date.now()}`,
      title,
      description,
      severity,
      provider: 'newrelic',
      providerAlertId,
      teamId,
      providerQuery: nrqlQuery, // Store the NRQL query
      status: 'active',
      createdAt: new Date()
    };

    alerts.push(newAlert);
    res.status(201).json({ alert: newAlert, providerAlertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create New Relic alert' });
  }
});

app.post('/api/keninduty/providers/grafana/alerts', (req, res) => {
  try {
    const { query, title, description, severity, teamId } = req.body;
    
    // Here you would integrate with Grafana API to create the alert
    // For now, we'll simulate the creation
    const providerAlertId = `gf-${Date.now()}`;
    
    const newAlert = {
      id: `alert-${Date.now()}`,
      title,
      description,
      severity,
      provider: 'grafana',
      providerAlertId,
      teamId,
      status: 'active',
      createdAt: new Date()
    };

    alerts.push(newAlert);
    res.status(201).json({ alert: newAlert, providerAlertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Grafana alert' });
  }
});

app.listen(PORT, () => {
  console.log(`KeninDuty Backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints:`);
  console.log(`  - GET /api/keninduty/stats`);
  console.log(`  - GET /api/keninduty/teams`);
  console.log(`  - GET /api/keninduty/alerts`);
  console.log(`  - POST /api/keninduty/webhook/alert`);
  console.log(`  - POST /api/keninduty/providers/*/alerts`);
}); 