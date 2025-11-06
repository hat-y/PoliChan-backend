# PoliChan Backend

Backend API para una red social tipo Twitter construido con arquitectura CQRS (Command Query Responsibility Segregation) y Domain-Driven Design (DDD).

## ¿Qué es CQRS y por qué lo elegimos?

CQRS (Command Query Responsibility Segregation) es un patrón de arquitectura que **separa las operaciones de escritura (Commands) de las operaciones de lectura (Queries)**. Esta separación permite optimizar cada lado para su propósito específico:

### **Lado de Escritura (Commands)**
- Usa PostgreSQL con transacciones ACID
- Garantiza consistencia y atomicidad
- Maneja la lógica de negocio compleja
- Publica eventos que representan cambios en el sistema

### **Lado de Lectura (Queries)**
- Usa MongoDB optimizado para lecturas rápidas
- Datos denormalizados para respuestas instantáneas
- Sin JOINs, consultas directas y precalculadas
- Escalable horizontalmente

### **¿Por qué esta arquitectura?**
- **Rendimiento**: Lecturas y escrituras optimizadas por separado
- **Escalabilidad**: Puede escalar las lecturas independientemente de las escrituras
- **Claridad**: Separación clara entre lo que modifica el sistema y lo que solo consulta
- **Flexibilidad**: Cada modelo puede evolucionar independientemente
- **Event Sourcing**: Todos los cambios se registran como eventos, permitiendo reconstruir el estado completo del sistema

## Estructura del Proyecto

La arquitectura está organizada por módulos de negocio (Screaming Architecture), donde la estructura del código refleja el dominio del problema:

```
src/
├── modules/                                # Módulos de negocio principales
│   ├── user/                             # Gestión de usuarios
│   │   ├── domain/                        # Lógica del dominio y reglas de negocio
│   │   │   ├── entity/                    # Entidades del dominio
│   │   │   │   └── user.entity.ts        # Entidad User con su comportamiento
│   │   │   └── interfaces/                # Contratos del dominio
│   │   │       └── user.repository.ts    # Interfaz del repositorio
│   │   ├── application/                   # Capa de aplicación (CQRS)
│   │   │   ├── commands/                  # Operaciones que modifican datos
│   │   │   │   ├── create-user.command.ts     # DTO para crear usuario
│   │   │   │   └── handlers/                   # Casos de uso (use cases)
│   │   │   │       └── create-user-command.handler.ts
│   │   │   ├── queries/                   # Operaciones de solo lectura
│   │   │   │   ├── find-user.query.ts          # DTO para buscar usuario
│   │   │   │   └── handlers/                   # Casos de uso de lectura
│   │   │   │       └── find-user-query.handler.ts
│   │   │   └── event-handlers/            # Procesan eventos del dominio
│   │   │       └── user-registered.event-handler.ts
│   │   ├── infrastructure/                # Implementaciones técnicas
│   │   │   └── repositories/              # Repositorios concretos
│   │   │       ├── postgres-user-write.repository.ts    # Base de escritura
│   │   │       └── mongo-user-read.repository.ts        # Base de lectura
│   │   └── presentation/                  # Controladores y rutas API
│   │       └── controllers/
│   │           └── user.controller.ts
│   ├── post/                             # Módulo de posts (tweets)
│   │   ├── domain/                        # Entidad Post con sus eventos
│   │   │   └── entity/
│   │   │       └── post.entity.ts
│   │   ├── application/                   # Commands, queries y handlers
│   │   ├── infrastructure/                # Repositorios PostgreSQL y MongoDB
│   │   └── presentation/                  # API endpoints
│   └── comments/                          # Módulo de comentarios
│       ├── domain/                        # Entidad Comments
│       │   └── entity/
│       │       └── comments.entity.ts
│       ├── application/                   # Operaciones CQRS de comentarios
│       ├── infrastructure/                # Persistencia dual
│       └── presentation/                  # Endpoints de comentarios
├── shared/                                # Código compartido entre módulos
│   ├── domain/                            # Contratos y tipos base
│   │   ├── command.ts                     # Base para Commands
│   │   ├── query.ts                       # Base para Queries
│   │   ├── event.ts                       # Base para Events
│   │   ├── command-handler.ts             # Interfaz para handlers
│   │   └── message-bus.ts                 # Sistema de mensajería
│   └── infrastructure/                    # Implementaciones compartidas
│       ├── postgres/                      # Base de datos de escritura
│       │   ├── write-database.ts          # Conexión PostgreSQL
│       │   └── entities/                  # Entidades TypeORM
│       ├── mongo/                         # Base de datos de lectura
│       │   ├── read-database.ts           # Conexión MongoDB
│       │   └── entities/                  # Entidades MongoDB
│       └── http/                          # Servidor web y ruteo
│           ├── http.server.ts             # Configuración Fastify
│           └── bootstrap/                 # Inicialización y DI
└── server.ts                              # Punto de entrada principal
```

