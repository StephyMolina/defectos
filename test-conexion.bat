@echo off
echo ========================================
echo   PRUEBA DE CONEXION A ARANDABI
echo ========================================
echo.

cd backend
call npm run test-connection

echo.
echo ========================================
echo Presiona cualquier tecla para salir
pause >nul
