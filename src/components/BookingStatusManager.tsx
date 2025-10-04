'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, MessageSquare, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Booking {
  id: string;
  name: string;
  email: string;
  contact: string;
  status: string;
  date_time: string;
  created_at: string;
  feedback_status: string;
  feedback_submitted_at?: string;
}

const BookingStatusManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { showToast } = useAppStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const result = await response.json();
      
      if (result.success) {
        setBookings(result.bookings);
      } else {
        showToast('Failed to load bookings', 'error');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingStatus(bookingId);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        showToast(`Booking status updated to ${newStatus}`, 'success');
        fetchBookings(); // Refresh the list
      } else {
        showToast(result.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'booked':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'booked':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeedbackStatusColor = (feedbackStatus: string) => {
    switch (feedbackStatus) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'eligible':
        return 'bg-blue-100 text-blue-800';
      case 'not_eligible':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeedbackStatusText = (feedbackStatus: string) => {
    switch (feedbackStatus) {
      case 'submitted':
        return 'Feedback Submitted';
      case 'eligible':
        return 'Eligible for Feedback';
      case 'not_eligible':
        return 'Not Eligible';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Booking Status Management</h2>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.contact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.date_time).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.date_time).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(booking.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 text-gray-600 mr-2" />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeedbackStatusColor(booking.feedback_status)}`}>
                        {getFeedbackStatusText(booking.feedback_status)}
                      </span>
                    </div>
                    {booking.feedback_submitted_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(booking.feedback_submitted_at).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {booking.status !== 'completed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={updatingStatus === booking.id}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingStatus === booking.id ? 'Updating...' : 'Mark Complete'}
                        </button>
                      )}
                      {booking.status === 'booked' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'in-progress')}
                          disabled={updatingStatus === booking.id}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                        >
                          {updatingStatus === booking.id ? 'Updating...' : 'Start Session'}
                        </button>
                      )}
                      {booking.status === 'in-progress' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={updatingStatus === booking.id}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingStatus === booking.id ? 'Updating...' : 'Complete Session'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bookings found
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Feedback Eligible</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(b => b.feedback_status === 'eligible').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Feedback Submitted</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(b => b.feedback_status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusManager; 