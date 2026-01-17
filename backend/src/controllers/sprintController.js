const { getConnection, sql } = require('../config/database');

// Array de sprints (inicialmente en memoria, puede ser migrado a base de datos)
let sprints = [
  {
    id: 1,
    nombre: 'Sprint 2025-01',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-01-31',
    activo: true
  },
  {
    id: 2,
    nombre: 'Sprint 2025-02',
    fechaInicio: '2025-02-01',
    fechaFin: '2025-02-28',
    activo: true
  },
  {
    id: 3,
    nombre: 'Sprint 2025-03',
    fechaInicio: '2025-03-01',
    fechaFin: '2025-03-31',
    activo: true
  },
  {
    id: 4,
    nombre: 'Sprint 2025-04',
    fechaInicio: '2025-04-01',
    fechaFin: '2025-04-30',
    activo: true
  },
  {
    id: 5,
    nombre: 'Sprint 2025-05',
    fechaInicio: '2025-05-01',
    fechaFin: '2025-05-31',
    activo: true
  },
  {
    id: 6,
    nombre: 'Sprint 2025-06',
    fechaInicio: '2025-06-01',
    fechaFin: '2025-06-30',
    activo: true
  },
  {
    id: 7,
    nombre: 'Sprint 2025-07',
    fechaInicio: '2025-07-01',
    fechaFin: '2025-07-31',
    activo: true
  },
  {
    id: 8,
    nombre: 'Sprint 2025-08',
    fechaInicio: '2025-08-01',
    fechaFin: '2025-08-31',
    activo: true
  },
  {
    id: 9,
    nombre: 'Sprint 2025-09',
    fechaInicio: '2025-09-01',
    fechaFin: '2025-09-30',
    activo: true
  },
  {
    id: 10,
    nombre: 'Sprint 2025-10',
    fechaInicio: '2025-10-01',
    fechaFin: '2025-10-31',
    activo: true
  },
  {
    id: 11,
    nombre: 'Sprint 2025-11',
    fechaInicio: '2025-11-01',
    fechaFin: '2025-11-30',
    activo: true
  },
  {
    id: 12,
    nombre: 'Sprint 2025-12',
    fechaInicio: '2025-12-01',
    fechaFin: '2025-12-31',
    activo: true
  },
  {
    id: 13,
    nombre: 'Sprint 2026-01',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-01-31',
    activo: true
  }
];

// Obtener todos los sprints
const getAllSprints = async (req, res) => {
  try {
    // Ordenar por fecha de inicio descendente (más recientes primero)
    const sortedSprints = sprints
      .filter(s => s.activo)
      .sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));

    res.json({
      success: true,
      count: sortedSprints.length,
      data: sortedSprints
    });
  } catch (error) {
    console.error('Error al obtener sprints:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sprints',
      error: error.message
    });
  }
};

// Obtener un sprint por ID
const getSprintById = async (req, res) => {
  try {
    const { id } = req.params;
    const sprint = sprints.find(s => s.id === parseInt(id) && s.activo);

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: 'Sprint no encontrado'
      });
    }

    res.json({
      success: true,
      data: sprint
    });
  } catch (error) {
    console.error('Error al obtener sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener sprint',
      error: error.message
    });
  }
};

// Crear un nuevo sprint
const createSprint = async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin } = req.body;

    // Validar datos
    if (!nombre || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, fecha de inicio y fecha de fin son requeridos'
      });
    }

    // Validar que fecha inicio sea menor que fecha fin
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
    }

    // Generar nuevo ID
    const newId = sprints.length > 0 ? Math.max(...sprints.map(s => s.id)) + 1 : 1;

    const newSprint = {
      id: newId,
      nombre,
      fechaInicio,
      fechaFin,
      activo: true
    };

    sprints.push(newSprint);

    res.status(201).json({
      success: true,
      message: 'Sprint creado exitosamente',
      data: newSprint
    });
  } catch (error) {
    console.error('Error al crear sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear sprint',
      error: error.message
    });
  }
};

// Actualizar un sprint
const updateSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fechaInicio, fechaFin } = req.body;

    const sprintIndex = sprints.findIndex(s => s.id === parseInt(id) && s.activo);

    if (sprintIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sprint no encontrado'
      });
    }

    // Validar que fecha inicio sea menor que fecha fin
    if (fechaInicio && fechaFin && new Date(fechaInicio) >= new Date(fechaFin)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin'
      });
    }

    // Actualizar campos
    if (nombre) sprints[sprintIndex].nombre = nombre;
    if (fechaInicio) sprints[sprintIndex].fechaInicio = fechaInicio;
    if (fechaFin) sprints[sprintIndex].fechaFin = fechaFin;

    res.json({
      success: true,
      message: 'Sprint actualizado exitosamente',
      data: sprints[sprintIndex]
    });
  } catch (error) {
    console.error('Error al actualizar sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar sprint',
      error: error.message
    });
  }
};

// Eliminar un sprint (soft delete)
const deleteSprint = async (req, res) => {
  try {
    const { id } = req.params;

    const sprintIndex = sprints.findIndex(s => s.id === parseInt(id) && s.activo);

    if (sprintIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sprint no encontrado'
      });
    }

    // Soft delete - marcar como inactivo
    sprints[sprintIndex].activo = false;

    res.json({
      success: true,
      message: 'Sprint eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar sprint',
      error: error.message
    });
  }
};

// Helper methods for internal use (no res/req needed)
const getSprintByIdInternal = async (id) => {
  return sprints.find(s => s.id === id && s.activo);
};

const getAllSprintsInternal = async () => {
  return sprints.filter(s => s.activo);
};

module.exports = {
  getAllSprints,
  getSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
  getSprintByIdInternal,
  getAllSprintsInternal
};
