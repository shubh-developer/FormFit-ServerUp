'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, User, Crown, Shield } from 'lucide-react';

export default function MasterLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        router.push('/master-dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black" suppressHydrationWarning>
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Executive office background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-gray-900/90 to-black/80"></div>
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/20 relative">
              <Crown className="h-12 w-12 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-light text-white mb-4 tracking-wide">
              Master Access
            </h2>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-4">
              Administrative Portal
            </h3>
            <p className="text-gray-200 mb-2">
              Secure access to system administration
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-300">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Protected by enterprise security</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <form className="space-y-6" onSubmit={handleSubmit} suppressHydrationWarning>
              <div className="space-y-4" suppressHydrationWarning>
                <div suppressHydrationWarning>
                  <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                    Administrator Username
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-yellow-300" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none relative block w-full px-3 py-4 pl-10 bg-white/10 backdrop-blur-sm border border-white/30 placeholder-gray-300 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter admin username"
                      value={formData.username}
                      onChange={handleInputChange}
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div suppressHydrationWarning>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Master Password
                  </label>
                  <div className="relative" suppressHydrationWarning>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-yellow-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-3 py-4 pl-10 pr-10 bg-white/10 backdrop-blur-sm border border-white/30 placeholder-gray-300 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter master password"
                      value={formData.password}
                      onChange={handleInputChange}
                      suppressHydrationWarning
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      suppressHydrationWarning
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-yellow-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-yellow-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/20 border border-red-400/30 p-4 backdrop-blur-sm">
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg tracking-wide hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl border border-yellow-400/20 backdrop-blur-sm relative overflow-hidden"
                  suppressHydrationWarning
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Crown className="w-5 h-5 mr-2" />
                      Access Control Panel
                    </div>
                  )}
                </button>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    System Online
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Encrypted
                  </div>
                </div>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white font-light transition-colors text-lg"
                >
                  ← Return to Main Site
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}