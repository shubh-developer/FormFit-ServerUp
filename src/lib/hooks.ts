import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, Inquiry, Feedback } from '@/types';

// API functions
const apiCall = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`/api/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Query keys
export const queryKeys = {
  bookings: ['bookings'] as const,
  inquiries: ['inquiries'] as const,
  feedback: ['feedback'] as const,
  packages: ['packages'] as const,
};

// Hooks for fetching data
export const useBookings = () => {
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: () => apiCall('bookings'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInquiries = () => {
  return useQuery({
    queryKey: queryKeys.inquiries,
    queryFn: () => apiCall('inquiries'),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeedback = () => {
  return useQuery({
    queryKey: queryKeys.feedback,
    queryFn: () => apiCall('feedback'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePackages = () => {
  return useQuery({
    queryKey: queryKeys.packages,
    queryFn: () => apiCall('packages'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hooks for mutations
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (booking: any) =>
      apiCall('bookings', {
        method: 'POST',
        body: JSON.stringify(booking),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
};

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (inquiry: Omit<Inquiry, 'id' | 'createdAt'>) =>
      apiCall('inquiries', {
        method: 'POST',
        body: JSON.stringify(inquiry),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries });
    },
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (feedback: Omit<Feedback, 'id' | 'createdAt'>) =>
      apiCall('feedback', {
        method: 'POST',
        body: JSON.stringify(feedback),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feedback });
    },
  });
}; 