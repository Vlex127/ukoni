// src/app/articles/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>
          
          <div className="h-4 w-32 bg-gray-200 rounded mb-12"></div>
          
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
          
          <div className="h-8 w-8 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-12"></div>
          
          <div className="h-96 bg-gray-200 rounded-xl mb-12"></div>
          
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}