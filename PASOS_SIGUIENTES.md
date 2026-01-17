# 🎯 Pasos Siguientes - Guía Rápida

Este documento te guía paso a paso para poner en marcha tu tablero de métricas ARANDA.

## ⚡ Inicio Rápido (3 pasos)

### 1️⃣ Probar Conexión a la Base de Datos

**Doble clic en:** `test-conexion.bat`

O desde la terminal:
```bash
cd backend
npm install
npm run test-connection
```

**¿Qué deberías ver?**
```
✅ CONEXIÓN EXITOSA!
Base de datos actual: ARANDABI
Usuario conectado: consultar
Total de tablas: [número]
```

**¿Problemas?**
- ❌ Si no conecta, verifica VPN o acceso de red
- ❌ Verifica credenciales en `backend/.env`

### 2️⃣ Explorar las Tablas

**Doble clic en:** `explorar-db.bat`

O desde la terminal:
```bash
cd backend
npm run explore
```

**Busca tablas con nombres como:**
- `*REQUEST*` o `*TICKET*` → Solicitudes/Casos
- `*CONTACT*` o `*USER*` o `*AGENT*` → Agentes/Especialistas
- `*CATEGORY*` o `*PRODUCT*` → Productos/Categorías
- `*STATUS*` → Estados
- `*PRIORITY*` → Prioridades

**Anota los nombres de las tablas importantes!** 📝

### 3️⃣ Iniciar el Sistema

**Doble clic en:** `start.bat`

Esto abrirá 2 ventanas:
- **Backend** → http://localhost:3000
- **Frontend** → http://localhost:4200

**Abre tu navegador en:** http://localhost:4200

---

## 📊 Usando el Dashboard

### Tab "Explorar Tablas"
1. Entra al tab "🗂️ Explorar Tablas"
2. Busca las tablas que identificaste
3. Haz clic en cada tabla para ver su estructura
4. Anota las columnas importantes:
   - IDs
   - Nombres
   - Fechas
   - Estados
   - Relaciones (FK)

### Tab "Por Especialista"
Aquí verás las métricas de cada agente. Actualmente muestra datos de ejemplo.

### Tab "Por Producto"
Métricas agrupadas por producto/servicio.

### Tab "Servicios"
Vista general de todos los servicios.

---

## 🔧 Personalizar con Datos Reales

Una vez que tengas los nombres de las tablas, sigue estos pasos:

### Paso 1: Abrir el Controlador

Abre: `backend/src/controllers/metricsController.js`

### Paso 2: Actualizar Query de Especialistas

Busca la función `getMetricsBySpecialist` y reemplaza el query placeholder:

```javascript
const getMetricsBySpecialist = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const pool = await getConnection();

    const result = await pool.request()
      .input('startDate', sql.DateTime, startDate)
      .input('endDate', sql.DateTime, endDate)
      .query(`
        -- REEMPLAZA ESTO CON TU QUERY REAL
        SELECT
            agente.NOMBRE_COLUMNA as nombre,
            COUNT(ticket.ID_COLUMNA) as total_servicios,
            SUM(CASE WHEN ticket.ESTADO = 'Cerrado' THEN 1 ELSE 0 END) as resueltos,
            SUM(CASE WHEN ticket.ESTADO != 'Cerrado' THEN 1 ELSE 0 END) as pendientes
        FROM
            TU_TABLA_TICKETS ticket
            INNER JOIN TU_TABLA_AGENTES agente ON ticket.ID_AGENTE = agente.ID
        WHERE
            ticket.FECHA_CREACION BETWEEN @startDate AND @endDate
        GROUP BY
            agente.NOMBRE_COLUMNA
        ORDER BY
            total_servicios DESC
      `);

    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener métricas por especialista:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener métricas por especialista',
      error: error.message
    });
  }
};
```

### Paso 3: Probar el Endpoint

Abre en tu navegador:
```
http://localhost:3000/api/metrics/specialists?startDate=2024-01-01&endDate=2024-12-31
```

Deberías ver JSON con los datos.

### Paso 4: Ver en el Dashboard

Ve a http://localhost:4200 y selecciona el tab "👥 Por Especialista"

### Paso 5: Repetir para Otros Tabs

