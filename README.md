# Polochan Backend

Backend con **Screaming Architecture**, **Domain-Driven Design (DDD)** y estructura preparada para **CQRS**.

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── modules/                          # 🎯 Módulos de Negocio (Screaming Architecture)
│   └── user/                        # Módulo del dominio User
│       ├── domain/                   # Core business logic
│       │   ├── user.entity.ts       # Entidad del dominio
│       │   └── user.repository.ts   # Interfaz del repositorio
│       ├── application/             # Application layer (CQRS ready)
│       │   ├── commands/            # Operaciones de escritura
│       │   └── queries/             # Operaciones de lectura
│       ├── infrastructure/          # Implementaciones de infraestructura
│       │   └── repositories/        # Repositorios concretos
│       ├── presentation/            # Controladores API
│       └── user.module.ts           # Inyección de dependencias
├── infrastructure/                   # 🔧 Infraestructura técnica
│   ├── http/                        # Servidor HTTP Fastify
│   └── bootstrap/                   # Lógica de inicio
├── shared/                          # 📚 Código compartido
└── server.ts                        # 🚀 Punto de entrada principal
```

## 🚀 Inicio Rápido

### Con Docker
```bash
npm run docker
```

### Desarrollo Local
```bash
npm install
npm run dev
```

## 📋 Endpoints

- `GET /` - Health check
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear usuario

## 🏛️ Patrones Implementados

### Domain-Driven Design (DDD)
- **Entidades**: Objetos con identidad y comportamiento
- **Repositorios**: Abstracción de acceso a datos
- **Módulos**: Bounded contexts delimitados

### CQRS Ready
- **Commands**: Operaciones de escritura (Create, Update, Delete)
- **Queries**: Operaciones de lectura (Find, Get All)
- **Separación clara** entre lecturas y escrituras

### Screaming Architecture
- La estructura del código **grita** el dominio del negocio
- Los módulos de negocio son el foco principal
- La infraestructura está separada y no opaca el dominio

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev      # Desarrollo con hot reload
npm start        # Producción
npm run docker   # Docker Compose
```

## 📝 Ejemplo de Uso

```bash
# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# Obtener usuarios
curl http://localhost:3000/api/users
```

## 🚀 Características

✅ **Screaming Architecture** - La estructura expone el dominio
✅ **DDD** - Diseño guiado por el dominio
✅ **CQRS Ready** - Preparado para Command Query Responsibility Segregation
✅ **Inyección de Dependencias** - Módulos desacoplados
✅ **Infraestructura Limpia** - Separación de capas
✅ **Hot Reload** - Desarrollo rápido
✅ **Docker** - Despliegue sencillo