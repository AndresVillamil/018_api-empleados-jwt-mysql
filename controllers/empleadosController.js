const Empleado = require("../models/empleadoModel");

const obtenerTodos = async (req, res) => {
    try {
        const empleados = await Empleado.getAll();
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener empleados" });
    }
};

const obtenerUno = async (req, res) => {
    try {
        const empleado = await Empleado.getById(req.params.id);
        if (!empleado) return res.status(404).json({ error: "No encontrado" });
        res.json(empleado);
    } catch (error) {
        res.status(500).json({ error: "Error servidor" });
    }
};

const crear = async (req, res) => {
    try {
        const id = await Empleado.create(req.body);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ error: "Error al crear empleado" });
    }
};

const actualizar = async (req, res) => {
    try {
        await Empleado.update(req.params.id, req.body);
        res.json({ message: "Empleado actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
};

const eliminar = async (req, res) => {
    try {
        await Empleado.remove(req.params.id);
        res.json({ message: "Empleado eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};

module.exports = {
    obtenerTodos,
    obtenerUno,
    crear,
    actualizar,
    eliminar
};
