
# Integração com APIs Externas

Documentação detalhada das integrações com New Relic e Datadog.

## 🔄 Arquitetura de Integração

### Fluxo de Dados
```
KeninDuty → AlertProviderService → [New Relic API | Datadog API] → Resposta
```

### Arquivo Principal
- **Localização**: `src/services/alertProviders.ts`
- **Responsabilidade**: Comunicação com APIs externas

## 🆕 New Relic Integration

### Configuração
```typescript
const newRelicService = new NewRelicService(apiKey, accountId);
```

### Endpoints Utilizados
- **Criar Alerta**: `POST /v2/alerts_conditions.json`
- **Testar Conexão**: `GET /v2/applications.json`

### Formato de Alerta
```typescript
interface NewRelicAlert {
  name: string;
  type: 'static';
  enabled: true;
  entities: string[];
  nrql: { query: string };
  signal: {
    aggregation_window: number;
    evaluation_offset: number;
  };
  terms: Array<{
    priority: 'critical' | 'warning';
    operator: 'above' | 'below' | 'equal';
    threshold: number;
    threshold_duration: number;
    threshold_occurrences: 'all' | 'at_least_once';
  }>;
}
```

### Headers Necessários
```typescript
{
  'X-Api-Key': apiKey,
  'Content-Type': 'application/json'
}
```

## 🐕 Datadog Integration

### Configuração
```typescript
const datadogService = new DatadogService(apiKey, appKey);
```

### Endpoints Utilizados
- **Criar Alerta**: `POST /api/v1/monitors`
- **Testar Conexão**: `GET /api/v1/validate`

### Formato de Alerta
```typescript
interface DatadogAlert {
  name: string;
  type: 'metric alert';
  query: string;
  message: string;
  tags: string[];
  options: {
    thresholds: {
      critical: number;
      warning?: number;
    };
    notify_audit: boolean;
    timeout_h: number;
    evaluation_delay: number;
    new_host_delay: number;
    require_full_window: boolean;
    notify_no_data: boolean;
    renotify_interval: number;
  };
}
```

### Headers Necessários
```typescript
{
  'DD-API-KEY': apiKey,
  'DD-APPLICATION-KEY': appKey,
  'Content-Type': 'application/json'
}
```

## 🔧 Configuração de CORS

Para desenvolvimento local, adicione ao `app-config.yaml`:

```yaml
proxy:
  '/api/newrelic':
    target: 'https://api.newrelic.com'
    pathRewrite:
      '^/api/newrelic': ''
    changeOrigin: true
    headers:
      X-Api-Key: '${NEW_RELIC_API_KEY}'
      
  '/api/datadog':
    target: 'https://api.datadoghq.com'
    pathRewrite:
      '^/api/datadog': ''
    changeOrigin: true
    headers:
      DD-API-KEY: '${DATADOG_API_KEY}'
      DD-APPLICATION-KEY: '${DATADOG_APP_KEY}'
```

## 🔐 Segurança

### Armazenamento de Credenciais
- Utiliza `localStorage` para persistência local
- Não envia credenciais para backend próprio
- Comunicação direta com APIs oficiais

### Validação
- Teste de conectividade antes de criar alertas
- Validação de resposta das APIs
- Tratamento de erros HTTP

## 📊 Monitoramento de Integrações

### Logs de Debug
```typescript
console.log('Creating alert:', alertData);
console.log('Provider response:', response);
```

### Métricas de Sucesso
- Taxa de sucesso de criação de alertas
- Tempo de resposta das APIs
- Erros de conectividade

---

*Integrações testadas com New Relic REST API v2 e Datadog API v1*
