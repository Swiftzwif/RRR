# Environment Variables Setup

Create a `.env.local` file in the root of the `trajectory2` app with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings
# https://supabase.com/dashboard/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Get Your Supabase Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to Settings > API
4. Copy the "Project URL" and paste it as `NEXT_PUBLIC_SUPABASE_URL`
5. Copy the "anon/public" key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Email Template Configuration

To support email confirmations, update your Supabase Auth email templates:

1. Go to Authentication > Email Templates in your Supabase dashboard
2. Select the "Confirm signup" template
3. Change `{{ .ConfirmationURL }}` to:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

