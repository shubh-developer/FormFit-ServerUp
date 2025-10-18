'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SERVICES, THERAPIST_INFO } from '@/lib/data';
import { Clock, MapPin, Star, Shield, Users, Award, ArrowDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import SimpleReviewModal from '@/components/SimpleReviewModal';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [floatingElements, setFloatingElements] = useState<any[]>([]);
  const [currentTitle, setCurrentTitle] = useState('Our Wellness Experience 🌿');
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);


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

    // Title switching animation
    const titleInterval = setInterval(() => {
      setCurrentTitle(prev => 
        prev === 'Our Wellness Experience 🌿' 
          ? 'Our Fitness Experience 💪' 
          : 'Our Wellness Experience 🌿'
      );
    }, 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(titleInterval);
    };
  }, []);

  // Fetch recent feedback
  const { data: recentFeedback, refetch } = useQuery({
    queryKey: ['recent-feedback'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/feedback');
        const result = await response.json();
        
        if (result.success && result.feedback) {
          // Sort by created_at and return latest 6
          return result.feedback
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 6);
        }
        return [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
    },
    refetchInterval: 30000,
  });

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          refetch();
          return; // Success handled by modal
        } else {
          throw new Error(result.message || 'Failed to submit review');
        }
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      throw error; // Let modal handle the error
    }
  };



  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Story Navigation */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="space-y-4">
          {['Welcome', 'Journey', 'Experience', 'Gallery', 'Meet Your Therapist'].map((label, index) => (
            <div key={index} className="flex items-center group cursor-pointer" onClick={() => {
              const section = document.querySelectorAll('.story-section')[index];
              section?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span className={`text-sm font-medium mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
                currentSection === index ? 'text-yellow-400' : 'text-white'
              }`}>
                {label}
              </span>
              <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                currentSection === index 
                  ? 'bg-yellow-400 border-yellow-400 scale-125' 
                  : 'border-white/50 hover:border-white'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section - Chapter 1: Welcome */}
      <section className="story-section relative h-screen flex items-center justify-center bg-transparent text-white overflow-hidden">
        {/* Video Background */}
        <div className="fixed inset-0 bg-black z-[-1]">
          <video 
            autoPlay 
            muted
            loop 
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-60 min-w-full min-h-full"
          >
            <source src="/videos/Formafit_demo_video.mp4" type="video/mp4" />
          </video>


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
          <div className="text-center pt-20 sm:pt-16 md:pt-8 lg:pt-0">
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight px-2">
              <span className="text-[#FF9100] drop-shadow-lg">
               Professional Massage & Fitness Care<br /> Right at Your Home
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-4xl mx-auto leading-relaxed px-4">
              Experience ultimate relaxation and wellness with our certified therapist and professional fitness trainer. 
              Transform your space into a sanctuary of healing, rejuvenation, and fitness excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
              <Link
                href="/book"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-[#FF1744] to-[#FFD600] hover:from-[#D50000] hover:to-[#FFC107] rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl font-heading"
              >
                <span className="relative z-10">Book Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722] to-[#F9A825] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/services"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base sm:text-lg font-semibold border-2 border-white text-white hover:text-green-600 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <span className="relative z-10">View Services</span>
                <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 justify-items-center text-xs sm:text-sm opacity-90 mb-12 max-w-6xl mx-auto px-2">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full text-center">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Certified Fitness Trainer</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full text-center">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Certified Therapist</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full text-center">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Home Service</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full text-center">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm">5-Star Rated</span>
              </div>
            </div>
            

            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="flex flex-col items-center text-white/70">
                <span className="text-sm mb-2">Discover Our Story</span>
                <ArrowDown className="w-6 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Background for Chapters 2 & 3 */}
      <div style={{backgroundImage: 'url(/images/dark_wallpaper.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        {/* Chapter 2: Our Journey */}
        <section className="story-section min-h-screen flex items-center py-10 pb-5 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" style={{ transform: `translateY(${Math.max(0, (scrollY - 800) * 0.1)}px)` }}>
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-white bg-white/20 px-4 py-2 rounded-full">
                Chapter 2: Our Journey
              </span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose FormaFit?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Every great story begins with a vision. Ours started with the belief that wellness should come to you,
              not the other way around.
            </p>
          </div>
          
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
            {[
              { icon: MapPin, title: 'Home Service', desc: 'No need to travel. We come to your home for maximum convenience and comfort.', color: '[#00BCD4]' },
              { icon: Award, title: 'Certified Therapist', desc: 'Professional therapist with 5+ years of experience and proper certifications.', color: '[#FF1744]' },
              { icon: Users, title: 'Certified Professional Trainer', desc: 'Expert fitness trainer with professional certifications for personalized training, weight loss & muscle building programs.', color: '[#FFD600]' },
              { icon: Shield, title: 'Safe & Hygienic', desc: 'All equipment and oils are sanitized and safe for your health and wellness.', color: '[#00BCD4]' },
              { icon: Star, title: 'Affordable Pricing', desc: 'Competitive rates with 10-20% lower than market prices for quality service.', color: '[#FF1744]' }
            ].map((item, index) => (
              <div 
                key={index}
                className={`group text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-gray-100 animate-fade-in-up min-h-[280px] w-full max-w-md mx-auto`}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  opacity: scrollY > 600 ? 1 : 0,
                  transform: scrollY > 600 ? 'translateY(0)' : 'translateY(50px)',
                  transition: `all 0.8s ease ${index * 200}ms`
                }}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6 ${
                  item.color === '[#00BCD4]' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' :
                  item.color === '[#FF1744]' ? 'bg-gradient-to-br from-pink-500 to-pink-700' :
                  item.color === '[#FFD600]' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-4 group-hover:text-[#2980B9] transition-colors">{item.title === 'Certified Professional Trainer' ? 'Certified Professional Trainer 💪' : item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Mobile Grid Cards */}
          <div className="md:hidden grid grid-cols-2 gap-4 px-4">
            {[
              { icon: MapPin, title: 'Home Service', desc: 'No need to travel. We come to your home for maximum convenience and comfort.', color: '[#00BCD4]' },
              { icon: Award, title: 'Certified Therapist', desc: 'Professional therapist with 5+ years of experience and proper certifications.', color: '[#FF1744]' },
              { icon: Users, title: 'Certified Professional Trainer', desc: 'Expert fitness trainer with professional certifications for personalized training, weight loss & muscle building programs.', color: '[#FFD600]' },
              { icon: Shield, title: 'Safe & Hygienic', desc: 'All equipment and oils are sanitized and safe for your health and wellness.', color: '[#00BCD4]' },
              { icon: Star, title: 'Affordable Pricing', desc: 'Competitive rates with 10-20% lower than market prices for quality service.', color: '[#FF1744]' }
            ].map((item, index) => (
              <div 
                key={index}
                className={`text-center p-4 rounded-2xl bg-white shadow-lg border border-gray-100 min-h-[250px] ${index === 4 ? 'col-span-2 max-w-sm mx-auto' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  item.color === '[#00BCD4]' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' :
                  item.color === '[#FF1744]' ? 'bg-gradient-to-br from-pink-500 to-pink-700' :
                  item.color === '[#FFD600]' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-[#2C3E50] mb-2">{item.title === 'Certified Professional Trainer' ? 'Certified Professional Trainer 💪' : item.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


        {/* Chapter 3: The Experience */}
        <section className="story-section min-h-screen flex items-center py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-white bg-white/20 px-4 py-2 rounded-full border border-white/30">
                Chapter 3: The Experience
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 px-4 sm:px-0">
              Stories of <span className="bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">Transformation</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Every session tells a story. Here are the authentic voices of those who found their sanctuary with us.
            </p>
          </div>
          
          {recentFeedback && recentFeedback.length > 0 ? (
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0">
              {recentFeedback.slice(0, 3).map((feedback) => (
              <div key={feedback.id} className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto md:max-w-none">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 ${
                          i < feedback.rating ? 'text-[#F1C40F] fill-current drop-shadow-sm' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    feedback.rating >= 4 ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20' :
                    feedback.rating >= 3 ? 'bg-[#F1C40F]/10 text-[#F1C40F] border border-[#F1C40F]/20' :
                    'bg-[#E74C3C]/10 text-[#E74C3C] border border-[#E74C3C]/20'
                  }`}>
                    {feedback.rating >= 4 ? '⭐ EXCELLENT' : feedback.rating >= 3 ? '👍 GOOD' : '📝 NEEDS IMPROVEMENT'}
                  </span>
                </div>
                <blockquote className={`text-[#2C3E50] mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base md:text-lg italic font-medium ${
                  feedback.comment.length > 100 ? 'max-h-24 overflow-y-auto scrollbar-hide' : ''
                }`}>
                  &quot;{feedback.comment}&quot;
                </blockquote>
                <div className="flex items-center pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#2980B9] to-[#2ECC71] rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm sm:text-base md:text-xl">
                      {feedback.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2C3E50] text-sm sm:text-base md:text-lg truncate">{feedback.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center">
                      <span className="mr-0 sm:mr-2">✓ Verified Customer</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="sm:ml-2">{new Date(feedback.created_at).toLocaleDateString('en-IN')}</span>
                    </p>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/70 text-lg">No customer reviews available yet.</p>
              <p className="text-white/50 text-sm mt-2">Be the first to share your experience!</p>
            </div>
          )}
          
          {/* Mobile Stacked Reviews */}
          <div className="md:hidden relative h-80 flex justify-center items-center px-4">
            <div 
              className="relative w-full max-w-sm h-full"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                e.currentTarget.dataset.startX = touch.clientX.toString();
              }}
              onTouchEnd={(e) => {
                const startX = parseFloat(e.currentTarget.dataset.startX || '0');
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) {
                  const reviewsData = recentFeedback && recentFeedback.length > 0 ? recentFeedback : [];
                  if (diff > 0 && currentReviewIndex < reviewsData.length - 1) {
                    setCurrentReviewIndex(currentReviewIndex + 1);
                  } else if (diff < 0 && currentReviewIndex > 0) {
                    setCurrentReviewIndex(currentReviewIndex - 1);
                  }
                }
              }}
            >
              {recentFeedback && recentFeedback.length > 0 ? recentFeedback.map((feedback, index) => {
                const position = index - currentReviewIndex;
                return (
                  <div 
                    key={feedback.id} 
                    className="absolute w-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 p-6 transition-all duration-500 ease-out left-1/2 top-1/2"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${position * 15}px) translateY(${position * 15}px) scale(${1 - Math.abs(position) * 0.08}) rotateZ(${position * 2}deg)`,
                      zIndex: 10 - Math.abs(position),
                      opacity: position === 0 ? 1 : 0.6,
                      display: Math.abs(position) > 2 ? 'none' : 'block',
                      boxShadow: position === 0 ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < feedback.rating ? 'text-amber-400 fill-current drop-shadow-lg' : 'text-gray-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        feedback.rating >= 4 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        feedback.rating >= 3 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {feedback.rating >= 4 ? '⭐ EXCELLENT' : feedback.rating >= 3 ? '👍 GOOD' : '📝 NEEDS IMPROVEMENT'}
                      </span>
                    </div>
                    <blockquote className={`text-gray-700 mb-6 leading-relaxed text-base italic font-medium relative ${
                      feedback.comment.length > 100 ? 'max-h-32 overflow-y-auto scrollbar-hide' : ''
                    }`}>
                      <span className="text-4xl text-gray-300 absolute -top-2 -left-2 z-10">&ldquo;</span>
                      <div className="pl-6 pr-6">
                        {feedback.comment}
                      </div>
                      <span className="text-4xl text-gray-300 absolute -bottom-4 -right-2 z-10">&rdquo;</span>
                    </blockquote>
                    <div className="flex items-center pt-4 border-t border-gray-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {feedback.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-base truncate">{feedback.name}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <span className="inline-flex items-center mr-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Verified Customer
                          </span>
                          <span>{new Date(feedback.created_at).toLocaleDateString('en-IN')}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <p className="text-lg mb-2">No reviews available yet</p>
                    <p className="text-sm">Be the first to share your experience!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#2980B9] to-[#2ECC71] text-white rounded-xl hover:from-[#1A5276] hover:to-[#27AE60] transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
            >
              Write a Review
              <Star className="w-5 h-5 ml-2" />
            </button>
            <Link
              href="/feedback"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-[#b7d251] transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              View All Reviews
            </Link>
          </div>
        </div>
        </section>
      </div>

      {/* Combined Background for Gallery & Meet Your Therapist */}
      <div className="relative" style={{backgroundImage: 'url(/images/abovefooter_.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(63, 63, 63, 1), rgba(0, 0, 0, 1))'}}></div>
        
        {/* Gallery Section */}
        <section className="story-section py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 transition-all duration-500">
              {currentTitle}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Immerse yourself in a world of relaxation and rejuvenation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* First 4 cards always visible */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 0;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className={`relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180`} style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(0) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Spa */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Relaxing spa environment" 
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Serene Environment</h3>
                    <p className="text-sm opacity-90">Peaceful & calming atmosphere</p>
                  </div>
                </div>
                {/* Back side - Outdoor Training */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="/icons/young-people-practicing-sport-outdoor.jpg" 
                    alt="Young people practicing sport outdoor" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Outdoor Training 🏃‍♂️</h3>
                    <p className="text-sm opacity-90">Fresh air fitness sessions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 1;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(1) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Premium Oils */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Premium massage oils" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Premium Oils</h3>
                    <p className="text-sm opacity-90">Natural & therapeutic oils</p>
                  </div>
                </div>
                {/* Back side - Family Fitness */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://img.freepik.com/free-photo/woman-kid-training-together-full-shot_23-2148973670.jpg?semt=ais_incoming&w=740&q=80" 
                    alt="Family outdoor fitness activities" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Family Fitness 👨‍👩‍👧</h3>
                    <p className="text-sm opacity-90">Training together activities</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 2;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(2) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Expert Techniques */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Professional massage therapy" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Expert Techniques</h3>
                    <p className="text-sm opacity-90">Professional massage therapy</p>
                  </div>
                </div>
                {/* Back side - Fitness Training */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtCvfnfzVu60vsMo3-kSbG9SbBCYCqlC1RYw&s" 
                    alt="Fitness training techniques" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Fitness Training 🏋️</h3>
                    <p className="text-sm opacity-90">Professional workout techniques</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 3;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(3) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Aromatherapy */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Aromatherapy session" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Aromatherapy</h3>
                    <p className="text-sm opacity-90">Essential oil healing</p>
                  </div>
                </div>
                {/* Back side - HIIT Training */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="HIIT training session" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">HIIT Training 🔥</h3>
                    <p className="text-sm opacity-90">High-intensity workouts</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop: Always show all cards */}
            <div className="hidden md:block group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 4;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(4) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Complete Wellness */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Relaxation and wellness" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Complete Wellness Experience</h3>
                    <p className="text-sm opacity-90">Holistic approach to health and relaxation</p>
                  </div>
                </div>
                {/* Back side - Senior Fitness */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://burst.shopifycdn.com/photos/women-reach-up.jpg?width=1200&format=pjpg&exif=0&iptc=0" 
                    alt="Women fitness stretching exercise" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Group Fitness 👯♀️</h3>
                    <p className="text-sm opacity-90">Women&apos;s fitness & stretching</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 5;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(5) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Outdoor Workouts */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://cdn-ilbapaf.nitrocdn.com/ZmMiMYiblsIwVjzNuftoXuWhTPTuQyyC/assets/images/optimized/rev-9e6f186/wod.guru/wp-content/uploads/2025/01/7Outdoor-Workout-Ideas-to-Keep-Your-Gym-Offer-Interesting-1024x640.jpg" 
                    alt="Outdoor workout activities" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Outdoor Workouts 🌳</h3>
                    <p className="text-sm opacity-90">Fresh air fitness activities</p>
                  </div>
                </div>
                {/* Back side - Premium Equipment */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Spa accessories" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Premium Equipment</h3>
                    <p className="text-sm opacity-90">Professional spa accessories</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 6;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(6) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Strength Training */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Strength training" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Strength Training 💪</h3>
                    <p className="text-sm opacity-90">Build muscle & power</p>
                  </div>
                </div>
                {/* Back side - Yoga & Meditation */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Yoga and meditation" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Yoga & Meditation</h3>
                    <p className="text-sm opacity-90">Mind-body wellness</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile: Show with toggle */}
            {showAllGallery && (
              <div className="md:hidden group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 7;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(7) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Complete Wellness */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Relaxation and wellness" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Complete Wellness Experience</h3>
                    <p className="text-sm opacity-90">Holistic approach to health and relaxation</p>
                  </div>
                </div>
                {/* Back side - Senior Fitness */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://burst.shopifycdn.com/photos/women-reach-up.jpg?width=1200&format=pjpg&exif=0&iptc=0" 
                    alt="Women fitness stretching exercise" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">Group Fitness 👯♀️</h3>
                    <p className="text-sm opacity-90">Women&apos;s fitness & stretching</p>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {showAllGallery && (
            <div className="md:hidden group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 8;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(8) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Outdoor Workouts */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://cdn-ilbapaf.nitrocdn.com/ZmMiMYiblsIwVjzNuftoXuWhTPTuQyyC/assets/images/optimized/rev-9e6f186/wod.guru/wp-content/uploads/2025/01/7Outdoor-Workout-Ideas-to-Keep-Your-Gym-Offer-Interesting-1024x640.jpg" 
                    alt="Outdoor workout activities" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Outdoor Workouts 🌳</h3>
                    <p className="text-sm opacity-90">Fresh air fitness activities</p>
                  </div>
                </div>
                {/* Back side - Premium Equipment */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Spa accessories" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Premium Equipment</h3>
                    <p className="text-sm opacity-90">Professional spa accessories</p>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {showAllGallery && (
            <div className="md:hidden group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => {
              const cardId = 9;
              setFlippedCards(prev => {
                const newSet = new Set(prev);
                if (newSet.has(cardId)) {
                  newSet.delete(cardId);
                } else {
                  newSet.add(cardId);
                }
                return newSet;
              });
            }}>
              <div className="relative w-full h-64 transition-transform duration-700 group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d', transform: `${flippedCards.has(9) ? 'rotateY(180deg)' : ''}` }}>
                {/* Front side - Strength Training */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Strength training" 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Strength Training 💪</h3>
                    <p className="text-sm opacity-90">Build muscle & power</p>
                  </div>
                </div>
                {/* Back side - Yoga & Meditation */}
                <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Yoga and meditation" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">Yoga & Meditation</h3>
                    <p className="text-sm opacity-90">Mind-body wellness</p>
                  </div>
                </div>
              </div>
            </div>
            )}
            
          </div>
          
          {/* Show More/Less Button - Mobile Only */}
          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20"
            >
              {showAllGallery ? 'Show Less' : 'Show More'}
              <svg 
                className={`w-5 h-5 ml-2 transition-transform duration-300 ${showAllGallery ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
        </section>

        {/* Meet Your Therapist Section */}
        <section className="story-section py-10 relative z-10 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Meet Your Therapist</h2>
              <p className="text-lg text-white/90 mb-6">{THERAPIST_INFO.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-white mr-3" />
                  <span className="text-white/90">{THERAPIST_INFO.experience} of experience</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-white mr-3" />
                  <span className="text-white/90">Specialized in {THERAPIST_INFO.specialization}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-white mr-3" />
                  <span className="text-white/90">Serving {THERAPIST_INFO.location}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-semibold text-white mb-3">Certifications:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {THERAPIST_INFO.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      <span className="text-sm text-white/90">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-[#26A69A]/10 to-[#1565C0]/10 rounded-lg p-8 overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src="/icons/patient-doing-physical-rehabilitation-helped-by-therapists.jpg" 
                  alt="Patient doing physical rehabilitation helped by therapists" 
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#26A69A]/10 to-[#1565C0]/10"></div>
              </div>
              <div className="relative text-center">
                <div className="w-32 h-32 bg-black rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-orange-500 shadow-lg p-4">
                  <Image
                    src="/images/forma-fit-logo.png"
                    alt="FormaFit Logo"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Therapeutic Massage & Personal Fitness Training</h3>
                <p className="text-white mb-4">{THERAPIST_INFO.specialization}</p>
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F1C40F] fill-current" />
                  ))}
                </div>
                <p className="text-sm text-white">Rated 5.0 by 100+ clients</p>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-10 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Ultimate Relaxation?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Book your appointment today and enjoy professional massage therapy in the comfort of your home.
          </p>
          <div className="flex flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/book"
              className="bg-gradient-to-r from-[#FF1744] to-[#FFD600] hover:from-[#D50000] hover:to-[#FFC107] text-white px-4 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-lg font-semibold transition-colors flex-1 sm:flex-none max-w-[140px] sm:max-w-none text-center"
            >
              Book Now
            </Link>
            <a
              href="https://wa.me/917776948229?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20massage%20therapy%20and%20fitness%20training%20services.%20Could%20you%20please%20provide%20more%20information%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-4 py-3 sm:px-8 sm:py-4 rounded-lg text-sm sm:text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors flex-1 sm:flex-none max-w-[140px] sm:max-w-none text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <SimpleReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}