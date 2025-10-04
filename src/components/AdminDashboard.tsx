'use client';

import { useDashboardData, useManualRefresh } from '@/lib/hooks/useRealTimeData';
import { RefreshCw, Users, MessageSquare, Star, Calendar, Clock, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardData(10000); // Refresh every 10 seconds
  const { refreshAll } = useManualRefresh();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading dashboard data. Please try again.</p>
            <button
              onClick={refreshAll}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.statistics;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Last updated: {dashboardData?.lastUpdated ? new Date(dashboardData.lastUpdated).toLocaleString() : 'Never'}
            </p>
          </div>
          <button
            onClick={refreshAll}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today&apos;s Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.todayBookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalInquiries || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.averageRating || '0.0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            </div>
            <div className="p-6">
              {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentBookings.slice(0, 5).map((booking: any) => (
                    <div key={booking.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{booking.name}</p>
                        <p className="text-sm text-gray-600">{booking.service_type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : booking.payment_status === 'cash'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.payment_status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent bookings</p>
              )}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
            </div>
            <div className="p-6">
              {dashboardData?.recentInquiries && dashboardData.recentInquiries.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentInquiries.slice(0, 5).map((inquiry: any) => (
                    <div key={inquiry.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <p className="font-medium text-gray-900">{inquiry.name}</p>
                      <p className="text-sm text-gray-600">{inquiry.phone}</p>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{inquiry.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent inquiries</p>
              )}
            </div>
          </div>
        </div>

        {/* Service Distribution */}
        {Array.isArray(dashboardData?.serviceDistribution) && dashboardData.serviceDistribution.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Service Distribution</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {dashboardData.serviceDistribution.map((service: any) => (
                  <div key={service.service_type} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">
                      {service.service_type.replace('-', ' ')}
                    </span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(service.count / Math.max(...dashboardData.serviceDistribution.map((s: any) => s.count))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{service.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 