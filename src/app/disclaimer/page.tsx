import Link from 'next/link';
import { AlertTriangle, Shield, Heart, Phone } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Disclaimer</h1>
          <p className="text-lg text-gray-600">Important information about our services</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-red-800 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Medical Disclaimer
              </h2>
              <p className="text-red-700 text-lg">
                <strong>This massage service is provided solely for wellness and relaxation purposes.</strong>
              </p>
              <p className="text-red-700 mt-2">
                It is <strong>NOT a replacement for professional medical treatment</strong> and should not be used to diagnose, treat, cure, or prevent any disease or medical condition.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-blue-600" />
                Health Considerations
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>If you have any medical conditions, injuries, or health concerns, please consult your doctor before booking</li>
                <li>Inform our therapist about any medications you are currently taking</li>
                <li>Pregnant women should consult their healthcare provider before receiving massage therapy</li>
                <li>If you experience any pain or discomfort during the session, inform the therapist immediately</li>
                <li>Massage therapy may not be suitable for individuals with certain medical conditions</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Safety & Professional Standards
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Our therapist is certified and follows professional massage therapy standards</li>
                <li>All equipment and oils are sanitized and safe for use</li>
                <li>We maintain strict hygiene protocols for your safety</li>
                <li>We reserve the right to refuse service if we believe it may be harmful to your health</li>
                <li>Any inappropriate behavior will result in immediate service termination</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">What Our Services Include:</h2>
              <ul className="list-disc pl-6 text-blue-700 space-y-1">
                <li>Relaxation and stress relief</li>
                <li>Muscle tension relief</li>
                <li>Improved circulation</li>
                <li>General wellness and comfort</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">What Our Services Do NOT Include:</h2>
              <ul className="list-disc pl-6 text-yellow-700 space-y-1">
                <li>Medical diagnosis or treatment</li>
                <li>Physical therapy or rehabilitation</li>
                <li>Treatment of specific medical conditions</li>
                <li>Prescription of medications or supplements</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-700 mb-4">
                By booking our services, you acknowledge that you have read and understood this disclaimer.
              </p>
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>Questions? Contact us: +91 7875671417</span>
              </div>
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