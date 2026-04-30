// middlewares/roleMiddleware.js
module.exports = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
            return res.status(403).json({ error: "No autorizado" });
        }
        next();
    };
};