#!/bin/bash
# Add timeout-minutes to all workflow jobs

set -e

WORKFLOWS_DIR=".github/workflows"
TIMEOUT=15

for workflow in "$WORKFLOWS_DIR"/*.yml; do
    if [ -f "$workflow" ]; then
        # Check if timeout already exists
        if ! grep -q "timeout-minutes" "$workflow"; then
            # Find runs-on line and add timeout after it
            # Handle both cases: with and without if: block
            if grep -q "runs-on:" "$workflow"; then
                # Use sed to add timeout-minutes after runs-on line
                sed -i '/runs-on:.*ubuntu-latest/a\    timeout-minutes: '"$TIMEOUT" "$workflow"
                echo "✓ Added timeout to $(basename "$workflow")"
            fi
        else
            echo "- Skipped $(basename "$workflow") (already has timeout)"
        fi
    fi
done

