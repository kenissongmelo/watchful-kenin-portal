# KeninDuty Plugin Screenshots

Esta pasta contém os screenshots que demonstram as funcionalidades do plugin KeninDuty.

## Imagens necessárias:

### 1. dashboard.png
- **Descrição**: Tela principal do dashboard
- **Conteúdo**: Cards de estatísticas (Times, Membros, Alertas Ativos, Chamadas Atendidas) e seção de alertas recentes
- **Dimensões sugeridas**: 1200x800px
- **Screenshot da aba**: Dashboard

### 2. teams.png
- **Descrição**: Gerenciamento de times
- **Conteúdo**: Lista de times com políticas de tentativas, membros e status de plantão
- **Dimensões sugeridas**: 1200x800px
- **Screenshot da aba**: Times

### 3. alerts.png
- **Descrição**: Gerenciamento de alertas
- **Conteúdo**: Lista de alertas por provider (New Relic, Datadog, Grafana) com filtros
- **Dimensões sugeridas**: 1200x800px
- **Screenshot da aba**: Alertas

### 4. calls.png
- **Descrição**: Histórico de chamadas
- **Conteúdo**: Lista de tentativas de chamadas por time com status e detalhes
- **Dimensões sugeridas**: 1200x800px
- **Screenshot da aba**: Chamadas

### 5. configuration.png
- **Descrição**: Página de configuração
- **Conteúdo**: Seções de integração com providers de monitoramento e configurações de notificação
- **Dimensões sugeridas**: 1200x800px
- **Screenshot da aba**: Configurações

## Como capturar os screenshots:

1. Navegue até http://localhost:3000/kenin-duty
2. Acesse cada aba do plugin
3. Capture screenshot de cada tela
4. Salve os arquivos PNG nesta pasta com os nomes especificados acima
5. Commit e push as imagens para o repositório

## Exemplo de comando para adicionar imagens:
```bash
# Após capturar os screenshots, adicione-os ao git:
git add plugins/kenin-duty/docs/images/*.png
git commit -m "docs: adiciona screenshots do plugin KeninDuty"
git push origin master
``` 