
# Integração KeninDuty com Backstage

Este guia fornece instruções detalhadas para integrar o KeninDuty como um plugin do Backstage, incluindo prints de todas as páginas e configurações necessárias.

## 📋 Pré-requisitos

- Backstage v1.20+ instalado e funcionando
- Node.js v18+ 
- Yarn (recomendado) ou NPM
- Acesso de administrador no Backstage

## 🏗️ Estrutura do Plugin

O KeninDuty é um plugin completo de gerenciamento de alertas que inclui:

### 📊 Dashboard Principal
![Dashboard](./screenshots/dashboard.png)

**Características:**
- Visão geral de alertas ativos
- Métricas de sistema em tempo real
- Alertas recentes e tendências
- Status de conectividade com provedores

### 🔔 Gerenciamento de Alertas
![Lista de Alertas](./screenshots/alerts-list.png)

**Funcionalidades:**
- Lista completa de alertas configurados
- Filtros por provedor e status
- Ações de editar, pausar/ativar e excluir
- Visualização de queries e thresholds

### ➕ Criação de Alertas
![Criar Alerta](./screenshots/create-alert.png)

**Recursos:**
- Formulário intuitivo para novos alertas
- Suporte a New Relic e Datadog
- Validação em tempo real
- Preview de configurações

### ⚙️ Configuração de Provedores
![Configuração de Provedores](./screenshots/providers-config.png)

**Configurações:**
- Credenciais New Relic e Datadog
- Teste de conectividade
- Gerenciamento seguro de API keys

## 🚀 Instalação Passo a Passo

### Passo 1: Preparar o Código do Plugin

1. **Criar estrutura do plugin:**
```bash
mkdir -p packages/plugins/kenin-duty
cd packages/plugins/kenin-duty
```

2. **Copiar arquivos do projeto:**
```bash
# Copie todos os arquivos da pasta src/ para packages/plugins/kenin-duty/src/
cp -r /path/to/kenin-duty/src/* packages/plugins/kenin-duty/src/
```

### Passo 2: Configurar package.json

Criar `packages/plugins/kenin-duty/package.json`:

```json
{
  "name": "@internal/plugin-kenin-duty",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "private": true,
  "scripts": {
    "build": "backstage-cli package build",
    "lint": "backstage-cli package lint",
    "test": "backstage-cli package test",
    "clean": "backstage-cli package clean"
  },
  "dependencies": {
    "@backstage/core-components": "^0.14.0",
    "@backstage/core-plugin-api": "^1.9.0",
    "@backstage/theme": "^0.5.0",
    "@backstage/plugin-catalog-react": "^1.12.0",
    "@material-ui/core": "^4.12.4",
    "@material-ui/icons": "^4.11.3",
    "@material-ui/lab": "^4.0.0-alpha.61",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "react-use": "^17.4.0"
  },
  "devDependencies": {
    "@backstage/cli": "^0.26.0"
  }
}
```

### Passo 3: Adaptar para Backstage

#### 3.1 Atualizar src/index.ts

```typescript
export { keninDutyPlugin, KeninDutyPage } from './plugin';
export type { KeninDutyPluginConfig } from './types';
```

#### 3.2 Atualizar src/plugin.ts

```typescript
import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const keninDutyPlugin = createPlugin({
  id: 'kenin-duty',
  routes: {
    root: rootRouteRef,
  },
});

export const KeninDutyPage = keninDutyPlugin.provide(
  createRoutableExtension({
    name: 'KeninDutyPage',
    component: () =>
      import('./components/KeninDutyRouter').then(m => m.KeninDutyRouter),
    mountPoint: rootRouteRef,
  }),
);
```

#### 3.3 Atualizar src/routes.ts

```typescript
import { createRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'kenin-duty',
});
```

### Passo 4: Configurar no App Principal

#### 4.1 Atualizar packages/app/package.json

Adicionar a dependência:
```json
{
  "dependencies": {
    "@internal/plugin-kenin-duty": "link:../plugins/kenin-duty"
  }
}
```

#### 4.2 Atualizar packages/app/src/App.tsx

```typescript
import { KeninDutyPage } from '@internal/plugin-kenin-duty';

// ... outras importações

const routes = (
  <FlatRoutes>
    {/* ... outras rotas */}
    <Route path="/kenin-duty/*" element={<KeninDutyPage />} />
  </FlatRoutes>
);
```

