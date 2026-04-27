const express = require("express");
const router = express.Router();
const empleadosController = require("../controllers/empleadosController");
const { reglasEmpleado, validarCampos } = require("../middlewares/empleadosValidator");

router.get("/", empleadosController.obtenerTodos);

router.get("/:id", empleadosController.obtenerUno);

router.post(
    "/",
    reglasEmpleado,
    validarCampos,
    empleadosController.crear
);

router.put(
    "/:id",
    reglasEmpleado,
    validarCampos,
    empleadosController.actualizar
);

router.delete("/:id", empleadosController.eliminar);

module.exports = router;
