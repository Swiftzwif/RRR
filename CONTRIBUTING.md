# Contributing to Trajectory

Thank you for your interest in contributing to Trajectory! This document outlines our development workflow and best practices.

## 📋 Table of Contents
- [Development Workflow](#development-workflow)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Quality Standards](#code-quality-standards)
- [Testing Requirements](#testing-requirements)

## 🔄 Development Workflow

### Git Flow Strategy
We use a modified Git Flow strategy:

```
master (production)
   ↑
develop (staging)
   ↑
feature/*, fix/*, chore/* (feature branches)
```

### Key Principles
1. **Never commit directly to `master` or `develop`**
2. **All changes go through Pull Requests**
3. **Require code reviews before merging**
4. **Maintain passing CI/CD checks**

## 🌿 Branch Strategy

### Branch Naming Convention
```
feature/description-of-feature
fix/issue-being-fixed
hotfix/critical-production-fix
chore/maintenance-task
docs/documentation-update
test/testing-related-changes
refactor/code-refactoring
```

### Examples
- `feature/user-authentication`
- `fix/payment-processing-error`
- `hotfix/critical-security-patch`
- `chore/update-dependencies`

### Branch Lifecycle
1. **Create branch from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   ```

2. **Regular commits with clear messages**
   ```bash
   git add .
   git commit -m "feat: add user authentication"
   ```

3. **Keep branch updated with develop**
   ```bash
   git fetch origin develop
   git merge origin/develop
   # or
   git rebase origin/develop
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `revert`: Reverting changes

### Examples
```bash
feat(auth): implement Google OAuth integration

- Added Google OAuth provider
- Created callback endpoint
- Updated user model

Closes #123
```

```bash
fix(payments): resolve Square webhook validation error
```

## 🔍 Pull Request Process

### Before Creating a PR
1. **Ensure your branch is up to date with `develop`**
2. **Run tests locally**
   ```bash
   npm test
   npm run build
   npm run lint
   ```
3. **Review your own changes**
4. **Update documentation if needed**

### Creating a PR
1. **Use the PR template** (automatically loaded)
2. **Provide clear description**
3. **Link related issues**
4. **Add screenshots for UI changes**
5. **Request reviews from appropriate team members**

### PR Review Checklist
- [ ] Code follows project style guidelines
- [ ] Tests are passing
- [ ] No console.log statements in production code
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Database migrations included if needed

### Merging Strategy
- **Feature → Develop**: Squash and merge (clean history)
- **Develop → Master**: Create a merge commit (preserve history)
- **Hotfix → Master**: Create a merge commit, then merge back to develop

## 💎 Code Quality Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Proper type definitions (avoid `any`)
- ES6+ features
- Functional components for React
- Proper error handling

### Style Guidelines
```typescript
// Good ✅
interface UserProps {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const UserCard: React.FC<UserProps> = ({ name, email, role }) => {
  // Implementation
};

// Bad ❌
const UserCard = (props: any) => {
  // Implementation
};
```

### File Organization
```
src/
  ├── app/          # Next.js app directory
  ├── components/   # Reusable components
  ├── lib/          # Utility functions
  ├── utils/        # Helper utilities
  ├── types/        # TypeScript type definitions
  └── styles/       # Global styles
```

## 🧪 Testing Requirements

### Test Coverage Targets
- **Unit Tests**: 80% coverage for utilities and hooks
- **Integration Tests**: Critical user paths
- **E2E Tests**: Key workflows (authentication, payments)

### Running Tests
```bash
# Unit tests
npm test

# Test coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Test File Naming
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.test.ts`

## 🚀 CI/CD Pipeline

Our CI/CD pipeline runs on every PR and includes:

1. **Build Verification**
   - Node 18.x and 20.x
   - TypeScript compilation
   - Next.js build

2. **Code Quality**
   - ESLint
   - Prettier
   - Type checking

3. **Testing**
   - Unit tests
   - Integration tests
   - Coverage reports

4. **Security Scanning**
   - npm audit
   - Dependency vulnerability checks

5. **PR Validation**
   - Commit message format
   - Branch naming convention
   - PR size check

## 🔒 Security Guidelines

1. **Never commit secrets or API keys**
2. **Use environment variables**
3. **Validate all user inputs**
4. **Implement proper authentication checks**
5. **Follow OWASP guidelines**
6. **Regular dependency updates**

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)

## 🆘 Getting Help

- Open an issue for bugs
- Start a discussion for features
- Tag `@maintainers` for urgent issues
- Check existing issues before creating new ones

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.