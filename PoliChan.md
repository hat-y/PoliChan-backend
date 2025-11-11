# PoliChan

## Resumen general del proyecto

PoliChan es una aplicación para la interacción social y el intercambio de
información. El backend, construido con [`TypeScript`](src/index.ts), gestiona
usuarios, contenido, interacciones sociales, notificaciones y comunicación en
tiempo real. Actúa como el componente central que impulsa la funcionalidad de la

## Arquitectura del sistema (CQRS)

## Tecnologías utilizadas

Se ha descrito la arquitectura del proyecto PoliChan, incluyendo las tecnologías

## Funcionamiento del flujo CQRS

## Relación con la arquitectura investigada

Se ha creado una descripción que conecta el diseño del código del proyecto

## Bibliografía

Se ha creado una bibliografía en formato Markdown con fuentes teóricas y
técnicas sobre NestJS, CQRS, DDD y otros conceptos relevantes para el proyecto
PoliChan. La bibliografía incluye enlaces a la documentación oficial de NestJS,
artículos de Martin Fowler sobre CQRS, libros de Eric Evans y Vaughn Vernon
sobre DDD, y referencias a patrones de arquitectura de microservicios, Event
Sourcing y Clean Architecture. PoliChan con los principios teóricos de CQRS y
DDD. Se explica por qué se eligió esta arquitectura y qué beneficios aporta al
mantenimiento y la escalabilidad del proyecto. La descripción proporciona una
visión general de la relación entre la arquitectura implementada y la teoría. Se
ha explicado cómo las operaciones de escritura (Commands) y lectura (Queries) se
manejan en el código del proyecto PoliChan, ejemplificando con el módulo
"comments". Se ha mostrado cómo interactúan los controladores con los casos de
uso (comandos y queries) en el flujo CQRS. La explicación es clara y concisa,
proporcionando una visión general del flujo CQRS. Se ha incluido un diagrama de
flujo de Mermaid para ilustrar el flujo CQRS en el módulo "comments". utilizadas
en el backend (NestJS, Node.js, TypeScript, librerías clave), la base de datos
(PostgreSQL y MongoDB), la infraestructura (Docker, variables de entorno, Nginx)
y una breve mención del frontend (comunicación API). Se ha completado la
descripción detallada de la arquitectura del sistema PoliChan, que implementa el
patrón CQRS. Se ha incluido una explicación detallada de cómo el proyecto
implementa el patrón CQRS, una descripción del rol de cada capa (application,
domain, infrastructure, presentation) y un diagrama conceptual que muestra el
flujo de datos entre capas. El sistema PoliChan utiliza PostgreSQL para la base
de datos de escritura y MongoDB para la base de datos de lectura, implementando
consistencia eventual a través de eventos de dominio. aplicación.
