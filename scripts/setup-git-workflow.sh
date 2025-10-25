#!/bin/bash

# Git Workflow Setup Script
# This script will help you set up the recommended git workflow

set -e  # Exit on error

echo "🚀 Git Workflow Setup Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

print_success "Found git repository"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Step 1: Create develop branch if it doesn't exist
echo "Step 1: Setting up develop branch"
echo "-----------------------------------"

if git show-ref --verify --quiet refs/heads/develop; then
    print_warning "develop branch already exists"
else
    echo "Creating develop branch from master..."
    git checkout master
    git pull origin master
    git checkout -b develop
    git push origin develop
    print_success "Created and pushed develop branch"
fi

# Step 2: Ask about merging current feature branch
echo ""
echo "Step 2: Merge current work into develop"
echo "----------------------------------------"

if [ "$CURRENT_BRANCH" != "develop" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "You're currently on: $CURRENT_BRANCH"
    read -p "Do you want to merge this branch into develop? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Make sure current branch is up to date
        git push origin "$CURRENT_BRANCH" || true
        
        # Switch to develop and merge
        git checkout develop
        git pull origin develop
        git merge "$CURRENT_BRANCH" --no-ff -m "merge: integrate $CURRENT_BRANCH"
        git push origin develop
        
        print_success "Merged $CURRENT_BRANCH into develop"
        
        # Ask about deleting the old branch
        read -p "Do you want to delete $CURRENT_BRANCH? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git branch -d "$CURRENT_BRANCH"
            git push origin --delete "$CURRENT_BRANCH" || true
            print_success "Deleted $CURRENT_BRANCH"
        fi
    fi
else
    print_warning "You're on $CURRENT_BRANCH, skipping merge step"
fi

# Step 3: Set up git aliases
echo ""
echo "Step 3: Git Aliases Setup"
echo "-------------------------"

read -p "Do you want to add helpful git aliases to ~/.gitconfig? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Check if aliases already exist
    if git config --global alias.st > /dev/null 2>&1; then
        print_warning "Some aliases already exist, skipping..."
    else
        git config --global alias.st "status -sb"
        git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
        git config --global alias.br "branch -v"
        git config --global alias.co "checkout"
        git config --global alias.cm "commit -m"
        git config --global alias.nb "checkout -b"
        git config --global alias.sync '!git checkout develop && git pull origin develop && git checkout - && git merge develop'
        git config --global alias.cleanup '!git branch --merged develop | grep -v develop | xargs -n 1 git branch -d'
        
        print_success "Added git aliases to ~/.gitconfig"
    fi
fi

# Step 4: Show next steps
echo ""
echo "✨ Setup Complete!"
echo "==================="
echo ""
echo "Your git workflow is now configured. Here's what's next:"
echo ""
echo "To start a new feature:"
echo "  git checkout develop"
echo "  git pull origin develop"
echo "  git checkout -b feature/your-feature-name"
echo ""
echo "To commit changes:"
echo "  git add -p"
echo "  git commit -m 'type(scope): description'"
echo ""
echo "To view history:"
echo "  git lg  # beautiful log"
echo "  git st  # short status"
echo ""
echo "See SETUP_GIT_WORKFLOW.md for full documentation"
echo ""
print_success "Ready to code with better git hygiene!"

