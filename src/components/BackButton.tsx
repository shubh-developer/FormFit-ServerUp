'use client';

import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg border border-gray-200"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Go Back</span>
    </button>
  );
} 