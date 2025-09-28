'use client';

import { cn } from '@/lib/utils';

interface CTAButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function CTAButton({
  variant,
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  className = ''
}: CTAButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80',
    secondary: 'bg-gray-100 text-ink hover:bg-gray-200 active:bg-gray-300 border border-gray-200'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
