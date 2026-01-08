# CI/CD Pipeline Documentation

This document describes the GitHub Actions CI/CD pipeline for the Snake Arena application.

## Overview

The pipeline automatically tests and deploys the application when code is pushed to the `main` or `develop` branches or when pull requests are created.

## Pipeline Structure

The pipeline consists of 4 jobs that run in the following order:

```
frontend-tests ──┐
                 ├──> backend-integration-tests ──> deploy
backend-tests ───┘
```

## Jobs

### 1. Frontend Tests (`frontend-tests`)

**Runs:** In parallel with backend tests  
**Working Directory:** `./02-end-to-end/frontend`

**Steps:**
- Checkout code
- Setup Node.js 20
- Install dependencies with `npm ci`
- Run ESLint linter
- Run Vitest tests
- Build the frontend application

**Purpose:** Ensures frontend code quality, all tests pass, and the app builds successfully.

### 2. Backend Unit Tests (`backend-tests`)

**Runs:** In parallel with frontend tests  
**Working Directory:** `./02-end-to-end/backend`

**Steps:**
- Checkout code
- Setup Python 3.12
- Install uv package manager
- Install dependencies
- Run unit tests from `tests/` directory

**Purpose:** Validates backend business logic and unit-level functionality.

### 3. Backend Integration Tests (`backend-integration-tests`)

**Runs:** After backend unit tests pass  
**Dependencies:** `backend-tests`  
**Working Directory:** `./02-end-to-end/backend`

**Services:**
- PostgreSQL 15 database (test database)

**Steps:**
- Checkout code
- Setup Python 3.12
- Install uv package manager
- Install dependencies
- Run integration tests from `tests_integration/` directory

**Environment:**
- `DATABASE_URL`: `postgresql://postgres:postgres@localhost:5432/snake_arena_test`

**Purpose:** Tests API endpoints and database interactions in a realistic environment.

### 4. Deploy (`deploy`)

**Runs:** After all tests pass, only on push to main or develop branches  
**Dependencies:** `frontend-tests`, `backend-tests`, `backend-integration-tests`  
**Conditions:** 
- Only runs on `push` events (not pull requests)
- Only runs on `main` or `develop` branches

**Steps:**
- Checkout code
- Configure Git with bot credentials
- Commit and push any changes (if needed)
- Deploy to production (placeholder for actual deployment)

**Purpose:** Automates deployment after successful tests.

## Triggers

The pipeline runs on:

- **Push** to `main` or `develop` branches
- **Pull requests** targeting `main` or `develop` branches

## Configuration

### Frontend Testing

- **Package Manager:** npm
- **Test Framework:** Vitest
- **Linter:** ESLint
- **Node Version:** 20

### Backend Testing

- **Package Manager:** uv
- **Test Framework:** pytest
- **Python Version:** 3.12
- **Database:** PostgreSQL 15 (for integration tests)

## Deployment

The deploy job is currently a placeholder. To add actual deployment:

1. **Docker Deployment:**
   ```yaml
   - name: Build and push Docker image
     run: |
       docker build -t your-registry/snake-arena:${{ github.sha }} .
       docker push your-registry/snake-arena:${{ github.sha }}
   ```

2. **Cloud Platform Deployment:**
   - AWS: Use AWS CLI or AWS CDK
   - Azure: Use Azure CLI
   - GCP: Use gcloud CLI
   - Render/Heroku: Use platform-specific deploy commands

3. **SSH Deployment:**
   ```yaml
   - name: Deploy via SSH
     uses: appleboy/ssh-action@master
     with:
       host: ${{ secrets.HOST }}
       username: ${{ secrets.USERNAME }}
       key: ${{ secrets.SSH_KEY }}
       script: |
         cd /path/to/app
         git pull
         docker-compose up -d --build
   ```

## Secrets Required

For deployment, you may need to add these secrets in GitHub repository settings:

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `DOCKER_USERNAME` - Docker registry username (if using Docker)
- `DOCKER_PASSWORD` - Docker registry password
- `SSH_KEY` - SSH private key (if using SSH deployment)
- `HOST` - Deployment server hostname
- Any cloud provider credentials (AWS, Azure, GCP, etc.)

## Local Testing

### Run Frontend Tests
```bash
cd 02-end-to-end/frontend
npm install
npm run test
npm run lint
npm run build
```

### Run Backend Unit Tests
```bash
cd 02-end-to-end/backend
uv sync
uv run pytest -v tests/
```

### Run Backend Integration Tests
```bash
cd 02-end-to-end/backend
# Start PostgreSQL (via Docker or local installation)
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/snake_arena_test
uv run pytest -v tests_integration/
```

## Monitoring

- View workflow runs: Go to the "Actions" tab in your GitHub repository
- Each run shows logs for all jobs
- Failed jobs will be highlighted in red
- Click on any job to see detailed logs

## Skipping CI

To skip the CI pipeline for a commit, include `[skip ci]` in the commit message:

```bash
git commit -m "docs: update README [skip ci]"
```

## Troubleshooting

### Frontend Tests Fail
- Check linting errors: `npm run lint`
- Check test failures: `npm run test`
- Verify dependencies: `npm ci`

### Backend Tests Fail
- Check test output in the logs
- Run tests locally: `uv run pytest -v`
- Verify Python version matches (3.12)

### Integration Tests Fail
- Ensure PostgreSQL is running properly
- Check DATABASE_URL environment variable
- Verify database migrations are up to date

### Deployment Fails
- Check secrets are properly configured
- Verify deployment target is accessible
- Review deployment script logs

## Future Enhancements

Potential improvements to the CI/CD pipeline:

1. **Code Coverage:** Add coverage reports with codecov or coveralls
2. **Performance Testing:** Add load testing with tools like k6 or locust
3. **Security Scanning:** Add Snyk, Dependabot, or similar tools
4. **E2E Testing:** Add Playwright or Cypress for end-to-end tests
5. **Multi-Environment:** Deploy to staging before production
6. **Notifications:** Send Slack/Discord notifications on failures
7. **Versioning:** Automatic version bumping and changelog generation
8. **Artifacts:** Save build artifacts for debugging

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [Pytest Documentation](https://docs.pytest.org/)
- [uv Documentation](https://github.com/astral-sh/uv)
