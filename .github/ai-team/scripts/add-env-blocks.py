#!/usr/bin/env python3
"""
Script to add env blocks to workflow files that have inline API keys
"""

import re
import sys
from pathlib import Path

WORKFLOWS_DIR = Path(__file__).parent.parent.parent / 'workflows'

ENV_BLOCK = """        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
          TOGETHER_API_KEY: ${{ secrets.TOGETHER_API_KEY }}
          GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
"""

def add_env_block_to_workflow(file_path: Path) -> bool:
    """Add env block to workflow file if it has inline API keys."""
    content = file_path.read_text()
    
    # Check if it has inline API keys but no env block in the step
    if 'OPENAI_API_KEY="${{ secrets.OPENAI_API_KEY }}"' in content:
        # Find steps that call python scripts with inline keys
        pattern = r'(- name: [^\n]+\n(?:        id: [^\n]+\n)?)(        run: \|\n)'
        
        def replace_step(match):
            step_header = match.group(1)
            run_line = match.group(2)
            
            # Check if this step has inline API keys
            step_content = content[content.find(match.group(0)):content.find(match.group(0)) + 500]
            if 'OPENAI_API_KEY="${{ secrets.OPENAI_API_KEY }}"' in step_content:
                # Check if env block already exists
                if 'env:\n          OPENAI_API_KEY:' not in step_content:
                    return step_header + ENV_BLOCK + run_line
            return match.group(0)
        
        new_content = re.sub(pattern, replace_step, content, flags=re.MULTILINE)
        
        if new_content != content:
            file_path.write_text(new_content)
            return True
    return False

if __name__ == '__main__':
    updated = []
    for workflow_file in WORKFLOWS_DIR.glob('*.yml'):
        if add_env_block_to_workflow(workflow_file):
            updated.append(workflow_file.name)
            print(f'Updated: {workflow_file.name}')
    
    if updated:
        print(f'\nUpdated {len(updated)} workflow(s)')
    else:
        print('No workflows needed updating')

