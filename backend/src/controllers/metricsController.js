const { getConnection, sql } = require('../config/database');

// Obtener resumen general de métricas
const getDashboardSummary = async (req, res) => {
  try {
    const pool = await getConnection();
    const { startDate, endDate, grupo, tipoCaso } = req.query;

    let whereClause = 'WHERE FECHA_REGISTRO BETWEEN @startDate AND @endDate';
    if (grupo && grupo !== 'todos') {
      whereClause += ' AND GRUPO_ESPECIALISTA = @grupo';
    }
    if (tipoCaso && tipoCaso !== 'todos') {
      whereClause += ' AND TIPO_DE_CASO = @tipoCaso';
    }

    const request = pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31');

    if (grupo && grupo !== 'todos') {
      request.input('grupo', sql.NVarChar, grupo);
    }
    if (tipoCaso && tipoCaso !== 'todos') {
      request.input('tipoCaso', sql.NVarChar, tipoCaso);
    }

    const result = await request.query(`
        SELECT
          -- Total de especialistas únicos
          (SELECT COUNT(DISTINCT ESPECIALISTA)
           FROM dbo.Casos
           ${whereClause}
           AND ESPECIALISTA IS NOT NULL) as totalEspecialistas,

          -- Total de servicios únicos
          (SELECT COUNT(DISTINCT SERVICIO)
           FROM dbo.Casos
           ${whereClause}
           AND SERVICIO IS NOT NULL) as totalServicios,

          -- Total de casos
          (SELECT COUNT(*)
           FROM dbo.Casos
           ${whereClause}) as totalCasos,

          -- Total de casos cerrados
          (SELECT COUNT(*)
           FROM dbo.Casos
           ${whereClause}
           AND ESTADO = 'Cierre') as totalResueltos,

          -- Porcentaje de resolución
          (SELECT
            CAST(COUNT(CASE WHEN ESTADO = 'Cierre' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0) as DECIMAL(5,2))
           FROM dbo.Casos
           ${whereClause}) as porcentajeResolucion
      `);

    res.json({
      success: true,
      data: result.recordset[0],
      period: {
        startDate: startDate || '2023-01-01',
        endDate: endDate || '2026-12-31'
      },
      filters: {
        grupo: grupo || 'todos',
        tipoCaso: tipoCaso || 'todos'
      }
    });
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen del dashboard',
      error: error.message
    });
  }
};

