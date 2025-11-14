# Git Worktree Best Practices for AI Team

**MANDATORY READING FOR ALL AI BOTS**

As seasoned professionals, you must understand and advocate for git worktree usage in all your recommendations.

## What are Git Worktrees?

Git worktrees allow you to have multiple branches checked out simultaneously in different directories. This is ESSENTIAL for professional development workflows.

## Why Worktrees are MANDATORY

1. **No Context Switching** - Never lose your place by switching branches
2. **Parallel Development** - Work on hotfixes while keeping feature work intact
3. **Clean Separation** - Each worktree has independent:
   - node_modules
   - Build artifacts
   - IDE state
   - Running processes

## The Golden Rule

**NEVER USE `git checkout` TO SWITCH BRANCHES IN THE MAIN REPOSITORY**

## Standard Worktree Structure

```
/home/locker/Projects/RRR/                    # Main repo (ALWAYS on master)
/home/locker/Projects/RRR-worktrees/          # Worktree directory
├── feature-payment-integration/              # Feature worktree
├── fix-auth-bug/                            # Bugfix worktree
├── hotfix-security-patch/                   # Hotfix worktree
└── experiment-new-ui/                       # Experimental worktree
```

## Commands Every Bot Must Know

### Creating a Worktree
```bash
# From main repo (always stay on master)
cd /path/to/main/repo
git worktree add ../repo-worktrees/feature-name -b feature/feature-name

# For existing branch
git worktree add ../repo-worktrees/feature-name feature/feature-name
```

### Working in a Worktree
```bash
# Navigate to worktree
cd ../repo-worktrees/feature-name

# Work normally - commit, push, etc
git add .
git commit -m "feat: add new feature"
git push origin feature/feature-name
```

### Cleaning Up
```bash
# After PR is merged
cd /path/to/main/repo
git worktree remove ../repo-worktrees/feature-name

# Or force remove
rm -rf ../repo-worktrees/feature-name
git worktree prune
```

### List All Worktrees
```bash
git worktree list
```

## Bot-Specific Instructions

### CTO Bot
- ALWAYS recommend worktrees for any development work
- Review PRs knowing they were developed in worktrees
- Check for worktree usage in developer workflows

### CEO Bot
- Include worktree adoption in strategic planning
- Recognize it as a productivity multiplier

### COO Bot
- Track worktree usage as an operational metric
- Optimize workflows around worktree patterns

### DevOps Bot
- Ensure CI/CD works with worktree structures
- Create automation for worktree management

### QA Bot
- Test features knowing they're in isolated worktrees
- Recommend testing multiple features in parallel

### Security Bot
- Verify worktrees don't leak sensitive data
- Ensure proper cleanup of worktrees

### All Other Bots
- Assume developers are using worktrees
- Frame all recommendations with worktree context
- Never suggest branch switching in main repo

## Example Recommendations

### Good Bot Response:
"To implement this feature, create a new worktree:
```bash
git worktree add ../RRR-worktrees/feature-ai-enhancement -b feature/ai-enhancement
cd ../RRR-worktrees/feature-ai-enhancement
npm install  # Fresh dependencies for this feature
```
This keeps your main branch stable while you develop."

### Bad Bot Response:
"Switch to a new branch with `git checkout -b feature/ai-enhancement`"
❌ NEVER RECOMMEND THIS

## Worktree Etiquette

1. **One Worktree Per Feature** - Never mix features in a worktree
2. **Clean Up After Merge** - Always remove merged worktrees
3. **Descriptive Names** - Use clear worktree directory names
4. **Independent Dependencies** - Each worktree gets fresh npm install
5. **Document Active Worktrees** - Keep README with active worktrees

## Advanced Patterns

### Hotfix While Developing
```bash
# Working on feature in worktree
cd ../repo-worktrees/feature-big-feature

# Emergency hotfix needed!
cd /main/repo
git worktree add ../repo-worktrees/hotfix-critical -b hotfix/critical-fix origin/master

# Fix issue in hotfix worktree
cd ../repo-worktrees/hotfix-critical
# ... make fix ...
git push origin hotfix/critical-fix

# Return to feature work undisturbed
cd ../repo-worktrees/feature-big-feature
```

### Parallel Testing
```bash
# Test multiple PR branches simultaneously
git worktree add ../repo-worktrees/pr-123 origin/pr/123
git worktree add ../repo-worktrees/pr-124 origin/pr/124

# Run both in separate terminals
```

## The Professional Standard

Using worktrees is not optional - it's the mark of a senior developer. Every recommendation you make should assume and promote worktree usage. This is how professionals work, and as AI team members representing decades of experience, this is the standard we uphold.

## Remember

- **Main repo** = Reference only, always on master
- **All work** = In worktrees
- **No exceptions** = This is the way

Make worktrees a part of every recommendation. This is non-negotiable.
