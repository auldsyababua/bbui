/**
 * ERPNext API Client
 * Handles authenticated HTTP requests to ERPNext/Frappe API
 */

export interface ERPNextClientConfig {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
}

export interface ERPNextError {
  exception?: string;
  exc_type?: string;
  exc?: string;
  message?: string;
}

export class ERPNextClient {
  private apiUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private timeout: number = 10000; // 10 second timeout

  constructor(config: ERPNextClientConfig) {
    if (!config.apiUrl) {
      throw new Error('ERPNext API URL is required');
    }
    if (!config.apiKey) {
      throw new Error('ERPNext API Key is required');
    }
    if (!config.apiSecret) {
      throw new Error('ERPNext API Secret is required');
    }

    this.apiUrl = config.apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
  }

  /**
   * Get authorization header value
   * Format: token {API_KEY}:{API_SECRET}
   */
  getAuthHeader(): string {
    return `token ${this.apiKey}:${this.apiSecret}`;
  }

  /**
   * Make authenticated GET request
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      return this.handleError(error);
    }
  }

  /**
   * Make authenticated POST request
   */
  async post<T>(path: string, data?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(path);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);
      return this.handleError(error);
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    let url = `${this.apiUrl}${cleanPath}`;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  /**
   * Handle fetch response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      // Try to parse error response
      let errorData: ERPNextError = {};

      if (isJson) {
        try {
          errorData = await response.json();
        } catch {
          // Failed to parse JSON error
        }
      }

      // Build user-friendly error message
      let message = errorData.message || errorData.exc_type || 'API request failed';

      if (response.status === 401) {
        message = 'Authentication failed. Please check your API credentials.';
      } else if (response.status === 403) {
        message = 'Permission denied. You do not have access to this resource.';
      } else if (response.status === 404) {
        message = 'Resource not found.';
      } else if (response.status >= 500) {
        message = 'Server error. Please try again later.';
      }

      throw new Error(message);
    }

    // Parse successful response
    if (isJson) {
      return await response.json();
    }

    // Fallback for non-JSON responses
    return await response.text() as any;
  }

  /**
   * Handle request errors
   */
  private handleError(error: any): never {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }

    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection or CORS configuration.');
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Factory function to create ERPNext client
 */
export const createERPNextClient = (config: ERPNextClientConfig): ERPNextClient => {
  return new ERPNextClient(config);
};
