'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, MessageCircle, Star, Clock, AlertTriangle } from 'lucide-react';

interface DashboardStats {
  today_bookings: number;
  pending_bookings: number;
  new_inquiries: number;
  avg_rating: number;
  total_feedback: number;
}

interface RealTimeMonitorProps {
  refreshInterval?: number; // in milliseconds
}

export default function RealTimeMonitor({ refreshInterval = 30000 }: RealTimeMonitorProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.stats;
    },
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
  });

  // Update last update time when data refreshes
  useEffect(() => {
    if (stats) {
      setLastUpdate(new Date());
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-600">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Error loading real-time data</span>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Real-Time Monitor</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          Last updated: {formatTime(lastUpdate)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Today&apos;s Bookings</p>
              <p className="text-2xl font-bold text-blue-800">
                {stats?.today_bookings || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-800">
                {stats?.pending_bookings || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* New Inquiries */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">New Inquiries</p>
              <p className="text-2xl font-bold text-green-800">
                {stats?.new_inquiries || 0}
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-800">
                {stats?.avg_rating ? parseFloat(String(stats.avg_rating)).toFixed(1) : '0.0'}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Live monitoring active
        </div>
      </div>
    </div>
  );
} 