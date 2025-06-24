import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Database from "./src/database/database.js";
import authRoutes from "./src/routes/auth.js";
import emergencyRoutes from "./src/routes/emergencies.js";
import userRoutes from "./src/routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del cors, para el frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const database = new Database();
database.init();

// Middleware para pasar la base de datos a las rutas
app.use((req, res, next) => {
  req.db = database;
  next();
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "FokinProt Backend funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Urgences OK`);
});

export default app;
