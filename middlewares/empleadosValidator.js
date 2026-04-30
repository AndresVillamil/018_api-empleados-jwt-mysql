const { body, validationResult } = require("express-validator");

const reglasEmpleado = [

    body("nombre")
        .trim().escape()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ min: 3 }).withMessage("El nombre debe tener mínimo 3 caracteres"),

    body("fecha_nacimiento")
        .notEmpty().withMessage("La fecha de nacimiento es obligatoria")
        .isISO8601().withMessage("Formato de fecha de nacimiento inválido"),

    body("fecha_ingreso")
        .notEmpty().withMessage("La fecha de ingreso es obligatoria")
        .isISO8601().withMessage("Formato de fecha de ingreso inválido"),

    body("salario")
        .notEmpty().withMessage("El salario es obligatorio")
        .isDecimal().withMessage("El salario debe ser numérico")
        .custom(value => parseFloat(value) > 0)
        .withMessage("El salario debe ser mayor a 0"),

    body("cargo")
        .trim()
        .notEmpty().withMessage("El cargo es obligatorio"),

    body("departamento")
        .trim()
        .notEmpty().withMessage("El departamento es obligatorio"),

    // 🔥 Regla: Mayor de 18 años
    body("fecha_nacimiento").custom((value) => {
        const hoy = new Date();
        const nacimiento = new Date(value);

        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        const edadReal =
            mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())
                ? edad - 1
                : edad;

        if (edadReal < 18) {
            throw new Error("El empleado debe ser mayor de 18 años");
        }

        return true;
    }),

    // 🔥 Regla: Fecha ingreso coherente
    body("fecha_ingreso").custom((value, { req }) => {
        const ingreso = new Date(value);
        const nacimiento = new Date(req.body.fecha_nacimiento);
        const hoy = new Date();

        if (ingreso <= nacimiento) {
            throw new Error("La fecha de ingreso debe ser posterior a la fecha de nacimiento");
        }

        if (ingreso > hoy) {
            throw new Error("La fecha de ingreso no puede ser futura");
        }

        return true;
    })
];

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    next();
};

module.exports = {
    reglasEmpleado,
    validarCampos
};
