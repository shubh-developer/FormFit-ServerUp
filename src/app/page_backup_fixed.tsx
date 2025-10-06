'use client';

import Link from 'next/link';
import { SERVICES, THERAPIST_INFO } from '@/lib/data';
import { Clock, MapPin, Star, Shield, Users, Award, ArrowDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [floatingElements, setFloatingElements] = useState<any[]>([]);

  useEffect(() => {
    // Generate floating elements on client side only
    const elements = [...Array(8)].map((_, i) => ({
      width: Math.random() * 60 + 20,
      height: Math.random() * 60 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 2,
      parallaxSpeed: Math.random() * 0.3 + 0.1
    }));
    setFloatingElements(elements);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = document.querySelectorAll('.story-section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionBottom = sectionTop + (section as HTMLElement).offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch recent feedback
  const { data: recentFeedback } = useQuery({
    queryKey: ['recent-feedback'],
    queryFn: async () => {
      const response = await fetch('/api/feedback');
      const result = await response.json();
      if (result.success) {
        return result.feedback.slice(0, 6); // Show only 6 recent feedback
      }
      return [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Story Navigation */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="space-y-4">
          {['Welcome', 'Journey', 'Experience', 'Testimonials', 'Gallery'].map((label, index) => (
            <div key={index} className="flex items-center group cursor-pointer" onClick={() => {
              const section = document.querySelectorAll('.story-section')[index];
              section?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span className={`text-sm font-medium mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                currentSection === index ? 'text-yellow-400' : 'text-white'
              }`}>
                {label}
              </span>
              <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                currentSection === index 
                  ? 'bg-yellow-400 border-yellow-400 scale-125' 
                  : 'border-white/50 hover:border-white'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section - Chapter 1: Welcome */}
      <section className="story-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-[120%] object-cover opacity-60"
            poster="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-purple-600/60 to-indigo-700/60"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden" suppressHydrationWarning>
          {floatingElements.map((element, i) => (
            <div
              key={i}
              className="absolute bg-white/5 rounded-full animate-pulse"
              style={{
                width: `${element.width}px`,
                height: `${element.height}px`,
                left: `${element.left}%`,
                top: `${element.top}%`,
                animationDelay: `${element.animationDelay}s`,
                animationDuration: `${element.animationDuration}s`,
                transform: `translateY(${scrollY * element.parallaxSpeed}px)`
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium mb-4">
                🏆 Professional Home Massage Service
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Professional
              <br />
              <span className="text-yellow-300 drop-shadow-lg bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Massage Therapy & 💪 Fitness Trainer
              </span>
              <br />
              <span className="text-3xl md:text-4xl opacity-90">At Your Home</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
              Experience ultimate relaxation and wellness with our certified therapist and professional fitness trainer. 
              Transform your space into a sanctuary of healing, rejuvenation, and fitness excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link
                href="/book"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <span className="relative z-10">Book Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/services"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold border-2 border-white text-white hover:text-blue-600 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <span className="relative z-10">View Services</span>
                <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm opacity-80 mb-12">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Certified Personal Fitness Trainer & Certified Therapist</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Home Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>5-Star Rated</span>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="flex flex-col items-center text-white/70">
                <span className="text-sm mb-2">Discover Our Story</span>
                <ArrowDown className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Ultimate Relaxation?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your appointment today and enjoy professional massage therapy in the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Now
            </Link>
            <a
              href="tel:+919876543210"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Call +91 7875671417
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}