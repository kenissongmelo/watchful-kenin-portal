# KeninDuty Plugin - Complete Installation Guide

This guide shows how to install and configure the KeninDuty plugin in any Backstage instance.

## 🚀 Quick Start

### 1. Install the Packages

```bash
# From your Backstage root directory
yarn add --cwd packages/app @keninduty/backstage-plugin-kenin-duty
yarn add --cwd packages/backend @keninduty/backstage-plugin-kenin-duty-backend
```

### 2. Frontend Setup

#### Add to App.tsx

Edit `packages/app/src/App.tsx`:

```typescript
// Add import at the top
import { KeninDutyMainPage } from '@keninduty/backstage-plugin-kenin-duty';

// Add route in the <FlatRoutes> section
<Route path="/kenin-duty" element={<KeninDutyMainPage />} />
```

#### Add to Sidebar

Edit `packages/app/src/components/Root/Root.tsx`:

```typescript
// Add import at the top
import LocalPhoneIcon from '@material-ui/icons/LocalPhone';

// Add sidebar item in the navigation section
<SidebarItem icon={LocalPhoneIcon} to="kenin-duty" text="KeninDuty" />
```

#### Register API

Edit `packages/app/src/apis.ts`:

```typescript
// Add imports at the top
import { createApiFactory } from '@backstage/core-app-api';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { keninDutyApiRef, KeninDutyApi } from '@keninduty/backstage-plugin-kenin-duty';

// Add to the apis array
export const apis: AnyApiFactory[] = [
  // ... your existing APIs
  createApiFactory({
    api: keninDutyApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ discoveryApi, fetchApi }) =>
      new KeninDutyApi({ discoveryApi, fetchApi }),
  }),
];
```

### 3. Backend Setup

Edit `packages/backend/src/index.ts`:

```typescript
// Add the plugin to your backend
backend.add(import('@keninduty/backstage-plugin-kenin-duty-backend'));
```

### 4. Configuration

Add to your `app-config.yaml`:

```yaml
keninDuty:
  enabled: true
  
  providers:
    # Enable the providers you want to use
    newrelic:
      enabled: true
      apiKey: ${NEW_RELIC_API_KEY}
      accountId: ${NEW_RELIC_ACCOUNT_ID}
    
    datadog:
      enabled: false
      apiKey: ${DATADOG_API_KEY}
      appKey: ${DATADOG_APP_KEY}
    
    grafana:
      enabled: false
      url: ${GRAFANA_URL}
      apiKey: ${GRAFANA_API_KEY}

  # Optional: Webhook forwarding
  webhook:
    endpoint: "http://your-alert-service:8080/webhook/alerts"
    
  # Optional: SMS notifications via Twilio
  notifications:
    twilio:
      accountSid: ${TWILIO_ACCOUNT_SID}
      authToken: ${TWILIO_AUTH_TOKEN}
      fromNumber: ${TWILIO_FROM_NUMBER}
```

### 5. Environment Variables

Set these environment variables:

```bash
# New Relic (if enabled)
export NEW_RELIC_API_KEY="your-api-key"
export NEW_RELIC_ACCOUNT_ID="your-account-id"

# Datadog (if enabled)
export DATADOG_API_KEY="your-api-key"
export DATADOG_APP_KEY="your-app-key"

# Grafana (if enabled)
export GRAFANA_URL="https://your-grafana.com"
export GRAFANA_API_KEY="your-api-key"

# Twilio (if using SMS notifications)
export TWILIO_ACCOUNT_SID="your-account-sid"
export TWILIO_AUTH_TOKEN="your-auth-token"
export TWILIO_FROM_NUMBER="+1234567890"
```

### 6. Start Your Backstage

```bash
yarn dev
```

Visit `http://localhost:3000/kenin-duty` to access the plugin!

## 🔧 Advanced Configuration

### Provider-Specific Setup

#### New Relic Setup
1. Get your API key from New Relic One → Account settings → API keys
2. Find your Account ID in the URL or account settings
3. Enable NRQL queries in your New Relic settings

#### Datadog Setup
1. Generate API and App keys in Datadog → Organization Settings → API Keys
2. Ensure your keys have the necessary permissions for metrics and alerts

#### Grafana Setup
1. Create a service account token in Grafana → Administration → Service accounts
2. Grant necessary permissions for dashboard and alert access

### Custom Webhook Integration

The plugin can forward alerts to your custom services:

```yaml
keninDuty:
  webhook:
    endpoint: "https://your-api.com/alerts"
    headers:
      Authorization: "Bearer ${YOUR_API_TOKEN}"
      Content-Type: "application/json"
```

### Team Management

Configure on-call teams and escalation policies directly in the UI after installation.

## 🆘 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Make sure you've installed both frontend and backend packages
2. **API connection failures**: Check your environment variables and provider API permissions
3. **Plugin not appearing**: Verify the route is added to App.tsx and sidebar to Root.tsx

### Support

- 📖 Documentation: [GitHub Repository](https://github.com/keninduty/backstage-plugin-kenin-duty)
- 🐛 Issues: [Report bugs here](https://github.com/keninduty/backstage-plugin-kenin-duty/issues)
- 💬 Discussions: [Community discussions](https://github.com/keninduty/backstage-plugin-kenin-duty/discussions)

## 📝 License

Apache-2.0 