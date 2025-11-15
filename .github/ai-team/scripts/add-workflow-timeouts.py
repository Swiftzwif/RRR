#!/usr/bin/env python3
"""Add timeout-minutes to all workflow jobs."""

import os
import re
from pathlib import Path

WORKFLOWS_DIR = Path(__file__).parent.parent.parent / 'workflows'
TIMEOUT_MINUTES = 15


def add_timeout_to_workflow(workflow_path: Path) -> bool:
    """Add timeout-minutes to all jobs in a workflow file."""
    try:
        content = workflow_path.read_text(encoding='utf-8')
        original_content = content
        
        # Find all job definitions
        # Pattern: job_name:\n  runs-on: ...
        # We want to add timeout-minutes after runs-on
        pattern = r'(jobs:\s*\n(?:\s+\w+:\s*\n(?:\s+name:.*\n)?\s+runs-on:\s+[^\n]+\n))'
        
        # More specific pattern: find job blocks
        job_pattern = r'(\s+\w+:\s*\n(?:\s+name:.*\n)?\s+runs-on:\s+[^\n]+\n)'
        
        def add_timeout(match):
            job_block = match.group(1)
            # Check if timeout already exists
            if 'timeout-minutes' in job_block:
                return job_block
            # Add timeout after runs-on line
            return re.sub(
                r'(runs-on:\s+[^\n]+\n)',
                r'\1      timeout-minutes: ' + str(TIMEOUT_MINUTES) + '\n',
                job_block
            )
        
        # Replace job blocks
        new_content = re.sub(job_pattern, add_timeout, content)
        
        # Also handle case where there's a name: line
        # Pattern: name: ...\n  runs-on: ...
        name_pattern = r'(\s+name:\s+[^\n]+\n\s+runs-on:\s+[^\n]+\n)'
        new_content = re.sub(
            name_pattern,
            lambda m: re.sub(
                r'(runs-on:\s+[^\n]+\n)',
                r'\1      timeout-minutes: ' + str(TIMEOUT_MINUTES) + '\n',
                m.group(1)
            ),
            new_content
        )
        
        if new_content != original_content:
            workflow_path.write_text(new_content, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f'Error processing {workflow_path}: {e}')
        return False


def main():
    """Add timeouts to all workflow files."""
    workflows = list(WORKFLOWS_DIR.glob('*.yml'))
    updated = 0
    
    for workflow in workflows:
        if add_timeout_to_workflow(workflow):
            print(f'✓ Added timeout to {workflow.name}')
            updated += 1
        else:
            print(f'- Skipped {workflow.name} (already has timeout or no jobs)')
    
    print(f'\nUpdated {updated} workflow files')


if __name__ == '__main__':
    main()

