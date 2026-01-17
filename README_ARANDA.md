# 📊 Tablero de Métricas ARANDA

Dashboard web para visualización de métricas de servicios, especialistas y productos del sistema ARANDA.

## 🚀 Inicio Rápido (Windows)

### Opción 1: Script Automático
```bash
# Doble clic en:
start.bat
```

### Opción 2: Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

Abre tu navegador en: **http://localhost:4200**

## 🔍 Explorar Base de Datos

Antes de usar el dashboard, explora las tablas disponibles:

```bash
# Opción 1: Script
explorar-db.bat

# Opción 2: Manual
cd backend
npm run explore
```

Esto te mostrará todas las tablas de ARANDABI para que puedas identificar cuáles usar.

## 📋 Configuración

### Credenciales (Ya configuradas)

El archivo [backend/.env](backend/.env) ya contiene:
```
DB_SERVER=srvv-db-aranda
DB_NAME=ARANDABI
DB_USER=consultar
DB_PASSWORD=C0nsult4*25
PORT=3000
```

## 🎯 Características

### Dashboard Principal
- ✅ Resumen de métricas en tiempo real
- ✅ Filtros por rango de fechas
- ✅ Visualización por especialista
- ✅ Visualización por producto
- ✅ Métricas de servicios

### Explorador de Tablas
- 🗂️ Lista completa de tablas ARANDABI
- 🔍 Búsqueda de tablas
- 📋 Vista de estructura (columnas, tipos)

## 📡 API Endpoints

### Métricas
```
GET /api/metrics/dashboard
GET /api/metrics/specialists?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET /api/metrics/products?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
GET /api/metrics/services?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

### Exploración
```
GET /api/metrics/tables
GET /api/metrics/tables/:tableName
```

### Health
```
GET /api/health
```

## 🛠️ Próximos Pasos

### 1. Explorar la Base de Datos
```bash
npm run explore
```

Busca tablas relacionadas con:
- Tickets/Casos/Solicitudes
- Agentes/Especialistas/Usuarios
- Productos/Categorías/Servicios
- Estados/Prioridades
- Tiempos/SLAs

### 2. Actualizar Queries

Edita [backend/src/controllers/metricsController.js](backend/src/controllers/metricsController.js) con las tablas reales.

Ejemplo:
```javascript
// Reemplaza los placeholders con queries reales
const result = await pool.request().query(`
  SELECT
    a.nombre_agente as nombre,
    COUNT(t.id_ticket) as total,
    SUM(CASE WHEN t.estado = 'Cerrado' THEN 1 ELSE 0 END) as resueltos
  FROM tabla_tickets t
  JOIN tabla_agentes a ON t.id_agente = a.id_agente
  WHERE t.fecha BETWEEN @startDate AND @endDate
  GROUP BY a.nombre_agente
`);
```

### 3. Probar en el Dashboard

Visita http://localhost:4200 y verifica que los datos se muestren correctamente.

## 📁 Estructura del Proyecto

```
tablero/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js           # Conexión a SQL Server
│   │   ├── controllers/
│   │   │   └── metricsController.js  # ⭐ EDITAR AQUÍ
│   │   ├── routes/
│   │   │   └── metricsRoutes.js
│   │   ├── scripts/
│   │   │   └── exploreTables.js      # Script explorador
│   │   └── server.js
│   ├── .env                          # Credenciales
│   └── package.json
│
├── frontend/
│   └── src/
│       └── app/
│           ├── components/
│           │   └── dashboard.component.ts  # Dashboard UI
│           ├── services/
│           │   └── metrics.service.ts
│           └── models/
│               └── metrics.model.ts
│
├── start.bat                         # Inicio rápido
├── explorar-db.bat                   # Explorador DB
└── INSTRUCCIONES_ARANDA.md          # Guía detallada
```

## 🐛 Solución de Problemas

### No se puede conectar a la base de datos

1. Verifica conectividad:
```bash
ping srvv-db-aranda
```

2. Verifica que el servidor SQL Server esté accesible:
```bash
telnet srvv-db-aranda 1433
```

3. Confirma credenciales en `backend/.env`

### Error "Cannot find module"

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Puerto ocupado

Cambia el puerto en `backend/.env`:
```
PORT=3001
```

Y actualiza en `frontend/src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:3001/api'
```

## 📚 Recursos

- [INSTRUCCIONES_ARANDA.md](INSTRUCCIONES_ARANDA.md) - Guía completa
- [backend/src/controllers/metricsController.js](backend/src/controllers/metricsController.js) - Controladores de métricas
- API Health Check: http://localhost:3000/api/health
- API Tables: http://localhost:3000/api/metrics/tables

## 🎨 Personalización

### Agregar Nueva Métrica

1. **Backend** - Agregar en `metricsController.js`:
```javascript
const getNewMetric = async (req, res) => {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT * FROM tu_tabla
  `);
  res.json({ success: true, data: result.recordset });
};
```

2. **Routes** - Agregar en `metricsRoutes.js`:
```javascript
router.get('/new-metric', metricsController.getNewMetric);
```

3. **Frontend** - Agregar en `metrics.service.ts`:
```typescript
getNewMetric(): Observable<any> {
  return this.http.get(`${this.apiUrl}/new-metric`);
}
```

4. **Dashboard** - Usar en `dashboard.component.ts`

## 📞 Soporte

Para más información, consulta:
- Documentación completa: [INSTRUCCIONES_ARANDA.md](INSTRUCCIONES_ARANDA.md)
- Explorador de tablas en el dashboard (tab "Explorar Tablas")
