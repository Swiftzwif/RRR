/**
 * Type definitions for giveaway-related entities
 */

/**
 * Prize configuration for giveaway
 */
export interface Prize {
  /** Unique identifier for the prize */
  id?: string;
  /** Type of prize (e.g., "Course Access", "1-on-1 Coaching", "Book Bundle") */
  type: string;
  /** Description or name of the prize */
  value: string;
  /** Number of this prize available to win */
  quantity: number;
  /** Display order/priority */
  order?: number;
}

/**
 * Giveaway entry from database
 */
export interface GiveawayEntry {
  /** Unique entry ID */
  id: string;
  /** Reference to giveaway configuration */
  giveaway_id?: string;
  /** Participant email address */
  email: string;
  /** Participant first name */
  first_name: string;
  /** Participant last name */
  last_name: string;
  /** Sequential entry number */
  entry_number: number;
  /** User's transformation goal (optional) */
  transformation_goal: string | null;
  /** Whether entry has been selected as winner */
  is_winner: boolean;
  /** Prize won (if applicable) */
  prize_won: string | null;
  /** When entry was created */
  created_at: string;
  /** Whether user subscribed to newsletter */
  newsletter_subscribed: boolean;
  /** Whether entry has been manually verified */
  verified: boolean;
  /** ConvertKit subscriber ID (if subscribed) */
  convertkit_subscriber_id: string | null;
  /** Whether user liked the social media post */
  liked_post: boolean;
  /** Whether user shared the social media post */
  shared_post: boolean;
  /** Whether user tagged a friend */
  tagged_friend: boolean;
}

/**
 * Giveaway configuration from database
 */
export interface GiveawayConfig {
  /** Unique config ID */
  id: string;
  /** Display name of giveaway */
  name: string;
  /** Current status */
  status: 'active' | 'ended' | 'draft';
  /** Start date of giveaway */
  start_date: string;
  /** End date of giveaway */
  end_date: string;
  /** Array of available prizes */
  prizes: Prize[];
}

/**
 * Winner selection result
 */
export interface Winner {
  /** The winning entry */
  entry: GiveawayEntry;
  /** The prize they won */
  prize: Prize;
}

/**
 * Statistics for giveaway dashboard
 */
export interface GiveawayStats {
  /** Total number of entries */
  totalEntries: number;
  /** Number of verified entries */
  verifiedEntries: number;
  /** Number subscribed to newsletter */
  newsletterSubscribed: number;
  /** Average length of transformation goals */
  averageGoalLength: number;
  /** Most common words in transformation goals */
  topGoalWords: string[];
  /** Entry counts by date */
  entriesPerDay: Record<string, number>;
}
