#!/bin/bash

# Script to fix all workflow files to use env blocks instead of inline secrets
# This addresses security concerns about API key exposure

set -e

WORKFLOWS_DIR=".github/workflows"

# Function to fix a workflow file
fix_workflow() {
  local file=$1
  local temp_file="${file}.tmp"
  
  # Check if file has inline API key usage
  if grep -q 'OPENAI_API_KEY="\${{ secrets.OPENAI_API_KEY }}"' "$file"; then
    echo "Fixing $file..."
    
    # Find the step that has inline API keys
    # This is a simplified fix - in practice, each workflow needs individual attention
    # The pattern is: find the run: block that has inline env vars, move them to env: block above
    
    # For now, we'll create a note that manual fixes are needed
    echo "  ⚠️  $file needs manual env block migration (see pattern in cto-pr-review.yml)"
  else
    echo "  ✓ $file already uses env blocks or doesn't need fixing"
  fi
}

# Fix all workflow files
for workflow in "$WORKFLOWS_DIR"/*.yml; do
  if [ -f "$workflow" ]; then
    fix_workflow "$workflow"
  fi
done

echo ""
echo "Note: Some workflows may need manual fixes. Use cto-pr-review.yml as a reference pattern."

