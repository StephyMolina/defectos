# Tablero de Métricas ARANDA

Sistema de visualización de métricas para servicios, especialistas y productos del sistema ARANDA.

## 🔧 Configuración Inicial

### 1. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 2. Verificar Conexión a Base de Datos

El archivo `.env` ya está configurado con las credenciales:

```
DB_USER=consultar
DB_PASSWORD=C0nsult4*25
DB_SERVER=srvv-db-aranda
DB_NAME=ARANDABI
PORT=3000
```

### 3. Explorar las Tablas de ARANDABI

Antes de crear las métricas, necesitamos conocer la estructura de la base de datos:

```bash
cd backend
npm run explore
```

Este comando mostrará todas las tablas disponibles en ARANDABI y ayudará a identificar:
- Tablas de especialistas/agentes
- Tablas de productos/servicios
- Tablas de tickets/casos
- Relaciones entre tablas

### 4. Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

### 5. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

### 6. Iniciar el Frontend

```bash
cd frontend
npm start
```

La aplicación estará disponible en: **http://localhost:4200**

## 📊 Características del Dashboard

### Vista Principal
- **Resumen de métricas**: Tarjetas con totales de especialistas, productos, servicios
- **Filtros de fecha**: Seleccionar rango de fechas para análisis
- **Tabs organizados**:
  - 👥 Por Especialista
  - 📦 Por Producto
  - 🎫 Servicios
  - 🗂️ Explorar Tablas

### Explorador de Tablas
- Visualiza todas las tablas de ARANDABI
- Busca tablas por nombre
- Ve la estructura de cada tabla (columnas, tipos de datos)
- Útil para identificar qué datos podemos usar

## 🔍 Próximos Pasos

### Paso 1: Explorar la Base de Datos
1. Ejecutar `npm run explore` en el backend
2. Identificar tablas relevantes como:
   - Tablas de usuarios/agentes/especialistas
   - Tablas de tickets/casos/solicitudes
   - Tablas de productos/categorías
   - Tablas de estado/prioridad
   - Tablas de tiempos/SLA

### Paso 2: Crear Queries Personalizadas
Una vez identificadas las tablas, actualizar los controladores en:
- `backend/src/controllers/metricsController.js`

Ejemplos de métricas comunes:
```sql
-- Tickets por especialista
SELECT
  agente.nombre,
  COUNT(ticket.id) as total_tickets,
  SUM(CASE WHEN ticket.estado = 'Resuelto' THEN 1 ELSE 0 END) as resueltos
FROM tickets ticket
JOIN agentes agente ON ticket.agente_id = agente.id
GROUP BY agente.nombre

-- Servicios por producto
SELECT
  producto.nombre,
  COUNT(servicio.id) as total_servicios,
  AVG(servicio.tiempo_resolucion) as tiempo_promedio
FROM servicios servicio
JOIN productos producto ON servicio.producto_id = producto.id
GROUP BY producto.nombre
```

### Paso 3: Actualizar el Frontend
El componente Dashboard ya está preparado para mostrar los datos.
Solo necesita recibir los datos correctos del backend.

## 🔌 Endpoints API Disponibles

### Métricas
- `GET /api/metrics/dashboard` - Resumen general
- `GET /api/metrics/specialists?startDate=&endDate=` - Métricas por especialista
- `GET /api/metrics/products?startDate=&endDate=` - Métricas por producto
- `GET /api/metrics/services?startDate=&endDate=` - Métricas de servicios

### Exploración
- `GET /api/metrics/tables` - Lista todas las tablas
- `GET /api/metrics/tables/:tableName` - Estructura de una tabla

### Health Check
- `GET /api/health` - Verifica conexión a base de datos

## 📝 Notas Importantes

1. **Permisos de Usuario**: El usuario `consultar` tiene permisos de solo lectura
2. **Seguridad**: Las credenciales están en `.env` (no subir a Git)
3. **Red**: Verificar que tienes acceso al servidor `srvv-db-aranda`
4. **Puerto SQL**: Por defecto SQL Server usa el puerto 1433

## 🐛 Solución de Problemas

### Error de Conexión
```bash
# Verificar conectividad
ping srvv-db-aranda

# Verificar puerto SQL Server
telnet srvv-db-aranda 1433
```

### Error de Autenticación
- Verificar credenciales en `.env`
- Confirmar que el usuario `consultar` tiene acceso a ARANDABI

### CORS Error
- El backend ya tiene CORS habilitado
- Verificar que el frontend apunte a `http://localhost:3000`

## 📚 Estructura de Archivos Clave

```
tablero/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── metricsController.js  ← ACTUALIZAR QUERIES AQUÍ
│   │   ├── routes/
│   │   │   └── metricsRoutes.js
│   │   ├── scripts/
│   │   │   └── exploreTables.js      ← Script de exploración
│   │   └── server.js
│   └── .env                           ← Credenciales
│
└── frontend/
    └── src/
        └── app/
            ├── components/
            │   └── dashboard.component.ts  ← Dashboard principal
            └── services/
                └── metrics.service.ts

```

## 🚀 Flujo de Trabajo Recomendado

1. **Explorar** → `npm run explore`
2. **Identificar tablas** → Ver resultados de exploración
3. **Crear queries** → Actualizar `metricsController.js`
4. **Probar API** → Usar Postman o navegador
5. **Verificar Frontend** → Ver dashboard en http://localhost:4200
6. **Iterar** → Ajustar métricas según necesidades

## 📞 Ayuda Adicional

Si necesitas ayuda para:
- Identificar las tablas correctas
- Crear queries específicas
- Agregar nuevas métricas
- Personalizar visualizaciones

Consulta los datos del explorador de tablas en el dashboard (tab "Explorar Tablas").
