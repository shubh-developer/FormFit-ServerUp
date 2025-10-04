"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, Globe, Star, ShieldCheck, Award, QrCode, Check, MessageCircle } from "lucide-react";
import React from "react";

type VisitingCardProps = {
  name: string;
  title: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  avatarUrl?: string;
  theme?: "light" | "dark" | "brand";
  rating?: number;
  reviewsCount?: number;
  yearsExperience?: number;
  certifications?: string[];
  verified?: boolean;
  tagline?: string;
  services?: string[];
  whatsapp?: string;
  locationLabel?: string;
  logoUrl?: string;
  qrImageUrl?: string;
  side?: "front" | "back";
  comboPackages?: string[];
  yearlyPackages?: string[];
  healthNote?: string;
};

export default function VisitingCard(props: VisitingCardProps) {
  const {
    name,
    title,
    company,
    email,
    phone,
    website,
    address,
    avatarUrl,
    theme = "brand",
    rating = 4.9,
    reviewsCount = 120,
    yearsExperience = 5,
    certifications = ["Certified Therapist", "Hygiene Assured"],
    verified = true,
    tagline,
    services,
    whatsapp,
    locationLabel,
    logoUrl,
    qrImageUrl,
    side = "front",
    comboPackages,
    yearlyPackages,
    healthNote,
  } = props;

  const themeClasses = {
    light:
      "bg-white text-gray-800 border border-gray-200 shadow-lg",
    dark:
      "bg-gray-900 text-gray-100 border border-gray-800 shadow-xl",
    brand:
      "gradient-primary text-white shadow-xl",
  } as const;

  const starElements = Array.from({ length: 5 }).map((_, idx) => {
    const filled = rating >= idx + 1 || rating > idx && rating < idx + 1;
    const partial = rating > idx && rating < idx + 1;
    return (
      <Star
        key={idx}
        size={14}
        className={
          filled
            ? "text-yellow-300 fill-yellow-300"
            : "text-white/60"
        }
        style={partial ? { clipPath: "inset(0 50% 0 0)" } : undefined}
      />
    );
  });

  return (
    <div className={`w-[360px] h-[220px] rounded-2xl overflow-hidden card-hover ${themeClasses[theme]}`}>
      <div className="relative h-full">
        {/* Top pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="40" r="80" fill="url(#g1)" />
            <circle cx="340" cy="200" r="120" fill="url(#g1)" />
          </svg>
        </div>

        {/* Side content */}
        {side === "front" ? (
          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
            {verified ? (
              <div className="absolute right-3 top-3 z-20 flex items-center gap-1 bg-black/20 px-2 py-1 rounded-full text-[10px] font-semibold">
                <ShieldCheck size={14} /> Verified
              </div>
            ) : null}

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {name?.split(" ")?.map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xl font-extrabold tracking-tight truncate">{name}</div>
                <div className="text-sm opacity-90 truncate">{title}</div>
                {company ? (
                  <div className="text-xs opacity-80 truncate">{company}</div>
                ) : null}
              </div>
            </div>

            {tagline ? (
              <div className="text-sm font-semibold opacity-95 mt-1">{tagline}</div>
            ) : null}
            {healthNote ? (
              <div className="text-[11px] opacity-90 mt-1">
                {healthNote}
              </div>
            ) : null}

            {/* Trust row */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                {starElements}
                <span className="text-[11px] opacity-90 ml-1">
                  {rating.toFixed(1)} ({reviewsCount}+)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] opacity-90">
                <Award size={14} /> {yearsExperience}+ yrs experience
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mt-2">
              {email ? (
                <div className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1.5 backdrop-blur-sm">
                  <Mail size={14} />
                  <span className="truncate">{email}</span>
                </div>
              ) : null}
              {phone ? (
                <div className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1.5 backdrop-blur-sm">
                  <Phone size={14} />
                  <span className="truncate">{phone}</span>
                </div>
              ) : null}
              {whatsapp ? (
                <div className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1.5 backdrop-blur-sm">
                  <MessageCircle size={14} />
                  <span className="truncate">WhatsApp: {whatsapp}</span>
                </div>
              ) : null}
              {website ? (
                <div className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1.5 backdrop-blur-sm">
                  <Globe size={14} />
                  <span className="truncate">{website}</span>
                </div>
              ) : null}
              {address ? (
                <div className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1.5 backdrop-blur-sm col-span-2">
                  <MapPin size={14} />
                  <span className="truncate">{address}</span>
                </div>
              ) : null}
            </div>

            {/* Certifications / guarantees */}
            {certifications?.length ? (
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] opacity-95">
                {certifications.slice(0, 3).map((label, i) => (
                  <span
                    key={i}
                    className="bg-black/15 px-2 py-1 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Website footer */}
            {website ? (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="bg-black/25 px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1">
                  <Globe size={12} /> {website}
                </div>
              </div>
            ) : null}

            {logoUrl ? (
              <div className="absolute bottom-4 right-4 opacity-90">
                <Image src={logoUrl} alt="logo" width={56} height={24} />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold mb-2">Services</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(services && services.length ? services : [
                  "Sports Massage",
                  "Gym Massage",
                  "Physiotherapy Sessions",
                  "Relaxation Therapy",
                  "Monthly Packages",
                ]).slice(0,5).map((svc, i) => (
                  <div key={i} className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1.5">
                    <Check size={14} />
                    <span className="truncate">{svc}</span>
                  </div>
                ))}
              </div>

              {/* Packages */}
              {(comboPackages && comboPackages.length) ? (
                <div className="mt-3">
                  <div className="text-sm font-bold mb-1">Combo Packages</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {comboPackages.slice(0,4).map((pkg, i) => (
                      <div key={i} className="bg-black/10 rounded-lg px-2 py-1.5 truncate">{pkg}</div>
                    ))}
                  </div>
                </div>
              ) : null}
              {(yearlyPackages && yearlyPackages.length) ? (
                <div className="mt-3">
                  <div className="text-sm font-bold mb-1">Yearly Packages</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {yearlyPackages.slice(0,4).map((pkg, i) => (
                      <div key={i} className="bg-black/10 rounded-lg px-2 py-1.5 truncate">{pkg}</div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 bg-black/10 rounded-lg px-2 py-1.5">
                  <MapPin size={14} /> {locationLabel || address || "Pune (Home Service)"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                {qrImageUrl ? (
                  <Image src={qrImageUrl} alt="Scan to book" width={96} height={96} className="rounded-lg ring-2 ring-white/30" />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-black/10 flex items-center justify-center">
                    <QrCode />
                  </div>
                )}
                <span className="mt-2 text-[11px] opacity-90">Scan QR to Book</span>
              </div>
            </div>

            {logoUrl ? (
              <div className="absolute bottom-4 right-4 opacity-90">
                <Image src={logoUrl} alt="logo" width={56} height={24} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}


