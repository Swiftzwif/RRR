import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendWelcomeEmail, sendEmailVerification } from '@/lib/email';
import { getSupabaseServiceRole } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const action = requestUrl.searchParams.get('action');

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(
        new URL('/login?error=' + encodeURIComponent('Authentication failed. Please try again.'), requestUrl.origin)
      );
    }

    // Get the user after successful exchange
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user after auth:', userError);
      return NextResponse.redirect(
        new URL('/login?error=' + encodeURIComponent('Failed to retrieve user information.'), requestUrl.origin)
      );
    }

    if (user) {
      // Check if this is a new user (welcome email not sent yet)
      // Use metadata flag instead of time-based check to avoid race conditions
      const welcomeEmailSent = user.user_metadata?.welcome_email_sent === true;
      const isNewUser = !welcomeEmailSent;

      if (isNewUser) {
        try {
          const serviceSupabase = getSupabaseServiceRole();
          
          // Send welcome email to new users
          await sendWelcomeEmail({
            to: user.email!,
            userName: user.user_metadata?.name || user.user_metadata?.full_name || user.email!.split('@')[0],
            verificationUrl: user.email_confirmed_at ? undefined : `${requestUrl.origin}/api/auth/verify-email?userId=${user.id}`
          });

          // If email not verified, send verification email
          if (!user.email_confirmed_at && serviceSupabase) {
            // Generate verification link using magiclink type for OAuth users
            const { data: verifyData } = await serviceSupabase.auth.admin.generateLink({
              type: 'magiclink',
              email: user.email!,
              options: {
                redirectTo: `${requestUrl.origin}/auth/verify-success`,
              }
            });

            if (verifyData?.properties) {
              await sendEmailVerification({
                to: user.email!,
                userName: user.user_metadata?.name || user.email!.split('@')[0],
                verificationUrl: verifyData.properties.hashed_token
                  ? `${requestUrl.origin}/api/auth/verify-email?token=${verifyData.properties.hashed_token}&type=magiclink`
                  : verifyData.properties.action_link || ''
              });
            }
          }

          // Mark welcome email as sent to prevent duplicates
          if (serviceSupabase) {
            await serviceSupabase.auth.admin.updateUserById(user.id, {
              user_metadata: {
                ...user.user_metadata,
                welcome_email_sent: true,
                welcome_email_sent_at: new Date().toISOString()
              }
            }).catch(err => {
              console.error('Failed to update welcome_email_sent flag:', err);
              // Don't fail - email was sent
            });
          }
        } catch (emailError) {
          console.error('Failed to send welcome/verification emails:', emailError);
          // Don't fail the auth process if email fails
        }
      }

      if (action === 'payment') {
        // Redirect to payment with user ID
        return NextResponse.redirect(
          new URL(`/raffle?auth=success&user=${user.id}`, requestUrl.origin)
        );
      }

      // Handle redirect from login page or stored redirect
      const redirectUrl = redirect !== '/' ? redirect : '/';
      return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
    }
  }

  // Return to origin on error
  return NextResponse.redirect(
    new URL('/raffle?auth=error', requestUrl.origin)
  );
}
