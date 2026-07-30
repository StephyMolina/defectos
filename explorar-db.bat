@echo off
echo ========================================
echo   EXPLORADOR DE BASE DE DATOS ARANDA
echo ========================================
echo.
echo Conectando a: srvv-db-aranda
echo Base de datos: ARANDABI
echo.

cd backend
call npm run explore

echo.
echo ========================================
echo Presiona cualquier tecla para salir
pause >nul
