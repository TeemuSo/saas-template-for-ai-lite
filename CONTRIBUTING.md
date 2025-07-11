# Contributing to SaaS Template Lite

Thank you for your interest in contributing to SaaS Template Lite! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use issue templates** when available
3. **Provide details**:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. **Open a discussion** first for major features
2. **Explain the use case** - why is this needed?
3. **Consider the scope** - does it fit the "minimal" philosophy?
4. **Propose implementation** if you have ideas

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the setup guide** in [SETUP.md](./SETUP.md)
3. **Make your changes**:
   - Write clear, commented code
   - Follow existing patterns
   - Update documentation as needed
4. **Test your changes** thoroughly
5. **Commit with clear messages**:
   ```
   feat: add user profile page
   fix: correct stripe webhook signature validation
   docs: update setup instructions for Windows
   ```
6. **Open a Pull Request**:
   - Reference any related issues
   - Describe what changes you made and why
   - Include screenshots for UI changes

## Development Guidelines

### Code Style

- **TypeScript**: Use proper types, avoid `any`
- **React**: Functional components with hooks
- **Naming**: 
  - Components: PascalCase (`UserProfile.tsx`)
  - Utilities: camelCase (`formatDate.ts`)
  - Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Files**: One component per file, co-locate related files

### File Structure

```
feature/
├── components/     # React components
├── lib/           # Business logic
├── hooks/         # Custom React hooks
└── types/         # TypeScript types
```

### Best Practices

1. **Keep it simple** - This is a minimal template
2. **Don't over-engineer** - Avoid premature optimization
3. **Comment your code** - Especially complex logic
4. **Use existing utilities** - Check `/lib` before writing new ones
5. **Follow patterns** - Consistency is key

### Database Changes

1. **Create new migration** with `supabase migration new your_change_name`
2. **Add your changes** to the generated migration file
3. **Document migrations** clearly with comments
4. **Update TypeScript types** with `supabase gen types typescript`
5. **Test with fresh database** using `supabase db reset`

### Adding Dependencies

1. **Justify new dependencies** - Why is it needed?
2. **Check bundle size** impact
3. **Prefer lightweight alternatives**
4. **Update documentation**

## Testing

While this free version doesn't include tests, please:
1. **Manually test** all changes
2. **Test edge cases**
3. **Verify mobile responsiveness**
4. **Check TypeScript compilation**
5. **Test payment flows** with Stripe test mode

## Documentation

Update documentation for:
- New features or changes
- Environment variables
- Setup steps
- API changes
- Component props

## Getting Help

- **Discord**: [Join our community](#) (if applicable)
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: For bugs and feature requests

## Recognition

Contributors will be:
- Listed in the README
- Thanked in release notes
- Given credit in commit messages

## Release Process

1. PRs are reviewed by maintainers
2. Changes are tested thoroughly
3. Documentation is updated
4. Version is bumped following semver
5. Release notes are published

Thank you for helping make SaaS Template Lite better for everyone! 🚀 