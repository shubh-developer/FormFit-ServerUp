'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, UserPlus } from 'lucide-react';
import { userSession } from '@/lib/userAuth';
import { adminSession } from '@/lib/adminAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    const checkUserAuth = () => {
      const isAuthenticated = userSession.isAuthenticated();
      const userData = userSession.getUser();
      const isAdminAuth = adminSession.isAuthenticated();
      setIsUserLoggedIn(isAuthenticated);
      setUser(userData);
      setIsAdminLoggedIn(isAdminAuth);
    };

    // Remove any dark mode classes
    document.documentElement.classList.remove('dark');

    checkUserAuth();
    
    const interval = setInterval(checkUserAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    userSession.removeToken();
    setIsUserLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };



  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/packages', label: 'Packages' },
    { href: '/book', label: 'Book Now' },
    { href: '/login', label: 'Login', client: true, showWhenLoggedOut: true, icon: 'login' },
    { href: '/register', label: 'Register', client: true, showWhenLoggedOut: true, icon: 'register' },
    { href: '/inquiry', label: 'Contact' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/fitness', label: 'Fitness Training' },
    { href: '/user-dashboard', label: 'My Profile', client: true, showWhenLoggedIn: true },
  ];

  const isActive = (href: string) => pathname === href;

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform">
              <Image
                src="/images/forma-fit-logo.png"
                alt="FormaFit Logo"
                width={400}
                height={48}
                className="h-16 w-auto rounded-xl object-cover shadow-lg"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-[#BBBBBE] hover:text-[#E8E8E9]">Home</Link>
              <Link href="/services" className="px-3 py-2 rounded-md text-sm font-medium text-[#BBBBBE] hover:text-[#E8E8E9]">Services</Link>
              <Link href="/book" className="px-3 py-2 rounded-md text-sm font-medium text-[#BBBBBE] hover:text-[#E8E8E9]">Book Now</Link>
              <Link href="/packages" className="px-3 py-2 rounded-md text-sm font-medium text-[#BBBBBE] hover:text-[#E8E8E9]">Packages</Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-[#BBBBBE] hover:text-[#E8E8E9]">About</Link>
              <Link href="/inquiry" className="px-3 py-2 rounded-md text-sm font-medium text-[#BBBBBE] hover:text-[#E8E8E9]">Contact</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center hover:scale-105 transition-transform">
            <Image
              src="/images/forma-fit-logo.png"
              alt="FormaFit Logo"
              width={400}
              height={48}
              className="h-18 w-auto rounded-xl object-cover shadow-lg"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {/* Home */}
            <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-[#E8E8E9]' : 'text-[#BBBBBE] hover:text-[#E8E8E9]'}`}>
              Home
            </Link>
            
            {/* Services */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-[#BBBBBE] hover:text-[#E8E8E9]">
                Services
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Spa Services
                  </Link>
                  <div className="relative group/fitness">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
                      Fitness Training
                      <span className="text-xs">›</span>
                    </button>
                    <div className="absolute left-full top-0 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover/fitness:opacity-100 group-hover/fitness:visible transition-all duration-200">
                      <div className="py-1">
                        <Link href="/fitness?type=online" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Online Training
                        </Link>
                        <Link href="/fitness?type=offline" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Offline Training
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Book Now */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-[#BBBBBE] hover:text-[#E8E8E9]">
                Book Now
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/book" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Spa Booking
                  </Link>
                  <Link href="/fitness-book" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Fitness Booking
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Packages */}
            <Link href="/packages" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/packages') ? 'text-[#E8E8E9]' : 'text-[#BBBBBE] hover:text-[#E8E8E9]'}`}>
              Packages
            </Link>
            
            {/* About */}
            <Link href="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about') ? 'text-[#E8E8E9]' : 'text-[#BBBBBE] hover:text-[#E8E8E9]'}`}>
              About
            </Link>
            
            {/* Contact */}
            <Link href="/inquiry" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/inquiry') ? 'text-[#E8E8E9]' : 'text-[#BBBBBE] hover:text-[#E8E8E9]'}`}>
              Contact
            </Link>
            
            {/* Register Icon */}
            {!isUserLoggedIn && (
              <Link href="/register" className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-[#BBBBBE] hover:text-[#E8E8E9]">
                <img src="/images/user-6-48.png" className="w-7 h-7" alt="Register" />
              </Link>
            )}
            
            {/* User Profile Dropdown */}
            {isUserLoggedIn && user && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-[#BBBBBE] hover:text-[#E8E8E9] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/user-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-[#FF7043] hover:bg-orange-50"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-400 focus:outline-none focus:text-yellow-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-auto max-h-[90vh] w-72 max-w-[80vw] backdrop-blur-2xl rounded-l-2xl transform transition-all duration-300 overflow-hidden">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg">
                    <img src="/images/Forma_3.png" alt="FormaFit Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-wide">FormaFit</h3>
                    <p className="text-xs text-gray-300 font-medium">Professional Wellness</p>
                    <p className="text-xs text-gray-400 font-medium">Massage & Fitness Care</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all duration-200 hover:scale-105"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-5 max-h-[calc(90vh-80px)]">
                {/* Our Services Section */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold text-sm mb-3 px-2">Our Services</h3>
                  <div className="space-y-2">
                    <Link
                      href="/services"
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/20 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-cyan-500/30 rounded-lg flex items-center justify-center">
                        <span className="text-cyan-300 text-sm">💆</span>
                      </div>
                      <span className="font-medium text-white">Spa Services</span>
                    </Link>
                    
                    <div>
                      <button
                        onClick={() => setExpandedMenu(expandedMenu === 'services-fitness' ? null : 'services-fitness')}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/20 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-orange-300 text-sm">💪</span>
                          </div>
                          <span className="font-medium text-white">Fitness Training</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-300 transform transition-transform duration-200 ${expandedMenu === 'services-fitness' ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                        </svg>
                      </button>
                      {expandedMenu === 'services-fitness' && (
                        <div className="mt-2 ml-4 space-y-1">
                          <Link
                            href="/fitness?type=online"
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setExpandedMenu(null);
                            }}
                          >
                            <div className="w-5 h-5 bg-green-500/20 rounded flex items-center justify-center">
                              <span className="text-green-400 text-xs">🌐</span>
                            </div>
                            <span className="text-gray-300 text-sm">Online Training</span>
                          </Link>
                          <Link
                            href="/fitness?type=offline"
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setExpandedMenu(null);
                            }}
                          >
                            <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center">
                              <span className="text-purple-400 text-xs">🏋️</span>
                            </div>
                            <span className="text-gray-300 text-sm">Offline Training</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
              {navItems.map((item) => {
                if (item.showWhenLoggedIn && !isUserLoggedIn) return null;
                if (item.showWhenLoggedOut && isUserLoggedIn) return null;
                
                // Skip services and fitness as they're now in the Our Services section
                if (item.href === '/services' || item.href === '/fitness') {
                  return null;
                }
                
                const getItemIcon = (href: string, icon?: string) => {
                  if (icon === 'login') return '👤';
                  if (icon === 'register') return '📝';
                  switch (href) {
                    case '/': return '🏠';
                    case '/book': return '📅';
                    case '/packages': return '📦';
                    case '/about': return 'ℹ️';
                    case '/inquiry': return '📞';
                    case '/user-dashboard': return '👨‍💼';
                    default: return '📄';
                  }
                };
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-[#2980B9] to-[#2ECC71] text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      isActive(item.href) ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      <span className="text-xs">{getItemIcon(item.href, item.icon)}</span>
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
              

              
                </div>
                
                {/* User Section */}
                {isUserLoggedIn && user && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-[#2980B9] to-[#2ECC71] rounded-lg text-white mb-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-white/80 text-xs">Welcome back!</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Link
                        href="/user-dashboard"
                        className="flex items-center space-x-3 p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center">
                          <span className="text-blue-400 text-xs">👤</span>
                        </div>
                        <span className="font-medium text-white text-sm">View Profile</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 p-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                      >
                        <div className="w-6 h-6 bg-red-500/20 rounded-md flex items-center justify-center">
                          <LogOut className="w-3 h-3 text-red-400" />
                        </div>
                        <span className="font-medium text-red-400 text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;