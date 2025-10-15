import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center p-1 shadow-lg border-2 border-orange-500">
                <Image
                  src="/images/forma-fit-logo.png"
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
                href="https://wa.me/917776948229?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20massage%20therapy%20and%20fitness%20training%20services.%20Could%20you%20please%20provide%20more%20information%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone size={16} />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
            </div>
          </div>



          {/* Contact Info */}
          <div className="mt-10 ml-0 md:mt-2 md:ml-105 ">
            <h3 className="text-lg  font-semibold mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-300">+91 7776948229</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-300">admin@formafit.co.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-gray-300">Pune, Maharashtra</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-blue-400" />
                <span className="text-gray-300">8 AM - 10 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-2 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 FormaFit. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 mt-4 md:mt-0">
              <div className="flex space-x-4">
                <Link href="/services" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Services
                </Link>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
                <Link href="/feedback" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Reviews
                </Link>
                <Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </div>
              <div className="flex space-x-4">
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
      </div>
    </footer>
  );
};

export default Footer; 