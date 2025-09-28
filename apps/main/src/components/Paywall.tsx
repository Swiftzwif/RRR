'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Lock, CreditCard } from 'lucide-react';

interface PaywallProps {
  hasAccess: boolean;
  product: 'course' | 'coaching';
  onPurchase: () => void;
  children: ReactNode;
  className?: string;
}

export default function Paywall({ 
  hasAccess, 
  product, 
  onPurchase, 
  children, 
  className = '' 
}: PaywallProps) {
  if (hasAccess) {
    return <>{children}</>;
  }

  const productInfo = {
    course: {
      title: 'Unlock the Complete Course',
      description: 'Get access to all 5 transformation modules and start your journey to a higher trajectory.',
      price: '$99.99',
      features: [
        '5 comprehensive life transformation modules',
        'Personalized action plans',
        'Progress tracking tools',
        'Community access',
        'Lifetime updates'
      ]
    },
    coaching: {
      title: 'Book Your Coaching Interview',
      description: 'Get personalized guidance from our expert coaches to create your transformation roadmap.',
      price: '$24.99',
      features: [
        '60-minute deep-dive interview',
        'Personalized transformation plan',
        'Priority support access',
        'Follow-up resources',
        'Accountability check-ins'
      ]
    }
  };

  const info = productInfo[product];

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>

      {/* Paywall overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="strata-card p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-sunset/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {product === 'course' ? (
                <Lock className="w-8 h-8 text-sunset" />
              ) : (
                <CreditCard className="w-8 h-8 text-sunset" />
              )}
            </div>
            
            <h2 className="text-2xl font-display font-bold text-sand-50 mb-2">
              {info.title}
            </h2>
            
            <p className="text-sand-200 leading-relaxed">
              {info.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-sunset mb-4">
              {info.price}
            </div>
            
            <ul className="space-y-2 text-left">
              {info.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3 text-sm text-sand-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-sunset rounded-full flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.button
            onClick={onPurchase}
            className="strata-button w-full text-lg py-4 opacity-75 cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled
          >
            {product === 'course' ? 'Coming Soon' : 'Coming Soon'}
          </motion.button>

          <p className="text-xs text-iron-400 mt-4">
            Payment integration coming soon
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
