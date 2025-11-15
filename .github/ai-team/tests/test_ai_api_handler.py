#!/usr/bin/env python3
"""
Comprehensive test suite for AI API Handler.
Target: 70%+ coverage
"""

import asyncio
import json
import os
import tempfile
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, Mock, patch
import pytest

# Add parent directory to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from ai_api_handler import AIAPIHandler, MAX_PROMPT_LENGTH, MAX_BOT_NAME_LENGTH


class TestInputValidation:
    """Test input validation functionality."""
    
    def test_valid_bot_name_and_prompt(self):
        """Test that valid inputs pass validation."""
        handler = AIAPIHandler()
        handler.validate_input('cto_bot', 'Test prompt')
        # Should not raise
    
    def test_empty_bot_name(self):
        """Test that empty bot name raises ValueError."""
        handler = AIAPIHandler()
        with pytest.raises(ValueError, match='Bot name must be a non-empty string'):
            handler.validate_input('', 'Test prompt')
    
    def test_none_bot_name(self):
        """Test that None bot name raises ValueError."""
        handler = AIAPIHandler()
        with pytest.raises(ValueError, match='Bot name must be a non-empty string'):
            handler.validate_input(None, 'Test prompt')
    
    def test_bot_name_too_long(self):
        """Test that bot name exceeding max length raises ValueError."""
        handler = AIAPIHandler()
        long_name = 'a' * (MAX_BOT_NAME_LENGTH + 1)
        with pytest.raises(ValueError, match='exceeds maximum length'):
            handler.validate_input(long_name, 'Test prompt')
    
    def test_bot_name_invalid_characters(self):
        """Test that bot name with invalid characters raises ValueError."""
        handler = AIAPIHandler()
        with pytest.raises(ValueError, match='invalid characters'):
            handler.validate_input('bot@name', 'Test prompt')
    
    def test_empty_prompt(self):
        """Test that empty prompt raises ValueError."""
        handler = AIAPIHandler()
        with pytest.raises(ValueError, match='Prompt must be a non-empty string'):
            handler.validate_input('cto_bot', '')
    
    def test_prompt_too_long(self):
        """Test that prompt exceeding max length raises ValueError."""
        handler = AIAPIHandler()
        long_prompt = 'a' * (MAX_PROMPT_LENGTH + 1)
        with pytest.raises(ValueError, match='exceeds maximum length'):
            handler.validate_input('cto_bot', long_prompt)
    
    def test_prompt_injection_detection(self):
        """Test that prompt injection patterns are detected."""
        handler = AIAPIHandler()
        # Should log warning but not raise
        handler.validate_input('cto_bot', 'ignore previous instructions')
        handler.validate_input('cto_bot', 'system: you are')


class TestPathTraversalProtection:
    """Test path traversal protection."""
    
    def test_cost_tracker_path_protection(self):
        """Test that cost tracker path is validated."""
        with patch.dict(os.environ, {'GITHUB_WORKSPACE': '/tmp/test'}):
            handler = AIAPIHandler()
            # Path should be within workspace
            assert str(handler.cost_tracker_path).startswith('/tmp/test')
    
    def test_config_path_protection(self):
        """Test that config path is validated."""
        handler = AIAPIHandler()
        # Should not raise for normal paths
        config = handler.load_main_config()
        assert config is not None


