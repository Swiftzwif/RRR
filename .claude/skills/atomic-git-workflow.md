# Atomic Git Workflow Skill

Lightning-fast git operations with human-like commit messages. No AI signatures, just clean code changes.

## Commit Message Patterns

### Feature Commits
```
feat: add email capture to assessment flow
fix: resolve payment webhook timeout
style: polish hero section spacing
refactor: extract assessment logic to hook
perf: optimize image loading on course pg
docs: update api endpoint examples
chore: bump deps & clean configs
test: add coverage for square webhook
```

### Multi-File Changes Pattern
```bash
# Stage specific changes
git add -p

# Commit with context
git commit -m "feat: wire up assessment → email flow

- capture email before results
- store in supabase w/ assessment id  
- trigger welcome sequence
- add loading state during save"
```

## Branch Management

### Quick Branch Creation
```bash
# Feature
git checkout -b feat/assessment-email-gate

# Fix
git checkout -b fix/payment-retry-logic

# Polish
git checkout -b style/apple-grade-animations

# Refactor
git checkout -b refactor/course-module-arch
```

### Automated PR Flow
1. Work in small batches (10-50 lines)
2. Commit every 15-30 mins
3. Push at natural breakpoints
4. Auto-generate PR description
5. Merge when green

## Commit Rules

**DO:**
- Use present tense ("add" not "added")
- Keep under 50 chars for subject
- Reference issue if exists (#123)
- Group related changes
- Test before committing

**DON'T:**
- Use "updated", "fixed stuff"
- Mix unrelated changes
- Commit console.logs
- Leave TODO comments
- Use AI-sounding language

## Quick Commands

```bash
# Atomic commit workflow
alias gs="git status -sb"
alias ga="git add -p"
alias gc="git commit"
alias gp="git push origin HEAD"
alias gpr="gh pr create --fill"

# Quick fixes
alias gundo="git reset --soft HEAD~1"
alias gamend="git commit --amend --no-edit"
```

## PR Descriptions

**Template:**
```markdown
## What
Quick description of changes

## Why  
Business reason / user impact

## Testing
- [x] Tested locally
- [x] No console errors
- [x] Responsive verified
```

## Merge Strategy

- Squash for features (clean history)
- Merge for releases (preserve context)
- Rebase for small fixes (linear)

## Emergency Commands

```bash
# Accidentally on main
git checkout -b fix/emergency-branch
git reset --hard origin/main

# Need to switch tasks
git stash save "wip: payment form"
git checkout other-branch
# Later: git stash pop
```
