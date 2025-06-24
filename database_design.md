# Diseño de Base de Datos - Sistema de Emergencias FokinProt

## Diagrama de Base de Datos (Texto)

```
┌─────────────────────────────────────┐
│              USUARIOS               │
├─────────────────────────────────────┤
│ id (INTEGER, PRIMARY KEY)           │
│ nombre (TEXT, NOT NULL)             │
│ email (TEXT, UNIQUE, NOT NULL)      │
│ telefono (TEXT, NOT NULL)           │
│ password_hash (TEXT, NOT NULL)      │
│ tipo_usuario (TEXT, NOT NULL)       │ ← 'ciudadano', 'operador', 'bombero', 'policia', 'ambulancia'
│ estado (TEXT, DEFAULT 'activo')     │ ← 'activo', 'inactivo', 'en_servicio', 'fuera_servicio'
│ ubicacion_lat (REAL)                │
│ ubicacion_lng (REAL)                │
│ fecha_creacion (DATETIME)           │
│ fecha_actualizacion (DATETIME)      │
└─────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────┐
│            EMERGENCIAS              │
├─────────────────────────────────────┤
│ id (INTEGER, PRIMARY KEY)           │
│ usuario_id (INTEGER, FOREIGN KEY)   │ ← Referencia a USUARIOS.id
│ tipo_emergencia (TEXT, NOT NULL)    │ ← 'bomberos', 'ambulancia', 'policia'
│ descripcion (TEXT)                  │
│ ubicacion_lat (REAL, NOT NULL)      │
│ ubicacion_lng (REAL, NOT NULL)      │
│ direccion (TEXT)                    │
│ estado (TEXT, DEFAULT 'pendiente')  │ ← 'pendiente', 'en_proceso', 'atendida', 'cancelada'
│ prioridad (TEXT, DEFAULT 'media')   │ ← 'baja', 'media', 'alta', 'critica'
│ fecha_creacion (DATETIME)           │
│ fecha_actualizacion (DATETIME)      │
│ fecha_atencion (DATETIME)           │
│ tiempo_respuesta (INTEGER)          │ ← Tiempo en minutos
└─────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌─────────────────────────────────────┐
│        ASIGNACIONES_EMERGENCIA      │
├─────────────────────────────────────┤
│ id (INTEGER, PRIMARY KEY)           │
│ emergencia_id (INTEGER, FOREIGN KEY)│ ← Referencia a EMERGENCIAS.id
│ operador_id (INTEGER, FOREIGN KEY)  │ ← Referencia a USUARIOS.id (operador)
│ unidad_asignada_id (INTEGER, FK)    │ ← Referencia a USUARIOS.id (bombero/policia/ambulancia)
│ fecha_asignacion (DATETIME)         │
│ fecha_llegada (DATETIME)            │
│ observaciones (TEXT)                │
│ estado_asignacion (TEXT)            │ ← 'asignada', 'en_camino', 'en_sitio', 'completada'
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│         HISTORIAL_ESTADOS           │
├─────────────────────────────────────┤
│ id (INTEGER, PRIMARY KEY)           │
│ emergencia_id (INTEGER, FOREIGN KEY)│ ← Referencia a EMERGENCIAS.id
│ estado_anterior (TEXT)              │
│ estado_nuevo (TEXT)                 │
│ usuario_cambio_id (INTEGER, FK)     │ ← Quien cambió el estado
│ comentario (TEXT)                   │
│ fecha_cambio (DATETIME)             │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│            CONTACTOS                │
├─────────────────────────────────────┤
│ id (INTEGER, PRIMARY KEY)           │
│ tipo_servicio (TEXT, NOT NULL)      │ ← 'bomberos', 'ambulancia', 'policia'
│ nombre (TEXT, NOT NULL)             │
│ telefono (TEXT, NOT NULL)           │
│ direccion (TEXT)                    │
│ ubicacion_lat (REAL)                │
│ ubicacion_lng (REAL)                │
│ disponible (BOOLEAN, DEFAULT TRUE)  │
│ zona_cobertura (TEXT)               │
│ fecha_creacion (DATETIME)           │
└─────────────────────────────────────┘
```

## Relaciones y Restricciones

### Relaciones Principales:
1. **USUARIOS → EMERGENCIAS** (1:N)
   - Un usuario puede crear múltiples emergencias
   - Cada emergencia pertenece a un usuario

2. **EMERGENCIAS → ASIGNACIONES_EMERGENCIA** (1:N)
   - Una emergencia puede tener múltiples asignaciones
   - Cada asignación pertenece a una emergencia

3. **EMERGENCIAS → HISTORIAL_ESTADOS** (1:N)
   - Una emergencia puede tener múltiples cambios de estado
   - Cada cambio de estado pertenece a una emergencia

4. **USUARIOS → ASIGNACIONES_EMERGENCIA** (1:N)
   - Un operador puede tener múltiples asignaciones
   - Una unidad de respuesta puede estar en múltiples asignaciones

### Índices Recomendados:
```sql
-- Índices para mejorar rendimiento
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_emergencias_estado ON emergencias(estado);
CREATE INDEX idx_emergencias_tipo ON emergencias(tipo_emergencia);
CREATE INDEX idx_emergencias_fecha ON emergencias(fecha_creacion);
CREATE INDEX idx_emergencias_ubicacion ON emergencias(ubicacion_lat, ubicacion_lng);
CREATE INDEX idx_asignaciones_emergencia ON asignaciones_emergencia(emergencia_id);
CREATE INDEX idx_historial_emergencia ON historial_estados(emergencia_id);
```

## Tipos de Datos y Validaciones

### Tipos de Usuario:
- `ciudadano`: Usuario común que puede reportar emergencias
- `operador`: Personal que recibe y coordina emergencias
- `bombero`: Unidad de bomberos
- `policia`: Unidad policial
- `ambulancia`: Unidad de ambulancia

### Estados de Emergencia:
- `pendiente`: Emergencia recién creada, esperando asignación
- `en_proceso`: Emergencia asignada, unidad en camino
- `atendida`: Emergencia resuelta exitosamente
- `cancelada`: Emergencia cancelada (falsa alarma, etc.)

### Tipos de Emergencia:
- `bomberos`: Incendios, rescates, emergencias técnicas
- `ambulancia`: Emergencias médicas, accidentes
- `policia`: Seguridad, delitos, orden público

### Niveles de Prioridad:
- `baja`: Situaciones no urgentes
- `media`: Situaciones que requieren atención pronta
- `alta`: Situaciones urgentes
- `critica`: Situaciones que ponen en riesgo vidas

## Scripts de Creación

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
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
);

-- Tabla de emergencias
CREATE TABLE emergencias (
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
);

-- Tabla de asignaciones de emergencia
CREATE TABLE asignaciones_emergencia (
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
);

-- Tabla de historial de estados
CREATE TABLE historial_estados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emergencia_id INTEGER NOT NULL,
    estado_anterior TEXT,
    estado_nuevo TEXT NOT NULL,
    usuario_cambio_id INTEGER NOT NULL,
    comentario TEXT,
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emergencia_id) REFERENCES emergencias(id),
    FOREIGN KEY (usuario_cambio_id) REFERENCES usuarios(id)
);

-- Tabla de contactos de emergencia
CREATE TABLE contactos (
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
);
```

Este diseño de base de datos permite:
- Gestión completa de usuarios y sus roles
- Seguimiento detallado de emergencias desde creación hasta resolución
- Asignación eficiente de recursos de emergencia
- Historial completo para análisis y mejoras
- Información de contactos y disponibilidad de servicios
