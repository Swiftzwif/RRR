# Trajectory - Professional Life Assessment Platform

> Stoic, authoritative platform designed for high-value men seeking financial and personal transformation.

---

## 🚀 Quick Start

**New to the project?** Start here:
- 📖 [Complete Setup Guide](docs/setup/START_HERE.md)
- 🏗️ [Backend Setup](docs/setup/BACKEND_QUICK_START.md)
- 🔧 [Environment Configuration](docs/setup/ENV_SETUP.md)

---

## 📂 Project Structure

```
trajectory/
├── apps/trajectory2/         # Main Next.js 15 application
│   ├── src/app/              # App router (pages & API routes)
│   ├── src/components/       # React components
│   ├── src/lib/              # Utilities & configuration
│   └── public/               # Static assets
│
├── database/                 # SQL schemas & migrations
├── docs/                     # 📚 Complete documentation (see below)
├── scripts/                  # Setup & build scripts
└── packages/                 # Shared monorepo packages (legacy)
```

---

## 📚 Documentation

All documentation is organized in [`/docs`](docs/README.md):

### Core Documentation
- **[Setup Guides](docs/setup/)** - Get the project running
- **[Feature Documentation](docs/features/)** - Premium, payments, email
- **[Development Guides](docs/development/)** - Code standards, design system
- **[Deployment](docs/deployment/)** - Deploy to Vercel
- **[Planning & Architecture](docs/planning/)** - Requirements, decisions

### Quick Links
- [🎯 Requirements](docs/planning/REQUIREMENTS.md)
- [🎨 Design System](docs/development/DESIGN_SYSTEM.md)
- [💳 Payment Setup](docs/features/PAYMENT_SETUP.md)
- [🚀 Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)
- [📝 Git Workflow](docs/development/GIT_CHEATSHEET.md)

[**→ Browse all documentation**](docs/README.md)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Payments**: Square
- **Email**: Resend + React Email
- **Deployment**: Vercel

---

## 🏃 Development

```bash
# Install dependencies
npm run install:all

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type checking
npm run typecheck
```

---

## 📦 Workspace Structure

This is a monorepo managed with npm workspaces:

- **apps/trajectory2** - Main application
- **packages/** - Shared packages (legacy, not in active use)
- **database/** - Database schemas
- **docs/** - All project documentation
- **scripts/** - Setup and build scripts

---

## 🌲 Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

See [Git Workflow Guide](docs/development/GIT_CHEATSHEET.md) for details.

---

## 🎯 Key Features

### Life Assessment
- Comprehensive 42-question assessment
- 6 life domains: Identity, Health, Finances, Relationships, Emotions, Focus
- Real-time progress tracking
- Personalized results and recommendations

### Premium Experience
- Tiered access system (Free, Premium)
- Square payment integration
- Premium content gating
- User dashboard and account management

### 7-Day Transformation Course
- "Kill the Boy" methodology
- Daily lessons and exercises
- Email delivery system
- Progress tracking

### Professional Design
- Stoic, masculine aesthetic
- Canyon-inspired color palette
- Ample spacing and breathing room
- Mobile-responsive throughout

---

## 🔐 Environment Variables

Copy `apps/trajectory2/env.template` to `.env.local` and configure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Square Payments
SQUARE_ACCESS_TOKEN=
SQUARE_ENVIRONMENT=
SQUARE_LOCATION_ID=
NEXT_PUBLIC_SQUARE_APPLICATION_ID=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

See [Environment Setup Guide](docs/setup/ENV_SETUP.md) for details.

---

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes with atomic commits
3. Ensure tests pass: `npm run lint && npm run build`
4. Create a pull request to `develop`

See [Git Workflow](docs/development/GIT_CHEATSHEET.md) for detailed guidelines.

---

## 📄 License

Private - All rights reserved

---

## 👥 Team

Built with stoic determination for high-value men seeking transformation.

---

## 📞 Support

For questions or issues:
- Check [Documentation](docs/README.md)
- Review [Troubleshooting Guide](docs/development/QUICK_TEST_GUIDE.md)
- See [Implementation History](docs/history/)

---

*Last updated: October 2025*
