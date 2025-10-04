import { Suspense } from 'react';
import BookingForm from '@/components/BookingForm';

export default function BookPage() {
  return (
    <div className="min-h-screen relative overflow-hidden -mt-16" suppressHydrationWarning>
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Spa wellness background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-white mb-4 tracking-wide">Book Your Massage</h1>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-4">
              FormaFit Therapy
            </h2>
            <p className="text-gray-200">
              Fill out the form below to schedule your professional home massage session
            </p>
          </div>
          <Suspense fallback={<div className="text-center py-8 text-white">Loading...</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 