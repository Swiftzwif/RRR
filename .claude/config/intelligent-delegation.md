# Intelligent Task Delegation System

## Model Assignment Strategy

### Opus (3 agents) - $15/1M input, $75/1M output
**When to use**: Complex reasoning, critical architectural decisions, deep analysis

1. **Coordinator** - Makes strategic decisions affecting entire project
2. **Code Reviewer** - Deep code analysis, security patterns, architecture review
3. **Database Architect** - Complex schema design, normalization, relationship modeling

**Why Opus**:
- Architectural decisions have cascading effects
- Security vulnerabilities are costly
- Database design mistakes are expensive to fix

---

### Sonnet (8 agents) - $3/1M input, $15/1M output
**When to use**: Implementation requiring good reasoning, domain expertise, creative solutions

1. **UI/UX Designer** - Design decisions, component selection, aesthetic judgment
2. **Frontend Engineer** - Complex React patterns, state management, TypeScript
3. **Backend Engineer** - Business logic, API design, data flow
4. **Security Specialist** - Security implementation, validation logic
5. **Performance Optimizer** - Optimization strategies, tradeoff analysis
6. **Accessibility Specialist** - WCAG interpretation, user experience decisions
7. **QA/Testing Specialist** - Test strategy, edge case identification
8. **Project Manager** - Progress analysis, blocker resolution, coordination

**Why Sonnet**:
- Implementation requires creativity and problem-solving
- Domain expertise benefits from stronger reasoning
- Moderate cost for high-quality output

---

### Haiku (6 agents) - $0.25/1M input, $1.25/1M output
**When to use**: Pattern-following, well-defined tasks, repetitive operations

1. **DevOps** - Following deployment patterns, infrastructure templates
2. **API Integration** - Following SDK documentation, integration guides
3. **Content & Copy** - Writing based on clear guidelines and templates
4. **Documentation** - Template-based documentation, standard formats
5. **GitHub Admin** - Git commands follow patterns, conventional commits
6. **SEO & Analytics** - Following SEO best practices, standard meta tags

**Why Haiku**:
- Tasks have clear patterns to follow
- Speed matters for these operations
- Cost-effective for high-volume simple tasks

---

## Parallel Execution Strategy

### Phase 1: Foundation (Parallel when possible)
```
GitHub Admin (init repo) → Parallel {
  ├─ Database Architect (schema)
  └─ UI/UX Designer (design system)
}
```
**Time saved**: 40-50%

### Phase 2: Core Implementation (Maximum parallelization)
```
Parallel {
  ├─ Frontend Engineer (UI components)
  ├─ Backend Engineer (API endpoints)
  ├─ API Integration (third-party services)
  └─ Content & Copy (copy writing)
}
```
**Time saved**: 60-70%

### Phase 3: Enhancement (Parallel specialists)
```
Parallel {
  ├─ Performance Optimizer
  ├─ SEO Specialist
  ├─ Accessibility Specialist
  ├─ Security Specialist
  └─ DevOps (deployment prep)
}
```
**Time saved**: 70-80%

### Phase 4: Quality (Sequential for gates)
```
QA Specialist → Code Reviewer (GATE) → GitHub Admin → DevOps (deploy)
```
**Time saved**: None (quality gates are sequential by design)

---

## Intelligent Task Routing

### Decision Tree for Task Assignment

```
User Request
    ↓
Is it a new project?
    ├─ YES → Coordinator (Opus) analyzes & plans
    └─ NO  → Is it architectural change?
            ├─ YES → Coordinator (Opus)
            └─ NO  → Route directly to specialist
```

### Direct Routing (Skip Coordinator)
Route directly to specialist when:
- ✅ "Fix bug in component X" → Frontend Engineer (Sonnet)
- ✅ "Add meta tags to page Y" → SEO Specialist (Haiku)
- ✅ "Deploy to production" → DevOps (Haiku)
- ✅ "Update README" → Documentation (Haiku)
- ✅ "Add unit test for function Z" → QA Specialist (Sonnet)

This saves Opus tokens and reduces latency.

### Coordinator Routing (Full orchestration)
Route to Coordinator when:
- ❗ New project/feature requiring multiple agents
- ❗ Architectural changes affecting multiple systems
- ❗ Requirements unclear or ambiguous
- ❗ Multiple blockers or complex coordination needed

---

## Agent Communication Optimization

### Push vs Pull Communication

**Push (Agent → Context)**: Agent updates context when work completes
```markdown
## Current Tasks
### Completed
- Frontend Engineer: ProductCard component (2025-11-11 14:30)
  Files: components/features/product-card.tsx
  Ready for: QA testing
```

**Pull (Agent ← Context)**: Agent reads context before starting
```markdown
## Architecture Decisions
- Using NextAuth v5 for authentication
- Prisma as ORM
- PostgreSQL on Supabase
```

### Notification Protocol

**Urgent**: Blockers, critical failures
```markdown
🚨 BLOCKER: Frontend Engineer
Missing: API endpoint /api/products
Impact: HIGH - Cannot implement product listing
Escalate: YES
```

**Standard**: Task completion
```markdown
✅ COMPLETED: UI/UX Designer
Design system configured with shadcn + MagicUI
Next: Frontend Engineer can implement
```

**Info**: Progress updates
```markdown
📊 PROGRESS: Backend Engineer
API endpoints: 3/5 complete (60%)
ETA: 1 hour
```

---

## Smart Context Pruning

To prevent context bloat:

### Keep Forever
- Project overview
- Architecture decisions
- Tech stack
- Git status (current)

### Archive After 24h
- Completed tasks (move to context-archive.md)
- Resolved blockers
- Old progress updates

