'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Calendar, Heart, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: '',
    medicalConditions: '',
    allergies: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth,
          emergencyContact: formData.emergencyContact,
          medicalConditions: formData.medicalConditions,
          allergies: formData.allergies,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registration successful! You can now sign in.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          address: '',
          dateOfBirth: '',
          emergencyContact: '',
          medicalConditions: '',
          allergies: '',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err: any) => `${err.path?.[0] || 'Field'}: ${err.message}`).join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden -mt-17">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Refreshing spa massage table with towels and essential oils" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white/20">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-light text-white mb-4 tracking-wide">
              Join Our Wellness Community
            </h1>
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 mb-6">
              FormaFit Therapy
            </h2>
            <p className="text-lg text-gray-200 mb-6 font-light max-w-md mx-auto">
              Experience professional massage therapy and holistic wellness treatments in the comfort of your home
            </p>
            <p className="text-gray-300">
              Already a member?{' '}
              <Link
                href="/login"
                className="text-amber-300 hover:text-amber-200 transition-colors font-medium underline decoration-amber-300/50"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
            <div className="relative z-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-light text-white mb-4 text-center lg:text-left">
                    <span className="text-amber-300">🌟</span> Basic Information
                  </h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-amber-300" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="appearance-none relative block w-full px-3 py-3 pl-10 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address
                    </label>
                    <div className="mt-1 relative">
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
                    <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                      Phone Number
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-amber-300" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        maxLength={10}
                        className="appearance-none relative block w-full px-3 py-3 pl-10 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                        placeholder="Enter your phone number (10 digits)"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-amber-300" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                        placeholder="Create a password"
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
                    <div className="text-xs text-red-300 mt-1">
                      Must contain: 8+ chars, uppercase, lowercase, number, special char (@$!%*?&)
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                      Confirm Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-amber-300" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-amber-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-amber-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Wellness Profile */}
                <div className="space-y-4">
                  <h3 className="text-xl font-light text-white mb-4 text-center lg:text-left">
                    <span className="text-amber-300">✨</span> Wellness Profile
                    <div className="text-sm font-normal text-gray-300 mt-1">(Optional for personalized care)</div>
                  </h3>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      className="appearance-none relative block w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15 resize-none"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      className="appearance-none relative block w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-white mb-2">
                      <Heart className="w-4 h-4 inline mr-2" />
                      Emergency Contact
                    </label>
                    <input
                      id="emergencyContact"
                      name="emergencyContact"
                      type="text"
                      maxLength={10}
                      className="appearance-none relative block w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15"
                      placeholder="Emergency contact name and phone"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="medicalConditions" className="block text-sm font-medium text-white mb-2">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Medical Conditions
                    </label>
                    <textarea
                      id="medicalConditions"
                      name="medicalConditions"
                      rows={2}
                      className="appearance-none relative block w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15 resize-none"
                      placeholder="Any medical conditions we should know about"
                      value={formData.medicalConditions}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-white mb-2">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Allergies
                    </label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      rows={2}
                      className="appearance-none relative block w-full px-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-gray-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-300 hover:bg-white/15 resize-none"
                      placeholder="Any allergies we should know about"
                      value={formData.allergies}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/20 border border-red-400/30 p-4 backdrop-blur-sm">
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              )}

              {success && (
                <div className="rounded-xl bg-green-500/20 border border-green-400/30 p-4 backdrop-blur-sm">
                  <div className="text-sm text-green-200">{success}</div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white py-6 px-8 rounded-2xl font-medium text-lg tracking-wide hover:from-amber-700 hover:via-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl border border-amber-400/20 backdrop-blur-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating account...
                    </div>
                  ) : (
                    '🌸 Begin My Wellness Journey'
                  )}
                </button>
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white font-light transition-colors text-lg"
                >
                  ← Return to Sanctuary
                </Link>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}