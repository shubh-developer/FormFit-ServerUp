'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MessageSquare, 
  Star, 
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
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  DollarSign,
  Calendar
} from 'lucide-react';

export default function MasterPackagesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    packageType: 'massage',
    title: '',
    description: '',
    discountPercentage: '',
    originalPrice: '',
    discountedPrice: '',
    sessions: '',
    validityDays: '',
    features: [''],
    serviceTypes: []
  });
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchPackages();
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

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/packages');
      if (!response.ok) {
        console.error('API response not OK:', response.status);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/packages/${selectedPackage.id}` : '/api/packages';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (data.success) {
        setShowCreateForm(false);
        setFormData({
          packageType: 'massage',
          title: '',
          description: '',
          discountPercentage: '',
          originalPrice: '',
          discountedPrice: '',
          sessions: '',
          validityDays: '',
          features: [''],
          serviceTypes: []
        });
        fetchPackages();
        alert(isEditing ? 'Package updated successfully!' : 'Package created successfully!');
      } else {
        alert(`Failed to ${isEditing ? 'update' : 'create'} package: ` + data.message);
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} package`);
    }
  };

  const handleView = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowViewModal(true);
  };

  const handleEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setFormData({
      packageType: pkg.package_type || 'massage',
      title: pkg.title || '',
      description: pkg.description || '',
      discountPercentage: pkg.discount_percentage?.toString() || '',
      originalPrice: pkg.original_price?.toString() || '',
      discountedPrice: pkg.discounted_price?.toString() || '',
      sessions: pkg.sessions?.toString() || '',
      validityDays: pkg.validity_days?.toString() || '',
      features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : (pkg.features || ['']),
      serviceTypes: []
    });
    setIsEditing(true);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`/api/packages/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          fetchPackages();
          alert('Package deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package');
      }
    }
  };

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        fetchPackages();
        alert(`Package ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/master-login');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', onClick: () => router.push('/master-dashboard') },
    { icon: Users, label: 'Bookings', onClick: () => router.push('/bookings') },
    { icon: MessageSquare, label: 'Inquiries', onClick: () => router.push('/inquiries') },
    { icon: Star, label: 'Feedback', onClick: () => router.push('/master-feedback') },
    { icon: Package, label: 'Packages', active: true },
    { icon: UserPlus, label: 'New Admin', onClick: () => router.push('/new-admin') },
    { icon: Tag, label: 'Offers', onClick: () => router.push('/offers') },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Database, label: 'Database' },
    { icon: Settings, label: 'Settings' },
    { icon: FileText, label: 'Logs' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const stats = {
    totalPackages: packages?.length || 0,
    activePackages: packages?.filter(p => p.status === 'active').length || 0,
    totalBookings: 0,
    avgPrice: packages?.length > 0 ? packages.reduce((sum, p) => sum + (p.discounted_price || 0), 0) / packages.length : 0
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
                <h1 className="text-2xl font-bold text-white">Package Management</h1>
                <p className="text-gray-300">Create and manage service packages</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsEditing(false);
                setSelectedPackage(null);
                setFormData({
                  packageType: 'massage',
                  title: '',
                  description: '',
                  discountPercentage: '',
                  originalPrice: '',
                  discountedPrice: '',
                  sessions: '',
                  validityDays: '',
                  features: [''],
                  serviceTypes: []
                });
                setShowCreateForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Package
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Packages</p>
                  <p className="text-3xl font-bold text-white">{stats.totalPackages}</p>
                </div>
                <Package className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Active Packages</p>
                  <p className="text-3xl font-bold text-green-400">{stats.activePackages}</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.totalBookings}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Avg Price</p>
                  <p className="text-3xl font-bold text-yellow-400">₹{Math.round(stats.avgPrice)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Package className="h-6 w-6 mr-3 text-yellow-400" />
                Service Packages
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages && packages.length > 0 ? packages.map((pkg) => (
                <div key={pkg.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">{pkg.title}</h3>
                      <div className="flex gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          pkg.package_type === 'fitness' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {pkg.package_type === 'fitness' ? 'Fitness' : 'Massage'}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(pkg.status)}`}>
                          {pkg.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleView(pkg)}
                        className="p-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-500/30"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(pkg)}
                        className="p-2 bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded-lg transition-colors border border-green-500/30"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded-lg transition-colors border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{pkg.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-300 text-sm">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="line-through text-gray-500">₹{pkg.original_price}</span>
                      <span className="ml-2 text-green-400 font-semibold">₹{pkg.discounted_price}</span>
                      <span className="ml-2 text-orange-400 text-xs">({pkg.discount_percentage}% OFF)</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {pkg.sessions} sessions • Valid for {pkg.validity_days} days
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-2">Package Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || []).map((feature: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400 text-xs" suppressHydrationWarning>
                        Created: {new Date(pkg.created_at).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleStatusToggle(pkg.id, pkg.status)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          pkg.status === 'active' 
                            ? 'bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30' 
                            : 'bg-green-600/20 text-green-300 hover:bg-green-600/30 border border-green-500/30'
                        }`}
                      >
                        {pkg.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
            
            {(!packages || packages.length === 0) && (
              <div className="text-center py-12 text-gray-400">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No packages created yet</p>
                <p className="text-sm">Create your first service package to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Package Modal */}
      {showViewModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Package Details</h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Package Type</label>
                <p className="text-white">{selectedPackage.package_type === 'fitness' ? 'Fitness Package' : 'Massage Package'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Title</label>
                <p className="text-white">{selectedPackage.title}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Description</label>
                <p className="text-white">{selectedPackage.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Discount</label>
                  <p className="text-white">{selectedPackage.discount_percentage}%</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Original Price</label>
                  <p className="text-white">₹{selectedPackage.original_price}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Discounted Price</label>
                  <p className="text-white">₹{selectedPackage.discounted_price}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Sessions</label>
                  <p className="text-white">{selectedPackage.sessions}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Validity</label>
                  <p className="text-white">{selectedPackage.validity_days} days</p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Features</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(typeof selectedPackage.features === 'string' ? JSON.parse(selectedPackage.features) : selectedPackage.features || []).map((feature: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Package Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Package' : 'Create New Package'}</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={handleCreatePackage}>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Package Type *</label>
                <select
                  value={formData.packageType}
                  onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
                >
                  <option value="massage" className="bg-gray-800">Massage Package</option>
                  <option value="fitness" className="bg-gray-800">Fitness Package</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Package Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., Relaxation Package"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  placeholder="Brief description of the package"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Discount % *</label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="13"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Original Price *</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="2997"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Discounted Price *</label>
                  <input
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="2599"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Number of Sessions *</label>
                  <input
                    type="number"
                    value={formData.sessions}
                    onChange={(e) => setFormData({...formData, sessions: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Valid for (Days) *</label>
                  <input
                    type="number"
                    value={formData.validityDays}
                    onChange={(e) => setFormData({...formData, validityDays: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="7"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">Package Features</label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({...formData, features: newFeatures});
                        }}
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="e.g., Flexible scheduling"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = formData.features.filter((_, i) => i !== index);
                            setFormData({...formData, features: newFeatures});
                          }}
                          className="px-3 py-3 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, features: [...formData.features, '']})}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {isEditing ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
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