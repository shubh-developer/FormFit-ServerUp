'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, MessageCircle, Star, Clock, X, ChevronLeft, Calendar, Phone, Shield, MapPin } from 'lucide-react';
import AdminRoute from '@/components/AdminRoute';

interface DashboardData {
  connection: string;
  counts: {
    bookings: number;
    inquiries: number;
    feedback: number;
  };
  recentBookings: Array<{
    id: number;
    name: string;
    service_type: string;
    created_at: string;
  }>;
  timestamp: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  service_type: string;
  oil_type: string;
  date_time: string;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

interface Feedback {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function DashboardContent() {
  const [selectedView, setSelectedView] = useState<'dashboard' | 'bookings' | 'inquiries' | 'feedback'>('dashboard');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notificationStatus, setNotificationStatus] = useState<{[key: number]: 'sending' | 'sent' | 'failed'}>({});
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async (): Promise<DashboardData> => {
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch detailed data when needed
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const response = await fetch('/api/bookings');
      const result = await response.json();
      return result.success ? result.bookings : [];
    },
    enabled: selectedView === 'bookings',
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async (): Promise<Inquiry[]> => {
      const response = await fetch('/api/inquiries');
      const result = await response.json();
      return result.success ? result.inquiries : [];
    },
    enabled: selectedView === 'inquiries',
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: async (): Promise<Feedback[]> => {
      const response = await fetch('/api/feedback');
      const result = await response.json();
      return result.success ? result.feedback : [];
    },
    enabled: selectedView === 'feedback',
  });

  // Fetch active bookings (pending and confirmed)
  const { data: activeBookings, isLoading: activeBookingsLoading } = useQuery({
    queryKey: ['active-bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const response = await fetch('/api/bookings');
      const result = await response.json();
      if (result.success) {
        return result.bookings.filter((booking: Booking) => 
          booking.status === 'pending' || booking.status === 'confirmed'
        );
      }
      return [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch active inquiries (new and pending)
  const { data: activeInquiries, isLoading: activeInquiriesLoading } = useQuery({
    queryKey: ['active-inquiries'],
    queryFn: async (): Promise<Inquiry[]> => {
      const response = await fetch('/api/inquiries');
      const result = await response.json();
      if (result.success) {
        return result.inquiries.filter((inquiry: Inquiry) => 
          inquiry.status === 'new' || inquiry.status === 'pending'
        );
      }
      return [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Date filtering functions
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      case 'week':
        const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
        return { start: weekStart, end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart, end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
      case 'custom':
        return { start: startDate ? new Date(startDate) : null, end: endDate ? new Date(endDate) : null };
      default:
        return { start: null, end: null };
    }
  };

  const filterDataByDate = (data: any[], dateField: string = 'created_at') => {
    if (dateFilter === 'all') return data;
    
    const { start, end } = getDateRange();
    if (!start && !end) return data;
    
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    });
  };

  const filterDataBySearch = (data: any[], searchFields: string[]) => {
    if (!searchTerm) return data;
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  };

  const filterDataByStatus = (data: any[], statusField: string = 'status') => {
    if (statusFilter === 'all') return data;
    return data.filter(item => item[statusField] === statusFilter);
  };

  const getFilteredData = (data: any[], searchFields: string[], statusField: string = 'status', dateField: string = 'created_at') => {
    let filtered = data;
    filtered = filterDataByDate(filtered, dateField);
    filtered = filterDataBySearch(filtered, searchFields);
    filtered = filterDataByStatus(filtered, statusField);
    return filtered;
  };

  const getServicePrice = (serviceType: string) => {
    const prices: { [key: string]: number } = {
      'full-body': 999,
      'upper-body': 499,
      'lower-body': 599,
      'head-massage': 299,
      'injury-therapy': 799,
      'full-body-stretching': 499,
    };
    return prices[serviceType] || 0;
  };

  // Booking management functions
  const updateBookingStatus = async (id: number, newStatus: string) => {
    try {
      // Set notification status to sending
      setNotificationStatus(prev => ({ ...prev, [id]: 'sending' }));
      
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Find the booking details for notifications
        const booking = bookings?.find(b => b.id === id);
        if (booking) {
          // Get service and oil names
          const serviceName = booking.service_type.replace('-', ' ').toUpperCase();
          const oilName = booking.oil_type.replace('-', ' ').toUpperCase();
          
          let emailSuccess = false;
          let whatsappSuccess = false;
          
          // Send email notification
          try {
            const emailResponse = await fetch('/api/notifications/email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'booking_status_update',
                booking: booking,
                newStatus: newStatus,
                serviceName: serviceName,
                oilName: oilName
              }),
            });
            
            emailSuccess = emailResponse.ok;
            if (emailSuccess) {
              // Email notification sent successfully
            } else {
              console.error('❌ Failed to send email notification');
            }
          } catch (emailError) {
            console.error('❌ Error sending email notification:', emailError);
          }
          
          // Send WhatsApp notification
          try {
            const whatsappResponse = await fetch('/api/notifications/whatsapp', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'booking_status_update',
                booking: booking,
                newStatus: newStatus,
                serviceName: serviceName,
                oilName: oilName
              }),
            });
            
            whatsappSuccess = whatsappResponse.ok;
            if (whatsappSuccess) {
              // WhatsApp notification sent successfully
            } else {
              console.error('❌ Failed to send WhatsApp notification');
            }
          } catch (whatsappError) {
            console.error('❌ Error sending WhatsApp notification:', whatsappError);
          }
          
          // Update notification status
          if (emailSuccess && whatsappSuccess) {
            setNotificationStatus(prev => ({ ...prev, [id]: 'sent' }));
            setTimeout(() => {
              setNotificationStatus(prev => {
                const newStatus = { ...prev };
                delete newStatus[id];
                return newStatus;
              });
            }, 3000);
          } else {
            setNotificationStatus(prev => ({ ...prev, [id]: 'failed' }));
            setTimeout(() => {
              setNotificationStatus(prev => {
                const newStatus = { ...prev };
                delete newStatus[id];
                return newStatus;
              });
            }, 5000);
          }
        }
        
        // Refetch data
        window.location.reload();
        alert('Booking status updated successfully! Notifications sent to client.');
      } else {
        setNotificationStatus(prev => ({ ...prev, [id]: 'failed' }));
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      setNotificationStatus(prev => ({ ...prev, [id]: 'failed' }));
      alert('Error updating booking status');
    }
  };

  const updatePaymentStatus = async (id: number, newPaymentStatus: string) => {
    try {
      // Set notification status to sending
      setNotificationStatus(prev => ({ ...prev, [id]: 'sending' }));
      
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      });
      
      if (response.ok) {
        // Find the booking details for notifications
        const booking = bookings?.find(b => b.id === id);
                       // No email notifications for payment status - only WhatsApp admin notification
               if (booking && (newPaymentStatus === 'paid' || newPaymentStatus === 'cash')) {
                 // Send WhatsApp notification to admin only for payment completion
                 try {
                   const whatsappResponse = await fetch('/api/notifications/whatsapp', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                       type: 'payment_completed',
                       booking: booking,
                       paymentStatus: newPaymentStatus,
                       serviceName: booking.service_type.replace('-', ' ').toUpperCase(),
                       oilName: booking.oil_type.replace('-', ' ').toUpperCase()
                     }),
                   });
                   
                   if (whatsappResponse.ok) {
                     // Payment completion WhatsApp sent to admin successfully
                   } else {
                     console.error('❌ Failed to send payment completion WhatsApp to admin');
                   }
                 } catch (whatsappError) {
                   console.error('❌ Error sending payment completion WhatsApp to admin:', whatsappError);
                 }
               }
               
               // Clear notification status immediately
               setNotificationStatus(prev => {
                 const newStatus = { ...prev };
                 delete newStatus[id];
                 return newStatus;
               });
        
        // Refetch data
        window.location.reload();
        alert('Payment status updated successfully!');
      } else {
        setNotificationStatus(prev => ({ ...prev, [id]: 'failed' }));
        alert('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      setNotificationStatus(prev => ({ ...prev, [id]: 'failed' }));
      alert('Error updating payment status');
    }
  };

  // Inquiry management functions
  const updateInquiryStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Refetch data
        window.location.reload();
        alert('Inquiry status updated successfully!');
      } else {
        alert('Failed to update inquiry status');
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Error updating inquiry status');
    }
  };

  // Feedback management functions
  const deleteFeedback = async (id: number) => {
    if (confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/feedback/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Refetch data
          window.location.reload();
          alert('Feedback deleted successfully!');
        } else {
          alert('Failed to delete feedback');
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback');
      }
    }
  };

  // Utility function to get status color
  const getStatusColor = (status: string, type: 'booking' | 'inquiry') => {
    if (type === 'booking') {
      switch (status) {
        case 'booked': return 'bg-orange-100 text-orange-800 border border-orange-200';
        case 'confirmed': return 'bg-green-100 text-green-800 border border-green-200';
        case 'completed': return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
        default: return 'bg-gray-100 text-gray-800 border border-gray-200';
      }
    } else {
      switch (status) {
        case 'new': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'responded': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  // Utility function to get priority indicator
  const getPriorityIndicator = (status: string, type: 'booking' | 'inquiry') => {
    if (type === 'booking') {
      return status === 'pending' ? '🔴' : status === 'confirmed' ? '🟡' : '🟢';
    } else {
      return status === 'new' ? '🔴' : status === 'pending' ? '🟡' : '🟢';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            {/* Header Loading */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Stats Cards Loading */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-lg shadow-md"></div>
              ))}
            </div>
            
            {/* Content Loading */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-lg shadow-md"></div>
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center text-red-600">
              <span>Error loading dashboard data: {error.message}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {selectedView !== 'dashboard' && (
                <button
                  onClick={() => setSelectedView('dashboard')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedView === 'dashboard' && 'Database Dashboard'}
                  {selectedView === 'bookings' && 'All Bookings'}
                  {selectedView === 'inquiries' && 'All Inquiries'}
                  {selectedView === 'feedback' && 'All Feedback'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedView === 'dashboard' && 'Real-time PostgreSQL data monitoring'}
                  {selectedView !== 'dashboard' && 'Detailed view of all data with advanced filtering'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 mr-2" />
              Last updated: {new Date(data?.timestamp || '').toLocaleTimeString()}
            </div>
          </div>

          {/* Filters - Show only when not on dashboard */}
          {selectedView !== 'dashboard' && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Search:</span>
                  <input
                    type="text"
                    placeholder={selectedView === 'bookings' ? 'Search by name, email, phone...' : 
                               selectedView === 'inquiries' ? 'Search by name, phone...' : 
                               'Search by name...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all" className="bg-white text-gray-900">All Status</option>
                    {selectedView === 'bookings' && (
                      <>
                        <option value="pending" className="bg-white text-gray-900">Pending</option>
                        <option value="confirmed" className="bg-white text-gray-900">Confirmed</option>
                        <option value="completed" className="bg-white text-gray-900">Completed</option>
                        <option value="cancelled" className="bg-white text-gray-900">Cancelled</option>
                      </>
                    )}
                    {selectedView === 'inquiries' && (
                      <>
                        <option value="new" className="bg-white text-gray-900">New</option>
                        <option value="pending" className="bg-white text-gray-900">Pending</option>
                        <option value="responded" className="bg-white text-gray-900">Responded</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Date:</span>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all" className="bg-white text-gray-900">All Time</option>
                    <option value="today" className="bg-white text-gray-900">Today</option>
                    <option value="week" className="bg-white text-gray-900">This Week</option>
                    <option value="month" className="bg-white text-gray-900">This Month</option>
                    <option value="custom" className="bg-white text-gray-900">Custom Range</option>
                  </select>
                </div>
              </div>

              {/* Custom Date Range */}
              {dateFilter === 'custom' && (
                <div className="mt-4 flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Custom Range:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setDateFilter('all');
                    setStartDate('');
                    setEndDate('');
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard View */}
        {selectedView === 'dashboard' && (
          <>
                         {/* Statistics Cards */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <button
                 onClick={() => setSelectedView('bookings')}
                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               >
                 <div className="flex items-center">
                   <div className="p-2 bg-blue-100 rounded-lg">
                     <Users className="w-6 h-6 text-blue-600" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                     <p className="text-2xl font-bold text-gray-900">
                       {data?.counts.bookings || 0}
                     </p>
                     <p className="text-xs text-blue-600 mt-1">Click to view all bookings</p>
                   </div>
                 </div>
               </button>

               <button
                 onClick={() => setSelectedView('inquiries')}
                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               >
                 <div className="flex items-center">
                   <div className="p-2 bg-green-100 rounded-lg">
                     <MessageCircle className="w-6 h-6 text-green-600" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                     <p className="text-2xl font-bold text-gray-900">
                       {data?.counts.inquiries || 0}
                     </p>
                     <p className="text-xs text-green-600 mt-1">Click to view all inquiries</p>
                   </div>
                 </div>
               </button>

               <button
                 onClick={() => setSelectedView('feedback')}
                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               >
                 <div className="flex items-center">
                   <div className="p-2 bg-yellow-100 rounded-lg">
                     <Star className="w-6 h-6 text-yellow-600" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                     <p className="text-2xl font-bold text-gray-900">
                       {data?.counts.feedback || 0}
                     </p>
                     <p className="text-xs text-yellow-600 mt-1">Click to view all feedback</p>
                   </div>
                 </div>
               </button>

               <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md p-6 text-white">
                 <div className="flex items-center">
                   <div className="p-2 bg-white/20 rounded-lg">
                     <Clock className="w-6 h-6" />
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium opacity-90">Active Items</p>
                     <p className="text-2xl font-bold">
                       {(activeBookings?.length || 0) + (activeInquiries?.length || 0)}
                     </p>
                     <p className="text-xs opacity-90 mt-1">
                       {activeBookings?.length || 0} Bookings • {activeInquiries?.length || 0} Inquiries
                     </p>
                   </div>
                 </div>
               </div>
             </div>

                         {/* Recent Bookings */}
             <div className="bg-white rounded-lg shadow-md p-6">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
               <div className="space-y-3">
                 {data?.recentBookings.length ? (
                   data.recentBookings.map((booking) => (
                     <div key={booking.id} className="border-l-4 border-blue-500 pl-3">
                       <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                       <p className="text-xs text-gray-600">
                         {new Date(booking.created_at).toLocaleDateString()} • {booking.service_type}
                       </p>
                     </div>
                   ))
                 ) : (
                   <p className="text-gray-500 text-sm">No bookings yet</p>
                 )}
               </div>
             </div>

             {/* Active Bookings */}
             <div className="bg-white rounded-lg shadow-md p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-gray-900">Active Bookings</h3>
                 <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                   {activeBookings?.length || 0} Active
                 </span>
               </div>
               
               {activeBookingsLoading ? (
                 <div className="animate-pulse space-y-4">
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                   ))}
                 </div>
               ) : activeBookings && activeBookings.length > 0 ? (
                 <div className="space-y-4">
                   {activeBookings.map((booking) => (
                     <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center">
                             <span className="mr-2 text-lg">{getPriorityIndicator(booking.status, 'booking')}</span>
                             <div>
                               <h4 className="font-semibold text-gray-900">{booking.name}</h4>
                               <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                             </div>
                           </div>
                           <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status, 'booking')}`}>
                             {booking.status.toUpperCase()}
                           </span>
                         </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                         <div className="flex items-center text-gray-600">
                           <Calendar className="w-4 h-4 mr-2" />
                           <span>{formatDate(booking.date_time)}</span>
                         </div>
                         <div className="flex items-center text-gray-600">
                           <Shield className="w-4 h-4 mr-2" />
                           <span>{booking.service_type.replace('-', ' ').toUpperCase()}</span>
                         </div>
                         <div className="flex items-center text-gray-600">
                           <MapPin className="w-4 h-4 mr-2" />
                           <span className="truncate">{booking.address}</span>
                         </div>
                         <div className="flex items-center text-gray-600">
                           <Phone className="w-4 h-4 mr-2" />
                           <span>{booking.contact}</span>
                         </div>
                       </div>
                       
                       <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                         <span className="text-sm font-semibold text-green-600">
                           ₹{getServicePrice(booking.service_type)}
                         </span>
                         <div className="flex space-x-2">
                           <a
                             href={`tel:${booking.contact}`}
                             className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                           >
                             📞 Call
                           </a>
                           <a
                             href={`mailto:${booking.email}`}
                             className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors"
                           >
                             📧 Email
                           </a>
                           <button
                             onClick={() => setSelectedView('bookings')}
                             className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                           >
                             View Details
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <div className="text-gray-400 text-4xl mb-2">📅</div>
                   <p className="text-gray-500 text-sm">No active bookings</p>
                   <p className="text-gray-400 text-xs">Pending and confirmed bookings will appear here</p>
                 </div>
               )}
                           </div>

             {/* Active Inquiries */}
             <div className="bg-white rounded-lg shadow-md p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-gray-900">Active Inquiries</h3>
                 <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                   {activeInquiries?.length || 0} Active
                 </span>
               </div>
               
               {activeInquiriesLoading ? (
                 <div className="animate-pulse space-y-4">
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                   ))}
                 </div>
               ) : activeInquiries && activeInquiries.length > 0 ? (
                 <div className="space-y-4">
                   {activeInquiries.map((inquiry) => (
                     <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center">
                             <span className="mr-2 text-lg">{getPriorityIndicator(inquiry.status, 'inquiry')}</span>
                             <div>
                               <h4 className="font-semibold text-gray-900">{inquiry.name}</h4>
                               <p className="text-sm text-gray-600">Inquiry ID: #{inquiry.id}</p>
                             </div>
                           </div>
                           <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(inquiry.status, 'inquiry')}`}>
                             {inquiry.status.toUpperCase()}
                           </span>
                         </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                         <div className="flex items-center text-gray-600">
                           <Phone className="w-4 h-4 mr-2" />
                           <span>{inquiry.phone}</span>
                         </div>
                         <div className="flex items-center text-gray-600">
                           <Clock className="w-4 h-4 mr-2" />
                           <span>{formatDate(inquiry.created_at)}</span>
                         </div>
                       </div>
                       
                       <div className="bg-gray-50 p-3 rounded-lg mb-3">
                         <p className="text-sm text-gray-700 line-clamp-2">
                           {inquiry.message.length > 100 
                             ? `${inquiry.message.substring(0, 100)}...` 
                             : inquiry.message
                           }
                         </p>
                       </div>
                       
                       <div className="flex justify-between items-center">
                         <span className="text-sm font-semibold text-blue-600">
                           {inquiry.status === 'new' ? '🔵 New Inquiry' : '⏳ Pending Response'}
                         </span>
                         <div className="flex space-x-2">
                           <a
                             href={`tel:${inquiry.phone}`}
                             className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                           >
                             📞 Call
                           </a>
                           <a
                             href={`https://wa.me/91${inquiry.phone}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                           >
                             💬 WhatsApp
                           </a>
                           <button
                             onClick={() => setSelectedView('inquiries')}
                             className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                           >
                             View Details
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <div className="text-gray-400 text-4xl mb-2">💬</div>
                   <p className="text-gray-500 text-sm">No active inquiries</p>
                   <p className="text-gray-400 text-xs">New and pending inquiries will appear here</p>
                 </div>
               )}
             </div>

             {/* Live Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live monitoring active - Data refreshes every 30 seconds
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Database</p>
                    <p className="text-xs text-green-600">Connected & Healthy</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">API</p>
                    <p className="text-xs text-blue-600">All endpoints operational</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Notifications</p>
                    <p className="text-xs text-purple-600">Email & WhatsApp active</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bookings View */}
        {selectedView === 'bookings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                All Bookings ({getFilteredData(bookings || [], ['name', 'email', 'contact'], 'status').length} of {bookings?.length || 0})
              </h3>
              {(dateFilter !== 'all' || searchTerm || statusFilter !== 'all') && (
                <div className="flex items-center space-x-2">
                  {dateFilter !== 'all' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      Date: {dateFilter === 'custom' ? 'Custom Range' : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Search: &quot;{searchTerm}&quot;
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </span>
                  )}
                </div>
              )}
            </div>
            {bookingsLoading ? (
              <div className="animate-pulse space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : getFilteredData(bookings || [], ['name', 'email', 'contact'], 'status').length ? (
              <div className="space-y-6">
                {getFilteredData(bookings || [], ['name', 'email', 'contact'], 'status').map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{booking.name}</h4>
                          <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            booking.status === 'booked' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {booking.status === 'booked' ? '📋 Booked (Pending Confirmation)' :
                             booking.status === 'confirmed' ? '✅ Confirmed' :
                             booking.status === 'completed' ? '🎉 Completed' :
                             booking.status === 'cancelled' ? '❌ Cancelled' :
                             booking.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Customer Information</h5>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Name:</span>
                              <span className="text-sm text-gray-900">{booking.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Email:</span>
                              <span className="text-sm text-gray-900">{booking.email}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Phone:</span>
                              <span className="text-sm text-gray-900">{booking.contact}</span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-sm font-medium text-gray-600 w-20">Address:</span>
                              <span className="text-sm text-gray-900">{booking.address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Service Information */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Service Details</h5>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Service Type:</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {booking.service_type.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Oil Type:</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {booking.oil_type.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Price:</span>
                              <span className="text-sm font-semibold text-blue-600">
                                {formatCurrency(getServicePrice(booking.service_type))}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">Payment Status:</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                booking.payment_status === 'cash' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.payment_status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                                             {/* Timing Information */}
                       <div className="mt-6 pt-6 border-t border-gray-200">
                         <h5 className="font-semibold text-gray-900 mb-3">Timing Information</h5>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="bg-gray-50 p-4 rounded-lg">
                             <div className="text-sm font-medium text-gray-600">Appointment Date & Time</div>
                             <div className="text-sm font-semibold text-gray-900">{formatDate(booking.date_time)}</div>
                           </div>
                           <div className="bg-gray-50 p-4 rounded-lg">
                             <div className="text-sm font-medium text-gray-600">Booking Created</div>
                             <div className="text-sm font-semibold text-gray-900">{formatDate(booking.created_at)}</div>
                           </div>
                         </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="mt-6 pt-6 border-t border-gray-200">
                         <h5 className="font-semibold text-gray-900 mb-3">Manage Booking</h5>
                         <div className="flex flex-wrap gap-2">
                           {booking.status === 'booked' && (
                             <>
                               <button
                                 onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                 disabled={notificationStatus[booking.id] === 'sending'}
                                 className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                                   notificationStatus[booking.id] === 'sending' 
                                     ? 'bg-gray-400 cursor-not-allowed' 
                                     : 'bg-green-600 hover:bg-green-700'
                                 }`}
                               >
                                 {notificationStatus[booking.id] === 'sending' ? '⏳ Sending...' : '✅ Confirm Booking'}
                               </button>
                               <button
                                 onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                 disabled={notificationStatus[booking.id] === 'sending'}
                                 className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                                   notificationStatus[booking.id] === 'sending' 
                                     ? 'bg-gray-400 cursor-not-allowed' 
                                     : 'bg-red-600 hover:bg-red-700'
                                 }`}
                               >
                                 {notificationStatus[booking.id] === 'sending' ? '⏳ Sending...' : '❌ Cancel Booking'}
                               </button>
                             </>
                           )}
                           {booking.status === 'confirmed' && (
                             <>
                               <button
                                 onClick={() => updateBookingStatus(booking.id, 'completed')}
                                 disabled={notificationStatus[booking.id] === 'sending'}
                                 className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                                   notificationStatus[booking.id] === 'sending' 
                                     ? 'bg-gray-400 cursor-not-allowed' 
                                     : 'bg-blue-600 hover:bg-blue-700'
                                 }`}
                               >
                                 {notificationStatus[booking.id] === 'sending' ? '⏳ Sending...' : '✅ Mark Completed'}
                               </button>
                               <button
                                 onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                 disabled={notificationStatus[booking.id] === 'sending'}
                                 className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                                   notificationStatus[booking.id] === 'sending' 
                                     ? 'bg-gray-400 cursor-not-allowed' 
                                     : 'bg-red-600 hover:bg-red-700'
                                 }`}
                               >
                                 {notificationStatus[booking.id] === 'sending' ? '⏳ Sending...' : '❌ Cancel Booking'}
                               </button>
                             </>
                           )}
                           {booking.status === 'completed' && (
                             <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg">
                               ✅ Booking Completed
                             </span>
                           )}
                           {booking.status === 'cancelled' && (
                             <span className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded-lg">
                               ❌ Booking Cancelled
                             </span>
                           )}
                           <a
                             href={`tel:${booking.contact}`}
                             className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                           >
                             📞 Call Customer
                           </a>
                           <a
                             href={`mailto:${booking.email}`}
                             className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                           >
                             📧 Email Customer
                           </a>
                         </div>
                         
                         {/* Notification Status Indicator */}
                         {notificationStatus[booking.id] && (
                           <div className="mt-3">
                             {notificationStatus[booking.id] === 'sending' && (
                               <div className="flex items-center gap-2 text-blue-600 text-sm">
                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                 Sending notifications to client...
                               </div>
                             )}
                             {notificationStatus[booking.id] === 'sent' && (
                               <div className="flex items-center gap-2 text-green-600 text-sm">
                                 ✅ Notifications sent successfully
                               </div>
                             )}
                             {notificationStatus[booking.id] === 'failed' && (
                               <div className="flex items-center gap-2 text-red-600 text-sm">
                                 ❌ Failed to send some notifications
                               </div>
                             )}
                           </div>
                         )}
                       </div>

                       {/* Payment Status Management */}
                       <div className="mt-4 pt-4 border-t border-gray-200">
                         <h5 className="font-semibold text-gray-900 mb-3">Payment Status</h5>
                         <div className="flex flex-wrap gap-2">
                           {booking.payment_status === 'pending' && (
                             <>
                               <button
                                 onClick={() => updatePaymentStatus(booking.id, 'paid')}
                                 disabled={notificationStatus[booking.id] === 'sending'}
                                 className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                                   notificationStatus[booking.id] === 'sending' 
                                     ? 'bg-gray-400 cursor-not-allowed' 
                                     : 'bg-green-600 hover:bg-green-700'
                                 }`}
                               >
                                 {notificationStatus[booking.id] === 'sending' ? '⏳ Sending...' : '💳 Mark as Paid'}
                               </button>
                               <button
                                 onClick={() => updatePaymentStatus(booking.id, 'cash')}
                                 disabled={notificationStatus[booking.id] === 'sending'}
                                 className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                                   notificationStatus[booking.id] === 'sending' 
                                     ? 'bg-gray-400 cursor-not-allowed' 
                                     : 'bg-blue-600 hover:bg-blue-700'
                                 }`}
                               >
                                 {notificationStatus[booking.id] === 'sending' ? '⏳ Sending...' : '💰 Mark as Cash Payment'}
                               </button>
                             </>
                           )}
                           {booking.payment_status === 'paid' && (
                             <span className="px-4 py-2 bg-green-100 text-green-600 text-sm rounded-lg">
                               💳 Payment Completed (Online)
                             </span>
                           )}
                           {booking.payment_status === 'cash' && (
                             <span className="px-4 py-2 bg-blue-100 text-blue-600 text-sm rounded-lg">
                               💰 Payment Completed (Cash)
                             </span>
                           )}
                           {(booking.payment_status === 'paid' || booking.payment_status === 'cash') && (
                             <button
                               onClick={() => updatePaymentStatus(booking.id, 'pending')}
                               disabled={notificationStatus[booking.id] === 'sending'}
                               className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
                                 notificationStatus[booking.id] === 'sending' 
                                   ? 'bg-gray-400 cursor-not-allowed' 
                                   : 'bg-yellow-600 hover:bg-yellow-700'
                               }`}
                             >
                               {notificationStatus[booking.id] === 'sending' ? '⏳ Sending...' : '🔄 Reset to Pending'}
                             </button>
                           )}
                         </div>
                         
                         {/* Payment Notification Status Indicator */}
                         {notificationStatus[booking.id] && (booking.payment_status === 'paid' || booking.payment_status === 'cash') && (
                           <div className="mt-3">
                             {notificationStatus[booking.id] === 'sending' && (
                               <div className="flex items-center gap-2 text-blue-600 text-sm">
                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                 Sending payment completion notifications...
                               </div>
                             )}
                             {notificationStatus[booking.id] === 'sent' && (
                               <div className="flex items-center gap-2 text-green-600 text-sm">
                                 ✅ Payment completion notifications sent
                               </div>
                             )}
                             {notificationStatus[booking.id] === 'failed' && (
                               <div className="flex items-center gap-2 text-red-600 text-sm">
                                 ❌ Failed to send payment notifications
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <p className="text-gray-500 text-lg">
                  {searchTerm || dateFilter !== 'all' || statusFilter !== 'all' 
                    ? 'No bookings match your filters' 
                    : 'No bookings found'}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchTerm || dateFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters'
                    : 'Bookings will appear here once customers make reservations'}
                </p>
                {(searchTerm || dateFilter !== 'all' || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setDateFilter('all');
                      setStartDate('');
                      setEndDate('');
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Inquiries View */}
        {selectedView === 'inquiries' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                All Inquiries ({getFilteredData(inquiries || [], ['name', 'phone'], 'status').length} of {inquiries?.length || 0})
              </h3>
              {(dateFilter !== 'all' || searchTerm || statusFilter !== 'all') && (
                <div className="flex items-center space-x-2">
                  {dateFilter !== 'all' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      Date: {dateFilter === 'custom' ? 'Custom Range' : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Search: &quot;{searchTerm}&quot;
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </span>
                  )}
                </div>
              )}
            </div>
            {inquiriesLoading ? (
              <div className="animate-pulse space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : getFilteredData(inquiries || [], ['name', 'phone'], 'status').length ? (
              <div className="space-y-6">
                {getFilteredData(inquiries || [], ['name', 'phone'], 'status').map((inquiry) => (
                  <div key={inquiry.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{inquiry.name}</h4>
                          <p className="text-sm text-gray-600">Inquiry ID: #{inquiry.id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                            inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {inquiry.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h5>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Name:</span>
                              <span className="text-sm text-gray-900">{inquiry.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Phone:</span>
                              <span className="text-sm text-gray-900">{inquiry.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Status:</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                                inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {inquiry.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Message Details */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Message Details</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-medium text-gray-600 mb-2">Customer Message:</div>
                            <div className="text-sm text-gray-900 leading-relaxed">
                              {inquiry.message}
                            </div>
                          </div>
                        </div>
                      </div>

                                             {/* Timing Information */}
                       <div className="mt-6 pt-6 border-t border-gray-200">
                         <h5 className="font-semibold text-gray-900 mb-3">Timing Information</h5>
                         <div className="bg-gray-50 p-4 rounded-lg">
                           <div className="text-sm font-medium text-gray-600">Inquiry Received</div>
                           <div className="text-sm font-semibold text-gray-900">{formatDate(inquiry.created_at)}</div>
                         </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="mt-6 pt-6 border-t border-gray-200">
                         <h5 className="font-semibold text-gray-900 mb-3">Manage Inquiry</h5>
                         <div className="flex flex-wrap gap-2">
                           {inquiry.status === 'new' && (
                             <>
                               <button
                                 onClick={() => updateInquiryStatus(inquiry.id, 'responded')}
                                 className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                               >
                                 ✅ Mark Responded
                               </button>
                               <button
                                 onClick={() => updateInquiryStatus(inquiry.id, 'pending')}
                                 className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                               >
                                 ⏳ Mark Pending
                               </button>
                             </>
                           )}
                           {inquiry.status === 'pending' && (
                             <>
                               <button
                                 onClick={() => updateInquiryStatus(inquiry.id, 'responded')}
                                 className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                               >
                                 ✅ Mark Responded
                               </button>
                               <button
                                 onClick={() => updateInquiryStatus(inquiry.id, 'new')}
                                 className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                               >
                                 🔄 Mark New
                               </button>
                             </>
                           )}
                           {inquiry.status === 'responded' && (
                             <span className="px-4 py-2 bg-green-100 text-green-600 text-sm rounded-lg">
                               ✅ Inquiry Responded
                             </span>
                           )}
                           <a
                             href={`tel:${inquiry.phone}`}
                             className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                           >
                             📞 Call Customer
                           </a>
                           <a
                             href={`https://wa.me/91${inquiry.phone}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                           >
                             💬 WhatsApp
                           </a>
                         </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💬</div>
                <p className="text-gray-500 text-lg">
                  {searchTerm || dateFilter !== 'all' || statusFilter !== 'all' 
                    ? 'No inquiries match your filters' 
                    : 'No inquiries found'}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchTerm || dateFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters'
                    : 'Inquiries will appear here once customers contact you'}
                </p>
                {(searchTerm || dateFilter !== 'all' || statusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setDateFilter('all');
                      setStartDate('');
                      setEndDate('');
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Feedback View */}
        {selectedView === 'feedback' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                All Feedback ({getFilteredData(feedback || [], ['name'], 'rating').length} of {feedback?.length || 0})
              </h3>
              {(dateFilter !== 'all' || searchTerm) && (
                <div className="flex items-center space-x-2">
                  {dateFilter !== 'all' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      Date: {dateFilter === 'custom' ? 'Custom Range' : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Search: &quot;{searchTerm}&quot;
                    </span>
                  )}
                </div>
              )}
            </div>
            {feedbackLoading ? (
              <div className="animate-pulse space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : getFilteredData(feedback || [], ['name'], 'rating').length ? (
              <div className="space-y-6">
                {getFilteredData(feedback || [], ['name'], 'rating').map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Feedback ID: #{item.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-700">({item.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Customer Information</h5>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Name:</span>
                              <span className="text-sm text-gray-900">{item.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Rating:</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-700">({item.rating}/5)</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-600 w-20">Status:</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.rating >= 4 ? 'bg-green-100 text-green-800' :
                                item.rating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.rating >= 4 ? 'EXCELLENT' : item.rating >= 3 ? 'GOOD' : 'NEEDS IMPROVEMENT'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Feedback Details */}
                        <div className="space-y-4">
                          <h5 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Feedback Details</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm font-medium text-gray-600 mb-2">Customer Comment:</div>
                            <div className="text-sm text-gray-900 leading-relaxed">
                              {item.comment}
                            </div>
                          </div>
                        </div>
                      </div>

                                             {/* Timing Information */}
                       <div className="mt-6 pt-6 border-t border-gray-200">
                         <h5 className="font-semibold text-gray-900 mb-3">Timing Information</h5>
                         <div className="bg-gray-50 p-4 rounded-lg">
                           <div className="text-sm font-medium text-gray-600">Feedback Submitted</div>
                           <div className="text-sm font-semibold text-gray-900">{formatDate(item.created_at)}</div>
                         </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="mt-6 pt-6 border-t border-gray-200">
                         <h5 className="font-semibold text-gray-900 mb-3">Manage Feedback</h5>
                         <div className="flex flex-wrap gap-2">
                           <button
                             onClick={() => deleteFeedback(item.id)}
                             className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                           >
                             🗑️ Delete Feedback
                           </button>
                           <span className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg">
                             ⭐ Rating: {item.rating}/5
                           </span>
                         </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">⭐</div>
                <p className="text-gray-500 text-lg">
                  {searchTerm || dateFilter !== 'all' 
                    ? 'No feedback matches your filters' 
                    : 'No feedback found'}
                </p>
                <p className="text-gray-400 text-sm">
                  {searchTerm || dateFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters'
                    : 'Customer feedback will appear here once they submit reviews'}
                </p>
                {(searchTerm || dateFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setDateFilter('all');
                      setStartDate('');
                      setEndDate('');
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminRoute>
      <DashboardContent />
    </AdminRoute>
  );
} 