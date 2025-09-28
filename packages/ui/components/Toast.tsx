'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type, 
  onClose, 
  duration = 5000
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-danger" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warn" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-sunset" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-success/30 bg-success/5';
      case 'error':
        return 'border-danger/30 bg-danger/5';
      case 'warning':
        return 'border-warn/30 bg-warn/5';
      case 'info':
        return 'border-sunset/30 bg-sunset/5';
    }
  };

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 p-4 border-l-4 ${getBorderColor()} max-w-sm w-full bg-white rounded-lg shadow-lg`}
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-sky-800">
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 text-sky-400 hover:text-sky-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
