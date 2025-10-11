# Setting Up Your Git Workflow

This guide will help you restructure your git tree for better organization, easier code reviews, and faster history searches.

## Current State

Right now you have:

- `master` branch (production)
- `feature/project-restructure` branch (current work)

## Target State

We want to establish:

- `master` or `main` - Production-ready code
- `develop` - Integration branch where features come together
- Multiple feature branches - Each for a specific task

## Step-by-Step Setup

### 1. Create a Develop Branch

```bash
# Switch to master and make sure it's up to date
git checkout master
git pull origin master

# Create develop branch from master
git checkout -b develop
git push origin develop

# Set develop as the default branch for new features
git branch --set-upstream-to=origin/develop develop
```

### 2. Merge Your Current Feature Branch

```bash
# First, let's finish the current feature branch properly
git checkout feature/project-restructure
git pull origin feature/project-restructure

# Merge it into develop (not master)
git checkout develop
git merge feature/project-restructure --no-ff -m "merge: integrate project restructure and linting fixes"

# Push to develop
git push origin develop

# Optional: Delete the old feature branch locally and remotely
git branch -d feature/project-restructure
git push origin --delete feature/project-restructure
```

### 3. Set Up Git Aliases (Recommended)

Add these to your `~/.gitconfig` file:

```ini
[alias]
    # Quick status
    st = status -sb
    
    # Beautiful log
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
    
    # Show branches with last commit
    br = branch -v
    
    # Quick checkout
    co = checkout
    
    # Quick commit
    cm = commit -m
    
    # Create new branch
    nb = checkout -b
    
    # Update from develop
    sync = !git checkout develop && git pull origin develop && git checkout - && git merge develop
    
    # Clean merged branches
    cleanup = !git branch --merged develop | grep -v develop | xargs -n 1 git branch -d
```

## New Workflow Examples

### Example 1: Starting a New Feature

```bash
# Make sure you're starting from develop
git checkout develop
git pull origin develop

# Create a new feature branch with descriptive name
git checkout -b feature/TRJ-001-add-user-profile

# Make your changes...
# (edit files)

# Commit with conventional commit message
git add -p  # Review changes interactively
git commit -m "feat(user): add user profile page with avatar upload"

# Push your feature branch
git push origin feature/TRJ-001-add-user-profile
```

### Example 2: Fixing a Bug

```bash
# Start from develop
git checkout develop
git pull origin develop

# Create a fix branch
git checkout -b fix/TRJ-002-payment-validation

# Make your fixes...
git add -p
git commit -m "fix(payment): validate card number format before submission"

# Push and create PR
git push origin fix/TRJ-002-payment-validation
```

### Example 3: Daily Work Routine

```bash
# Morning - sync with develop
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop  # Get latest changes

# During the day - commit frequently
git add -p
git commit -m "feat(assessment): add question validation"

# Another commit
git add -p
git commit -m "test(assessment): add unit tests for validation"

# End of day - push your work
git push origin your-feature-branch
```

### Example 4: Completing a Feature

```bash
# Make sure tests pass
npm run lint
npm run test
npm run build

# Update from develop one last time
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop

# Resolve any conflicts if they exist
# Then push
git push origin your-feature-branch

# Create a Pull Request on GitHub:
# - Target: develop (not master)
# - Title: [FEAT] Assessment: Add question validation and tests
# - Description: Use the PR template from .cursorrules
```

## Helpful Commands for Code Review & History

### Find specific changes

```bash
# Find all commits related to payments
git log --grep="payment" --oneline

# Find commits by you in the last week
git log --author="Your Name" --since="1 week ago" --oneline

# See what changed in a file
git log --follow -p -- path/to/file.tsx

# Find when a specific line was added
git blame path/to/file.tsx
```

### Visual history

```bash
# Beautiful branch visualization
git log --graph --all --oneline --decorate

# Or with the alias:
git lg --all
```

### Branch management

```bash
# See all branches with last commit
git branch -v

# See merged branches (safe to delete)
git branch --merged develop

# Clean up merged branches
git branch --merged develop | grep -v develop | xargs -n 1 git branch -d

# Or with alias:
git cleanup
```

## Quick Reference Card

| Task | Command |
|------|---------|
| Start new feature | `git checkout develop && git pull && git checkout -b feature/NAME` |
| Commit changes | `git add -p && git commit -m "type(scope): message"` |
| Update branch | `git checkout develop && git pull && git checkout - && git merge develop` |
| Push work | `git push origin BRANCH-NAME` |
| See branch status | `git st` (with alias) |
| View history | `git lg` (with alias) |
| Find commits | `git log --grep="SEARCH"` |
| Clean old branches | `git cleanup` (with alias) |

## Best Practices

1. **Branch names should be descriptive**: `feature/add-email-notifications` not `feature/stuff`
2. **Commit messages should explain why**: "fix validation" is bad, "fix(auth): prevent login with empty password" is good
3. **Commit often**: Small, atomic commits are easier to review and revert
4. **Keep branches short-lived**: 1-3 days max, merge frequently
5. **Never force push to shared branches**: Except your own feature branches
6. **Review your own changes before pushing**: Use `git diff develop`

## Troubleshooting

### "I committed to the wrong branch"

```bash
# If you haven't pushed yet
git checkout correct-branch
git cherry-pick commit-hash

git checkout wrong-branch
git reset --hard HEAD~1
```

### "I need to undo my last commit"

```bash
# Keep the changes, undo the commit
git reset --soft HEAD~1

# Discard everything
git reset --hard HEAD~1
```

### "I have merge conflicts"

```bash
# See what's conflicted
git status

# Edit the files, look for <<<<<<< markers
# After fixing:
git add .
git commit -m "merge: resolve conflicts with develop"
```

## Migration Plan

Here's the recommended order to set this up:

1. ✅ Add `.cursorrules` file (done)
2. 🔄 Create `develop` branch from `master`
3. 🔄 Merge current `feature/project-restructure` into `develop`
4. 🔄 Set up git aliases in `~/.gitconfig`
5. 🔄 Create a new feature branch for next task
6. ✅ Follow the new workflow going forward

---

**Ready to implement this?** Run the commands in Step 1 and 2 above to get started!
