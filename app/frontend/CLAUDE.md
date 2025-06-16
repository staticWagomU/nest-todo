# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Development: `npm run start:dev`
- Lint: `npm run lint`
- Type check: `npm run typecheck`
- Start: `npm run start`

## Code Style Guidelines
- Use TypeScript with strict mode enabled
- React components should use functional style with hooks
- Use Remix conventions for routes and loaders
- Use Tailwind CSS for styling
- Import statements: group by external, then internal (~/)
- Data validation: use Valibot for schema validation
- Error handling: use appropriate HTTP responses with status codes
- Naming: PascalCase for components, camelCase for variables/functions
- Types: export type definitions when needed for loader data
- Use strict equality (===) for comparisons