# Git Workflow Cheat Sheet 🚀

Quick reference for your daily git workflow.

## Daily Commands

### Start Your Day

```bash
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop
```

### Create New Feature

```bash
git checkout develop && git pull
git checkout -b feature/TRJ-123-descriptive-name
```

### Commit Your Work

```bash
# Review changes
git diff

# Stage interactively
git add -p

# Commit with message
git commit -m "feat(scope): what you did"
```

### Push Your Work

```bash
git push origin your-branch-name
```

## Commit Message Types

| Type | Use For |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Build/config changes |

### Examples

```bash
feat(assessment): add email validation
fix(payment): prevent duplicate charges
docs(readme): update installation steps
refactor(ui): extract button component
test(auth): add login flow tests
chore(deps): upgrade next.js to v15
```

## Branch Naming

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/TRJ-##-name` | `feature/TRJ-101-user-profile` |
| Bug Fix | `fix/TRJ-##-name` | `fix/TRJ-102-validation-error` |
| Hotfix | `hotfix/TRJ-##-name` | `hotfix/TRJ-103-payment-crash` |
| Refactor | `refactor/scope-name` | `refactor/ui-components` |
| Docs | `docs/what` | `docs/api-documentation` |

## Viewing History

```bash
# Beautiful log
git log --graph --oneline --all --decorate

# With alias
git lg

# Find by message
git log --grep="payment"

# Find by author
git log --author="Your Name"

# Find by date
git log --since="2024-01-01"

# See file history
git log --follow path/to/file.tsx

# See who changed a line
git blame path/to/file.tsx
```

## Branch Management

```bash
# List all branches
git branch -a

# List with last commit
git branch -v

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# See merged branches
git branch --merged develop

# Clean up merged branches
git branch --merged develop | grep -v develop | xargs -n 1 git branch -d
```

## Syncing & Updates

```bash
# Update current branch from develop
git checkout develop
git pull origin develop
git checkout -
git merge develop

# With alias (after setup)
git sync
```

## Undo Commands

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1

# Undo specific file
git checkout HEAD -- path/to/file

# Undo all uncommitted changes
git reset --hard HEAD
```

## Stashing

```bash
# Save work in progress
git stash

# Save with message
git stash save "WIP: implementing feature"

# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply specific stash
git stash apply stash@{0}

# Apply and remove
git stash pop
```

## Merge Conflicts

```bash
# See conflicted files
git status

# After resolving conflicts
git add .
git commit -m "merge: resolve conflicts with develop"

# Abort merge
git merge --abort
```

## Code Review

### Before Creating PR

```bash
# Self-review changes
git diff develop

# Check what will be pushed
git log develop..HEAD --oneline

# Run tests
npm run lint
npm run test
npm run build
```

### PR Checklist

- [ ] Branch name follows convention
- [ ] Commits use conventional format
- [ ] Code builds successfully
- [ ] Tests pass
- [ ] No console.logs left
- [ ] Documentation updated

## Git Aliases (After Setup)

```bash
git st          # status -sb
git lg          # beautiful log
git br          # branch -v
git co          # checkout
git cm          # commit -m
git nb          # new branch (checkout -b)
git sync        # update from develop
git cleanup     # delete merged branches
```

## Emergency Commands

### Committed to Wrong Branch

```bash
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1
```

### Need to Change Last Commit

```bash
# Just the message
git commit --amend -m "new message"

# Add more files
git add forgotten-file.tsx
git commit --amend --no-edit
```

### Accidentally Deleted Branch

```bash
# Find the commit
git reflog

# Recreate branch
git checkout -b branch-name <commit-hash>
```

---

## Quick Workflow Example

```bash
# Monday morning
git checkout develop && git pull

# New feature
git checkout -b feature/TRJ-150-add-notifications

# Make changes, commit
git add src/notifications/
git commit -m "feat(notifications): add notification system"

# More work
git add tests/
git commit -m "test(notifications): add notification tests"

# Push
git push origin feature/TRJ-150-add-notifications

# Create PR on GitHub
# Target: develop
# Title: [FEAT] Notifications: Add notification system
```

---

**Pro Tip**: Keep this cheat sheet open in a tab while working!

**Need Help?** Check `SETUP_GIT_WORKFLOW.md` for detailed explanations.
