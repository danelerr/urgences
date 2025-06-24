import express from "express";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// Crear nueva emergencia
router.post("/", auth, async (req, res) => {
  try {
    const {
      tipo_emergencia,
      descripcion,
      ubicacion_lat,
      ubicacion_lng,
      direccion,
      prioridad,
    } = req.body;

    // Validaciones
    if (!tipo_emergencia || !ubicacion_lat || !ubicacion_lng) {
      return res.status(400).json({
        error: "Tipo de emergencia, latitud y longitud son requeridos",
      });
    }

    if (!["bomberos", "ambulancia", "policia"].includes(tipo_emergencia)) {
      return res.status(400).json({
        error: "Tipo de emergencia debe ser: bomberos, ambulancia o policia",
      });
    }

    // Crear emergencia
    const result = await req.db.run(
      `INSERT INTO emergencias (usuario_id, tipo_emergencia, descripcion, ubicacion_lat, ubicacion_lng, direccion, prioridad) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        tipo_emergencia,
        descripcion,
        ubicacion_lat,
        ubicacion_lng,
        direccion,
        prioridad || "media",
      ]
    );

    // Crear registro en historial
    await req.db.run(
      `INSERT INTO historial_estados (emergencia_id, estado_nuevo, usuario_cambio_id, comentario) 
             VALUES (?, ?, ?, ?)`,
      [result.id, "pendiente", req.user.id, "Emergencia creada"]
    );

    // Obtener la emergencia creada con información del usuario
    const emergencia = await req.db.get(
      `SELECT e.*, u.nombre as usuario_nombre, u.telefono as usuario_telefono 
             FROM emergencias e 
             JOIN usuarios u ON e.usuario_id = u.id 
             WHERE e.id = ?`,
      [result.id]
    );

    res.status(201).json({
      message: "Emergencia creada exitosamente",
      emergencia,
    });
  } catch (error) {
    console.error("Error al crear emergencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener todas las emergencias (con filtros)
router.get("/", auth, async (req, res) => {
  try {
    const {
      estado,
      tipo_emergencia,
      prioridad,
      limit = 50,
      offset = 0,
    } = req.query;

    let sql = `
            SELECT e.*, u.nombre as usuario_nombre, u.telefono as usuario_telefono,
                   u.ubicacion_lat as usuario_lat, u.ubicacion_lng as usuario_lng
            FROM emergencias e 
            JOIN usuarios u ON e.usuario_id = u.id 
        `;

    const conditions = [];
    const params = [];

    // Filtros para ciudadanos (solo sus emergencias)
    if (req.user.tipo_usuario === "ciudadano") {
      conditions.push("e.usuario_id = ?");
      params.push(req.user.id);
    }

    // Filtros opcionales
    if (estado) {
      conditions.push("e.estado = ?");
      params.push(estado);
    }

    if (tipo_emergencia) {
      conditions.push("e.tipo_emergencia = ?");
      params.push(tipo_emergencia);
    }

    if (prioridad) {
      conditions.push("e.prioridad = ?");
      params.push(prioridad);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY e.fecha_creacion DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const emergencias = await req.db.all(sql, params);

    res.json({
      emergencias,
      total: emergencias.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Error al obtener emergencias:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener emergencia específica
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    let sql = `
            SELECT e.*, u.nombre as usuario_nombre, u.telefono as usuario_telefono,
                   u.ubicacion_lat as usuario_lat, u.ubicacion_lng as usuario_lng
            FROM emergencias e 
            JOIN usuarios u ON e.usuario_id = u.id 
            WHERE e.id = ?
        `;

    const params = [id];

    // Ciudadanos solo pueden ver sus propias emergencias
    if (req.user.tipo_usuario === "ciudadano") {
      sql += " AND e.usuario_id = ?";
      params.push(req.user.id);
    }

    const emergencia = await req.db.get(sql, params);

    if (!emergencia) {
      return res.status(404).json({ error: "Emergencia no encontrada" });
    }

    // Obtener historial de estados
    const historial = await req.db.all(
      `SELECT h.*, u.nombre as usuario_nombre 
             FROM historial_estados h 
             JOIN usuarios u ON h.usuario_cambio_id = u.id 
             WHERE h.emergencia_id = ? 
             ORDER BY h.fecha_cambio ASC`,
      [id]
    );

    // Obtener asignaciones
    const asignaciones = await req.db.all(
      `SELECT a.*, 
                    op.nombre as operador_nombre,
                    un.nombre as unidad_nombre
             FROM asignaciones_emergencia a 
             LEFT JOIN usuarios op ON a.operador_id = op.id
             LEFT JOIN usuarios un ON a.unidad_asignada_id = un.id
             WHERE a.emergencia_id = ?
             ORDER BY a.fecha_asignacion DESC`,
      [id]
    );

    res.json({
      emergencia,
      historial,
      asignaciones,
    });
  } catch (error) {
    console.error("Error al obtener emergencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar estado de emergencia (solo operadores y unidades)
router.put(
  "/:id/estado",
  auth,
  authorize(["operador", "bombero", "policia", "ambulancia"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado, comentario } = req.body;

      if (!estado) {
        return res.status(400).json({ error: "Estado es requerido" });
      }

      if (
        !["pendiente", "en_proceso", "atendida", "cancelada"].includes(estado)
      ) {
        return res.status(400).json({
          error: "Estado debe ser: pendiente, en_proceso, atendida o cancelada",
        });
      }

      // Obtener estado actual
      const emergencia = await req.db.get(
        "SELECT estado FROM emergencias WHERE id = ?",
        [id]
      );
      if (!emergencia) {
        return res.status(404).json({ error: "Emergencia no encontrada" });
      }

      // Actualizar emergencia
      const updateData = [estado];
      let updateSql =
        "UPDATE emergencias SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP";

      // Si se marca como atendida, registrar fecha de atención
      if (estado === "atendida") {
        updateSql += ", fecha_atencion = CURRENT_TIMESTAMP";
      }

      updateSql += " WHERE id = ?";
      updateData.push(id);

      await req.db.run(updateSql, updateData);

      // Registrar en historial
      await req.db.run(
        `INSERT INTO historial_estados (emergencia_id, estado_anterior, estado_nuevo, usuario_cambio_id, comentario) 
             VALUES (?, ?, ?, ?, ?)`,
        [id, emergencia.estado, estado, req.user.id, comentario || ""]
      );

      res.json({ message: "Estado actualizado exitosamente" });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Asignar emergencia a una unidad (solo operadores)
router.post("/:id/asignar", auth, authorize(["operador"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { unidad_asignada_id, observaciones } = req.body;

    if (!unidad_asignada_id) {
      return res
        .status(400)
        .json({ error: "ID de unidad asignada es requerido" });
    }

    // Verificar que la emergencia existe
    const emergencia = await req.db.get(
      "SELECT * FROM emergencias WHERE id = ?",
      [id]
    );
    if (!emergencia) {
      return res.status(404).json({ error: "Emergencia no encontrada" });
    }

    // Verificar que la unidad existe y es del tipo correcto
    const unidad = await req.db.get(
      "SELECT * FROM usuarios WHERE id = ? AND tipo_usuario IN (?, ?, ?)",
      [unidad_asignada_id, "bombero", "policia", "ambulancia"]
    );

    if (!unidad) {
      return res
        .status(400)
        .json({ error: "Unidad no encontrada o tipo incorrecto" });
    }

    // Crear asignación
    await req.db.run(
      `INSERT INTO asignaciones_emergencia (emergencia_id, operador_id, unidad_asignada_id, observaciones) 
             VALUES (?, ?, ?, ?)`,
      [id, req.user.id, unidad_asignada_id, observaciones]
    );

    // Actualizar estado de la emergencia
    await req.db.run(
      "UPDATE emergencias SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?",
      ["en_proceso", id]
    );

    // Registrar en historial
    await req.db.run(
      `INSERT INTO historial_estados (emergencia_id, estado_anterior, estado_nuevo, usuario_cambio_id, comentario) 
             VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        emergencia.estado,
        "en_proceso",
        req.user.id,
        `Asignada a ${unidad.nombre}`,
      ]
    );

    res.json({ message: "Emergencia asignada exitosamente" });
  } catch (error) {
    console.error("Error al asignar emergencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener estadísticas de emergencias (solo operadores)
router.get(
  "/stats/dashboard",
  auth,
  authorize(["operador"]),
  async (req, res) => {
    try {
      const stats = {};

      // Total de emergencias por estado
      const estadosStats = await req.db.all(`
            SELECT estado, COUNT(*) as count 
            FROM emergencias 
            GROUP BY estado
        `);
      stats.por_estado = estadosStats;

      // Total de emergencias por tipo
      const tiposStats = await req.db.all(`
            SELECT tipo_emergencia, COUNT(*) as count 
            FROM emergencias 
            GROUP BY tipo_emergencia
        `);
      stats.por_tipo = tiposStats;

      // Emergencias del día
      const hoyStats = await req.db.all(`
            SELECT tipo_emergencia, COUNT(*) as count 
            FROM emergencias 
            WHERE DATE(fecha_creacion) = DATE('now')
            GROUP BY tipo_emergencia
        `);
      stats.hoy = hoyStats;

      // Tiempo promedio de respuesta
      const tiempoPromedio = await req.db.get(`
            SELECT AVG(tiempo_respuesta) as promedio 
            FROM emergencias 
            WHERE tiempo_respuesta IS NOT NULL
        `);
      stats.tiempo_promedio_respuesta = tiempoPromedio?.promedio || 0;

      res.json(stats);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default router;
