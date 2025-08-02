import { DiscoveryApi, FetchApi, createApiRef } from '@backstage/core-plugin-api';

// Interfaces
export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  status?: 'available' | 'busy' | 'offline';
}

export interface RetryPolicy {
  maxRetries: number;
  retryInterval: number; // minutes
  escalationDelay: number; // minutes
  enabled: boolean;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  oncall: string;
  schedule?: ScheduleShift[];
  retryPolicy?: RetryPolicy;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleShift {
  userId: string;
  userName: string;
  phone: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}

export interface Alert {
  id: string;
  teamId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  provider?: string;
  incidentId?: string;
}

export interface CallAttempt {
  id: string;
  callId: string;
  teamId: string;
  memberId: string;
  memberName: string;
  phone: string;
  status: string;
  timestamp: string;
  duration?: number;
  alertId?: string;
  provider?: string;
  retryCount: number;
}

export interface OnCallInfo {
  teamId: string;
  teamName: string;
  onCallMember: TeamMember;
  schedule?: ScheduleShift[];
}

export interface DashboardStats {
  totalTeams: number;
  totalMembers: number;
  activeAlerts: number;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  alertsByProvider: Record<string, number>;
  callsByStatus: Record<string, number>;
}

export interface OnCallSchedule {
  id: string;
  name: string;
  teamId: string;
  timezone: string;
  shifts: ScheduleShift[];
  isActive: boolean;
}

export interface Config {
  maxRetries: number;
  retryInterval: number;
  escalationDelay: number;
  providers: Record<string, any>;
  notifications: Record<string, any>;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  members: Omit<TeamMember, 'id'>[];
  retryPolicy?: RetryPolicy;
}

export interface CreateAlertRequest {
  teamId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  provider: 'newrelic' | 'datadog' | 'grafana';
  nrql?: string; // Para New Relic
  query?: string; // Para Datadog e Grafana
  threshold?: number; // Limite para os alertas
  tags?: string[]; // Tags para organização
}

export interface CreateCallAttemptRequest {
  teamId: string;
  memberId: string;
  message?: string;
  alertId?: string;
}

export interface CreateScheduleRequest {
  name: string;
  timezone?: string;
  shifts: ScheduleShift[];
}

export class KeninDutyApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  private async getBaseUrl(): Promise<string> {
    return await this.discoveryApi.getBaseUrl('keninduty');
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${path}`;

    const response = await this.fetchApi.fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText}${errorText ? `: ${errorText}` : ''}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ========== TEAM MANAGEMENT ==========

  async getTeams(): Promise<Team[]> {
    return this.request<Team[]>('/teams');
  }

  async getTeam(id: string): Promise<Team> {
    return this.request<Team>(`/teams/${id}`);
  }

  async createTeam(team: CreateTeamRequest): Promise<Team> {
    return this.request<Team>('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    return this.request<Team>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTeam(id: string): Promise<void> {
    return this.request<void>(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== MEMBER MANAGEMENT ==========

  async addMember(teamId: string, member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    return this.request<TeamMember>(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }

  async removeMember(teamId: string, memberId: string): Promise<void> {
    return this.request<void>(`/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  async updateMemberStatus(
    teamId: string,
    memberId: string,
    status: 'available' | 'busy' | 'offline'
  ): Promise<TeamMember> {
    return this.request<TeamMember>(`/teams/${teamId}/members/${memberId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateMember(
    teamId: string,
    memberId: string,
    memberData: Partial<Omit<TeamMember, 'id'>>
  ): Promise<TeamMember> {
    return this.request<TeamMember>(`/teams/${teamId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify(memberData),
    });
  }

  // ========== ON-CALL MANAGEMENT ==========

  async getOnCallInfo(teamId: string): Promise<OnCallInfo> {
    return this.request<OnCallInfo>(`/teams/${teamId}/oncall`);
  }

  async setOnCall(teamId: string, memberId: string): Promise<OnCallInfo> {
    return this.request<OnCallInfo>(`/teams/${teamId}/oncall`, {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    });
  }

  // ========== SCHEDULE MANAGEMENT ==========

