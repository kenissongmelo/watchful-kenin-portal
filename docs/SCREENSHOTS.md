
# Screenshots do KeninDuty

Este arquivo documenta todas as telas do sistema KeninDuty para referência na documentação.

## 📊 Dashboard Principal

### Visão Geral
- **Arquivo**: `src/components/Dashboard.tsx`
- **Rota**: `/`
- **Descrição**: Página principal com métricas e resumo de alertas

**Elementos Principais:**
- Cards de estatísticas (Total, Ativos, Resolvidos, Tempo Médio)
- Lista de alertas recentes
- Métricas de saúde do sistema
- Indicadores de conectividade

### Layout Responsivo
- Design adaptativo para desktop e mobile
- Gradientes azuis e cores do tema
- Ícones Lucide React

## 🔔 Lista de Alertas

### Gerenciamento de Alertas
- **Arquivo**: `src/components/AlertsList.tsx`
- **Rota**: `/alerts`
- **Descrição**: Interface para gerenciar todos os alertas configurados

**Funcionalidades:**
- Filtros por provedor (New Relic, Datadog)
- Busca por nome ou serviço
- Ações: Play/Pause, Editar, Excluir, Link Externo
- Visualização de queries NRQL/Datadog

### Estados dos Alertas
- **Ativo**: Badge verde, funcional
- **Pausado**: Badge cinza, inativo
- **Crítico**: Badge vermelho, requer atenção

## ➕ Criação de Alertas

### Formulário de Criação
- **Arquivo**: `src/components/CreateAlert.tsx`
- **Rota**: `/create`
- **Descrição**: Interface para criar novos alertas

**Campos do Formulário:**
- Nome do alerta
- Serviço alvo
- Provedor (New Relic/Datadog)
- Query de monitoramento
- Threshold/limite
- Descrição opcional

### Validação em Tempo Real
- Validação de campos obrigatórios
- Preview de configurações
- Mensagens de erro contextual

## ⚙️ Configuração de Provedores

### Gerenciamento de Credenciais
- **Arquivo**: `src/components/ProvidersConfig.tsx`
- **Rota**: `/providers`
- **Descrição**: Configuração de credenciais para provedores externos

**Provedores Suportados:**
- **New Relic**: API Key + Account ID
- **Datadog**: API Key + App Key

### Teste de Conectividade
- Botões de teste para cada provedor
- Indicadores visuais de status
- Armazenamento seguro local

## 🎨 Componentes Visuais

### Sidebar Navegação
- **Arquivo**: `src/components/Sidebar.tsx`
- **Funcionalidade**: Menu lateral colapsável
- **Itens**: Dashboard, Alerts, Create, Providers

### Elementos UI
- Cards com gradientes
- Badges de status coloridos
- Botões com ícones Lucide
- Formulários responsivos
- Toasts de feedback

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Adaptações
- Sidebar colapsável em mobile
- Grid responsivo nos cards
- Formulários em coluna única
- Tabelas com scroll horizontal

---

*Todas as telas seguem o design system do Backstage e utilizam shadcn/ui + Tailwind CSS*