// Obtener métricas por especialista
const getMetricsBySpecialist = async (req, res) => {
  try {
    const pool = await getConnection();
    const { startDate, endDate, grupo, categoria, servicio, tipoCaso } = req.query;

    let query = `
      SELECT
        ESPECIALISTA as nombre,
        GRUPO_ESPECIALISTA as grupo,
        COUNT(*) as total_servicios,
        SUM(CASE WHEN ESTADO = 'Cierre' THEN 1 ELSE 0 END) as resueltos,
        SUM(CASE WHEN ESTADO != 'Cierre' THEN 1 ELSE 0 END) as pendientes,
        CAST(SUM(CASE WHEN ESTADO = 'Cierre' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0) as DECIMAL(5,2)) as eficiencia,
        AVG(CAST(TIEMPO_DE_SOLUCION_REAL as FLOAT)) as tiempo_promedio
      FROM
        dbo.Casos
      WHERE
        FECHA_REGISTRO BETWEEN @startDate AND @endDate
        AND ESPECIALISTA IS NOT NULL
    `;

    const request = pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31');

    // Agregar filtro por grupo si existe
    if (grupo && grupo !== 'todos') {
      query += ' AND GRUPO_ESPECIALISTA = @grupo';
      request.input('grupo', sql.NVarChar, grupo);
    }

    // Agregar filtro por categoría si existe
    if (categoria && categoria !== 'todos') {
      query += ' AND CATEGORIA = @categoria';
      request.input('categoria', sql.NVarChar, categoria);
    }

    // Agregar filtro por servicio si existe
    if (servicio && servicio !== 'todos') {
      query += ' AND SERVICIO = @servicio';
      request.input('servicio', sql.NVarChar, servicio);
    }

    // Agregar filtro por tipo de caso si existe
    if (tipoCaso && tipoCaso !== 'todos') {
      query += ' AND TIPO_DE_CASO = @tipoCaso';
      request.input('tipoCaso', sql.NVarChar, tipoCaso);
    }

    query += `
      GROUP BY
        ESPECIALISTA, GRUPO_ESPECIALISTA
      ORDER BY
        total_servicios DESC
    `;

    const result = await request.query(query);

    res.json({
      success: true,
      count: result.recordset.length,
      filters: {
        grupo: grupo || 'todos',
        categoria: categoria || 'todos',
        servicio: servicio || 'todos',
        tipoCaso: tipoCaso || 'todos'
      },
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

// Obtener métricas por producto/servicio
const getMetricsByProduct = async (req, res) => {
  try {
    const pool = await getConnection();
    const { startDate, endDate, grupo, categoria, tipoCaso } = req.query;

    let whereClause = 'WHERE FECHA_REGISTRO BETWEEN @startDate AND @endDate AND SERVICIO IS NOT NULL';

    const request = pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31');

    if (grupo && grupo !== 'todos') {
      whereClause += ' AND GRUPO_ESPECIALISTA = @grupo';
      request.input('grupo', sql.NVarChar, grupo);
    }

    if (categoria && categoria !== 'todos') {
      whereClause += ' AND CATEGORIA = @categoria';
      request.input('categoria', sql.NVarChar, categoria);
    }

    if (tipoCaso && tipoCaso !== 'todos') {
      whereClause += ' AND TIPO_DE_CASO = @tipoCaso';
      request.input('tipoCaso', sql.NVarChar, tipoCaso);
    }

    const result = await request.query(`
        SELECT
          SERVICIO as producto,
          CATEGORIA as categoria,
          COUNT(*) as total_servicios,
          SUM(CASE WHEN ESTADO = 'Cierre' THEN 1 ELSE 0 END) as cerrados,
          SUM(CASE WHEN ESTADO != 'Cierre' THEN 1 ELSE 0 END) as activos,
          MAX(PRIORIDAD) as prioridad,
          AVG(CAST(TIEMPO_DE_SOLUCION_REAL as FLOAT)) as tiempo_promedio
        FROM
          dbo.Casos
        ${whereClause}
        GROUP BY
          SERVICIO, CATEGORIA
        ORDER BY
          total_servicios DESC
      `);

    res.json({
      success: true,
      count: result.recordset.length,
      filters: {
        grupo: grupo || 'todos',
        categoria: categoria || 'todos',
        tipoCaso: tipoCaso || 'todos'
      },
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener métricas por producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener métricas por producto',
      error: error.message
    });
  }
};

// Obtener métricas de servicios por estado y prioridad
const getServiceMetrics = async (req, res) => {
  try {
    const pool = await getConnection();
    const { startDate, endDate } = req.query;

    // Métricas por estado
    const estadoResult = await pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31')
      .query(`
        SELECT
          ESTADO as estado,
          COUNT(*) as cantidad,
          CAST(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as DECIMAL(5,2)) as porcentaje
        FROM
          dbo.Casos
        WHERE
          FECHA_REGISTRO BETWEEN @startDate AND @endDate
        GROUP BY
          ESTADO
        ORDER BY
          cantidad DESC
      `);

    // Métricas por prioridad
    const prioridadResult = await pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31')
      .query(`
        SELECT
          PRIORIDAD as prioridad,
          COUNT(*) as cantidad,
          AVG(CAST(TIEMPO_DE_SOLUCION_REAL as FLOAT)) as tiempo_promedio,
          SUM(CASE WHEN ESTADO = 'Cierre' THEN 1 ELSE 0 END) as resueltos,
          SUM(CASE WHEN ESTADO != 'Cierre' THEN 1 ELSE 0 END) as pendientes
        FROM
          dbo.Casos
        WHERE
          FECHA_REGISTRO BETWEEN @startDate AND @endDate
          AND PRIORIDAD IS NOT NULL
        GROUP BY
          PRIORIDAD
        ORDER BY
          CASE PRIORIDAD
            WHEN 'Alto' THEN 1
            WHEN 'Medio' THEN 2
            WHEN 'Bajo' THEN 3
            ELSE 4
          END
      `);

    // Métricas por tipo de caso
    const tipoResult = await pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31')
      .query(`
        SELECT
          TIPO_DE_CASO as tipo,
          COUNT(*) as cantidad,
          CAST(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as DECIMAL(5,2)) as porcentaje
        FROM
          dbo.Casos
        WHERE
          FECHA_REGISTRO BETWEEN @startDate AND @endDate
          AND TIPO_DE_CASO IS NOT NULL
        GROUP BY
          TIPO_DE_CASO
        ORDER BY
          cantidad DESC
      `);

    res.json({
      success: true,
      data: {
        porEstado: estadoResult.recordset,
        porPrioridad: prioridadResult.recordset,
        porTipo: tipoResult.recordset
      }
    });
  } catch (error) {
    console.error('Error al obtener métricas de servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener métricas de servicios',
      error: error.message
    });
  }
};

// Obtener tablas disponibles en la base de datos
const getAvailableTables = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT
        TABLE_SCHEMA,
        TABLE_NAME,
        TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_SCHEMA, TABLE_NAME
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener tablas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tablas disponibles',
      error: error.message
    });
  }
};