  async getSchedules(teamId: string): Promise<OnCallSchedule[]> {
    return this.request<OnCallSchedule[]>(`/teams/${teamId}/schedules`);
  }

  async createSchedule(teamId: string, schedule: CreateScheduleRequest): Promise<OnCallSchedule> {
    return this.request<OnCallSchedule>(`/teams/${teamId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  // ========== ALERT MANAGEMENT ==========

  async getAlerts(filters?: {
    teamId?: string;
    status?: string;
    provider?: string;
  }): Promise<Alert[]> {
    const searchParams = new URLSearchParams();
    if (filters?.teamId) searchParams.append('teamId', filters.teamId);
    if (filters?.status) searchParams.append('status', filters.status);
    if (filters?.provider) searchParams.append('provider', filters.provider);

    const query = searchParams.toString();
    return this.request<Alert[]>(`/alerts${query ? `?${query}` : ''}`);
  }

  async createAlert(alert: CreateAlertRequest): Promise<Alert> {
    return this.request<Alert>(`/providers/${alert.provider}/alerts`, {
      method: 'POST',
      body: JSON.stringify(alert),
    });
  }

  async testConnections(): Promise<any> {
    return this.request<any>('/providers/test-connections', {
      method: 'POST',
    });
  }

  async getProviders(): Promise<any[]> {
    return this.request<any[]>('/alerts/providers');
  }

  // ========== CALL ATTEMPTS ==========

  async getCallAttempts(filters?: {
    teamId?: string;
    status?: string;
    alertId?: string;
  }): Promise<CallAttempt[]> {
    const searchParams = new URLSearchParams();
    if (filters?.teamId) searchParams.append('teamId', filters.teamId);
    if (filters?.status) searchParams.append('status', filters.status);
    if (filters?.alertId) searchParams.append('alertId', filters.alertId);

    const query = searchParams.toString();
    return this.request<CallAttempt[]>(`/call-attempts${query ? `?${query}` : ''}`);
  }

  async createCallAttempt(callAttempt: CreateCallAttemptRequest): Promise<CallAttempt> {
    return this.request<CallAttempt>('/call-attempts', {
      method: 'POST',
      body: JSON.stringify(callAttempt),
    });
  }

  // ========== DASHBOARD ==========

  async getDashboardStats(timeframe?: '1h' | '24h' | '7d'): Promise<DashboardStats> {
    const query = timeframe ? `?timeframe=${timeframe}` : '';
    return this.request<DashboardStats>(`/dashboard/stats${query}`);
  }

  // ========== RETRY POLICY MANAGEMENT ==========

  async getRetryPolicy(teamId: string): Promise<RetryPolicy> {
    return this.request<RetryPolicy>(`/teams/${teamId}/retry-policy`);
  }

  async updateRetryPolicy(teamId: string, retryPolicy: RetryPolicy): Promise<Team> {
    return this.request<Team>(`/teams/${teamId}/retry-policy`, {
      method: 'PUT',
      body: JSON.stringify(retryPolicy),
    });
  }

  // ========== CONFIGURATION ==========

  async getConfig(): Promise<Config> {
    return this.request<Config>('/config');
  }

  async updateConfig(config: Partial<Config>): Promise<Config> {
    return this.request<Config>('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  // ========== HEALTH CHECK ==========

  async getHealth(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>('/health');
  }

  // ========== INTEGRATION WITH GO API ==========

  async initializeCall(callId: string, teamId: string, alertId: string): Promise<any> {
    return this.request<any>('/calls/init', {
      method: 'POST',
      body: JSON.stringify({ callId, teamId, alertId }),
    });
  }

  async sendCallStatus(status: {
    callId: string;
    status: string;
    duration?: number;
    notes?: string;
    timestamp?: string;
    incidentId?: string;
    provider?: string;
  }): Promise<any> {
    return this.request<any>('/callback/call-status', {
      method: 'POST',
      body: JSON.stringify(status),
    });
  }
}

// API Reference
export const keninDutyApiRef = createApiRef<KeninDutyApi>({
  id: 'plugin.kenin-duty.service',
});

// Export the client class
export class KeninDutyApiClient extends KeninDutyApi {}

// Default export
export default KeninDutyApi; 