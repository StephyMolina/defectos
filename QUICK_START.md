# Guía de Inicio Rápido

## Paso 1: Configurar Base de Datos

```bash
# Conectar a SQL Server
sqlcmd -S localhost -U sa -P tu_password

# Ejecutar script
sqlcmd -S localhost -U sa -P tu_password -i database/create_database.sql
```

## Paso 2: Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tus credenciales
npm run dev
```

## Paso 3: Configurar Frontend

```bash
cd frontend
npm install
npm start
```

## Verificar Instalación

1. Backend: http://localhost:3000
2. Frontend: http://localhost:4200
3. API Health: http://localhost:3000/api/health

## Credenciales por Defecto SQL Server

Edita el archivo `backend/.env`:
```
DB_USER=sa
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_NAME=tablero_db
PORT=3000
```

## Comandos Útiles

### Backend
```bash
npm start          # Modo producción
npm run dev        # Modo desarrollo con nodemon
```

### Frontend
```bash
npm start          # Servidor de desarrollo
npm run build      # Construir para producción
```

## Solución Rápida de Problemas

### Puerto ocupado
```bash
# Cambiar puerto en backend/.env
PORT=3001

# Cambiar puerto en frontend/src/environments/environment.ts
apiUrl: 'http://localhost:3001/api'
```

### SQL Server no conecta
1. Verifica que SQL Server esté corriendo
2. Comprueba el puerto (por defecto 1433)
3. Verifica credenciales en `.env`
4. Intenta `trustServerCertificate: true` en config/database.js
