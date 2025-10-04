import { useQuery, useQueryClient } from '@tanstack/react-query';

// Types for real-time data
export interface DashboardData {
  statistics: {
    totalBookings: number;
    todayBookings: number;
    pendingBookings: number;
    totalInquiries: number;
    todayInquiries: number;
    totalFeedback: number;
    averageRating: string;
  };
  recentBookings: any[];
  recentInquiries: any[];
  recentFeedback: any[];
  serviceDistribution: any[];
  monthlyTrends: any[];
  lastUpdated: string;
}

// API functions
const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  const data = await response.json();
  return data.data;
};

const fetchBookings = async (): Promise<any[]> => {
  const response = await fetch('/api/bookings');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  const data = await response.json();
  return data.bookings;
};

const fetchInquiries = async (): Promise<any[]> => {
  const response = await fetch('/api/inquiries');
  if (!response.ok) {
    throw new Error('Failed to fetch inquiries');
  }
  const data = await response.json();
  return data.inquiries;
};

const fetchFeedback = async (): Promise<any[]> => {
  const response = await fetch('/api/feedback');
  if (!response.ok) {
    throw new Error('Failed to fetch feedback');
  }
  const data = await response.json();
  return data.feedback;
};

const fetchPackages = async (): Promise<any[]> => {
  const response = await fetch('/api/packages');
  if (!response.ok) {
    throw new Error('Failed to fetch packages');
  }
  const data = await response.json();
  return data.packages;
};

// Custom hooks for real-time data
export function useDashboardData(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
  });
}

export function useBookings(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
  });
}

export function useInquiries(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: fetchInquiries,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
  });
}

export function useFeedback(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: fetchFeedback,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
  });
}

export function usePackages(refreshInterval = 300000) {
  return useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 300000,
  });
}

// Manual refresh hook
export function useManualRefresh() {
  const queryClient = useQueryClient();
  
  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    queryClient.invalidateQueries({ queryKey: ['feedback'] });
    queryClient.invalidateQueries({ queryKey: ['packages'] });
  };

  return { refreshAll };
} 