# ConvertKit Setup Guide

Complete guide for configuring ConvertKit newsletter integration for the giveaway system.

## Overview

ConvertKit is used to automatically subscribe giveaway entrants to your newsletter. The integration uses ConvertKit's V4 API to subscribe users via form submissions.

## Prerequisites

1. **ConvertKit Account**: Sign up at [convertkit.com](https://convertkit.com)
2. **Active Form**: Create a form in your ConvertKit account
3. **API Access**: Get your API secret key from ConvertKit settings

## Step-by-Step Setup

### 1. Create a ConvertKit Form

1. Log in to your ConvertKit account
2. Navigate to **Forms** → **Create Form**
3. Choose your form type (Inline, Popup, etc.)
4. Configure your form fields:
   - Email (required)
   - First Name (recommended)
   - Last Name (recommended)
5. Save the form and note the **Form ID** from the URL or form settings

**Form ID example**: `384eb35d37` (from URL: `convertkit.com/forms/384eb35d37`)

### 2. Get Your API Secret Key

1. In ConvertKit, go to **Settings** → **Advanced**
2. Find **API Secret** section
3. Copy your API Secret Key (starts with `kit_`)

**Example**: `kit_cb18ffdfde4e1b340d6e5bcdc35bd8cf`

⚠️ **Security**: Keep this key secure! Never commit it to public repositories.

### 3. Configure Environment Variables

#### Local Development (.env.local)

Add these variables to your `apps/trajectory2/.env.local` file:

```bash
# ConvertKit Configuration
CONVERTKIT_API_KEY=kit_your_api_key_here
CONVERTKIT_FORM_ID=your_form_id_here
```

**Example**:

```bash
CONVERTKIT_API_KEY=kit_cb18ffdfde4e1b340d6e5bcdc35bd8cf
CONVERTKIT_FORM_ID=384eb35d37
```

#### Production (Vercel)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **rrr-trajectory2-eyjw**
3. Navigate to **Settings** → **Environment Variables**
4. Add these variables:
   - **Name**: `CONVERTKIT_API_KEY`
     - **Value**: Your API Secret Key
     - **Environment**: Production, Preview, Development
   - **Name**: `CONVERTKIT_FORM_ID`
     - **Value**: Your Form ID
     - **Environment**: Production, Preview, Development
5. Click **Save**
6. **Redeploy** your application for changes to take effect

### 4. Verify Configuration

#### Test the Integration

You can test the ConvertKit integration by:

1. **Submitting a test giveaway entry** through your form
2. **Checking ConvertKit** for the new subscriber
3. **Checking server logs** for any errors

#### Check Server Logs

When a giveaway entry is submitted, look for these log messages:

**Success**:

```
Newsletter subscription successful: { email, subscriber_id }
```

**Warning (ConvertKit failure, but entry still saved)**:

```
ConvertKit subscription failed: Error message here
```

⚠️ **Note**: Even if ConvertKit subscription fails, the giveaway entry is still saved. This ensures users can enter giveaways even if the newsletter service is temporarily down.

## Optional: Configure Tags

The giveaway integration automatically tags subscribers with `giveaway-entry`. To add more tags:

1. In ConvertKit, create your tags under **Subscribers** → **Tags**
2. Update the tag list in `src/app/api/giveaway/entry/route.ts`:

```typescript
const subscriptionResult = await subscribeToForm({
  email: validatedData.email,
  first_name: validatedData.first_name,
  last_name: validatedData.last_name,
  form_id: CONVERTKIT_FORM_ID,
  tags: ['giveaway-entry', 'your-custom-tag'], // Add more tags here
});
```

## Troubleshooting

### Issue: "CONVERTKIT_API_KEY is not set" Warning

**Cause**: Environment variables not configured in Vercel

**Solution**:

1. Add `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID` to Vercel Environment Variables
2. Redeploy the application

### Issue: "Newsletter form not found"

**Cause**: Invalid Form ID or API Key

**Solution**:

1. Verify the Form ID in your ConvertKit account
2. Check that your API Secret Key is correct
3. Ensure you're using Vercel Production environment, not Preview

### Issue: "Failed to subscribe to newsletter"

**Cause**: API authentication error or rate limit

**Solution**:

1. Check your ConvertKit account limits
2. Verify the API Secret Key has proper permissions
3. Check ConvertKit's status page for service issues

### Issue: Subscribers not appearing in ConvertKit

**Possible Causes**:

1. Email confirmation required (check ConvertKit form settings)
2. API Key doesn't have permission for that form
3. Form is disabled or deleted

**Solution**:

1. Check ConvertKit form settings for double opt-in
2. Verify the Form ID matches an active form
3. Test the API manually with curl:

```bash
curl -X POST "https://api.convertkit.com/v4/forms/384eb35d37/subscribe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer kit_your_api_key_here" \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }'
```

## API Reference

### Endpoint

```
POST https://api.convertkit.com/v4/forms/{form_id}/subscribe
```

### Authentication

```
Authorization: Bearer {api_secret_key}
```

### Request Body

```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Response

```json
{
  "subscription": {
    "id": "12345",
    "subscriber": {
      "id": "67890",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "state": "active"
    },
    "state": "active",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Monitor API usage** in ConvertKit dashboard
5. **Set up rate limiting** (already configured in code)

## Cost Considerations

ConvertKit pricing:

- **Free**: Up to 300 subscribers
- **Creator**: $9/month for 1,000 subscribers
- **Creator Pro**: $19/month for 1,000 subscribers

📚 **More Info**: [ConvertKit Pricing](https://convertkit.com/pricing)

## Next Steps

1. ✅ Configure environment variables
2. ✅ Test giveaway entry submission
3. ✅ Verify subscribers in ConvertKit
4. 📧 Create email sequences for new subscribers
5. 📊 Set up ConvertKit analytics tracking

## Additional Resources

- [ConvertKit API Documentation](https://developers.convertkit.com/)
- [ConvertKit Forms Guide](https://help.convertkit.com/en/articles/2502728-the-forms-ultimate-guide)
- [ConvertKit Tags Guide](https://help.convertkit.com/en/articles/2502684-using-tags-and-segments-ultimate-guide)

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review ConvertKit API status
3. Check application logs in Vercel
4. Contact ConvertKit support if API issues persist
