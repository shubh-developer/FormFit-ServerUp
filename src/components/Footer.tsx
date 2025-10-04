import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 shadow-lg">
                <Image
                  src="/forma-fit-logo.jpg"
                  alt="FormaFit Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span className="text-xl font-bold">FormaFit</span>
            </div>
            <p className="text-gray-300 mb-4">
              Professional home massage therapy & certified fitness training services in Pune. Experience ultimate relaxation, pain relief, stress reduction, muscle tension release, and personalized fitness coaching with our certified therapist and professional trainer.
            </p>
            <div className="flex space-x-4">
              <a
                href="tel:+919876543210"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone size={16} />
                <span className="text-sm font-medium">Call Now</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-300 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-300">+91 7875671417</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-300">formafit503@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-gray-300">Pune, Maharashtra</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-blue-400" />
                <span className="text-gray-300">8 AM - 10 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FormaFit. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/disclaimer" className="text-gray-400 hover:text-white text-sm transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 