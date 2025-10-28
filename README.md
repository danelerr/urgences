# 🚨 Urgences - Sistema de Emergencias

Sistema web avanzado para gestión de emergencias con mapas interactivos y funcionalidades de geolocalización mejoradas.

## ✨ Mejoras Recientes Implementadas

### 🆕 **ÚLTIMAS ACTUALIZACIONES - Dashboard Completo y Gestión Avanzada**

#### 📊 1. Dashboard de Operador Completo (Estilo Refactor1)
- **Panel lateral profesional** con scroll independiente
- **Estadísticas en tiempo real**:
  - Contador de emergencias activas
  - Unidades disponibles
  - Total de usuarios en el sistema
- **Gestión completa de emergencias**:
  - Lista con filtros por estado y tipo
  - Click para centrar emergencia en mapa
  - Asignación manual de unidades
  - Vista detallada de cada emergencia
- **Gestión de usuarios**:
  - Lista completa de todos los usuarios
  - Cambio de estado de cualquier usuario
  - Información detallada (email, tipo, estado)
- **Botón toggle** para mostrar/ocultar el dashboard
- **Diseño responsivo** adaptado a mobile

#### 🚒 2. Panel Mejorado para Unidades de Emergencia
- **Sistema de pestañas**:
  - "Mis Emergencias Asignadas"
  - "Emergencias Disponibles"
- **Control de estado propio**:
  - Selector de estado (Disponible/En Servicio/Fuera de Servicio)
  - Visible en la parte superior del panel
- **Auto-asignación inteligente**:
  - Cada unidad solo ve emergencias de su tipo
  - Botón "Asignarme" en emergencias disponibles
  - Validación automática del estado antes de asignar
  - Estado cambia automáticamente a "En Servicio" al asignarse
- **Gestión de emergencias asignadas**:
  - Selector para cambiar estado de emergencia
  - Botón "Desasignar" para liberar la emergencia
  - Al resolver emergencia, estado vuelve a "Disponible"
  - Al desasignarse, estado vuelve a "Disponible"
- **Panel inferior** con scroll para mejor visualización

#### 🎨 3. Diseño y UX Mejorados
- **Colores distintivos** por tipo de unidad y emergencia
- **Badges de estado** con colores intuitivos
- **Animaciones suaves** en hover y transiciones
- **Responsive design completo** para todos los tamaños de pantalla
- **Scrollbars personalizados** en listas largas

### ✅ 4. Emojis Corregidos
- Todos los emojis se muestran correctamente en la interfaz
- Iconos consistentes en toda la aplicación (🚨, 🔥, 👮, 🚑, 📍, 🎯)

### 📍 5. Botón "Mi Ubicación" Mejorado
- **Funcionalidad**: Centra el mapa automáticamente en tu ubicación actual
- **Características**:
  - Animación suave de centrado del mapa (zoom 17)
  - Marcador azul distintivo con efecto de pulso
  - Manejo robusto de errores de geolocalización
  - Información de coordenadas en tiempo real
  - Retroalimentación visual durante la carga

### 🎯 6. Selector de Ubicación Estilo Uber
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

3. **🚨 Reportar Emergencia**:
   - Haz clic en "Reportar Emergencia"
   - Primero selecciona una ubicación (usando "Mi Ubicación" o "Seleccionar Ubicación")
   - Completa el formulario con tipo y descripción
   - Haz clic en "Reportar"

### Para Operadores:
1. **Ver Dashboard**:
   - Al iniciar sesión, verás un panel lateral con todas las estadísticas
   - Usa el botón "✕" para ocultar el panel y ver mejor el mapa
   - Usa el botón "📊 Dashboard" para volver a mostrar el panel

2. **Gestionar Emergencias**:
   - Usa los filtros para ver emergencias por estado o tipo
   - Haz clic en cualquier emergencia para centrarla en el mapa
   - Usa el botón "Asignar" para asignar una emergencia a una unidad disponible
   - Selecciona la unidad del listado que aparecerá

3. **Gestionar Usuarios**:
   - Scroll hasta la sección "Gestión de Usuarios"
   - Haz clic en "Cambiar Estado" para modificar el estado de cualquier usuario
   - Los colores indican el tipo de usuario y su estado actual

### Para Unidades (Bombero/Policía/Ambulancia):
1. **Controlar tu Estado**:
   - En la parte superior del panel inferior, verás un selector de estado
   - Cambia entre "Disponible", "En Servicio" o "Fuera de Servicio"
   - Tu estado se actualiza automáticamente al asignarte o resolver emergencias

