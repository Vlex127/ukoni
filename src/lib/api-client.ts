import { getApiUrl } from './api';

export async function apiClient<T>(
  endpoint: string,
  options: { body?: any; method?: string; headers?: Record<string, string> } & Omit<RequestInit, 'body' | 'method' | 'headers'> = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  // Add custom headers
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    ...options,
    headers,
  };

  if (options.body) {
    config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(getApiUrl(endpoint), config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.detail || 'An error occurred');
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    // If the response is 204 (No Content), return null
    if (response.status === 204) {
      return null as any;
    }

    return response.json();
  } catch (error) {
    // Handle network/connection errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const connectionError = new Error('Network connection failed. Please check if the server is running.');
      (connectionError as any).isConnectionError = true;
      throw connectionError;
    }
    throw error;
  }
}
