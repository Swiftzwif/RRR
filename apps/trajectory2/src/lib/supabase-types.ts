// ============================================
// AUTO-GENERATED SUPABASE TYPES
// Generated: $(date)
// DO NOT EDIT MANUALLY
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_config: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          is_encrypted: boolean
          is_secret: boolean
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_encrypted?: boolean
          is_secret?: boolean
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_encrypted?: boolean
          is_secret?: boolean
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          answers: Json
          avatar: string
          created_at: string | null
          domain_scores: Json
          email: string | null
          id: string
          score: number
          user_id: string | null
          user_tier: Database["public"]["Enums"]["user_tier"] | null
        }
        Insert: {
          answers: Json
          avatar: string
          created_at?: string | null
          domain_scores: Json
          email?: string | null
          id?: string
          score: number
          user_id?: string | null
          user_tier?: Database["public"]["Enums"]["user_tier"] | null
        }
        Update: {
          answers?: Json
          avatar?: string
          created_at?: string | null
          domain_scores?: Json
          email?: string | null
          id?: string
          score?: number
          user_id?: string | null
          user_tier?: Database["public"]["Enums"]["user_tier"] | null
        }
        Relationships: []
      }
      coaching_applications: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          available_for_admin: boolean
          available_for_free: boolean
          available_for_lifetime: boolean
          available_for_premium: boolean
          created_at: string | null
          description: string | null
          feature_key: string
          feature_name: string
          free_tier_limit: number | null
          id: string
          is_enabled: boolean
          metadata: Json | null
          premium_tier_limit: number | null
          updated_at: string | null
        }
        Insert: {
          available_for_admin?: boolean
          available_for_free?: boolean
          available_for_lifetime?: boolean
          available_for_premium?: boolean
          created_at?: string | null
          description?: string | null
          feature_key: string
          feature_name: string
          free_tier_limit?: number | null
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          premium_tier_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          available_for_admin?: boolean
          available_for_free?: boolean
          available_for_lifetime?: boolean
          available_for_premium?: boolean
          created_at?: string | null
          description?: string | null
          feature_key?: string
          feature_name?: string
          free_tier_limit?: number | null
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          premium_tier_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount_cents: number
          billing_period: string | null
          cancelled_at: string | null
          created_at: string | null
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          tier: Database["public"]["Enums"]["user_tier"]
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          billing_period?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["user_tier"]
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          billing_period?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tier?: Database["public"]["Enums"]["user_tier"]
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          login_count: number
          metadata: Json | null
          onboarding_completed: boolean
          phone: string | null
          preferences: Json | null
          tier: Database["public"]["Enums"]["user_tier"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login_at?: string | null
          login_count?: number
          metadata?: Json | null
          onboarding_completed?: boolean
          phone?: string | null
          preferences?: Json | null
          tier?: Database["public"]["Enums"]["user_tier"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          login_count?: number
          metadata?: Json | null
          onboarding_completed?: boolean
          phone?: string | null
          preferences?: Json | null
          tier?: Database["public"]["Enums"]["user_tier"]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_feature_usage: {
        Row: {
          created_at: string | null
          feature_key: string
          id: string
          last_used_at: string | null
          period_end: string | null
          period_start: string | null
          updated_at: string | null
          usage_count: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature_key: string
          id?: string
          last_used_at?: string | null
          period_end?: string | null
          period_start?: string | null
          updated_at?: string | null
          usage_count?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature_key?: string
          id?: string
          last_used_at?: string | null
          period_end?: string | null
          period_start?: string | null
          updated_at?: string | null
          usage_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feature_usage_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["feature_key"]
          }
        ]
      }
      user_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_cents: number
          created_at: string | null
          id: string
          payment_status: string | null
          product: string
          square_payment_id: string | null
          stripe_session_id: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          id?: string
          payment_status?: string | null
          product: string
          square_payment_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          id?: string
          payment_status?: string | null
          product?: string
          square_payment_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          }
        ]
      }
      user_progress: {
        Row: {
          completion_percentage: number | null
          course_module: string | null
          id: string
          notes: string | null
          status: string
          time_spent_minutes: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completion_percentage?: number | null
          course_module?: string | null
          id?: string
          notes?: string | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completion_percentage?: number | null
          course_module?: string | null
          id?: string
          notes?: string | null
          status?: string
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_premium_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      has_active_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      can_access_feature: {
        Args: { user_uuid: string; feature: string }
        Returns: boolean
      }
      check_feature_limit: {
        Args: { user_uuid: string; feature: string }
        Returns: boolean
      }
      increment_feature_usage: {
        Args: { user_uuid: string; feature: string }
        Returns: boolean
      }
      grant_premium_access: {
        Args: {
          user_uuid: string
          subscription_tier?: Database["public"]["Enums"]["user_tier"]
          duration_months?: number
          provider?: Database["public"]["Enums"]["payment_provider"]
          amount?: number
        }
        Returns: string
      }
      upgrade_to_premium: {
        Args: {
          user_uuid: string
          payment_amount: number
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_sub_id?: string
        }
        Returns: Json
      }
      cancel_subscription: {
        Args: { user_uuid: string; immediate?: boolean }
        Returns: Json
      }
    }
    Enums: {
      payment_provider: "stripe" | "square" | "manual"
      subscription_status: "active" | "cancelled" | "expired" | "trial" | "paused"
      user_tier: "free" | "premium" | "lifetime" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
