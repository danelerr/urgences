# 🚨 Urgences - Sistema de Emergencias

Sistema web avanzado para gestión de emergencias con mapas interactivos y funcionalidades de geolocalización mejoradas.

## ✨ Mejoras Recientes Implementadas

### ✅ 1. Emojis Corregidos
- Todos los emojis se muestran correctamente en la interfaz
- Iconos consistentes en toda la aplicación (🚨, 🔥, 👮, 🚑, 📍, 🎯)

### 📍 2. Botón "Mi Ubicación" Mejorado
- **Funcionalidad**: Centra el mapa automáticamente en tu ubicación actual
- **Características**:
  - Animación suave de centrado del mapa (zoom 17)
  - Marcador azul distintivo con efecto de pulso
  - Manejo robusto de errores de geolocalización
  - Información de coordenadas en tiempo real
  - Retroalimentación visual durante la carga

### 🎯 3. Selector de Ubicación Estilo Uber
- **Funcionalidad**: Permite seleccionar cualquier ubicación haciendo clic en el mapa
- **Características**:
  - Botón independiente "Seleccionar Ubicación"
  - Cursor crosshair durante la selección
  - Indicador visual con instrucciones claras y botón de cancelar
  - Marcador rojo para ubicaciones seleccionadas
  - Notificaciones elegantes de confirmación
  - Posibilidad de cancelar la selección en cualquier momento

## 🎮 Cómo Usar las Nuevas Funciones

### Para Ciudadanos:
1. **📍 Mi Ubicación**: 
   - Haz clic en el botón "📍 Mi Ubicación" en el panel derecho
   - Permite el acceso a la ubicación cuando el navegador lo solicite
   - El mapa se centrará automáticamente con un marcador azul

2. **🎯 Seleccionar Ubicación**:
   - Haz clic en el botón "🎯 Seleccionar Ubicación"
   - El cursor cambiará a una cruz y aparecerá un indicador visual
   - Haz clic en cualquier punto del mapa para seleccionar la ubicación
   - Se mostrará una notificación de confirmación

## Características Principales

### 🗺️ Mapa Interactivo
- Visualización de emergencias en tiempo real con MapLibre GL
- Diferentes colores para cada tipo de emergencia
- Click en el mapa para reportar emergencias
- Geolocalización avanzada con múltiples opciones

### 👤 Tipos de Usuario

**Ciudadano**: 
- Ve el mapa con emergencias
- Botón único para reportar
- Click en mapa para seleccionar ubicación

**Operador**:
- Ve todos los reportes en panel inferior
- Estadísticas por tipo de emergencia
- Gestión completa de incidencias

**Unidades (Bomberos/Policía/Ambulancia)**:
- Ven emergencias de su tipo
- Botón de enlace a Google Maps para navegación
- Control de estado (disponible/en servicio)
- **Educativo**: Ideal para enseñar conceptos básicos de programación web

## 👥 Tipos de Usuario

### 🧑‍💼 Ciudadano
- Puede reportar emergencias (Bomberos, Policía, Ambulancia)
- Ve sus emergencias reportadas
- Especifica descripción, dirección y prioridad

### 👨‍💻 Operador
- Ve todas las emergencias del sistema
- Puede asignar emergencias a unidades disponibles
- Ve estadísticas generales del sistema
- Gestiona el flujo de emergencias

### 🚒 Unidades de Emergencia (Bombero, Policía, Ambulancia)
- Ve emergencias asignadas
- **NUEVO:** Ve emergencias disponibles para auto-asignarse
- **NUEVO:** Puede auto-asignarse emergencias de su tipo
- Puede cambiar su estado (Disponible, En Servicio, Fuera de Servicio)
- Actualiza el estado de sus emergencias
- **Auto-cambio de estado:** Al asignarse una emergencia, cambia automáticamente a "En Servicio"

## 🔐 Usuarios de Prueba

