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
  Mail,
  Phone,
  Package
} from 'lucide-react';

export default function InquiriesPage() {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '9876543210',
      subject: 'Service Inquiry',
      message: 'I would like to know more about your full body massage services and pricing.',
      status: 'New',
      priority: 'Medium',
      createdAt: '2024-01-20 10:30 AM'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '9876543211',
      subject: 'Booking Question',
      message: 'Can I book a massage for this weekend? What are your available time slots?',
      status: 'Replied',
      priority: 'High',
      createdAt: '2024-01-19 2:15 PM'
    }
  ]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchInquiries();
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

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries');
      const data = await response.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/master-login');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', onClick: () => router.push('/master-dashboard') },
    { icon: Users, label: 'Bookings', onClick: () => router.push('/bookings') },
    { icon: MessageSquare, label: 'Inquiries', active: true },
    { icon: Star, label: 'Feedback', onClick: () => router.push('/master-feedback') },
    { icon: Package, label: 'Packages', onClick: () => router.push('/master-packages') },
    { icon: UserPlus, label: 'New Admin', onClick: () => router.push('/new-admin') },
    { icon: Tag, label: 'Offers', onClick: () => router.push('/offers') },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Database, label: 'Database' },
    { icon: Settings, label: 'Settings' },
    { icon: FileText, label: 'Logs' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Replied': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

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
                <h1 className="text-2xl font-bold text-white">Customer Inquiries</h1>
                <p className="text-gray-300">Manage customer questions and support requests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Inquiries</p>
                  <p className="text-3xl font-bold text-white">{inquiries.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">New</p>
                  <p className="text-3xl font-bold text-blue-400">{inquiries.filter(i => i.status === 'New').length}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Replied</p>
                  <p className="text-3xl font-bold text-green-400">{inquiries.filter(i => i.status === 'Replied').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">High Priority</p>
                  <p className="text-3xl font-bold text-red-400">{inquiries.filter(i => i.priority === 'High').length}</p>
                </div>
                <Activity className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-yellow-400" />
                All Inquiries
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Subject</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Message</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{inquiry.name}</div>
                          <div className="text-gray-400 text-sm flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {inquiry.email}
                          </div>
                          <div className="text-gray-400 text-sm flex items-center mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {inquiry.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{inquiry.subject}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 max-w-xs truncate">
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{inquiry.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="p-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-500/30">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded-lg transition-colors border border-green-500/30">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded-lg transition-colors border border-red-500/30">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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