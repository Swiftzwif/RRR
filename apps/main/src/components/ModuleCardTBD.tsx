'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Clock, Lock, CheckCircle } from 'lucide-react';

interface Module {
  title: string;
  description: string;
  status: 'coming_soon' | 'locked' | 'unlocked';
  progress?: number;
}

interface ModuleCardTBDProps {
  module: Module;
  onNotify?: (email: string) => void;
  className?: string;
}

export default function ModuleCardTBD({ 
  module, 
  onNotify, 
  className = '' 
}: ModuleCardTBDProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !onNotify) return;

    setIsSubmitting(true);
    try {
      await onNotify(email);
      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Failed to submit email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (module.status) {
      case 'coming_soon':
        return <Clock className="w-5 h-5 text-warn" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-danger" />;
      case 'unlocked':
        return <CheckCircle className="w-5 h-5 text-success" />;
    }
  };

  const getStatusText = () => {
    switch (module.status) {
      case 'coming_soon':
        return 'Coming Soon';
      case 'locked':
        return 'Locked';
      case 'unlocked':
        return 'Available';
    }
  };

  const getStatusColor = () => {
    switch (module.status) {
      case 'coming_soon':
        return 'border-warn/30 bg-warn/5';
      case 'locked':
        return 'border-danger/30 bg-danger/5';
      case 'unlocked':
        return 'border-success/30 bg-success/5';
    }
  };

  return (
    <motion.div
      className={`strata-card p-6 ${getStatusColor()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-display font-semibold text-sand-50 mb-2">
            {module.title}
          </h3>
          <p className="text-sand-200 leading-relaxed">
            {module.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {getStatusIcon()}
          <span className="text-sm font-medium text-sand-200">
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Progress bar for unlocked modules */}
      {module.status === 'unlocked' && module.progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-sand-200">Progress</span>
            <span className="text-sm text-sand-200">{module.progress}%</span>
          </div>
          <div className="strata-meter h-2">
            <motion.div
              className="strata-meter-fill bg-success"
              initial={{ width: 0 }}
              animate={{ width: `${module.progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      )}

      {/* Email capture for coming soon modules */}
      {module.status === 'coming_soon' && onNotify && (
        <div className="mt-6">
          {isSubmitted ? (
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-sm text-sand-200">
                Thanks! We'll notify you when this module is ready.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to get notified"
                  className="strata-input w-full"
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={!email || isSubmitting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  email && !isSubmitting
                    ? 'strata-button'
                    : 'bg-iron-600 text-iron-400 cursor-not-allowed'
                }`}
                whileHover={email && !isSubmitting ? { scale: 1.02 } : {}}
                whileTap={email && !isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Submitting...' : 'Notify Me'}
              </motion.button>
            </form>
          )}
        </div>
      )}

      {/* Locked state message */}
      {module.status === 'locked' && (
        <div className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
          <p className="text-sm text-sand-200 text-center">
            This module requires course access. Purchase the course to unlock.
          </p>
        </div>
      )}
    </motion.div>
  );
}
