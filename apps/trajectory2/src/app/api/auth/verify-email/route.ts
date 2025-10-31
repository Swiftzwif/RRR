import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRole } from '@/lib/supabase';
import { sendEmailVerification } from '@/lib/email';

// POST /api/auth/verify-email - Send verification email
export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json();

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or user ID is required' },
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

    // Get user
    let user;
    if (userId) {
      const { data, error } = await supabase.auth.admin.getUserById(userId);
      if (error || !data) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      user = data.user;
    } else {
      const { data, error } = await supabase.auth.admin.getUserByEmail(email);
      if (error || !data) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      user = data;
    }

    // Check if already verified
    if (user.email_confirmed_at) {
      return NextResponse.json({
        message: 'Email already verified',
        verified: true
      });
    }

    // Generate verification link
    const { data: verifyData, error: verifyError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: user.email!,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-success`,
      }
    });

    if (verifyError || !verifyData) {
      console.error('Error generating verification link:', verifyError);
      return NextResponse.json(
        { error: 'Failed to generate verification link' },
        { status: 500 }
      );
    }

    // Send verification email
    const emailResult = await sendEmailVerification({
      to: user.email!,
      userName: user.user_metadata?.name || user.email!.split('@')[0],
      verificationUrl: verifyData.properties.hashed_token
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${verifyData.properties.hashed_token}&type=signup`
        : verifyData.properties.action_link || ''
    });

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Verification email sent',
      email: user.email
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    );
  }
}

// GET /api/auth/verify-email - Verify email with token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
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

    // Verify the token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as 'signup' | 'email' || 'signup',
    });

    if (error || !data.user) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user as verified
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      data.user.id,
      {
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          ...data.user.user_metadata,
          email_verified: true
        }
      }
    );

    if (updateError) {
      console.error('Failed to update user verification status:', updateError);
    }

    // Log verification
    await supabase
      .from('auth_events')
      .insert({
        user_id: data.user.id,
        event_type: 'email_verified',
        metadata: {
          email: data.user.email,
          timestamp: new Date().toISOString()
        }
      })
      .select();

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/auth/verify-success', process.env.NEXT_PUBLIC_APP_URL || request.url)
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred verifying your email' },
      { status: 500 }
    );
  }
}