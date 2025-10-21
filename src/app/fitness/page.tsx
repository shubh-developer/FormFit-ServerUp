'use client';

import Link from 'next/link';
import { Clock, Star, CheckCircle, ArrowRight, MapPin, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, use } from 'react';

const FITNESS_SERVICES = [
  {
    id: 'personal-training',
    name: 'Personal Training',
    duration: 'Per Month ',
    price: 6299,
    description: 'One-on-one fitness training tailored to your goals and fitness level',
    benefits: [
      'Customized workout plans',
      'Proper form and technique guidance',
      'Goal-oriented training',
      'Motivation and accountability',
      'Injury prevention'
    ]
  },
  {
    id: 'strength-training',
    name: 'Strength Training',
    duration: 'Per Month',
    price: 5999,
    description: 'Build muscle strength and endurance with targeted resistance exercises',
    benefits: [
      'Increases muscle mass',
      'Improves bone density',
      'Boosts metabolism',
      'Enhances functional strength',
      'Better posture'
    ]
  },
  {
    id: 'cardio-fitness',
    name: 'Cardio Fitness',
    duration: 'Per Month',
    price: 5799,
    description: 'High-energy cardiovascular workouts to improve heart health and stamina',
    benefits: [
      'Improves cardiovascular health',
      'Burns calories effectively',
      'Increases stamina',
      'Reduces stress',
      'Better sleep quality'
    ]
  },
  {
    id: 'flexibility-mobility',
    name: 'Flexibility & Mobility',
    duration: 'Per Month',
    price: 5599,
    description: 'Stretching and mobility exercises to improve flexibility and range of motion',
    benefits: [
      'Improves flexibility',
      'Reduces muscle stiffness',
      'Better range of motion',
      'Injury prevention',
      'Enhanced performance'
    ]
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss Program',
    duration: 'Per Month',
    price: 6499,
    description: 'Comprehensive fitness program designed for effective and sustainable weight loss',
    benefits: [
      'Structured weight loss plan',
      'Nutrition guidance',
      'Fat burning workouts',
      'Progress tracking',
      'Long-term results'
    ]
  },
  {
    id: 'functional-training',
    name: 'Functional Training',
    duration: 'Per Month',
    price: 5899,
    description: 'Real-world movement patterns to improve daily life activities and sports performance',
    benefits: [
      'Improves daily activities',
      'Better balance and coordination',
      'Core strength development',
      'Sport-specific training',
      'Injury rehabilitation'
    ]
  },
  {
    id: 'muscle-gain',
    name: 'Muscle Gain Program',
    duration: 'Per Month',
    price: 6399,
    description: 'Specialized training program focused on building lean muscle mass and strength',
    benefits: [
      'Targeted muscle building',
      'Progressive overload training',
      'Nutrition guidance for gains',
      'Supplement recommendations',
      'Body composition tracking'
    ]
  }
];