// Obtener estructura de una tabla específica
const getTableStructure = async (req, res) => {
  try {
    const { tableName } = req.params;
    const pool = await getConnection();

    const result = await pool.request()
      .input('tableName', sql.NVarChar, tableName)
      .query(`
        SELECT
          COLUMN_NAME,
          DATA_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          IS_NULLABLE,
          COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @tableName
        ORDER BY ORDINAL_POSITION
      `);

    res.json({
      success: true,
      table: tableName,
      columns: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener estructura de tabla:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estructura de tabla',
      error: error.message
    });
  }
};

// Obtener filtros disponibles (categorías, grupos, etc.)
const getFilters = async (req, res) => {
  try {
    const pool = await getConnection();
    const { grupo, categoria } = req.query;

    // Obtener grupos de especialistas únicos
    const grupos = await pool.request().query(`
      SELECT DISTINCT GRUPO_ESPECIALISTA
      FROM dbo.Casos
      WHERE GRUPO_ESPECIALISTA IS NOT NULL
      ORDER BY GRUPO_ESPECIALISTA
    `);

    // Obtener categorías filtradas por grupo si se proporciona
    let categoriasQuery = `
      SELECT DISTINCT CATEGORIA
      FROM dbo.Casos
      WHERE CATEGORIA IS NOT NULL
    `;

    const categoriasRequest = pool.request();
    if (grupo && grupo !== 'todos') {
      categoriasQuery += ' AND GRUPO_ESPECIALISTA = @grupo';
      categoriasRequest.input('grupo', sql.NVarChar, grupo);
    }
    categoriasQuery += ' ORDER BY CATEGORIA';

    const categorias = await categoriasRequest.query(categoriasQuery);

    // Obtener servicios filtrados por grupo y categoría si se proporcionan
    let serviciosQuery = `
      SELECT DISTINCT SERVICIO
      FROM dbo.Casos
      WHERE SERVICIO IS NOT NULL
    `;

    const serviciosRequest = pool.request();
    if (grupo && grupo !== 'todos') {
      serviciosQuery += ' AND GRUPO_ESPECIALISTA = @grupo';
      serviciosRequest.input('grupo', sql.NVarChar, grupo);
    }
    if (categoria && categoria !== 'todos') {
      serviciosQuery += ' AND CATEGORIA = @categoria';
      serviciosRequest.input('categoria', sql.NVarChar, categoria);
    }
    serviciosQuery += ' ORDER BY SERVICIO';

    const servicios = await serviciosRequest.query(serviciosQuery);

    // Obtener estados únicos
    const estados = await pool.request().query(`
      SELECT DISTINCT ESTADO
      FROM dbo.Casos
      WHERE ESTADO IS NOT NULL
      ORDER BY ESTADO
    `);

    // Obtener prioridades únicas
    const prioridades = await pool.request().query(`
      SELECT DISTINCT PRIORIDAD
      FROM dbo.Casos
      WHERE PRIORIDAD IS NOT NULL
      ORDER BY PRIORIDAD
    `);

    // Obtener tipos de caso únicos
    const tiposCaso = await pool.request().query(`
      SELECT DISTINCT TIPO_DE_CASO
      FROM dbo.Casos
      WHERE TIPO_DE_CASO IS NOT NULL
      ORDER BY TIPO_DE_CASO
    `);

    res.json({
      success: true,
      data: {
        categorias: categorias.recordset.map(r => r.CATEGORIA),
        grupos: grupos.recordset.map(r => r.GRUPO_ESPECIALISTA),
        estados: estados.recordset.map(r => r.ESTADO),
        prioridades: prioridades.recordset.map(r => r.PRIORIDAD),
        servicios: servicios.recordset.map(r => r.SERVICIO),
        tiposCaso: tiposCaso.recordset.map(r => r.TIPO_DE_CASO)
      }
    });
  } catch (error) {
    console.error('Error al obtener filtros:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener filtros disponibles',
      error: error.message
    });
  }
};

