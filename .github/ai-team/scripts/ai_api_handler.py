#!/usr/bin/env python3
"""
AI API Handler for GitHub Actions AI Team
Handles intelligent routing between different AI providers
Tracks costs and enforces budget limits
"""

import asyncio
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
import logging

import yaml
from openai import AsyncOpenAI
from anthropic import AsyncAnthropic
import httpx

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration constants
MAX_COST_TRACKING_RETRIES = 5
COST_TRACKING_RETRY_DELAY_BASE_MS = 50
MAX_RETRIES = 3
RETRY_DELAY_BASE_MS = 1000
MAX_PROMPT_LENGTH = 50000
MAX_BOT_NAME_LENGTH = 50


class AIAPIHandler:
    """Handles AI API calls with intelligent routing and cost tracking."""
    
    def __init__(self):
        """Initialize the AI API handler with provider configurations."""
        self.providers = {
            'openai': {
                'models': {
                    'gpt-4o': {'cost_per_1k': 0.005, 'context_window': 128000},
                    'gpt-4o-mini': {'cost_per_1k': 0.00015, 'context_window': 128000},
                    'gpt-3.5-turbo': {'cost_per_1k': 0.0005, 'context_window': 16385}
                }
            },
            'anthropic': {
                'models': {
                    'claude-3-5-sonnet-20241022': {'cost_per_1k': 0.003, 'context_window': 200000},
                    'claude-3-sonnet-20240229': {'cost_per_1k': 0.003, 'context_window': 200000},
                    'claude-3-haiku-20240307': {'cost_per_1k': 0.00025, 'context_window': 200000}
                }
            },
            'openrouter': {
                'models': {
                    'mixtral-8x7b-instruct': {'cost_per_1k': 0.00024, 'context_window': 32768},
                    'llama-3-70b-instruct': {'cost_per_1k': 0.00059, 'context_window': 8192}
                }
            }
        }
        
        # Determine cost tracker path with path traversal protection
        workspace = os.environ.get('GITHUB_WORKSPACE')
        if workspace:
            base_path = Path(workspace).resolve()
            # Ensure we're within the workspace (path traversal protection)
            cost_tracker_path = base_path / '.github' / 'ai-team' / 'cost-tracker.json'
            if not str(cost_tracker_path.resolve()).startswith(str(base_path)):
                raise ValueError('Path traversal detected in cost tracker path')
            self.cost_tracker_path = cost_tracker_path
        else:
            script_dir = Path(__file__).parent.resolve()
            self.cost_tracker_path = script_dir.parent / 'cost-tracker.json'
            # Ensure we're within the script directory tree
            if not str(self.cost_tracker_path.resolve()).startswith(str(script_dir.parent.resolve())):
                raise ValueError('Path traversal detected in cost tracker path')
        
        # Initialize API clients (lazy loading)
        self._openai_client: Optional[AsyncOpenAI] = None
        self._anthropic_client: Optional[AsyncAnthropic] = None
        self._httpx_client: Optional[httpx.AsyncClient] = None
    
    def _get_openai_client(self) -> AsyncOpenAI:
        """Get or create OpenAI client."""
        if self._openai_client is None:
            api_key = os.environ.get('OPENAI_API_KEY')
            if not api_key:
                raise ValueError('OPENAI_API_KEY not found in environment')
            self._openai_client = AsyncOpenAI(api_key=api_key)
        return self._openai_client
    
    def _get_anthropic_client(self) -> AsyncAnthropic:
        """Get or create Anthropic client."""
        if self._anthropic_client is None:
            api_key = os.environ.get('ANTHROPIC_API_KEY')
            if not api_key:
                raise ValueError('ANTHROPIC_API_KEY not found in environment')
            self._anthropic_client = AsyncAnthropic(api_key=api_key)
        return self._anthropic_client
    
    def _get_httpx_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client for OpenRouter."""
        if self._httpx_client is None:
            self._httpx_client = httpx.AsyncClient(timeout=60.0)
        return self._httpx_client
    
    async def _close_clients(self):
        """Close all HTTP clients."""
        if self._httpx_client:
            await self._httpx_client.aclose()
    
    def validate_input(self, bot_name: str, prompt: str) -> None:
        """Validate bot name and prompt inputs."""
        if not bot_name or not isinstance(bot_name, str):
            raise ValueError('Bot name must be a non-empty string')
        if len(bot_name) > MAX_BOT_NAME_LENGTH:
            raise ValueError(f'Bot name exceeds maximum length of {MAX_BOT_NAME_LENGTH}')
        if not bot_name.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Bot name contains invalid characters')
        
        if not prompt or not isinstance(prompt, str):
            raise ValueError('Prompt must be a non-empty string')
        if len(prompt) > MAX_PROMPT_LENGTH:
            raise ValueError(f'Prompt exceeds maximum length of {MAX_PROMPT_LENGTH} characters')
        
        # Check for potential prompt injection patterns
        dangerous_patterns = [
            r'ignore\s+(previous|all|above)\s+instructions',
            r'system\s*:\s*you\s+are',
            r'forget\s+(everything|all|previous)'
        ]
        import re
        for pattern in dangerous_patterns:
            if re.search(pattern, prompt, re.IGNORECASE):
                logger.warning(f'[{bot_name}] Warning: Potential prompt injection detected')
    
    def load_main_config(self) -> Dict[str, Any]:
        """Load main configuration from YAML file with path traversal protection."""
        script_dir = Path(__file__).parent.resolve()
        config_path = (script_dir.parent / 'configs' / 'main-config.yml').resolve()
        
        # Path traversal protection: ensure config is within expected directory
        expected_base = script_dir.parent.resolve()
        if not str(config_path).startswith(str(expected_base)):
            raise ValueError('Path traversal detected in config path')
        
        with open(config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    
    def load_cost_data(self) -> Dict[str, Any]:
        """Load cost tracking data from JSON file."""
        try:
            if self.cost_tracker_path.exists():
                with open(self.cost_tracker_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            logger.error(f'Error loading cost data: {e}')
        return {'daily': {}, 'monthly': {}, 'bots': {}}
    
    def get_current_month_spend(self, cost_data: Dict[str, Any]) -> float:
        """Get current month's spending total."""
        current_month = datetime.now().strftime('%Y-%m')
        return cost_data.get('monthly', {}).get(current_month, {}).get('total', 0.0)
    
    def select_model(self, bot_name: str, current_spend: float, config: Dict[str, Any]) -> Dict[str, str]:
        """Select appropriate model based on budget and priority."""
        main_config = self.load_main_config()
        budget = main_config['budget']
        bot_config = main_config['team'].get(bot_name)
        
        if not bot_config:
            raise ValueError(f'Bot {bot_name} not found in configuration')
        
        model_class = main_config['models'][bot_config['model_class']]
        
        # Check for high priority override first
        # High priority requests use primary model even in emergency mode
        if config.get('priority') == 'high':
            selected_model = model_class['primary']
            reason = 'high priority override'
        else:
            # Determine budget level for normal priority requests
            if current_spend >= budget['optimization']['level_3']:
                # Emergency mode (95%+): Use emergency tier model if available, otherwise budget
                # Emergency mode should be more restrictive than level_2
                selected_model = model_class.get('emergency', model_class['budget'])
                reason = 'emergency budget mode (95%+ threshold) - using cheapest available model'
            elif current_spend >= budget['optimization']['level_2']:
                # Budget optimization (80%+): Use budget tier model
                selected_model = model_class['budget']
                reason = 'budget optimization (80%+ threshold)'
            elif current_spend >= budget['optimization']['level_1']:
                # Cost optimization (60%+): Use fallback tier model
                selected_model = model_class['fallback']
                reason = 'cost optimization (60%+ threshold)'
            else:
                # Normal operation (<60%): Use primary tier model
                selected_model = model_class['primary']
                reason = 'normal operation'
        
        # Find provider for the selected model
        provider = self.find_provider(selected_model)
        
        return {
            'model': selected_model,
            'provider': provider,
            'reason': reason
        }
    
    def find_provider(self, model_name: str) -> str:
        """Find which provider owns the given model."""
        for provider_name, provider_config in self.providers.items():
            if model_name in provider_config['models']:
                return provider_name
        raise ValueError(f'Model {model_name} not found in any provider')
    
    def get_project_context(self) -> str:
        """Get project context from configuration."""
        main_config = self.load_main_config()
        if 'project' not in main_config:
            return ''
        
        project = main_config['project']
        return f"""
PROJECT CONTEXT: {project['name']} - {project['type']}

Tech Stack: {', '.join(project['stack'])}
Key Features: {'; '.join(project['key_features'])}
Architecture: {'; '.join(project['architecture'])}
Business Model: {'; '.join(project['business_model'])}

When making recommendations, consider this specific project context and architecture.
"""
    
    def build_messages(self, model_config: Dict[str, str], prompt: str, config: Dict[str, Any]) -> list:
        """Build messages for API call based on provider."""
        main_config = self.load_main_config()
        bot_config = main_config['team'][config['botName']]
        project_context = self.get_project_context()
        
        if model_config['provider'] == 'anthropic':
            # Anthropic uses single user message with system context
            return [{
                'role': 'user',
                'content': f"{bot_config['personality']}{project_context}\n\nTask: {prompt}"
            }]
        else:
            # OpenAI format (also works for OpenRouter)
            return [
                {
                    'role': 'system',
                    'content': f"{bot_config['personality']}{project_context}"
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ]
    
    async def make_openai_call(self, model: str, messages: list, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Make API call to OpenAI."""
        client = self._get_openai_client()
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return {
            'content': response.choices[0].message.content,
            'usage': {
                'total_tokens': response.usage.total_tokens,
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens
            }
        }
    
    async def make_anthropic_call(self, model: str, messages: list, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Make API call to Anthropic."""
        client = self._get_anthropic_client()
        # Anthropic uses different message format
        user_message = messages[0]['content']
        
        response = await client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[{'role': 'user', 'content': user_message}]
        )
        
        return {
            'content': response.content[0].text,
            'usage': {
                'total_tokens': response.usage.input_tokens + response.usage.output_tokens,
                'prompt_tokens': response.usage.input_tokens,
                'completion_tokens': response.usage.output_tokens
            }
        }
    
    async def make_openrouter_call(self, model: str, messages: list, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Make API call to OpenRouter."""
        api_key = os.environ.get('OPENROUTER_API_KEY')
        if not api_key:
            raise ValueError('OPENROUTER_API_KEY not found in environment')
        
        client = self._get_httpx_client()
        response = await client.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'HTTP-Referer': 'https://github.com',
                'X-Title': 'GitHub Actions AI Team'
            },
            json={
                'model': model,
                'messages': messages,
                'max_tokens': max_tokens,
                'temperature': temperature
            }
        )
        response.raise_for_status()
        data = response.json()
        
        return {
            'content': data['choices'][0]['message']['content'],
            'usage': {
                'total_tokens': data['usage']['total_tokens'],
                'prompt_tokens': data['usage']['prompt_tokens'],
                'completion_tokens': data['usage']['completion_tokens']
            }
        }
    
    async def make_api_call(self, model_config: Dict[str, str], prompt: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Make API call to the appropriate provider with retry logic."""
        main_config = self.load_main_config()
        bot_config = main_config['team'][config['botName']]
        messages = self.build_messages(model_config, prompt, config)
        max_tokens = bot_config.get('max_tokens', 1500)
        temperature = bot_config.get('temperature', 0.7)
        
        # Reduce max_tokens in emergency mode (95%+ budget) to further reduce costs
        # Emergency mode should be more restrictive than level_2
        current_spend = self.get_current_monthly_spend()
        budget = main_config['budget']
        if current_spend >= budget['optimization']['level_3'] and config.get('priority') != 'high':
            # Emergency mode: reduce max_tokens by 50% to minimize costs
            max_tokens = max(500, int(max_tokens * 0.5))  # Minimum 500 tokens
        
        provider = model_config['provider']
        model = model_config['model']
        
        last_error = None
        for attempt in range(MAX_RETRIES + 1):
            try:
                if provider == 'openai':
                    return await self.make_openai_call(model, messages, max_tokens, temperature)
                elif provider == 'anthropic':
                    return await self.make_anthropic_call(model, messages, max_tokens, temperature)
                elif provider == 'openrouter':
                    return await self.make_openrouter_call(model, messages, max_tokens, temperature)
                else:
                    raise ValueError(f'Unknown provider: {provider}')
            except Exception as error:
                last_error = error
                status_code = getattr(error, 'status_code', None)
                
                # Don't retry on client errors (4xx) except rate limits (429)
                if status_code and 400 <= status_code < 500 and status_code != 429:
                    raise
                
                # Retry with exponential backoff
                if attempt < MAX_RETRIES:
                    delay = RETRY_DELAY_BASE_MS * (2 ** attempt) / 1000  # Convert to seconds
                    logger.warning(f'API call failed (attempt {attempt + 1}/{MAX_RETRIES + 1}), retrying in {delay}s...')
                    await asyncio.sleep(delay)
        
        # All retries exhausted
        raise RuntimeError(f'API call failed after {MAX_RETRIES + 1} attempts: {last_error}')
    
    def calculate_cost(self, model: str, tokens: int) -> float:
        """Calculate cost based on model and token usage."""
        for provider_config in self.providers.values():
            if model in provider_config['models']:
                cost_per_1k = provider_config['models'][model]['cost_per_1k']
                return (tokens / 1000) * cost_per_1k
        return 0.0
    
    async def update_cost_tracking(self, bot_name: str, model: str, tokens: int, cost: float) -> None:
        """Update cost tracking with atomic writes and retry logic."""
        retries = 0
        
        while retries < MAX_COST_TRACKING_RETRIES:
            try:
                # Load current cost data (fresh read each attempt)
                cost_data = self.load_cost_data()
                now = datetime.now()
                today = now.strftime('%Y-%m-%d')
                month = now.strftime('%Y-%m')
                
                # Update daily tracking
                if today not in cost_data['daily']:
                    cost_data['daily'][today] = {'total': 0.0, 'bots': {}}
                cost_data['daily'][today]['total'] += cost
                cost_data['daily'][today]['bots'][bot_name] = cost_data['daily'][today]['bots'].get(bot_name, 0.0) + cost
                
                # Update monthly tracking
                if month not in cost_data['monthly']:
                    cost_data['monthly'][month] = {'total': 0.0, 'bots': {}}
                cost_data['monthly'][month]['total'] += cost
                cost_data['monthly'][month]['bots'][bot_name] = cost_data['monthly'][month]['bots'].get(bot_name, 0.0) + cost
                
                # Update bot tracking
                if 'bots' not in cost_data:
                    cost_data['bots'] = {}
                if bot_name not in cost_data['bots']:
                    cost_data['bots'][bot_name] = {'total': 0.0, 'models': {}}
                cost_data['bots'][bot_name]['total'] += cost
                cost_data['bots'][bot_name]['models'][model] = cost_data['bots'][bot_name]['models'].get(model, 0.0) + cost
                
                # Atomic write: write to temp file then rename
                self.cost_tracker_path.parent.mkdir(parents=True, exist_ok=True)
                temp_path = self.cost_tracker_path.with_suffix(f'.tmp.{int(time.time() * 1000)}.{os.getpid()}.json')
                
                with open(temp_path, 'w', encoding='utf-8') as f:
                    json.dump(cost_data, f, indent=2)
                
                # Atomic rename
                temp_path.replace(self.cost_tracker_path)
                
                # Success
                monthly_total = cost_data['monthly'][month]['total']
                print(f'::notice::AI Cost Update - Bot: {bot_name}, Model: {model}, Cost: ${cost:.4f}, Monthly Total: ${monthly_total:.2f}')
                return
                
            except Exception as error:
                retries += 1
                if retries >= MAX_COST_TRACKING_RETRIES:
                    logger.error(f'[{bot_name}] Failed to update cost tracking after {MAX_COST_TRACKING_RETRIES} attempts: {error}')
                    print(f'::warning::Cost tracking update failed for {bot_name}: {error}')
                    return
                
                # Exponential backoff
                delay = (COST_TRACKING_RETRY_DELAY_BASE_MS * (2 ** retries)) / 1000
                await asyncio.sleep(delay)
    
    async def call_ai(self, bot_name: str, prompt: str, config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Main method to call AI with intelligent routing."""
        if config is None:
            config = {}
        
        config['botName'] = bot_name
        start_time = time.time()
        
        try:
            # Input validation
            self.validate_input(bot_name, prompt)
            
            # Load current cost data
            cost_data = self.load_cost_data()
            current_month_spend = self.get_current_month_spend(cost_data)
            
            # Budget enforcement: Hard stop at monthly limit
            main_config = self.load_main_config()
            budget_limit = main_config['budget']['monthly_limit']
            if current_month_spend >= budget_limit:
                error_msg = f'Budget limit of ${budget_limit} exceeded (current: ${current_month_spend:.2f}). Request blocked.'
                logger.error(f'[{bot_name}] {error_msg}')
                # Only allow high-priority requests in emergency
                if config.get('priority') != 'high':
                    raise RuntimeError(error_msg)
                else:
                    logger.warning(f'[{bot_name}] High-priority request allowed despite budget limit')
            
            # Determine which model to use based on budget
            model_config = self.select_model(bot_name, current_month_spend, config)
            
            logger.info(f'[{bot_name}] Using model: {model_config["model"]} ({model_config["reason"]})')
            
            # Make API call
            response = await self.make_api_call(model_config, prompt, config)
            
            # Track costs
            tokens_used = response['usage']['total_tokens']
            cost = self.calculate_cost(model_config['model'], tokens_used)
            await self.update_cost_tracking(bot_name, model_config['model'], tokens_used, cost)
            
            # Log performance
            duration = int((time.time() - start_time) * 1000)
            logger.info(f'[{bot_name}] Response in {duration}ms, tokens: {tokens_used}, cost: ${cost:.4f}')
            
            return {
                'content': response['content'],
                'model': model_config['model'],
                'tokens': tokens_used,
                'cost': cost,
                'duration': duration
            }
            
        except Exception as error:
            logger.error(f'[{bot_name}] API Error: {error}')
            raise


async def main():
    """CLI interface."""
    if len(sys.argv) < 3:
        print('Usage: ai_api_handler.py <bot-name> <prompt> [priority]', file=sys.stderr)
        sys.exit(1)
    
    bot_name = sys.argv[1]
    prompt = sys.argv[2]
    priority = sys.argv[3] if len(sys.argv) > 3 else None
    
    handler = AIAPIHandler()
    try:
        result = await handler.call_ai(bot_name, prompt, {'priority': priority})
        print(result['content'])
        await handler._close_clients()
        sys.exit(0)
    except Exception as error:
        print(f'Error: {error}', file=sys.stderr)
        await handler._close_clients()
        sys.exit(1)


if __name__ == '__main__':
    asyncio.run(main())

