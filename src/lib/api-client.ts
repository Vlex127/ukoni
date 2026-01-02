import { getApiUrl } from './api';

export async function apiClient<T>(
  endpoint: string,
  { body, method = 'GET', ...customConfig }: RequestInit & { body?: any } = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  // Add custom headers
  if (customConfig.headers) {
    Object.entries(customConfig.headers).forEach(([key, value]) => {
      headers.append(key, value as string);
    });
  }

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    method,
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

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
}
