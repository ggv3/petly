# Petly

A web app for renting pets built with a microservices architecture.

## Architecture

The application uses a microservices architecture with the following services:

- **Frontend**: React, TypeScript, Vite, Vitest, MUI, Tailwind, React Query (TODO)
- **API Gateway**: TypeScript, Fastify, Vitest, HTTP Proxy - Port 3000
- **Auth Service**: TypeScript, Fastify, JWT, Drizzle ORM - Port 3001
- **User Service**: TypeScript, Fastify, Drizzle ORM - Port 3002
- **Pet Service**: TypeScript, Fastify, Drizzle ORM - Port 3003
- **Rental Service**: TypeScript, Fastify, Drizzle ORM - Port 3004
- **Database**: PostgreSQL with Drizzle schema

### Service Architecture

```mermaid
flowchart LR
 client
 api-gateway
 auth-service
 user-service
 pet-service
 rental-service
 database
 database-schema

 client --> api-gateway
 api-gateway --> auth-service
 api-gateway --> user-service
 api-gateway --> pet-service
 api-gateway --> rental-service

 auth-service --> database
 user-service --> database
 pet-service --> database
 rental-service --> database
 database <--> database-schema
```

### Application Flow

```mermaid
flowchart LR
 home
 login
 register
 pet-details
 rental-page
 user-page
 own-pets
 own-pet-details


home <--> login
login <--> register
register --> login
home <--> pet-details
pet-details <--> rental-page
rental-page --> home
home <--> user-page
home <--> own-pets
own-pets <--> own-pet-details
own-pet-details <--> home

```

## Getting Started

### Prerequisites

- Node.js 24+
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Environment Setup

The project requires environment configuration for database and services.

#### 1. Create Environment File

**`.env.dev`**

```env
# =============================================================================
# GENERIC CONFIGURATION
# =============================================================================

# Database Configuration
POSTGRES_DB=petly_dev
POSTGRES_USER=petly_dev
POSTGRES_PASSWORD=petly_dev
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_ACCESS_SECRET=your-access-secret-key-min-32-chars-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# =============================================================================
# SERVICE-SPECIFIC CONFIGURATION
# =============================================================================

# Auth Service
PORT=3001
HOST=0.0.0.0
```

### Database Setup

The project uses PostgreSQL with Drizzle ORM for schema management and migrations. The `database-schema` service handles all database schema definitions and migrations.

#### 2. Start Database and Run Migrations

The docker-compose setup will automatically start PostgreSQL and run migrations:

```bash
# Development
npm run dev

# Production
npm run prod
```

The `database-schema` service will wait for PostgreSQL to be healthy before applying migrations.

#### 3. Database Management Commands

```bash
# Generate new migration after schema changes
npm run generate

# Apply migrations manually
npm run migrate

# Open Drizzle Studio (database GUI)
npm run studio
```

### Database Schema

Current schema includes authentication tables:

- **users**: User accounts with username and password
- **refresh_tokens**: JWT refresh tokens for authentication

Schema definitions are located in `database-schema/src/schema/`.

### Installation

```bash
# Install all dependencies
npm install

# Start development environment
npm run dev
```

### Development Workflow

1. **Start the database and run migrations**:
   ```bash
   npm run dev
   ```

2. **Make schema changes** in `database-schema/src/schema/`

3. **Generate migration**:
   ```bash
   npm run generate
   ```

4. **Apply migration**:
   ```bash
   npm run migrate
   ```

5. **Inspect database**:
   ```bash
   npm run studio
   ```

## Services

All services include health check endpoints and are configured with Fastify, TypeScript, and Vitest.

### Running Services

```bash
# Run all services with Docker
npm run dev

# Run individual service in development mode
cd <service-name>
npm run dev

# Run tests for all services
npm test

# Run tests for individual service
npm run test:gateway # API Gateway
npm run test:auth    # Auth service
npm run test:user    # User service
npm run test:pet     # Pet service
npm run test:rental  # Rental service
```

### API Gateway (Port 3000)

The API Gateway is the single entry point for all client requests. It routes requests to the appropriate microservices using the `/api` prefix pattern.

#### Features
- **CORS Support**: Environment-based CORS configuration for secure cross-origin requests
- **Proxy Routing**: Routes requests to microservices with URL rewriting
- **Rate Limiting**: Configurable rate limiting support
- **Service Discovery**: Configurable service URLs via environment variables
- **Health Monitoring**: Central health check endpoint

#### Environment Configuration

The API Gateway requires the following environment variables:

- `NODE_ENV`: Environment mode (`development` | `production`)
- `PORT`: Gateway port (default: `3000`)
- `HOST`: Bind address (default: `0.0.0.0`)
- `CORS_ORIGIN`: **Required in production**. Allowed origin for CORS (e.g., `https://petly.ggv3.dev`)
- `AUTH_SERVICE_URL`: Auth service URL
- `USER_SERVICE_URL`: User service URL
- `PET_SERVICE_URL`: Pet service URL
- `RENTAL_SERVICE_URL`: Rental service URL

**CORS Configuration:**
- **Development**: Allows `http://localhost:5173` and `http://127.0.0.1:5173`
- **Production**: Allows only the `CORS_ORIGIN` environment variable (required)
- **Credentials**: Enabled for authentication support
- **Methods**: `GET`, `POST` (expandable as needed)

