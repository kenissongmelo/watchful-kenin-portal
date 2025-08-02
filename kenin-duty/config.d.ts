export interface Config {
  /** Configuration for the KeninDuty plugin */
  keninDuty?: {
    /** Enable/disable the plugin */
    enabled?: boolean;
    
    /** Provider configurations */
    providers?: {
      /** New Relic configuration */
      newrelic?: {
        enabled?: boolean;
        apiKey?: string;
        accountId?: string;
      };
      
      /** Datadog configuration */
      datadog?: {
        enabled?: boolean;
        apiKey?: string;
        appKey?: string;
      };
      
      /** Grafana configuration */
      grafana?: {
        enabled?: boolean;
        url?: string;
        apiKey?: string;
      };
    };
    
    /** Webhook configuration */
    webhook?: {
      endpoint?: string;
    };
    
    /** Notification settings */
    notifications?: {
      twilio?: {
        accountSid?: string;
        authToken?: string;
        fromNumber?: string;
      };
    };
  };
} 