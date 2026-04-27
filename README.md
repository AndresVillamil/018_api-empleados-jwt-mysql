# 🔐 API EMPLEADOS - SEGURIDAD (AUTENTICACIÓN Y AUTORIZACIÓN)

Inicia con npm run dev

## 📌 Objetivo

Implementar seguridad en la API de empleados mediante:

* Autenticación con JWT
* Autorización basada en roles

---

## 🔑 1. Autenticación

### ¿Qué es?

Proceso para validar la identidad de un usuario.

### Implementación

Se usa **JWT (JSON Web Token)**:

* El usuario hace login
* Se genera un token firmado
* El cliente lo envía en cada request

### Ejemplo Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛂 2. Autorización

### ¿Qué es?

Define qué acciones puede realizar un usuario.

### Roles definidos

| Rol   | Permisos      |
| ----- | ------------- |
| admin | CRUD completo |
| user  | Solo lectura  |

---

## 🧱 3. Arquitectura de Seguridad

```
middlewares/
 ├── authMiddleware.js   → valida JWT
 ├── roleMiddleware.js   → valida roles

controllers/
 ├── authController.js   → login

routes/
 ├── authRoutes.js       → endpoint login
```

---

## 🔄 4. Flujo de autenticación

1. Usuario envía credenciales
2. API valida usuario
3. API genera JWT
4. Cliente guarda token
5. Cliente envía token en cada request
6. Middleware valida token
7. Middleware valida permisos

---

## 🔐 5. Middleware de Autenticación

Valida que el token sea correcto:

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.usuario = decoded;
```

---

## 🛂 6. Middleware de Autorización

Valida el rol del usuario:

```js
if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ error: "No autorizado" });
}
```

---

## 🚀 7. Protección de rutas

| Endpoint       | Seguridad           |
| -------------- | ------------------- |
| GET /empleados | Usuario autenticado |
| POST           | Solo admin          |
| PUT            | Solo admin          |
| DELETE         | Solo admin          |

---

## ⚙️ 8. Variables de entorno

```
JWT_SECRET=supersecreto
```

---

## 🧠 9. Buenas prácticas (nivel senior)

* Usar **refresh tokens**
* Guardar tokens en cookies httpOnly
* Encriptar contraseñas (bcrypt)
* Manejar expiración de tokens
* Auditoría de accesos

---

## 🏁 Conclusión

Se implementó un modelo de seguridad basado en:

* Autenticación sin estado (JWT)
* Control de acceso por roles
* Middleware desacoplado

Esto permite escalar la API y cumplir estándares de seguridad modernos.
