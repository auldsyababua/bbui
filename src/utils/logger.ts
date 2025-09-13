// Enhanced logging utility for BBUI with Cloudflare Workers integration

export interface LogContext {
  userId?: string;
  action?: string;
  component?: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  private context: LogContext = {};
  private logBuffer: any[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private maxBufferSize: number = 50;

  private constructor() {
    // Set up periodic log flushing
    if (typeof window !== 'undefined') {
      setInterval(() => this.flushLogs(), this.flushInterval);
      
      // Flush on page unload
      window.addEventListener('beforeunload', () => this.flushLogs());
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
  }

  private formatLog(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...this.context,
      data,
      // Add browser info for debugging
      userAgent: navigator.userAgent,
      url: window.location.href,
      // Performance metrics
      memory: (performance as any).memory?.usedJSHeapSize,
    };

    // Log to console with color coding
    const colors: Record<string, string> = {
      debug: '#888',
      info: '#2196F3',
      warn: '#FF9800',
      error: '#F44336',
      metric: '#4CAF50',
    };

    console.log(
      `%c[${level.toUpperCase()}] ${timestamp} - ${message}`,
      `color: ${colors[level] || '#000'}; font-weight: bold;`,
      data || ''
    );

    // Also log the full JSON for Cloudflare Workers to capture
    console.log(JSON.stringify(logEntry));

    // Add to buffer for batch sending
    this.logBuffer.push(logEntry);
    
    // Flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flushLogs();
    }

    return logEntry;
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0) return;
    
    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];
    
    try {
      // Send logs to Cloudflare Pages Function
      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logsToSend),
      });
    } catch (error) {
      // If sending fails, log to console at least
      console.error('Failed to send logs to server:', error);
      // Re-add logs to buffer for retry
      this.logBuffer = [...logsToSend, ...this.logBuffer];
    }
  }

  debug(message: string, data?: any) {
    this.formatLog('debug', message, data);
  }

  info(message: string, data?: any) {
    this.formatLog('info', message, data);
  }

  warn(message: string, data?: any) {
    this.formatLog('warn', message, data);
  }

  error(message: string, data?: any) {
    this.formatLog('error', message, data);
  }

  metric(name: string, value: number, tags?: Record<string, string>) {
    this.formatLog('metric', `Metric: ${name}`, { value, tags });
  }

  // Log API calls
  api(method: string, endpoint: string, status?: number, duration?: number) {
    this.formatLog('info', `API ${method} ${endpoint}`, {
      method,
      endpoint,
      status,
      duration,
      type: 'api_call',
    });
  }

  // Log user actions
  action(action: string, details?: any) {
    this.formatLog('info', `User Action: ${action}`, {
      action,
      details,
      type: 'user_action',
    });
  }

  // Performance timing
  time(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.metric(`timing.${label}`, duration);
    };
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Console log interceptor for capturing all logs
if (typeof window !== 'undefined') {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // Intercept console methods to ensure they're captured by Workers
  console.log = (...args) => {
    originalLog.apply(console, args);
    // Send to Workers in JSON format if it's not already JSON
    if (args.length === 1 && typeof args[0] === 'string' && !args[0].startsWith('{')) {
      originalLog(JSON.stringify({
        type: 'console.log',
        message: args[0],
        timestamp: new Date().toISOString(),
      }));
    }
  };

  console.error = (...args) => {
    originalError.apply(console, args);
    originalLog(JSON.stringify({
      type: 'console.error',
      message: args[0],
      stack: args[0]?.stack,
      timestamp: new Date().toISOString(),
    }));
  };

  console.warn = (...args) => {
    originalWarn.apply(console, args);
    originalLog(JSON.stringify({
      type: 'console.warn',
      message: args[0],
      timestamp: new Date().toISOString(),
    }));
  };

  // Log page load performance
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    logger.metric('page.load.time', perfData.loadEventEnd - perfData.fetchStart, {
      domContentLoaded: `${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms`,
      domInteractive: `${perfData.domInteractive - perfData.fetchStart}ms`,
    });
  });

  // Log errors
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error?.stack,
    });
  });

  // Log unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: event.reason,
      promise: event.promise,
    });
  });
}