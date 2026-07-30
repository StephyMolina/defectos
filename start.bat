@echo off
echo ========================================
echo   TABLERO ARANDA - Inicio Rapido
echo ========================================
echo.

echo [1/4] Verificando instalacion de Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
echo Node.js instalado correctamente
echo.

echo [2/4] Instalando dependencias del backend...
cd backend
if not exist node_modules (
    echo Instalando paquetes...
    call npm install
) else (
    echo Dependencias ya instaladas
)
echo.

echo [3/4] Instalando dependencias del frontend...
cd ..\frontend
if not exist node_modules (
    echo Instalando paquetes...
    call npm install
) else (
    echo Dependencias ya instaladas
)
echo.

echo [4/4] Iniciando servidores...
echo.
echo Abriendo 2 ventanas:
echo - Backend en http://localhost:3000
echo - Frontend en http://localhost:4200
echo.

cd ..\backend
start "Backend API" cmd /k "npm run dev"

timeout /t 3 >nul

cd ..\frontend
start "Frontend Angular" cmd /k "npm start"

echo.
echo ========================================
echo   Servidores iniciados correctamente
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Presiona cualquier tecla para cerrar esta ventana
pause >nul
