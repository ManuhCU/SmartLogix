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

### Opción 1: Script Automático (Recomendado)
Ejecuta el script correspondiente a tu sistema operativo:

**Windows:**
```cmd
start-docker.bat
```

**Linux/Mac:**
```bash
chmod +x start-docker.sh
./start-docker.sh
```

### Opción 2: Manual
Para levantar toda la infraestructura (Bases de datos, Microservicios, BFF y Frontend):
```bash
cd SmartLogix
docker compose up --build
```

### Servicios Disponibles
Una vez levantados los contenedores, estarán disponibles en:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interfaz de usuario React |
| **BFF API** | http://localhost:9090 | Backend For Frontend |
| **MS Inventario** | http://localhost:8081 | Microservicio de Inventario |
| **MS Pedidos** | http://localhost:8082 | Microservicio de Pedidos |
| **DB Inventario** | localhost:5432 | PostgreSQL Inventario |
| **DB Pedidos** | localhost:5433 | PostgreSQL Pedidos |

### Credenciales de Prueba
- **Admin**: `admin` / `admin123`
- **Usuario**: `user1` / `password123`

### Comandos Útiles
```bash
# Ver estado de contenedores
docker compose ps

# Ver logs de un servicio específico
docker compose logs -f frontend

# Detener todos los servicios
docker compose down

# Reconstruir y reiniciar
docker compose up --build --force-recreate
```

## Pruebas y Calidad
Para correr las pruebas unitarias con JUnit y Mockito, junto con la generación del reporte de cobertura (Jacoco):
```bash
cd backend
mvn clean test
```
Los reportes de cobertura estarán disponibles en las carpetas `target/site/jacoco` de cada microservicio.
