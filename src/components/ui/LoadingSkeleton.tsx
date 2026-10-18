import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = 'h-6 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-[#171717]/10 border-2 border-[#171717]/20 rounded-lg ${className}`}
    />
  );
};

export const PlaceCardSkeleton: React.FC = () => {
  return (
    <div className="neo-card p-5 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-5 w-24 rounded-full" />
        <LoadingSkeleton className="h-8 w-8 rounded-lg" />
      </div>
      <LoadingSkeleton className="h-7 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-2/3" />
      <div className="pt-2 flex justify-between items-center border-t-2 border-[#171717]/10">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
};
