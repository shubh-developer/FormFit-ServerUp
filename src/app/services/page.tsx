import Link from "next/link";
import { SERVICES } from "@/lib/data";
import {
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  Shield,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <div
      className="min-h-[100vh] relative -mt-16"
      style={{
        backgroundImage: "url(/images/still-life-yoga-equipment.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "scroll",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* ===== Header Section ===== */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-white mb-4">
            Our Massage Services
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Choose from our range of professional massage therapies designed to
            provide relaxation, pain relief, and overall wellness. All services
            are performed by our certified therapist.
          </p>
        </div>

        {/* ===== Services Grid ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              {/* Card Content */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                {/* --- Card Header --- */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">
                    {service.name}
                  </h3>

                  <div className="text-right">
                    <div className="text-base sm:text-xl font-bold text-green-600">
                      ₹{service.price}
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4 flex-shrink-0 text-gray-500" />
                      <span className="leading-none">{service.duration}</span>
                    </div>
                  </div>
                </div>

                {/* --- Description --- */}
                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                {/* --- Benefits --- */}
                <div className="mb-6 flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    Benefits:
                  </h4>
                  <ul className="space-y-1">
                    {service.benefits.slice(0, 4).map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* --- Button (Always at Bottom) --- */}
                <div className="border-t pt-4 mt-auto">
                  <Link
                    href={`/book?service=${service.id}`}
                    className="w-full bg-green-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    Book This Service
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Why Choose Us Section ===== */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Why Choose Our Services?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* --- Card 1 --- */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Professional & Safe
              </h3>
              <p className="text-gray-600">
                Certified therapist with 5+ years of experience. All equipment
                sanitized.
              </p>
            </div>

            {/* --- Card 2 --- */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Home Convenience
              </h3>
              <p className="text-gray-600">
                No travel needed. We come to your home for maximum comfort.
              </p>
            </div>

            {/* --- Card 3 --- */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                High-quality oils and professional techniques for best results.
              </p>
            </div>
          </div>
        </div>

        {/* ===== CTA Section (Optional) ===== */}
        {/*
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Relief?</h2>
          <p className="text-xl mb-6 opacity-90">
            Book your appointment today and enjoy professional massage therapy in the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              href="/packages"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              View Packages
            </Link>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
