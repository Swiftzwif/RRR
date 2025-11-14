# GitHub Secrets Setup Guide for AI Team

This guide will walk you through setting up the required API keys for the GitHub Actions AI Team.

## Required API Keys

You'll need API keys from one or more of the following providers:

### 1. OpenAI (Recommended for Strategic Thinking)
- **Get Key**: https://platform.openai.com/api-keys
- **Secret Name**: `OPENAI_API_KEY`
- **Used By**: CEO Bot, CMO Bot, Emergency Response
- **Models**: GPT-4o, GPT-4o-mini, GPT-3.5-turbo

### 2. Anthropic (Recommended for Code & Technical Analysis)
- **Get Key**: https://console.anthropic.com/settings/keys
- **Secret Name**: `ANTHROPIC_API_KEY`
- **Used By**: CTO Bot, Security Bot, PRD Bot
- **Models**: Claude 3.5 Sonnet, Claude 3 Haiku

### 3. OpenRouter (Optional - Access to Multiple Models)
- **Get Key**: https://openrouter.ai/keys
- **Secret Name**: `OPENROUTER_API_KEY`
- **Used By**: Fallback for any bot
- **Models**: Access to 100+ models

### 4. Together AI (Optional - Open Source Models)
- **Get Key**: https://api.together.xyz/settings/api-keys
- **Secret Name**: `TOGETHER_API_KEY`
- **Used By**: Budget-conscious operations
- **Models**: Mixtral, Llama 3, CodeLlama

### 5. Groq (Optional - Ultra-fast Inference)
- **Get Key**: https://console.groq.com/keys
- **Secret Name**: `GROQ_API_KEY`
- **Used By**: Real-time responses, Standup Bot
- **Models**: Llama 3, Mixtral (fast inference)

## How to Add Secrets to GitHub

### Step 1: Navigate to Settings
1. Go to your repository on GitHub
2. Click on **Settings** tab (you need admin access)
3. In the left sidebar, find **Secrets and variables**
4. Click on **Actions**

### Step 2: Add Each Secret
1. Click **New repository secret**
2. Enter the secret name exactly as shown above (e.g., `OPENAI_API_KEY`)
3. Paste your API key in the value field
4. Click **Add secret**

### Step 3: Verify Secrets
After adding, you should see all your secrets listed (values will be hidden):
- OPENAI_API_KEY
- ANTHROPIC_API_KEY
- OPENROUTER_API_KEY (optional)
- TOGETHER_API_KEY (optional)
- GROQ_API_KEY (optional)

## Testing Your Setup

After adding the secrets, you can test by:
1. Going to the **Actions** tab
2. Running the "Test API Keys" workflow
3. Checking the logs (API keys will be masked)

## Security Best Practices

1. **Never commit API keys** to your repository
2. **Rotate keys regularly** (every 90 days recommended)
3. **Use different keys** for different environments (dev/prod)
4. **Monitor usage** through each provider's dashboard
5. **Set spending limits** where available

## Minimum Requirements

At minimum, you need ONE of:
- `OPENAI_API_KEY` OR
- `ANTHROPIC_API_KEY` OR
- `OPENROUTER_API_KEY`

For best results, having both OpenAI and Anthropic keys is recommended.

## Cost Estimates

With intelligent routing and a $100/month budget:
- **OpenAI**: ~$40-50/month for strategic decisions
- **Anthropic**: ~$30-40/month for code reviews
- **Others**: ~$10-20/month for auxiliary tasks

## Troubleshooting

### Secret Not Found Error
- Ensure the secret name matches exactly (case-sensitive)
- Check that the secret is added to the correct repository
- Verify you're not in a forked repository

### API Key Invalid Error
- Double-check you copied the entire key
- Ensure no extra spaces or newlines
- Verify the key hasn't been revoked

### Rate Limit Errors
- The system will automatically switch to backup models
- Consider adding more provider keys for redundancy

## Next Steps

Once your secrets are set up:
1. The AI team will automatically start working
2. Monitor costs via the CFO Bot reports
3. Adjust model preferences in `.github/ai-team/configs/`
4. Use `/pull-team-focus` command to interact with the team

For questions or issues, create an issue with the `ai-team` label.
