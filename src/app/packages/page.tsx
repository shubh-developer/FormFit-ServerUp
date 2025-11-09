'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SERVICES } from '@/lib/data';
import { Check, Clock, Users, Star } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPackages(data.packages.filter((pkg: any) => pkg.status === 'active'));
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-[100vh] relative -mt-16" style={{backgroundImage: 'url(/images/still-life-yoga-equipment.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'scroll'}}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Service Packages</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Choose from our affordable packages designed for regular wellness maintenance.
            Save money while maintaining your health and relaxation routine.
          </p>
        </div>

        {/* Massage Packages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Massage Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
              <div className="col-span-2 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4 text-white/90">Loading packages...</p>
              </div>
            ) : packages.filter((pkg: any) => pkg.package_type === 'massage').length > 0 ? packages.filter((pkg: any) => pkg.package_type === 'massage').map((pkg: any, index: number) => (
            <div key={pkg.id} className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden hover:animate-rgb-glow hover:animate-border-glow hover:scale-105 transition-all duration-500 flex flex-col h-full group animate-fade-in-up relative" style={{animationDelay: `${index * 100}ms`}}>
              {/* Package Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                    <p className="text-orange-100">{pkg.description}</p>
                  </div>
                  {pkg.discount_percentage > 0 && (
                    <div className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {pkg.discount_percentage}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div className="p-3 md:p-6 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                  <div className="text-center md:text-left mb-3 md:mb-0">
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1">₹{pkg.discounted_price}</div>
                    {pkg.original_price && (
                      <div className="text-lg md:text-xl text-gray-500 line-through font-semibold">₹{pkg.original_price}</div>
                    )}
                    <div className="text-xs md:text-sm text-gray-400 flex items-center justify-center md:justify-start whitespace-nowrap group-hover:text-gray-300 transition-colors duration-300">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {pkg.validity_days} days
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-lg md:text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">{pkg.sessions} sessions</div>
                  </div>
                </div>

                <p className="text-xs md:text-base text-gray-300 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none group-hover:text-gray-200 transition-colors duration-300">{pkg.description}</p>

                <div className="mb-4 md:mb-6 flex-1">
                  <h4 className="font-semibold text-white mb-2 text-sm md:text-base group-hover:text-orange-300 transition-colors duration-300">Benefits:</h4>
                  <div className="md:hidden">
                    <ul className="space-y-1">
                      {[
                        `${pkg.sessions} massage sessions`,
                        `Valid for ${pkg.validity_days} days`,
                        ...(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || [])
                      ].slice(0, 3).map((benefit: string, benefitIndex: number) => (
                        <li key={benefitIndex} className="flex items-start text-xs text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                          <Check className="w-3 h-3 text-orange-500 mr-1 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="hidden md:block space-y-1">
                    {[
                      `${pkg.sessions} massage sessions`,
                      `Valid for ${pkg.validity_days} days`,
                      ...(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || [])
                    ].map((benefit: string, benefitIndex: number) => (
                      <li key={benefitIndex} className="flex items-start text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                        <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                        <span className="leading-tight">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-orange-200/30 pt-3 md:pt-4 mt-auto">
                  <Link
                    href={`/book?package=${pkg.id}`}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm md:text-base shadow-lg"
                  >
                    <span className="hidden md:inline">Book This Package</span>
                    <span className="md:hidden">Book Now</span>
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-white/90">No massage packages available at the moment.</p>
            </div>
          )}
          </div>
        </div>

        {/* Fitness Packages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Fitness Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.filter((pkg: any) => pkg.package_type === 'fitness').length > 0 ? packages.filter((pkg: any) => pkg.package_type === 'fitness').map((pkg: any, index: number) => (
              <div key={pkg.id} className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden hover:animate-rgb-glow hover:animate-border-glow hover:scale-105 transition-all duration-500 flex flex-col h-full group animate-fade-in-up relative" style={{animationDelay: `${index * 100}ms`}}>
                {/* Package Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                      <p className="text-orange-100">{pkg.description}</p>
                    </div>
                    {pkg.discount_percentage > 0 && (
                      <div className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {pkg.discount_percentage}% OFF
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Details */}
                <div className="p-3 md:p-6 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                    <div className="text-center md:text-left mb-3 md:mb-0">
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1">₹{pkg.discounted_price}</div>
                      {pkg.original_price && (
                        <div className="text-lg md:text-xl text-gray-500 line-through font-semibold">₹{pkg.original_price}</div>
                      )}
                      <div className="text-xs md:text-sm text-gray-400 flex items-center justify-center md:justify-start whitespace-nowrap group-hover:text-gray-300 transition-colors duration-300">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {pkg.validity_days} days
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-lg md:text-xl font-bold text-white group-hover:text-orange-300 transition-colors duration-300">{pkg.sessions} sessions</div>
                    </div>
                  </div>

                  <p className="text-xs md:text-base text-gray-300 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none group-hover:text-gray-200 transition-colors duration-300">{pkg.description}</p>

                  <div className="mb-4 md:mb-6 flex-1">
                    <h4 className="font-semibold text-white mb-2 text-sm md:text-base group-hover:text-orange-300 transition-colors duration-300">Benefits:</h4>
                    <div className="md:hidden">
                      <ul className="space-y-1">
                        {[
                          `${pkg.sessions} fitness sessions`,
                          `Valid for ${pkg.validity_days} days`,
                          ...(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || [])
                        ].slice(0, 3).map((benefit: string, benefitIndex: number) => (
                          <li key={benefitIndex} className="flex items-start text-xs text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                            <Check className="w-3 h-3 text-orange-500 mr-1 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                            <span className="leading-tight">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <ul className="hidden md:block space-y-1">
                      {[
                        `${pkg.sessions} fitness sessions`,
                        `Valid for ${pkg.validity_days} days`,
                        ...(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || [])
                      ].map((benefit: string, benefitIndex: number) => (
                        <li key={benefitIndex} className="flex items-start text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                          <Check className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors duration-300" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-orange-200/30 pt-3 md:pt-4 mt-auto">
                    <Link
                      href={`/book?package=${pkg.id}`}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm md:text-base shadow-lg"
                    >
                      <span className="hidden md:inline">Book This Package</span>
                      <span className="md:hidden">Book Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-white/90">No fitness packages available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Individual Services */}
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 p-8 mb-12 hover:animate-rgb-glow hover:animate-border-glow transition-all duration-500">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Individual Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.filter(service => ![
              'personal-training', 'strength-training', 'cardio-fitness',
              'flexibility-mobility', 'weight-loss', 'functional-training', 'muscle-gain'
            ].includes(service.id)).map((service, index) => (
              <div key={service.id} className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 overflow-hidden hover:animate-rgb-glow hover:animate-border-glow hover:scale-105 transition-all duration-500 flex flex-col h-full group animate-fade-in-up relative" style={{animationDelay: `${index * 100}ms`}}>
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-0 leading-tight group-hover:text-orange-300 transition-colors duration-300">{service.name}</h3>
                    <div className="text-left md:text-right">
                      <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">₹{service.price}</div>
                      <div className="text-xs md:text-sm text-gray-400 flex items-center whitespace-nowrap group-hover:text-gray-300 transition-colors duration-300">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none group-hover:text-gray-200 transition-colors duration-300">{service.description}</p>

                  <div className="border-t border-orange-200/30 pt-3 md:pt-4 mt-auto">
                    <Link
                      href={`/book?service=${service.id}`}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-sm md:text-base shadow-lg"
                    >
                      <span className="hidden md:inline">Book This Service</span>
                      <span className="md:hidden">Book Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 p-8 hover:animate-rgb-glow hover:animate-border-glow transition-all duration-500">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Why Choose Our Packages?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-400 font-bold text-2xl">₹</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Save Money</h3>
              <p className="text-gray-300">Get up to 15% discount compared to individual bookings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Consistent Care</h3>
              <p className="text-gray-300">Regular sessions for better health and wellness results</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Flexible Scheduling</h3>
              <p className="text-gray-300">Book sessions at your convenience within the validity period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 