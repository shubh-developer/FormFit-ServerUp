import Link from 'next/link';
import { Shield, Eye, Lock, Trash2, Phone, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-blue-600" />
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect the following information to provide you with our massage services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Personal Information:</strong> Name, phone number, and address for booking and contact purposes</li>
                <li><strong>Service Preferences:</strong> Type of massage, oil preferences, and any specific health concerns</li>
                <li><strong>Feedback:</strong> Reviews and ratings you choose to provide</li>
                <li><strong>Communication:</strong> Messages and inquiries you send through our platform</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-blue-600" />
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use your information solely for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>To process and confirm your massage appointments</li>
                <li>To communicate with you about your bookings and services</li>
                <li>To provide personalized massage recommendations based on your preferences</li>
                <li>To improve our services based on your feedback</li>
                <li>To ensure your safety and provide appropriate care during sessions</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We take your privacy seriously and implement appropriate security measures:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All data is stored securely and encrypted</li>
                <li>We do not share your personal information with third parties</li>
                <li>Access to your data is limited to authorized personnel only</li>
                <li>We regularly review and update our security practices</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Third-Party Data Sale</h2>
              <p className="text-gray-700">
                We want to be clear: <strong>We do not sell, trade, or rent your personal information to third parties.</strong> 
                Your data is used exclusively for providing our massage services and improving your experience.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Trash2 className="w-6 h-6 mr-2 text-blue-600" />
                Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of any inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Objection:</strong> Object to our processing of your personal information</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">+91 7875671417</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">info@formafit.in</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-500">
                This Privacy Policy is effective as of {new Date().toLocaleDateString()} and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 