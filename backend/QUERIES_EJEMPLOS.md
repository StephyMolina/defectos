# Ejemplos de Queries para ARANDA

Este documento contiene ejemplos de queries SQL que puedes usar en los controladores una vez que identifiques las tablas correctas.

## Queries Comunes para Sistemas de Help Desk

### 1. Tickets por Especialista

```sql
-- REEMPLAZA LOS NOMBRES DE TABLA CON LOS REALES
SELECT
    agente.nombre_completo as nombre,
    COUNT(ticket.id) as total_servicios,
    SUM(CASE WHEN ticket.estado = 'Cerrado' OR ticket.estado = 'Resuelto' THEN 1 ELSE 0 END) as resueltos,
    SUM(CASE WHEN ticket.estado = 'Abierto' OR ticket.estado = 'En Proceso' THEN 1 ELSE 0 END) as pendientes,
    AVG(DATEDIFF(HOUR, ticket.fecha_creacion, ticket.fecha_cierre)) as tiempo_promedio
FROM
    tabla_tickets ticket
    INNER JOIN tabla_agentes agente ON ticket.id_agente = agente.id
WHERE
    ticket.fecha_creacion BETWEEN @startDate AND @endDate
GROUP BY
    agente.nombre_completo
ORDER BY
    total_servicios DESC
```

### 2. Servicios por Producto/Categoría

```sql
SELECT
    producto.nombre as producto,
    categoria.nombre as categoria,
    COUNT(ticket.id) as total_servicios,
    SUM(CASE WHEN ticket.estado IN ('Cerrado', 'Resuelto') THEN 1 ELSE 0 END) as cerrados,
    SUM(CASE WHEN ticket.estado NOT IN ('Cerrado', 'Resuelto') THEN 1 ELSE 0 END) as activos,
    AVG(ticket.prioridad) as prioridad_promedio
FROM
    tabla_tickets ticket
    INNER JOIN tabla_productos producto ON ticket.id_producto = producto.id
    LEFT JOIN tabla_categorias categoria ON producto.id_categoria = categoria.id
WHERE
    ticket.fecha_creacion BETWEEN @startDate AND @endDate
GROUP BY
    producto.nombre, categoria.nombre
ORDER BY
    total_servicios DESC
```

### 3. Resumen General del Dashboard

```sql
SELECT
    -- Total de especialistas activos
    (SELECT COUNT(DISTINCT id) FROM tabla_agentes WHERE activo = 1) as total_especialistas,

    -- Total de productos
    (SELECT COUNT(*) FROM tabla_productos WHERE activo = 1) as total_productos,

    -- Total de servicios en el período
    (SELECT COUNT(*) FROM tabla_tickets
     WHERE fecha_creacion BETWEEN @startDate AND @endDate) as total_servicios,

    -- Total de resueltos
    (SELECT COUNT(*) FROM tabla_tickets
     WHERE fecha_creacion BETWEEN @startDate AND @endDate
     AND estado IN ('Cerrado', 'Resuelto')) as total_resueltos,

    -- Tiempo promedio de resolución (en horas)
    (SELECT AVG(DATEDIFF(HOUR, fecha_creacion, fecha_cierre))
     FROM tabla_tickets
     WHERE fecha_creacion BETWEEN @startDate AND @endDate
     AND fecha_cierre IS NOT NULL) as tiempo_promedio_resolucion
```

### 4. Métricas de Servicios por Estado

```sql
SELECT
    estado.nombre as estado,
    COUNT(ticket.id) as cantidad,
    CAST(COUNT(ticket.id) * 100.0 / SUM(COUNT(ticket.id)) OVER() as DECIMAL(5,2)) as porcentaje
FROM
    tabla_tickets ticket
    INNER JOIN tabla_estados estado ON ticket.id_estado = estado.id
WHERE
    ticket.fecha_creacion BETWEEN @startDate AND @endDate
GROUP BY
    estado.nombre
ORDER BY
    cantidad DESC
```

### 5. Top 10 Especialistas Más Productivos

```sql
SELECT TOP 10
    agente.nombre_completo as nombre,
    COUNT(ticket.id) as total_atendidos,
    SUM(CASE WHEN ticket.estado IN ('Cerrado', 'Resuelto') THEN 1 ELSE 0 END) as resueltos,
    CAST(SUM(CASE WHEN ticket.estado IN ('Cerrado', 'Resuelto') THEN 1 ELSE 0 END) * 100.0 / COUNT(ticket.id) as DECIMAL(5,2)) as eficiencia,
    AVG(DATEDIFF(HOUR, ticket.fecha_creacion, ticket.fecha_cierre)) as tiempo_promedio_resolucion
FROM
    tabla_tickets ticket
    INNER JOIN tabla_agentes agente ON ticket.id_agente = agente.id
WHERE
    ticket.fecha_creacion BETWEEN @startDate AND @endDate
GROUP BY
    agente.nombre_completo
HAVING
    COUNT(ticket.id) > 5  -- Solo agentes con más de 5 tickets
ORDER BY
    eficiencia DESC, total_atendidos DESC
```

