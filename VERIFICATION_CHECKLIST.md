# Copy Updates Verification Checklist

## Code Verification ✅

### Homepage (`apps/trajectory2/src/app/page.tsx`)
- [x] Primary tagline updated: "YOU HAVE INFINITE WORTH" (line 199)
- [x] Rotating words array: `["attention", "energy", "worth"]` (line 33)
- [x] Promise line: "Your story is about to change." (line 226)
- [x] Emotional reassurance: "If you don't like your current emotions — don't worry, you're in the right place." (line 228)
- [x] Mission statement: "Trajectory exists to help men ages 18–35 become fearless, humble, compassionate leaders — to rise out of suffering and into joy." (line 232)
- [x] Slogan: "Inner Mastery. Outer Freedom." (line 851)
- [x] Social proof: "from good little soldiers to conscious capital allocators" (line 855)
- [x] Archetype references updated in features (line 124) and assessment slide

### Metadata (`apps/trajectory2/src/app/layout.tsx`)
- [x] Title: "Trajectory2.0 | Inner Mastery. Outer Freedom."
- [x] Description updated with mission statement
- [x] OpenGraph metadata updated
- [x] Twitter metadata updated

### Archetypes (`packages/lib/copy.ts`)
- [x] "The Drifter" → "The Good Little Soldier" (line 135)
- [x] "The Balancer" → "The Conformist" (line 141)
- [x] "The Architect" → "The Commander" (line 147)
- [x] Feature description updated (line 45)

### Resources Page (`apps/trajectory2/src/app/resources/page.tsx`)
- [x] Daily Performance Tracker card added (lines 190-209)
- [x] Target icon imported
- [x] Download link: `/daily-performance-tracker.csv`
- [x] Card styling matches other resource cards

### CSV File (`apps/trajectory2/public/daily-performance-tracker.csv`)
- [x] File exists with proper CSV structure
- [x] Headers: Date, Task, Completed, Notes
- [x] Sample data row included

### Email (`apps/trajectory2/src/app/api/cron/send-scheduled-emails/route.ts`)
- [x] Day 5 subject: "Day 5: Know Your Worth 💎" (line 71)

## Visual Verification Needed

To verify visually, please check:

1. **Homepage Hero Section**
   - Badge shows "YOU HAVE INFINITE WORTH"
   - Rotating text cycles through: "attention" → "energy" → "worth"
   - Promise line displays correctly
   - Mission statement visible

2. **CTA Section**
   - Slogan: "Inner Mastery. Outer Freedom."
   - Social proof line visible

3. **Resources Page**
   - Daily Performance Tracker card appears
   - Download button works
   - CSV file downloads correctly

4. **Assessment Results** (when viewing results)
   - Archetype badges show new names:
     - "The Good Little Soldier"
     - "The Conformist"
     - "The Commander"

## Functional Verification

1. **Rotating Animation**
   - Test that words rotate every 6 seconds
   - Verify "worth" appears in rotation
   - No JavaScript errors in console

2. **CSV Download**
   - Click "Download CSV" button
   - File should download as `daily-performance-tracker.csv`
   - File should open correctly in Excel/Google Sheets

3. **SEO/Metadata**
   - Check page title in browser tab
   - Inspect page source for meta tags
   - Verify OpenGraph tags

## Testing Commands

```bash
# Start dev server (if not running)
npm run dev

# Build to check for errors
npm run build

# Check TypeScript errors
npm run typecheck

# Run linter
npm run lint
```

## Screenshots to Capture

1. Homepage hero section (showing new tagline and rotating text)
2. Homepage mission statement section
3. Homepage CTA section (slogan and social proof)
4. Resources page showing all three resource cards
5. Assessment results page (if accessible) showing archetype badges
