'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AdminProtected from '@/components/AdminProtected';

interface Booking {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  service_type: string;
  oil_type: string;
  date_time: string;
  injury_note?: string;
  pain_areas?: any;
  payment_status: string;
  status: string;
  is_urgent: boolean;
  email_sent: boolean;
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

function AdminPageContent() {
  const [selectedTab, setSelectedTab] = useState('bookings');
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  // Fetch bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      return data.success ? data.bookings : [];
    },
    refetchInterval: 30000,
  });

  // Fetch inquiries
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async (): Promise<Inquiry[]> => {
      const response = await fetch('/api/inquiries');
      const data = await response.json();
      return data.success ? data.inquiries : [];
    },
    refetchInterval: 30000,
  });

  // Fetch feedback
  const { data: feedback, isLoading: feedbackLoading, refetch: refetchFeedback } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async (): Promise<Feedback[]> => {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      return data.success ? data.feedback : [];
    },
    refetchInterval: 30000,
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

  const getServicePrice = (serviceType: string) => {
    const prices: { [key: string]: number } = {
      'full-body': 999,
      'upper-body': 499,
      'lower-body': 499,
      'head-massage': 399,
      'injury-therapy': 799,
    };
    return prices[serviceType] || 0;
  };

  const toggleExpanded = (type: string, id: number) => {
    const key = `${type}-${id}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const deleteFeedback = async (id: number) => {
    if (confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/feedback/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          refetchFeedback();
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

  const updateBookingStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Refetch data
        window.location.reload();
        alert('Booking status updated successfully!');
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings, inquiries, and feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{inquiries?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{feedback?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'bookings', label: 'Bookings', icon: Calendar },
                { id: 'inquiries', label: 'Inquiries', icon: MessageCircle },
                { id: 'feedback', label: 'Feedback', icon: Star },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {selectedTab === 'bookings' && (
              <div className="space-y-4">
                {bookings?.map((booking) => {
                  const isExpanded = expandedItems[`booking-${booking.id}`];
                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleExpanded('booking', booking.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{booking.name}</h3>
                            <p className="text-sm text-gray-600">{booking.email} • {booking.contact}</p>
                            <p className="text-sm text-gray-600">{formatDate(booking.date_time)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            {booking.is_urgent && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                URGENT
                              </span>
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Service:</span> {booking.service_type.replace('-', ' ').toUpperCase()}</div>
                                <div><span className="font-medium">Price:</span> {formatCurrency(getServicePrice(booking.service_type))}</div>
                                <div><span className="font-medium">Oil Type:</span> {booking.oil_type.replace('-', ' ').toUpperCase()}</div>
                                <div><span className="font-medium">Payment Status:</span> 
                                  <span className={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusColor(booking.payment_status)}`}>
                                    {booking.payment_status}
                                  </span>
                                </div>
                                <div><span className="font-medium">Email Sent:</span> {booking.email_sent ? '✅ Yes' : '❌ No'}</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="font-medium">Address:</span> {booking.address}</div>
                                <div><span className="font-medium">Phone:</span> {booking.contact}</div>
                                <div><span className="font-medium">Email:</span> {booking.email}</div>
                                <div><span className="font-medium">Date & Time:</span> {formatDate(booking.date_time)}</div>
                                <div><span className="font-medium">Created:</span> {formatDate(booking.created_at)}</div>
                              </div>
                            </div>
                          </div>
                          
                          {booking.injury_note && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-2">Injury Notes</h4>
                              <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded">{booking.injury_note}</p>
                            </div>
                          )}
                          
                                                     {booking.pain_areas && (
                             <div className="mt-4">
                               <h4 className="font-medium text-gray-900 mb-2">Pain Areas</h4>
                               <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                                 {Array.isArray(booking.pain_areas) ? 
                                   booking.pain_areas.map((area: any, index: number) => (
                                     <div key={index}>• {area.area} (Intensity: {area.intensity}/5)</div>
                                   )) : 
                                   'Pain areas data available'
                                 }
                               </div>
                             </div>
                           )}

                           {/* Action Buttons */}
                           <div className="mt-6 pt-4 border-t border-gray-200">
                             <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                             <div className="flex flex-wrap gap-2">
                               <button
                                 onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                 className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                               >
                                 Confirm Booking
                               </button>
                               <button
                                 onClick={() => updateBookingStatus(booking.id, 'completed')}
                                 className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                               >
                                 Mark Completed
                               </button>
                               <button
                                 onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                 className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                               >
                                 Cancel Booking
                               </button>
                               <a
                                 href={`tel:${booking.contact}`}
                                 className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center"
                               >
                                 <Phone className="w-3 h-3 mr-1" />
                                 Call Client
                               </a>
                               <a
                                 href={`mailto:${booking.email}`}
                                 className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 flex items-center"
                               >
                                 <Mail className="w-3 h-3 mr-1" />
                                 Email Client
                               </a>
                             </div>
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {selectedTab === 'inquiries' && (
              <div className="space-y-4">
                {inquiries?.map((inquiry) => {
                  const isExpanded = expandedItems[`inquiry-${inquiry.id}`];
                  return (
                    <div key={inquiry.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleExpanded('inquiry', inquiry.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{inquiry.name}</h3>
                            <p className="text-sm text-gray-600">{inquiry.phone}</p>
                            <p className="text-sm text-gray-600">{formatDate(inquiry.created_at)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                              {inquiry.status}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded">{inquiry.message}</p>
                            </div>
                                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                               <div><span className="font-medium">Name:</span> {inquiry.name}</div>
                               <div><span className="font-medium">Phone:</span> {inquiry.phone}</div>
                               <div><span className="font-medium">Status:</span> 
                                 <span className={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusColor(inquiry.status)}`}>
                                   {inquiry.status}
                                 </span>
                               </div>
                               <div><span className="font-medium">Created:</span> {formatDate(inquiry.created_at)}</div>
                             </div>

                             {/* Action Buttons */}
                             <div className="mt-4 pt-4 border-t border-gray-200">
                               <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                               <div className="flex flex-wrap gap-2">
                                 <button
                                   onClick={() => updateInquiryStatus(inquiry.id, 'responded')}
                                   className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                 >
                                   Mark Responded
                                 </button>
                                 <button
                                   onClick={() => updateInquiryStatus(inquiry.id, 'pending')}
                                   className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                                 >
                                   Mark Pending
                                 </button>
                                 <a
                                   href={`tel:${inquiry.phone}`}
                                   className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center"
                                 >
                                   <Phone className="w-3 h-3 mr-1" />
                                   Call Client
                                 </a>
                                 <a
                                   href={`https://wa.me/91${inquiry.phone}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center"
                                 >
                                   <MessageCircle className="w-3 h-3 mr-1" />
                                   WhatsApp
                                 </a>
                               </div>
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {selectedTab === 'feedback' && (
              <div className="space-y-4">
                {feedback?.map((item) => {
                  const isExpanded = expandedItems[`feedback-${item.id}`];
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleExpanded('feedback', item.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">({item.rating}/5)</span>
                            </div>
                            <p className="text-sm text-gray-600">{formatDate(item.created_at)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFeedback(item.id);
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete feedback"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Comment</h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded">{item.comment}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div><span className="font-medium">Name:</span> {item.name}</div>
                              <div><span className="font-medium">Rating:</span> {item.rating}/5</div>
                              <div><span className="font-medium">Created:</span> {formatDate(item.created_at)}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminProtected>
      <AdminPageContent />
    </AdminProtected>
  );
} 