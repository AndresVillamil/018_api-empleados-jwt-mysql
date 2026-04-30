const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.register = async (req, res) => {
  const { nombre, email, password, role } = req.body;

  try {
    // 🔍 1. Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Campos obligatorios incompletos" });
    }

    // 🔍 2. Verificar si el usuario ya existe
    const [existingUser] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // 🔐 3. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 4. Insertar usuario
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, role || "user"]
    );

    // 🎫 5. Generar token (opcional pero recomendado)
    const token = jwt.sign(
      { id: result.insertId, role: role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ 6. Respuesta
    res.status(201).json({
      message: "Usuario registrado correctamente",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    // 🔴 Usuario no existe
    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = rows[0];

    // 🔴 Comparación correcta con bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // ✅ Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

