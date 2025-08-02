/**
 * KeninDuty Plugin for Backstage
 * 
 * Intelligent Alert Management Platform with integrations for:
 * - New Relic
 * - Datadog  
 * - Grafana
 * 
 * @packageDocumentation
 */

export { keninDutyPlugin, keninDutyPlugin as plugin, KeninDutyPage } from './plugin';
export { KeninDutyMainPage } from './components/KeninDutyMainPage';
export { KeninDutyIcon } from './components/KeninDutyIcon';
export { rootRouteRef, teamsRouteRef } from './routes';
export type {
  Alert,
  Team,
  TeamMember,
  EscalationPolicy,
  EscalationLevel,
  Schedule,
  ScheduleShift,
  OnCallStatus,
  NotificationChannel,
  Provider,
  CreateAlertRequest,
  CallInitRequest,
  CallStatusRequest,
  HealthStatus
} from './types';