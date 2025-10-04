import Link from 'next/link';
import { Search, Home } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border border-white/20">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
            <Search className="w-14 h-14 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <BackButton />
        </div>
      </div>
    </div>
  );
} 