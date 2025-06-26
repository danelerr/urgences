# Urgences - Sistema de Emergencias Simplificado

## 📋 Descripción
Urgences es un sistema de emergencias ultra simplificado diseñado para estudiantes de primaria. Utiliza únicamente HTML, CSS y JavaScript vanilla, sin bases de datos ni servidores complejos.

## 🚀 Características
- **Sin instalación**: Solo abrir el archivo HTML en cualquier navegador
- **Datos locales**: Utiliza localStorage para guardar información
- **Responsive**: Funciona en computadoras, tablets y móviles
- **Intuitivo**: Interfaz simple y fácil de usar
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
