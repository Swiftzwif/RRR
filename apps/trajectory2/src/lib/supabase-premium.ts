// ============================================
// TRAJECTORY PREMIUM USER HELPER FUNCTIONS
// ============================================
// Comprehensive helper functions for managing premium users,
// subscriptions, feature access, and usage tracking

import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase-types';

// Type aliases for convenience
export type UserTier = Database['public']['Enums']['user_tier'];
export type SubscriptionStatus = Database['public']['Enums']['subscription_status'];
export type PaymentProvider = Database['public']['Enums']['payment_provider'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];

// Initialize Supabase client with types
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

/**
 * Get user profile with tier and status
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

/**
 * Check if user is premium (any premium tier)
 */
export async function isPremiumUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('is_premium_user', { user_uuid: userId });

  if (error) {
    console.error('Error checking premium status:', error);
    return false;
  }

  return data ?? false;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }

  return true;
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await supabase
    .from('user_profiles')
    .update({
      last_login_at: new Date().toISOString(),
      login_count: supabase.sql`login_count + 1`,
    } as any)
    .eq('id', userId);
}

// ============================================
// SUBSCRIPTION FUNCTIONS
// ============================================

/**
 * Get active subscription for user
 */
export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_active_subscription', { user_uuid: userId });

  if (error) {
    console.error('Error checking subscription:', error);
    return false;
  }

  return data ?? false;
}

/**
 * Upgrade user to premium
 */
export async function upgradeToPremium(
  userId: string,
  paymentAmount: number,
  provider: PaymentProvider = 'stripe',
  providerSubId?: string
): Promise<{ success: boolean; subscription_id?: string; message: string }> {
  const { data, error } = await supabase
    .rpc('upgrade_to_premium', {
      user_uuid: userId,
      payment_amount: paymentAmount,
      provider,
      provider_sub_id: providerSubId,
    });

  if (error) {
    console.error('Error upgrading to premium:', error);
    return { success: false, message: error.message };
  }

  return data as any;
}

/**
 * Cancel user subscription
 */
export async function cancelSubscription(
  userId: string,
  immediate: boolean = false
): Promise<{ success: boolean; message: string }> {
  const { data, error } = await supabase
    .rpc('cancel_subscription', {
      user_uuid: userId,
      immediate,
    });

  if (error) {
    console.error('Error cancelling subscription:', error);
    return { success: false, message: error.message };
  }

  return data as any;
}

/**
 * Get subscription history for user
 */
export async function getSubscriptionHistory(userId: string): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscription history:', error);
    return [];
  }

  return data ?? [];
}

// ============================================
// FEATURE ACCESS FUNCTIONS
// ============================================

/**
 * Get all feature flags
 */
export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('is_enabled', true)
    .order('feature_name');

  if (error) {
    console.error('Error fetching feature flags:', error);
    return [];
  }

  return data ?? [];
}

/**
 * Check if user can access a feature
 */
export async function canAccessFeature(
  userId: string,
  featureKey: string
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('can_access_feature', {
      user_uuid: userId,
      feature: featureKey,
    });

  if (error) {
    console.error('Error checking feature access:', error);
    return false;
  }

  return data ?? false;
}

/**
 * Check if user is within feature usage limit
 */
export async function checkFeatureLimit(
  userId: string,
  featureKey: string
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('check_feature_limit', {
      user_uuid: userId,
      feature: featureKey,
    });

  if (error) {
    console.error('Error checking feature limit:', error);
    return false;
  }

  return data ?? false;
}

/**
 * Increment feature usage count
 */
export async function incrementFeatureUsage(
  userId: string,
  featureKey: string
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('increment_feature_usage', {
      user_uuid: userId,
      feature: featureKey,
    });

  if (error) {
    console.error('Error incrementing feature usage:', error);
    return false;
  }

  return data ?? false;
}

/**
 * Get user's feature usage statistics
 */
