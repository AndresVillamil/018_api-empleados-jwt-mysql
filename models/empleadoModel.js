const db = require("../config/db");

const getAll = async () => {
    const [rows] = await db.query("SELECT * FROM empleados");
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM empleados WHERE id = ?",
        [id]
    );
    return rows[0];
};

const create = async (empleado) => {
    const {
        nombre,
        fecha_nacimiento,
        fecha_ingreso,
        salario,
        cargo,
        departamento
    } = empleado;

    const [result] = await db.query(
        `INSERT INTO empleados 
        (nombre, fecha_nacimiento, fecha_ingreso, salario, cargo, departamento) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, fecha_nacimiento, fecha_ingreso, salario, cargo, departamento]
    );

    return result.insertId;
};

const update = async (id, empleado) => {
    const {
        nombre,
        fecha_nacimiento,
        fecha_ingreso,
        salario,
        cargo,
        departamento
    } = empleado;

    await db.query(
        `UPDATE empleados SET
            nombre = ?,
            fecha_nacimiento = ?,
            fecha_ingreso = ?,
            salario = ?,
            cargo = ?,
            departamento = ?
        WHERE id = ?`,
        [nombre, fecha_nacimiento, fecha_ingreso, salario, cargo, departamento, id]
    );
};

const remove = async (id) => {
    await db.query(
        "DELETE FROM empleados WHERE id = ?",
        [id]
    );
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
