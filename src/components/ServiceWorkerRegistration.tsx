'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            // Service worker registered successfully
          })
          .catch((registrationError) => {
                          // Service worker registration failed
          });
      });
    }
  }, []);

  return null;
} 