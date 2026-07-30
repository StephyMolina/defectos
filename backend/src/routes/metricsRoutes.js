const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

// Rutas de métricas
router.get('/dashboard', metricsController.getDashboardSummary);
router.get('/specialists', metricsController.getMetricsBySpecialist);
router.get('/products', metricsController.getMetricsByProduct);
router.get('/services', metricsController.getServiceMetrics);

// Ruta de filtros
router.get('/filters', metricsController.getFilters);

// Rutas de exploración (útiles para desarrollo)
router.get('/tables', metricsController.getAvailableTables);
router.get('/tables/:tableName', metricsController.getTableStructure);

// Ruta de información gerencial
router.get('/sprint-evolution', metricsController.getSprintEvolution);
router.get('/sprint-comparative', metricsController.getSprintComparative);

// Ruta de casos abiertos/no cerrados
router.get('/open-cases', metricsController.getOpenCases);

// Ruta de casos cerrados
router.get('/closed-cases', metricsController.getClosedCases);

module.exports = router;
