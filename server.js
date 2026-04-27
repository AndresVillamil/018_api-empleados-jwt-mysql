const express = require("express");
const path = require("path");
require("dotenv").config();



const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/empleados", require("./routes/empleadosRoutes"));
app.use("/api/empleados/:id", require("./routes/empleadosRoutes"));

app.listen(process.env.PORT, () => {
    console.log(`Servidor en http://localhost:${process.env.PORT}`);
});

const pool = require("./config/db");

async function testDB() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conexión a MySQL exitosa");
        connection.release();
    } catch (error) {
        console.error("❌ Error conectando a MySQL:", error.message);
        process.exit(1); // Detiene el servidor si falla
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
