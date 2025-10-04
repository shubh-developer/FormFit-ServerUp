import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Booking Terms</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Appointments must be booked at least 1 hour in advance</li>
                <li>Currently available only in Pune city limits</li>
                <li>Clients must be 18+ or have parental consent</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Free cancellation up to 2 hours before appointment</li>
                  <li>50% fee if canceled less than 1 hour before</li>
                  <li>Full refund if therapist cancels due to emergencies</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Safety & Conduct</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 font-semibold mb-2">Zero Tolerance:</p>
                <ul className="list-disc pl-6 text-red-700 space-y-1">
                  <li>No inappropriate behavior tolerated</li>
                  <li>Immediate termination for misconduct</li>
                  <li>Offending clients will be blacklisted</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Disclaimer</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-700">
                  This massage service is for wellness and relaxation only. 
                  <strong> Not a replacement for medical treatment.</strong> 
                  Consult your doctor if you have medical conditions.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                For questions, contact: +91 7875671417 or info@formafit.in
              </p>
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