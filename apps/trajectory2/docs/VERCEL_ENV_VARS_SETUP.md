# Setting Environment Variables in Vercel

Quick guide to add ConvertKit credentials to your Vercel production environment.

## Quick Steps

### 1. Access Your Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: **rrr-trajectory2-eyjw**

### 2. Navigate to Environment Variables

1. Click **Settings** in the top navigation
2. Click **Environment Variables** in the left sidebar

### 3. Add ConvertKit API Key

1. Click **Add New**
2. Enter the following:
   - **Key**: `CONVERTKIT_API_KEY`
   - **Value**: `kit_your_convertkit_api_key_here` (get from ConvertKit settings)
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### 4. Add ConvertKit Form ID

1. Click **Add New** again
2. Enter the following:
   - **Key**: `CONVERTKIT_FORM_ID`
   - **Value**: `384eb35d37`
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### 5. Redeploy Your Application

⚠️ **Important**: Environment variables only apply to new deployments!

1. Go to **Deployments** tab
2. Click the **...** menu on your latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

### 6. Verify Setup

After redeployment, test by:
1. Submitting a giveaway entry on your live site
2. Checking Vercel logs for errors
3. Checking ConvertKit dashboard for new subscribers

## Screenshot Guide

Your environment variables should look like this:

```
CONVERTKIT_API_KEY = kit_your_convertkit_api_key_here
  ☑️ Production  ☑️ Preview  ☑️ Development

CONVERTKIT_FORM_ID = 384eb35d37
  ☑️ Production  ☑️ Preview  ☑️ Development
```

## Troubleshooting

**Environment variables not working?**
- Make sure you clicked "Redeploy" after adding them
- Check that all three environments are selected
- Verify the values are exactly correct (no extra spaces)

**Need to update values?**
- Click the ✏️ edit icon next to any variable
- Update the value
- Save and redeploy

## Security Notes

✅ These values are already in your `env.template` file  
✅ They're safe to use in production (they're your actual credentials)  
✅ Never share your API keys publicly  

## Next Steps

After configuring Vercel:
1. ✅ Test giveaway submission
2. ✅ Monitor ConvertKit for new subscribers
3. 📧 Set up welcome email sequences in ConvertKit
4. 📊 Track newsletter engagement

