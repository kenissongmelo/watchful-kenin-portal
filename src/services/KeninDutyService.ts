export interface KeninDutyConfig {
  // API do plugin KeninDuty
  pluginApiUrl: string;
  pluginHealthUrl: string;
  
  // API de ligações (que faz as chamadas reais)
  callsApiUrl: string;
  callsHealthUrl: string;
  
  // Configurações gerais
  timeout: number;
  autoRefresh: boolean;
  refreshInterval: number;
  enableLogs: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  source: string;
  metadata?: any;
}

class KeninDutyService {
  private config: KeninDutyConfig = {
    // API do plugin KeninDuty (porta 7007)
    pluginApiUrl: 'http://localhost:7007',
    pluginHealthUrl: 'http://localhost:7007/health',
    
    // API de ligações (configurável)
    callsApiUrl: 'http://localhost:8080',
    callsHealthUrl: 'http://localhost:8080/stats',
    
    // Configurações gerais
    timeout: 5000,
    autoRefresh: false,
    refreshInterval: 30,
    enableLogs: true,
    logLevel: 'info'
  };

  private logs: LogEntry[] = [];
  private logSubscribers: ((logs: LogEntry[]) => void)[] = [];

  constructor() {
    this.loadConfig();
  }

  // Configuration methods
  getConfig(): KeninDutyConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<KeninDutyConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem('keninduty-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load KeninDuty config:', error);
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('keninduty-config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save KeninDuty config:', error);
    }
  }

  // API methods
  async makeRequest(endpoint: string, options: RequestInit = {}, useCallsApi: boolean = false): Promise<any> {
    const baseUrl = useCallsApi ? this.config.callsApiUrl : this.config.pluginApiUrl;
    const url = `${baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    console.log(`Making request to ${useCallsApi ? 'Calls' : 'Plugin'} API:`, url);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        credentials: useCallsApi ? 'include' : 'omit', // Don't include credentials for plugin API
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      console.log(`Response from ${useCallsApi ? 'Calls' : 'Plugin'} API:`, response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Data from ${useCallsApi ? 'Calls' : 'Plugin'} API:`, data);
      return data;
    } catch (error: any) {
      console.error(`Error in ${useCallsApi ? 'Calls' : 'Plugin'} API request:`, error);
      this.addLog('error', 'api-request', `Request failed: ${error.message}`, {
        endpoint,
        error: error.message,
        url,
        apiType: useCallsApi ? 'calls' : 'plugin',
        stack: error.stack
      });
      throw error;
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string; details: any }> {
    const results = {
      plugin: { success: false, message: '' },
      calls: { success: false, message: '' }
    };

    // Test plugin API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(this.config.pluginHealthUrl, {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        results.plugin = { success: true, message: 'Plugin API: OK' };
        this.addLog('info', 'connection-test', 'Plugin API connection successful');
      } else {
        results.plugin = { success: false, message: `Plugin API: HTTP ${response.status}` };
        this.addLog('error', 'connection-test', `Plugin API connection failed: ${response.status}`);
      }
    } catch (error: any) {
      results.plugin = { success: false, message: `Plugin API: ${error.message}` };
      this.addLog('error', 'connection-test', `Plugin API connection error: ${error.message}`, { error });
    }

    // Test calls API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      console.log('Testing Calls API:', this.config.callsHealthUrl);
      
      const response = await fetch(this.config.callsHealthUrl, {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log('Calls API Response:', response.status, response.statusText);
      
      if (response.ok) {
        results.calls = { success: true, message: 'Calls API: OK' };
        this.addLog('info', 'connection-test', 'Calls API connection successful');
      } else {
        results.calls = { success: false, message: `Calls API: HTTP ${response.status}` };
        this.addLog('error', 'connection-test', `Calls API connection failed: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Calls API Error:', error);
      results.calls = { success: false, message: `Calls API: ${error.message}` };
      this.addLog('error', 'connection-test', `Calls API connection error: ${error.message}`, { 
        error: error.message,
        url: this.config.callsHealthUrl,
        stack: error.stack
      });
    }

    const allSuccess = results.plugin.success && results.calls.success;
    const message = allSuccess 
      ? 'Todas as APIs conectadas com sucesso!' 
      : 'Algumas APIs não estão respondendo. Verifique as configurações.';

    return { 
      success: allSuccess, 
      message,
      details: results
    };
  }

  // Logging methods
  addLog(level: LogEntry['level'], source: string, message: string, metadata?: any): void {
    if (!this.config.enableLogs) return;

    // Check log level
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const logLevelIndex = levels.indexOf(level);
    
    if (logLevelIndex < currentLevelIndex) return;

    const logEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      metadata
    };

    this.logs.unshift(logEntry);
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    // Notify subscribers
    this.logSubscribers.forEach(callback => callback([...this.logs]));
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    this.logSubscribers.forEach(callback => callback([]));
  }

  subscribeToLogs(callback: (logs: LogEntry[]) => void): () => void {
    this.logSubscribers.push(callback);
    callback([...this.logs]);
    
    return () => {
      const index = this.logSubscribers.indexOf(callback);
      if (index > -1) {
        this.logSubscribers.splice(index, 1);
      }
    };
  }

  // Plugin API endpoints (porta 7007)
  async getTeams() {
    return this.makeRequest('/api/keninduty/teams');
  }

  async createTeam(team: any) {
    return this.makeRequest('/api/keninduty/teams', {
      method: 'POST',
      body: JSON.stringify(team)
    });
  }

  async getCurrentOnCall(teamId: string) {
    return this.makeRequest(`/api/keninduty/oncall/current?teamId=${teamId}`);
  }

  async getAlerts() {
    return this.makeRequest('/api/keninduty/alerts');
  }

  async createAlert(alert: any) {
    return this.makeRequest('/api/keninduty/alerts', {
      method: 'POST',
      body: JSON.stringify(alert)
    });
  }

  async getCallAttempts() {
    return this.makeRequest('/api/keninduty/call-attempts');
  }

  async createCallAttempt(call: any) {
    return this.makeRequest('/api/keninduty/call-attempts', {
      method: 'POST',
      body: JSON.stringify(call)
    });
  }

  async getEscalationPolicies() {
    return this.makeRequest('/api/keninduty/escalation-policies');
  }

  async createEscalationPolicy(policy: any) {
    return this.makeRequest('/api/keninduty/escalation-policies', {
      method: 'POST',
      body: JSON.stringify(policy)
    });
  }

  // Provider-specific endpoints (plugin API)
  async createDatadogAlert(alert: any) {
    return this.makeRequest('/api/keninduty/providers/datadog/alerts', {
      method: 'POST',
      body: JSON.stringify(alert)
    });
  }

  async createNewRelicAlert(alert: any) {
    return this.makeRequest('/api/keninduty/providers/newrelic/alerts', {
      method: 'POST',
      body: JSON.stringify(alert)
    });
  }

  async createGrafanaAlert(alert: any) {
    return this.makeRequest('/api/keninduty/providers/grafana/alerts', {
      method: 'POST',
      body: JSON.stringify(alert)
    });
  }

  // Calls API endpoints (API de ligações)
  async makeCall(phoneNumber: string, message: string) {
    return this.makeRequest('/api/calls/make', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, message })
    }, true); // useCallsApi = true
  }

  async getCallStatus(callId: string) {
    return this.makeRequest(`/api/calls/${callId}/status`, {}, true);
  }

  async getCallHistory() {
    return this.makeRequest('/api/calls/history', {}, true);
  }

  async testCall(phoneNumber: string) {
    return this.makeRequest('/api/calls/test', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber })
    }, true);
  }
}

export const keninDutyService = new KeninDutyService(); 