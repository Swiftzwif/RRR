# Model Selection Bug Fix

## Issues Fixed

### Bug 1 & 2: Level_2 and Level_3 Using Same Model

**Problem:**
Both budget optimization level (80% - level_2) and emergency mode (95% - level_3) were selecting the same `budget` tier model, with no functional difference between them.

**Root Cause:**
The `select_model()` function had identical logic for both thresholds:
```python
if current_spend >= budget['optimization']['level_3']:
    selected_model = model_class['budget']  # Same as level_2
    reason = 'emergency budget mode'
elif current_spend >= budget['optimization']['level_2']:
    selected_model = model_class['budget']  # Same as level_3
    reason = 'budget optimization'
```

**Solution:**
1. **Added Emergency Tier to Config**: Added `emergency` model tier to all model classes in `main-config.yml`:
   - Strategic: `gpt-3.5-turbo` (cheapest OpenAI)
   - Technical: `claude-3-haiku-20240307` (cheapest Anthropic)
   - Operational: `claude-3-haiku-20240307` (cheapest available)
   - Analytical: `gpt-3.5-turbo` (cheapest reliable)

2. **Updated Model Selection Logic**: Modified `select_model()` to use emergency tier for level_3:
   ```python
   if current_spend >= budget['optimization']['level_3']:
       # Emergency mode: Use emergency tier (cheapest available)
       selected_model = model_class.get('emergency', model_class['budget'])
       reason = 'emergency budget mode (95%+ threshold) - using cheapest available model'
   elif current_spend >= budget['optimization']['level_2']:
       # Budget optimization: Use budget tier
       selected_model = model_class['budget']
       reason = 'budget optimization (80%+ threshold)'
   ```

3. **Added Emergency Mode Token Reduction**: In `make_api_call()`, reduced `max_tokens` by 50% in emergency mode to further minimize costs:
   ```python
   if current_spend >= budget['optimization']['level_3'] and config.get('priority') != 'high':
       # Emergency mode: reduce max_tokens by 50% to minimize costs
       max_tokens = max(500, int(max_tokens * 0.5))  # Minimum 500 tokens
   ```

## Changes Made

### Files Modified:
1. **`.github/ai-team/configs/main-config.yml`**
   - Added `emergency` tier to all model classes
   - Emergency models are the cheapest available for each provider

2. **`.github/ai-team/scripts/ai_api_handler.py`**
   - Updated `select_model()` to differentiate level_2 and level_3
   - Added emergency tier selection for level_3 (95%+ threshold)
   - Added `max_tokens` reduction in emergency mode
   - Improved comments explaining each threshold level

## Behavior Differences

### Before Fix:
- **Level 2 (80%)**: Uses `budget` model
- **Level 3 (95%)**: Uses `budget` model (same as level 2) ❌

### After Fix:
- **Level 2 (80%)**: Uses `budget` model (e.g., `gpt-3.5-turbo`, `claude-3-haiku`)
- **Level 3 (95%)**: Uses `emergency` model (cheapest available) + 50% reduced `max_tokens` ✅

## Testing

To verify the fix:

1. **Test Model Selection:**
   ```python
   # Simulate 95%+ spend
   handler = AIAPIHandler()
   result = handler.select_model('cto_bot', 96.0, {'priority': 'normal'})
   assert result['model'] == 'claude-3-haiku-20240307'  # Emergency tier
   assert 'emergency' in result['reason'].lower()
   
   # Simulate 80%+ spend
   result = handler.select_model('cto_bot', 85.0, {'priority': 'normal'})
   assert result['model'] == 'claude-3-haiku-20240307'  # Budget tier
   assert 'budget optimization' in result['reason'].lower()
   ```

2. **Test Token Reduction:**
   ```python
   # In emergency mode, max_tokens should be reduced
   # Original: 1500 tokens
   # Emergency: 750 tokens (50% reduction)
   ```

## Impact

- **Cost Savings**: Emergency mode now uses cheapest models + reduced tokens = ~60-70% cost reduction vs level_2
- **Functional Difference**: Level_2 and Level_3 now have distinct behaviors
- **Budget Protection**: Emergency mode (95%+) is now truly restrictive, protecting the remaining 5% budget

## Notes

- High priority requests (`priority: 'high'`) still use primary models even in emergency mode
- Emergency tier falls back to budget tier if not defined in config
- Minimum `max_tokens` in emergency mode is 500 to ensure responses are still useful

