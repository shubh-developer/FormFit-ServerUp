'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { userSession } from '@/lib/userAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        userSession.setToken(data.token);
        userSession.setUser(data.user);
        
        console.log('Login successful, redirecting...');
        console.log('Token stored:', !!data.token);
        console.log('User data stored:', !!data.user);
        
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/user-dashboard';
        console.log('Redirecting to:', redirectUrl);
        
        window.location.href = redirectUrl;
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
    <div className="min-h-screen relative overflow-hidden" suppressHydrationWarning>
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Spa wellness background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-white/20">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-light text-white mb-4 tracking-wide">
              Welcome Back
            </h2>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-4">
              FormaFit Therapy
            </h3>
            <p className="text-gray-200 mb-2">
              Sign in to access your wellness journey
            </p>
            <p className="text-gray-300">
              New here?{' '}
              <Link
                href="/register"
                className="text-amber-300 hover:text-amber-200 transition-colors font-medium underline decoration-amber-300/50"
              >
                Create your account
              </Link>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8">
            <form className="space-y-6" onSubmit={handleSubmit} suppressHydrationWarning>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-amber-300" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none relative block w-full px-3 py-3 pl-10 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-amber-300" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-amber-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-amber-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/20 border border-red-400/30 p-4 backdrop-blur-sm">
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white py-4 px-6 rounded-xl font-medium text-lg tracking-wide hover:from-amber-700 hover:via-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl border border-amber-400/20 backdrop-blur-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in...
                    </div>
                  ) : (
                    '🌸 Enter Your Sanctuary'
                  )}
                </button>
              </div>

              <div className="text-center mt-6">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white font-light transition-colors text-lg"
                >
                  ← Return to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}