# Contributing to RuleSnap

Thanks for your interest in contributing to RuleSnap!

## Setup

```bash
git clone <repo-url>
cd rulesnap
pnpm install
```

## Monorepo Structure

This project uses pnpm workspaces. Each package has its own README with specific development instructions:

- [`packages/app`](packages/app/) — Expo React Native app ([contributing guide](packages/app/CONTRIBUTING.md))
- [`packages/infra`](packages/infra/) — AWS CDK infrastructure

## Workflow

1. Create a branch from `main` for your changes
2. Make changes in the relevant package(s)
3. Run tests in the affected package before committing
4. Write clear commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
5. Open a pull request with a description of what changed and why

## Commit Messages

```
<type>(<scope>): <subject>

<body>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
- `feat(app): Add Ticket to Ride game guide`
- `fix(app): Correct Quacks scoring section translation`
- `docs(app): Update README with new game addition steps`

## Code Style

- TypeScript strict mode
- Prettier for formatting (`pnpm format` in the app package)
- ESLint for linting (`pnpm lint:check` in the app package)

## Questions?

Open an issue if something is unclear or you need help getting started.
