# 🚨 KeninDuty - Intelligent Alert Management for Backstage

[![npm version](https://badge.fury.io/js/@keninduty%2Fbackstage-plugin-kenin-duty.svg)](https://badge.fury.io/js/@keninduty%2Fbackstage-plugin-kenin-duty)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Backstage](https://img.shields.io/badge/Backstage-Plugin-7C3AED)](https://backstage.io/)

**KeninDuty** é um plugin inteligente de gerenciamento de alertas para Backstage que integra múltiplos provedores de monitoramento em uma única plataforma unificada.

## 🌟 Principais Características

### 🔥 **Integração Multi-Provider**
- ✅ **New Relic** - Alertas baseados em NRQL
- ✅ **Datadog** - Monitoramento baseado em métricas  
- ✅ **Grafana** - Dashboards unificados e alertas

### ⚡ **Recursos Avançados**
- 🎯 **Políticas de Escalação Inteligentes** - Escalação multinível com tentativas automáticas
- 📱 **Gerenciamento de Times em Tempo Real** - Plantões e coordenação de equipes
- 🔔 **Notificações Inteligentes** - Integração SMS, Email e Webhook
- 📊 **Dashboards Abrangentes** - Status em tempo real e analytics
- 🔄 **Encaminhamento de Webhook** - Encaminhar alertas para APIs externas

## 📱 Screenshots

### Dashboard Principal
![Dashboard](./docs/images/dashboard.png)
*Visão geral da saúde do sistema com estatísticas em tempo real*

### Gerenciamento de Times
![Teams](./docs/images/teams.png)
*Gerencie times de plantão, políticas de escalação e disponibilidade de membros*

### Gerenciamento de Alertas
![Alerts](./docs/images/alerts.png)
*Configure e monitore alertas de múltiplos provedores de monitoramento*

### Histórico de Chamadas
![Calls](./docs/images/calls.png)
*Rastreie tentativas de chamadas e histórico de escalação*

### Configuração
![Configuration](./docs/images/configuration.png)
*Configuração fácil para múltiplas contas de provedores e notificações*

## 🚀 Instalação Rápida

### Pré-requisitos
- Backstage v1.15.0+
- Node.js 18+
- Yarn ou npm

### 1. Instalar Pacotes

```bash
# Frontend
yarn add --cwd packages/app @keninduty/backstage-plugin-kenin-duty

# Backend  
yarn add --cwd packages/backend @keninduty/backstage-plugin-kenin-duty-backend
```

### 2. Configurar Frontend

**`packages/app/src/App.tsx`**
```typescript
import { KeninDutyMainPage } from '@keninduty/backstage-plugin-kenin-duty';

// Adicionar na seção de rotas
<Route path="/kenin-duty" element={<KeninDutyMainPage />} />
```

**`packages/app/src/components/Root/Root.tsx`**
```typescript
import LocalPhoneIcon from '@material-ui/icons/LocalPhone';

// Adicionar no menu lateral
<SidebarItem icon={LocalPhoneIcon} to="kenin-duty" text="KeninDuty" />
```

**`packages/app/src/apis.ts`**
```typescript
import { keninDutyApiRef, KeninDutyApi } from '@keninduty/backstage-plugin-kenin-duty';

// Registrar API
export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: keninDutyApiRef,
    deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
    factory: ({ discoveryApi, fetchApi }) =>
      new KeninDutyApi({ discoveryApi, fetchApi }),
  }),
  // ... outras APIs
];
```

### 3. Configurar Backend

**`packages/backend/src/index.ts`**
```typescript
// Adicionar o plugin backend
backend.add(import('@keninduty/backstage-plugin-kenin-duty-backend'));
```

### 4. Configuração

**`app-config.yaml`**
```yaml
keninDuty:
  providers:
    newrelic:
      enabled: true
      baseUrl: 'https://api.newrelic.com'
      
    datadog:
      enabled: true
      baseUrl: 'https://api.datadoghq.com'
      
    grafana:
      enabled: true
      
  notifications:
    twilio:
      enabled: true
```

**`app-config.local.yaml`** (para desenvolvimento)
```yaml
keninDuty:
  providers:
    newrelic:
      apiKey: ${NEW_RELIC_API_KEY}
      accountId: ${NEW_RELIC_ACCOUNT_ID}
      
    datadog:
      apiKey: ${DATADOG_API_KEY}
      appKey: ${DATADOG_APP_KEY}
      
    grafana:
      url: ${GRAFANA_URL}
      token: ${GRAFANA_API_KEY}
      
  notifications:
    twilio:
      accountSid: ${TWILIO_ACCOUNT_SID}
      authToken: ${TWILIO_AUTH_TOKEN}
      fromNumber: ${TWILIO_FROM_NUMBER}
```

## 🔧 Desenvolvimento

### Configurar Ambiente

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/backstage-plugin-kenin-duty.git
cd backstage-plugin-kenin-duty

# Instalar dependências
yarn install

# Executar testes
yarn test

# Build
yarn build
```

### Estrutura do Projeto

```
plugins/
├── kenin-duty/                    # Plugin Frontend
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── api/                  # Cliente API
│   │   └── index.ts              # Exports principais
│   └── package.json
│
└── kenin-duty-backend/           # Plugin Backend
    ├── src/
    │   ├── router.ts            # Rotas da API
    │   ├── plugin.ts            # Configuração do plugin
    │   └── index.ts             # Exports principais
    └── package.json
```

## 📖 Guias Detalhados

### Configurando Provedores

#### New Relic
1. Obtenha sua API Key no New Relic
2. Configure `NEW_RELIC_API_KEY` e `NEW_RELIC_ACCOUNT_ID`
3. Teste a conexão na aba Configurações

#### Datadog
1. Obtenha API Key e App Key no Datadog
2. Configure `DATADOG_API_KEY` e `DATADOG_APP_KEY`  
3. Teste a conexão na aba Configurações

#### Grafana
1. Gere um token de API no Grafana
2. Configure `GRAFANA_URL` e `GRAFANA_API_KEY`
3. Teste a conexão na aba Configurações

### Criando Alertas

1. Navegue para `/kenin-duty`
2. Vá para a aba **Alertas**
3. Clique em **Adicionar Alerta**
4. Selecione o provedor e configure:
   - **Nome** e **Descrição**
   - **Query/Condição** específica do provedor
   - **Severidade** (low, medium, high, critical)
   - **Conta do Provedor** (das contas configuradas)

### Gerenciando Times

1. Acesse a aba **Times**
2. Clique em **Criar Time**
3. Configure:
   - **Nome** e **Descrição** do time
   - **Política de Tentativas** (número de tentativas e intervalo)
   - **Membros** com roles e telefones

## 🌐 API Reference

### Frontend API

```typescript
import { keninDutyApiRef } from '@keninduty/backstage-plugin-kenin-duty';

// Usar no componente
const api = useApi(keninDutyApiRef);

// Buscar times
const teams = await api.getTeams();

// Buscar alertas
const alerts = await api.getAlerts();

// Criar conta de provedor
await api.createProviderAccount({
  name: "Produção New Relic",
  type: "newrelic",
  config: { apiKey: "...", accountId: "..." }
});
```

### Backend Endpoints

```bash
# Health check
GET /api/keninduty/health

# Contas de provedores
GET /api/keninduty/provider-accounts
POST /api/keninduty/provider-accounts
PUT /api/keninduty/provider-accounts/:id
DELETE /api/keninduty/provider-accounts/:id
POST /api/keninduty/provider-accounts/:id/test-connection

# Times
GET /api/keninduty/teams
POST /api/keninduty/teams
PUT /api/keninduty/teams/:id
DELETE /api/keninduty/teams/:id

# Alertas
GET /api/keninduty/alerts
POST /api/keninduty/alerts
PUT /api/keninduty/alerts/:id
DELETE /api/keninduty/alerts/:id

# Dashboard
GET /api/keninduty/dashboard/stats
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Aqui está como você pode ajudar:

### Processo de Contribuição
1. Fork o repositório
2. Crie uma branch feature: `git checkout -b feature/nova-funcionalidade`
3. Faça suas alterações e adicione testes
4. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
5. Push: `git push origin feature/nova-funcionalidade`
6. Abra um Pull Request

### Diretrizes de Desenvolvimento
- 🔧 **Estilo de Código**: Siga as melhores práticas TypeScript e React
- ✅ **Testes**: Adicione testes para novas funcionalidades
- 📖 **Documentação**: Atualize README e documentação inline
- 🐛 **Bug Fixes**: Inclua steps de reprodução na descrição do PR

### Tipos de Contribuição
- 🌟 **Novas funcionalidades**
- 🐛 **Correções de bugs**
- 📖 **Melhorias na documentação**  
- 🔧 **Refatoração de código**
- ✅ **Adição de testes**

## 🌟 Comunidade & Suporte

### Obtendo Ajuda
- 📖 [Documentação Completa](https://github.com/seu-usuario/backstage-plugin-kenin-duty)
- 🐛 [Reportar Issues](https://github.com/seu-usuario/backstage-plugin-kenin-duty/issues)
- 💬 [Discussões da Comunidade](https://github.com/seu-usuario/backstage-plugin-kenin-duty/discussions)
- 🚀 [Release Notes](https://github.com/seu-usuario/backstage-plugin-kenin-duty/releases)

### Roadmap

**v1.1.0 (Próxima)**
- 🔔 Integração com Microsoft Teams
- 📊 Métricas avançadas de performance
- 🔄 Webhook bi-direcionais

**v1.2.0 (Futuro)**
- 🤖 IA para detecção de anomalias
- 📱 App mobile companion
- 🌐 Multi-tenant support

### Estatísticas da Comunidade
- ⭐ **Usuários**: Comunidade crescente de equipes enterprise
- 🔧 **Casos de Uso**: Monitoramento DevOps, resposta a incidentes, gerenciamento de alertas
- 🌍 **Global**: Usado por equipes ao redor do mundo

## 📄 Licença

Apache-2.0 License - veja [LICENSE](LICENSE) para detalhes.

## ✨ Agradecimentos

- 💙 **Backstage Community** - Por criar uma plataforma incrível
- 🛠️ **Contributors** - Por todas as contribuições e feedback
- 🌟 **Users** - Por usar e melhorar o plugin

---

**Feito com ❤️ para a comunidade Backstage**

> **Pronto para começar?** Siga nosso guia de instalação e junte-se à comunidade!

### 🔗 Links Úteis
- [Backstage.io](https://backstage.io/)
- [Plugin Development Guide](https://backstage.io/docs/plugins/)
- [Community Discord](https://discord.gg/backstage)

---

**⭐ Se este plugin foi útil, considere dar uma estrela no repositório!** 