# Lane Diagnostic Game

A gamified version of the Lane Diagnostic assessment with timers, anti-gaming measures, and achievement badges.

## Features

- **60-second timer** per question to capture first instincts
- **Randomized question order** for each session
- **Validation questions** to ensure consistency
- **Milestone toasts** at 25%, 50%, 75%, and 100% progress
- **Micro-insights** every 3 questions based on recent answers
- **Anti-gaming telemetry** with confidence scoring
- **Achievement badges** for different performance metrics
- **Share functionality** with native and social fallbacks

## Game Mechanics

### Question Flow
- 18 main questions across 4 categories
- 2 validation questions (rephrased duplicates) at 25% and 75%
- 60-second timer per question with auto-advance on timeout
- No back button to prevent gaming

### Anti-Gaming Measures
- Average answer time tracking
- Answer change counting
- Timeout tracking
- Validation question consistency
- Confidence score calculation (0-100%)

### Achievements
- **SKY_PILOT**: Completed the assessment
- **FIRST_INSTINCT**: Fast responses with minimal changes
- **STEADY_CLIMB**: Zero timeouts
- **HONEST_SIGNAL**: High validation consistency
- **CLOSER_90**: Strong finish with high final scores

## Development

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Supabase project

### Setup
1. Copy environment variables:
   ```bash
   cp env-template.txt .env.local
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up Supabase tables:
   ```bash
   # Run the SQL schema in your Supabase dashboard
   cat supabase-schema.sql
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```

The app will run on http://localhost:3001

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE`: Your Supabase service role key (for server-side operations)
- `NEXT_PUBLIC_SHOW_LANE_GAME_PREVIEW`: Feature flag for preview mode

## Database Schema

The game uses 4 main tables:

- `game_diagnostic_sessions`: Session metadata and completion status
- `game_diagnostic_events`: Individual question responses and timing
- `game_achievements`: Earned badges and achievements
- `game_notify_list`: Email notifications for future features

## API Endpoints

- `POST /api/game/session`: Create a new game session
- `PUT /api/game/session`: Update session (e.g., mark as completed)
- `POST /api/game/event`: Record a question response
- `POST /api/game/achievement`: Award an achievement
- `POST /api/game/notify`: Add email to notification list

## Architecture

The app is built as a monorepo package alongside the main Trajectory app:

- **Shared theme**: Uses `@trajectory/theme` for consistent styling
- **Shared UI**: Uses `@trajectory/ui` for common components
- **Shared lib**: Uses `@trajectory/lib` for utilities and scoring
- **Shared content**: Uses `@trajectory/content` for questions and copy

## Deployment

The app can be deployed independently or alongside the main app:

```bash
# Build the game app
pnpm build:lane

# Deploy to your preferred platform
# (Vercel, Netlify, etc.)
```

## Future Enhancements

- Real-time multiplayer sessions
- Leaderboards and competitions
- Advanced analytics dashboard
- Integration with main app user accounts
- Mobile app version
