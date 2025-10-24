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

        <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 hover:animate-rgb-glow hover:animate-border-glow p-8 mb-8 overflow-hidden transition-all duration-500">
          <div className="absolute inset-0 opacity-30">
            <img 
              src="/icons/man-getting-massage.jpg" 
              alt="Man getting massage" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center overflow-visible">
                <img 
                  src="/images/formafit_logo.png" 
                  alt="FormaFit Logo" 
                  className=" mt-30 w-72 h-72 object-contain rounded-full"
                />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{THERAPIST_INFO.name}</h2>
              <p className="text-xl text-gray-300 mb-4">{THERAPIST_INFO.specialization}</p>
              <div className="flex justify-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300">Rated 5.0 by 100+ satisfied clients</p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Professional Background</h3>
              <p className="text-gray-300 mb-6">{THERAPIST_INFO.description}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-gray-300">{THERAPIST_INFO.experience} of experience</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-gray-300">Specialized in {THERAPIST_INFO.specialization}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-gray-300">Serving {THERAPIST_INFO.location}</span>
                </div>
              </div>

              <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Contact</h4>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-orange-400" />
                  <span className="font-medium text-white">+91 7875671417</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-500/30 hover:animate-rgb-glow hover:animate-border-glow p-8 mb-8 transition-all duration-500">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THERAPIST_INFO.certifications.map((cert, index) => (
              <div key={index} className="flex items-center p-4 border border-orange-500/30 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Award className="w-6 h-6 text-orange-400 mr-3" />
                <span className="text-gray-300">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative backdrop-blur-sm rounded-xl shadow-2xl border border-stone-300/15 hover:animate-rgb-glow hover:animate-border-glow p-8 mb-8 overflow-hidden transition-all duration-500" style={{background: 'rgba(231, 229, 228, 0.06)'}}>
          <div className="absolute inset-0 opacity-30">
            <img 
              src="/icons/safty_hygine.png" 
              alt="Safety and hygiene standards" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200/3 via-neutral-200/2 to-stone-300/3"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2 text-stone-300" />
              Hygiene & Safety Standards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-sky-500/70 to-cyan-600/60 border border-sky-400/50 rounded-lg p-6 backdrop-blur-sm">
                <h4 className="font-semibold text-white mb-3">Equipment & Materials</h4>
                <ul className="text-gray-100 space-y-2">
                  <li>• All equipment is sanitized before each session</li>
                  <li>• Fresh, clean towels provided for every client</li>
                  <li>• Premium quality, hypoallergenic massage oils</li>
                  <li>• Disposable items used where appropriate</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-500/70 to-emerald-600/60 border border-green-400/50 rounded-lg p-6 backdrop-blur-sm">
                <h4 className="font-semibold text-white mb-3">Professional Standards</h4>
                <ul className="text-gray-100 space-y-2">
                  <li>• Therapist maintains strict personal hygiene</li>
                  <li>• Mask worn if requested by client</li>
                  <li>• Hands sanitized before and after each session</li>
                  <li>• Safe, professional environment maintained</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-center shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Book?</h3>
          <p className="text-orange-100 mb-6">
            Book your appointment today and enjoy professional massage therapy at home.
          </p>
          <Link
            href="/book"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}