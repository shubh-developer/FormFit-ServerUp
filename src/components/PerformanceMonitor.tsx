'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only monitor in development
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor Core Web Vitals silently
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry.startTime > 2500) {
          console.warn('⚠️ LCP is slow:', lastEntry.startTime + 'ms');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value;
          }
        });
        if (clsValue > 0.1) {
          console.warn('⚠️ CLS is poor:', clsValue.toFixed(3));
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }, []);

  return null;
} 