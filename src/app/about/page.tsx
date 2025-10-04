import { THERAPIST_INFO } from '@/lib/data';
import { Award, MapPin, Users, Star, Phone, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen relative -mt-16 pt-28 pb-12">
      <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(63, 63, 63, 1), rgba(0, 0, 0, 1))'}}></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">About Your Therapist</h1>
          <p className="text-lg text-white">
            Meet the professional behind your wellness journey.
          </p>
        </div>

        <div className="relative bg-white rounded-lg shadow-lg p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <img 
              src="/icons/man-getting-massage.jpg" 
              alt="Man getting massage" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-48 h-48 bg-white rounded-full mx-auto mb-6 flex items-center justify-center p-2 shadow-lg">
                <img 
                  src="/forma-fit-logo.jpg" 
                  alt="FormaFit Logo" 
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{THERAPIST_INFO.name}</h2>
              <p className="text-xl text-gray-600 mb-4">{THERAPIST_INFO.specialization}</p>
              <div className="flex justify-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">Rated 5.0 by 100+ satisfied clients</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Background</h3>
              <p className="text-gray-600 mb-6">{THERAPIST_INFO.description}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">{THERAPIST_INFO.experience} of experience</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Specialized in {THERAPIST_INFO.specialization}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Serving {THERAPIST_INFO.location}</span>
                </div>
              </div>

              <div className="bg-blue-50/90 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium text-gray-900">+91 7875671417</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THERAPIST_INFO.certifications.map((cert, index) => (
              <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <Award className="w-6 h-6 text-blue-600 mr-3" />
                <span className="text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-white rounded-lg shadow-lg p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 opacity-50">
            <img 
              src="/icons/safty_hygine.png" 
              alt="Safety and hygiene standards" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2 text-green-600" />
              Hygiene & Safety Standards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-3">Equipment & Materials</h4>
                <ul className="text-green-700 space-y-2">
                  <li>• All equipment is sanitized before each session</li>
                  <li>• Fresh, clean towels provided for every client</li>
                  <li>• Premium quality, hypoallergenic massage oils</li>
                  <li>• Disposable items used where appropriate</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3">Professional Standards</h4>
                <ul className="text-blue-700 space-y-2">
                  <li>• Therapist maintains strict personal hygiene</li>
                  <li>• Mask worn if requested by client</li>
                  <li>• Hands sanitized before and after each session</li>
                  <li>• Safe, professional environment maintained</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Book?</h3>
          <p className="text-blue-100 mb-6">
            Book your appointment today and enjoy professional massage therapy at home.
          </p>
          <Link
            href="/book"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}