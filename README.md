# Manual Técnico de SmartLogix

---

## 1. Ejecución del Frontend (React)

El frontend está desarrollado en React y utiliza NPM como gestor de paquetes.

### Requisitos previos:
- Node.js (v16 o superior)
- NPM (v8 o superior)

### Pasos para ejecución local (Sin Docker):
1. Abre una terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias listadas en el `package.json`:
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm start
   ```
4. La aplicación estará disponible en `http://localhost:3000`.

*(Nota: Para que el frontend funcione correctamente, el BFF debe estar corriendo en el puerto 9090).*

---

## 2. Ejecución del Backend (Microservicios)

El backend está compuesto por 4 módulos (BFF, ms-inventario, ms-pedidos, ms-usuarios) desarrollados en Spring Boot 3.

### Requisitos previos:
- Java JDK 17
- Maven 3.8+
- Docker Desktop (Para levantar las bases de datos)

### Método 1: Orquestación Completa con Docker Compose (Recomendado)
Para levantar todo el ecosistema (Bases de datos + Microservicios + Frontend) con un solo comando:
1. Navega a la raíz del proyecto `SmartLogix`.
2. Ejecuta:
   ```bash
   docker-compose up --build -d
   ```
3. Verifica que los contenedores estén corriendo con `docker ps`.

### Método 2: Ejecución individual local (Para desarrollo)
1. Levanta únicamente las bases de datos PostgreSQL en contenedores:
   ```bash
   docker-compose up db-inventario db-pedidos db-usuarios -d
   ```
2. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
3. Compila el proyecto maestro:
   ```bash
   mvn clean install -DskipTests
   ```
4. Navega a la carpeta de cada microservicio y córrelo:
   ```bash
   cd ms-inventario
   mvn spring-boot:run
   ```

---

## 3. Pruebas Unitarias y Reportes de Cobertura (Jacoco)

El proyecto utiliza el plugin Jacoco para generar métricas de cobertura de código.

### Ejecución de pruebas y generación de reportes:
1. Navega a la carpeta raíz del backend:
   ```bash
   cd backend
   ```
2. Ejecuta el ciclo de pruebas:
   ```bash
   mvn clean test
   ```

### Ubicación de los reportes generados:
Una vez finalizada la ejecución con éxito, los reportes HTML se generarán automáticamente en las siguientes rutas (ejemplo para ms-pedidos):
- `backend/ms-pedidos/target/site/jacoco/index.html`
