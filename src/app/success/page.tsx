import Link from 'next/link';
import { CheckCircle, Phone, Clock } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Submitted!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for choosing FormaFit. Your appointment has been successfully submitted and is pending confirmation.
            </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What&apos;s Next?</h2>
          
          <div className="space-y-6">
                         <div className="flex items-start space-x-4">
               <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                 <span className="text-blue-600 font-bold text-sm">1</span>
               </div>
               <div>
                 <h3 className="font-semibold text-gray-900 mb-1">Booking Review</h3>
                 <p className="text-gray-600">We&apos;ll review your booking and confirm your appointment within 30 minutes.</p>
               </div>
             </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Prepare for Your Session</h3>
                <p className="text-gray-600">Ensure you have a clean, private space with a comfortable surface ready.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Therapist Arrival</h3>
                <p className="text-gray-600">Our therapist will arrive 5-10 minutes before your scheduled time.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            Need to Make Changes?
          </h3>
          <p className="text-gray-600 mb-4">
            If you need to reschedule or cancel your appointment, please contact us at least 2 hours in advance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+917875671417"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 7875671417</span>
            </a>
            <Link
              href="/inquiry"
              className="flex items-center justify-center space-x-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <span>Send Message</span>
            </Link>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Important Reminders
          </h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• Free cancellation up to 2 hours before appointment</li>
            <li>• Payment is due upon completion of service</li>
            <li>• Please inform us of any medical conditions</li>
            <li>• Wear comfortable, loose-fitting clothing</li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Questions? Contact us at +91 7875671417</p>
          </div>
        </div>
      </div>
    </div>
  );
} 