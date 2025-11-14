/**
 * ConvertKit V4 API Client
 * Handles newsletter subscription for giveaway entries
 */

/**
 * ConvertKit custom field value types
 */
type ConvertKitFieldValue = string | number | boolean | null;

interface ConvertKitSubscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  state: 'active' | 'unsubscribed' | 'bounced' | 'unconfirmed';
  created_at: string;
  fields: Record<string, ConvertKitFieldValue>;
}

interface ConvertKitSubscriptionResponse {
  subscription: {
    id: string;
    subscriber: ConvertKitSubscriber;
    state: 'active' | 'inactive';
    created_at: string;
  };
}

interface SubscribeToFormParams {
  email: string;
  first_name: string;
  last_name: string;
  form_id: string;
  tags?: string[];
}

/**
 * ConvertKit API subscription request body
 */
interface ConvertKitSubscribeRequest {
  email: string;
  first_name: string;
  last_name?: string;
}

import { CONVERTKIT_API_KEY } from './constants';

const CONVERTKIT_API_BASE = 'https://api.convertkit.com/v4';

/**
 * Subscribe a user to a ConvertKit form
 */
export async function subscribeToForm({
  email,
  first_name,
  last_name,
  form_id,
  tags = [],
}: SubscribeToFormParams): Promise<{
  success: boolean;
  subscriber_id?: string;
  error?: string;
}> {
  if (!CONVERTKIT_API_KEY) {
    console.error('CONVERTKIT_API_KEY is not configured');
    return {
      success: false,
      error: 'Newsletter service not configured',
    };
  }

  try {
    // ConvertKit V4 API format
    const subscribeData: ConvertKitSubscribeRequest = {
      email,
      first_name,
      ...(last_name && { last_name }),
    };

    // Add tags if provided (tags need to be created first in ConvertKit)
    // Tags are added separately after subscription for V4
    const response = await fetch(`${CONVERTKIT_API_BASE}/forms/${form_id}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONVERTKIT_API_KEY}`,
      },
      body: JSON.stringify(subscribeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ConvertKit API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // Handle specific error cases
      if (response.status === 422) {
        // Validation error
        return {
          success: false,
          error: errorData.message || 'Invalid email or form configuration',
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: 'Newsletter form not found',
        };
      }

      return {
        success: false,
        error: 'Failed to subscribe to newsletter',
      };
    }

    const data: ConvertKitSubscriptionResponse = await response.json();

    // Extract subscriber ID
    const subscriber_id = data.subscription?.subscriber?.id?.toString();

    return {
      success: true,
      subscriber_id,
    };
  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get subscriber information by email
 */
export async function getSubscriberByEmail(
  email: string
): Promise<{
  success: boolean;
  subscriber?: ConvertKitSubscriber;
  error?: string;
}> {
  if (!CONVERTKIT_API_KEY) {
    return {
      success: false,
      error: 'Newsletter service not configured',
    };
  }

  try {
    const response = await fetch(
      `${CONVERTKIT_API_BASE}/subscribers?api_secret=${CONVERTKIT_API_KEY}&email_address=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: 'Failed to fetch subscriber',
      };
    }

    const data = await response.json();
    const subscribers = data.subscribers || [];

    if (subscribers.length === 0) {
      return {
        success: false,
        error: 'Subscriber not found',
      };
    }

    return {
      success: true,
      subscriber: subscribers[0],
    };
  } catch (error) {
    console.error('ConvertKit get subscriber error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
