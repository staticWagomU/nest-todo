# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo containing a full-stack todo application with:
- **Backend**: NestJS REST API with TypeORM and PostgreSQL (`app/backend/`)
- **Frontend**: React with React Router, Vite, and Mantine UI (`app/frontend/`)
- **Package Manager**: pnpm with Turbo for build orchestration
- **Database**: PostgreSQL with TypeORM entities

## Commands

### Root Level
- `pnpm start:dev` - Start both frontend and backend in development mode
- `pnpm build` - Build both applications
- `pnpm lint` - Run Biome linting across the entire monorepo
- `pnpm format` - Format code with Biome across the entire monorepo

### Backend (`app/backend/`)
- `pnpm start:dev` - Start NestJS in watch mode
- `pnpm build` - Build the NestJS application
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm test:e2e` - Run end-to-end tests with Vitest
- `pnpm test:cov` - Run tests with coverage
- `pnpm lint` - Run Biome linting with auto-fix
- `pnpm format` - Format code with Biome

### Frontend (`app/frontend/`)
- `pnpm start:dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run Biome linting
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:watch` - Run unit tests in watch mode
- `pnpm test:cov` - Run tests with coverage
- `pnpm generate-api` - Generate API client from backend OpenAPI spec using Orval

## Architecture

### Backend Architecture
- **Entry Point**: `src/main.ts` - Bootstrap NestJS app on port 3000 with global prefix `/api/v1`
- **Database**: PostgreSQL with TypeORM, configured via `DATABASE_URL` environment variable
- **CORS**: Configured for localhost:5173 (frontend development server)
- **Todos Module**: Complete CRUD operations for Todo entities with sorting functionality
- **Entity**: `Todo` with UUID primary key, title, description, and completed status
- **API Endpoints**: RESTful endpoints accessible at `http://localhost:3000/api/v1/todos`
  - `GET /api/v1/todos?order=asc|desc` - Get all todos with optional sorting by creation order
- **Validation**: Global ValidationPipe with whitelist and transform enabled

### Frontend Architecture
- **Framework**: React 18 with React Router (migrated from Remix)
- **UI Library**: Mantine UI components with hooks (@mantine/hooks, @mantine/form)
- **Styling**: Mantine theme system (replaced Tailwind CSS)
- **Data Fetching**: SWR hooks with Axios for API communication, Orval-generated client
- **State Management**: React useState/useEffect for local state
- **Proxy**: Vite dev server proxies `/api` requests to backend at `localhost:3000/api/v1`
- **Build Tool**: Vite with React plugin and TypeScript paths

### Database Schema
- **todos** table with columns: id (UUID), title (text), description (text), completed (boolean)
- TypeORM entities use decorators for column definitions and validation
- Synchronization enabled in non-production environments

## Development Workflow

1. Ensure PostgreSQL is running and `DATABASE_URL` is set
2. Install dependencies: `pnpm install` (from root)
3. Start development: `pnpm start:dev` (starts both frontend and backend)
4. Frontend runs on port 5173, backend on port 3000
5. API calls from frontend are proxied to backend via Vite config

## Testing

- **Test Framework**: Vitest for both frontend and backend
- **Backend Testing**: Unit tests (`.spec.ts`) and E2E tests (`.e2e-spec.ts`) with Node.js environment
- **Frontend Testing**: React Testing Library with jsdom environment for component testing
- **Coverage**: V8 coverage provider with text, JSON, and HTML reports
- **Test Utils**: @testing-library/jest-dom for enhanced DOM assertions

## Code Style

- **Linting/Formatting**: Biome (replaces ESLint/Prettier) with root configuration in `biome.json`
- **Git Hooks**: Lefthook manages pre-commit (lint/format/typecheck) and pre-push (tests) hooks
- **TypeScript**: Strict mode enabled across both applications
- **Backend**: NestJS conventions with decorators, dependency injection, manual validation in controllers
- **Frontend**: Functional React components with hooks, SWR for data fetching, Mantine forms and UI components
- **Database**: TypeORM entities with proper column decorators and comments in Japanese
- **Imports**: External packages first, then relative imports
- **Service Imports**: In backend `*.controller.ts` files, always use regular imports (not type imports) when importing `*.service.ts` files (type imports cause NestJS errors)
- **Error Handling**: Proper HTTP status codes and error boundaries

## API Client Generation

The frontend uses Orval to generate TypeScript client code from the backend's OpenAPI specification:

- **Configuration**: `orval.config.js` in the frontend directory
- **Generated Files**: `app/api/generated.ts` contains all API functions and SWR hooks
- **Source**: Backend OpenAPI spec at `http://localhost:3000/api/docs-json`
- **Manual Updates**: If Orval generation fails, API client can be manually updated to match backend changes

## Post-Task Verification

After completing any code changes, ALWAYS run the following commands from the root directory to ensure code quality:
```bash
pnpm lint && pnpm format
```
These commands must execute without errors before considering a task complete.