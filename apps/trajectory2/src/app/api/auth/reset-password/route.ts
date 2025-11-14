import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRole } from '@/lib/supabase';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit, rateLimitConfigs, createRateLimitResponse } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

// Create rate limiter for password reset
const resetLimiter = rateLimit(rateLimitConfigs.passwordReset);

// POST /api/auth/reset-password - Request password reset
export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const { isAllowed, reset } = await resetLimiter(request);
    if (!isAllowed) {
      return createRateLimitResponse(reset);
    }
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Auth service not configured' },
        { status: 500 }
      );
    }

    // Generate password reset link (works even if user doesn't exist to prevent email enumeration)
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      }
    });

    // Always return success to prevent email enumeration
    if (resetError || !resetData) {
      logger.info('Password reset requested (always returning success to prevent enumeration)', email);
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // Send reset email
    const emailResult = await sendPasswordResetEmail({
      to: email,
      userName: email.split('@')[0],
      resetUrl: resetData.properties?.hashed_token
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetData.properties.hashed_token}&type=recovery`
        : resetData.properties?.action_link || ''
    });

    // Don't reveal if email send failed to prevent enumeration
    if (!emailResult.success) {
      logger.error('Failed to send reset email', emailResult.error);
    }

    // Try to log password reset attempt if user exists (but don't fail if it doesn't)
    if (resetData.user) {
      try {
        await supabase
          .from('auth_events')
          .insert({
            user_id: resetData.user.id,
            event_type: 'password_reset_requested',
            metadata: {
              email: email,
              timestamp: new Date().toISOString()
            }
          })
          .select();
      } catch (err) {
        logger.error('Failed to log auth event', err as Error);
      }
    }

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link.'
    });
  } catch (error) {
    logger.error('Password reset error', error as Error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}

// PUT /api/auth/reset-password - Update password with reset token
export async function PUT(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Auth service not configured' },
        { status: 500 }
      );
    }

    // Verify token and update password
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery',
    });

    if (error) {
      logger.error('Token verification error', error);
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      data.user.id,
      { password }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Log successful password reset
    await supabase
      .from('auth_events')
      .insert({
        user_id: data.user.id,
        event_type: 'password_reset_completed',
        metadata: {
          timestamp: new Date().toISOString()
        }
      })
      .select();

    return NextResponse.json({
      message: 'Password successfully reset',
      user: {
        email: data.user.email,
        id: data.user.id
      }
    });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'An error occurred updating your password' },
      { status: 500 }
    );
  }
}
