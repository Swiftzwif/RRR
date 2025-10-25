// ============================================
// FEATURE GATE COMPONENT
// ============================================
// Server component that checks feature access and shows upgrade prompt if needed

import { canAccessFeature } from '@/lib/supabase-premium';
import { UpgradePrompt } from './UpgradePrompt';

interface FeatureGateProps {
  userId: string;
  featureKey: string;
  featureName?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Feature Gate Component
 * 
 * Wraps content that requires premium access. Shows upgrade prompt if user
 * doesn't have access to the feature.
 * 
 * @example
 * ```tsx
 * <FeatureGate 
 *   userId={user.id} 
 *   featureKey="course_access" 
 *   featureName="Full Course"
 * >
 *   <CourseContent />
 * </FeatureGate>
 * ```
 */
export async function FeatureGate({
  userId,
  featureKey,
  featureName,
  children,
  fallback,
}: FeatureGateProps) {
  const canAccess = await canAccessFeature(userId, featureKey);

  if (!canAccess) {
    return fallback || <UpgradePrompt feature={featureName || featureKey} />;
  }

  return <>{children}</>;
}
