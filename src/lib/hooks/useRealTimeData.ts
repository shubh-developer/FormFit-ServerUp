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
  try {
    const response = await fetch('/api/dashboard');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    // Return default empty data structure for graceful degradation
    return {
      statistics: {
        totalBookings: 0,
        todayBookings: 0,
        pendingBookings: 0,
        totalInquiries: 0,
        todayInquiries: 0,
        totalFeedback: 0,
        averageRating: '0.0',
      },
      recentBookings: [],
      recentInquiries: [],
      recentFeedback: [],
      serviceDistribution: [],
      monthlyTrends: [],
      lastUpdated: new Date().toISOString(),
    };
  }
};

const fetchBookings = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/bookings');
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    const data = await response.json();
    return data.bookings;
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return [];
  }
};

const fetchInquiries = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/inquiries');
    if (!response.ok) {
      throw new Error('Failed to fetch inquiries');
    }
    const data = await response.json();
    return data.inquiries;
  } catch (error) {
    console.error('Inquiries fetch error:', error);
    return [];
  }
};

const fetchFeedback = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/feedback');
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }
    const data = await response.json();
    return data.feedback;
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return [];
  }
};

const fetchPackages = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/packages');
    if (!response.ok) {
      throw new Error('Failed to fetch packages');
    }
    const data = await response.json();
    return data.packages;
  } catch (error) {
    console.error('Packages fetch error:', error);
    return [];
  }
};

// Custom hooks for real-time data
export function useDashboardData(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
    retry: false, // Don't retry on failure to avoid console spam
  });
}

export function useBookings(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
    retry: false, // Don't retry on failure to avoid console spam
  });
}

export function useInquiries(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: fetchInquiries,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
    retry: false, // Don't retry on failure to avoid console spam
  });
}

export function useFeedback(refreshInterval = 30000) {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: fetchFeedback,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 10000,
    retry: false, // Don't retry on failure to avoid console spam
  });
}

export function usePackages(refreshInterval = 300000) {
  return useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
    staleTime: 300000,
    retry: false, // Don't retry on failure to avoid console spam
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