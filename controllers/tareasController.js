const tareasModel = require('../models/tareasModel');

// GET
const obtenerTareas = (req, res) => {
    tareasModel.obtenerTodas((error, tareas) => {
        if (error) {
            return res.status(500).json({ message: 'Error al consultar la base de datos', error: error.message });
        }
        res.json(tareas);
    });
};

// POST
const crearTarea = (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }

    tareasModel.crearTarea(title.trim(), (error, nuevoId) => {
        if (error) {
            return res.status(500).json({ message: 'Error al guardar la tarea', error: error.message });
        }
        res.status(201).json({ id: nuevoId, title: title.trim(), completed: 0 });
    });
};

// PUT
const actualizarTarea = (req, res) => {
    const tareaId = parseInt(req.params.id);
    const { title, completed } = req.body;

    tareasModel.actualizarTarea(tareaId, title, completed, (error, cambios) => {
        if (error) {
            return res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
        }
        if (cambios === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json({ id: tareaId, title, completed });
    });
};

// DELETE
const eliminarTarea = (req, res) => {
    const tareaId = parseInt(req.params.id);

    tareasModel.eliminarTarea(tareaId, (error, cambios) => {
        if (error) {
            return res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
        }
        if (cambios === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json({ message: 'Tarea eliminada exitosamente' });
    });
};

module.exports = {
    obtenerTareas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};