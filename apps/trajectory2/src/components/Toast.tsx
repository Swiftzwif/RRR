'use client';

/**
 * Toast notification wrapper component
 * Uses sonner for lightweight, accessible toast notifications
 */

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Global toast notification provider
 * Place this in the root layout to enable toasts throughout the app
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        className: 'font-body',
      }}
      richColors
    />
  );
}
