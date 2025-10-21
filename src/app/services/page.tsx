'use client';

import Link from 'next/link';
import { SERVICES } from '@/lib/data';
import { Clock, Star, CheckCircle, ArrowRight, MapPin, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ServicesPage() {
  const [expandedRows, setExpandedRows] = useState<{[key: number]: boolean}>({});

  const toggleExpanded = (serviceIndex: number) => {
    const rowIndex = Math.floor(serviceIndex / 2);
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  return (
    <div className="min-h-[100vh] relative -mt-16" style={{backgroundImage: 'url(/images/still-life-yoga-equipment.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll'}}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Massage Services</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Choose from our range of professional massage therapies designed to provide relaxation, 
            pain relief, and overall wellness. All services are performed by our certified therapist.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
          {SERVICES.filter(service => ![
            'personal-training', 'strength-training', 'cardio-fitness', 
            'flexibility-mobility', 'weight-loss', 'functional-training', 'muscle-gain'
          ].includes(service.id)).map((service, index) => {
            const rowIndex = Math.floor(index / 2);
            const isExpanded = expandedRows[rowIndex];
            
            return (
              <div key={service.id} className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden hover:animate-rgb-glow hover:animate-border-glow hover:scale-105 transition-all duration-500 flex flex-col h-full group animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="p-3 md:p-6 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                    <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-0 leading-tight group-hover:text-orange-300 transition-colors duration-300">{service.name}</h3>
                    <div className="text-left md:text-right">
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">₹{service.price}</div>
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
                      href={`/book?service=${service.id}`}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm md:text-base shadow-lg"
                    >
                      <span className="hidden md:inline">Book This Service</span>
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
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">Why Choose Our Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional & Safe</h3>
              <p className="text-gray-300">Certified therapist with 5+ years of experience. All equipment sanitized.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Home Convenience</h3>
              <p className="text-gray-300">No travel needed. We come to your home for maximum comfort.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-300">High-quality oils and professional techniques for best results.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}