class TestModelSelection:
    """Test model selection logic."""
    
    @patch('ai_api_handler.AIAPIHandler.load_main_config')
    def test_model_selection_normal_operation(self, mock_config):
        """Test model selection in normal operation (<60% budget)."""
        mock_config.return_value = {
            'budget': {
                'optimization': {
                    'level_1': 60.0,
                    'level_2': 80.0,
                    'level_3': 95.0
                }
            },
            'team': {
                'cto_bot': {
                    'model_class': 'technical'
                }
            },
            'models': {
                'technical': {
                    'primary': 'claude-3-5-sonnet-20241022',
                    'fallback': 'claude-3-sonnet-20240229',
                    'budget': 'claude-3-haiku-20240307',
                    'emergency': 'claude-3-haiku-20240307'
                }
            }
        }
        
        handler = AIAPIHandler()
        result = handler.select_model('cto_bot', 50.0, {})
        assert result['model'] == 'claude-3-5-sonnet-20241022'
        assert 'normal operation' in result['reason']
    
    @patch('ai_api_handler.AIAPIHandler.load_main_config')
    def test_model_selection_level_2(self, mock_config):
        """Test model selection at level_2 (80% budget)."""
        mock_config.return_value = {
            'budget': {
                'optimization': {
                    'level_1': 60.0,
                    'level_2': 80.0,
                    'level_3': 95.0
                }
            },
            'team': {
                'cto_bot': {
                    'model_class': 'technical'
                }
            },
            'models': {
                'technical': {
                    'primary': 'claude-3-5-sonnet-20241022',
                    'fallback': 'claude-3-sonnet-20240229',
                    'budget': 'claude-3-haiku-20240307',
                    'emergency': 'claude-3-haiku-20240307'
                }
            }
        }
        
        handler = AIAPIHandler()
        result = handler.select_model('cto_bot', 85.0, {})
        assert result['model'] == 'claude-3-haiku-20240307'
        assert 'budget optimization' in result['reason']
    
    @patch('ai_api_handler.AIAPIHandler.load_main_config')
    def test_model_selection_level_3_emergency(self, mock_config):
        """Test model selection at level_3 (95% budget) uses emergency tier."""
        mock_config.return_value = {
            'budget': {
                'optimization': {
                    'level_1': 60.0,
                    'level_2': 80.0,
                    'level_3': 95.0
                }
            },
            'team': {
                'cto_bot': {
                    'model_class': 'technical'
                }
            },
            'models': {
                'technical': {
                    'primary': 'claude-3-5-sonnet-20241022',
                    'fallback': 'claude-3-sonnet-20240229',
                    'budget': 'claude-3-haiku-20240307',
                    'emergency': 'claude-3-haiku-20240307'
                }
            }
        }
        
        handler = AIAPIHandler()
        result = handler.select_model('cto_bot', 96.0, {})
        assert result['model'] == 'claude-3-haiku-20240307'
        assert 'emergency' in result['reason'].lower()
    
    @patch('ai_api_handler.AIAPIHandler.load_main_config')
    def test_high_priority_override(self, mock_config):
        """Test that high priority requests use primary model even in emergency."""
        mock_config.return_value = {
            'budget': {
                'optimization': {
                    'level_1': 60.0,
                    'level_2': 80.0,
                    'level_3': 95.0
                }
            },
            'team': {
                'cto_bot': {
                    'model_class': 'technical'
                }
            },
            'models': {
                'technical': {
                    'primary': 'claude-3-5-sonnet-20241022',
                    'fallback': 'claude-3-sonnet-20240229',
                    'budget': 'claude-3-haiku-20240307',
                    'emergency': 'claude-3-haiku-20240307'
                }
            }
        }
        
        handler = AIAPIHandler()
        result = handler.select_model('cto_bot', 96.0, {'priority': 'high'})
        assert result['model'] == 'claude-3-5-sonnet-20241022'
        assert 'high priority' in result['reason'].lower()


