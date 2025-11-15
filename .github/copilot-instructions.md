# Petly - GitHub Copilot Instructions

## Project Overview
Petly is a web application for renting pets, built with a microservices architecture. The project uses a monorepo structure with multiple services communicating through an API Gateway.

## Architecture & Tech Stack

### Microservices Structure
- **Frontend**: React, TypeScript, Vite, Vitest, MUI, Tailwind, React Query
- **API Gateway**: TypeScript, Fastify, Vitest
- **Auth Service**: TypeScript, Fastify, JWT, Drizzle ORM, Vitest
- **User Service**: TypeScript, Fastify, Drizzle ORM, Vitest
- **Pet Service**: TypeScript, Fastify, Drizzle ORM, Vitest
- **Rental Service**: TypeScript, Fastify, Drizzle ORM, Vitest
- **Database Schema**: Drizzle ORM with PostgreSQL

### Key Technologies
- **Runtime**: Node.js 24+
- **Testing**: Vitest for all services and frontend
- **Backend Framework**: Fastify for all services
- **ORM**: Drizzle for database operations
- **Frontend Build Tool**: Vite
- **Database**: PostgreSQL 18.1 (Alpine)
- **Code Quality**: Biome for linting and formatting
- **Commit Convention**: Conventional Commits with commitlint
- **Git Hooks**: Husky

## Code Style & Quality Standards

### Biome Configuration
Follow the project's Biome configuration (`.biome.json`):
- **Indentation**: 2 spaces
- **Line Width**: 100 characters
- **Quote Style**: Single quotes
- **Semicolons**: Always required
- **Trailing Commas**: Always include
- **Arrow Parentheses**: Always use

### Key Linting Rules
- **No `forEach`**: Use `for...of`, `.map()`, or `.reduce()` instead
- **No unused imports/variables**: Enforce clean code
- **No explicit `any`**: Always type properly
- **Use `const`**: Prefer `const` over `let` when possible
- **Import types**: Use `import type` for type-only imports
- **Node.js protocol**: Use `node:` prefix for Node.js imports (e.g., `node:fs`, `node:path`)
- **Use `await`**: Don't create async functions without using `await`

### TypeScript Guidelines
- Always use TypeScript for all services and frontend code
- Avoid `any` types - use proper type definitions
- Use `import type` for type-only imports
- Define clear interfaces for API contracts between services

## Service Development Guidelines

### Fastify Services
When creating or modifying Fastify services:
- Use TypeScript with proper type definitions
- Implement proper error handling with Fastify error handlers
- Use Fastify plugins for modular code organization
- Implement request validation using Fastify schemas
- Include proper logging
- Follow RESTful API conventions
- Structure routes in a logical, hierarchical manner

Example service structure:
```typescript
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';

const server: FastifyInstance = Fastify({
  logger: true,
});

// Routes, plugins, and handlers here

export default server;
```

### Drizzle ORM
When working with database operations:
- Define schemas in the `database-schema/` directory
- Use Drizzle's type-safe query builder
- Implement proper migrations
- Use transactions for complex operations
- Handle database errors appropriately
- Use prepared statements for repeated queries

### Frontend Development
When working with the React frontend:
- Use Vite for build tooling
- Use TypeScript for all components
- Implement components with React hooks
- Use React Query for data fetching and caching
- Style with MUI components and Tailwind utilities
- Ensure accessibility (follow a11y rules)
- Use meaningful component and variable names

## Testing Guidelines

### Vitest Configuration
All services and the frontend should use Vitest:
- Write unit tests for business logic
- Write integration tests for API endpoints
- Mock external dependencies appropriately
- Aim for high test coverage on critical paths
- Use descriptive test names following the pattern: "should [expected behavior] when [condition]"

Example test structure:
```typescript
import { describe, it, expect } from 'vitest';

describe('ServiceName', () => {
  it('should return expected result when valid input is provided', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Git Workflow

### Commit Messages
Follow Conventional Commits format:
- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for maintenance tasks
- `docs:` for documentation changes
- `test:` for test additions/changes
- `refactor:` for code refactoring
- `style:` for formatting changes
- `ci:` for CI/CD changes

Examples:
- `feat(pet-service): add pet search endpoint`
- `fix(auth-service): resolve JWT expiration issue`
- `chore(deps): update dependencies`

### Branch Naming
Use descriptive branch names:
- `feat/feature-name`
- `fix/bug-description`
- `chore/task-description`
- `docs/documentation-update`

## Database Management

### PostgreSQL
- Database runs in Docker container (PostgreSQL 18.1 Alpine)
- Use `.env.dev` for development and `.env.prod` for production
- Run migrations before starting services
- Use proper indexing for performance
- Implement proper foreign key relationships

### Commands
- Start dev database: `npm run db:dev`
- Start prod database: `npm run db:prod`
- Stop database: `npm run db:down`

## API Gateway Pattern
The API Gateway is the single entry point for all client requests:
- Route requests to appropriate microservices
- Handle authentication/authorization
- Implement rate limiting if needed
- Aggregate responses when necessary
- Provide consistent error responses

## Environment Variables
Each service should have its own environment configuration:
- Use `.env` files for local development
- Never commit sensitive credentials
- Document required environment variables in each service's README
- Use proper type checking for environment variables

## Service Communication
- Services communicate through the API Gateway
- Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Implement proper status codes
- Use JSON for request/response payloads
- Handle service failures gracefully with fallbacks

## Documentation
- Document API endpoints with clear descriptions
- Include request/response examples
- Document environment variables
- Keep README files up to date
- Consider implementing Swagger/OpenAPI documentation

## Performance Considerations
- Use database indexing appropriately
- Implement caching where beneficial (React Query on frontend)
- Optimize database queries
- Use pagination for list endpoints
- Monitor service response times
- Use connection pooling for database connections

## Security Best Practices
- Validate all inputs
- Use JWT for authentication
- Implement proper CORS policies
- Sanitize database queries (Drizzle helps with this)
- Use HTTPS in production
- Keep dependencies updated (Dependabot is configured)
- Never expose sensitive information in logs

## Monorepo Structure
When creating new services or adding files, maintain the following structure:
```
petly/
├── frontend/                   # React application
├── api-gateway/                # API Gateway service
├── auth-service/               # Authentication service
├── user-service/               # User management service
├── pet-service/                # Pet management service
├── rental-service/             # Rental management service
├── database-schema/            # Drizzle database schema
├── docker-compose.yaml         # Container orchestration
└── [root configuration files]  # Biome, commitlint, etc.
```

## Development Workflow
1. Start the PostgreSQL database using Docker Compose
2. Run migrations to set up the database schema
3. Start services in development mode
4. Make changes following code style guidelines
5. Write tests for new functionality
6. Run linting and formatting checks (`npm run ci`)
7. Commit with conventional commit messages
8. Create pull requests for review

## CI/CD
- GitHub Actions runs on push/PR to master
- CI checks: Biome linting and formatting
- Dependabot updates dependencies weekly
- Auto-merge configured for patch and minor updates
- All checks must pass before merging

## Common Patterns to Follow
- Use async/await over callbacks
- Prefer functional programming patterns where appropriate
- Keep functions small and focused (single responsibility)
- Use meaningful variable and function names
- Avoid deeply nested code
- Handle errors explicitly, don't swallow them
- Use early returns to reduce nesting
- Keep business logic separate from framework code

## Questions or Clarifications Needed
When implementing features, consider:
- How will services handle failures?
- What should the API contract look like?
- Are proper indexes in place for queries?
- Is the data properly validated?
- Are tests covering the critical paths?
- Is the code following the established patterns?
