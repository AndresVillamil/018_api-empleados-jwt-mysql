// models/userModel.js
const db = require("../config/db");

const createUser = async (email, password, role = "user") => {
    const [result] = await db.query(
        "INSERT INTO usuarios (email, password, role) VALUES (?, ?, ?)",
        [email, password, role]
    );
    return result.insertId;
};

// userModel.js
const findById = async (id) => {
    const [rows] = await db.query(
        "SELECT id FROM usuarios WHERE id = ?",
        [id]
    );
    return rows[0];
};

const findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    );
    return rows[0];
};

const getAllUsers = async () => {
    const [rows] = await db.query(
        "SELECT id, email, role FROM usuarios"
    );
    return rows;
};

const updateUserRole = async (id, rol) => {
    await db.query(
        "UPDATE usuarios SET role = ? WHERE id = ?",
        [rol, id]
    );
};

module.exports = {
    createUser,
    findByEmail,
    getAllUsers,
    updateUserRole
};