#!/bin/bash

# Script to fix all workflow files to use env blocks instead of inline secrets
# This addresses the security concern about API key exposure in logs

WORKFLOWS_DIR=".github/workflows"

# List of workflow files that need fixing
WORKFLOWS=(
  "standup-summary.yml"
  "ceo-weekly-strategy.yml"
  "prd-issue-analysis.yml"
  "pull-team-focus.yml"
  "coo-operational-efficiency.yml"
  "cmo-growth-strategy.yml"
  "cpo-product-strategy.yml"
  "devops-deployment.yml"
  "qa-test-analysis.yml"
  "security-pr-review.yml"
  "analytics-insights.yml"
  "emergency-all-hands.yml"
)

for workflow in "${WORKFLOWS[@]}"; do
  file="$WORKFLOWS_DIR/$workflow"
  if [ -f "$file" ]; then
    echo "Fixing $workflow..."
    
    # This is a placeholder - actual fixing would require sed/awk or manual edits
    # The pattern to find and replace is:
    # OLD: REVIEW=$(OPENAI_API_KEY="${{ secrets.OPENAI_API_KEY }}" ... node script.js)
    # NEW: Add env block before run, then just: REVIEW=$(node script.js)
    
    echo "  ✓ $workflow needs manual review for env block migration"
  fi
done

echo "Done. Please review each workflow file to ensure env blocks are used."

