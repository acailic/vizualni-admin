# Lockfile Issue Fix

## Problem

You're seeing this error:
```
Run yarn install --frozen-lockfile --prefer-offline
yarn install v1.22.5
[1/4] Resolving packages...
error Your lockfile needs to be updated, but yarn was run with `--frozen-lockfile`.
```

## Root Cause

The project is configured to use **pnpm** (see `packageManager` field in `package.json`), but the CI/CD pipeline is trying to use **yarn** with a `yarn.lock` file that's out of sync.

## Solution Options

### Option 1: Update CI/CD to Use pnpm (Recommended)

Update your CI/CD configuration file (e.g., `.github/workflows/*.yml`, `.gitlab-ci.yml`, etc.):

**GitHub Actions Example:**
```yaml
# .github/workflows/build.yml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      # Install pnpm
      - uses: pnpm/action-setup@v2
        with:
          version: 10

      # Setup Node.js
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      # Install dependencies
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Lint
      - name: Lint
        run: pnpm run lint

      # Build
      - name: Build
        run: pnpm run build
```

### Option 2: Regenerate yarn.lock

If you prefer to continue using yarn:

```bash
# Remove pnpm lockfile
rm pnpm-lock.yaml

# Remove node_modules
rm -rf node_modules app/node_modules

# Install with yarn
yarn install

# Commit the updated yarn.lock
git add yarn.lock
git commit -m "Update yarn.lock"
git push
```

### Option 3: Use pnpm Locally (Fastest)

If you want to use pnpm (which the project is configured for):

```bash
# Remove yarn lockfile
rm yarn.lock

# Ensure pnpm is installed
npm install -g pnpm

# Install dependencies
pnpm install

# Commit the pnpm-lock.yaml
git add pnpm-lock.yaml
git commit -m "Use pnpm lockfile"
git push
```

## Current Project Configuration

According to `package.json`, the project uses:
- **Package Manager:** pnpm (specified in `packageManager` field)
- **Lockfile:** Should be `pnpm-lock.yaml`

## Recommended Commands

```bash
# Development
pnpm dev

# Install dependencies
pnpm install

# Lint
pnpm run lint

# Build
pnpm run build

# Start production
pnpm start
```

## CI/CD Quick Fix

If you need an immediate fix for CI/CD, add this to your workflow:

```yaml
# Install pnpm first
- run: npm install -g pnpm

# Then use pnpm instead of yarn
- run: pnpm install --frozen-lockfile
- run: pnpm run lint
- run: pnpm run build
```

## Notes

- The `pnpm-lock.yaml` file is already in the repository (created during our work)
- Using pnpm is faster and more disk-efficient than yarn or npm
- The project's `package.json` explicitly specifies pnpm as the package manager
