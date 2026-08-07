# Defensoría Oficial Civil — San Rafael
## Entorno Unificado de Gestión Judicial | Ministerio Público de la Defensa (Mendoza)

Plataforma moderna, escalable y susceptible de automatizaciones para la gestión integral de causas, plazos procesales, trámites Ley 26.657 (Salud Mental), convenios OSEP y atención ciudadana en la Segunda Circunscripción Judicial de San Rafael, Mendoza.

---

### 🌟 Características Principales

1. **Gestión de Plazos Procesales Perentorios**:
   - Semáforo visual en tiempo real (**VENCE HOY**, **URGENTE**, **EN PLAZO**, **VENCIDO**).
   - Filtros dinámicos por iniciales de defensores/as (*LA, JB, JP, AD*).
   - Alertas push procesales en vivo.

2. **Ingreso/Egreso de Causas & Ley de Salud Mental N° 26.657**:
   - Registro unificado de causas ingresadas por **GEJU**, **IOL Judicial Mendoza** o **Mail**.
   - Tratamiento prioritario para internaciones involuntarias y amparos de salud mental.

3. **Tablero Kanban de Tareas Diarias**:
   - Gestión por asignado e hitos procesales (*ASUME, CONTESTA VISTA, AMPARO, INF SUMARIA*).

4. **Convenios y Gestiones OSEP**:
   - Reclamos de medicamentos y prótesis ante OSEP.
   - Seguimiento extrajudicial de alimentos, régimen de comunicación y división de bienes.

5. **Libro Digital de Atención al Público**:
   - Consultas presenciales, llamadas y mensajes de WhatsApp.

6. **Informes Estadísticos MPD**:
   - Generación automática de reportes cuantitativos trimestrales.
   - Exportación lista para impresión/PDF con membrete oficial del MPD Mendoza.

---

### 🎭 Sistema Multi-Tema Visual (5 Estéticas Integradas)

El entorno cuenta con un motor estético de 5 vías con persistencia local y soporte para **Modo Claro ☀️ / Oscuro 🌙**:
- 🎨 **Físico (Skeuomorphism)**: Recreación de escritorio en madera de caoba, cuero, libreta legal y pergaminos.
- 📐 **Plano (Flat Design)**: Rellenos sólidos de alto contraste sin sombras ni gradientes.
- 🫧 **Suave (Neumorphism / Soft UI)**: Superficie mate extruida con par de sombras suaves duales.
- 🧸 **Arcilla (Claymorphism)**: Tarjetas y botones pasteles flotantes con radios sobredimensionados (`26px`) y sombras de 3 capas.
- 💎 **Vidrio Líquido (Apple Liquid Glass)**: Controles flotantes en vidrio traslúcido con refracción (`backdrop-filter`) sobre contenido 100% nítido y opaco.

---

### 🚀 Despliegue en Producción (Dokploy / Docker VPS)

Este proyecto cuenta con soporte de empaquetado multi-etapa en Docker:
- `Dockerfile`: Node 20 (build) + Nginx Alpine (runtime).
- `nginx.conf`: Configuración SPA con compresión Gzip y rutas fallback a `index.html`.

#### Comandos Locales:
```bash
# Instalación de dependencias
npm install

# Servidor de desarrollo
npm run dev

# Compilación de producción
npm run build
```
