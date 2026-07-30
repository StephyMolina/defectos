const { getConnection, closeConnection } = require('../config/database');

async function testConnection() {
  console.log('\n========================================');
  console.log('PRUEBA DE CONEXIÓN A ARANDABI');
  console.log('========================================\n');

  console.log('Servidor: srvv-db-aranda');
  console.log('Base de datos: ARANDABI');
  console.log('Usuario: consultar');
  console.log('\nIntentando conectar...\n');

  try {
    const pool = await getConnection();

    console.log('✅ CONEXIÓN EXITOSA!\n');

    // Obtener información del servidor
    const serverInfo = await pool.request().query(`
      SELECT
        @@VERSION as version,
        DB_NAME() as base_datos,
        SYSTEM_USER as usuario,
        GETDATE() as fecha_hora
    `);

    console.log('📊 Información del Servidor:');
    console.log('----------------------------');
    console.log(`Base de datos actual: ${serverInfo.recordset[0].base_datos}`);
    console.log(`Usuario conectado: ${serverInfo.recordset[0].usuario}`);
    console.log(`Fecha/Hora servidor: ${serverInfo.recordset[0].fecha_hora}`);
    console.log(`\nVersión SQL Server:`);
    console.log(serverInfo.recordset[0].version.split('\n')[0]);

    // Contar tablas
    const tablesCount = await pool.request().query(`
      SELECT COUNT(*) as total
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);

    console.log(`\n📋 Total de tablas en ARANDABI: ${tablesCount.recordset[0].total}`);

    console.log('\n✅ Todo funciona correctamente!');
    console.log('\nPuedes iniciar el servidor con: npm run dev');

    await closeConnection();

  } catch (error) {
    console.error('\n❌ ERROR DE CONEXIÓN\n');
    console.error('Detalles del error:');
    console.error('-------------------');
    console.error(`Mensaje: ${error.message}`);
    console.error(`Código: ${error.code || 'N/A'}`);

    console.log('\n🔍 Posibles soluciones:\n');
    console.log('1. Verifica que el servidor SQL Server esté accesible:');
    console.log('   ping srvv-db-aranda\n');

    console.log('2. Verifica que el puerto 1433 esté abierto:');
    console.log('   telnet srvv-db-aranda 1433\n');

    console.log('3. Verifica las credenciales en el archivo .env\n');

    console.log('4. Verifica que tu máquina tenga acceso a la red del servidor\n');

    console.log('5. Si usas VPN, asegúrate de estar conectado\n');
  }

  console.log('\n========================================\n');
  process.exit(0);
}

testConnection();
