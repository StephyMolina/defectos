-- Crear base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'tablero_db')
BEGIN
    CREATE DATABASE tablero_db;
END
GO

USE tablero_db;
GO

-- Tabla de usuarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL UNIQUE,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        fecha_actualizacion DATETIME DEFAULT GETDATE()
    );
END
GO

-- Crear índice en email
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_email')
BEGIN
    CREATE INDEX idx_users_email ON users(email);
END
GO

-- Insertar datos de ejemplo
IF NOT EXISTS (SELECT * FROM users)
BEGIN
    INSERT INTO users (nombre, email) VALUES
    ('Juan Pérez', 'juan.perez@example.com'),
    ('María García', 'maria.garcia@example.com'),
    ('Carlos López', 'carlos.lopez@example.com');
END
GO

PRINT 'Base de datos creada exitosamente';
