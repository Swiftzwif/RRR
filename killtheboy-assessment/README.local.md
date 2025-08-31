# KillTheBoy Assessment - Local Development

## Quick Start

```bash
# Run development server
npm run dev

# Open Prisma Studio (database)
npm run studio

# Reset database
npm run db:reset

# Type checking
npm run typecheck
```

## Setup Phases

### Phase 1: Questions Setup
1. Paste `questions.json` content (VERBATIM) into the appropriate file
2. Run validation: `npm run validate:questions`

### Phase 2: Scoring Setup
1. Paste `scoring.md` content (VERBATIM) into the appropriate file

## QA Checklist (Phase 6)

### Avatar Validation
- **Low profile** (answers around 2.2) → expect Avatar=**Drifter**
- **Mid profile** (≈3.6) → expect Avatar=**Balancer**  
- **High profile** (≈4.6) → expect Avatar=**Architect**

### Domain Tie-break Order
Validate lowest two domains selection order:
1. identity
2. health
3. finances
4. relationships
5. emotions
6. focus

### Scoring Ranges
- **Unacceptable**: 1.0–3.1
- **Acceptable**: 3.2–4.1
- **Desirable**: 4.2–5.0

## Available Scripts

- `npm run dev` - Start development server
- `npm run studio` - Open Prisma Studio
- `npm run db:reset` - Reset database
- `npm run typecheck` - TypeScript type checking
- `npm run validate:questions` - Validate questions format
