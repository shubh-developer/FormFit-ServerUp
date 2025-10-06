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
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function OffersPage() {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "New Year Special",
      discount: "20%",
      code: "NY2024",
      validUntil: "2024-01-31",
      status: "Active",
      description: "Get 20% off on all massage services"
    },
    {
      id: 2,
      title: "Weekend Relaxation",
      discount: "15%",
      code: "WEEKEND15",
      validUntil: "2024-12-31",
      status: "Active",
      description: "Special weekend discount for stress relief"
    }
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    code: '',
    validUntil: '',
    status: 'Active'
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      if (data.success) {
        const formattedOffers = data.offers.map((offer: any) => ({
          id: offer.id,
          title: offer.title,
          discount: offer.discount,
          code: offer.code,
          validUntil: offer.valid_until,
          status: offer.status,
          description: `${offer.discount} discount offer`
        }));
        setOffers(formattedOffers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/master-login');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', onClick: () => router.push('/master-dashboard') },
    { icon: Users, label: 'Bookings', onClick: () => router.push('/dashboard') },
    { icon: MessageSquare, label: 'Inquiries', onClick: () => router.push('/dashboard') },
    { icon: Star, label: 'Feedback', onClick: () => router.push('/dashboard') },
    { icon: UserPlus, label: 'New Admin' },
    { icon: Tag, label: 'Offers', active: true },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Database, label: 'Database' },
    { icon: Settings, label: 'Settings' },
    { icon: FileText, label: 'Logs' },
  ];

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
                <h1 className="text-2xl font-bold text-white">Offers Management</h1>
                <p className="text-gray-300">Create and manage promotional offers</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Offer
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Offers</p>
                  <p className="text-3xl font-bold text-white">{offers.length}</p>
                </div>
                <Tag className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Active Offers</p>
                  <p className="text-3xl font-bold text-green-400">{offers.filter(o => o.status === 'Active').length}</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Savings</p>
                  <p className="text-3xl font-bold text-yellow-400">₹15,000</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Usage Rate</p>
                  <p className="text-3xl font-bold text-purple-400">68%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Offers Table */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Tag className="h-6 w-6 mr-3 text-yellow-400" />
                Current Offers
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Offer Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Discount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Valid Until</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {offers.map((offer) => (
                    <tr key={offer.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{offer.title}</div>
                          <div className="text-gray-400 text-sm">{offer.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-2xl font-bold text-green-400">{offer.discount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg font-mono text-sm border border-blue-500/30">
                          {offer.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{offer.validUntil}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          offer.status === 'Active' 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedOffer(offer);
                              setShowViewModal(true);
                            }}
                            className="p-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-500/30"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOffer(offer);
                              setFormData({
                                title: offer.title,
                                discount: offer.discount,
                                code: offer.code,
                                validUntil: offer.validUntil,
                                status: offer.status
                              });
                              setShowEditForm(true);
                            }}
                            className="p-2 bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30 rounded-lg transition-colors border border-yellow-500/30"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this offer?')) {
                                fetch(`/api/offers/${offer.id}`, { method: 'DELETE' })
                                .then(() => fetchOffers())
                                .catch(() => alert('Error deleting offer'));
                              }
                            }}
                            className="p-2 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded-lg transition-colors border border-red-500/30"
                          >
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

      {/* Create Offer Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Offer</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Offer Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter offer title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Discount</label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="e.g., 20% or ₹500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="OFFER2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Valid Until</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    // Enhanced validation
                    if (!formData.title || !formData.discount || !formData.code || !formData.validUntil) {
                      alert('Please fill all required fields');
                      return;
                    }
                    
                    if (formData.code.length < 3) {
                      alert('Code must be at least 3 characters');
                      return;
                    }
                    
                    if (offers.some(offer => offer.code === formData.code)) {
                      alert('Code already exists');
                      return;
                    }
                    
                    const today = new Date().toISOString().split('T')[0];
                    if (formData.validUntil < today) {
                      alert('Valid until date must be in the future');
                      return;
                    }
                    
                    // Save to database
                    fetch('/api/offers', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: formData.title,
                        discount: formData.discount,
                        code: formData.code,
                        validUntil: formData.validUntil,
                        status: formData.status
                      })
                    }).then(response => response.json())
                    .then(data => {
                      if (data.success) {
                        fetchOffers(); // Refresh list
                        setFormData({ title: '', discount: '', code: '', validUntil: '', status: 'Active' });
                        setShowCreateForm(false);
                      } else {
                        alert('Failed to create offer');
                      }
                    }).catch(() => alert('Error creating offer'));
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all"
                >
                  Create Offer
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

      {/* Edit Offer Modal */}
      {showEditForm && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Offer</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Offer Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Discount</label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Valid Until</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    fetch(`/api/offers/${selectedOffer.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData)
                    }).then(() => {
                      fetchOffers();
                      setShowEditForm(false);
                    }).catch(() => alert('Error updating offer'));
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all"
                >
                  Update Offer
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

      {/* View Offer Modal */}
      {showViewModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Offer Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <p className="text-white text-lg">{selectedOffer.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Discount</label>
                <p className="text-green-400 text-2xl font-bold">{selectedOffer.discount}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Code</label>
                <p className="text-blue-300 font-mono text-lg bg-blue-500/20 px-3 py-1 rounded border border-blue-500/30 inline-block">{selectedOffer.code}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Valid Until</label>
                <p className="text-white">{selectedOffer.validUntil}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  selectedOffer.status === 'Active' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {selectedOffer.status}
                </span>
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