# Shared Context Protocol

This file defines how agents communicate and maintain shared context across the development team.

## Protocol Rules

### 1. Context File Location
- **Global projects**: `~/.claude/active-context.md`
- **Local projects**: `.claude/project-context.md` (in project root)

### 2. Context File Structure

```markdown
# Project Context

## Project Overview
- **Name**: [Project Name]
- **Type**: [Landing Page | SaaS App | E-commerce | Component Library | Other]
- **Tech Stack**: [List technologies]
- **Status**: [Planning | In Progress | Review | Completed]

## Architecture Decisions
[Key architectural decisions made]

## Current Tasks
### Active
- [Agent Name]: [Current task]

### Completed
- [Agent Name]: [Completed task] - [Timestamp]

### Blocked
- [Agent Name]: [Blocked task] - [Reason]

## File Structure
[Current project file structure]

## Dependencies
[NPM packages, external services]

## Environment Variables
[Required env vars - NO SECRETS, just names]

## API Contracts
[API endpoints, schemas]

## Design Tokens (if applicable)
[Colors, typography, spacing extracted from Figma]

## Git Status
- **Current Branch**: [branch]
- **Last Commit**: [commit hash] - [message]
- **Pending Changes**: [list]

## Notes
[Important notes, gotchas, TODOs]
```

### 3. Agent Communication Rules

#### Before Starting Work
1. Read current context file
2. Update "Current Tasks" with your task (set to Active)
3. Check for conflicts with other agents
4. Notify GitHub Admin of intention to make changes

#### During Work
1. Update context file with significant decisions
2. Log completed sub-tasks
3. If blocked, update "Blocked" section immediately
4. Coordinate with related agents via context file

#### After Completing Work
1. Move task from "Active" to "Completed" with timestamp
2. Update file structure if files added/modified
3. Report to Code Reviewer for validation
4. Report to GitHub Admin for git coordination
5. Update dependencies if packages added

#### Git Coordination (CRITICAL)
**ALL agents must coordinate with GitHub Admin before:**
- Creating/modifying files
- Making commits
- Creating branches
- Submitting PRs

**Process:**
1. Agent completes work
2. Agent updates context: "Awaiting GitHub Admin approval for [changes]"
3. Code Reviewer validates code quality
4. GitHub Admin reviews changes, manages git workflow
5. GitHub Admin updates context with commit info

### 4. Coordinator Responsibilities
- Initialize context file for new projects
- Monitor agent progress via context file
- Resolve conflicts between agents
- Ensure no duplicate work
- Summarize status for user at key milestones

### 5. Project Manager Responsibilities
- Track overall progress
- Update project status
- Report blockers to Coordinator
- Maintain timeline estimates
- Generate status reports for user

### 6. Context File Locking
To prevent race conditions:
- Agents should read → modify → write quickly
- Use timestamps to detect conflicts
- If conflict detected, re-read and merge
- Critical updates (Git Status) managed by GitHub Admin only

### 7. Context Pruning
When context file grows too large:
- Archive completed tasks to `.claude/context-archive.md`
- Keep only recent 10 completed tasks in main file
- Preserve all architecture decisions (never prune)

## Example Workflow

### New Project Initialization
```markdown
# Project Context

## Project Overview
- **Name**: Acme Marketing Site
- **Type**: Landing Page
- **Tech Stack**: Next.js 15, TypeScript, Tailwind, MagicUI, Framer Motion
- **Status**: Planning

## Architecture Decisions
- 2025-11-11: Chose Next.js App Router for better SEO
- 2025-11-11: Using MagicUI for animated components
- 2025-11-11: Deploying to Vercel

## Current Tasks
### Active
- Coordinator: Planning project structure
- UI Designer: Extracting Figma design tokens from /figma-export

### Completed
None yet

### Blocked
None

## File Structure
```
acme-marketing/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── public/
└── package.json
```

## Dependencies
- next@15.x
- react@19.x
- typescript@5.x
- tailwindcss@3.x
- @magic-ui/react
- framer-motion

## Environment Variables
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_GA_ID

## Git Status
- **Current Branch**: main
- **Last Commit**: Initial commit
- **Pending Changes**: None

## Notes
- Client wants smooth scroll animations
- Prioritize mobile-first design
- Target Lighthouse score > 95
```

## Agent-Specific Guidelines

### Coordinator
- **Always** initialize context file first
- Update project status at each stage
- Summarize context for user when asked

### GitHub Admin
- **Own** the Git Status section - only you update it
- Validate all pending changes before committing
- Maintain clean commit history
- Never force push to main

### Code Reviewer
- Update context with code quality concerns
- Block merges if quality standards not met
- Document review decisions

### All Other Agents
- Follow the Before/During/After rules
- Be specific in task updates
- Communicate blockers immediately
- Respect Git Status (GitHub Admin authority)
