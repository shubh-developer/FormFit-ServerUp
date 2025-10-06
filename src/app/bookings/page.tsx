'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Shield, 
  Settings, 
  LogOut,
  Crown,
  Database,
  Activity,
  Menu,
  X,
  Home,
  BarChart3,
  FileText,
  UserPlus,
  Tag,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Phone
} from 'lucide-react';

export default function BookingsPage() {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    transactionId: '',
    paymentProof: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    service: 'Full Body Massage',
    date: '',
    time: '',
    photoUrl: '',
    status: 'Pending',
    payment: 'Pending',
    amount: 999
  });
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: 'John Doe',
      contact: '9876543210',
      email: 'john@example.com',
      service: 'Full Body Massage',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'Confirmed',
      payment: 'Paid',
      amount: 999
    },
    {
      id: 2,
      name: 'Jane Smith',
      contact: '9876543211',
      email: 'jane@example.com',
      service: 'Upper Body Massage',
      date: '2024-01-21',
      time: '2:00 PM',
      status: 'Pending',
      payment: 'Pending',
      amount: 499
    }
  ]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchBookings();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/master-login');
      return;
    }
    
    setAdminInfo({
      username: 'admin',
      fullName: 'Master Administrator',
      role: 'master'
    });
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/master-login');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', onClick: () => router.push('/master-dashboard') },
    { icon: Users, label: 'Bookings', active: true },
    { icon: MessageSquare, label: 'Inquiries', onClick: () => router.push('/dashboard') },
    { icon: Star, label: 'Feedback', onClick: () => router.push('/dashboard') },
    { icon: UserPlus, label: 'New Admin', onClick: () => window.location.href = '/new-admin' },
    { icon: Tag, label: 'Offers', onClick: () => router.push('/offers') },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Database, label: 'Database' },
    { icon: Settings, label: 'Settings' },
    { icon: FileText, label: 'Logs' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case 'Paid': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex" suppressHydrationWarning>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-bold">Master Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                  item.active 
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">
                  {adminInfo?.fullName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{adminInfo?.fullName}</p>
                <p className="text-gray-400 text-xs">{adminInfo?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded-lg transition-colors border border-red-500/30 text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Bookings Management</h1>
                <p className="text-gray-300">Manage customer bookings and appointments</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Booking
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{bookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Confirmed</p>
                  <p className="text-3xl font-bold text-green-400">{bookings.filter(b => b.status === 'Confirmed').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-400">{bookings.filter(b => b.status === 'Pending').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-purple-400">₹{bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-yellow-400" />
                All Bookings
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Payment</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-white/10">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{booking.name}</div>
                          <div className="text-gray-400 text-sm">{booking.contact}</div>
                          <div className="text-gray-400 text-sm">{booking.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{booking.service}</td>
                      <td className="px-6 py-4">
                        {(booking as any).dateTime ? (
                          <div>
                            <div className="text-white">{new Date((booking as any).dateTime).toLocaleDateString()}</div>
                            <div className="text-gray-400 text-sm">{new Date((booking as any).dateTime).toLocaleTimeString()}</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-white">{booking.date}</div>
                            <div className="text-gray-400 text-sm">{booking.time}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-2xl font-bold text-green-400">₹{booking.amount || (booking.service?.includes('Package:') ? 2599 : 999)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getPaymentColor(booking.payment)}`}>
                          {booking.payment}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        
                        <div className="flex flex-wrap gap-2">
                       
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowViewModal(true);
                            }}
                            className="px-3 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg text-sm font-medium border border-blue-500/30 transition-all"
                          >
                            👁️ View
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedBooking(booking);
                              setFormData({
                                name: booking.name,
                                contact: booking.contact,
                                email: booking.email,
                                service: booking.service,
                                date: (booking as any).dateTime ? new Date((booking as any).dateTime).toISOString().split('T')[0] : booking.date,
                                time: (booking as any).dateTime ? new Date((booking as any).dateTime).toTimeString().split(':').slice(0,2).join(':') : booking.time,
                                photoUrl: (booking as any).photoUrl || '',
                                status: booking.status,
                                payment: booking.payment,
                                amount: booking.amount
                              });
                              setShowEditForm(true);
                            }}
                            className="px-3 py-1.5 bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30 rounded-lg text-sm font-medium border border-yellow-500/30 transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this booking?')) {
                                fetch(`/api/bookings/${booking.id}`, { method: 'DELETE' })
                                .then(() => fetchBookings())
                                .catch(() => alert('Error deleting booking'));
                              }
                            }}
                            className="px-3 py-1.5 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded-lg text-sm font-medium border border-red-500/30 transition-all"
                          >
                            🗑️ Delete
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                    
                  ))}
                 
                </tbody>
              </table>
              
              {/* Individual Booking Actions */}
              {bookings.map((booking) => (
                <div key={`actions-${booking.id}`} className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">{booking.name} - {booking.service}</span>
                    <span className="text-gray-400 text-sm">{booking.date} {booking.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => {
                        fetch(`/api/bookings/${booking.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'booked' })
                        }).then(() => fetchBookings());
                      }}
                      className="px-3 py-1.5 bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded-lg text-sm font-medium border border-green-500/30 transition-all"
                    >
                      ✓ Confirm
                    </button>
                    <button 
                      onClick={() => {
                        fetch(`/api/bookings/${booking.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'pending' })
                        }).then(() => fetchBookings());
                      }}
                      className="px-3 py-1.5 bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30 rounded-lg text-sm font-medium border border-yellow-500/30 transition-all"
                    >
                      ⏳ Pending
                    </button>
                    <button 
                      onClick={() => {
                        fetch(`/api/bookings/${booking.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'completed' })
                        }).then(() => fetchBookings());
                      }}
                      className="px-3 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg text-sm font-medium border border-blue-500/30 transition-all"
                    >
                      ✅ Complete
                    </button>
                    <button 
                      onClick={() => window.open(`tel:${booking.contact}`, '_self')}
                      className="px-3 py-1.5 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 rounded-lg text-sm font-medium border border-purple-500/30 transition-all"
                    >
                      📞 Call
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setPaymentData({ transactionId: '', paymentProof: '' });
                        setShowPaymentModal(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 rounded-lg text-sm font-medium border border-indigo-500/30 transition-all"
                    >
                      💳 Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Booking Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Booking</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 10);
                    setFormData({...formData, contact: value});
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter 10-digit contact number"
                  required
                />
                {formData.contact && formData.contact.length > 0 && formData.contact.length !== 10 && (
                  <p className="text-red-400 text-sm mt-1">Contact number must be exactly 10 digits</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value.toLowerCase()})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service *</label>
                <select
                  value={formData.service}
                  onChange={(e) => {
                    const service = e.target.value;
                    let amount = 999;
                    if (service === 'Upper Body Massage' || service === 'Lower Body Massage') amount = 499;
                    if (service === 'Head Massage') amount = 399;
                    if (service === 'Injury-Specific Therapy') amount = 799;
                    setFormData({...formData, service, amount});
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Full Body Massage">Full Body Massage - ₹999</option>
                  <option value="Upper Body Massage">Upper Body Massage - ₹499</option>
                  <option value="Lower Body Massage">Lower Body Massage - ₹499</option>
                  <option value="Head Massage">Head Massage - ₹399</option>
                  <option value="Injury-Specific Therapy">Injury-Specific Therapy - ₹799</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({...formData, photoUrl: event.target?.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {formData.photoUrl && (
                  <img src={formData.photoUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment</label>
                  <select
                    value={formData.payment}
                    onChange={(e) => setFormData({...formData, payment: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter amount"
                  min="0"
                />
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.name || !formData.contact || !formData.email || !formData.date || !formData.time) {
                      alert('Please fill all required fields');
                      return;
                    }
                    
                    if (formData.contact.length !== 10) {
                      alert('Contact number must be 10 digits');
                      return;
                    }
                    
                    // Save to database
                    fetch('/api/bookings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: formData.name,
                        contact: formData.contact,
                        email: formData.email,
                        service: formData.service,
                        date: formData.date,
                        time: formData.time,
                        status: formData.status,
                        payment: formData.payment,
                        amount: formData.amount
                      })
                    }).then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        fetchBookings(); // Refresh list
                        setFormData({ name: '', contact: '', email: '', service: 'Full Body Massage', date: '', time: '', photoUrl: '', status: 'Pending', payment: 'Pending', amount: 999 });
                        setShowCreateForm(false);
                        alert('Booking created successfully!');
                      } else {
                        alert('Failed to create booking: ' + data.message);
                      }
                    }).catch(() => alert('Error creating booking'));
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all"
                >
                  Create Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {showViewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
            
            <div className="space-y-4">
              {selectedBooking.photoUrl && (
                <div className="text-center">
                  <img src={selectedBooking.photoUrl} alt="Customer" className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-yellow-400" />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name</label>
                  <p className="text-white">{selectedBooking.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Contact</label>
                  <p className="text-white">{selectedBooking.contact}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <p className="text-white">{selectedBooking.email}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                  <p className="text-white">{selectedBooking.address || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Service</label>
                  <p className="text-white">{selectedBooking.service}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <p className="text-white">{selectedBooking.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                  <p className="text-white">{selectedBooking.time}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                  <p className="text-green-400 text-2xl font-bold">₹{selectedBooking.amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Payment</label>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getPaymentColor(selectedBooking.payment)}`}>
                    {selectedBooking.payment}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowViewModal(false)}
              className="w-full mt-6 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditForm && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Booking</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service *</label>
                <select
                  value={formData.service}
                  onChange={(e) => {
                    const service = e.target.value;
                    let amount = 999;
                    if (service === 'Upper Body Massage' || service === 'Lower Body Massage') amount = 499;
                    if (service === 'Head Massage') amount = 399;
                    if (service === 'Injury-Specific Therapy') amount = 799;
                    setFormData({...formData, service, amount});
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Full Body Massage">Full Body Massage - ₹999</option>
                  <option value="Upper Body Massage">Upper Body Massage - ₹499</option>
                  <option value="Lower Body Massage">Lower Body Massage - ₹499</option>
                  <option value="Head Massage">Head Massage - ₹399</option>
                  <option value="Injury-Specific Therapy">Injury-Specific Therapy - ₹799</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment</label>
                  <select
                    value={formData.payment}
                    onChange={(e) => setFormData({...formData, payment: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    fetch(`/api/bookings/${selectedBooking.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData)
                    }).then(() => {
                      fetchBookings();
                      setShowEditForm(false);
                    }).catch(() => alert('Error updating booking'));
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all"
                >
                  Update Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Management</h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h3 className="text-white font-medium mb-2">{selectedBooking.name}</h3>
                <p className="text-gray-300 text-sm">{selectedBooking.service} - ₹{selectedBooking.amount}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    fetch(`/api/bookings/${selectedBooking.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        payment: 'Paid',
                        paymentMethod: 'Online',
                        transactionId: paymentData.transactionId,
                        paymentProof: paymentData.paymentProof
                      })
                    }).then(() => {
                      fetchBookings();
                      setShowPaymentModal(false);
                    });
                  }}
                  className="bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded-lg transition-colors border border-green-500/30 py-3 font-medium"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={() => {
                    fetch(`/api/bookings/${selectedBooking.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        payment: 'Paid',
                        paymentMethod: 'Cash'
                      })
                    }).then(() => {
                      fetchBookings();
                      setShowPaymentModal(false);
                    });
                  }}
                  className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-500/30 py-3 font-medium"
                >
                  Mark as Cash Paid
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Transaction ID</label>
                <input
                  type="text"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter transaction ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Proof</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setPaymentData({...paymentData, paymentProof: event.target?.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {paymentData.paymentProof && (
                  <img src={paymentData.paymentProof} alt="Payment Proof" className="mt-2 w-20 h-20 object-cover rounded-lg" />
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}