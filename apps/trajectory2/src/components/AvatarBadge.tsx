'use client';

import { getCopy } from '@/lib/copy';
import { Avatar } from '@/lib/scoring';
import { AnimatedDiv, AnimatedP } from '@/components/animation/AnimatedComponents';

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
    sm: 'w-20 h-20 text-sm',
    md: 'w-28 h-28 text-base',
    lg: 'w-36 h-36 text-lg',
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
        return 'border-red-400 bg-gradient-to-br from-red-50 to-red-100';
      case 'Balancer':
        return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'Architect':
        return 'border-green-400 bg-gradient-to-br from-green-50 to-green-100';
      default:
        return 'border-red-400 bg-gradient-to-br from-red-50 to-red-100';
    }
  };


  const avatarData = getCopy(`results.avatar.${avatar.toLowerCase()}`) as {
    title: string;
    description: string;
    traits?: string[];
  };

  return (
    <AnimatedDiv
      className={`flex flex-col items-center space-y-6 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <AnimatedDiv
        className={`${sizeClasses[size]} rounded-full border-2 ${getAvatarColor(avatar)} flex items-center justify-center backdrop-blur-sm shadow-lg`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-3xl">{getAvatarIcon(avatar)}</span>
      </AnimatedDiv>
      
      <div className="text-center">
        <h3 className="text-3xl font-display font-bold text-slate-800 mb-4">
          {avatarData.title}
        </h3>
        
        {showDescription && (
          <AnimatedP
            className="text-slate-600 max-w-lg leading-relaxed text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {avatarData.description}
          </AnimatedP>
        )}

        {showDescription && avatarData.traits && (
          <AnimatedDiv
            className="flex flex-wrap gap-3 mt-6 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {avatarData.traits.map((trait: string, index: number) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/80 border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm"
              >
                {trait}
              </span>
            ))}
          </AnimatedDiv>
        )}
      </div>
    </AnimatedDiv>
  );
}
