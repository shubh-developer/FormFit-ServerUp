'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Edit3, Save, X, MapPin, Heart, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { userSession } from '@/lib/userAuth';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  allergies?: string;
  preferences?: any;
  isActive: boolean;
  emailVerified: boolean;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id: number;
  service_type: string;
  oil_type: string;
  date_time: string;
  status: string;
  payment_status: string;
  created_at: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: '',
    medicalConditions: '',
    allergies: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      if (!userSession.isAuthenticated()) {
        router.push('/login');
        return;
      }

      await fetchProfile();
    };

    checkAuth();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const token = userSession.getToken();
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setRecentBookings(data.recentBookings || []);
        setEditForm({
          name: data.user.name,
          phone: data.user.phone,
          address: data.user.address || '',
          dateOfBirth: data.user.dateOfBirth || '',
          emergencyContact: data.user.emergencyContact || '',
          medicalConditions: data.user.medicalConditions || '',
          allergies: data.user.allergies || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        if (response.status === 401) {
          userSession.removeToken();
          router.push('/login');
        } else {
          setError(data.message || 'Failed to load profile');
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      setError('An error occurred while loading your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
      emergencyContact: user?.emergencyContact || '',
      medicalConditions: user?.medicalConditions || '',
      allergies: user?.allergies || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    // Validate passwords if changing
    if (editForm.newPassword) {
      if (!editForm.currentPassword) {
        setError('Current password is required to change password');
        setIsSaving(false);
        return;
      }
      if (editForm.newPassword !== editForm.confirmPassword) {
        setError('New passwords do not match');
        setIsSaving(false);
        return;
      }
    }

    try {
      const token = userSession.getToken();
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          phone: editForm.phone,
          address: editForm.address,
          dateOfBirth: editForm.dateOfBirth,
          emergencyContact: editForm.emergencyContact,
          medicalConditions: editForm.medicalConditions,
          allergies: editForm.allergies,
          currentPassword: editForm.currentPassword || undefined,
          newPassword: editForm.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setEditForm({
          name: data.user.name,
          phone: data.user.phone,
          address: data.user.address || '',
          dateOfBirth: data.user.dateOfBirth || '',
          emergencyContact: data.user.emergencyContact || '',
          medicalConditions: data.user.medicalConditions || '',
          allergies: data.user.allergies || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('An error occurred while updating your profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    userSession.removeToken();
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your account information and view your booking history</p>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <p className="text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{user.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  rows={3}
                  value={editForm.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-gray-900">{user.address || 'Not provided'}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editForm.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Heart className="w-4 h-4 inline mr-2" />
                Emergency Contact
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContact"
                  value={editForm.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Emergency contact name and phone"
                />
              ) : (
                <p className="text-gray-900">{user.emergencyContact || 'Not provided'}</p>
              )}
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Medical Conditions
              </label>
              {isEditing ? (
                <textarea
                  name="medicalConditions"
                  rows={2}
                  value={editForm.medicalConditions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any medical conditions we should know about"
                />
              ) : (
                <p className="text-gray-900">{user.medicalConditions || 'None reported'}</p>
              )}
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Allergies
              </label>
              {isEditing ? (
                <textarea
                  name="allergies"
                  rows={2}
                  value={editForm.allergies}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any allergies we should know about"
                />
              ) : (
                <p className="text-gray-900">{user.allergies || 'None reported'}</p>
              )}
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Account Status
              </label>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                {user.emailVerified && (
                  <span className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Email Verified
                  </span>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Member Since
              </label>
              <p className="text-gray-900">{formatDate(user.created_at)}</p>
            </div>
          </div>

          {/* Password Change Section */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-4">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={editForm.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={editForm.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={editForm.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking.service_type.replace('-', ' ').toUpperCase()} - {booking.oil_type.replace('-', ' ').toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Date & Time:</span>
                      <p className="text-gray-900">{formatDate(booking.date_time)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Payment Status:</span>
                      <p className="text-gray-900">{booking.payment_status.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Booked On:</span>
                      <p className="text-gray-900">{formatDate(booking.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">📅</div>
              <p className="text-gray-500">No bookings yet</p>
              <p className="text-gray-400 text-sm">Your booking history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
