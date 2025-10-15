'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, X, User, MessageSquare, Award, CheckCircle, AlertCircle, Sparkles, Heart } from 'lucide-react';


const reviewSchema = z.object({
  name: z.string()
    .min(2, 'Name is required (minimum 2 characters)')
    .max(50, 'Name too long (maximum 50 characters)')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  rating: z.number().min(1, 'Rating is required').max(5, 'Invalid rating'),
  comment: z.string()
    .min(10, 'Review is required (minimum 10 characters)')
    .max(500, 'Review too long (maximum 500 characters)'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface SimpleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
}

export default function SimpleReviewModal({ isOpen, onClose, onSubmit }: SimpleReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const watchedComment = watch('comment', '');
  const commentLength = watchedComment?.length || 0;

  const handleRatingChange = (selectedRating: number) => {
    setRating(selectedRating);
    setValue('rating', selectedRating);
  };

  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/[<>"'&]/g, '') // Remove potentially harmful characters
      .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  };

  const onFormSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      // Sanitize and validate inputs
      const sanitizedData = {
        name: sanitizeInput(data.name),
        rating: Math.max(1, Math.min(5, Math.floor(data.rating))), // Ensure rating is 1-5
        comment: sanitizeInput(data.comment),
      };
      
      // Additional validation
      if (!sanitizedData.name || sanitizedData.name.length < 2) {
        throw new Error('Valid name is required');
      }
      if (!sanitizedData.comment || sanitizedData.comment.length < 10) {
        throw new Error('Valid review is required');
      }
      
      await onSubmit(sanitizedData);
      setIsSuccess(true);
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Review submission error:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setRating(0);
    setIsSuccess(false);
    onClose();
  };

  const getRatingText = (rating: number) => {
    const texts = {
      0: 'Click to rate your experience',
      1: 'Poor - Not satisfied',
      2: 'Fair - Below expectations', 
      3: 'Good - Met expectations',
      4: 'Very Good - Exceeded expectations',
      5: 'Excellent - Outstanding service'
    };
    return texts[rating as keyof typeof texts];
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    if (rating >= 2) return 'text-orange-600';
    if (rating >= 1) return 'text-red-600';
    return 'text-gray-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
        {isSuccess ? (
          <div className="p-8 text-center animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 animate-pulse">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">Amazing!</h3>
            <p className="text-gray-600 mb-6 text-lg">Your review means the world to us!</p>
            <div className="flex justify-center space-x-1 mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 transition-all duration-300 delay-${i * 100} ${
                  i < rating ? 'text-yellow-400 fill-current animate-pulse' : 'text-gray-300'
                }`} />
              ))}
            </div>
            <div className="flex items-center justify-center text-pink-500 mb-4">
              <Heart className="w-5 h-5 mr-2 animate-pulse" />
              <span className="text-sm font-medium">Thank you for choosing our services</span>
            </div>
            <p className="text-sm text-gray-500">Closing automatically...</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-[#2980B9] to-[#2ECC71] p-6 rounded-t-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-2">
                    <Sparkles className="w-6 h-6 text-yellow-300 mr-2 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white">Share Your Experience</h2>
                  </div>
                  <p className="text-blue-100 text-sm">Help others discover our amazing services</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/20 hover:rotate-90 transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Your Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  } focus:ring-4 focus:outline-none`}
                  placeholder="Enter your full name"
                  maxLength={50}
                />
                {errors.name && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Award className="w-4 h-4 mr-2 text-blue-600" />
                  Rate Your Experience *
                </label>
                <div className="flex justify-center space-x-3 p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl border border-yellow-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none transform transition-all duration-300 hover:scale-125 active:scale-110 focus:ring-4 focus:ring-yellow-200 rounded-full p-1"
                    >
                      <Star
                        className={`w-12 h-12 transition-all duration-300 ${
                          star <= rating
                            ? 'text-yellow-400 fill-current drop-shadow-lg animate-pulse'
                            : 'text-gray-300 hover:text-yellow-300 hover:scale-110'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className={`text-center text-sm font-medium ${getRatingColor(rating)}`}>
                  {getRatingText(rating)}
                </p>
                {errors.rating && (
                  <div className="flex items-center justify-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.rating.message}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                  Your Review *
                </label>
                <div className="relative">
                  <textarea
                    {...register('comment')}
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 resize-none ${
                      errors.comment 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    } focus:ring-4 focus:outline-none`}
                    placeholder="Tell us about your experience with our massage therapy and fitness training services. What did you like most?"
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {commentLength}/500
                  </div>
                </div>
                {errors.comment && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.comment.message}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !rating}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-[#2980B9] to-[#2ECC71] text-white rounded-xl hover:from-[#1A5276] hover:to-[#27AE60] transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            <div className="px-6 pb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
                <div className="relative flex items-start">
                  <div className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="animate-pulse">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 font-bold mb-1 flex items-center">
                      <span>Your Privacy Matters</span>
                      <Heart className="w-4 h-4 ml-2 text-pink-500" />
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">Your review will be publicly visible to help other customers discover our amazing services.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}