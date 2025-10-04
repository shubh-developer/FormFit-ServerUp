import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" text="Loading..." />
        <p className="text-gray-600 mt-4">Please wait while we load your content...</p>
      </div>
    </div>
  );
} 