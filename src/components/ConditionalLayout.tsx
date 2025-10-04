'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar and footer for master pages
  const hiddenPaths = ['/master-login', '/master-dashboard', '/master-feedback', '/master-packages', '/offers', '/new-admin', '/bookings', '/inquiries'];
  const shouldHideLayout = hiddenPaths.includes(pathname);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}