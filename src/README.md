# Backend Architecture

Este proyecto sigue la Screaming Architecture con Domain-Driven Design y el patron CQRS.

## 📁 Directory Structure

```
src/
├── modules/                          # 🎯 Business Modules (Screaming Architecture)
│   └── user/                        # User domain module
│       ├── domain/                   # Core business logic
│       │   ├── user.entity.ts       # Entity
│       │   ├── user.repository.ts   # Repository interface
│       │   └── value-objects/       # Value Objects
│       ├── application/             # Application layer (CQRS)
│       │   ├── commands/            # Write operations
│       │   └── queries/             # Read operations
│       ├── infrastructure/          # Infrastructure implementations
│       │   └── repositories/        # Repository implementations
│       ├── presentation/            # API controllers
│       ├── user.module.ts           # Dependency injection
│       └── index.ts                 # Module exports
├── infrastructure/                   # 🔧 Technical Infrastructure
│   ├── http/                        # HTTP server
│   │   └── http.server.ts          # Fastify server setup
│   └── bootstrap/                   # Application startup
│       └── app.bootstrap.ts        # Bootstrap logic
├── shared/                          # 📚 Shared code
│   └── types/                      # Common types
├── server.ts                       # 🚀 Application entry point
└── index.ts                        # Index file
```

## 🏗️ Architecture Layers

### 1. Modules Layer (`src/modules/`)
**Purpose**: Contains business domains - this is the SCREAMING ARCHITECTURE
- Each module is self-contained with its own domain, application, infrastructure, and presentation layers
- **User Module**: Complete DDD + CQRS implementation with console logging for MVP

### 2. Infrastructure Layer (`src/infrastructure/`)
**Purpose**: Technical concerns that support the application
- **HTTP Server**: Fastify setup and route registration
- **Bootstrap**: Application startup and configuration

### 3. Shared Layer (`src/shared/`)
**Purpose**: Code shared across modules
- **Types**: Common TypeScript interfaces and types

### 4. Application Root (`src/`)
**Purpose**: Application entry points
- **server.ts**: Main application bootstrap
- **index.ts**: Application entry point

## 🎯 DDD + CQRS Implementation

### User Module Structure:
```
user/
├── domain/                 # 🧠 Business rules & entities
├── application/            # ⚙️ Use cases (Commands & Queries)
├── infrastructure/         # 🔌 External implementations
├── presentation/           # 🌐 API endpoints
└── user.module.ts         # 🔗 Dependency injection
```

### Key Patterns:
- **Entities**: Core business objects with behavior
- **Value Objects**: Immutable objects with validation
- **Repository Pattern**: Data access abstraction
- **Commands**: Write operations (Create, Update, Delete)
- **Queries**: Read operations (Find, Get All)
- **Dependency Injection**: Clean separation of concerns

## 🚀 Getting Started

1. The application starts at `src/server.ts`
2. Bootstrap initializes the HTTP server
3. HTTP server registers routes from User Module
4. User Module handles all user-related operations

## 📝 MVP Features

- **Console Logging**: All operations log their actions for debugging
- **In-Memory Repository**: Simple data storage for MVP
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Type Safety**: Full TypeScript support

## 🔧 Usage Examples

```typescript
// Initialize user module
const userController = UserModule.initialize();

// Create user
const result = await userController.createUser({
  email: 'test@example.com',
  name: 'Test User'
});

// Get all users
const users = await userController.getAllUsers();
```