### 6. Servicios por Prioridad

```sql
SELECT
    prioridad.nombre as prioridad,
    COUNT(ticket.id) as cantidad,
    AVG(DATEDIFF(HOUR, ticket.fecha_creacion, ticket.fecha_cierre)) as tiempo_promedio,
    SUM(CASE WHEN ticket.estado IN ('Cerrado', 'Resuelto') THEN 1 ELSE 0 END) as resueltos,
    SUM(CASE WHEN ticket.estado NOT IN ('Cerrado', 'Resuelto') THEN 1 ELSE 0 END) as pendientes
FROM
    tabla_tickets ticket
    INNER JOIN tabla_prioridades prioridad ON ticket.id_prioridad = prioridad.id
WHERE
    ticket.fecha_creacion BETWEEN @startDate AND @endDate
GROUP BY
    prioridad.nombre
ORDER BY
    CASE prioridad.nombre
        WHEN 'Crítica' THEN 1
        WHEN 'Alta' THEN 2
        WHEN 'Media' THEN 3
        WHEN 'Baja' THEN 4
        ELSE 5
    END
```

### 7. Tendencia por Mes

```sql
SELECT
    YEAR(ticket.fecha_creacion) as anio,
    MONTH(ticket.fecha_creacion) as mes,
    DATENAME(MONTH, ticket.fecha_creacion) as mes_nombre,
    COUNT(ticket.id) as total_tickets,
    SUM(CASE WHEN ticket.estado IN ('Cerrado', 'Resuelto') THEN 1 ELSE 0 END) as resueltos,
    AVG(DATEDIFF(HOUR, ticket.fecha_creacion, ticket.fecha_cierre)) as tiempo_promedio
FROM
    tabla_tickets ticket
WHERE
    ticket.fecha_creacion BETWEEN @startDate AND @endDate
GROUP BY
    YEAR(ticket.fecha_creacion),
    MONTH(ticket.fecha_creacion),
    DATENAME(MONTH, ticket.fecha_creacion)
ORDER BY
    anio, mes
```

### 8. SLA - Tickets Fuera de Tiempo

```sql
SELECT
    COUNT(CASE WHEN DATEDIFF(HOUR, fecha_creacion, ISNULL(fecha_cierre, GETDATE())) > sla_horas THEN 1 END) as fuera_sla,
    COUNT(CASE WHEN DATEDIFF(HOUR, fecha_creacion, ISNULL(fecha_cierre, GETDATE())) <= sla_horas THEN 1 END) as dentro_sla,
    CAST(COUNT(CASE WHEN DATEDIFF(HOUR, fecha_creacion, ISNULL(fecha_cierre, GETDATE())) <= sla_horas THEN 1 END) * 100.0 / COUNT(*) as DECIMAL(5,2)) as cumplimiento_sla
FROM
    tabla_tickets
WHERE
    fecha_creacion BETWEEN @startDate AND @endDate
    AND sla_horas IS NOT NULL
```

## Cómo Usar Estos Ejemplos

1. **Identifica las tablas reales** usando `npm run explore`
2. **Reemplaza los nombres de tabla** (`tabla_tickets`, `tabla_agentes`, etc.) con los nombres reales
3. **Ajusta los nombres de columnas** según la estructura de tu base de datos
4. **Copia la query** en el controlador correspondiente en `metricsController.js`

## Ejemplo de Implementación

```javascript
// backend/src/controllers/metricsController.js

const getMetricsBySpecialist = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const pool = await getConnection();

    const result = await pool.request()
      .input('startDate', sql.DateTime, startDate)
      .input('endDate', sql.DateTime, endDate)
      .query(`
        SELECT
            agente.nombre_completo as nombre,
            COUNT(ticket.id) as total_servicios,
            SUM(CASE WHEN ticket.estado = 'Cerrado' THEN 1 ELSE 0 END) as resueltos,
            SUM(CASE WHEN ticket.estado = 'Abierto' THEN 1 ELSE 0 END) as pendientes
        FROM
            TBL_TICKETS ticket
            INNER JOIN TBL_AGENTES agente ON ticket.agente_id = agente.id
        WHERE
            ticket.fecha_creacion BETWEEN @startDate AND @endDate
        GROUP BY
            agente.nombre_completo
        ORDER BY
            total_servicios DESC
      `);

    res.json({
      success: true,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener métricas',
      error: error.message
    });
  }
};
```

## Tablas Comunes en Aranda Service Management

Basado en la estructura típica de Aranda, busca tablas como:

- `AREQUEST` o `CA_REQUEST` - Solicitudes/Tickets
- `CA_CONTACT` o `AUSER` - Usuarios/Agentes
- `CA_CATEGORY` - Categorías
- `CA_STATUS` - Estados
- `CA_PRIORITY` - Prioridades
- `AITEM` o `CA_ASSET` - Activos/Productos
- `CA_ASSIGNMENT` - Asignaciones

**Nota:** Los nombres exactos pueden variar según la versión de Aranda.
