# ConvertKit Quick Setup 🚀

**Time needed**: 2 minutes

## You Need To Do This ONE Thing

Add two environment variables to Vercel and redeploy.

## Step-by-Step

### 1️⃣ Go to Vercel Dashboard
👉 https://vercel.com/jaymisons-projects-ce8efa58/rrr-trajectory2-eyjw

### 2️⃣ Add Environment Variables
1. Click **Settings** → **Environment Variables**
2. Click **Add New**
3. Add FIRST variable:
   ```
   Key: CONVERTKIT_API_KEY
   Value: kit_cb18ffdfde4e1b340d6e5bcdc35bd8cf
   Environments: ✅ Production ✅ Preview ✅ Development
   ```
   Click **Save**

4. Click **Add New** again
5. Add SECOND variable:
   ```
   Key: CONVERTKIT_FORM_ID  
   Value: 384eb35d37
   Environments: ✅ Production ✅ Preview ✅ Development
   ```
   Click **Save**

### 3️⃣ Redeploy
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Click **Redeploy**

### 4️⃣ Done! ✅

Your giveaway form will now automatically subscribe users to ConvertKit!

## Test It

1. Go to your live site: trajectorygroup.org
2. Submit a test giveaway entry
3. Check ConvertKit dashboard for the new subscriber

## Need Help?

- Full guide: `docs/CONVERTKIT_SETUP.md`
- Vercel setup: `docs/VERCEL_ENV_VARS_SETUP.md`
- These credentials are already in `env.template` and `.env.local`

