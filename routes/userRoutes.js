// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/roleMiddleware");

// Solo admin
router.post("/", verificarToken, verificarRol("admin"), userController.crearUsuario);

router.get("/", verificarToken, verificarRol("admin"), userController.obtenerUsuarios);

router.put("/:id/rol", verificarToken, verificarRol("admin"), userController.actualizarRol);

module.exports = router;