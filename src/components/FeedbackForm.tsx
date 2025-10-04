'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, User, MessageSquare, Calendar, Shield } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const verificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
});

const feedbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Please provide a detailed review (at least 10 characters)'),
  bookingId: z.string().min(1, 'Booking ID is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  sessionToken: z.string().min(1, 'Session token is required'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;
type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedBooking, setVerifiedBooking] = useState<any>(null);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { addFeedback, setLoading, showToast } = useAppStore();

  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const feedbackForm = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const handleRatingChange = (selectedRating: number) => {
    setRating(selectedRating);
    feedbackForm.setValue('rating', selectedRating);
  };

  const onVerificationSubmit = async (data: VerificationFormData) => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/feedback/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.canSubmit) {
        setIsVerified(true);
        setVerifiedBooking(result.booking);
        setSessionToken(result.sessionToken);
        // Pre-fill the feedback form with verified data
        feedbackForm.setValue('bookingId', result.booking.id);
        feedbackForm.setValue('email', data.email);
        feedbackForm.setValue('phone', data.phone);
        feedbackForm.setValue('name', result.booking.name);
        feedbackForm.setValue('sessionToken', result.sessionToken);
        showToast('Booking verified! You can now submit your feedback.', 'success');
      } else {
        showToast(result.message || 'Verification failed. Please check your details.', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showToast('Verification failed. Please try again.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const onFeedbackSubmit = async (data: FeedbackFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        addFeedback(data);
        showToast(result.message, 'success');
        // Reset both forms
        verificationForm.reset();
        feedbackForm.reset();
        setRating(0);
        setIsVerified(false);
        setVerifiedBooking(null);
      } else {
        showToast(result.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsVerified(false);
    setVerifiedBooking(null);
    setSessionToken('');
    setRating(0);
    verificationForm.reset();
    feedbackForm.reset();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
          <p className="text-gray-600">
            {!isVerified 
              ? 'Please enter your email and phone number to verify your completed session'
              : 'Thank you for verifying your booking. Please share your experience!'
            }
          </p>
        </div>

        {!isVerified ? (
          // Verification Form
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-blue-800 text-sm">
                  <strong>Security Notice:</strong> Only clients who have completed their massage sessions can submit feedback. 
                  Please enter the email and phone number used for your booking to verify your session.
                </p>
              </div>
            </div>

            <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Verify Your Booking
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...verificationForm.register('email')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                    placeholder="Enter the email used for booking"
                  />
                  {verificationForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{verificationForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...verificationForm.register('phone')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                    placeholder="Enter the phone number used for booking"
                  />
                  {verificationForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{verificationForm.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify Booking'}
              </button>
            </form>
          </div>
        ) : (
          // Feedback Form
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-800 text-sm">
                    <strong>Verified:</strong> Booking confirmed for {verifiedBooking?.name} on {new Date(verifiedBooking?.serviceDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Change Booking
                </button>
              </div>
            </div>

            <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="space-y-6">
              {/* Hidden fields for verified data */}
              <input type="hidden" {...feedbackForm.register('bookingId')} />
              <input type="hidden" {...feedbackForm.register('email')} />
              <input type="hidden" {...feedbackForm.register('phone')} />
              <input type="hidden" {...feedbackForm.register('sessionToken')} />

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Your Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    {...feedbackForm.register('name')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                    placeholder="Enter your name"
                    readOnly
                  />
                  {feedbackForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{feedbackForm.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Rate Your Experience</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {rating === 0 && 'Click to rate'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </div>
                  {feedbackForm.formState.errors.rating && (
                    <p className="text-red-500 text-sm mt-1">{feedbackForm.formState.errors.rating.message}</p>
                  )}
                </div>
              </div>

              {/* Review */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Your Review
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Your Experience *
                  </label>
                  <textarea
                    {...feedbackForm.register('comment')}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium resize-none"
                    placeholder="Tell us about your experience with our massage service. What did you like? Any suggestions for improvement?"
                  />
                  {feedbackForm.formState.errors.comment && (
                    <p className="text-red-500 text-sm mt-1">{feedbackForm.formState.errors.comment.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm; 