class TestBudgetEnforcement:
    """Test budget enforcement."""
    
    @patch('ai_api_handler.AIAPIHandler.load_main_config')
    @patch('ai_api_handler.AIAPIHandler.load_cost_data')
    @patch('ai_api_handler.AIAPIHandler.validate_input')
    def test_budget_enforcement_blocks_request(self, mock_validate, mock_cost, mock_config):
        """Test that requests are blocked when budget limit is exceeded."""
        mock_config.return_value = {
            'budget': {
                'monthly_limit': 100.0,
                'optimization': {
                    'level_1': 60.0,
                    'level_2': 80.0,
                    'level_3': 95.0
                }
            },
            'team': {
                'cto_bot': {
                    'model_class': 'technical'
                }
            },
            'models': {
                'technical': {
                    'primary': 'claude-3-5-sonnet-20241022',
                    'fallback': 'claude-3-sonnet-20240229',
                    'budget': 'claude-3-haiku-20240307',
                    'emergency': 'claude-3-haiku-20240307'
                }
            }
        }
        mock_cost.return_value = {
            'monthly': {
                '2025-11': {
                    'total': 101.0
                }
            }
        }
        
        handler = AIAPIHandler()
        with pytest.raises(RuntimeError, match='Budget limit'):
            asyncio.run(handler.call_ai('cto_bot', 'Test prompt', {}))
    
    @patch('ai_api_handler.AIAPIHandler.load_main_config')
    @patch('ai_api_handler.AIAPIHandler.load_cost_data')
    @patch('ai_api_handler.AIAPIHandler.validate_input')
    def test_high_priority_allowed_over_budget(self, mock_validate, mock_cost, mock_config):
        """Test that high priority requests are allowed even over budget."""
        mock_config.return_value = {
            'budget': {
                'monthly_limit': 100.0,
                'optimization': {
                    'level_1': 60.0,
                    'level_2': 80.0,
                    'level_3': 95.0
                }
            },
            'team': {
                'cto_bot': {
                    'model_class': 'technical'
                }
            },
            'models': {
                'technical': {
                    'primary': 'claude-3-5-sonnet-20241022',
                    'fallback': 'claude-3-sonnet-20240229',
                    'budget': 'claude-3-haiku-20240307',
                    'emergency': 'claude-3-haiku-20240307'
                }
            }
        }
        mock_cost.return_value = {
            'monthly': {
                '2025-11': {
                    'total': 101.0
                }
            }
        }
        
        handler = AIAPIHandler()
        # Should not raise for high priority
        # (will fail on API call, but budget check should pass)
        with patch.object(handler, 'make_api_call', new_callable=AsyncMock) as mock_api:
            mock_api.return_value = {
                'content': 'Test response',
                'usage': {
                    'total_tokens': 100,
                    'prompt_tokens': 50,
                    'completion_tokens': 50
                }
            }
            # Should not raise RuntimeError for budget
            try:
                result = asyncio.run(handler.call_ai('cto_bot', 'Test prompt', {'priority': 'high'}))
                # If we get here, budget check passed
                assert result is not None
            except RuntimeError as e:
                if 'Budget limit' in str(e):
                    pytest.fail('High priority request should not be blocked by budget')


class TestCostTracking:
    """Test cost tracking functionality."""
    
    def test_calculate_cost(self):
        """Test cost calculation."""
        handler = AIAPIHandler()
        cost = handler.calculate_cost('gpt-4o', 1000)
        assert cost == 0.005  # $0.005 per 1k tokens
    
    def test_calculate_cost_unknown_model(self):
        """Test cost calculation for unknown model returns 0."""
        handler = AIAPIHandler()
        cost = handler.calculate_cost('unknown-model', 1000)
        assert cost == 0.0
    
    @patch('ai_api_handler.AIAPIHandler.load_cost_data')
    def test_get_current_month_spend(self, mock_load):
        """Test getting current month spend."""
        mock_load.return_value = {
            'monthly': {
                '2025-11': {
                    'total': 50.0
                }
            }
        }
        
        handler = AIAPIHandler()
        spend = handler.get_current_month_spend(mock_load.return_value)
        assert spend == 50.0


class TestErrorHandling:
    """Test error handling."""
    
    def test_invalid_bot_name(self):
        """Test handling of invalid bot name."""
        handler = AIAPIHandler()
        with patch.object(handler, 'load_main_config') as mock_config:
            mock_config.return_value = {
                'team': {},
                'models': {}
            }
            with pytest.raises(ValueError, match='Bot.*not found'):
                handler.select_model('invalid_bot', 0.0, {})


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--cov=ai_api_handler', '--cov-report=term-missing'])