## Flujo de Datos en el Sistema

### **Crear un nuevo post**
```
1. HTTP Request → POST /api/posts
2. Controller → PostController.createPost()
3. Command → CreatePostCommand
4. Handler → CreatePostCommandHandler.handle()
5. Domain → Post.create() → { post, PostCreatedEvent }
6. Write DB → PostgreSQL (transacción ACID)
7. Event Bus → PostCreatedEvent
8. Event Handler → PostCreatedEventHandler
9. Read DB → MongoDB (optimizado para consultas)
10. Response → { message: "Post creado exitosamente" }
```

## Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- PostgreSQL y MongoDB (para desarrollo local)

### Con Docker (Recomendado)
```bash
# Clonar el repositorio
git clone <repository-url>
cd PoliChan-backend

# Iniciar todos los servicios
docker compose up -d

# Verificar que está funcionando
curl http://localhost/
```

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Variables de entorno (crear archivo .env)
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

## Scripts Disponibles
```bash
npm run dev          # Desarrollo con hot reload (tsx)
npm run build        # Compilar TypeScript
npm start            # Producción
npm run docker       # Docker Compose completo
npm run docker:dev   # Solo servicios de base de datos
```

## API Endpoints

### Health Check
- `GET /` - Estado del servidor

### Usuarios
- `POST /api/user/register` - Registrar nuevo usuario
- `POST /api/user/login` - Iniciar sesión
- `GET /api/user/:userId` - Obtener usuario específico
- `GET /api/user` - Listar todos los usuarios

### Posts
- `POST /api/posts` - Crear nuevo post
- `DELETE /api/posts/:postId` - Eliminar post
- `GET /api/posts/:postId` - Obtener post específico
- `GET /api/posts/timeline` - Timeline general (infinite scroll)
- `POST /api/posts/:postId/like` - Dar like a post
- `POST /api/posts/:postId/unlike` - Quitar like

### Comentarios
- `POST /api/comments` - Crear comentario
- `DELETE /api/comments/:commentId` - Eliminar comentario
- `GET /api/comments/:commentId` - Obtener comentario
- `GET /api/posts/:postId/comments` - Comentarios de un post
- `POST /api/comments/:commentId/like` - Dar like a comentario

Para ver la documentación completa de todos los endpoints, revisa [ENDPOINTS.md](./ENDPOINTS.md).

## Características Principales

### **Arquitectura**
- CQRS con separación clara de lecturas y escrituras
- Domain-Driven Design para lógica de negocio robusta
- Screaming Architecture donde el dominio es el protagonista
- Event Sourcing con publicador de eventos asíncrono

### **Base de Datos**
- **PostgreSQL**: Para escrituras con integridad referencial y transacciones ACID
- **MongoDB**: Para lecturas ultra rápidas con datos denormalizados
- **Sincronización**: Vía eventos para mantener consistencia eventual

### **Desarrollo**
- TypeORM para PostgreSQL con validaciones de tipos
- MongoDB con esquemas flexibles para el modelo de lectura
- Fastify como servidor HTTP de alto rendimiento
- WebSockets para actualizaciones en tiempo real
- Docker Compose para desarrollo y producción

### **Calidad del Código**
- TypeScript estricto para seguridad de tipos
- Inyección de dependencias para testing y modularidad
- Separación clara entre dominio, aplicación e infraestructura
- Contratos e interfaces para desacoplamiento

## Ejemplos de Uso

### Crear un post
```bash
curl -X POST http://localhost/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "content": "Mi primer post en PoliChan!"
  }'
```

### Obtener timeline
```bash
curl "http://localhost/api/posts/timeline?limit=10"
```

### Crear un comentario
```bash
curl -X POST http://localhost/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "post-id-aqui",
    "userId": "user-id-aqui",
    "content": "Mi comentario sobre este post"
  }'
```

## Monitoreo y Logging

La aplicación incluye:
- Logging estructurado con diferentes niveles
- Health checks para monitoreo de servicios
- Métricas de colas de eventos
- Logs detallados del flujo CQRS

## Testing

La arquitectura permite diferentes estrategias de testing:

- **Unit Tests**: Para handlers, domain entities y services
- **Integration Tests**: Para repositories y message bus
- **API Tests**: Para endpoints completos
- **E2E Tests**: Para flujos completos de usuario

## Contribución

1. Forkear el proyecto
2. Crear un feature branch (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo licencia MIT.