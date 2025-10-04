"use client";

import Image from "next/image";
import { Check, Phone, Mail, Globe, MapPin, MessageCircle, ShieldCheck, Star, Droplets } from "lucide-react";
import React from "react";

type PamphletProps = {
  name: string;
  title: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  services: string[];
  comboPackages?: string[];
  yearlyPackages?: string[];
  highlights?: string[];
  oils?: string[];
  featured?: Array<{ title: string; imageUrl: string; subtitle?: string }>; // hero tiles
  gallery?: Array<{ title: string; imageUrl: string }>; // therapy gallery
  qrImageUrl?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  rating?: number;
  reviewsCount?: number;
};

export default function Pamphlet(props: PamphletProps) {
  const {
    name,
    title,
    phone,
    whatsapp,
    email,
    website,
    address,
    services,
    comboPackages,
    yearlyPackages,
    highlights = [
      "Certified & Experienced",
      "Home Service Available",
      "Hygiene Assured",
    ],
    oils = [
      "Ayurvedic Herbal Oil",
      "Coconut Oil",
      "Olive Oil",
      "Almond Oil",
      "Pain Relief Blend",
    ],
    featured = [
      { title: "Sports Massage", imageUrl: "/images/sport.svg", subtitle: "Performance & Recovery" },
      { title: "Relaxation (Tension Free)", imageUrl: "/images/relax.svg", subtitle: "Stress Relief & Sleep" },
      { title: "Gym Massage", imageUrl: "/images/gym.svg", subtitle: "Post-Workout Recovery" },
    ],
    gallery = [
      { title: "Therapy Session", imageUrl: "/images/therapy1.svg" },
      { title: "Muscle Recovery", imageUrl: "/images/therapy2.svg" },
      { title: "Physio Care", imageUrl: "/images/therapy3.svg" },
    ],
    qrImageUrl,
    logoUrl,
    heroImageUrl,
    rating = 4.9,
    reviewsCount = 180,
  } = props;

  const starElements = Array.from({ length: 5 }).map((_, idx) => (
    <Star key={idx} size={16} className="text-yellow-400 fill-yellow-400" />
  ));

  return (
    <div className="bg-white text-gray-900 w-[794px] h-[1123px] mx-auto rounded-xl shadow-2xl overflow-hidden print:shadow-none print:w-[794px] print:h-[1123px]">
      {/* Header / Hero */}
      <div className="relative h-56 gradient-primary text-white">
        {heroImageUrl ? (
          <Image src={heroImageUrl} alt="hero" fill className="object-cover opacity-30" />
        ) : null}
        <div className="absolute inset-0 p-6 flex items-end justify-between">
          <div>
            <div className="text-3xl font-extrabold tracking-tight">{name}</div>
            <div className="text-sm opacity-90">{title}</div>
            <div className="mt-2 flex items-center gap-2 text-xs opacity-95">
              {starElements}
              <span className="ml-1">{rating.toFixed(1)} ({reviewsCount}+ reviews)</span>
              <span className="ml-2 inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
                <ShieldCheck size={14} /> Verified Professional
              </span>
            </div>
          </div>
          {logoUrl ? (
            <div className="bg-white/20 rounded-lg p-2">
              <Image src={logoUrl} alt="logo" width={96} height={40} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-6">
        {/* Left: Featured and Services */}
        <div className="space-y-5">
          {/* Featured tiles */}
          <section>
            <h2 className="text-lg font-bold mb-2">Featured</h2>
            <div className="grid grid-cols-3 gap-3">
              {featured.slice(0,3).map((f, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative w-full h-24">
                    <Image src={f.imageUrl} alt={f.title} fill className="object-cover" />
                  </div>
                  <div className="p-2 text-center">
                    <div className="text-sm font-semibold">{f.title}</div>
                    {f.subtitle ? (
                      <div className="text-[11px] opacity-70">{f.subtitle}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">Services</h2>
            <div className="grid grid-cols-1 gap-2">
              {services.slice(0, 8).map((svc, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <Check size={16} className="text-emerald-600" />
                  <span className="text-sm">{svc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Therapy Gallery */}
          {gallery?.length ? (
            <section>
              <h2 className="text-lg font-bold mb-2">Therapy Highlights</h2>
              <div className="grid grid-cols-3 gap-3">
                {gallery.slice(0,3).map((g, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative w-full h-24">
                      <Image src={g.imageUrl} alt={g.title} fill className="object-cover" />
                    </div>
                    <div className="p-2 text-center text-[12px]">{g.title}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Right: Highlights, Packages, Oils, CTA, QR */}
        <div className="space-y-5">
          <section>
            <h2 className="text-lg font-bold mb-2">Why Choose Us</h2>
            <div className="grid grid-cols-1 gap-2">
              {[...highlights, "Background Verified", "Sanitized Equipment", "On-time Service"]
                .slice(0,7)
                .map((h, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span className="text-sm">{h}</span>
                </div>
              ))}
            </div>
          </section>

          {(comboPackages?.length || yearlyPackages?.length) ? (
            <section>
              <h2 className="text-lg font-bold mb-2">Packages</h2>
              {comboPackages?.length ? (
                <div className="mb-2">
                  <div className="text-sm font-semibold mb-1">Combo</div>
                  <div className="grid grid-cols-1 gap-2">
                    {comboPackages.slice(0,6).map((pkg, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg px-3 py-2 text-sm truncate">{pkg}</div>
                    ))}
                  </div>
                </div>
              ) : null}
              {yearlyPackages?.length ? (
                <div>
                  <div className="text-sm font-semibold mb-1">Yearly</div>
                  <div className="grid grid-cols-1 gap-2">
                    {yearlyPackages.slice(0,6).map((pkg, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg px-3 py-2 text-sm truncate">{pkg}</div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          <section>
            <h2 className="text-lg font-bold mb-2">Oil Options</h2>
            <div className="flex flex-wrap gap-2">
              {oils.slice(0,8).map((o, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-xs">
                  <Droplets size={14} className="text-emerald-700" /> {o}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="text-base font-bold mb-1">Recover Faster. Live Stronger.</div>
            <p className="text-sm text-blue-900 opacity-90">
              Science-backed physiotherapy and sports massage to relieve pain, improve mobility, and boost performance.
            </p>
          </section>

          <section className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone size={16} /> {phone}</div>
              {whatsapp ? (
                <div className="flex items-center gap-2"><MessageCircle size={16} /> WhatsApp: {whatsapp}</div>
              ) : null}
              {email ? (
                <div className="flex items-center gap-2"><Mail size={16} /> {email}</div>
              ) : null}
              {address ? (
                <div className="flex items-center gap-2"><MapPin size={16} /> {address}</div>
              ) : null}
              {website ? (
                <div className="flex items-center gap-2"><Globe size={16} /> {website}</div>
              ) : null}
            </div>
            <div className="flex flex-col items-center">
              {qrImageUrl ? (
                <Image src={qrImageUrl} alt="Scan to book" width={140} height={140} className="rounded-xl shadow" />
              ) : (
                <div className="w-[140px] h-[140px] rounded-xl bg-gray-200 flex items-center justify-center">
                  QR
                </div>
              )}
              <span className="mt-2 text-xs opacity-80">Scan to Book</span>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-600">
        {website ? (
          <span>Book online at {website} • Trusted by {reviewsCount}+ clients</span>
        ) : (
          <span>Trusted by {reviewsCount}+ clients</span>
        )}
      </div>
    </div>
  );
}


