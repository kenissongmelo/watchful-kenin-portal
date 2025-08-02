export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved' | 'closed';
  provider: Provider;
  nrql?: string;
  createdAt: string;
  updatedAt: string;
  teamId?: string;
  assignedTo?: string;
  notes?: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  escalationPolicy: EscalationPolicy;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'primary' | 'secondary' | 'backup';
  isAvailable: boolean;
  timezone: string;
}

export interface EscalationPolicy {
  id: string;
  name: string;
  levels: EscalationLevel[];
  autoEscalate: boolean;
  escalationDelay: number; // minutes
}

export interface EscalationLevel {
  level: number;
  members: string[]; // member IDs
  delay: number; // minutes
  retryCount: number;
}

export interface Call {
  id: string;
  alertId: string;
  teamId: string;
  status: 'pending' | 'in-progress' | 'acknowledged' | 'resolved' | 'closed';
  currentLevel: number;
  currentMemberIndex: number;
  retryCount: number;
  maxRetries: number;
  escalationPolicy: EscalationPolicy;
  attempts: CallAttempt[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface CallAttempt {
  id: string;
  memberId: string;
  memberName: string;
  level: number;
  attempt: number;
  status: 'pending' | 'sent' | 'acknowledged' | 'failed' | 'timeout';
  sentAt: string;
  acknowledgedAt?: string;
  timeoutAt?: string;
  response?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana' | 'custom';
  config: Record<string, any>;
  isActive: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  callId?: string;
  details?: any;
}

export interface CreateAlertRequest {
  title: string;
  description: string;
  severity: Alert['severity'];
  provider: 'newrelic' | 'datadog' | 'grafana';
  nrql?: string; // Para New Relic
  query?: string; // Para Datadog e Grafana
  threshold?: number; // Limite para os alertas
  tags?: string[]; // Tags para organização
  teamId?: string;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  members: Omit<TeamMember, 'id'>[];
  escalationPolicy: Omit<EscalationPolicy, 'id'>;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  members?: Omit<TeamMember, 'id'>[];
  escalationPolicy?: Omit<EscalationPolicy, 'id'>;
  isActive?: boolean;
}

export interface CallbackRequest {
  callId: string;
  status: 'acknowledged' | 'resolved' | 'timeout';
  response?: string;
  memberId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProviderConfig {
  id: string;
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana';
  apiKey: string;
  baseUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderConfigRequest {
  name: string;
  type: 'newrelic' | 'datadog' | 'grafana';
  apiKey: string;
  baseUrl?: string;
}

export interface UpdateProviderConfigRequest {
  name?: string;
  apiKey?: string;
  baseUrl?: string;
  isActive?: boolean;
} 