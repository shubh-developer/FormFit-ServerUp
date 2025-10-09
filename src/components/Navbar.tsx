'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, UserPlus,LogIn } from 'lucide-react';
import { userSession } from '@/lib/userAuth';
import { adminSession } from '@/lib/adminAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';



const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
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
    { href: '/services', label: 'Services' },
    { href: '/book', label: 'Book Now' },
    { href: '/packages', label: 'Packages' },
    { href: '/about', label: 'About' },
    { href: '/inquiry', label: 'Contact' },
    { href: '/login', label: 'Loginnn', client: true, showWhenLoggedOut: true, icon: 'login' },
   // { href: '/register', label: 'Register', client: true, showWhenLoggedOut: true, icon: 'register' },
    { href: '/user-dashboard', label: 'My Profile', client: true, showWhenLoggedIn: true },
  ];

  const isActive = (href: string) => pathname === href;

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform">
              <Image
                src="/forma-fit-logo.jpg"
                alt="FormaFit Logo"
                width={270}
                height={48}
                className="h-12 w-auto rounded-xl object-cover border-2 border-white shadow-lg"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400">Home</Link>
              <Link href="/services" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400">Services</Link>
              <Link href="/book" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400">Book Now</Link>
              <Link href="/packages" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400">Packages</Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400">About</Link>
              <Link href="/inquiry" className="px-3 py-2 rounded-md text-sm font-medium text-yellow-400">Contact</Link>
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
              src="/FormaFit Logo with Running Figure.png"
              alt="FormaFit Logo"
              width={270}
              height={48}
              className="h-25 w-auto -ml-3 mt-5"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.showWhenLoggedIn && !isUserLoggedIn) return null;
              if (item.showWhenLoggedOut && isUserLoggedIn) return null;
              
              if (item.href === '/services') {
                return (
                  <div key={item.href} className="relative group">
                    <button
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-yellow-400"
                    >
                      {item.label}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link
                          href="/services"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Spa Services
                        </Link>
                        <div className="relative group/fitness">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
                            Fitness Training
                            <span className="text-xs">›</span>
                          </button>
                          <div className="absolute left-full top-0 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover/fitness:opacity-100 group-hover/fitness:visible transition-all duration-200">
                            <div className="py-1">
                              <Link
                                href="/fitness?type=online"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Online Training
                              </Link>
                              <Link
                                href="/fitness?type=offline"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Offline Training
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              if (item.href === '/book') {
                return (
                  <div key={item.href} className="relative group">
                    <button
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center text-yellow-400"
                    >
                      {item.label}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        <Link
                          href="/book"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Spa Booking
                        </Link>
                        <Link
                          href="/fitness-book"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Fitness Booking
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    isActive(item.href)
                      ? 'text-[#1565C0] bg-blue-50'
                      : item.icon === 'login'
                        ? 'text-[#2ECC71] hover:text-[#27AE60] hover:bg-green-50'
                        : item.icon === 'register'
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        : item.client
                        ? 'text-[#2ECC71] hover:text-[#27AE60] hover:bg-green-50'
                        : 'text-yellow-400'
                  }`}
                >
                  {item.icon === 'login' ? <img src="/images/user-6-48.png" className="w-7 h-7" alt="Login" /> : item.icon === 'register' }
                  {item.icon !== 'login' && item.icon !== 'register' && item.label}
                </Link>
              );
            })}
            

            
            {isUserLoggedIn && user && (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-[#2E7D32] hover:text-[#1B5E20] hover:bg-green-50 transition-colors">
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

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3  backdrop-blur-md border-t border-white/20">
              {navItems.map((item) => {
                if (item.showWhenLoggedIn && !isUserLoggedIn) return null;
                if (item.showWhenLoggedOut && isUserLoggedIn) return null;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center ${
                      isActive(item.href)
                        ? 'text-[#2980B9] bg-blue-50'
                        : item.icon === 'login'
                        ? 'text-[#2ECC71] hover:text-[#27AE60] hover:bg-green-50'
                        : item.icon === 'register'
                        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        : 'text-gray-700 hover:text-[#F1C40F] hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon === 'login' ? <UserPlus className="w-7 h-7 text-gray-800" />: item.icon === 'register' ? <FontAwesomeIcon icon={faRegistered} className="text-blue-500 w-full  h-full " />: null}  {/*Register  icon created but its not looking well if you want you can change in futue  */} 
                    {item.icon !== 'login' && item.icon !== 'register' && item.label}
                  </Link>
                );
              })}
              

              
              {isUserLoggedIn && user && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Welcome, {user.name}
                  </div>
                  <Link
                    href="/user-dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#2E7D32] hover:text-[#1B5E20] hover:bg-green-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#FF7043] hover:text-[#FF5722] hover:bg-orange-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;