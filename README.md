# Portafolio · Sistema Solar Interactivo

Portafolio profesional construido con **React + Vite + TypeScript** y **React Three Fiber**, que presenta tres proyectos reales desplegados, el Trabajo Integrador de Business Intelligence (ISI802) sobre vulnerabilidad territorial en la Región de O'Higgins, y una síntesis de los hallazgos del análisis.

**Demo en vivo:** [https://tu-proyecto.vercel.app](https://tu-proyecto.vercel.app)
**Repositorio:** [https://github.com/tu-usuario/tu-repo](https://github.com/tu-usuario/tu-repo)

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite, TypeScript |
| 3D / WebGL | Three.js, React Three Fiber, Drei |
| Enrutado | React Router DOM |
| Gráficos | Recharts (adaptación visual del reporte Power BI) |
| Estilos | CSS por componente |
| Deploy | Vercel (CI/CD desde GitHub) |
| Análisis BI | Python, Pandas, scikit-learn, Power BI Desktop |

---

## Cómo correr el proyecto localmente

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Cómo desplegar

El proyecto está conectado a **Vercel** con despliegue continuo desde la rama `main`.

- **Push a `main`** → build automático en Vercel → deploy a producción.
- **Pull Requests** → preview deploy automático.
- **Build de producción:** `npm run build`
- **Output:** `dist/`
- **Preview local del build:** `npm run preview`

No se requiere configuración adicional: Vercel detecta Vite automáticamente y ejecuta el pipeline desde GitHub en cada push.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Scene.tsx            # Canvas 3D principal (React Three Fiber)
│   ├── Sun.tsx              # Sol con shader propio
│   ├── Planet.tsx           # Planetas orbitando + etiquetas HTML
│   ├── CameraFollow.tsx     # Cámara que sigue al planeta enfocado
│   ├── HUD.tsx              # Interfaz superior/inferior (navegación, velocidad, atajos)
│   ├── PlanetReadout.tsx    # Panel lateral CRT con información de cada sección
│   ├── PlanetPanel.tsx      # Panel alternativo (usado en mobile como fallback)
│   ├── WarpOverlay.tsx      # Animación de salto hiperespacial
│   ├── WarpPortal.tsx       # Lógica de navegación con warp entre rutas
│   └── PowerBICharts.tsx    # Gráficos Recharts que replican el dashboard de Power BI
├── pages/
│   ├── SolarSystem.tsx      # Página principal (sistema solar)
│   ├── Proyectos.tsx        # Listado de proyectos desplegados
│   ├── PowerBI.tsx          # Sección del dashboard ISI802
│   └── Notebooks.tsx        # Sección de notebooks del análisis
├── store/
│   ├── system.ts            # Estado global (sección activa, foco, warp, velocidad)
│   └── planetPositions.ts   # Posiciones 3D compartidas entre Planet y CameraFollow
├── styles/                  # CSS por feature
└── App.tsx                  # Definición de rutas
```

---

## Power BI: decisión técnica y limitación del entorno

El reporte **Power BI (`.pbix`)** fue desarrollado como parte del Trabajo Integrador de la asignatura **ISI802 · Business Intelligence** y está disponible para descarga.

**Limitación:** la cuenta institucional de AIEP (proveedor de correo) **no permite publicar el reporte en la web pública** mediante la funcionalidad *"Publish to web"*, requisito para incrustar un iframe interactivo dentro del sitio.

**Solución adoptada:** para que el contenido sea visible sin depender de permisos externos, se replicaron las **visualizaciones principales** con **Recharts** —mismo dataset, misma paleta oficial de Power BI— y se ofrece la **descarga del archivo `.pbix`** para explorar el reporte completo en Power BI Desktop.

Esta decisión está documentada como una **restricción del entorno, no como una omisión**. El código de los gráficos está en `src/components/PowerBICharts.tsx` y los datos son los mismos del Trabajo Integrador.

---

## Notebooks del análisis

Los notebooks del análisis de Business Intelligence están publicados y accesibles:

- **Google Colab:** [Abrir notebook](https://colab.research.google.com/drive/1jBhoUPe6ihNb3irfjyFBdul8XhiYQS2Y)
- **Repositorio del análisis:** [github.com/Crisx-Dev/Proyecto_Analitica_Colchagua](https://github.com/Crisx-Dev/Proyecto_Analitica_Colchagua)

El notebook documenta el pipeline completo: ETL de 4 fuentes oficiales (ODEPA, CONAF, SII, Open-Meteo), construcción de un modelo estrella dimensional, clustering K-Means y forecast de series temporales. Todas las fuentes son públicas y el análisis es reproducible.

---

## Perfil profesional

**Técnico en Programación y Análisis de Sistemas** con foco en el ecosistema **TypeScript** (React, Next.js, NestJS). Tres proyectos reales desplegados en producción. Interés activo en ciberseguridad y en el uso de IA como herramienta de desarrollo.

- **Frontend:** React, Next.js, Vite
- **Backend:** NestJS, Node.js
- **Datos:** PostgreSQL, Neon
- **Deploy:** Vercel
- **Herramientas:** Git, GitHub, IntelliJ IDEA
- **BI:** Power BI Desktop, Pandas, scikit-learn

---

## Declaración de uso de IA

Este proyecto fue construido con asistencia de IA como **herramienta de desarrollo**: sugerencias de CSS, revisión de código, redacción de textos técnicos y generación de variantes visuales. Todo el código fue **comprendido, adaptado y validado** por el autor, quien puede explicar cada decisión técnica en la defensa del proyecto. La IA fue copiloto, no piloto.

---

## Autor

**Juan Riveros**
Técnico en Programación y Análisis de Sistemas
Full Stack Developer · TypeScript · React · NestJS

- GitHub: [@JuanLif3](https://github.com/JuanLif3)
- LinkedIn: [/in/tu-usuario](https://linkedin.com/in/tu-usuario)
- Email: tu@correo.com

---

## Licencia

Proyecto académico y de portafolio personal. Todos los derechos reservados.