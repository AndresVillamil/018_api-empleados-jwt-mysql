# Es te es un modelo de aplicación de Seguridad a un API

Lo que se pide en entrevistas y proyectos reales: pasar de una API CRUD a una API segura con autenticación y autorización por roles.

Te voy a dejar:

✅ Explicación clara (nivel entrevista)
✅ Cómo aplicarlo a TU proyecto
✅ Flujo completo
✅ Archivo INFO.md listo para usar

---
🔐 1. Conceptos Clave
🧩 Autenticación (Authentication)

Responde a la pregunta:

¿Quién eres?

Es el proceso de validar la identidad de un usuario.

Ejemplos:
Usuario + contraseña
OAuth (Google, Microsoft)
JWT
En tu caso: JWT

JWT (JSON Web Token) es un token firmado que contiene información del usuario:

{
  "id": 1,
  "email": "admin@test.com",
  "rol": "admin"
}

👉 Se genera al hacer login
👉 Se envía en cada request

---

🛂 Autorización (Authorization)

Responde a la pregunta:

¿Qué puedes hacer?

Aquí decides:

| Rol   | Permisos                |
| ----- | ----------------------- |
| admin | crear, editar, eliminar |
| user  | solo consultar          |

---
🔄 Alternativa a JWT

Otra opción común:

🔹 Sessions (Estado en servidor)
Guarda sesión en memoria/Redis
Usa cookies

| JWT        | Sessions        |
| ---------- | --------------- |
| Stateless  | Stateful        |
| Escalable  | Menos escalable |
| Ideal APIs | Ideal apps web  |

👉 Para APIs modernas: JWT es estándar

# 🏗️ 2. Cómo aplicarlo a TU proyecto

Vamos a agregar:

middlewares/
 ├── authMiddleware.js   👈 valida token
 ├── roleMiddleware.js   👈 valida rol

controllers/
 ├── authController.js   👈 login

routes/
 ├── authRoutes.js       👈 login endpoint

 ---

 # 🔑 3. Autenticación (Login + JWT)
📌 Instalar

npm install jsonwebtoken bcryptjs

📌 Ejemplo authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Simulación (en real: BD)
const usuarios = [
  { id: 1, email: "admin@test.com", password: bcrypt.hashSync("123456", 10), rol: "admin" },
  { id: 2, email: "user@test.com", password: bcrypt.hashSync("123456", 10), rol: "user" }
];

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = usuarios.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: "Usuario no existe" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};

module.exports = { login };

📌 Middleware de autenticación