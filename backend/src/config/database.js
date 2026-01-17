const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'tablero_db',
  options: {
    encrypt: true, // Para Azure
    trustServerCertificate: true // Cambiar a false en producción
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

const getConnection = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✓ Conexión a SQL Server establecida');
    }
    return pool;
  } catch (error) {
    console.error('Error al conectar con SQL Server:', error);
    throw error;
  }
};

const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('✓ Conexión a SQL Server cerrada');
    }
  } catch (error) {
    console.error('Error al cerrar conexión:', error);
  }
};

module.exports = {
  sql,
  getConnection,
  closeConnection
};
