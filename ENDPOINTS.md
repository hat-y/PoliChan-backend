# Post & Comments API Endpoints

API completa para los módulos de posts y comments con arquitectura CQRS (Command Query Responsibility Segregation).

## Tabla de Contenido

- [Posts Module](#posts-module)
  - [Commands (Write Operations)](#commands-write-operations)
  - [Queries (Read Operations)](#queries-read-operations)
- [Comments Module](#comments-module)
  - [Commands (Write Operations)](#comments-commands-write-operations)
  - [Queries (Read Operations)](#comments-queries-read-operations)
- [Query Parameters](#query-parameters)
- [Likes Management](#likes-management)
- [Timeline & Infinite Scroll](#timeline--infinite-scroll)
- [Advanced Queries](#advanced-queries)
- [Error Codes](#-error-codes)
- [Response Format](#response-format)

---

---

## Posts Module

### Commands (Write Operations)

### `POST /api/posts`
**Crear un nuevo post**

**Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Este es mi primer post en el sistema CQRS! 🚀"
}
```

**Validaciones:**
- `userId`: UUID válido de usuario existente (requerido)
- `content`: Texto del post, máximo 280 caracteres (requerido)

**Response:**
```json
{
  "message": "Post creado exitosamente"
}
```

---

### `DELETE /api/posts/:postId`
**Eliminar un post (soft delete)**

**URL Parameters:**
- `postId`: UUID del post a eliminar

**Body:** None

**Response:**
```json
{
  "message": "Post eliminado exitosamente"
}
```

---

### `POST /api/posts/:postId/like`
**Dar like a un post**

**URL Parameters:**
- `postId`: UUID del post al que se dará like

**Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validaciones:**
- `userId`: UUID válido de usuario que dará like (requerido)

**Response:**
```json
{
  "message": "Like agregado exitosamente"
}
```

---

### `POST /api/posts/:postId/unlike`
**Quitar like a un post**

**URL Parameters:**
- `postId`: UUID del post al que se quitará like

**Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validaciones:**
- `userId`: UUID válido de usuario que quitará like (requerido)

**Response:**
```json
{
  "message": "Like removido exitosamente"
}
```

---

## Queries (Read Operations)

### `GET /api/posts/:postId`
**Obtener un post específico**

**URL Parameters:**
- `postId`: UUID del post a obtener
- [~] 
**Query Parameters:** None

**Response:**
```json
{
  "id": "f445a1cd-8378-4373-882e-74fb1d1357ae",
  "userId": "b44b74ca-8705-40dd-a2b5-84fb1856e631",
  "content": "Otro post interesante 📚",
  "likesCount": 5,
  "timestamps": {
    "createdAt": {
      "value": "2025-11-05T02:07:09.887Z"
    },
    "updatedAt": {
      "value": "2025-11-05T02:15:30.123Z"
    }
  }
}
```

---

### `GET /api/posts`
**Listar todos los posts (paginación tradicional)**

**Query Parameters:**
- `limit`: Número de posts a devolver (default: 50, máximo: 100)
- `offset`: Número de posts a saltar (default: 0)

**Examples:**
```bash
GET /api/posts
GET /api/posts?limit=10&offset=0
GET /api/posts?limit=20&offset=20
```

**Response:**
```json
{
  "posts": [
    {
      "id": "f445a1cd-8378-4373-882e-74fb1d1357ae",
      "userId": "b44b74ca-8705-40dd-a2b5-84fb1856e631",
      "content": "Otro post interesante 📚",
      "likesCount": 0,
      "timestamps": {
        "createdAt": { "value": "2025-11-05T02:07:09.887Z" },
        "updatedAt": { "value": "2025-11-05T02:07:09.887Z" }
      }
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

---

### `GET /api/posts/user/:userId`
**Obtener posts de un usuario específico**

**URL Parameters:**
- `userId`: UUID del usuario

**Query Parameters:**
- `limit`: Número de posts a devolver (default: 50)
- `offset`: Número de posts a saltar (default: 0)

**Examples:**
```bash
GET /api/posts/user/123e4567-e89b-12d3-a456-426614174000
GET /api/posts/user/123e4567-e89b-12d3-a456-426614174000?limit=5&offset=10
```

**Response:**
```json
{
  "posts": [...],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 15
  }
}
```

---

## Comments Module

### Commands (Write Operations)

### `POST /api/comments`
**Crear un nuevo comentario**

**Body:**
```json
{
  "postId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Este es mi primer comentario en el sistema CQRS!"
}
```

**Validaciones:**
- `postId`: UUID válido de post existente (requerido)
- `userId`: UUID válido de usuario existente (requerido)
- `content`: Texto del comentario, máximo 280 caracteres (requerido)

**Response:**
```json
{
  "message": "Comment creado exitosamente"
}
```

---

### `POST /api/comments/:commentId/like`
**Dar like a un comentario**

**URL Parameters:**
- `commentId`: UUID del comentario al que se dará like

**Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validaciones:**
- `userId`: UUID válido de usuario que dará like (requerido)

**Response:**
```json
{
  "message": "Comment liked exitosamente"
}
```

---

### `POST /api/comments/:commentId/unlike`
**Quitar like a un comentario**

**URL Parameters:**
- `commentId`: UUID del comentario al que se quitará like

**Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validaciones:**
- `userId`: UUID válido de usuario que quitará like (requerido)

**Response:**
```json
{
  "message": "Comment unliked exitosamente"
}
```

---

### `DELETE /api/comments/:commentId`
**Eliminar un comentario (soft delete)**

**URL Parameters:**
- `commentId`: UUID del comentario a eliminar

**Body:**
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validaciones:**
- `userId`: UUID válido de usuario dueño del comentario (requerido)

**Response:**
```json
{
  "message": "Comment deleted exitosamente"
}
```

---

## Queries (Read Operations)

### `GET /api/comments/:commentId`
**Obtener un comentario específico**

**URL Parameters:**
- `commentId`: UUID del comentario a obtener

**Response:**
```json
{
  "id": "f445a1cd-8378-4373-882e-74fb1d1357ae",
  "postId": "b44b74ca-8705-40dd-a2b5-84fb1856e631",
  "userId": "a123b456-c789-0123-d456-789012345678",
  "content": "Este es un comentario interesante!",
  "likesCount": 3,
  "timestamps": {
    "createdAt": {
      "value": "2025-11-05T02:07:09.887Z"
    },
    "updatedAt": {
      "value": "2025-11-05T02:15:30.123Z"
    }
  }
}
```

---

### `GET /api/posts/:postId/comments`
**Obtener comentarios de un post específico**

**URL Parameters:**
- `postId`: UUID del post

**Query Parameters:**
- `limit`: Número de comentarios a devolver (default: 50, máximo: 100)
- `offset`: Número de comentarios a saltar (default: 0)

**Examples:**
```bash
GET /api/posts/123e4567-e89b-12d3-a456-426614174000/comments
GET /api/posts/123e4567-e89b-12d3-a456-426614174000/comments?limit=10&offset=0
GET /api/posts/123e4567-e89b-12d3-a456-426614174000/comments?limit=20&offset=20
```

**Response:**
```json
{
  "comments": [
    {
      "id": "f445a1cd-8378-4373-882e-74fb1d1357ae",
      "postId": "b44b74ca-8705-40dd-a2b5-84fb1856e631",
      "userId": "a123b456-c789-0123-d456-789012345678",
      "content": "Este es un comentario interesante!",
      "likesCount": 0,
      "timestamps": {
        "createdAt": { "value": "2025-11-05T02:07:09.887Z" },
        "updatedAt": { "value": "2025-11-05T02:07:09.887Z" }
      }
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 1
  }
}
```

---

## Timeline & Infinite Scroll

### `GET /api/posts/timeline`
**Timeline general (infinite scroll)**

**Query Parameters:**
- `limit`: Número de posts a devolver (default: 50)
- `afterPostId`: UUID del último post visto (opcional, para infinite scroll)

**Examples:**
```bash
# Carga inicial
GET /api/posts/timeline?limit=20

# Scroll hacia abajo (siguientes posts más viejos)
GET /api/posts/timeline?limit=20&afterPostId=abc-123-def-456

# Más posts
GET /api/posts/timeline?limit=10&afterPostId=xyz-789-uvw-012
```

**Response:**
```json
{
  "posts": [...],
  "pagination": {
    "limit": 50,
    "afterPostId": "abc-123-def-456",
    "total": 25
  }
}
```

---

### `GET /api/posts/user/:userId/timeline`
**Timeline de un usuario específico**

**URL Parameters:**
- `userId`: UUID del usuario

**Query Parameters:**
- `limit`: Número de posts a devolver (default: 50)
- `afterPostId`: UUID del último post visto (opcional)

**Examples:**
```bash
GET /api/posts/user/123e4567-e89b-12d3-a456-426614174000/timeline
GET /api/posts/user/123e4567-e89b-12d3-a456-426614174000/timeline?limit=10
GET /api/posts/user/123e4567-e89b-12d3-a456-426614174000/timeline?limit=5&afterPostId=xyz-789
```

---

## Advanced Queries

### `GET /api/posts/most-liked`
**Posts más populares**

**Query Parameters:**
- `limit`: Número de posts a devolver (default: 20)

**Examples:**
```bash
GET /api/posts/most-liked
GET /api/posts/most-liked?limit=10
GET /api/posts/most-liked?limit=50
```

**Response:**
```json
{
  "posts": [
    {
      "id": "post-123",
      "content": "Post muy popular! 🔥",
      "likesCount": 150,
      ...
    }
  ],
  "pagination": {
    "limit": 20,
    "total": 50
  }
}
```

---

### `GET /api/posts/by-likes`
**Posts por rango de likes**

**Query Parameters:**
- `minLikes`: Número mínimo de likes (requerido)
- `maxLikes`: Número máximo de likes (requerido)
- `limit`: Número de posts a devolver (default: 50)

**Examples:**
```bash
GET /api/posts/by-likes?minLikes=5&maxLikes=20
GET /api/posts/by-likes?minLikes=10&maxLikes=100&limit=25
GET /api/posts/by-likes?minLikes=1&maxLikes=5&limit=10
```

**Response:**
```json
{
  "posts": [...],
  "filters": {
    "minLikes": 5,
    "maxLikes": 20
  },
  "pagination": {
    "limit": 50,
    "total": 12
  }
}
```

---

## Query Parameters Reference

| Parámetro | Tipo | Default | Descripción | Máximo |
|-----------|------|---------|-------------|--------|
| `limit` | number | 50 | Registros por página | 100 |
| `offset` | number | 0 | Registros a saltar (paginación tradicional) | - |
| `afterPostId` | string | - | ID del último post (infinite scroll) | - |
| `minLikes` | number | - | Likes mínimo (requerido para by-likes) | - |
| `maxLikes` | number | - | Likes máximo (requerido para by-likes) | - |

---

## Likes Management

### Como funciona el sistema de likes:

#### Posts:
1. **Dar like:**
   - Incrementa `likesCount` en el post
   - Dispara `LikeCreatedEvent`
   - Actualiza en tiempo real el contador

2. **Quitar like:**
   - Decrementa `likesCount` (nunca menor a 0)
   - Dispara `LikeRemovedEvent`
   - Actualiza `updatedAt` del post

#### Comments:
1. **Dar like:**
   - Incrementa `likesCount` en el comentario
   - Dispara `CommentLikedEvent`
   - Actualiza en tiempo real el contador

2. **Quitar like:**
   - Decrementa `likesCount` del comentario (nunca menor a 0)
   - Dispara `CommentUnlikedEvent`
   - Actualiza `updatedAt` del comentario

3. **Validaciones:**
   - Un usuario puede dar like a múltiples posts/comentarios
   - El mismo userId puede quitar su like
   - Los contadores nunca serán negativos
   - El usuario dueño de un post/comentario puede modificarlo o eliminarlo

---

## Error Codes

| Código | Descripción | Ejemplo |
|-------|-------------|---------|
| `200` | Exitoso | Post creado/obtenido/actualizado |
| `201` | Creado | Nuevo post creado |
| `400` | Bad Request | Datos inválidos o faltantes |
| `404` | Not Found | Post no encontrado |
| `500` | Server Error | Error interno del servidor |

### Ejemplos de errores:

**400 - Validación:**
```json
{
  "error": "userId y content son requeridos"
}
```

**400 - Contenido muy largo:**
```json
{
  "error": "El contenido no puede exceder los 280 caracteres"
}
```

**404 - Post no encontrado:**
```json
{
  "error": "Post con id abc-123 no encontrado"
}
```

**500 - Error del servidor:**
```json
{
  "error": "Error desconocido"
}
```

---

## Response Format

### Posts Array Response:
```json
{
  "posts": [
    {
      "id": "string",
      "userId": "string",
      "content": "string",
      "likesCount": "number",
      "timestamps": {
        "createdAt": { "value": "ISO-8601 timestamp" },
        "updatedAt": { "value": "ISO-8601 timestamp" }
      }
    }
  ],
  "pagination": {
    "limit": "number",
    "offset": "number",
    "total": "number"
  }
}
```

### Single Post Response:
```json
{
  "id": "string",
  "userId": "string",
  "content": "string",
  "likesCount": "number",
  "timestamps": {
    "createdAt": { "value": "ISO-8601 timestamp" },
    "updatedAt": { "value": "ISO-8601 timestamp" }
  }
}
```

### Comments Array Response:
```json
{
  "comments": [
    {
      "id": "string",
      "postId": "string",
      "userId": "string",
      "content": "string",
      "likesCount": "number",
      "timestamps": {
        "createdAt": { "value": "ISO-8601 timestamp" },
        "updatedAt": { "value": "ISO-8601 timestamp" }
      }
    }
  ],
  "pagination": {
    "limit": "number",
    "offset": "number",
    "total": "number"
  }
}
```

### Single Comment Response:
```json
{
  "id": "string",
  "postId": "string",
  "userId": "string",
  "content": "string",
  "likesCount": "number",
  "timestamps": {
    "createdAt": { "value": "ISO-8601 timestamp" },
    "updatedAt": { "value": "ISO-8601 timestamp" }
  }
}
```

### Message Response:
```json
{
  "message": "string"
}
```

### Error Response:
```json
{
  "error": "string"
}
```

---

## Uso Recomendado

### Para Timeline Principal (Home Feed):
```bash
# Primera carga
GET /api/posts/timeline?limit=20

# Scroll infinito
GET /api/posts/timeline?limit=20&afterPostId=ultimo-post-visto-id
```

### Para Perfil de Usuario:
```bash
# Posts del usuario con paginación tradicional
GET /api/posts/user/usuario-uuid?limit=10&offset=0
GET /api/posts/user/usuario-uuid?limit=10&offset=10
```

### Para Posts Populares:
```bash
# Posts más gustados
GET /api/posts/most-liked?limit=10

# Posts con likes específicos
GET /api/posts/by-likes?minLikes=5&maxLikes=50&limit=20
```

---

## CQRS Architecture

Este API implementa:

- **Write Database (PostgreSQL):** Para commands que modifican datos
- **Read Database (MongoDB):** Para queries optimizadas de lectura
- **Event Sourcing:** Eventos asíncronos que sincronizan las bases de datos
- **Event Handlers:** Procesan eventos para actualizar la read database

**Flujo completo:**
```
Request → Command → PostgreSQL → Event → MongoDB → Response
```

---

## 📚 Additional Notes

- **UUID Format:** Todos los IDs usan formato UUID v4
- **Timestamps:** En formato ISO-8601 UTC
- **Soft Delete:** Los posts eliminados no aparecen en queries normales
- **Rate Limiting:** Considerar implementar límites para prevenir spam
- **CORS:** Configurado para desarrollo, ajustar para producción
