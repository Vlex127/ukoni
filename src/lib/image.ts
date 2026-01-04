import { API_BASE_URL } from './api';

/**
 * Get the correct URL for an image
 * @param path The image path from the database (e.g., 'uploads/filename.jpg', '/api/uploads/filename.jpg', or full URL)
 * @returns The complete URL to the image
 */
export const getImageUrl = (path: string | null): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1499750310159-5b5f22693851?auto=format&fit=crop&q=80&w=1000'; // Fallback placeholder
  }
  
  // Return as is if it's already a full URL
  if (path.startsWith('http')) {
    return path;
  }
  
  // Handle paths that start with /api/uploads/
  if (path.includes('uploads/')) {
    // Extract the filename (handle both /api/uploads/ and direct uploads/ paths)
    const filename = path.split('uploads/').pop() || '';
    // Return the full URL to the image
    return `${API_BASE_URL}/uploads/${filename}`;
  }
  
  // For any other paths, assume they're relative to the API base URL
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
};