export async function getUserFeatureUsage(userId: string) {
  const { data, error } = await supabase
    .from('user_feature_usage')
    .select('*, feature_flags(*)')
    .eq('user_id', userId)
    .gte('period_end', new Date().toISOString());

  if (error) {
    console.error('Error fetching feature usage:', error);
    return [];
  }

  return data ?? [];
}

// ============================================
// USER ACTIVITY TRACKING
// ============================================

/**
 * Log user activity
 */
export async function logActivity(
  userId: string,
  activityType: string,
  activityData?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await supabase.from('user_activity_log').insert({
    user_id: userId,
    activity_type: activityType,
    activity_data: activityData,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

/**
 * Get user activity log
 */
export async function getUserActivityLog(
  userId: string,
  limit: number = 50
) {
  const { data, error } = await supabase
    .from('user_activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activity log:', error);
    return [];
  }

  return data ?? [];
}

// ============================================
// CONFIGURATION FUNCTIONS
// ============================================

/**
 * Get app configuration value
 */
export async function getConfigValue(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', key)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching config:', error);
    return null;
  }

  return data?.value ?? null;
}

/**
 * Get multiple configuration values
 */
export async function getConfigValues(keys: string[]): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('app_config')
    .select('key, value')
    .in('key', keys)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching configs:', error);
    return {};
  }

  return (data ?? []).reduce((acc, { key, value }) => {
    acc[key] = value ?? '';
    return acc;
  }, {} as Record<string, string>);
}

// ============================================
// HELPER TYPES FOR REACT HOOKS
// ============================================

export interface UserSubscriptionData {
  profile: UserProfile | null;
  subscription: Subscription | null;
  isPremium: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface FeatureAccessResult {
  canAccess: boolean;
  isWithinLimit: boolean;
  currentUsage?: number;
  limit?: number;
}

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Get complete user data (profile + subscription + features)
 */
export async function getCompleteUserData(userId: string) {
  const [profile, subscription, isPremium, featureUsage] = await Promise.all([
    getUserProfile(userId),
    getActiveSubscription(userId),
    isPremiumUser(userId),
    getUserFeatureUsage(userId),
  ]);

  return {
    profile,
    subscription,
    isPremium,
    featureUsage,
  };
}

/**
 * Check multiple features at once
 */
export async function checkMultipleFeatures(
  userId: string,
  featureKeys: string[]
): Promise<Record<string, boolean>> {
  const results = await Promise.all(
    featureKeys.map(async (key) => ({
      key,
      canAccess: await canAccessFeature(userId, key),
    }))
  );

  return results.reduce((acc, { key, canAccess }) => {
    acc[key] = canAccess;
    return acc;
  }, {} as Record<string, boolean>);
}

// ============================================
// FEATURE GATES (React Components Helpers)
// ============================================

/**
 * Feature gate data for displaying upgrade prompts
 */
export interface FeatureGateInfo {
  featureKey: string;
  featureName: string;
  canAccess: boolean;
  requiresTier: UserTier;
  currentTier: UserTier;
  needsUpgrade: boolean;
}

/**
 * Get feature gate information
 */
export async function getFeatureGateInfo(
  userId: string,
  featureKey: string
): Promise<FeatureGateInfo | null> {
  const [profile, feature, canAccess] = await Promise.all([
    getUserProfile(userId),
    supabase.from('feature_flags').select('*').eq('feature_key', featureKey).single(),
    canAccessFeature(userId, featureKey),
  ]);

  if (!profile || !feature.data) {
    return null;
  }

  let requiresTier: UserTier = 'free';
  if (feature.data.available_for_premium && !feature.data.available_for_free) {
    requiresTier = 'premium';
  }

  return {
    featureKey,
    featureName: feature.data.feature_name,
    canAccess,
    requiresTier,
    currentTier: profile.tier,
    needsUpgrade: !canAccess,
  };
}

export default supabase;
