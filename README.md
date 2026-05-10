# SmartLogix - Sistema de Microservicios

Este es el proyecto principal de **SmartLogix** desarrollado para la **Evaluación Parcial 2**.
La solución es un sistema basado en Microservicios, desarrollado con Spring Boot para el backend y React para el frontend.

## Arquitectura
- **Frontend**: Aplicación en React estructurada como componente NPM.
- **BFF (Backend For Frontend)**: API Gateway centralizado que interactúa con el frontend y rutea las peticiones.
- **Microservicio Inventario**: Gestiona el catálogo de productos y su stock.
- **Microservicio Pedidos**: Gestiona la creación de órdenes de compra. Incluye un **Circuit Breaker** (Resilience4j) para manejar fallos si el servicio de inventario no responde.
- **Base de Datos**: Patrón Database-per-Service. Se utilizan 2 bases de datos PostgreSQL independientes.

## Requisitos Previos
- Docker y Docker Compose
- Java 17+
- Node.js 18+ y npm
- Maven

## Estructura de Directorios
```
/SmartLogix
|-- /backend
|   |-- /bff                 # Backend For Frontend API
|   |-- /ms-inventario       # Microservicio de Inventario
|   |-- /ms-pedidos          # Microservicio de Pedidos
|   |-- pom.xml              # Maven Parent POM
|-- /frontend                # Aplicación React
|-- docker-compose.yml       # Orquestación de contenedores
```

## Ejecución con Docker Compose
Para levantar toda la infraestructura (Bases de datos, Microservicios, BFF y Frontend):
```bash
cd SmartLogix
docker-compose up --build
```

Esto levantará:
- PostgreSQL Inventario (puerto 5432)
- PostgreSQL Pedidos (puerto 5433)
- MS Inventario (puerto 8081)
- MS Pedidos (puerto 8082)
- BFF (puerto 8080)
- Frontend (puerto 3000)

## Pruebas y Calidad
Para correr las pruebas unitarias con JUnit y Mockito, junto con la generación del reporte de cobertura (Jacoco):
```bash
cd backend
mvn clean test
```
Los reportes de cobertura estarán disponibles en las carpetas `target/site/jacoco` de cada microservicio.
