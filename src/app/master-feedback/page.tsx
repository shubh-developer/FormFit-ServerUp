'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  Shield, 
  LogOut,
  Crown,
  Menu,
  X,
  Home,
  BarChart3,
  FileText,
  UserPlus,
  Tag,
  Users,
  MessageSquare,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Package,
  Database,
  Settings,
  Edit,
  Trash2,
  Save,
  XCircle
} from 'lucide-react';

export default function MasterFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [stats, setStats] = useState({
    totalFeedback: 0,
    avgRating: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchFeedbacks();
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

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      if (!response.ok) {
        console.error('Failed to fetch feedbacks:', response.status, response.statusText);
        setFeedbacks([]);
        calculateStats([]);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setFeedbacks(data.feedback || []);
        calculateStats(data.feedback || []);
      } else {
        console.error('API returned error:', data.message);
        setFeedbacks([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (feedbacks: any[]) => {
    const total = feedbacks.length;
    const avgRating = total > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0;
    
    const ratingCounts = feedbacks.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, {});

    setStats({
      totalFeedback: total,
      avgRating: avgRating,
      fiveStars: ratingCounts[5] || 0,
      fourStars: ratingCounts[4] || 0,
      threeStars: ratingCounts[3] || 0,
      twoStars: ratingCounts[2] || 0,
      oneStars: ratingCounts[1] || 0
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/master-login');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', onClick: () => router.push('/master-dashboard') },
    { icon: Users, label: 'Bookings', onClick: () => router.push('/bookings') },
    { icon: MessageSquare, label: 'Inquiries', onClick: () => router.push('/inquiries') },
    { icon: Star, label: 'Feedback', active: true },
    { icon: Package, label: 'Packages', onClick: () => router.push('/master-packages') },
    { icon: UserPlus, label: 'New Admin', onClick: () => router.push('/new-admin') },
    { icon: Tag, label: 'Offers', onClick: () => router.push('/offers') },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Database, label: 'Database' },
    { icon: Settings, label: 'Settings' },
    { icon: FileText, label: 'Logs' },
  ];

  const handleEdit = (feedback: any) => {
    setEditingId(feedback.id);
    setEditRating(feedback.rating);
    setEditComment(feedback.comment);
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: editRating, comment: editComment })
      });
      
      if (response.ok) {
        await fetchFeedbacks();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/feedback/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          await fetchFeedbacks();
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback: any) => {
    const matchesSearch = feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || feedback.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
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

        <nav className="flex-1 mt-8 px-4 overflow-y-auto">
          <div className="space-y-2 pb-4">
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

        <div className="flex-shrink-0 p-4 border-t border-white/10">
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
          <div className="flex justify-between items-center px-4 sm:px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Customer Feedback Management</h1>
                <p className="text-gray-300 text-sm sm:text-base">Monitor and analyze customer reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Reviews</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stats.totalFeedback}</p>
                </div>
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Average Rating</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.avgRating.toFixed(1)}</p>
                </div>
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">5-Star Reviews</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.fiveStars}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Recent Reviews</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-400">{feedbacks.slice(0, 7).length}</p>
                </div>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-8 border border-white/20 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-yellow-400" />
              Rating Distribution
            </h2>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats[`${rating === 5 ? 'five' : rating === 4 ? 'four' : rating === 3 ? 'three' : rating === 2 ? 'two' : 'one'}Stars` as keyof typeof stats] as number;
                const percentage = stats.totalFeedback > 0 ? (count / stats.totalFeedback) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center">
                    <div className="flex items-center w-20">
                      <span className="text-white mr-2">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-gray-300 w-16 text-right">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full text-sm sm:text-base"
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer text-sm sm:text-base"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-8 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-yellow-400" />
              Customer Reviews ({filteredFeedbacks.length})
            </h2>
            
            <div className="space-y-6">
              {filteredFeedbacks.map((feedback: any) => (
                <div key={feedback.id} className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex items-center w-full">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                        <span className="text-white font-bold text-base sm:text-lg">
                          {feedback.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold text-base sm:text-lg truncate">{feedback.name}</h3>
                        {editingId === feedback.id ? (
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 cursor-pointer ${
                                  star <= editRating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-500'
                                }`}
                                onClick={() => setEditRating(star)}
                              />
                            ))}
                            <span className="text-gray-300 ml-2 text-sm">
                              ({editRating}/5)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= feedback.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-500'
                                }`}
                              />
                            ))}
                            <span className="text-gray-300 ml-2 text-sm">
                              ({feedback.rating}/5)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        {editingId === feedback.id ? (
                          <>
                            <button
                              onClick={() => handleSave(feedback.id)}
                              className="p-2 bg-green-600/20 text-green-300 hover:bg-green-600/30 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 bg-gray-600/20 text-gray-300 hover:bg-gray-600/30 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(feedback)}
                              className="p-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(feedback.id)}
                              className="p-2 bg-red-600/20 text-red-300 hover:bg-red-600/30 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-gray-400 text-sm">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(feedback.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    {editingId === feedback.id ? (
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-200 leading-relaxed">{feedback.comment}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="text-gray-400 text-sm">
                      Booking ID: #{feedback.booking_id}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        feedback.rating >= 4 ? 'bg-green-500/20 text-green-300' :
                        feedback.rating >= 3 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {feedback.rating >= 4 ? 'Positive' : feedback.rating >= 3 ? 'Neutral' : 'Negative'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredFeedbacks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  {searchTerm || filterRating !== 'all' 
                    ? 'No reviews found matching your filters.' 
                    : 'No customer reviews available yet.'}
                </div>
              )}
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