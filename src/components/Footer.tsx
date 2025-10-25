import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm text-white border-t border-orange-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1 py-2">
            <div className="inline-flex items-center mb-1">
              <div className="h-20">
                <Image
                  src="/images/Formafit_logo/formafit_logo.png"
                  alt="FormaFit Logo"
                  width={80}
                  height={80}
                  className="h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold">FormaFit</span>
            </div>
            <p className="text-gray-300 mb-2 text-sm">
              Professional home massage therapy & certified fitness training services in Pune. Experience ultimate relaxation, pain relief, stress reduction, muscle tension release, and personalized fitness coaching with our certified therapist and professional trainer.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/917776948229?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%20your%20massage%20therapy%20and%20fitness%20training%20services.%20Could%20you%20please%20provide%20more%20information%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse hover:animate-none w-full sm:w-auto"
                style={{ backgroundColor: 'rgb(37, 211, 102)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(32, 191, 92)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(37, 211, 102)'}
              >
                <Phone size={16} className="animate-bounce" />
                <span className="text-xs sm:text-sm font-medium">WhatsApp</span>
              </a>
            </div>
          </div>



          {/* Contact Info */}
          <div className="mt-10 ml-0 lg:mt-8.5 lg:ml-105">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-orange-400" strokeWidth={2} />
                    <span className="text-gray-300">+91 7776948229</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-orange-400" strokeWidth={3} style={{width: '24px', height: '15px', minWidth: '24px'}} />
                    <span className="text-gray-300">admin@formafit.co.in</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-orange-400" strokeWidth={2} />
                    <span className="text-gray-300">Pune, Maharashtra</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-orange-400" strokeWidth={2} />
                    <span className="text-gray-300">8 AM - 10 PM</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Links - Only visible on mobile/tablet */}
              <div className="lg:hidden text-right">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-4">
                  <Link href="/services" className="block text-gray-300 hover:text-orange-300 text-sm transition-colors">
                    Services
                  </Link>
                  <Link href="/about" className="block text-gray-300 hover:text-orange-300 text-sm transition-colors">
                    About Us
                  </Link>
                  <Link href="/feedback" className="block text-gray-300 hover:text-orange-300 text-sm transition-colors">
                    Reviews
                  </Link>
                  <Link href="/faq" className="block text-gray-300 hover:text-orange-300 text-sm transition-colors">
                    FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Bottom Section */}
        <div className="lg:hidden border-t border-orange-500/30 mt-2 pt-2">
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-xs">
              © 2025 FormaFit. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-3">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/disclaimer" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Desktop Only */}
        <div className="hidden lg:block border-t border-orange-500/30 mt-1 pt-1">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">
              © 2025 FormaFit. All rights reserved.
            </p>
            <div className="flex flex-col lg:flex-row space-y-1 lg:space-y-0 lg:space-x-6 mt-2 lg:mt-0">
              <div className="flex space-x-4">
                <Link href="/services" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                  Services
                </Link>
                <Link href="/about" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                  About Us
                </Link>
                <Link href="/feedback" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                  Reviews
                </Link>
                <Link href="/faq" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                  FAQ
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end space-x-4">
                <Link href="/privacy" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/disclaimer" className="text-gray-400 hover:text-orange-300 text-sm transition-colors">
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