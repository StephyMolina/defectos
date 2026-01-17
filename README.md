# Tablero - Sistema de Gestión

Sistema completo con frontend en Angular, backend en Node.js y base de datos SQL Server.

## Estructura del Proyecto

```
tablero/
├── frontend/           # Aplicación Angular
├── backend/           # API REST con Node.js y Express
├── database/          # Scripts SQL Server
└── README.md
```

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- SQL Server
- Angular CLI (`npm install -g @angular/cli`)

## Configuración

### 1. Base de Datos (SQL Server)

```bash
# Ejecutar el script de creación de base de datos
cd database
sqlcmd -S localhost -U sa -P tu_password -i create_database.sql
```

### 2. Backend (Node.js)

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env con tus credenciales de SQL Server
# DB_USER=sa
# DB_PASSWORD=tu_password
# DB_SERVER=localhost
# DB_NAME=tablero_db
# PORT=3000

# Iniciar servidor en modo desarrollo
npm run dev

# O en modo producción
npm start
```

El backend estará disponible en: http://localhost:3000

### 3. Frontend (Angular)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# O construir para producción
npm run build
```

El frontend estará disponible en: http://localhost:4200

## API Endpoints

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Health Check

- `GET /api/health` - Verificar conexión a base de datos

## Uso

1. Asegúrate de que SQL Server esté corriendo
2. Inicia el backend: `cd backend && npm run dev`
3. En otra terminal, inicia el frontend: `cd frontend && npm start`
4. Abre tu navegador en http://localhost:4200

## Características

- CRUD completo de usuarios
- Interfaz moderna con Angular 17
- API REST con Node.js y Express
- Conexión a SQL Server con mssql
- Arquitectura modular y escalable
- Manejo de errores
- CORS habilitado

## Tecnologías Utilizadas

### Frontend
- Angular 17
- TypeScript
- RxJS
- Standalone Components

### Backend
- Node.js
- Express
- mssql (driver para SQL Server)
- dotenv
- cors

### Base de Datos
- SQL Server

## Estructura de Archivos

### Backend
```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración de BD
│   ├── controllers/
│   │   └── userController.js # Lógica de negocio
│   ├── routes/
│   │   └── userRoutes.js     # Definición de rutas
│   ├── models/               # Modelos (opcional)
│   ├── middlewares/          # Middlewares personalizados
│   ├── services/             # Servicios adicionales
│   └── server.js             # Punto de entrada
├── .env.example
├── .gitignore
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── user-list.component.ts
│   │   ├── models/
│   │   │   └── user.model.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── app.component.ts
│   │   └── app.config.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── tsconfig.json
└── package.json
```

## Solución de Problemas

### Error de conexión a SQL Server
- Verifica que SQL Server esté corriendo
- Comprueba las credenciales en el archivo `.env`
- Asegúrate de que el puerto esté abierto

### Error CORS
- El backend ya tiene CORS habilitado
- Verifica que la URL del API en `environment.ts` sea correcta

### Error al instalar dependencias
```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar
npm install
```

## Próximos Pasos

- Agregar autenticación y autorización
- Implementar paginación
- Agregar validaciones más robustas
- Implementar tests unitarios
- Agregar logs
- Configurar Docker para despliegue

## Licencia

ISC
