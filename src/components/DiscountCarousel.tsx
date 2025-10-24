'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DiscountCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it reaches zero
          days = 2;
          hours = 23;
          minutes = 45;
          seconds = 30;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: 1,
      title: "40% OFF Spa Services",
      subtitle: "Limited Time Offer",
      description: "Experience ultimate relaxation with our premium massage therapy at home",
      discount: "40%",
      originalPrice: "₹2000",
      discountedPrice: "₹1200",
      image: "/images/dark_wallpaper.jpg",
      gradient: "from-purple-600 to-pink-600",
      cta: "Book Spa Session"
    },
    {
      id: 2,
      title: "40% OFF Fitness Training",
      subtitle: "New Year Special",
      description: "Professional personal training sessions at your doorstep",
      discount: "40%",
      originalPrice: "₹1500",
      discountedPrice: "₹900",
      image: "/images/pair-gloves-boxing-sport.jpg",
      gradient: "from-orange-500 to-red-600",
      cta: "Start Training"
    },
    {
      id: 3,
      title: "40% OFF Combo Package",
      subtitle: "Best Value Deal",
      description: "Massage therapy + fitness training combo for complete wellness",
      discount: "40%",
      originalPrice: "₹3000",
      discountedPrice: "₹1800",
      image: "/images/still-life-yoga-equipment.jpg",
      gradient: "from-green-500 to-teal-600",
      cta: "Get Combo Deal"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden" suppressHydrationWarning>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #ff6b6b 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #4ecdc4 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-white bg-gradient-to-r from-yellow-400/20 to-orange-500/20 px-6 py-2 rounded-full border border-yellow-400/30">
              🎉 Exclusive Deals
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Special Offers
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Don't miss out on our exclusive discounts for premium wellness services
          </p>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <div className="flex items-center text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Limited Time Only</span>
            </div>
            <div className="flex items-center text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Save Up to 40%</span>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative h-[600px] sm:h-[650px] md:h-[550px] lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 transform translate-x-0' 
                  : index < currentSlide 
                    ? 'opacity-0 transform -translate-x-full' 
                    : 'opacity-0 transform translate-x-full'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`} />
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="w-full px-8 md:px-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
                    {/* Left Content */}
                    <div className="text-white space-y-4 sm:space-y-6 px-2 sm:px-0">
                      <div className="space-y-2">
                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                          {slide.subtitle}
                        </span>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                          {slide.title}
                        </h3>
                        <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                          {slide.description}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-center md:justify-start space-x-3 sm:space-x-4">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl font-bold line-through text-white/60">
                            {slide.originalPrice}
                          </div>
                          <div className="text-xs sm:text-sm text-white/80">Original Price</div>
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-yellow-400">→</div>
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                            {slide.discountedPrice}
                          </div>
                          <div className="text-xs sm:text-sm text-white/80">Special Price</div>
                        </div>
                      </div>

                      {/* Countdown Timer */}
                      {mounted && (
                        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-6">
                          <div className="text-center mb-3">
                            <span className="text-white/80 text-sm font-medium">Offer Ends In:</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 md:gap-2 text-center">
                            <div className="bg-white/20 rounded-lg p-1 md:p-2">
                              <div className="text-lg md:text-2xl font-bold text-white">{timeLeft.days.toString().padStart(2, '0')}</div>
                              <div className="text-xs text-white/80">Days</div>
                            </div>
                            <div className="bg-white/20 rounded-lg p-1 md:p-2">
                              <div className="text-lg md:text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                              <div className="text-xs text-white/80">Hours</div>
                            </div>
                            <div className="bg-white/20 rounded-lg p-1 md:p-2">
                              <div className="text-lg md:text-2xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                              <div className="text-xs text-white/80">Min</div>
                            </div>
                            <div className="bg-white/20 rounded-lg p-1 md:p-2">
                              <div className="text-lg md:text-2xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                              <div className="text-xs text-white/80">Sec</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <a 
                        href="/book"
                        className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl w-full sm:w-auto"
                      >
                        <span className="relative z-10">{slide.cta}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </div>

                    {/* Right Content - Discount Badge */}
                    <div className="flex justify-center md:justify-end">
                      <div className="relative">
                        {/* Animated Discount Badge */}
                        <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                          {/* Rotating Ring */}
                          <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/30 animate-spin-slow" />
                          
                          {/* Main Badge */}
                          <div className="absolute inset-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                            <div className="text-center text-white">
                              <div className="text-4xl md:text-5xl lg:text-6xl font-black leading-none">
                                {slide.discount}
                              </div>
                              <div className="text-lg md:text-xl font-bold">OFF</div>
                            </div>
                          </div>

                          {/* Floating Elements */}
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full animate-bounce flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-800">✨</span>
                          </div>
                          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                            <span className="text-xs font-bold text-white">💰</span>
                          </div>
                          <div className="absolute top-1/2 -left-4 w-4 h-4 bg-green-400 rounded-full animate-ping" />
                          <div className="absolute top-1/4 -right-6 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 hover:scale-110 border-2 border-white/30 shadow-xl z-10"
          >
            <ChevronLeft className="w-7 h-7" strokeWidth={3} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 hover:scale-110 border-2 border-white/30 shadow-xl z-10"
          >
            <ChevronRight className="w-7 h-7" strokeWidth={3} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-4 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-4 rounded-full transition-all duration-300 border-2 ${
                index === currentSlide 
                  ? 'bg-yellow-400 w-12 border-yellow-400 shadow-lg' 
                  : 'bg-white/20 w-4 border-white/40 hover:bg-white/40 hover:border-white/60'
              }`}
            />
          ))}
        </div>



        {/* Auto-play Indicator */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center space-x-2 text-white/60 hover:text-white/80 text-sm transition-colors duration-300 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <span>{isAutoPlaying ? '⏸️' : '▶️'}</span>
            <span>{isAutoPlaying ? 'Pause' : 'Play'} Auto-slide</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiscountCarousel;