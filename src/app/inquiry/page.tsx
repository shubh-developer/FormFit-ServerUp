import InquiryForm from '@/components/InquiryForm';

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat -mt-16 pt-28 pb-12" style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://plus.unsplash.com/premium_photo-1661521234937-53cf29dd60a9?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjA1fHxjb250YWN0JTIwdXN8ZW58MHx8MHx8fDA%3D")'}} suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Contact & Inquiries</h1>
          <p className="text-lg text-gray-200">
            Have questions or special requests? We&apos;re here to help!
          </p>
        </div>
        <InquiryForm />
      </div>
    </div>
  );
} 