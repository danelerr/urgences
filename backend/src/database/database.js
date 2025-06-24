import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

class Database {
  constructor() {
    this.dbPath = process.env.DB_PATH || "./database/emergencias.db";
    this.db = null;
  }

  init() {
    // Crear directorio de base de datos si no existe
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error("Error al conectar con la base de datos:", err.message);
          reject(err);
        } else {
          console.log("\u2705 Conectado a la base de datos SQLite");
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    const tables = [
      `CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                telefono TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('ciudadano', 'operador', 'bombero', 'policia', 'ambulancia')),
                estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'en_servicio', 'fuera_servicio')),
                ubicacion_lat REAL,
                ubicacion_lng REAL,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

      `CREATE TABLE IF NOT EXISTS emergencias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                tipo_emergencia TEXT NOT NULL CHECK (tipo_emergencia IN ('bomberos', 'ambulancia', 'policia')),
                descripcion TEXT,
                ubicacion_lat REAL NOT NULL,
                ubicacion_lng REAL NOT NULL,
                direccion TEXT,
                estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'atendida', 'cancelada')),
                prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_atencion DATETIME,
                tiempo_respuesta INTEGER,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )`,

      `CREATE TABLE IF NOT EXISTS asignaciones_emergencia (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                emergencia_id INTEGER NOT NULL,
                operador_id INTEGER NOT NULL,
                unidad_asignada_id INTEGER,
                fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                fecha_llegada DATETIME,
                observaciones TEXT,
                estado_asignacion TEXT DEFAULT 'asignada' CHECK (estado_asignacion IN ('asignada', 'en_camino', 'en_sitio', 'completada')),
                FOREIGN KEY (emergencia_id) REFERENCES emergencias(id),
                FOREIGN KEY (operador_id) REFERENCES usuarios(id),
                FOREIGN KEY (unidad_asignada_id) REFERENCES usuarios(id)
            )`,

      `CREATE TABLE IF NOT EXISTS historial_estados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                emergencia_id INTEGER NOT NULL,
                estado_anterior TEXT,
                estado_nuevo TEXT NOT NULL,
                usuario_cambio_id INTEGER NOT NULL,
                comentario TEXT,
                fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (emergencia_id) REFERENCES emergencias(id),
                FOREIGN KEY (usuario_cambio_id) REFERENCES usuarios(id)
            )`,

      `CREATE TABLE IF NOT EXISTS contactos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo_servicio TEXT NOT NULL CHECK (tipo_servicio IN ('bomberos', 'ambulancia', 'policia')),
                nombre TEXT NOT NULL,
                telefono TEXT NOT NULL,
                direccion TEXT,
                ubicacion_lat REAL,
                ubicacion_lng REAL,
                disponible BOOLEAN DEFAULT TRUE,
                zona_cobertura TEXT,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
    ];

    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)",
      "CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo_usuario)",
      "CREATE INDEX IF NOT EXISTS idx_emergencias_estado ON emergencias(estado)",
      "CREATE INDEX IF NOT EXISTS idx_emergencias_tipo ON emergencias(tipo_emergencia)",
      "CREATE INDEX IF NOT EXISTS idx_emergencias_fecha ON emergencias(fecha_creacion)",
      "CREATE INDEX IF NOT EXISTS idx_emergencias_ubicacion ON emergencias(ubicacion_lat, ubicacion_lng)",
      "CREATE INDEX IF NOT EXISTS idx_asignaciones_emergencia ON asignaciones_emergencia(emergencia_id)",
      "CREATE INDEX IF NOT EXISTS idx_historial_emergencia ON historial_estados(emergencia_id)",
    ];

    try {
      // Crear tablas
      for (const table of tables) {
        await this.run(table);
      }

      // Crear índices
      for (const index of indexes) {
        await this.run(index);
      }

      console.log("✅ Tablas e índices creados correctamente");

      // Crear datos de prueba
      await this.createSampleData();
    } catch (error) {
      console.error("Error al crear tablas:", error);
      throw error;
    }
  }

  async createSampleData() {
    try {
      // Verificar si ya hay datos
      const userCount = await this.get(
        "SELECT COUNT(*) as count FROM usuarios"
      );
      if (userCount.count > 0) {
        console.log("📊 Datos de muestra ya existen");
        return;
      }

      // Crear usuarios de prueba
      const hashedPassword = await bcrypt.hash("123456", 10);

      const sampleUsers = [
        {
          nombre: "Juan Pérez",
          email: "juan@ciudadano.com",
          telefono: "70123456",
          password_hash: hashedPassword,
          tipo_usuario: "ciudadano",
          ubicacion_lat: -17.783327,
          ubicacion_lng: -63.18214,
        },
        {
          nombre: "María García",
          email: "maria@operador.com",
          telefono: "70234567",
          password_hash: hashedPassword,
          tipo_usuario: "operador",
          ubicacion_lat: -17.784545,
          ubicacion_lng: -63.180856,
        },
        {
          nombre: "Carlos Bombero",
          email: "carlos@bomberos.com",
          telefono: "70345678",
          password_hash: hashedPassword,
          tipo_usuario: "bombero",
          estado: "en_servicio",
          ubicacion_lat: -17.785123,
          ubicacion_lng: -63.178945,
        },
        {
          nombre: "Ana Policía",
          email: "ana@policia.com",
          telefono: "70456789",
          password_hash: hashedPassword,
          tipo_usuario: "policia",
          estado: "en_servicio",
          ubicacion_lat: -17.782456,
          ubicacion_lng: -63.185234,
        },
        {
          nombre: "Luis Paramédico",
          email: "luis@ambulancia.com",
          telefono: "70567890",
          password_hash: hashedPassword,
          tipo_usuario: "ambulancia",
          estado: "en_servicio",
          ubicacion_lat: -17.786789,
          ubicacion_lng: -63.177123,
        },
      ];

      for (const user of sampleUsers) {
        await this.run(
          `INSERT INTO usuarios (nombre, email, telefono, password_hash, tipo_usuario, estado, ubicacion_lat, ubicacion_lng) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.nombre,
            user.email,
            user.telefono,
            user.password_hash,
            user.tipo_usuario,
            user.estado || "activo",
            user.ubicacion_lat,
            user.ubicacion_lng,
          ]
        );
      }

      // Crear contactos de emergencia
      const contactos = [
        {
          tipo_servicio: "bomberos",
          nombre: "Bomberos Santa Cruz",
          telefono: "119",
          direccion: "Av. Las Américas, Santa Cruz",
          ubicacion_lat: -17.785123,
          ubicacion_lng: -63.178945,
          zona_cobertura: "Plan 3000, Centro",
        },
        {
          tipo_servicio: "policia",
          nombre: "Policía Nacional",
          telefono: "110",
          direccion: "Plaza 24 de Septiembre, Santa Cruz",
          ubicacion_lat: -17.782456,
          ubicacion_lng: -63.185234,
          zona_cobertura: "Centro, Equipetrol",
        },
        {
          tipo_servicio: "ambulancia",
          nombre: "Cruz Roja Boliviana",
          telefono: "118",
          direccion: "Hospital Universitario, Santa Cruz",
          ubicacion_lat: -17.786789,
          ubicacion_lng: -63.177123,
          zona_cobertura: "Norte, Centro",
        },
      ];

      for (const contacto of contactos) {
        await this.run(
          `INSERT INTO contactos (tipo_servicio, nombre, telefono, direccion, ubicacion_lat, ubicacion_lng, zona_cobertura) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            contacto.tipo_servicio,
            contacto.nombre,
            contacto.telefono,
            contacto.direccion,
            contacto.ubicacion_lat,
            contacto.ubicacion_lng,
            contacto.zona_cobertura,
          ]
        );
      }

      console.log("Datos de muestra creados correctamente");
    } catch (error) {
      console.error("Error al crear datos de muestra:", error);
    }
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Conexión a la base de datos cerrada");
          resolve();
        }
      });
    });
  }
}

export default Database;
