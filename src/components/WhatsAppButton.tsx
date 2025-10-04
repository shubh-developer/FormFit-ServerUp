'use client';

import { Phone } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
  children?: React.ReactNode;
}

const WhatsAppButton = ({ phoneNumber, message = "Hi! I'd like to book a massage appointment.", className = "", children }: WhatsAppButtonProps) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center ${className}`}
    >
      <Phone className="w-5 h-5 mr-2" />
      {children || 'WhatsApp Us'}
    </button>
  );
};

export default WhatsAppButton; 