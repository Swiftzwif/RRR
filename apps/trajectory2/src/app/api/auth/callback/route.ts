import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const action = requestUrl.searchParams.get('action');

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser();

      if (user && action === 'payment') {
        // Redirect to payment with user ID
        return NextResponse.redirect(
          new URL(`/raffle?auth=success&user=${user.id}`, requestUrl.origin)
        );
      }

      // Default redirect
      return NextResponse.redirect(new URL(redirect, requestUrl.origin));
    }
  }

  // Return to origin on error
  return NextResponse.redirect(
    new URL('/raffle?auth=error', requestUrl.origin)
  );
}