| Tipo | Email | Contraseña |
|------|-------|------------|
| Ciudadano | ciudadano@test.com | 123456 |
| Operador | operador@test.com | 123456 |
| Bombero | bombero@test.com | 123456 |
| Policía | policia@test.com | 123456 |
| Ambulancia | ambulancia@test.com | 123456 |

## 📱 Funcionalidades

### Para Ciudadanos
- ✅ Botones grandes para reportar emergencias
- ✅ Formulario simple para describir la situación
- ✅ Lista de emergencias propias
- ✅ Estados de emergencia en tiempo real

### Para Operadores
- ✅ Dashboard con estadísticas
- ✅ Lista completa de emergencias
- ✅ Asignación automática de unidades
- ✅ Gestión de estados

### Para Unidades
- ✅ Control de estado personal
- ✅ Lista de emergencias asignadas
- ✅ **NUEVO:** Lista de emergencias disponibles para auto-asignarse
- ✅ **NUEVO:** Botón "Asignarme Esta Emergencia" 
- ✅ **NUEVO:** Filtrado automático por tipo de unidad
- ✅ **NUEVO:** Cambio automático de estado al asignarse
- ✅ Actualización de progreso

## 🎨 Diseño
- **Colores**: Gradientes modernos en azul y púrpura
- **Iconos**: Emojis para mejor comprensión
- **Animaciones**: Transiciones suaves y efectos hover
- **Responsive**: Adaptable a cualquier tamaño de pantalla

## 💾 Almacenamiento
- Utiliza localStorage del navegador
- Los datos persisten entre sesiones
- Datos de prueba se cargan automáticamente la primera vez

## 🔧 Instalación y Uso

1. **Descargar**: Guarda los archivos en una carpeta
2. **Abrir**: Abre `index.html` en cualquier navegador web
3. **Usar**: Inicia sesión con cualquier usuario de prueba
4. **Explorar**: Prueba las diferentes funcionalidades

## 📁 Estructura de Archivos

```
refactor/
├── index.html      # Página principal con toda la interfaz
├── styles.css      # Estilos responsivos y modernos
├── script.js       # Lógica de la aplicación
└── README.md       # Este archivo
```

## 🎓 Aspectos Educativos

### Conceptos que se pueden enseñar:
- **HTML**: Estructura de páginas web
- **CSS**: Estilos, responsive design, animaciones
- **JavaScript**: Variables, funciones, eventos, DOM
- **LocalStorage**: Almacenamiento local en el navegador
- **Interactividad**: Formularios, botones, modales
- **Responsive Design**: Adaptación a diferentes pantallas

## 🔄 Estados de Emergencia
- **Pendiente**: Recién reportada, esperando asignación
- **En Progreso**: Asignada a una unidad, siendo atendida
- **Resuelto**: Emergencia completada

## 🎯 Prioridades
- **Baja**: Situaciones no urgentes
- **Media**: Requerimientos normales
- **Alta**: Situaciones importantes
- **Crítica**: Emergencias que requieren atención inmediata

## 🌟 Características Técnicas
- **Vanilla JavaScript**: Sin frameworks externos
- **CSS Grid y Flexbox**: Layout moderno
- **Local Storage**: Persistencia de datos
- **Responsive Design**: Mobile-first approach
- **Accesibilidad**: Colores contrastantes y textos claros

## 🐛 Características Intencionalmente Simples
- No hay validación de email real
- No hay encriptación de contraseñas
- No hay verificación de ubicación GPS
- No hay notificaciones push
- No hay conexión a servicios externos

Esto es perfecto para el contexto educativo, donde el objetivo es enseñar los fundamentos sin complicaciones técnicas innecesarias.

## 🚀 Posibles Mejoras Futuras
- Agregar más tipos de emergencia
- Implementar sistema de notificaciones
- Añadir mapa interactivo
- Crear reportes y estadísticas avanzadas
- Agregar sistema de chat entre usuarios

---

**¡Perfecto para aprender y enseñar desarrollo web de forma práctica y divertida! 🎉**
