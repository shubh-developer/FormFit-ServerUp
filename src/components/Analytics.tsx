'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pathname,
      });
    }

    // Track custom events
    const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, parameters);
      }
    };

    // Track booking form interactions
    const trackBookingInteraction = () => {
      trackEvent('booking_form_interaction', {
        page: pathname,
        timestamp: new Date().toISOString(),
      });
    };

    // Track service selection
    const trackServiceSelection = (serviceType: string) => {
      trackEvent('service_selected', {
        service_type: serviceType,
        page: pathname,
      });
    };

    // Track contact form submissions
    const trackContactSubmission = () => {
      trackEvent('contact_form_submitted', {
        page: pathname,
      });
    };

    // Add event listeners for tracking
    const bookingButtons = document.querySelectorAll('[data-track="booking"]');
    bookingButtons.forEach(button => {
      button.addEventListener('click', trackBookingInteraction);
    });

    const serviceButtons = document.querySelectorAll('[data-track="service"]');
    serviceButtons.forEach(button => {
      button.addEventListener('click', () => {
        const serviceType = button.getAttribute('data-service-type');
        if (serviceType) trackServiceSelection(serviceType);
      });
    });

    const contactForms = document.querySelectorAll('[data-track="contact"]');
    contactForms.forEach(form => {
      form.addEventListener('submit', trackContactSubmission);
    });

    // Cleanup event listeners
    return () => {
      bookingButtons.forEach(button => {
        button.removeEventListener('click', trackBookingInteraction);
      });
      serviceButtons.forEach(button => {
        button.removeEventListener('click', () => {
          const serviceType = button.getAttribute('data-service-type');
          if (serviceType) trackServiceSelection(serviceType);
        });
      });
      contactForms.forEach(form => {
        form.removeEventListener('submit', trackContactSubmission);
      });
    };
  }, [pathname]);

  return null;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
} 