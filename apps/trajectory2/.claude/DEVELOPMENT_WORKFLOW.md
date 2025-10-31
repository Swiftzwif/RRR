# 🚀 Professional Development Workflow Guide

> *"Measure twice, cut once"* - The carpenter's rule applied to software engineering

This guide codifies the systematic approach used by veteran software engineers. Follow this workflow to ensure quality, maintainability, and professional-grade code delivery.

## 📋 Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [Phase 1: Problem Identification](#phase-1-problem-identification)
3. [Phase 2: Investigation & Analysis](#phase-2-investigation--analysis)
4. [Phase 3: Planning & Design](#phase-3-planning--design)
5. [Phase 4: Implementation](#phase-4-implementation)
6. [Phase 5: Testing & Verification](#phase-5-testing--verification)
7. [Phase 6: Git Workflow](#phase-6-git-workflow)
8. [Phase 7: Deployment](#phase-7-deployment)
9. [Phase 8: Post-Deployment](#phase-8-post-deployment)
10. [Automation Templates](#automation-templates)
11. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🎯 Core Philosophy

### The Three Pillars
1. **Plan Before Execute** - Never touch code without a clear plan
2. **Test Everything** - Automated testing catches issues before users do
3. **Document Ruthlessly** - Your future self will thank you

### The Workflow Loop
```
Identify → Investigate → Plan → Implement → Test → Deploy → Verify → Document
```

---

## 🔍 Phase 1: Problem Identification

### Step 1: Gather Evidence
Always start with concrete evidence, not assumptions.

```javascript
// Create diagnostic script: check-issue.js
const { chromium } = require('@playwright/test');

async function diagnoseIssue() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to problem area
  await page.goto('https://site.com/problem-page');

  // Capture evidence
  await page.screenshot({
    path: 'issue-screenshot.png',
    fullPage: true
  });

  // Check for specific issues
  const errors = await page.locator('.error').count();
  console.log(`Found ${errors} error elements`);

  await browser.close();
}
```

### Step 2: Document the Issue
```markdown
## Issue Report
- **URL**: https://site.com/raffle
- **Behavior**: Text appears invisible
- **Expected**: Orange gradient text visible
- **Screenshots**: issue-screenshot.png
- **Browser**: Chrome 120
- **Timestamp**: 2025-10-30
```

### Step 3: Check Multiple Environments
```bash
# Check production
node check-live-site.js

# Check local
node check-local-site.js

# Compare results
```

---

## 🕵️ Phase 2: Investigation & Analysis

### Root Cause Analysis Checklist

```bash
# 1. Check recent changes
git log --oneline -10
git diff HEAD~1

# 2. Search for problem patterns
grep -r "sunset" src/
grep -r "text-transparent" src/

# 3. Check configurations
cat tailwind.config.js | grep -A 5 -B 5 "colors"

# 4. Review dependencies
npm list | grep tailwind

# 5. Check build output
npm run build 2>&1 | tee build.log
```

### Configuration Analysis
```javascript
// Always check these files for styling issues:
const configFiles = [
  'tailwind.config.js',
  'postcss.config.js',
  'next.config.js',
  'tsconfig.json',
  '.eslintrc.json'
];
```

---

## 📐 Phase 3: Planning & Design

### Create Task List
```javascript
// Use TodoWrite tool
const tasks = [
  "Identify root cause",
  "Review affected files",
  "Plan fix approach",
  "Implement changes",
  "Test locally",
  "Deploy to production"
];
```

### Document Fix Plan
```markdown
## Fix Plan: Invisible Text Issue

### Root Cause
Missing color definitions in Tailwind config

### Affected Files
- tailwind.config.js
- src/components/raffle/*.tsx
- src/components/RaffleButton.tsx

### Fix Approach
1. Add sunset color palette to config
2. Update all sunset references to orange-500
3. Test gradient text visibility
4. Verify button backgrounds

### Testing Required
- Visual regression test
- Cross-browser check
- Mobile responsiveness
```

---

## 🛠️ Phase 4: Implementation

### Making Changes - The Rules

1. **Minimal Changes Only**
   ```javascript
   // BAD: Rewriting entire component
   // GOOD: Surgical edit to fix specific issue
   ```

2. **Configuration Before Code**
   ```bash
   # Fix order:
   1. tailwind.config.js    # Config first
   2. Component files       # Then components
   3. Test files           # Update tests last
   ```

3. **Use Bulk Replace When Appropriate**
   ```javascript
   // When replacing consistent patterns
   Edit.replace_all = true
   old_string: "text-sunset"
   new_string: "text-orange-500"
   ```

4. **Follow Existing Patterns**
   ```javascript
   // Match existing code style
   // Use same naming conventions
   // Maintain consistent formatting
   ```

---

## ✅ Phase 5: Testing & Verification

### Local Testing Protocol

```bash
# 1. Clear caches
rm -rf .next
rm -rf node_modules/.cache

# 2. Run build
npm run build

# 3. Start dev server
npm run dev

# 4. Run automated tests
node test-local-fixes.js
```

### Visual Testing Template
```javascript
// test-visual-regression.js
const { chromium } = require('@playwright/test');

async function testVisualRegression() {
  const pages = [
    '/raffle',
    '/course',
    '/admin/raffle'
  ];

  for (const page of pages) {
    await testPage(page);
  }
}

async function testPage(path) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test multiple viewports
  const viewports = [
    { width: 1920, height: 1080 }, // Desktop
    { width: 768, height: 1024 },  // Tablet
    { width: 375, height: 667 }    // Mobile
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(`http://localhost:3000${path}`);
    await page.screenshot({
      path: `test-${path.replace('/', '-')}-${viewport.width}.png`
    });
  }

  await browser.close();
}
```

### Verification Checklist
```markdown
□ Build completes without errors
□ No TypeScript errors
□ No ESLint warnings
□ All tests pass
□ Visual regression matches expected
□ Console free of errors
□ Performance metrics acceptable
□ Accessibility standards met
```

---

## 🌿 Phase 6: Git Workflow

### Atomic Commits - The Gold Standard

#### Commit Message Format
```
type(scope): subject

- First change detail
- Second change detail
- Third change detail

Fixes #issue
```

#### Types
- `fix`: Bug fixes
- `feat`: New features
- `test`: Testing changes
- `docs`: Documentation
- `refactor`: Code refactoring
- `style`: Formatting changes
- `perf`: Performance improvements
- `chore`: Maintenance tasks

#### Real Examples
```bash
git commit -m "fix: add missing sunset colors to fix invisible text on raffle page

- Add sunset color palette to Tailwind config (orange tones)
- Replace all sunset references with orange-500/600 throughout components
- Fix transparent text issue on gradient elements
- Update button backgrounds from transparent to proper orange gradients
- Fix CTA text visibility issues across all raffle components"
```

### Branch Strategy
```bash
# Feature development
git checkout -b feat/raffle-grand-opening

# Bug fixes
git checkout -b fix/invisible-text-issue

# Always pull latest before starting
git pull origin master
```

### Pre-Commit Checks
```bash
# Before EVERY commit:
npm run build        # Ensure builds
npm run test         # Run tests
git diff --staged    # Review changes
```

---

## 🚀 Phase 7: Deployment

### Pre-Deployment Checklist
```markdown
□ All local tests passing
□ Build completes successfully
□ Screenshots captured for comparison
□ Commit message clear and descriptive
□ PR description complete
□ Code reviewed (if applicable)
```

### Deployment Commands
```bash
# For feature branches
git push origin feat/branch-name

# For hotfixes to master
git checkout master
git pull origin master
git merge --no-ff fix/branch-name
git push origin master

# Tag releases
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3
```

### Monitor Deployment
```bash
# Watch build logs
# Check deployment status
# Monitor error tracking
# Watch performance metrics
```

---

## 🔄 Phase 8: Post-Deployment

### Verification Protocol
```javascript
// verify-deployment.js
async function verifyDeployment() {
  const urls = [
    'https://production.com',
    'https://production.com/raffle',
    'https://production.com/api/health'
  ];

  for (const url of urls) {
    const response = await fetch(url);
    console.log(`${url}: ${response.status}`);
  }

  // Visual verification
  await captureProductionScreenshots();
  await compareWithBaseline();
}
```

### Documentation Updates
```markdown
## Deployment Log
- **Date**: 2025-10-30
- **Version**: v1.2.3
- **Changes**: Fixed invisible text issue
- **Rollback**: git revert abc123 if needed
```

---

## 🤖 Automation Templates

### Browser Testing Template
```javascript
// browser-test-template.js
const { chromium } = require('@playwright/test');

class BrowserTest {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async run() {
    this.browser = await chromium.launch({
      headless: false,
      slowMo: 200
    });
    this.page = await this.browser.newPage();

    try {
      await this.execute();
    } finally {
      await this.browser.close();
    }
  }

  async execute() {
    // Override in subclass
  }

  async checkElement(selector, property) {
    const element = await this.page.locator(selector).first();
    return await element.evaluate((el, prop) =>
      window.getComputedStyle(el)[prop], property
    );
  }
}
```

### API Testing Template
```javascript
// api-test-template.js
async function testAPI(endpoint, method = 'GET', body = null) {
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null
  });

  return {
    status: response.status,
    data: await response.json(),
    headers: response.headers
  };
}
```

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### Issue: Transparent Text
```bash
# Check Tailwind config
grep -n "transparent" tailwind.config.js

# Find usage
grep -r "text-transparent" src/

# Fix: Ensure gradient colors defined
```

#### Issue: Build Failures
```bash
# Clear all caches
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### Issue: Git Merge Conflicts
```bash
# Stash changes
git stash

# Update branch
git pull origin master

# Apply stashed changes
git stash pop

# Resolve conflicts manually
```

#### Issue: Production Differs from Local
```bash
# Check environment variables
diff .env.local .env.production

# Verify build mode
NODE_ENV=production npm run build

# Test production build locally
npm run start
```

---

## 📚 Quick Reference

### Essential Commands
```bash
# Development
npm run dev              # Start dev server
npm run build           # Build production
npm run test            # Run tests

# Git
git status              # Check changes
git diff                # Review changes
git log --oneline -5    # Recent commits
git stash              # Temporary save

# Diagnostics
grep -r "pattern" .     # Search codebase
find . -name "*.tsx"    # Find files
ls -la                  # List all files
```

### VSCode Shortcuts
```
Cmd+Shift+F    # Search workspace
Cmd+P          # Quick file open
Cmd+Shift+P    # Command palette
Cmd+/          # Toggle comment
```

---

## 🎓 Best Practices Summary

1. **Always plan before coding**
2. **Test locally before pushing**
3. **Commit atomically with clear messages**
4. **Document your decisions**
5. **Automate repetitive tasks**
6. **Review your own code before requesting review**
7. **Keep the feedback loop tight**
8. **Learn from every bug**

---

## 📝 Workflow Checklist Template

```markdown
## Task: [Description]

### Pre-Work
□ Issue identified and documented
□ Root cause analyzed
□ Fix plan created
□ TodoWrite list created

### Implementation
□ Configuration updated
□ Code changes made
□ Tests written/updated
□ Local testing complete

### Deployment
□ Build passes
□ Commit created
□ PR opened (if applicable)
□ Deployed to production

### Post-Deployment
□ Production verified
□ Documentation updated
□ Team notified
□ Monitoring confirmed
```

---

*Last Updated: 2025-10-30*
*Version: 1.0.0*