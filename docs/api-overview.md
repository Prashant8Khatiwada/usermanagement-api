# API Overview Documentation

## Project Overview
This is a **NestJS-based backend API** for user management, built with **PostgreSQL** as the database, **TypeORM** as the ORM, and **Scalar** for API documentation. The application follows a modular architecture with JWT-based authentication and role-based access control (RBAC). It includes comprehensive CRUD operations for users, tasks, categories, and tags, with user-specific data isolation.

## Tech Stack
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (Passport.js)
- **Documentation:** Scalar API Reference
- **Package Manager:** Yarn
- **Validation:** Class-validator
- **Serialization:** Swagger for API docs

## Core Modules and Features

### 1. Authentication Module (`src/auth/`)
- **Features:**
  - User login with username/password validation
  - User registration with password hashing (bcrypt)
  - JWT token generation and validation
  - Bearer token authentication
- **Key Components:**
  - `AuthController`: Handles `/auth/login` and `/auth/register` endpoints
  - `AuthService`: Validates credentials, generates JWT tokens
  - `JwtStrategy`: Passport JWT strategy for token validation
  - `JwtAuthGuard`: Protects routes requiring authentication
  - `GetUserId` decorator: Extracts user ID from JWT payload
- **Security:** Passwords are hashed before storage; JWT tokens expire in 1 hour

### 2. Users Module (`src/users/`)
- **Features:**
  - Full CRUD operations for users
  - Role-based access control (User/Admin roles)
  - Profile retrieval (`/users/me`)
  - Admin-only user creation and deletion
- **Key Components:**
  - `User` entity: UUID primary key, username, hashed password, role (enum), personal details
  - `UsersController`: REST endpoints with Swagger documentation
  - `UsersService`: CRUD operations with password exclusion in responses
  - `RolesGuard`: Enforces role-based permissions
  - `Roles` decorator: Marks endpoints with required roles
- **Relationships:** One-to-many with Tasks, Categories, and Tags (cascade delete)

### 3. Tasks Module (`src/tasks/`)
- **Features:**
  - Task CRUD with user isolation
  - Status management (pending, in-progress, completed)
  - Optional category association
  - Pagination and filtering (by status, category)
  - Bulk operations (delete multiple, delete all)
- **Key Components:**
  - `Task` entity: UUID, title, description, status enum, timestamps, relationships
  - `TasksController`: Comprehensive REST API with query parameters
  - `TasksService`: Advanced querying with TypeORM QueryBuilder, pagination
  - `TaskResponseDto`: Structured response with category and user info
- **Relationships:** Many-to-one with User (cascade), optional many-to-one with Category, many-to-many with Tags

### 4. Categories Module (`src/categories/`)
- **Features:**
  - Category CRUD scoped to user
  - Unique category names per user
  - Task association management
- **Key Components:**
  - `Category` entity: UUID, unique name, optional description
  - `CategoriesController`: User-scoped operations
  - `CategoriesService`: CRUD with relation loading
- **Relationships:** Many-to-one with User (cascade), one-to-many with Tasks (set null on delete)

### 5. Tags Module (`src/tags/`)
- **Features:**
  - Tag creation linked to specific tasks
  - User ownership validation
  - Unique tag names globally
- **Key Components:**
  - `Tag` entity: UUID, unique name
  - `TagsController`: CRUD with ownership checks
  - `TagsService`: Validates task ownership before tag creation
- **Relationships:** Many-to-one with User (set null), many-to-many with Tasks

### 6. Common Utilities (`src/common/`)
- **Logging Middleware:** HTTP request/response logging with timing
- **Pagination Utility:** Reusable pagination function for responses

## Database Schema
- **Entities:** User, Task, Category, Tag
- **Relationships:**
  - User → Tasks (1:N, cascade delete)
  - User → Categories (1:N, cascade delete)
  - User → Tags (1:N, set null)
  - Category → Tasks (1:N, set null)
  - Task ↔ Tags (N:M)
- **Constraints:** UUID primary keys, unique constraints on category names and tag names

## API Documentation
- **Scalar Integration:** Interactive API docs at `/scalar`
- **Swagger Annotations:** Comprehensive endpoint documentation with examples
- **Bearer Auth:** JWT authentication in docs

## Security & Access Control
- **JWT Authentication:** Required for most endpoints
- **Role-Based Permissions:** Admin role for user management
- **User Isolation:** All data operations scoped to authenticated user
- **Input Validation:** DTOs with class-validator decorators
- **Password Security:** Bcrypt hashing, passwords excluded from responses

## Key Architectural Patterns
- **Modular Structure:** Separate modules for each domain
- **Dependency Injection:** Services injected into controllers
- **Repository Pattern:** TypeORM repositories for data access
- **DTO Pattern:** Request/response data transfer objects
- **Guard Pattern:** Authentication and authorization guards
- **Decorator Pattern:** Custom decorators for user extraction and roles

## Testing
- Unit tests for controllers and services
- E2E tests for API endpoints
- Jest testing framework

This implementation provides a solid foundation for a task management application with user authentication, role-based access, and comprehensive CRUD operations across all entities, ensuring data security and user isolation.