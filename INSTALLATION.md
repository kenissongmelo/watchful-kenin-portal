# 📦 **INSTALLATION GUIDE - KeninDuty Plugin**

Complete installation guide for both Backstage Plugin and Standalone Portal.

---

## 🔌 **BACKSTAGE PLUGIN INSTALLATION**

### **Method 1: NPM Installation (Recommended)**

```bash
# Install packages
yarn add @keninduty/backstage-plugin-kenin-duty
yarn add @keninduty/backstage-plugin-kenin-duty-backend
```

### **Method 2: Local Development**

```bash
# Clone this repository
git clone https://github.com/kenissongmelo/watchful-kenin-portal.git

# Copy plugins to your Backstage project
cp -r watchful-kenin-portal/backstage-plugin/kenin-duty your-backstage/plugins/
cp -r watchful-kenin-portal/backstage-plugin/kenin-duty-backend your-backstage/plugins/
```

### **Frontend Integration**

**1. Add to App.tsx** (`packages/app/src/App.tsx`):
```typescript
import { KeninDutyPage } from '@keninduty/backstage-plugin-kenin-duty';

// Add route
<Route path="/kenin-duty" element={<KeninDutyPage />} />
```

**2. Add to Sidebar** (`packages/app/src/components/Root/Root.tsx`):
```typescript
import { KeninDutyIcon } from '@keninduty/backstage-plugin-kenin-duty';

// Add sidebar item
<SidebarItem icon={KeninDutyIcon} to="kenin-duty" text="KeninDuty" />
```

**3. Update package.json** (`packages/app/package.json`):
```json
{
  "dependencies": {
    "@keninduty/backstage-plugin-kenin-duty": "^1.0.0"
  }
}
```

### **Backend Integration**

**1. Add to Backend Index** (`packages/backend/src/index.ts`):
```typescript
import { keninDutyBackendPlugin } from '@keninduty/backstage-plugin-kenin-duty-backend';

backend.add(keninDutyBackendPlugin);
```

**2. Update package.json** (`packages/backend/package.json`):
```json
{
  "dependencies": {
    "@keninduty/backstage-plugin-kenin-duty-backend": "^1.0.0"
  }
}
```

### **Configuration** (`app-config.yaml`):
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
    
  notifications:
    twilio:
      accountSid: ${TWILIO_ACCOUNT_SID}
      authToken: ${TWILIO_AUTH_TOKEN}
      fromNumber: ${TWILIO_FROM_NUMBER}
```

---

## 🌐 **STANDALONE PORTAL INSTALLATION**

### **Requirements**
- Node.js 18+
- NPM or Yarn

### **Installation Steps**

```bash
# Clone repository
git clone https://github.com/kenissongmelo/watchful-kenin-portal.git
cd watchful-kenin-portal

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Configure environment variables
nano .env

# Start development
npm run dev
```

### **Environment Configuration** (`.env`):
```bash
# Server Configuration
KENINDUTY_PORT=7007
NODE_ENV=development

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

### **Start Services**

**Development:**
```bash
# All services
npm run dev

# Backend only
npm run dev:api

# Frontend only  
npm run dev:frontend
```

**Production:**
```bash
# Build frontend
npm run build

# Start backend
npm run start:api
```

---

## 🔧 **PROVIDER CONFIGURATION**

### **New Relic Setup**

1. **Get API Key**:
   - Go to [New Relic API Keys](https://one.newrelic.com/api-keys)
   - Create User API Key
   - Copy the key

2. **Get Account ID**:
   - Go to Account Settings
   - Copy Account ID

3. **Configure Webhooks**:
   ```
   Webhook URL: http://your-domain/api/keninduty/webhook/alerts
   ```

### **Datadog Setup**

1. **Get API & App Keys**:
   - Go to [Datadog API Keys](https://app.datadoghq.com/organization-settings/api-keys)
   - Create API Key and Application Key

2. **Configure Webhooks**:
   ```
   Webhook URL: http://your-domain/api/keninduty/webhook/alerts
   ```

### **Grafana Setup**

1. **Get API Key**:
   - Go to Configuration > API Keys
   - Create new API Key with Admin role

2. **Configure Notification Channels**:
   ```
   Type: Webhook
   URL: http://your-domain/api/keninduty/webhook/alerts
   ```

---

## ✅ **VERIFICATION**

### **Test Backstage Plugin**

```bash
# 1. Start Backstage
yarn dev

# 2. Access KeninDuty
http://localhost:3000/kenin-duty

# 3. Test Backend API
curl http://localhost:7007/api/keninduty/alerts/providers
```

### **Test Standalone Portal**

```bash
# 1. Start services
npm run dev

# 2. Access portal
http://localhost:7007

# 3. Test API
curl http://localhost:7007/health
```

### **Test Provider Connections**

```bash
# Test all providers
curl -X POST http://localhost:7007/api/keninduty/providers/test-connections

# Test specific provider
curl -X POST http://localhost:7007/api/keninduty/providers/newrelic/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Alert",
    "description": "Testing connection",
    "severity": "high"
  }'
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Backend not starting**
```bash
# Check port availability
lsof -ti:7007 | xargs kill -9

# Check logs
npm run start:api
```

#### **Frontend not loading**
```bash
# Clear cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install
```

#### **Provider connection failed**
- Verify API keys in environment variables
- Check network connectivity
- Verify webhook URLs

#### **Backstage integration issues**
- Verify plugin is added to package.json
- Check App.tsx route configuration
- Verify backend plugin is registered

### **Debug Mode**

```bash
# Enable debug logging
DEBUG=keninduty:* npm run start:api

# Check API health
curl http://localhost:7007/health

# View logs
tail -f keninduty-logs.json
```

---

## 📞 **SUPPORT**

If you encounter any issues:

1. **Check this troubleshooting guide**
2. **Search existing [GitHub Issues](https://github.com/kenissongmelo/watchful-kenin-portal/issues)**
3. **Create new issue** with detailed error information
4. **Join [GitHub Discussions](https://github.com/kenissongmelo/watchful-kenin-portal/discussions)** for community help

---

**🎉 Installation complete! Your KeninDuty platform is ready to use.**