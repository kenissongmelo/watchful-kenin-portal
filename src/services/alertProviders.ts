
// Types for alert creation
export interface AlertData {
  name: string;
  service: string;
  query: string;
  threshold: string;
  description?: string;
}

export interface NewRelicAlert {
  name: string;
  type: 'static';
  enabled: true;
  entities: string[];
  nrql: {
    query: string;
  };
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

export interface DatadogAlert {
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

// New Relic API Service
export class NewRelicService {
  private apiKey: string;
  private accountId: string;
  private baseUrl = 'https://api.newrelic.com/v2';

  constructor(apiKey: string, accountId: string) {
    this.apiKey = apiKey;
    this.accountId = accountId;
  }

  async createAlert(alertData: AlertData): Promise<any> {
    const alert: NewRelicAlert = {
      name: alertData.name,
      type: 'static',
      enabled: true,
      entities: [alertData.service],
      nrql: {
        query: alertData.query
      },
      signal: {
        aggregation_window: 60,
        evaluation_offset: 3
      },
      terms: [{
        priority: 'critical',
        operator: 'above',
        threshold: parseFloat(alertData.threshold) || 80,
        threshold_duration: 300,
        threshold_occurrences: 'all'
      }]
    };

    const response = await fetch(`${this.baseUrl}/alerts_conditions.json`, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        condition: alert
      })
    });

    if (!response.ok) {
      throw new Error(`New Relic API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/applications.json`, {
        method: 'GET',
        headers: {
          'X-Api-Key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('New Relic connection test failed:', error);
      return false;
    }
  }
}

// Datadog API Service
export class DatadogService {
  private apiKey: string;
  private appKey: string;
  private baseUrl = 'https://api.datadoghq.com/api/v1';

  constructor(apiKey: string, appKey: string) {
    this.apiKey = apiKey;
    this.appKey = appKey;
  }

  async createAlert(alertData: AlertData): Promise<any> {
    const alert: DatadogAlert = {
      name: alertData.name,
      type: 'metric alert',
      query: alertData.query,
      message: alertData.description || `Alert for ${alertData.service}: ${alertData.name}`,
      tags: [`service:${alertData.service}`],
      options: {
        thresholds: {
          critical: parseFloat(alertData.threshold) || 80
        },
        notify_audit: false,
        timeout_h: 0,
        evaluation_delay: 900,
        new_host_delay: 300,
        require_full_window: false,
        notify_no_data: false,
        renotify_interval: 0
      }
    };

    const response = await fetch(`${this.baseUrl}/monitors`, {
      method: 'POST',
      headers: {
        'DD-API-KEY': this.apiKey,
        'DD-APPLICATION-KEY': this.appKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alert)
    });

    if (!response.ok) {
      throw new Error(`Datadog API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'GET',
        headers: {
          'DD-API-KEY': this.apiKey,
          'DD-APPLICATION-KEY': this.appKey,
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Datadog connection test failed:', error);
      return false;
    }
  }
}

// Provider factory
export class AlertProviderService {
  static createProvider(type: 'newrelic' | 'datadog', credentials: any) {
    switch (type) {
      case 'newrelic':
        return new NewRelicService(credentials.apiKey, credentials.accountId);
      case 'datadog':
        return new DatadogService(credentials.apiKey, credentials.appKey);
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }
}