#### 4.3 Atualizar Sidebar

Em `packages/app/src/components/Root/Root.tsx`:

```typescript
import { SidebarItem } from '@backstage/core-components';
import NotificationsIcon from '@material-ui/icons/Notifications';

// Dentro do componente Root
<SidebarItem icon={NotificationsIcon} to="kenin-duty" text="Alert Management" />
```

### Passo 5: Configuração de Ambiente

#### 5.1 Variáveis de Ambiente

Adicionar ao `app-config.yaml`:

```yaml
keninDuty:
  providers:
    newRelic:
      enabled: true
      apiUrl: https://api.newrelic.com/v2
    datadog:
      enabled: true
      apiUrl: https://api.datadoghq.com/api/v1
```

#### 5.2 Configuração de Proxy (Opcional)

Para evitar problemas de CORS:

```yaml
proxy:
  '/newrelic/api':
    target: 'https://api.newrelic.com'
    pathRewrite:
      '^/newrelic/api': ''
    changeOrigin: true
    
  '/datadog/api':
    target: 'https://api.datadoghq.com'
    pathRewrite:
      '^/datadog/api': ''
    changeOrigin: true
```

## 🔧 Configuração Avançada

### Personalização de Tema

Para ajustar cores ao tema do Backstage:

```typescript
// Em src/components/Dashboard.tsx
import { useTheme } from '@backstage/theme';

const Dashboard = () => {
  const theme = useTheme();
  
  // Usar theme.palette.primary.main, etc.
};
```

### Integração com Catálogo

Para listar apenas serviços do catálogo:

```typescript
import { useApi, catalogApiRef } from '@backstage/core-plugin-api';

const { entities } = useApi(catalogApiRef).getEntities({
  filter: {
    kind: 'Component',
  },
});
```

## 🎯 Exemplo de Uso Completo

### 1. Configurar Provedores
![Configurar New Relic](./screenshots/setup-newrelic.png)

1. Acesse "Providers" no menu lateral
2. Insira suas credenciais do New Relic:
   - **API Key**: Sua chave de API do New Relic
   - **Account ID**: ID da sua conta

### 2. Testar Conectividade
![Teste de Conexão](./screenshots/test-connection.png)

Clique em "Test Connection" para verificar se as credenciais estão corretas.

### 3. Criar Primeiro Alerta
![Criar Alerta](./screenshots/create-first-alert.png)

1. Vá para "Create Alert"
2. Preencha:
   - **Nome**: "High CPU Usage"
   - **Serviço**: "payment-api"
   - **Query**: `SELECT average(cpuPercent) FROM SystemSample`
   - **Threshold**: "80"

### 4. Monitorar Dashboard
![Dashboard Completo](./screenshots/dashboard-complete.png)

O dashboard mostrará:
- Total de alertas configurados
- Alertas ativos que precisam de atenção
- Métricas de sistema em tempo real
- Histórico de alertas recentes

## 🔍 Troubleshooting

### Problemas Comuns

1. **Plugin não aparece no Backstage**
   - Verifique se o plugin foi adicionado ao `package.json`
   - Execute `yarn install` na raiz do projeto
   - Reinicie o Backstage

2. **Erro de CORS**
   - Configure o proxy no `app-config.yaml`
   - Ou use um servidor backend intermediário

3. **Alertas não são criados**
   - Verifique as credenciais dos provedores
   - Teste a conectividade na página de configuração
   - Verifique os logs do navegador

### Logs e Debug

Para habilitar logs detalhados:

```yaml
# app-config.yaml
backend:
  logger:
    level: debug
    format: simple
```

## 📝 Próximos Passos

Após a instalação, você pode:

1. **Configurar Alertas Personalizados**: Criar alertas específicos para seus serviços
2. **Integrar com Notifications**: Conectar com sistemas de notificação do Backstage
3. **Adicionar Métricas**: Expandir o dashboard com métricas customizadas
4. **Configurar Automação**: Criar workflows automáticos baseado em alertas

## 🆘 Suporte

Para suporte adicional:
- Verifique a documentação oficial do Backstage
- Consulte os logs do browser (F12)
- Teste as APIs diretamente usando ferramentas como Postman

---

**Desenvolvido para integração perfeita com Backstage v1.20+**