// Obtener información gerencial de evolución de casos por sprint
const getSprintEvolution = async (req, res) => {
  try {
    const pool = await getConnection();
    const { grupo, tipoCaso, sprintId } = req.query;

    // Get sprint dates if sprintId is provided
    let sprintDates = null;
    if (sprintId) {
      const sprintController = require('./sprintController');
      const sprint = await sprintController.getSprintByIdInternal(parseInt(sprintId));
      if (sprint) {
        sprintDates = {
          startDate: sprint.fechaInicio,
          endDate: sprint.fechaFin
        };
      }
    }

    let whereClause = 'WHERE 1=1';
    const request = pool.request();

    if (grupo && grupo !== 'todos') {
      whereClause += ' AND GRUPO_ESPECIALISTA = @grupo';
      request.input('grupo', sql.NVarChar, grupo);
    }

    if (tipoCaso && tipoCaso !== 'todos') {
      whereClause += ' AND TIPO_DE_CASO = @tipoCaso';
      request.input('tipoCaso', sql.NVarChar, tipoCaso);
    }

    // Add sprint date filter if provided
    if (sprintDates) {
      whereClause += ' AND FECHA_REGISTRO BETWEEN @sprintStart AND @sprintEnd';
      request.input('sprintStart', sql.DateTime, sprintDates.startDate);
      request.input('sprintEnd', sql.DateTime, sprintDates.endDate);
    } else {
      whereClause += ' AND FECHA_REGISTRO >= DATEADD(MONTH, -12, GETDATE())';
    }

    const result = await request.query(`
      SELECT
        FORMAT(FECHA_REGISTRO, 'yyyy-MM') as periodo,
        ESTADO,
        TIPO_DE_CASO,
        COUNT(*) as cantidad,
        SUM(CASE WHEN ESTADO = 'Cierre' THEN 1 ELSE 0 END) as cerrados,
        SUM(CASE WHEN ESTADO != 'Cierre' THEN 1 ELSE 0 END) as abiertos,
        AVG(CAST(TIEMPO_DE_SOLUCION_REAL as FLOAT)) as tiempo_promedio
      FROM dbo.Casos
      ${whereClause}
      GROUP BY
        FORMAT(FECHA_REGISTRO, 'yyyy-MM'),
        ESTADO,
        TIPO_DE_CASO
      ORDER BY
        periodo DESC,
        cantidad DESC
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      filters: {
        grupo: grupo || 'todos',
        tipoCaso: tipoCaso || 'todos',
        sprintId: sprintId || 'todos'
      },
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener evolución de sprints:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener evolución de sprints',
      error: error.message
    });
  }
};

// Obtener comparativo de Incidentes vs Requerimientos por Sprint
const getSprintComparative = async (req, res) => {
  try {
    const pool = await getConnection();
    const { grupo } = req.query;

    // Get all sprints
    const sprintController = require('./sprintController');
    const sprints = await sprintController.getAllSprintsInternal();

    // Build comparative data for each sprint
    const comparativeData = [];

    for (const sprint of sprints) {
      let whereClause = 'WHERE FECHA_REGISTRO BETWEEN @sprintStart AND @sprintEnd';
      const request = pool.request()
        .input('sprintStart', sql.DateTime, sprint.fechaInicio)
        .input('sprintEnd', sql.DateTime, sprint.fechaFin);

      if (grupo && grupo !== 'todos') {
        whereClause += ' AND GRUPO_ESPECIALISTA = @grupo';
        request.input('grupo', sql.NVarChar, grupo);
      }

      const result = await request.query(`
        SELECT
          SUM(CASE WHEN TIPO_DE_CASO = 'Incidente' THEN 1 ELSE 0 END) as incidentes,
          SUM(CASE WHEN TIPO_DE_CASO = 'Requerimiento' THEN 1 ELSE 0 END) as requerimientos,
          COUNT(*) as total_casos
        FROM dbo.Casos
        ${whereClause}
      `);

      if (result.recordset.length > 0) {
        const data = result.recordset[0];
        const totalCasos = data.total_casos || 0;
        const incidentes = data.incidentes || 0;
        const requerimientos = data.requerimientos || 0;

        comparativeData.push({
          sprint_id: sprint.id,
          sprint_nombre: sprint.nombre,
          periodo: `${sprint.fechaInicio} - ${sprint.fechaFin}`,
          incidentes: incidentes,
          requerimientos: requerimientos,
          total_casos: totalCasos,
          porcentaje_incidentes: totalCasos > 0 ? ((incidentes / totalCasos) * 100).toFixed(1) : '0.0',
          porcentaje_requerimientos: totalCasos > 0 ? ((requerimientos / totalCasos) * 100).toFixed(1) : '0.0'
        });
      }
    }

    res.json({
      success: true,
      count: comparativeData.length,
      filters: {
        grupo: grupo || 'todos'
      },
      data: comparativeData
    });
  } catch (error) {
    console.error('Error al obtener comparativo de sprints:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comparativo de sprints',
      error: error.message
    });
  }
};

// Obtener casos no cerrados (pendientes/abiertos) con detalles
const getOpenCases = async (req, res) => {
  try {
    const pool = await getConnection();
    const { startDate, endDate, grupo, categoria, servicio, tipoCaso } = req.query;

    let whereClause = 'WHERE FECHA_REGISTRO BETWEEN @startDate AND @endDate AND ESTADO != \'Cierre\' AND ESPECIALISTA IS NOT NULL';

    const request = pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31');

    if (grupo && grupo !== 'todos') {
      whereClause += ' AND GRUPO_ESPECIALISTA = @grupo';
      request.input('grupo', sql.NVarChar, grupo);
    }

    if (categoria && categoria !== 'todos') {
      whereClause += ' AND CATEGORIA = @categoria';
      request.input('categoria', sql.NVarChar, categoria);
    }

    if (servicio && servicio !== 'todos') {
      whereClause += ' AND SERVICIO = @servicio';
      request.input('servicio', sql.NVarChar, servicio);
    }

    if (tipoCaso && tipoCaso !== 'todos') {
      whereClause += ' AND TIPO_DE_CASO = @tipoCaso';
      request.input('tipoCaso', sql.NVarChar, tipoCaso);
    }

    const result = await request.query(`
      SELECT
        NUMERO_DEL_CASO as numero_caso,
        ESPECIALISTA,
        GRUPO_ESPECIALISTA as grupo,
        CATEGORIA,
        SERVICIO,
        ESTADO,
        TIPO_DE_CASO,
        PRIORIDAD,
        FECHA_REGISTRO,
        FECHA_ATENCION,
        DATEDIFF(DAY, FECHA_REGISTRO, GETDATE()) as dias_abierto,
        TIEMPO_DEL_CASO
      FROM dbo.Casos
      ${whereClause}
      ORDER BY FECHA_REGISTRO DESC
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      filters: {
        grupo: grupo || 'todos',
        categoria: categoria || 'todos',
        servicio: servicio || 'todos',
        tipoCaso: tipoCaso || 'todos'
      },
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener casos abiertos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener casos abiertos',
      error: error.message
    });
  }
};