2. **Ver Emergencias Asignadas**:
   - En la pestaña "Mis Emergencias Asignadas" verás tus emergencias actuales
   - Haz clic en cualquier emergencia para centrarla en el mapa
   - Usa el selector de estado para actualizar el progreso
   - Usa el botón "Desasignar" si necesitas liberar la emergencia

3. **Auto-asignarte Emergencias**:
   - Cambia a la pestaña "Emergencias Disponibles"
   - Verás solo las emergencias de tu tipo (bombero ve emergencias de bomberos, etc.)
   - Asegúrate de estar en estado "Disponible"
   - Haz clic en "Asignarme" en la emergencia que quieras atender
   - Tu estado cambiará automáticamente a "En Servicio"

4. **Resolver Emergencias**:
   - Ve a "Mis Emergencias Asignadas"
   - Cambia el estado a "Resuelto" en el selector
   - Tu estado volverá automáticamente a "Disponible"
   - La emergencia desaparecerá de tu lista

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
- **Dashboard completo** con estadísticas en tiempo real:
  - Emergencias activas
  - Unidades disponibles
  - Total de usuarios
- **Gestión de emergencias**:
  - Ve todas las emergencias del sistema
  - Filtros por estado y tipo
  - Puede asignar emergencias a unidades disponibles
  - Click en emergencias para centrar en el mapa
- **Gestión de usuarios**:
  - Ve lista completa de usuarios
  - Puede cambiar el estado de cualquier usuario
  - Vista organizada por tipo de usuario
- **Panel colapsable** para mejor visualización del mapa
- **Toggle button** para mostrar/ocultar el dashboard

### 🚒 Unidades de Emergencia (Bombero, Policía, Ambulancia)
- **Control de estado personal**:
  - Disponible
  - En Servicio
  - Fuera de Servicio
- **Panel con dos pestañas**:
  1. **Mis Emergencias Asignadas**:
     - Lista de emergencias asignadas al usuario
     - Puede cambiar el estado de la emergencia
     - Botón para desasignarse
     - Al resolver una emergencia, estado vuelve a "Disponible"
  2. **Emergencias Disponibles**:
     - Lista de emergencias sin asignar del tipo de unidad
     - Botón "Asignarme" para auto-asignación
     - Solo ve emergencias de su tipo (bombero → bomberos, etc.)
- **Funcionalidades automáticas**:
  - Al asignarse una emergencia → estado cambia a "En Servicio"
  - Al resolver una emergencia → estado cambia a "Disponible"
  - Al desasignarse → estado cambia a "Disponible"
- **Click en emergencias** para centrar en el mapa

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
- ✅ Dashboard completo estilo refactor1 con:
  - Estadísticas en tiempo real (activas, unidades disponibles, total usuarios)
  - Lista de todas las emergencias con filtros
  - Gestión completa de usuarios
  - Toggle button para mostrar/ocultar panel
- ✅ Asignación manual de emergencias a unidades
- ✅ Click en emergencias para centrar en mapa
- ✅ Cambio de estado de usuarios
- ✅ Diseño responsive y adaptable

### Para Unidades
- ✅ Control de estado personal (Disponible/En Servicio/Fuera de Servicio)
- ✅ **Panel con sistema de pestañas**:
  - Pestaña "Mis Emergencias Asignadas"
  - Pestaña "Emergencias Disponibles"
- ✅ **Auto-asignación de emergencias**:
  - Botón "Asignarme" en emergencias disponibles
  - Filtrado automático por tipo de unidad
  - Validación de estado antes de asignar
- ✅ **Gestión de emergencias asignadas**:
  - Cambiar estado de emergencia
  - Botón para desasignarse
  - Cambio automático de estado al resolver
- ✅ **Cambios automáticos de estado**:
  - Al asignarse → "En Servicio"
  - Al resolver → "Disponible"
  - Al desasignarse → "Disponible"
- ✅ Click en emergencias para centrar en mapa

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
refactor2/
├── index.html          # Página principal con toda la interfaz
├── app.js              # Lógica principal de la aplicación
├── auth.js             # Autenticación y gestión de usuarios
├── emergencies.js      # Gestión de emergencias
├── map.js              # Funcionalidades del mapa interactivo
├── styles.css          # Archivo principal que importa todos los CSS
├── css/
│   ├── base.css        # Estilos base y reset
│   ├── buttons.css     # Estilos de botones
│   ├── emergencies.css # Estilos de items de emergencia
│   ├── forms.css       # Estilos de formularios
│   ├── layout.css      # Layout y estructura
│   ├── login.css       # Pantalla de login
│   ├── map.css         # Estilos del mapa
│   ├── modal.css       # Estilos de modales
│   ├── panels.css      # Paneles (operador, unidades, ciudadano)
│   └── responsive.css  # Media queries y adaptación móvil
└── README.md           # Este archivo con documentación completa
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
