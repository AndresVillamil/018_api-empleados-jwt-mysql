const express = require("express");
const router = express.Router();

const empleadosController = require("../controllers/empleadosController");
const { reglasEmpleado, validarCampos } = require("../middlewares/empleadosValidator");
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/roleMiddleware");

router.get("/", verificarToken, empleadosController.obtenerTodos);

router.get("/:id", verificarToken, empleadosController.obtenerUno);

router.post(
    "/",
    verificarToken,
    verificarRol("admin"),
    reglasEmpleado,
    validarCampos,
    empleadosController.crear
);

router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    reglasEmpleado,
    validarCampos,
    empleadosController.actualizar
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    empleadosController.eliminar
);

module.exports = router;