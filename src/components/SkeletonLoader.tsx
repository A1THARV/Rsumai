import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Overall Score Skeleton */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 skeleton rounded-md"></div>
          <div className="h-8 w-32 skeleton rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 skeleton rounded-lg"></div>
          <div className="h-40 skeleton rounded-lg"></div>
        </div>
      </div>

      {/* Skills Section Skeleton */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
        <div className="h-8 w-48 skeleton rounded-md mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 skeleton rounded-lg"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 skeleton rounded-md"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Section Skeleton */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg">
        <div className="h-8 w-48 skeleton rounded-md mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-48 skeleton rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
