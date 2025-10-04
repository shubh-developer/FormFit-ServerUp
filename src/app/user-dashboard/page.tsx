'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Phone, Mail, User, LogOut } from 'lucide-react';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setBookings(data.bookings || []);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear browser cache and redirect
    window.location.replace('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">My Wellness Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Your personal spa sanctuary</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-amber-600 font-medium">✨ Welcome to your sanctuary!</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 mr-3" />
                {user?.email}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4 mr-3" />
                {user?.phone}
              </div>
              {user?.address && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-3" />
                  {user.address}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="text-amber-500 mr-2">🌟</span>
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/book')}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                🌸 Book New Session
              </button>
              <button
                onClick={() => router.push('/services')}
                className="w-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 py-4 px-6 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all duration-300 border border-amber-200 dark:border-amber-700 font-medium"
              >
                💆♀️ View Services
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="w-full bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 py-4 px-6 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all duration-300 border border-orange-200 dark:border-orange-700 font-medium"
              >
                💬 Contact Support
              </button>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="text-amber-500 mr-2">📊</span>
              Your Wellness Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Bookings</span>
                <span className="font-semibold text-gray-900 dark:text-white">{bookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Completed Sessions</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {bookings.filter(b => b.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Upcoming Sessions</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="px-8 py-6 border-b border-amber-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="text-amber-500 mr-3">📅</span>
              Recent Bookings
            </h3>
          </div>
          <div className="p-6">
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="border border-amber-200 dark:border-gray-600 rounded-xl p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{booking.service_type}</h4>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(booking.date_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(booking.date_time).toLocaleTimeString()}
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        booking.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' :
                        booking.status === 'confirmed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">No wellness sessions yet</p>
                <button
                  onClick={() => router.push('/book')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium text-lg"
                >
                  🌸 Book Your First Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}