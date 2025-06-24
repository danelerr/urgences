import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      password,
      tipo_usuario,
      ubicacion_lat,
      ubicacion_lng,
    } = req.body;

    if (!nombre || !email || !telefono || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos obligatorios deben ser completados" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existingUser = await req.db.get(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "El usuario ya existe con este email" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await req.db.run(
      `INSERT INTO usuarios (nombre, email, telefono, password_hash, tipo_usuario, ubicacion_lat, ubicacion_lng) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        email,
        telefono,
        password_hash,
        tipo_usuario || "ciudadano",
        ubicacion_lat,
        ubicacion_lng,
      ]
    );

    // Generar token
    const token = jwt.sign(
      {
        id: result.id,
        email,
        tipo_usuario: tipo_usuario || "ciudadano",
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: result.id,
        nombre,
        email,
        telefono,
        tipo_usuario: tipo_usuario || "ciudadano",
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }

    // Buscar usuario
    const user = await req.db.get("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar estado del usuario
    if (user.estado === "inactivo") {
      return res
        .status(401)
        .json({ error: "Usuario inactivo. Contacta al administrador." });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        tipo_usuario: user.tipo_usuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Actualizar fecha de último acceso
    await req.db.run(
      "UPDATE usuarios SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id]
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        tipo_usuario: user.tipo_usuario,
        estado: user.estado,
        ubicacion_lat: user.ubicacion_lat,
        ubicacion_lng: user.ubicacion_lng,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener perfil del usuario autenticado
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await req.db.get(
      "SELECT id, nombre, email, telefono, tipo_usuario, estado, ubicacion_lat, ubicacion_lng, fecha_creacion FROM usuarios WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar perfil del usuario
router.put("/profile", auth, async (req, res) => {
  try {
    const { nombre, telefono, ubicacion_lat, ubicacion_lng } = req.body;

    await req.db.run(
      `UPDATE usuarios 
             SET nombre = COALESCE(?, nombre), 
                 telefono = COALESCE(?, telefono), 
                 ubicacion_lat = COALESCE(?, ubicacion_lat), 
                 ubicacion_lng = COALESCE(?, ubicacion_lng),
                 fecha_actualizacion = CURRENT_TIMESTAMP 
             WHERE id = ?`,
      [nombre, telefono, ubicacion_lat, ubicacion_lng, req.user.id]
    );

    const updatedUser = await req.db.get(
      "SELECT id, nombre, email, telefono, tipo_usuario, estado, ubicacion_lat, ubicacion_lng FROM usuarios WHERE id = ?",
      [req.user.id]
    );

    res.json({
      message: "Perfil actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Cambiar contraseña
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Contraseña actual y nueva son requeridas" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar contraseña actual
    const user = await req.db.get(
      "SELECT password_hash FROM usuarios WHERE id = ?",
      [req.user.id]
    );
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }

    // Encriptar nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await req.db.run(
      "UPDATE usuarios SET password_hash = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?",
      [newPasswordHash, req.user.id]
    );

    res.json({ message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
