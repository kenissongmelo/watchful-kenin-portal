# 🚨 KeninDuty - Intelligent Alert Management Platform

**Complete alert management solution with Backstage plugin and standalone portal**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Backstage](https://img.shields.io/badge/Backstage-9BF0E1?logo=backstage&logoColor=black)](https://backstage.io/)

## 🌟 **Dual Platform Solution**

This repository contains **two complete solutions** for alert management:

### 1. 🔌 **Backstage Plugin** (`backstage-plugin/`)
**Professional-grade plugin for Backstage platform**
- ✅ **Multi-Provider Support**: New Relic, Datadog, Grafana
- ✅ **Enterprise Integration**: Full Backstage ecosystem compatibility  
- ✅ **NPM Published**: Ready for community installation
- ✅ **TypeScript**: Complete type safety
- ✅ **Modern Architecture**: New Backstage backend system

### 2. 🌐 **Standalone Portal** (root directory)  
**Independent web application for direct usage**
- ✅ **React Frontend**: Modern UI with real-time updates
- ✅ **Express Backend**: Robust API server
- ✅ **Database Support**: Persistent data storage
- ✅ **Real-time Logs**: Live monitoring dashboard

---

## 🚀 **Quick Start**

### Option A: Backstage Plugin (Recommended for Backstage users)

```bash
# Install from NPM
yarn add @keninduty/backstage-plugin-kenin-duty
yarn add @keninduty/backstage-plugin-kenin-duty-backend

# Or clone this repo
git clone https://github.com/kenissongmelo/watchful-kenin-portal.git
cd watchful-kenin-portal/backstage-plugin
```

**📖 Full Installation Guide**: [backstage-plugin/kenin-duty/README.md](./backstage-plugin/kenin-duty/README.md)

### Option B: Standalone Portal

```bash
# Clone and run standalone
git clone https://github.com/kenissongmelo/watchful-kenin-portal.git
cd watchful-kenin-portal

# Install dependencies
npm install

# Start development
npm run dev
```

---

## 📦 **Repository Structure**

```
watchful-kenin-portal/
├── backstage-plugin/              # 🔌 BACKSTAGE PLUGIN
│   ├── kenin-duty/                # Frontend plugin
│   │   ├── src/
│   │   │   ├── components/        # React components
│   │   │   ├── api/               # API client
│   │   │   ├── types.ts           # TypeScript types
│   │   │   └── plugin.ts          # Plugin definition
│   │   ├── package.json           # NPM: @keninduty/backstage-plugin-kenin-duty
│   │   ├── README.md              # Installation guide
│   │   └── LICENSE
│   └── kenin-duty-backend/        # Backend plugin
│       ├── src/
│       │   ├── router.ts          # API routes
│       │   ├── module.ts          # Backend module
│       │   └── index.ts
│       ├── package.json           # NPM: @keninduty/backstage-plugin-kenin-duty-backend
│       └── README.md
├── src/                           # 🌐 STANDALONE PORTAL
│   ├── components/                # React components
│   ├── backend/                   # Express server
│   └── services/                  # Business logic
├── public/                        # Static assets
├── package.json                   # Standalone app dependencies
├── server.js                      # Express server
├── README.md                      # This file
└── LICENSE
```

---

## 🔥 **Features**

### 🎯 **Alert Management**
- **Multi-Provider Integration**: New Relic, Datadog, Grafana
- **Smart Escalation Policies**: Automatic retries and escalation
- **Real-time Notifications**: SMS, Email, Webhooks
- **Webhook Forwarding**: Forward alerts to external APIs

### 👥 **Team Management**  
- **On-call Schedules**: Automated team coordination
- **Role-based Access**: Primary, Secondary, Backup roles
- **Member Availability**: Real-time status tracking
- **Escalation Chains**: Multi-level escalation policies

### 📊 **Analytics & Monitoring**
- **Real-time Dashboard**: Live alert status and metrics
- **Performance Analytics**: Response times and resolution rates
- **Audit Trail**: Complete alert lifecycle tracking
- **Custom Reports**: Configurable analytics

### 🛠️ **Developer Experience**
- **TypeScript**: Complete type safety
- **Modern UI**: Material-UI components
- **RESTful API**: Well-documented endpoints
- **Extensible**: Plugin architecture for custom integrations

---

## 📖 **Documentation**

### Backstage Plugin
- **[Installation Guide](./backstage-plugin/kenin-duty/README.md)** - Complete setup instructions
- **[API Reference](./backstage-plugin/kenin-duty-backend/README.md)** - Backend API documentation
- **[Contributing](./backstage-plugin/kenin-duty/CONTRIBUTING.md)** - Development guidelines

### Standalone Portal
- **Configuration**: Environment setup and provider configuration
- **API Endpoints**: Complete REST API documentation  
- **Development**: Local development and testing

---

## 🔧 **Configuration**

### Environment Variables

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

# Notifications
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=your_phone_number
```

### Provider Integration

#### Backstage Configuration (`app-config.yaml`)
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

---

## 🧪 **Testing**

### Backstage Plugin
```bash
cd backstage-plugin/kenin-duty
yarn test
```

### Standalone Portal  
```bash
npm run test
```

### Integration Testing
```bash
# Test provider connections
curl -X POST http://localhost:7007/api/keninduty/providers/test-connections

# Test alert creation
curl -X POST http://localhost:7007/api/keninduty/providers/newrelic/alerts \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Alert", "severity": "high"}'
```

---

## 🤝 **Contributing**

We welcome contributions! Please see:

- **[Contributing Guide](./backstage-plugin/kenin-duty/CONTRIBUTING.md)** for development guidelines
- **[Issues](https://github.com/kenissongmelo/watchful-kenin-portal/issues)** for bug reports and feature requests
- **[Discussions](https://github.com/kenissongmelo/watchful-kenin-portal/discussions)** for questions and ideas

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if needed
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 **Support**

- **📖 Documentation**: [Wiki](https://github.com/kenissongmelo/watchful-kenin-portal/wiki)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/kenissongmelo/watchful-kenin-portal/issues)
- **💬 Community**: [GitHub Discussions](https://github.com/kenissongmelo/watchful-kenin-portal/discussions)
- **📧 Email**: kenissongmelo@gmail.com

---

## 🌟 **NPM Packages**

The Backstage plugin is also available as NPM packages:

- **Frontend**: [`@keninduty/backstage-plugin-kenin-duty`](https://www.npmjs.com/package/@keninduty/backstage-plugin-kenin-duty)
- **Backend**: [`@keninduty/backstage-plugin-kenin-duty-backend`](https://www.npmjs.com/package/@keninduty/backstage-plugin-kenin-duty-backend)

---

## 🎉 **Acknowledgments**

- **[Backstage](https://backstage.io/)** for the amazing platform
- **[Material-UI](https://mui.com/)** for the UI components  
- **Community contributors** for feedback and improvements

---

**⭐ If this project helps you, please consider giving it a star on GitHub!**

---

<div align="center">

**Made with ❤️ for the developer community**

[Website](https://github.com/kenissongmelo/watchful-kenin-portal) • [Documentation](https://github.com/kenissongmelo/watchful-kenin-portal/wiki) • [NPM](https://www.npmjs.com/package/@keninduty/backstage-plugin-kenin-duty)

</div>