### Delete After 1h
- "In progress" status updates
- Agent check-ins
- Routine coordination messages

---

## Agent Specialization Matrix

### When Multiple Agents Could Handle Task

| Task | Primary Agent | Fallback | Why Primary? |
|------|---------------|----------|--------------|
| Form validation | Backend | Frontend | Server-side validation is security-critical |
| Button styling | UI/UX | Frontend | Design consistency matters more |
| API error handling | Backend | Security | Security implications in error exposure |
| Loading states | Frontend | UI/UX | Implementation-focused task |
| Docker optimization | DevOps | Performance | Infrastructure expertise primary |
| Bundle optimization | Performance | Frontend | Requires performance analysis tools |

---

## Intelligent Work Distribution

### Load Balancing
Track agent workload in context:
```markdown
## Agent Workload
- Frontend Engineer: 3 active tasks (HIGH)
- Backend Engineer: 1 active task (LOW)
- UI/UX Designer: 0 tasks (IDLE)
```

**Coordinator decision**:
- If Frontend overloaded and UI Designer idle → UI Designer implements simple components
- If Backend overloaded → Frontend handles more client-side logic

### Critical Path Optimization
Identify bottlenecks:
```
Critical Path: Database → Backend → Frontend → QA → Review
Non-critical: SEO, Content, Accessibility (can happen anytime)
```

**Strategy**: Prioritize critical path agents, parallelize non-critical

---

## Learning from Past Projects

### Context Templates
After completing projects, save templates:
```
~/.claude/templates/
├── landing-page/
│   ├── project-context-template.md
│   ├── common-tech-stack.yaml
│   └── typical-timeline.md
├── saas-app/
└── ecommerce/
```

**Benefit**: Faster project initialization, learned best practices

### Performance Metrics
Track in `.claude/config/metrics.json`:
```json
{
  "projects_completed": 10,
  "avg_time_to_completion": "4.5 hours",
  "most_common_blockers": [
    "API contract misalignment",
    "Missing env variables"
  ],
  "agent_performance": {
    "frontend": { "tasks": 50, "avg_time": "30min", "rework_rate": 0.1 },
    "backend": { "tasks": 45, "avg_time": "45min", "rework_rate": 0.15 }
  }
}
```

**Usage**: Coordinator uses metrics for better time estimates

---

## Advanced Coordination Patterns

### Pattern 1: Fan-Out / Fan-In
One task triggers multiple parallel agents, results merge:
```
Backend (create API) → Fan-out {
  Frontend (consume API)
  QA (test API)
  Documentation (document API)
} → Fan-in (all complete) → Code Reviewer
```

### Pattern 2: Pipeline
Sequential with handoffs:
```
UI/UX → Frontend → Accessibility → QA → Review → GitHub Admin
```

### Pattern 3: Conditional Routing
Based on context, route differently:
```
User request → Coordinator analyzes
    ├─ E-commerce? → API Integration (Stripe) first
    ├─ Content-heavy? → Content Specialist early
    └─ Performance-critical? → Performance Optimizer in Phase 2
```

### Pattern 4: Swarm Intelligence
Multiple agents solve same problem, best solution wins:
```
Performance Problem → Parallel {
  Performance Optimizer (approach A)
  Frontend Engineer (approach B)
} → Coordinator evaluates → Choose best
```
**Use sparingly**: Expensive but powerful for critical decisions

---

## Efficiency Metrics

### Target Metrics
- **Time to First Code**: <15 minutes (Coordinator → First agent working)
- **Parallel Work %**: >60% (agents working simultaneously)
- **Rework Rate**: <10% (Code Reviewer rejections)
- **Context Efficiency**: <2000 tokens per agent interaction
- **Cost per Project**:
  - Landing page: $1-2 (mostly Haiku/Sonnet)
  - SaaS app: $5-10 (some Opus for architecture)
  - Enterprise: $20-50 (extensive Opus usage)

### Optimization Opportunities
1. **Cache common patterns**: Reuse component implementations
2. **Agent templates**: Pre-configured responses for common tasks
3. **Batch operations**: Group similar tasks for one agent
4. **Smart model downgrade**: Use Haiku for second attempts if Sonnet fails (pattern is now clear)

---

## Real-World Example

**Task**: Build e-commerce product listing with filters

**Traditional approach** (sequential):
```
1. Coordinator plans (5 min)
2. Database schema (10 min)
3. Backend API (20 min)
4. Frontend UI (30 min)
5. Styling (15 min)
6. Tests (20 min)
7. Review (10 min)
Total: 110 minutes
```

**Intelligent approach** (parallel):
```
1. Coordinator plans (5 min) → Fan-out:
   Parallel {
     Database schema (10 min)
     UI/UX design system (8 min)
     Content copy (5 min)
   }
2. Backend API (20 min) + Frontend UI (30 min, partially parallel with backend)
3. Parallel {
     Tests (20 min)
     Accessibility check (10 min)
     SEO (5 min)
   }
4. Review (10 min) → Deploy
Total: 60-70 minutes (40% faster)
Cost: $0.50-1.00 with smart model usage
```

---

## Implementation in Coordinator

Coordinator should:
1. ✅ Analyze task complexity → Choose execution strategy
2. ✅ Identify parallelizable work → Launch agents concurrently
3. ✅ Monitor context size → Prune when needed
4. ✅ Track critical path → Prioritize bottleneck agents
5. ✅ Learn from metrics → Improve estimates over time
6. ✅ Balance cost vs speed → Use appropriate models

This makes the system not just functional, but **intelligent and efficient**.
