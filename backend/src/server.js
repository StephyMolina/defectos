const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { getConnection, closeConnection } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const sprintRoutes = require('./routes/sprintRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/sprints', sprintRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API Tablero - Backend funcionando correctamente',
    version: '1.0.0'
  });
});

// Ruta para verificar conexión a base de datos
app.get('/api/health', async (req, res) => {
  try {
    await getConnection();
    res.json({
      success: true,
      message: 'Conexión a base de datos OK'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error de conexión a base de datos',
      error: error.message
    });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación: http://localhost:${PORT}/api`);

  try {
    await getConnection();
  } catch (error) {
    console.error('⚠️  Error al conectar con la base de datos');
  }
});

// Cerrar conexión al terminar
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});
