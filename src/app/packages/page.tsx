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
    <div className="min-h-screen bg-gray-50 -mt-16 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Packages</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our affordable packages designed for regular wellness maintenance. 
            Save money while maintaining your health and relaxation routine.
          </p>
        </div>

        {/* Massage Packages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Massage Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoading ? (
              <div className="col-span-2 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading packages...</p>
              </div>
            ) : packages.filter((pkg: any) => pkg.package_type === 'massage').length > 0 ? packages.filter((pkg: any) => pkg.package_type === 'massage').map((pkg: any) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Package Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                    <p className="text-blue-100">{pkg.description}</p>
                  </div>
                  {pkg.discount_percentage > 0 && (
                    <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {pkg.discount_percentage}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="flex justify-center items-baseline mb-2">
                    <span className="text-4xl font-bold text-green-600">₹{pkg.discounted_price}</span>
                    {pkg.original_price && (
                      <span className="text-lg text-red-500 line-through ml-2">₹{pkg.original_price}</span>
                    )}
                  </div>
                  <p className="text-gray-600">for {pkg.sessions} sessions</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{pkg.sessions} massage sessions</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="text-gray-700">Valid for {pkg.validity_days} days</span>
                  </div>
                  {(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || []).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href={`/book?package=${pkg.id}`}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  Book Package
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-600">No massage packages available at the moment.</p>
            </div>
          )}
          </div>
        </div>

        {/* Fitness Packages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Fitness Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.filter((pkg: any) => pkg.package_type === 'fitness').length > 0 ? packages.filter((pkg: any) => pkg.package_type === 'fitness').map((pkg: any) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Package Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
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
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex justify-center items-baseline mb-2">
                      <span className="text-4xl font-bold text-gray-900">₹{pkg.discounted_price}</span>
                      {pkg.original_price && (
                        <span className="text-lg text-gray-500 line-through ml-2">₹{pkg.original_price}</span>
                      )}
                    </div>
                    <p className="text-gray-600">for {pkg.sessions} sessions</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{pkg.sessions} fitness sessions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="text-gray-700">Valid for {pkg.validity_days} days</span>
                    </div>
                    {(typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features || []).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/book?package=${pkg.id}`}
                    className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center block"
                  >
                    Book Package
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-600">No fitness packages available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Individual Services */}
        <div className="relative bg-white rounded-lg shadow-lg p-8 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Spa massage background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#00BCD4]/20 to-[#FF1744]/20"></div>
          </div>
          <h2 className="relative text-2xl font-bold text-[#1A1A1A] mb-6 text-center z-10">Individual Services</h2>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
            {SERVICES.map((service) => (
              <div key={service.id} className={`border border-gray-200 rounded-lg p-4 relative overflow-hidden ${
                service.name === 'Full Body Massage' ? 'bg-gradient-to-br from-[#00BCD4]/10 to-[#FF1744]/10' : 
                service.name === 'Upper Body Massage' ? 'bg-gradient-to-br from-[#FFD600]/10 to-[#00BCD4]/10' :
                service.name === 'Lower Body Massage' ? 'bg-gradient-to-br from-[#FF1744]/10 to-[#FFD600]/10' :
                service.name === 'Head Massage' ? 'bg-gradient-to-br from-[#00BCD4]/10 to-[#FFD600]/10' :
                service.name === 'Injury-Specific Therapy' ? 'bg-gradient-to-br from-[#FFD600]/10 to-[#FF1744]/10' :
                service.name === 'Full Body Stretching' ? 'bg-gradient-to-br from-[#FF1744]/10 to-[#00BCD4]/10' :
                service.name === 'Personal Training' ? 'bg-gradient-to-br from-[#00BCD4]/10 to-[#FFD600]/10' :
                service.name === 'Strength Training' ? 'bg-gradient-to-br from-[#FFD600]/10 to-[#FF1744]/10' :
                service.name === 'Cardio Fitness' ? 'bg-gradient-to-br from-[#FF1744]/10 to-[#00BCD4]/10' :
                service.name === 'Flexibility & Mobility' ? 'bg-gradient-to-br from-[#00BCD4]/10 to-[#FFD600]/10' :
                service.name === 'Weight Loss Program' ? 'bg-gradient-to-br from-[#FFD600]/10 to-[#FF1744]/10' :
                service.name === 'Functional Training' ? 'bg-gradient-to-br from-[#FF1744]/10 to-[#00BCD4]/10' :
                service.name === 'Muscle Gain Program' ? 'bg-gradient-to-br from-[#00BCD4]/10 to-[#FFD600]/10' : ''
              }`}>
                {service.name === 'Full Body Massage' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Full body massage" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Upper Body Massage' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://www.fullbodyspamassage.com/wp-content/uploads/2023/08/body-massage-spa-in-juhu-1024x400.jpg" 
                      alt="Upper body massage" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Lower Body Massage' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://www.physio.co.uk/images/lower-back-massage/lower-back-massage4.jpg" 
                      alt="Lower body massage" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Head Massage' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://post.healthline.com/wp-content/uploads/2020/03/Head-Massage-1296x728-header.jpg" 
                      alt="Head massage" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Injury-Specific Therapy' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://www.athleticpt.com/wp-content/uploads/2022/08/acl-physical-therapy.jpeg.webp" 
                      alt="Injury-specific therapy" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Full Body Stretching' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://cdn-cccio.nitrocdn.com/sQAAylIpwgMYZgBLSXcMgCkUIbfIzHvb/assets/images/optimized/rev-586a700/www.aleanlife.com/wp-content/uploads/2014/09/full-body-sretching-routine-pdf.jpg" 
                      alt="Full body stretching" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Personal Training' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://recwell.umd.edu/sites/default/files/styles/optimized/public/2021-08/_dsc5627_28394604698_o.jpg?itok=rlddjE_u" 
                      alt="Personal training" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Strength Training' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://www.muscletech.in/wp-content/uploads/2021/03/muscletech-women-and-lifting.jpg" 
                      alt="Strength training" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Cardio Fitness' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://miro.medium.com/0*7JSzjLf9p0KPWyNg.jpg" 
                      alt="Cardio fitness" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Flexibility & Mobility' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://www.hindustantimes.com/ht-img/img/2024/04/17/550x309/MixCollage-17-Apr-2024-02-52-PM-5022_1713345332048_1713345346012.jpg" 
                      alt="Flexibility and mobility" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Weight Loss Program' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://lirp.cdn-website.com/fa88fccb/dms3rep/multi/opt/MyJourney+Weight+Loss+Landing+Page-640w.png" 
                      alt="Weight loss program" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Functional Training' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://cdn.centr.com/content/26000/25412/images/landscapewidedesktop1x-3edf7b95e3736a9cde9ab39b955dd3a6-what-is-functional-training-inline-5-169-19710.jpg" 
                      alt="Functional training" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {service.name === 'Muscle Gain Program' && (
                  <div className="absolute inset-0 opacity-40">
                    <img 
                      src="https://5.imimg.com/data5/PH/QE/GLADMIN-49432028/weight-gain-and-muscle-gain-500x500.png" 
                      alt="Muscle gain program" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="relative flex justify-between items-start mb-3 z-10">
                  <h3 className="font-semibold text-[#7D53DE]">{service.name}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">₹{service.price}</div>
                    <div className="text-sm text-[#503B31]">{service.duration}</div>
                  </div>
                </div>
                <p className="relative text-black text-sm mb-3 z-10">{service.description}</p>
                <Link
                  href={`/book?service=${service.id}`}
                  className="relative w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-center block text-sm font-medium z-20"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Packages?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">₹</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Save Money</h3>
              <p className="text-gray-600 text-sm">Get up to 15% discount compared to individual bookings</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consistent Care</h3>
              <p className="text-gray-600 text-sm">Regular sessions for better health and wellness results</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">Book sessions at your convenience within the validity period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 