# KeninDuty Plugin for Backstage

[![npm version](https://badge.fury.io/js/@keninduty%2Fbackstage-plugin-kenin-duty.svg)](https://badge.fury.io/js/@keninduty%2Fbackstage-plugin-kenin-duty)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://img.shields.io/github/workflow/status/keninduty/backstage-plugin-kenin-duty/CI)](https://github.com/keninduty/backstage-plugin-kenin-duty/actions)

🚨 **Intelligent Alert Management Platform** for Backstage with comprehensive integrations for monitoring and incident response.

> **Community Plugin**: This is an open-source community plugin that can be installed in any Backstage instance. Join our growing community of users!

## Features

🔥 **Multi-Provider Alert Management**
- ✅ **New Relic** - NRQL-based alerts and monitoring  
- ✅ **Datadog** - Metric-based monitoring and alerting
- ✅ **Grafana** - Unified dashboards and alerting

⚡ **Advanced Capabilities**
- 🎯 **Smart Escalation Policies** - Multi-level escalation with automatic retries
- 📱 **Real-time Team Management** - On-call schedules and team coordination  
- 🔔 **Intelligent Notifications** - SMS, Email, and Webhook integrations
- 📊 **Comprehensive Dashboards** - Real-time status and analytics
- 🔄 **Webhook Forwarding** - Forward alerts to external APIs (e.g., Golang services)

## 📱 Screenshots

### Dashboard View
![Dashboard](./docs/images/dashboard.png)
*Overview of system health with real-time statistics and recent alerts*

### Team Management
![Teams](./docs/images/teams.png)
*Manage on-call teams, escalation policies, and member availability*

### Alert Management
![Alerts](./docs/images/alerts.png)
*Configure and monitor alerts from multiple monitoring providers*

### Call History
![Calls](./docs/images/calls.png)
*Track call attempts and escalation history for incident response*

### Configuration
![Configuration](./docs/images/configuration.png)
*Easy setup for multiple monitoring provider accounts and notification settings*

## 🚀 Quick Installation

```bash
# Install both packages
yarn add --cwd packages/app @keninduty/backstage-plugin-kenin-duty
yarn add --cwd packages/backend @keninduty/backstage-plugin-kenin-duty-backend
```

See our **[Complete Installation Guide](./examples/installation-guide.md)** for step-by-step setup instructions.

## ⚡ Quick Setup

### Frontend (`packages/app/src/App.tsx`)
```typescript
import { KeninDutyMainPage } from '@keninduty/backstage-plugin-kenin-duty';

<Route path="/kenin-duty" element={<KeninDutyMainPage />} />
```

### Backend (`packages/backend/src/index.ts`)
```typescript
backend.add(import('@keninduty/backstage-plugin-kenin-duty-backend'));
```

### Configuration (`app-config.yaml`)

```yaml
keninDuty:
  enabled: true
  
  # Provider configurations
  providers:
    newrelic:
      enabled: true
      apiKey: ${NEW_RELIC_API_KEY}
      accountId: ${NEW_RELIC_ACCOUNT_ID}
    
    datadog:
      enabled: true
      apiKey: ${DATADOG_API_KEY}
      appKey: ${DATADOG_APP_KEY}
    
    grafana:
      enabled: true
      url: ${GRAFANA_URL}
      apiKey: ${GRAFANA_API_KEY}

  # Webhook configuration for external API forwarding
  webhook:
    endpoint: "http://localhost:8080/webhook/alerts"
    
  # Notification settings
  notifications:
    twilio:
      accountSid: ${TWILIO_ACCOUNT_SID}
      authToken: ${TWILIO_AUTH_TOKEN}
      fromNumber: ${TWILIO_FROM_NUMBER}
```

## Usage

### Creating Alerts

1. Navigate to `/kenin-duty` in your Backstage instance
2. Click **"Create New Alert"**
3. Select your monitoring provider (New Relic, Datadog, or Grafana)
4. Configure alert parameters:
   - **New Relic**: NRQL queries
   - **Datadog**: Metric queries  
   - **Grafana**: Panel-based alerts
5. Set escalation policies and team assignments

### Managing Teams

- **Team Setup**: Create teams with on-call schedules
- **Escalation Policies**: Define multi-level escalation with automatic retries
- **Member Management**: Add/remove team members with roles and availability

### Monitoring & Analytics

- **Real-time Dashboard**: Monitor alert status and team performance
- **Alert History**: Complete audit trail of alert lifecycle
- **Performance Metrics**: Response times, resolution rates, and trends

## API Reference

### Frontend API

```typescript
import { KeninDutyApi } from '@keninduty/backstage-plugin-kenin-duty';

// Get teams
const teams = await api.getTeams();

// Create alert
await api.createAlert({
  title: "High CPU Usage",
  description: "CPU usage above 80%",
  severity: "high",
  provider: "newrelic",
  nrql: "SELECT average(cpuPercent) FROM SystemSample"
});

// Test provider connections
const status = await api.testConnections();
```

### Backend Endpoints

```bash
# Get provider status
GET /api/keninduty/alerts/providers

# Create provider-specific alert
POST /api/keninduty/providers/{provider}/alerts

# Test connections
POST /api/keninduty/providers/test-connections

# Webhook receiver (forwards to external APIs)
POST /api/keninduty/webhook/alerts
```

## Development

```bash
# Install dependencies
yarn install

# Start development
yarn dev

# Run tests  
yarn test

# Build
yarn build
```

## Environment Variables

```bash
# New Relic
NEW_RELIC_API_KEY=your_api_key
NEW_RELIC_ACCOUNT_ID=your_account_id

# Datadog
DATADOG_API_KEY=your_api_key  
DATADOG_APP_KEY=your_app_key

# Grafana
GRAFANA_URL=https://your-grafana.com
GRAFANA_API_KEY=your_api_key

# Twilio (for SMS notifications)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=your_phone_number
```

## 🤝 Contributing

We welcome contributions from the Backstage community! Here's how you can help:

### Quick Start
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- 🔧 **Code Style**: Follow TypeScript and React best practices
- ✅ **Testing**: Add tests for new features
- 📖 **Documentation**: Update README and inline docs
- 🐛 **Bug Fixes**: Include reproduction steps in PR description

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 🌟 Community & Support

### Getting Help
- 📖 [Complete Documentation](https://github.com/keninduty/backstage-plugin-kenin-duty)
- 🐛 [Report Issues](https://github.com/keninduty/backstage-plugin-kenin-duty/issues)
- 💬 [Community Discussions](https://github.com/keninduty/backstage-plugin-kenin-duty/discussions)
- 🚀 [Release Notes](https://github.com/keninduty/backstage-plugin-kenin-duty/releases)

### Community Stats
- ⭐ **Users**: Growing community of enterprise teams
- 🔧 **Use Cases**: DevOps monitoring, incident response, alert management
- 🌍 **Global**: Used by teams worldwide

*Share your success story in our discussions!*

## 📄 License

Apache-2.0 License - see [LICENSE](LICENSE) for details.

---

**Made with ❤️ for the Backstage community**

> **Ready to get started?** Follow our [Installation Guide](./examples/installation-guide.md) and join the community!