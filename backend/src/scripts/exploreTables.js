const { getConnection } = require('../config/database');

async function exploreTables() {
  try {
    const pool = await getConnection();

    console.log('\n========================================');
    console.log('EXPLORANDO BASE DE DATOS ARANDABI');
    console.log('========================================\n');

    // Obtener todas las tablas
    const tablesResult = await pool.request().query(`
      SELECT
        TABLE_SCHEMA,
        TABLE_NAME,
        TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_SCHEMA, TABLE_NAME
    `);

    console.log(`Total de tablas encontradas: ${tablesResult.recordset.length}\n`);

    // Buscar tablas relacionadas con especialistas, productos, servicios
    const keywords = ['especialista', 'producto', 'servicio', 'ticket', 'usuario', 'empleado', 'agente', 'case', 'request'];

    console.log('TABLAS RELEVANTES ENCONTRADAS:\n');

    for (const keyword of keywords) {
      const filtered = tablesResult.recordset.filter(t =>
        t.TABLE_NAME.toLowerCase().includes(keyword)
      );

      if (filtered.length > 0) {
        console.log(`\n--- Tablas con "${keyword}" ---`);
        filtered.forEach(t => {
          console.log(`  ${t.TABLE_SCHEMA}.${t.TABLE_NAME}`);
        });
      }
    }

    // Mostrar todas las tablas
    console.log('\n\n========================================');
    console.log('LISTA COMPLETA DE TABLAS:');
    console.log('========================================\n');

    let currentSchema = '';
    tablesResult.recordset.forEach(t => {
      if (t.TABLE_SCHEMA !== currentSchema) {
        console.log(`\n[${t.TABLE_SCHEMA}]`);
        currentSchema = t.TABLE_SCHEMA;
      }
      console.log(`  - ${t.TABLE_NAME}`);
    });

    console.log('\n========================================\n');

  } catch (error) {
    console.error('Error al explorar base de datos:', error.message);
  }

  process.exit(0);
}

exploreTables();
