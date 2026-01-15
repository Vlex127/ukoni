const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
// Force port 3000 for development to avoid port 8000 issues
const DEVELOPMENT_BASE_URL = 'http://localhost:3000';
export const API_BASE_URL = `${BASE_URL}/api`;

export const getApiUrl = (path: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For development, always use port 3000
  const baseUrl = process.env.NODE_ENV === 'development' ? DEVELOPMENT_BASE_URL : BASE_URL;
  
  // If path already has /api, use it as is
  if (path.startsWith('api/') || path.startsWith('/api/')) {
    const finalUrl = `${baseUrl}/${cleanPath}`;
    console.log('API URL constructed:', finalUrl); // Debug logging
    return finalUrl;
  }
  
  // Otherwise, add the API prefix
  const finalUrl = `${baseUrl}/api/${cleanPath}`;
  console.log('API URL constructed:', finalUrl); // Debug logging
  return finalUrl;
};
