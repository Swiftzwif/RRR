# GitHub Actions AI Team - API Keys Setup Guide

This guide will help you set up the required API keys for your AI-powered GitHub Actions team.

## Required API Keys

You'll need API keys from one or more of these providers:

### 1. OpenAI (Recommended for strategic thinking)
- **Get key**: https://platform.openai.com/api-keys
- **Cost**: ~$0.002/1K tokens for GPT-3.5, ~$0.03/1K tokens for GPT-4
- **Secret name**: `OPENAI_API_KEY`

### 2. Anthropic Claude (Recommended for code analysis)
- **Get key**: https://console.anthropic.com/settings/keys
- **Cost**: ~$0.00025/1K tokens for Haiku, ~$0.003/1K tokens for Sonnet
- **Secret name**: `ANTHROPIC_API_KEY`

### 3. OpenRouter (Optional - access to many models)
- **Get key**: https://openrouter.ai/keys
- **Cost**: Varies by model, generally cheaper
- **Secret name**: `OPENROUTER_API_KEY`

### 4. Together AI (Optional - open source models)
- **Get key**: https://api.together.xyz/settings/api-keys
- **Cost**: Very cheap, ~$0.0002/1K tokens
- **Secret name**: `TOGETHER_API_KEY`

### 5. Groq (Optional - ultra-fast inference)
- **Get key**: https://console.groq.com/keys
- **Cost**: Free tier available, then usage-based
- **Secret name**: `GROQ_API_KEY`

## How to Add Secrets to GitHub

### Step 1: Navigate to Repository Settings
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, find **Secrets and variables**
4. Click on **Actions**

### Step 2: Add Each Secret
1. Click **New repository secret**
2. Enter the secret name exactly as shown above (e.g., `OPENAI_API_KEY`)
3. Paste your API key in the value field
4. Click **Add secret**

### Step 3: Verify Secrets
Your secrets page should show:
- `OPENAI_API_KEY` (if using OpenAI)
- `ANTHROPIC_API_KEY` (if using Claude)
- `OPENROUTER_API_KEY` (optional)
- `TOGETHER_API_KEY` (optional)
- `GROQ_API_KEY` (optional)

## Minimum Requirements

At minimum, you need **at least one** of:
- `OPENAI_API_KEY` OR
- `ANTHROPIC_API_KEY`

For best results, we recommend having both OpenAI and Anthropic keys.

## Security Notes

- **Never commit API keys** to your repository
- GitHub Secrets are encrypted and only exposed to workflows
- Keys are not visible in logs unless explicitly printed
- Rotate keys regularly for security

## Testing Your Setup

After adding secrets, the AI team will automatically:
1. Detect available API keys
2. Choose the best model for each task
3. Fall back to available models if preferred ones are missing
4. Track usage to stay within budget

## Budget Configuration

The system is configured for a $100/month budget by default. To change:
1. Edit `.github/ai-team/config.yml`
2. Update the `monthly_budget` value
3. Commit and push changes

## Troubleshooting

### "API key not found" errors
- Verify secret name matches exactly (case-sensitive)
- Ensure secret is saved in the correct repository
- Check workflow has permission to access secrets

### "Rate limit" errors
- System will automatically switch to backup models
- Consider adding more API providers
- Check cost tracking dashboard

### "Invalid API key" errors
- Regenerate the key from the provider
- Update the secret in GitHub
- Ensure you're using the correct key format

## Next Steps

Once your API keys are set up:
1. The AI team will start working on your next PR/issue
2. Use `/pull-team-focus` in any issue to get team insights
3. Check `.github/ai-team/logs/` for cost tracking
4. Customize bot personalities in config files

Happy coding with your AI team! 🤖
