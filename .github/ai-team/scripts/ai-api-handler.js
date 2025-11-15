#!/usr/bin/env node

/**
 * AI API Handler for GitHub Actions AI Team
 * Handles intelligent routing between different AI providers
 * Tracks costs and enforces budget limits
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class AIAPIHandler {
  constructor() {
    this.providers = {
      openai: {
        endpoint: 'api.openai.com',
        path: '/v1/chat/completions',
        apiKeyEnv: 'OPENAI_API_KEY',
        models: {
          'gpt-4o': { costPer1k: 0.005, contextWindow: 128000 },
          'gpt-4o-mini': { costPer1k: 0.00015, contextWindow: 128000 },
          'gpt-3.5-turbo': { costPer1k: 0.0005, contextWindow: 16385 }
        }
      },
      anthropic: {
        endpoint: 'api.anthropic.com',
        path: '/v1/messages',
        apiKeyEnv: 'ANTHROPIC_API_KEY',
        models: {
          'claude-3-5-sonnet-20241022': { costPer1k: 0.003, contextWindow: 200000 },
          'claude-3-sonnet-20240229': { costPer1k: 0.003, contextWindow: 200000 },
          'claude-3-haiku-20240307': { costPer1k: 0.00025, contextWindow: 200000 }
        }
      },
      openrouter: {
        endpoint: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        apiKeyEnv: 'OPENROUTER_API_KEY',
        models: {
          'mixtral-8x7b-instruct': { costPer1k: 0.00024, contextWindow: 32768 },
          'llama-3-70b-instruct': { costPer1k: 0.00059, contextWindow: 8192 }
        }
      }
    };

    this.costTrackerPath = process.env.GITHUB_WORKSPACE 
      ? path.join(process.env.GITHUB_WORKSPACE, '.github/ai-team/cost-tracker.json')
      : '.github/ai-team/cost-tracker.json';
  }

  async callAI(botName, prompt, config = {}) {
    const startTime = Date.now();
    
    try {
      // Load current cost data
      const costData = this.loadCostData();
      const currentMonthSpend = this.getCurrentMonthSpend(costData);
      
      // Determine which model to use based on budget
      const modelConfig = this.selectModel(botName, currentMonthSpend, config);
      
      console.log(`[${botName}] Using model: ${modelConfig.model} (${modelConfig.reason})`);
      
      // Make API call
      const response = await this.makeAPICall(modelConfig, prompt, config);
      
      // Track costs
      const tokensUsed = response.usage?.total_tokens || 0;
      const cost = this.calculateCost(modelConfig.model, tokensUsed);
      await this.updateCostTracking(botName, modelConfig.model, tokensUsed, cost);
      
      // Log performance
      const duration = Date.now() - startTime;
      console.log(`[${botName}] Response in ${duration}ms, tokens: ${tokensUsed}, cost: $${cost.toFixed(4)}`);
      
      return {
        content: this.extractContent(response, modelConfig.provider),
        model: modelConfig.model,
        tokens: tokensUsed,
        cost: cost,
        duration: duration
      };
      
    } catch (error) {
      console.error(`[${botName}] API Error:`, error.message);
      throw error;
    }
  }

  selectModel(botName, currentSpend, config) {
    const mainConfig = this.loadMainConfig();
    const budget = mainConfig.budget;
    const botConfig = mainConfig.team[botName];
    
    if (!botConfig) {
      throw new Error(`Bot ${botName} not found in configuration`);
    }
    
    const modelClass = mainConfig.models[botConfig.model_class];
    
    // Check for high priority override first - should work regardless of budget tier
    // High priority requests are critical and should use primary model even in emergency mode
    if (config.priority === 'high') {
      selectedModel = modelClass.primary;
      reason = 'high priority override';
    } else {
      // Determine budget level for normal priority requests
      if (currentSpend >= budget.optimization.level_3) {
        // Emergency mode
        selectedModel = modelClass.budget;
        reason = 'emergency budget mode';
      } else if (currentSpend >= budget.optimization.level_2) {
        // Budget mode
        selectedModel = modelClass.budget;
        reason = 'budget optimization';
      } else if (currentSpend >= budget.optimization.level_1) {
        // Fallback mode
        selectedModel = modelClass.fallback;
        reason = 'cost optimization';
      } else {
        // Normal mode
        selectedModel = modelClass.primary;
        reason = 'normal operation';
      }
    }
    
    // Find provider for the selected model
    const provider = this.findProvider(selectedModel);
    
    return {
      model: selectedModel,
      provider: provider,
      reason: reason
    };
  }

  findProvider(modelName) {
    for (const [providerName, providerConfig] of Object.entries(this.providers)) {
      if (providerConfig.models[modelName]) {
        return providerName;
      }
    }
    throw new Error(`Model ${modelName} not found in any provider`);
  }

  async makeAPICall(modelConfig, prompt, config) {
    const provider = this.providers[modelConfig.provider];
    const apiKey = process.env[provider.apiKeyEnv];
    
    if (!apiKey) {
      throw new Error(`API key not found for ${modelConfig.provider}. Please set ${provider.apiKeyEnv}`);
    }
    
    const requestBody = this.buildRequestBody(modelConfig, prompt, config);
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: provider.endpoint,
        path: provider.path,
        method: 'POST',
        headers: this.getHeaders(modelConfig.provider, apiKey)
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject(new Error(`API Error: ${response.error?.message || data}`));
            } else {
              resolve(response);
            }
          } catch (e) {
            reject(new Error(`Parse Error: ${e.message}`));
          }
        });
      });
      
      req.on('error', reject);
      req.write(JSON.stringify(requestBody));
      req.end();
    });
  }

  buildRequestBody(modelConfig, prompt, config) {
    const mainConfig = this.loadMainConfig();
    const botConfig = mainConfig.team[config.botName];
    
    if (modelConfig.provider === 'anthropic') {
      return {
        model: modelConfig.model,
        messages: [{
          role: 'user',
          content: `${botConfig.personality}\n\nTask: ${prompt}`
        }],
        max_tokens: botConfig.max_tokens || 1500,
        temperature: botConfig.temperature || 0.7
      };
    } else {
      // OpenAI format (also works for OpenRouter)
      return {
        model: modelConfig.model,
        messages: [
          {
            role: 'system',
            content: botConfig.personality
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: botConfig.max_tokens || 1500,
        temperature: botConfig.temperature || 0.7
      };
    }
  }

  getHeaders(provider, apiKey) {
    if (provider === 'anthropic') {
      return {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      };
    } else if (provider === 'openrouter') {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com',
        'X-Title': 'GitHub Actions AI Team'
      };
    } else {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      };
    }
  }

  extractContent(response, provider) {
    if (provider === 'anthropic') {
      return response.content[0]?.text || '';
    } else {
      return response.choices[0]?.message?.content || '';
    }
  }

  calculateCost(model, tokens) {
    for (const provider of Object.values(this.providers)) {
      if (provider.models[model]) {
        return (tokens / 1000) * provider.models[model].costPer1k;
      }
    }
    return 0;
  }

  loadMainConfig() {
    const configPath = path.join(__dirname, '../configs/main-config.yml');
    const yaml = require('js-yaml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    return yaml.load(configContent);
  }

  loadCostData() {
    try {
      if (fs.existsSync(this.costTrackerPath)) {
        return JSON.parse(fs.readFileSync(this.costTrackerPath, 'utf8'));
      }
    } catch (e) {
      console.error('Error loading cost data:', e.message);
    }
    return { daily: {}, monthly: {}, bots: {} };
  }

  getCurrentMonthSpend(costData) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return costData.monthly[currentMonth]?.total || 0;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async updateCostTracking(botName, model, tokens, cost) {
    // Retry logic for file operations to handle race conditions
    const maxRetries = 5;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        // Load current cost data (fresh read each attempt to avoid stale data)
        const costData = this.loadCostData();
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const month = now.toISOString().slice(0, 7);
        
        // Update daily tracking
        if (!costData.daily[today]) {
          costData.daily[today] = { total: 0, bots: {} };
        }
        costData.daily[today].total += cost;
        costData.daily[today].bots[botName] = (costData.daily[today].bots[botName] || 0) + cost;
        
        // Update monthly tracking
        if (!costData.monthly[month]) {
          costData.monthly[month] = { total: 0, bots: {} };
        }
        costData.monthly[month].total += cost;
        costData.monthly[month].bots[botName] = (costData.monthly[month].bots[botName] || 0) + cost;
        
        // Update bot tracking
        if (!costData.bots[botName]) {
          costData.bots[botName] = { total: 0, models: {} };
        }
        costData.bots[botName].total += cost;
        costData.bots[botName].models[model] = (costData.bots[botName].models[model] || 0) + cost;
        
        // Atomic write: write to temp file then rename (atomic on most filesystems)
        // This prevents partial writes but we still need retry logic for read-modify-write races
        const tempPath = `${this.costTrackerPath}.tmp.${Date.now()}.${process.pid}`;
        const dir = path.dirname(this.costTrackerPath);
        
        // Ensure directory exists
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write to temp file
        fs.writeFileSync(tempPath, JSON.stringify(costData, null, 2), 'utf8');
        
        // Atomic rename (replaces existing file atomically)
        fs.renameSync(tempPath, this.costTrackerPath);
        
        // Success - break out of retry loop
        console.log(`::notice::AI Cost Update - Bot: ${botName}, Model: ${model}, Cost: $${cost.toFixed(4)}, Monthly Total: $${costData.monthly[month].total.toFixed(2)}`);
        return;
        
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          console.error(`[${botName}] Failed to update cost tracking after ${maxRetries} attempts:`, error.message);
          // Don't throw - cost tracking failure shouldn't break the workflow
          // Log to GitHub Actions output instead
          console.log(`::warning::Cost tracking update failed for ${botName}: ${error.message}`);
          return;
        }
        
        // Exponential backoff for retries
        await this.sleep(50 * Math.pow(2, retries));
      }
    }
  }
}

// Export for use in workflows
module.exports = AIAPIHandler;

// CLI interface
if (require.main === module) {
  const handler = new AIAPIHandler();
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: ai-api-handler.js <bot-name> <prompt> [priority]');
    process.exit(1);
  }
  
  const [botName, prompt, priority] = args;
  
  handler.callAI(botName, prompt, { botName, priority })
    .then(result => {
      console.log(result.content);
      process.exit(0);
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
