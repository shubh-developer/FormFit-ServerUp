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
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
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
          {/* Fallback image if video fails */}
          <img 
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Spa background" 
            className="w-full h-[120%] object-cover opacity-40"
            style={{ display: 'none' }}
            onError={(e) => { e.currentTarget.style.display = 'block'; }}
          />
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

      {/* Chapter 2: Our Journey */}
      <section className="story-section min-h-screen flex items-center py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" style={{ transform: `translateY(${Math.max(0, (scrollY - 800) * 0.1)}px)` }}>
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
                Chapter 2: Our Journey
              </span>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Why Choose FormaFit?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every great story begins with a vision. Ours started with the belief that wellness should come to you, 
              not the other way around.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
            {[
              { icon: MapPin, title: 'Home Service', desc: 'No need to travel. We come to your home for maximum convenience and comfort.', color: 'blue' },
              { icon: Award, title: 'Certified Therapist', desc: 'Professional therapist with 5+ years of experience and proper certifications.', color: 'green' },
              { icon: Users, title: 'Certified Professional Trainer', desc: 'Expert fitness trainer with professional certifications for personalized training.', color: 'red' },
              { icon: Shield, title: 'Safe & Hygienic', desc: 'All equipment and oils are sanitized and safe for your health and wellness.', color: 'purple' },
              { icon: Star, title: 'Affordable Pricing', desc: 'Competitive rates with 10-20% lower than market prices for quality service.', color: 'orange' }
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
                <div className={`w-20 h-20 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}>
                  <item.icon className={`w-10 h-10 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Chapter 3: The Experience */}
      <section className="story-section min-h-screen flex items-center py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-yellow-400 bg-yellow-400/20 px-4 py-2 rounded-full border border-yellow-400/30">
                Chapter 3: The Experience
              </span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Stories of <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Transformation</span>
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Every session tells a story. Here are the authentic voices of those who found their sanctuary with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', rating: 5, comment: 'Amazing massage therapy! The therapist was professional and the service was exceptional. Highly recommend!', date: '2024-01-15' },
              { name: 'Mike Chen', rating: 5, comment: 'Best home massage service in the city. Very relaxing and therapeutic. Will definitely book again!', date: '2024-01-12' },
              { name: 'Priya Sharma', rating: 4, comment: 'Great experience overall. The therapist was skilled and punctual. Good value for money.', date: '2024-01-10' },
              { name: 'David Wilson', rating: 5, comment: 'Excellent fitness training session! The trainer was knowledgeable and helped me achieve my goals.', date: '2024-01-08' },
              { name: 'Lisa Rodriguez', rating: 5, comment: 'Professional service with great attention to detail. The massage was exactly what I needed after a long week.', date: '2024-01-05' },
              { name: 'Raj Patel', rating: 4, comment: 'Very satisfied with the service. Clean equipment and professional approach. Recommended!', date: '2024-01-03' }
            ].map((feedback, index) => (
              <div key={index} className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 p-8">

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-6 h-6 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current drop-shadow-sm' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        feedback.rating >= 4 ? 'bg-green-100 text-green-800 border border-green-200' :
                        feedback.rating >= 3 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {feedback.rating >= 4 ? '⭐ EXCELLENT' : feedback.rating >= 3 ? '👍 GOOD' : '📝 NEEDS IMPROVEMENT'}
                      </span>
                    </div>
                    <blockquote className="text-gray-700 mb-6 leading-relaxed text-lg italic font-medium">
                      &ldquo;{feedback.comment}&rdquo;
                    </blockquote>
                    <div className="flex items-center pt-4 border-t border-gray-100">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {feedback.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{feedback.name}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <span className="mr-2">✓ Verified Customer</span>
                          <span>• {new Date(feedback.date).toLocaleDateString('en-IN')}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl border border-white/20 p-8 flex items-center justify-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-4">💆‍♀️</div>
                      <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                      <p className="text-sm opacity-90">Your feedback helps us improve</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/feedback"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
            >
              Submit Your Feedback
              <Star className="w-5 h-5 ml-2" />
            </Link>
          </div>
          

        </div>
      </section>

      {/* Spa Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Our Spa Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immerse yourself in a world of relaxation and rejuvenation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <img 
                src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Relaxing spa environment" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Serene Environment</h3>
                <p className="text-sm opacity-90">Peaceful & calming atmosphere</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2">
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
            
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Spa accessories" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Premium Equipment</h3>
                <p className="text-sm opacity-90">Professional spa accessories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Therapist Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Your Therapist</h2>
              <p className="text-lg text-gray-600 mb-6">{THERAPIST_INFO.description}</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">{THERAPIST_INFO.experience} of experience</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Specialized in {THERAPIST_INFO.specialization}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Serving {THERAPIST_INFO.location}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-3">Certifications:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {THERAPIST_INFO.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Professional massage therapist" 
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 to-purple-100/90"></div>
              </div>
              <div className="relative text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-4xl font-bold">M</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{THERAPIST_INFO.name}</h3>
                <p className="text-gray-600 mb-4">{THERAPIST_INFO.specialization}</p>
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Rated 5.0 by 100+ clients</p>
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
