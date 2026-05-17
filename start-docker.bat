@echo off
echo ========================================
echo    SmartLogix - Docker Setup
echo ========================================
echo.

REM Cambiar al directorio del script para asegurar la ruta correcta
pushd "%~dp0"

echo Deteniendo contenedores anteriores...
docker compose down

echo.
echo Construyendo y levantando servicios...
docker compose up --build -d

echo.
echo Esperando que los servicios estén listos...
timeout /t 30 /nobreak > nul

echo.
echo Verificando estado de los contenedores...
docker compose ps

echo.
echo ========================================
echo    Servicios disponibles:
echo ========================================
echo Frontend:    http://localhost:3000
echo BFF API:     http://localhost:9090
echo Inventario:  http://localhost:8081
echo Pedidos:     http://localhost:8082
echo DB Inventario: localhost:5432
echo DB Pedidos:    localhost:5433
echo.
echo Credenciales de prueba:
echo Admin: admin / admin123
echo User:  user1 / password123
echo ========================================
echo.
echo Para ver logs: docker compose logs -f [servicio]
echo Para detener: docker compose down

REM Restaurar directorio previo
popd
echo.