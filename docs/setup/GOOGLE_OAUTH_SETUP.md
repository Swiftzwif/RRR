# Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication for the Trajectory platform.

## Prerequisites

- A Google Cloud Platform (GCP) account
- A Supabase project with authentication enabled
- Access to your Supabase dashboard

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type (unless you have a Google Workspace)
   - Fill in the required fields:
     - App name: `Trajectory`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (if app is in testing mode)

6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Trajectory Web Client`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://trajectorygroup.org
     https://your-vercel-url.vercel.app
     ```
   - **Authorized redirect URIs**:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
     Replace `your-project` with your Supabase project reference ID

7. Click **Create** and copy:
   - **Client ID**
   - **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the provider list and click to enable it
5. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client secret (for OAuth)**: Paste your Google Client Secret
6. Click **Save**

## Step 3: Configure Redirect URLs

In Supabase Dashboard:

1. Go to **Authentication** > **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `https://trajectorygroup.org`
   - **Redirect URLs**: Add all your application URLs:
     ```
     http://localhost:3000/**
     https://trajectorygroup.org/**
     https://your-vercel-url.vercel.app/**
     ```

## Step 4: Update Environment Variables

Your environment variables are already configured in `.env.local`. Ensure these are set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://trajectorygroup.org
```

The Google OAuth credentials are stored securely in Supabase and don't need to be in your `.env.local` file.

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` or `/raffle`

3. Click the **Continue with Google** button

4. You should be redirected to Google's sign-in page

5. After signing in, you should be redirected back to your app and logged in

## Troubleshooting

### "Redirect URI mismatch" error

- Ensure the redirect URI in Google Cloud Console exactly matches:
  `https://your-project.supabase.co/auth/v1/callback`
- Check that your Supabase project reference ID is correct

### "Invalid client" errorlogged in

- Verify Client ID and Client Secret in Supabase dashboard
- Ensure Google OAuth is enabled in Supabase

### User not being created

- Check Supabase logs in the dashboard
- Verify email permissions are granted in Google OAuth consent screen

### Session not persisting

- Check browser cookies are enabled
- Verify middleware is running correctly
- Check Supabase cookie configuration

## Security Best Practices

1. **Never commit credentials**: Google Client Secret should never be in version control
2. **Use environment-specific credentials**: Use different OAuth apps for development and production
3. **Limit redirect URIs**: Only add URIs you actually use
4. **Review OAuth scopes**: Only request necessary scopes (email, profile)
5. **Monitor usage**: Regularly check Google Cloud Console for unusual activity

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
