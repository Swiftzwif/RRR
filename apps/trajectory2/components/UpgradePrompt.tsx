// ============================================
// UPGRADE PROMPT COMPONENT
// ============================================
// Reusable component to show when users hit premium features

import Link from 'next/link';

interface UpgradePromptProps {
  feature?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

/**
 * Upgrade Prompt Component
 * 
 * Shows a professional upgrade prompt when users try to access premium features.
 * Fully customizable with default fallbacks.
 * 
 * @example
 * ```tsx
 * <UpgradePrompt feature="Course Access" />
 * ```
 */
export function UpgradePrompt({
  feature = 'this feature',
  title = 'Upgrade to Premium',
  description,
  ctaText = 'Upgrade Now',
  ctaHref = '/upgrade',
}: UpgradePromptProps) {
  const defaultDescription = `Unlock ${feature} and gain access to the complete Trajectory experience.`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 text-center shadow-2xl">
        {/* Lock Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>

        {/* Description */}
        <p className="text-gray-400 mb-6">{description || defaultDescription}</p>

        {/* CTA Button */}
        <Link
          href={ctaHref}
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
        >
          {ctaText}
        </Link>

        {/* Additional Info */}
        <p className="text-gray-500 text-sm mt-4">
          Join thousands of men transforming their lives
        </p>
      </div>
    </div>
  );
}
