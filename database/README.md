# Base de Datos SQL Server

## Configuración

1. Asegúrate de tener SQL Server instalado y funcionando
2. Ejecuta el script `create_database.sql` para crear la base de datos y las tablas
3. Configura las credenciales en el archivo `.env` del backend

## Scripts disponibles

- `create_database.sql`: Crea la base de datos y las tablas iniciales

## Estructura de la base de datos

### Tabla: users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID único (auto-incremental) |
| nombre | NVARCHAR(100) | Nombre del usuario |
| email | NVARCHAR(100) | Email único del usuario |
| fecha_creacion | DATETIME | Fecha de creación |
| fecha_actualizacion | DATETIME | Fecha de última actualización |

## Comandos útiles

### Conectar a SQL Server (Windows)
```bash
sqlcmd -S localhost -U sa -P tu_password
```

### Ejecutar script
```bash
sqlcmd -S localhost -U sa -P tu_password -i create_database.sql
```
