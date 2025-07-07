# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Sistema completo de gerenciamento de on-call
- Integração com providers (New Relic, Datadog, Grafana)
- Dashboard em tempo real com métricas
- Sistema de escalonamento inteligente
- Logs persistentes e em tempo real
- Interface moderna com Material-UI
- Paginação em alertas e times
- Sistema de callbacks para status de chamadas

### Changed
- Refatoração completa da arquitetura
- Melhoria na interface do usuário
- Otimização do sistema de logs

### Fixed
- Correção no sistema de retry
- Ajuste na validação de schemas
- Correção de erros de compilação

## [0.1.0] - 2024-12-19

### Added
- Versão inicial do plugin KeninDuty
- Backend API com Express
- Frontend React com Material-UI
- Sistema básico de alertas
- Gestão de times
- Integração com Backstage

---

## Version History

- **0.1.0**: Versão inicial com funcionalidades básicas
- **Unreleased**: Versão atual com todas as funcionalidades completas

## Migration Guide

### From 0.1.0 to Unreleased

1. **Backup dos dados**: Faça backup dos arquivos JSON existentes
2. **Atualizar dependências**: Execute `npm install` para instalar novas dependências
3. **Configurar variáveis de ambiente**: Use o novo arquivo `env.example`
4. **Migrar dados**: Os dados antigos serão automaticamente migrados

## Breaking Changes

- Mudança na estrutura de dados dos times
- Novos endpoints de API
- Alteração no formato dos logs

## Deprecations

- Endpoints antigos serão removidos na próxima versão
- Configurações antigas serão substituídas pelo novo sistema 