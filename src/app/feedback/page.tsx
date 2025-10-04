'use client';

import FeedbackForm from '@/components/FeedbackForm';
import { Star } from 'lucide-react';
import { useFeedback } from '@/lib/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

function FeedbackPageContent() {
  const { data: feedbackData, isLoading, error } = useFeedback();
  const reviews = feedbackData?.feedback || [];

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-600">
            See what our clients say about our massage services
          </p>
        </div>

        {/* Reviews Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="text-4xl font-bold text-gray-900 mr-4">{averageRating.toFixed(1)}</div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= averageRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600">Based on {reviews.length} reviews</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading reviews..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-red-700">Failed to load reviews. Please try again later.</p>
          </div>
        )}

        {/* Reviews Grid */}
        {!isLoading && !error && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review: { id: string; name: string; rating: number; comment: string; createdAt: string }) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <div className="text-xs text-gray-400 mt-3">
                  {new Date(review.createdAt!).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feedback Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
            <p className="text-gray-600">
              Help others by sharing your experience with our massage service
            </p>
          </div>
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <ErrorBoundary>
      <FeedbackPageContent />
    </ErrorBoundary>
  );
} 