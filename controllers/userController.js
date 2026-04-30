// controllers/userController.js
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// 🔹 Config centralizada
const ROLES_VALIDOS = ["admin", "user"];

// 🔹 Helper respuesta error
const handleError = (res, error, mensaje = "Error interno") => {
    console.error(mensaje, error);
    return res.status(500).json({ error: mensaje });
};

// 🔹 Helper validación
const validarCampos = (campos) => {
    return Object.entries(campos).find(([_, value]) => !value);
};

// ✅ Crear usuario
exports.crearUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔎 Validación
        const campoFaltante = validarCampos({ email, password });
        if (campoFaltante) {
            return res.status(400).json({
                error: `El campo ${campoFaltante[0]} es obligatorio`
            });
        }

        // 🔎 Verificar existencia
        const existente = await User.findByEmail(email);
        if (existente) {
            return res.status(400).json({
                error: "El usuario ya existe"
            });
        }

        // 🔐 Hash
        const hash = await bcrypt.hash(password, 10);

        // 💾 Crear
        const userId = await User.createUser(email, hash);

        return res.status(201).json({
            message: "Usuario creado correctamente",
            user: {
                id: userId,
                email,
                role: "user"
            }
        });

    } catch (error) {
        return handleError(res, error, "Error al crear usuario");
    }
};

// ✅ Listar usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.getAllUsers();

        return res.json({
            total: usuarios.length,
            data: usuarios
        });

    } catch (error) {
        return handleError(res, error, "Error al obtener usuarios");
    }
};

// ✅ Actualizar rol
exports.actualizarRol = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        // 🔎 Validaciones
        if (!role) {
            return res.status(400).json({
                error: "El rol es obligatorio"
            });
        }

        if (!ROLES_VALIDOS.includes(role)) {
            return res.status(400).json({
                error: `Rol inválido. Permitidos: ${ROLES_VALIDOS.join(", ")}`
            });
        }

        // 🔎 Validar usuario (OPTIMIZADO)
        const usuario = await User.findById(id);
        if (!usuario) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        // 🔄 Evitar update innecesario
        if (usuario.role === role) {
            return res.json({
                message: "El usuario ya tiene ese rol",
                user: { id, role }
            });
        }

        // 🔄 Actualizar
        await User.updateUserRole(id, role);

        return res.json({
            message: "Rol actualizado correctamente",
            user: {
                id,
                role
            }
        });

    } catch (error) {
        return handleError(res, error, "Error al actualizar rol");
    }
};