import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import Toast from "@/components/Toast";
import Providers from "@/lib/providers";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import ThemeProvider from "@/components/ThemeProvider";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import Analytics from "@/components/Analytics";
import OfflineIndicator from "@/components/OfflineIndicator";

export const metadata: Metadata = {
  title: "FormaFit - Professional Home Massage Services in Pune",
  description: "Professional home massage therapy & certified fitness training services in Pune. Experience ultimate relaxation, pain relief, stress reduction, muscle tension release, and personalized fitness coaching with our certified therapist and professional trainer. Comprehensive wellness solutions at your doorstep - from therapeutic massage to customized workout plans. Book your appointment today!",
  keywords: "massage, home massage, pune, therapy, relaxation, pain relief, stress relief, fitness trainer, personal trainer, home fitness, workout, exercise, wellness, muscle tension, stiffness, certified therapist, professional trainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <ThemeProvider />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toast />
          <ServiceWorkerRegistration />
          <PerformanceMonitor />
          <Analytics />
          <OfflineIndicator />
        </Providers>
      </body>
    </html>
  );
}
