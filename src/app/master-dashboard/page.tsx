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
  Search,
  Phone,
  Mail,
  Package
} from 'lucide-react';

export default function MasterDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    newInquiries: 0,
    avgRating: 0,
    totalFeedback: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchStats();
    fetchRecentBookings();
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        console.error('Failed to fetch bookings');
        return;
      }
      const data = await response.json();
      if (data.success) {
        setRecentBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setRecentBookings([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/master-login');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Bookings', onClick: () => router.push('/bookings') },
    { icon: MessageSquare, label: 'Inquiries', onClick: () => router.push('/inquiries') },
    { icon: Star, label: 'Feedback', onClick: () => router.push('/master-feedback') },
    { icon: Package, label: 'Packages', onClick: () => router.push('/master-packages') },
    { icon: UserPlus, label: 'New Admin', onClick: () => { console.log('Navigating to new-admin'); router.push('/new-admin'); } },
    { icon: Tag, label: 'Offers', onClick: () => router.push('/offers') },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Database, label: 'Database' },
    { icon: Settings, label: 'Settings' },
    { icon: FileText, label: 'Logs' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex">
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
                <h1 className="text-2xl font-bold text-white">Master Control Panel</h1>
                <p className="text-gray-300">System Overview & Management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => router.push('/bookings')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.pendingBookings}</p>
                </div>
                <Activity className="h-8 w-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer" onClick={() => router.push('/inquiries')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">New Inquiries</p>
                  <p className="text-3xl font-bold text-green-400">{stats.newInquiries}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-400" />
              </div>
            </div>



            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Reviews</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.totalFeedback}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                 onClick={() => router.push('/dashboard')}>
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Manage Bookings</h3>
              </div>
              <p className="text-gray-300">View and manage all customer bookings</p>
            </div>



            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                 onClick={() => router.push('/master-feedback')}>
              <div className="flex items-center mb-4">
                <Star className="h-8 w-8 text-orange-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">Customer Feedback</h3>
              </div>
              <p className="text-gray-300">Review ratings and customer feedback</p>
            </div>
          </div>



          {/* Recent Bookings */}
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-blue-400" />
                Recent Bookings
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {recentBookings
                .filter((booking: any) => 
                  booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  booking.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((booking: any) => (
                <div key={booking.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-white font-semibold mr-3">{booking.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed' ? 'bg-green-500/20 text-green-300' :
                          booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm space-x-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {booking.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {booking.contact}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{booking.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{booking.amount}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {recentBookings.filter((booking: any) => 
                booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm ? 'No bookings found matching your search.' : 'No recent bookings found.'}
                </div>
              )}
            </div>
          </div>

          {/* System Management */}
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-yellow-400" />
              System Management
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 p-4 rounded-xl transition-colors border border-blue-500/30">
                <Database className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">Database Status</span>
              </button>
              
              <button className="bg-green-600/20 hover:bg-green-600/30 text-green-300 p-4 rounded-xl transition-colors border border-green-500/30">
                <Settings className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">System Settings</span>
              </button>
              
              <button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 p-4 rounded-xl transition-colors border border-purple-500/30">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">User Management</span>
              </button>
              
              <button className="bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 p-4 rounded-xl transition-colors border border-orange-500/30">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <span className="block text-sm">System Logs</span>
              </button>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Access Full Admin Dashboard
            </button>
          </div>
        </div>
      </div>

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