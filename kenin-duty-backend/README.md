# KeninDuty Backend Plugin for Backstage

Backend services for the KeninDuty Alert Management Platform with comprehensive monitoring integrations.

## Features

- 🔥 **Multi-Provider Support**: New Relic, Datadog, Grafana
- ⚡ **Alert Management**: Create, update, delete alerts across providers
- 🔔 **Webhook Forwarding**: Forward alerts to external APIs
- 📊 **Connection Testing**: Validate provider configurations
- 🛡️ **Secure Configuration**: Environment-based provider settings

## Installation

```bash
yarn add --cwd packages/backend @keninduty/backstage-plugin-kenin-duty-backend
```

## Setup

Add to your `packages/backend/src/index.ts`:

```typescript
backend.add(import('@keninduty/backstage-plugin-kenin-duty-backend'));
```

## Configuration

Add to your `app-config.yaml`:

```yaml
keninDuty:
  enabled: true
  
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

  webhook:
    endpoint: "http://localhost:8080/webhook/alerts"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/keninduty/alerts/providers` | List available providers |
| POST | `/api/keninduty/providers/{provider}/alerts` | Create alert for specific provider |
| POST | `/api/keninduty/providers/test-connections` | Test provider connections |
| POST | `/api/keninduty/webhook/alerts` | Receive and forward webhooks |

## License

Apache-2.0