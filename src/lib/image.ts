import { BASE_URL } from './api';
export const getImageUrl = (path: string | null, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'scale' | 'fill' | 'crop' | 'thumb';
} = {}): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1499750310159-5b5f22693851?auto=format&fit=crop&q=80&w=1000'; // Fallback placeholder
  }

  // If it's already a Cloudinary URL, optimize it
  if (path.includes('cloudinary.com')) {
    try {
      const url = new URL(path);
      const searchParams = new URLSearchParams(url.search);

      // Set optimized parameters
      const width = options.width || 800;
      const height = options.height || 600;
      const quality = options.quality || 80;
      const format = options.format || 'auto';
      const crop = options.crop || 'fill';

      // Add optimization parameters
      searchParams.set('w', width.toString());
      searchParams.set('h', height.toString());
      searchParams.set('q', quality.toString());
      searchParams.set('f', format);
      searchParams.set('c', crop);
      searchParams.set('auto', 'format'); // Auto-optimize format
      searchParams.set('dpr', '2'); // Support retina displays

      url.search = searchParams.toString();
      return url.toString();
    } catch (error) {
      console.warn('Failed to optimize Cloudinary URL:', error);
      return path;
    }
  }

  // Return as is if it's already a full URL (non-Cloudinary)
  if (path.startsWith('http')) {
    return path;
  }

  // Handle paths that start with /api/uploads/
  if (path.includes('uploads/')) {
    // Extract the filename (handle both /api/uploads/ and direct uploads/ paths)
    const filename = path.split('uploads/').pop() || '';
    // Return the full URL to the image using proper BASE_URL (no /api prefix for public files)
    return `${BASE_URL}/uploads/${filename}`;
  }

  // Treat as Cloudinary Public ID if not a URL and not a local upload
  // Construct Cloudinary URL using the exposed Cloud Name
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (cloudName) {
    const width = options.width || 800;
    const height = options.height || 600;
    const quality = options.quality || 80;
    const format = options.format || 'auto';
    const crop = options.crop || 'fill';

    // Construct transformation string
    const transformations = [
      `w_${width}`,
      `h_${height}`,
      `q_${quality}`,
      `f_${format}`,
      `c_${crop}`,
      'dpr_2'
    ].join(',');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${path}`;
  }

  // Fallback if no match
  return `${BASE_URL}/${path.replace(/^\/+/, '')}`;
};

/**
 * Generate a blur data URL for placeholder
 */
export const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  // Create a gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
};

/**
 * Generate responsive image sizes for Next.js Image component
 */
export const getResponsiveImageSizes = (baseWidth: number) => {
  return {
    sizes: `(max-width: 640px) ${baseWidth * 0.8}px, (max-width: 768px) ${baseWidth * 0.9}px, ${baseWidth}px`,
    srcSet: [
      `${baseWidth * 0.5}w`,
      `${baseWidth * 0.75}w`,
      `${baseWidth}w`,
      `${baseWidth * 1.5}w`
    ].join(', ')
  };
};
