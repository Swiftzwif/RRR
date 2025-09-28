'use client';

import { motion } from 'framer-motion';
import { Avatar } from '@/lib/scoring';
import { getCopy } from '@/lib/copy';

interface AvatarBadgeProps {
  avatar: Avatar;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export default function AvatarBadge({ 
  avatar, 
  className = '', 
  size = 'md',
  showDescription = true 
}: AvatarBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-base',
    lg: 'w-32 h-32 text-lg',
  };

  const getAvatarIcon = (avatar: Avatar) => {
    switch (avatar) {
      case 'Drifter':
        return '🧭';
      case 'Balancer':
        return '⚖️';
      case 'Architect':
        return '🏗️';
      default:
        return '🧭';
    }
  };

  const getAvatarColor = (avatar: Avatar) => {
    switch (avatar) {
      case 'Drifter':
        return 'border-danger bg-danger/10';
      case 'Balancer':
        return 'border-warn bg-warn/10';
      case 'Architect':
        return 'border-success bg-success/10';
      default:
        return 'border-danger bg-danger/10';
    }
  };

  const avatarData = getCopy(`results.avatar.${avatar.toLowerCase()}`) as any;

  return (
    <motion.div
      className={`flex flex-col items-center space-y-4 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 ${getAvatarColor(avatar)} flex items-center justify-center backdrop-blur-sm`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-2xl">{getAvatarIcon(avatar)}</span>
      </motion.div>
      
      <div className="text-center">
        <h3 className="text-xl font-display font-bold text-sand-50 mb-2">
          {avatarData.title}
        </h3>
        
        {showDescription && (
          <motion.p
            className="text-sand-200 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {avatarData.description}
          </motion.p>
        )}
        
        {showDescription && avatarData.traits && (
          <motion.div
            className="flex flex-wrap gap-2 mt-4 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {avatarData.traits.map((trait: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-sand-200/10 border border-sand-200/20 rounded-full text-sm text-sand-200"
              >
                {trait}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
