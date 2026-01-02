const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api/v1`;

export const getApiUrl = (path: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If the path already has /api/v1, use it as is
  if (path.startsWith('api/v1/') || path.startsWith('/api/v1/')) {
    return `${BASE_URL}/${cleanPath}`;
  }
  
  // Otherwise, add the API prefix
  return `${API_BASE_URL}/${cleanPath}`;
};
