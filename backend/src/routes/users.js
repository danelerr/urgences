import express from "express";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, authorize(["operador"]), async (req, res) => {
  try {
    const { tipo_usuario, estado, limit = 50, offset = 0 } = req.query;

    let sql = `
            SELECT id, nombre, email, telefono, tipo_usuario, estado, 
                   ubicacion_lat, ubicacion_lng, fecha_creacion
            FROM usuarios 
        `;

    const conditions = [];
    const params = [];

    if (tipo_usuario) {
      conditions.push("tipo_usuario = ?");
      params.push(tipo_usuario);
    }

    if (estado) {
      conditions.push("estado = ?");
      params.push(estado);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const usuarios = await req.db.all(sql, params);

    res.json({
      usuarios,
      total: usuarios.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener unidades disponibles por tipo
router.get(
  "/unidades/:tipo",
  auth,
  authorize(["operador"]),
  async (req, res) => {
    try {
      const { tipo } = req.params;

      if (!["bombero", "policia", "ambulancia"].includes(tipo)) {
        return res.status(400).json({
          error: "Tipo debe ser: bombero, policia o ambulancia",
        });
      }

      const unidades = await req.db.all(
        `SELECT id, nombre, telefono, estado, ubicacion_lat, ubicacion_lng
             FROM usuarios 
             WHERE tipo_usuario = ? AND estado IN ('activo', 'en_servicio')
             ORDER BY estado DESC, nombre ASC`,
        [tipo]
      );

      res.json(unidades);
    } catch (error) {
      console.error("Error al obtener unidades:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Actualizar estado de usuario (solo operadores y el mismo usuario)
router.put("/:id/estado", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ error: "Estado es requerido" });
    }

    if (
      !["activo", "inactivo", "en_servicio", "fuera_servicio"].includes(estado)
    ) {
      return res.status(400).json({
        error:
          "Estado debe ser: activo, inactivo, en_servicio o fuera_servicio",
      });
    }

    // Verificar permisos: operadores pueden cambiar cualquier estado, otros usuarios solo el suyo
    if (req.user.tipo_usuario !== "operador" && req.user.id !== parseInt(id)) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para cambiar este estado" });
    }

    await req.db.run(
      "UPDATE usuarios SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?",
      [estado, id]
    );

    res.json({ message: "Estado actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar estado de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar ubicación de usuario
router.put("/:id/ubicacion", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { ubicacion_lat, ubicacion_lng } = req.body;

    if (!ubicacion_lat || !ubicacion_lng) {
      return res
        .status(400)
        .json({ error: "Latitud y longitud son requeridas" });
    }

    // Verificar permisos: usuarios solo pueden actualizar su propia ubicación
    if (req.user.id !== parseInt(id)) {
      return res
        .status(403)
        .json({ error: "Solo puedes actualizar tu propia ubicación" });
    }

    await req.db.run(
      "UPDATE usuarios SET ubicacion_lat = ?, ubicacion_lng = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?",
      [ubicacion_lat, ubicacion_lng, id]
    );

    res.json({ message: "Ubicación actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar ubicación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener contactos de emergencia
router.get("/contactos", async (req, res) => {
  try {
    const { tipo_servicio } = req.query;

    let sql = "SELECT * FROM contactos WHERE disponible = TRUE";
    const params = [];

    if (tipo_servicio) {
      sql += " AND tipo_servicio = ?";
      params.push(tipo_servicio);
    }

    sql += " ORDER BY tipo_servicio, nombre";

    const contactos = await req.db.all(sql, params);

    res.json(contactos);
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener estadísticas de usuarios (solo operadores)
router.get(
  "/stats/usuarios",
  auth,
  authorize(["operador"]),
  async (req, res) => {
    try {
      const stats = {};

      // Total de usuarios por tipo
      const tiposStats = await req.db.all(`
            SELECT tipo_usuario, COUNT(*) as count 
            FROM usuarios 
            GROUP BY tipo_usuario
        `);
      stats.por_tipo = tiposStats;

      // Total de usuarios por estado
      const estadosStats = await req.db.all(`
            SELECT estado, COUNT(*) as count 
            FROM usuarios 
            GROUP BY estado
        `);
      stats.por_estado = estadosStats;

      // Unidades disponibles
      const unidadesDisponibles = await req.db.all(`
            SELECT tipo_usuario, COUNT(*) as count 
            FROM usuarios 
            WHERE tipo_usuario IN ('bombero', 'policia', 'ambulancia') 
            AND estado = 'en_servicio'
            GROUP BY tipo_usuario
        `);
      stats.unidades_disponibles = unidadesDisponibles;

      res.json(stats);
    } catch (error) {
      console.error("Error al obtener estadísticas de usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default router;