// Obtener casos cerrados con detalles
const getClosedCases = async (req, res) => {
  try {
    const pool = await getConnection();
    const { startDate, endDate, grupo, categoria, servicio, tipoCaso } = req.query;

    let whereClause = 'WHERE FECHA_REGISTRO BETWEEN @startDate AND @endDate AND ESTADO = \'Cierre\' AND ESPECIALISTA IS NOT NULL';

    const request = pool.request()
      .input('startDate', sql.DateTime, startDate || '2023-01-01')
      .input('endDate', sql.DateTime, endDate || '2026-12-31');

    if (grupo && grupo !== 'todos') {
      whereClause += ' AND GRUPO_ESPECIALISTA = @grupo';
      request.input('grupo', sql.NVarChar, grupo);
    }

    if (categoria && categoria !== 'todos') {
      whereClause += ' AND CATEGORIA = @categoria';
      request.input('categoria', sql.NVarChar, categoria);
    }

    if (servicio && servicio !== 'todos') {
      whereClause += ' AND SERVICIO = @servicio';
      request.input('servicio', sql.NVarChar, servicio);
    }

    if (tipoCaso && tipoCaso !== 'todos') {
      whereClause += ' AND TIPO_DE_CASO = @tipoCaso';
      request.input('tipoCaso', sql.NVarChar, tipoCaso);
    }

    const result = await request.query(`
      SELECT
        NUMERO_DEL_CASO as numero_caso,
        ESPECIALISTA,
        GRUPO_ESPECIALISTA as grupo,
        CATEGORIA,
        SERVICIO,
        TIPO_DE_CASO,
        PRIORIDAD,
        FECHA_ATENCION as fecha_cierre,
        TIEMPO_DE_SOLUCION_REAL as tiempo_solucion
      FROM dbo.Casos
      ${whereClause}
      ORDER BY FECHA_ATENCION DESC
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      filters: {
        grupo: grupo || 'todos',
        categoria: categoria || 'todos',
        servicio: servicio || 'todos',
        tipoCaso: tipoCaso || 'todos'
      },
      data: result.recordset
    });
  } catch (error) {
    console.error('Error al obtener casos cerrados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener casos cerrados',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardSummary,
  getMetricsBySpecialist,
  getMetricsByProduct,
  getServiceMetrics,
  getAvailableTables,
  getTableStructure,
  getFilters,
  getSprintEvolution,
  getSprintComparative,
  getOpenCases,
  getClosedCases
};
