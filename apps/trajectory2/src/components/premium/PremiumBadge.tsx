// ============================================
// PREMIUM BADGE COMPONENT
// ============================================
// Shows a premium badge for premium users

import { isPremiumUser } from '@/lib/supabase-premium';

interface PremiumBadgeProps {
  userId: string;
  variant?: 'default' | 'large' | 'compact';
}

/**
 * Premium Badge Component
 * 
 * Displays a premium badge for users with premium tier.
 * Only shows if user is actually premium.
 * 
 * @example
 * ```tsx
 * <PremiumBadge userId={user.id} />
 * <PremiumBadge userId={user.id} variant="large" />
 * ```
 */
export async function PremiumBadge({ userId, variant = 'default' }: PremiumBadgeProps) {
  const isPremium = await isPremiumUser(userId);

  if (!isPremium) return null;

  const variantStyles = {
    default: 'px-2 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
    compact: 'px-1.5 py-0.5 text-[10px]',
  };

  return (
    <span
      className={`bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded uppercase inline-flex items-center gap-1 ${variantStyles[variant]}`}
    >
      <svg
        className={variant === 'compact' ? 'w-2 h-2' : 'w-3 h-3'}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
          clipRule="evenodd"
        />
      </svg>
      PREMIUM
    </span>
  );
}
