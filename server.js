const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express(); // ✅ PRIMERO SE DECLARA

// ✅ CORS (una sola vez)

const allowedOrigins = process.env.CORS_ORIGINS.split(",");

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / server-to-server

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  }
}));

// ✅ Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Rutas (sin duplicar)
app.use("/api/empleados", require("./routes/empleadosRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/usuarios", require("./routes/userRoutes"));

// ✅ DB test
const pool = require("./config/db");

async function testDB() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión a MySQL exitosa");
    connection.release();
  } catch (error) {
    console.error("❌ Error conectando a MySQL:", error.message);
    process.exit(1);
  }
}

testDB();

app.get("/test-db", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, message: "DB funcionando" });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ✅ Server
app.listen(process.env.PORT || 8500, () => {
  console.log(`Servidor en http://localhost:${process.env.PORT || 8500}`);
});