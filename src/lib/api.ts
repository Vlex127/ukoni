// Force localhost:3000 for development to ensure local API usage
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getApiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Clean up any double 'api/api' segments if they occur
  const finalPath = cleanPath.startsWith('api/') ? cleanPath : `api/${cleanPath}`;

  // If running on client side, use relative path to ensure cookies are sent
  if (typeof window !== 'undefined') {
    return `/${finalPath}`;
  }

  return `${BASE_URL}/${finalPath}`;
};