#### API Routes

All microservice endpoints are accessible through the API Gateway with the `/api` prefix:

- **Auth Service**: `/api/auth/*` → proxies to `http://auth-service:3001/auth/*`
- **User Service**: `/api/user/*` → proxies to `http://user-service:3002/user/*`
- **Pet Service**: `/api/pet/*` → proxies to `http://pet-service:3003/pet/*`
- **Rental Service**: `/api/rental/*` → proxies to `http://rental-service:3004/rental/*`

**GET `/health`**
Health check endpoint for the API Gateway.

```bash
curl http://localhost:3000/health
```

Response (200):
```json
{
  "status": "ok",
  "service": "api-gateway"
}
```

#### Example Usage

Instead of calling services directly, use the API Gateway:

```bash
# Register a new user through API Gateway
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword123"
  }'

# Login through API Gateway
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword123"
  }'
```

### Auth Service (Port 3001)

The authentication service handles user registration, login, token refresh, and logout using JWT.

> **Note**: In production, all requests should go through the API Gateway at `http://localhost:3000/api/auth/*`. The examples below show direct service access for development/testing purposes.

#### API Endpoints

**POST `/auth/register`**
Register a new user account.

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword123"
  }'
```

Response (201):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**POST `/auth/login`**
Login with existing credentials.

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword123"
  }'
```

Response (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**POST `/auth/refresh`**
Refresh access token using refresh token.

```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

Response (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**POST `/auth/logout`**
Logout and invalidate refresh token.

```bash
curl -X POST http://localhost:3001/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

Response (204): No content

**GET `/health`**
Health check endpoint.

```bash
curl http://localhost:3001/health
```

Response (200):
```json
{
  "status": "ok",
  "service": "auth-service"
}
```

#### Authentication Flow

1. **Register/Login**: User registers or logs in, receives `accessToken` and `refreshToken`
2. **Authenticated Requests**: Include `accessToken` in Authorization header: `Bearer <token>`
3. **Token Expiration**: Access tokens expire in 15 minutes (configurable)
4. **Refresh**: Use `refreshToken` to get new access tokens without re-login
5. **Logout**: Invalidate refresh token to prevent further token refreshing

#### Validation Rules

- **Username**: 3-50 characters
- **Password**: 8-100 characters, hashed with bcrypt
- **Tokens**: JWT with configurable expiration times

### User Service (Port 3002)

The user service handles user profile management and user-related operations.

**GET `/health`**
Health check endpoint.

```bash
curl http://localhost:3002/health
```

Response (200):
```json
{
  "status": "ok",
  "service": "user-service"
}
```

### Pet Service (Port 3003)

The pet service handles pet listings, pet details, and pet management operations.

**GET `/health`**
Health check endpoint.

```bash
curl http://localhost:3003/health
```

Response (200):
```json
{
  "status": "ok",
  "service": "pet-service"
}
```

### Rental Service (Port 3004)

The rental service handles pet rental transactions, bookings, and rental history.

**GET `/health`**
Health check endpoint.

```bash
curl http://localhost:3004/health
```

Response (200):
```json
{
  "status": "ok",
  "service": "rental-service"
}
```

## Project Structure

```
petly/
├── docker-compose.yaml         # Container orchestration
├── .env                        # Service configuration (JWT, ports, etc.)
├── .env.dev                    # Development database config
├── .env.prod                   # Production database config
├── biome.json                 # Code linting and formatting config
├── commitlint.config.js        # Commit message linting
│
├── database-schema/            # Drizzle ORM schema & migrations
│   ├── src/
│   │   └── schema/             # Database table definitions
│   ├── migrations/             # Generated SQL migrations
│   ├── drizzle.config.ts       # Drizzle configuration
│   └── Dockerfile              # Migration service container
│
├── api-gateway/                # API Gateway service - Port 3000
│   ├── src/
│   │   ├── config/             # Environment configuration
│   │   ├── routes/             # Health check routes
│   │   ├── server.ts           # Fastify server with proxy setup
│   │   └── index.ts            # Entry point
│   └── Dockerfile
│
├── auth-service/               # Authentication service (JWT) - Port 3001
│   ├── src/
│   │   ├── config/             # Environment and database config
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic
│   │   └── utils/              # JWT and password utilities
│   └── Dockerfile
│
├── user-service/               # User management service - Port 3002
│   ├── src/
│   │   ├── config/             # Environment and database config
│   │   └── routes/             # API route handlers
│   └── Dockerfile
│
├── pet-service/                # Pet management service - Port 3003
│   ├── src/
│   │   ├── config/             # Environment and database config
│   │   └── routes/             # API route handlers
│   └── Dockerfile
│
├── rental-service/             # Rental management service - Port 3004
│   ├── src/
│   │   ├── config/             # Environment and database config
│   │   └── routes/             # API route handlers
│   └── Dockerfile
│
└── frontend/                   # React application (TODO)
```

## Code Quality & Development Tools

### Biome
The project uses Biome for linting and formatting:

```bash
# Check code quality
npm run ci

# Format code
npx biome format --write .

# Lint code
npx biome lint .
```
