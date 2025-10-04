import Link from 'next/link';
import { HelpCircle, Phone, Mail } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Find answers to common questions about our services</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What areas do you serve?</h3>
              <p className="text-gray-600">We serve Pune city and surrounding areas including Pimpri-Chinchwad, Hinjewadi, Kharadi, and Viman Nagar.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How far in advance should I book?</h3>
              <p className="text-gray-600">We recommend booking at least 1 hour in advance. For weekends, booking 24 hours ahead is preferred.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is your cancellation policy?</h3>
              <p className="text-gray-600">Free cancellation up to 2 hours before appointment. 50% fee if canceled within 1 hour.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept cash, UPI, and digital payments. Payment is due upon completion of service.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is the therapist certified?</h3>
              <p className="text-gray-600">Yes, our therapist is fully certified with 5+ years of experience and professional insurance.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I have a medical condition?</h3>
              <p className="text-gray-600">Please consult your doctor before booking if you have medical conditions or are pregnant.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">+91 7875671417</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-600" />
                              <span className="text-gray-700">info@formafit.in</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 