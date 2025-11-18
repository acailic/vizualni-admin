# Contributing to Vizualni Admin

Thank you for your interest in contributing to Vizualni Admin! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/vizualni-admin.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit your changes: `git commit -m "Description of changes"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

Please see the [README.md](README.md) for detailed instructions on setting up the development environment.

## Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

Before committing, make sure to run:
```sh
yarn lint
yarn typecheck
```

## Testing

All changes should include appropriate tests:
- Unit tests for components and utilities
- Integration tests for features
- E2E tests for critical user flows

Run tests with:
```sh
yarn test
yarn e2e
```

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Follow the existing code style
- Write clear commit messages

## Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable

## Language Support

This project supports Serbian (Cyrillic and Latin) and English. When adding new text:
- Add translations to the appropriate locale files
- Use the i18n system for all user-facing text
- Test with both languages

## Data Integration

When working with data.gov.rs integration:
- Follow the API documentation: https://data.gov.rs/apidoc/
- Handle errors gracefully
- Implement proper caching
- Test with real datasets from the portal

## Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Contact the maintainers

## Code of Conduct

Be respectful and constructive in all interactions. We aim to create a welcoming environment for all contributors.

## License

By contributing to Vizualni Admin, you agree that your contributions will be licensed under the BSD-3-Clause License.
