# KeninDuty Plugin for Backstage

🚨 **Intelligent Alert Management Platform** for Backstage with comprehensive integrations for monitoring and incident response.

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

## Installation

### 1. Install the Plugin

```bash
# Frontend plugin
yarn add @keninduty/backstage-plugin-kenin-duty

# Backend plugin  
yarn add @keninduty/backstage-plugin-kenin-duty-backend
```

### 2. Configure Frontend

Add the plugin to your `packages/app/src/App.tsx`:

```typescript
import { KeninDutyPage } from '@keninduty/backstage-plugin-kenin-duty';

// Add route
<Route path="/kenin-duty" element={<KeninDutyPage />} />
```

Add to sidebar in `packages/app/src/components/Root/Root.tsx`:

```typescript
import { KeninDutyIcon } from '@keninduty/backstage-plugin-kenin-duty';

// Add sidebar item
<SidebarItem icon={KeninDutyIcon} to="kenin-duty" text="KeninDuty" />
```

### 3. Configure Backend

Add to your `packages/backend/src/index.ts`:

```typescript
import { keninDutyBackendPlugin } from '@keninduty/backstage-plugin-kenin-duty-backend';

backend.add(keninDutyBackendPlugin);
```

### 4. Configuration

Add to your `app-config.yaml`:

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

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

Apache-2.0 License - see [LICENSE](LICENSE) for details.

## Support

- 📖 [Documentation](https://github.com/keninduty/backstage-plugin-kenin-duty/wiki)
- 🐛 [Issue Tracker](https://github.com/keninduty/backstage-plugin-kenin-duty/issues)
- 💬 [Discussions](https://github.com/keninduty/backstage-plugin-kenin-duty/discussions)

---

Made with ❤️ for the Backstage community