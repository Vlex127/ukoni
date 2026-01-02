// src/app/articles/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Article not found</h2>
        <p className="text-gray-600 mb-6">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/articles"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Articles
        </Link>
      </div>
    </div>
  );
}