# Testing Guide

This document provides a comprehensive guide to testing in the Trajectory application.

## Quick Start

```bash
# Run all tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Structure

### Directory Layout

```
src/
├── test/
│   ├── setup.ts          # Global test setup
│   └── utils.tsx         # Test utilities
├── lib/
│   ├── scoring.ts
│   └── scoring.test.ts   # Unit tests co-located with source
└── app/api/
    └── auth/
        └── verify-email/
            ├── route.ts
            └── route.test.ts  # API route tests
```

### Test Files

- **Unit tests**: `*.test.ts` or `*.test.tsx`
- **Integration tests**: `*.integration.test.ts`
- **E2E tests**: `tests/e2e/*.spec.ts` (Playwright)

## Testing Utilities

### Mock Supabase Client

```typescript
import { createMockSupabaseClient } from '@/test/utils';

const mockSupabase = createMockSupabaseClient();
mockSupabase.auth.getUser.mockResolvedValue({
  data: { user: { id: 'test-id', email: 'test@example.com' } },
  error: null,
});
```

### Mock API Requests

```typescript
import { createMockRequest } from '@/test/utils';

const request = createMockRequest('/api/auth/verify-email', {
  method: 'POST',
  body: { email: 'test@example.com' },
  searchParams: { token: 'test-token' },
});
```

### Testing React Components

```typescript
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import { MyComponent } from './MyComponent';

test('renders component', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

test('handles user interaction', async () => {
  const user = userEvent.setup();
  renderWithProviders(<MyComponent />);

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

## Testing Patterns

### AAA Pattern

Always follow Arrange-Act-Assert:

```typescript
test('should calculate domain averages', () => {
  // Arrange
  const answers = { Q1: 3, Q2: 4, Q3: 5 };

  // Act
  const result = computeDomainAverages(answers);

  // Assert
  expect(result.identity).toBe(4.0);
});
```

### Descriptive Test Names

Use "should" or "when...then" format:

```typescript
// Good
test('should return 400 for invalid email')
test('should send welcome email for new users')

// Avoid
test('test email validation')
test('new user flow')
```

### Test Edge Cases

Always test:
- ✅ Happy path
- ✅ Invalid input
- ✅ Missing data
- ✅ Error conditions
- ✅ Boundary values

```typescript
describe('avatarFromOverall', () => {
  it('should assign Drifter for score 3.1', () => {
    expect(avatarFromOverall(3.1)).toBe('Drifter');
  });

  it('should assign Balancer for score 3.2', () => {
    expect(avatarFromOverall(3.2)).toBe('Balancer');
  });
});
```

## API Route Testing

### Testing POST Routes

```typescript
import { POST } from './route';
import { createMockRequest } from '@/test/utils';

test('should validate request body', async () => {
  const request = createMockRequest('/api/auth/reset-password', {
    method: 'POST',
    body: { email: 'invalid' },
  });

  const response = await POST(request as any);
  const data = await response.json();

  expect(response.status).toBe(400);
  expect(data.error).toContain('Invalid email');
});
```

### Testing GET Routes

```typescript
test('should return data', async () => {
  const request = createMockRequest('/api/auth/verify-email', {
    method: 'GET',
    searchParams: { token: 'test-token' },
  });

  const response = await GET(request as any);
  expect(response.status).toBe(200);
});
```

## Mocking Strategies

### Mock External Services

```typescript
// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  getSupabaseServiceRole: vi.fn(() => mockSupabase),
}));

// Mock Email
vi.mock('@/lib/email', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock Logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));
```

### Mock Environment Variables

Environment variables are mocked in `src/test/setup.ts`:

```typescript
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
```

Override in individual tests if needed:

```typescript
test('uses custom env', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://custom.com';
  // test code
});
```

## Coverage Requirements

### Thresholds

Minimum coverage for all new code:
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Generate Coverage Report

```bash
npm run test:coverage
```

View HTML report:
```bash
open coverage/index.html
```

### Coverage Targets

| Category | Target | Priority |
|----------|--------|----------|
| Business Logic | 100% | Critical |
| API Routes | 80% | High |
| Components | 60% | Medium |
| Utils | 80% | High |

## Common Testing Scenarios

### Testing Authentication

```typescript
test('should authenticate user', async () => {
  const mockSupabase = createMockSupabaseClient();
  mockSupabase.auth.exchangeCodeForSession.mockResolvedValue({
    error: null,
  });
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: mockUser },
    error: null,
  });

  const response = await GET(request as any);
  expect(response.status).toBe(307); // Redirect
});
```

### Testing Form Validation

```typescript
test('should validate email format', () => {
  const result = emailSchema.safeParse('invalid-email');
  expect(result.success).toBe(false);

  const validResult = emailSchema.safeParse('test@example.com');
  expect(validResult.success).toBe(true);
});
```

### Testing Async Operations

```typescript
test('should handle async errors', async () => {
  mockSupabase.from().insert.mockRejectedValue(
    new Error('Database error')
  );

  const response = await POST(request as any);
  expect(response.status).toBe(500);
});
```

## Debugging Tests

### Run Single Test

```bash
npm test -- src/lib/scoring.test.ts
```

### Run Tests Matching Pattern

```bash
npm test -- --grep "should calculate"
```

### Debug with UI

```bash
npm run test:ui
```

Then open http://localhost:51204/__vitest__/

### Enable Verbose Logging

Uncomment in `src/test/setup.ts`:
```typescript
// vi.spyOn(console, 'error').mockImplementation(() => {});
```

## Troubleshooting

### Test Timeout

Increase timeout for slow tests:
```typescript
test('slow operation', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Mock Not Working

Ensure mock is defined before import:
```typescript
vi.mock('@/lib/supabase', () => ({
  getSupabaseServiceRole: vi.fn(),
}));

// THEN import
import { getSupabaseServiceRole } from '@/lib/supabase';
```

### Type Errors

Cast request to `any` for API route tests:
```typescript
const response = await POST(request as any);
```

Or create proper NextRequest types in test utils.

## Best Practices

### DO

✅ Write tests before fixing bugs (TDD)
✅ Test edge cases and error conditions
✅ Use descriptive test names
✅ Keep tests focused and atomic
✅ Mock external dependencies
✅ Test user behavior, not implementation
✅ Maintain 70%+ coverage on new code

### DON'T

❌ Test implementation details
❌ Write flaky tests
❌ Test library code (React, Next.js, etc.)
❌ Share state between tests
❌ Skip error scenarios
❌ Commit failing tests
❌ Test visual appearance in unit tests

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

### Pre-commit Hook

Add to `.husky/pre-commit`:
```bash
npm run test:run
npm run typecheck
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test Coverage Guide](https://vitest.dev/guide/coverage.html)

## Support

For questions or issues:
1. Check this documentation
2. Review existing tests for examples
3. Ask in team chat
4. Open an issue on GitHub
