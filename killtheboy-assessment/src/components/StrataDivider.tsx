'use client';

import { motion } from 'framer-motion';

interface StrataDividerProps {
  className?: string;
  variant?: 'default' | 'thick' | 'thin';
  animated?: boolean;
}

export default function StrataDivider({ 
  className = '', 
  variant = 'default',
  animated = true 
}: StrataDividerProps) {
  const heightClasses = {
    thin: 'h-px',
    default: 'h-0.5',
    thick: 'h-1',
  };

  const DividerComponent = () => (
    <div className={`strata-divider ${heightClasses[variant]} ${className}`} />
  );

  if (!animated) {
    return <DividerComponent />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="overflow-hidden"
    >
      <DividerComponent />
    </motion.div>
  );
}
