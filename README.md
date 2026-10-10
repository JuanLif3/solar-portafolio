# Portafolio · Sistema Solar

Portafolio interactivo construido con React + Vite + React Three Fiber.
Presenta tres proyectos reales, el Trabajo Integrador ISI802 (Power BI +
Notebooks) y conclusiones sobre vulnerabilidad territorial en Colchagua.

## Stack
- React 18 + Vite + TypeScript
- React Three Fiber + Drei + Three.js
- React Router DOM
- Recharts (gráficos Power BI incrustados)
- CSS Modules / CSS plano por componente

## Cómo correr localmente
\`\`\`bash
git clone https://github.com/JuanLif3/<repo>.git
cd <repo>
npm install
npm run dev
\`\`\`

## Cómo desplegar
Conectado a Vercel. Push a `main` → build automático → preview por PR.
Build: `npm run build` · Output: `dist/`

## Estructura
\`\`\`
src/
  components/   → componentes reutilizables (Scene, HUD, Readout…)
  pages/        → rutas (SolarSystem, PowerBI, Notebooks, Proyectos)
  store/        → estado global (Zustand-like store propio)
  styles/       → CSS por feature
\`\`\`

## Declaración de uso de IA
Se usó IA como asistente de desarrollo (revisión, redacción, variantes CSS).
Todo el código fue comprendido y adaptado por el autor.

## Autor
Juan Riveros · [GitHub](https://github.com/JuanLif3)