export default function FitnessPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [expandedRows, setExpandedRows] = useState<{[key: number]: boolean}>({});
  const params = use(searchParams);
  const trainingType = params?.type;
  
  const toggleExpanded = (serviceIndex: number) => {
    const rowIndex = Math.floor(serviceIndex / 2);
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };
  
  const getPrice = (originalPrice: number) => {
    return trainingType === 'online' ? Math.round(originalPrice * 0.7) : originalPrice;
  };
  
  if (trainingType === 'online') {
    return (
      <div className="min-h-[100vh] relative -mt-16" style={{backgroundImage: 'url(/images/pair-gloves-boxing-sport.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll'}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Online Fitness Training</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Transform your fitness journey with our professional online personal training services via video calls.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
            {FITNESS_SERVICES.map((service, index) => {
              const rowIndex = Math.floor(index / 2);
              const isExpanded = expandedRows[rowIndex];
              
              return (
                <div key={service.id} className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden hover:animate-rgb-glow hover:animate-border-glow hover:scale-105 transition-all duration-500 flex flex-col h-full group animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="p-3 md:p-6 flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-0 leading-tight group-hover:text-orange-300 transition-colors duration-300">{service.name}</h3>
                      <div className="text-left md:text-right">
                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">₹{getPrice(service.price)}</div>
                        <div className="text-xs md:text-sm text-gray-400 flex items-center whitespace-nowrap group-hover:text-gray-300 transition-colors duration-300">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs md:text-base text-gray-300 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none group-hover:text-gray-200 transition-colors duration-300">{service.description}</p>
                    
                    <div className="mb-4 md:mb-6">
                      <h4 className="font-semibold text-white mb-2 text-sm md:text-base group-hover:text-orange-300 transition-colors duration-300">Benefits:</h4>
                      <div className="md:hidden">
                        <ul className="space-y-1">
                          {service.benefits.slice(0, isExpanded ? service.benefits.length : 3).map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start text-xs text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                              <CheckCircle className="w-3 h-3 text-orange-500 mr-1 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                              <span className="leading-tight">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        {service.benefits.length > 3 && (
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="flex items-center text-xs text-orange-500 mt-2 font-medium active:scale-95 transition-all duration-300 hover:text-orange-400"
                          >
                            {isExpanded ? (
                              <>
                                <span>Show Less</span>
                                <ChevronUp className="w-3 h-3 ml-1" />
                              </>
                            ) : (
                              <>
                                <span>+{service.benefits.length - 3} More</span>
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <ul className="hidden md:block space-y-1">
                        {service.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                            <CheckCircle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                            <span className="leading-tight">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-orange-200/30 pt-3 md:pt-4 mt-auto">
                      <Link
                        href={`/book?service=${service.id}&type=fitness&mode=online`}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm md:text-base shadow-lg"
                      >
                        <span className="hidden md:inline">Book Online Training</span>
                        <span className="md:hidden">Book Now</span>
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[100vh] relative -mt-16" style={{backgroundImage: 'url(/images/pair-gloves-boxing-sport.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll'}}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {trainingType === 'offline' ? 'Offline Fitness Training Services' : 'Our Fitness Training Services'}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Transform your fitness journey with our professional personal training services. 
            All sessions are conducted by our certified fitness trainer at your home or preferred location.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
          {FITNESS_SERVICES.map((service, index) => {
            const rowIndex = Math.floor(index / 2);
            const isExpanded = expandedRows[rowIndex];
            
            return (
              <div key={service.id} className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden hover:animate-rgb-glow hover:animate-border-glow hover:scale-105 transition-all duration-500 flex flex-col h-full group animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="p-3 md:p-6 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-0 leading-tight group-hover:text-orange-300 transition-colors duration-300">{service.name}</h3>
                    <div className="text-left md:text-right">
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">₹{getPrice(service.price)}</div>
                      <div className="text-xs md:text-sm text-gray-400 flex items-center whitespace-nowrap group-hover:text-gray-300 transition-colors duration-300">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs md:text-base text-gray-300 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none group-hover:text-gray-200 transition-colors duration-300">{service.description}</p>
                  
                  <div className="mb-4 md:mb-6">
                    <h4 className="font-semibold text-white mb-2 text-sm md:text-base group-hover:text-orange-300 transition-colors duration-300">Benefits:</h4>
                    <div className="md:hidden">
                      <ul className="space-y-1">
                        {service.benefits.slice(0, isExpanded ? service.benefits.length : 3).map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start text-xs text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                            <CheckCircle className="w-3 h-3 text-orange-500 mr-1 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                            <span className="leading-tight">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      {service.benefits.length > 3 && (
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="flex items-center text-xs text-orange-500 mt-2 font-medium active:scale-95 transition-all duration-300 hover:text-orange-400"
                        >
                          {isExpanded ? (
                            <>
                              <span>Show Less</span>
                              <ChevronUp className="w-3 h-3 ml-1" />
                            </>
                          ) : (
                            <>
                              <span>+{service.benefits.length - 3} More</span>
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <ul className="hidden md:block space-y-1">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                          <CheckCircle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-orange-200/30 pt-3 md:pt-4 mt-auto">
                    <Link
                      href={`/book?service=${service.id}&type=fitness`}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm md:text-base shadow-lg"
                    >
                      <span className="hidden md:inline">Book This Training</span>
                      <span className="md:hidden">Book Now</span>
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 p-4 md:p-8 mb-12 hover:animate-rgb-glow hover:animate-border-glow transition-all duration-500">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">Why Choose Our Fitness Training?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Certified Trainer</h3>
              <p className="text-gray-300">Professional fitness trainer with certifications and years of experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Home Training</h3>
              <p className="text-gray-300">Convenient training sessions at your home or preferred outdoor location.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Personalized Plans</h3>
              <p className="text-gray-300">Customized workout plans based on your fitness goals and current level.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}