Actualiza las funciones:
- `getMetricsByProduct` → Métricas por producto
- `getServiceMetrics` → Métricas de servicios
- `getDashboardSummary` → Resumen general

---

## 📚 Recursos de Ayuda

### Ejemplos de Queries SQL
Abre: `backend/QUERIES_EJEMPLOS.md`

Contiene queries de ejemplo para:
- Tickets por especialista
- Servicios por producto
- Métricas por estado
- Top 10 especialistas
- Y más...

### Documentación Completa
- [README_ARANDA.md](README_ARANDA.md) - Guía principal
- [INSTRUCCIONES_ARANDA.md](INSTRUCCIONES_ARANDA.md) - Instrucciones detalladas
- [RESUMEN_PROYECTO.md](RESUMEN_PROYECTO.md) - Resumen del proyecto

---

## 🎨 Personalizar la Interfaz

### Cambiar Colores
Edita: `frontend/src/app/components/dashboard.component.ts`

Busca la sección `styles` y modifica los colores.

### Cambiar Textos
En el mismo archivo, busca la sección `template` y modifica:
- Títulos
- Labels
- Textos de ayuda

### Agregar Nuevas Métricas
1. Crea nueva función en `backend/src/controllers/metricsController.js`
2. Agrega ruta en `backend/src/routes/metricsRoutes.js`
3. Agrega método en `frontend/src/app/services/metrics.service.ts`
4. Usa en el componente del dashboard

---

## ✅ Checklist de Implementación

### Fase 1: Configuración Inicial
- [ ] Probar conexión (`test-conexion.bat`)
- [ ] Explorar tablas (`explorar-db.bat`)
- [ ] Identificar tablas principales
- [ ] Anotar columnas importantes

### Fase 2: Backend
- [ ] Actualizar query de especialistas
- [ ] Probar endpoint en navegador
- [ ] Actualizar query de productos
- [ ] Probar endpoint
- [ ] Actualizar query de servicios
- [ ] Probar endpoint
- [ ] Actualizar resumen dashboard
- [ ] Probar endpoint

### Fase 3: Frontend
- [ ] Iniciar frontend (`npm start`)
- [ ] Verificar tab "Explorar Tablas"
- [ ] Verificar tab "Por Especialista"
- [ ] Verificar tab "Por Producto"
- [ ] Verificar tab "Servicios"
- [ ] Ajustar filtros de fecha
- [ ] Personalizar textos/colores si es necesario

### Fase 4: Pruebas
- [ ] Probar con diferentes rangos de fecha
- [ ] Verificar que los números sean correctos
- [ ] Probar en diferentes navegadores
- [ ] Verificar performance

### Fase 5: Documentación
- [ ] Documentar tablas usadas
- [ ] Documentar columnas importantes
- [ ] Crear guía de usuario
- [ ] Documentar queries personalizados

---

## 🚨 Solución de Problemas Comunes

### "Cannot connect to database"
```bash
# Verifica conectividad
ping srvv-db-aranda

# Verifica VPN si es necesario
# Verifica credenciales en backend/.env
```

### "Module not found"
```bash
cd backend
npm install

cd ../frontend
npm install
```

### "Port 3000 already in use"
Cambia el puerto en `backend/.env`:
```
PORT=3001
```

Y en `frontend/src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:3001/api'
```

### Los datos no se muestran
1. Abre la consola del navegador (F12)
2. Ve a la tab "Network"
3. Actualiza la página
4. Verifica que las llamadas API retornen datos
5. Si retornan error, revisa los queries en el backend

---

## 💡 Tips Finales

1. **Empieza simple**: Primero haz funcionar una sola métrica
2. **Usa el explorador**: El tab "Explorar Tablas" es tu mejor amigo
3. **Prueba en el navegador**: Abre los endpoints directamente
4. **Revisa la consola**: La consola del navegador te dirá qué falla
5. **Itera**: No necesitas todo perfecto el primer día

---

## 🎯 Objetivo Final

Un dashboard funcional que muestre:
- ✅ Métricas reales de ARANDABI
- ✅ Rendimiento de especialistas
- ✅ Estado de productos/servicios
- ✅ Filtros por fecha
- ✅ Visualización clara y útil

---

**¿Listo para empezar? Ejecuta `test-conexion.bat` y sigue los pasos!** 🚀
