# 🚨 Urgences - Sistema de Emergencias

Sistema web para gestión de emergencias con mapas interactivos y geolocalización.

## ✨ Características Principales

- 🗺️ **Mapa Interactivo**: Visualización en tiempo real con MapLibre GL
- 📍 **Geolocalización**: Botón "Mi Ubicación" y selector estilo Uber
- 👥 **Multi-usuario**: Ciudadanos, Operadores y Unidades de Emergencia
- 📊 **Dashboard**: Panel de control para operadores con estadísticas
- 🚒 **Auto-asignación**: Las unidades pueden asignarse emergencias
- 💾 **Persistencia**: Datos guardados en localStorage del navegador

## 👥 Tipos de Usuario

### 🧑‍💼 Ciudadano
- Reporta emergencias (Bomberos, Policía, Ambulancia)
- Selecciona ubicación en el mapa
- Ve el estado de sus reportes

### 👨‍💻 Operador
- Dashboard con estadísticas en tiempo real
- Gestiona todas las emergencias
- Asigna emergencias a unidades
- Administra usuarios del sistema

### 🚒 Unidades de Emergencia (Bombero, Policía, Ambulancia)
- Control de estado (Disponible/En Servicio/Fuera de Servicio)
- Auto-asignación de emergencias de su tipo
- Gestión de emergencias asignadas
- Cambio automático de estado

## 🔐 Usuarios de Prueba

| Tipo | Email | Contraseña |
|------|-------|------------|
| Ciudadano | ciudadano@test.com | 123456 |
| Operador | operador@test.com | 123456 |
| Bombero | bombero@test.com | 123456 |
| Policía | policia@test.com | 123456 |
| Ambulancia | ambulancia@test.com | 123456 |

## 🔧 Instalación y Uso

1. Abre `index.html` en tu navegador web
2. Inicia sesión con cualquier usuario de prueba
3. Explora las funcionalidades según tu tipo de usuario

## 📁 Estructura de Archivos

```
urgences/
├── index.html          # Página principal
├── app.js              # Lógica principal
├── auth.js             # Autenticación
├── emergencies.js      # Gestión de emergencias
├── map.js              # Mapa interactivo
├── styles.css          # Importa todos los CSS
├── css/                # Módulos CSS organizados
└── README.md           # Documentación
```

## 🌟 Tecnologías

- **Vanilla JavaScript** - Sin frameworks
- **CSS Grid y Flexbox** - Layout moderno
- **MapLibre GL** - Mapas interactivos
- **LocalStorage** - Persistencia de datos
- **Responsive Design** - Adaptable a móviles

## 🔄 Estados de Emergencia

- **Pendiente**: Esperando asignación
- **En Progreso**: Siendo atendida
- **Resuelto**: Completada

---

**Sistema educativo perfecto para aprender desarrollo web 🎉**
