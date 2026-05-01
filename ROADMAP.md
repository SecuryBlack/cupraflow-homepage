# OxiPulse Homepage — Hoja de Ruta

> **Stack:** Next.js 15 · Tailwind CSS v4 · MDX · Framer Motion · Shiki
> **Dominio:** oxipulse.dev
> **Paleta:** `#3B82F6` (primary) · `#0E0E0E` (bg) · `#F0F0F0` (text)

---

## FASE 1 — Esqueleto del proyecto

- [x] **1.1** Init Next.js 15 con App Router y TypeScript
- [x] **1.2** Configurar Tailwind CSS v4
- [x] **1.3** Definir design tokens (colores, tipografía, espaciado) en CSS vars
- [x] **1.4** Instalar dependencias: Framer Motion, Shiki, next-mdx-remote, lucide-react
- [x] **1.5** Estructura de carpetas (`/app`, `/components`, `/content`, `/lib`)
- [x] **1.6** Fuente tipográfica: Inter o Geist (variable fonts)
- [x] **1.7** Configurar metadata global (og:image, favicon, SEO base)

---

## FASE 2 — Componentes base (Design System)

- [x] **2.1** `<Layout>` — wrapper con nav + footer
- [x] **2.2** `<Navbar>` — logo + links + CTA "Get Started" (responsive, scroll-aware)
- [x] **2.3** `<Footer>` — links, "An open-source project by SecuryBlack", GitHub
- [x] **2.4** `<Button>` — variantes: primary, ghost, outline + soporte href/Link
- [x] **2.5** `<Badge>` — variantes: primary, neutral, success, warning + dot indicator
- [x] **2.6** `<CodeBlock>` — copy button, header tipo terminal, mono font
- [x] **2.7** `<Card>` — props: hover, glow

---

## FASE 3 — Landing Page (`/`)

- [x] **3.1** `<Hero>` — tagline + descripción + install snippet + CTA buttons
- [x] **3.2** `<PulseAnimation>` — animación SVG ECG animada con glow
- [x] **3.3** `<StatsBar>` — integrado en Hero: 2MB · <0.1% CPU · gRPC · Rust
- [x] **3.4** `<Features>` — 6 cards con iconos y animaciones stagger
- [x] **3.5** `<HowItWorks>` — diagrama Server → Agent → gRPC → Dashboard
- [x] **3.6** `<InstallSection>` — tabs Linux/Windows con pasos numerados
- [x] **3.7** `<OpenSourceSection>` — Apache 2.0, GitHub, self-hostable
- [x] **3.8** `<CTASection>` — bloque final con pulse animation

---

## FASE 4 — Página de instalación (`/install`)

- [x] **4.1** Instrucciones Linux (curl + systemd)
- [x] **4.2** Instrucciones Windows (PowerShell + Windows Service)
- [x] **4.3** Configuración de token / endpoint OTLP + tabla de variables de entorno
- [x] **4.4** Verificación post-instalación + gestión del servicio (start/stop/logs)
- [x] **4.5** Arquitecturas soportadas (x86_64, ARM64) + tabla de plataformas
- [x] **4.6** Uninstall + Next steps cards

---

## FASE 5 — Docs (`/docs`)

- [x] **5.1** Sistema de rutas para docs con layout propio
- [x] **5.2** Sidebar sticky con highlight de ruta activa + drawer móvil
- [x] **5.3** `Introduction` — qué es OxiPulse, arquitectura, licencia
- [x] **5.4** `Quick Start` — instalar y tener datos en 5 minutos
- [x] **5.5** `Configuration` — tabla de env vars + config.toml + systemd override
- [x] **5.6** `Metrics` — tabla de métricas OTLP + payload example + detalles por SO
- [x] **5.7** `Offline Buffer` — flujo, ubicaciones, límites de disco
- [x] **5.8** `Auto-Update` — flujo, logs, deshabilitar, pinning de versión
- [x] **5.9** `Contributing` — setup local, estructura, PR guide, licencia

---

## FASE 6 — Changelog (`/changelog`)

- [x] **6.1** Datos de releases en `lib/changelog.ts` (fácil de actualizar)
- [x] **6.2** Timeline visual con versiones, badges, secciones Added/Fixed/Changed

---

## FASE 7 — SEO, Performance y Deploy

- [x] **7.1** og:image dinámico con Next.js ImageResponse (edge runtime)
- [x] **7.2** sitemap.xml automático
- [x] **7.3** robots.txt
- [x] **7.4** Security headers en vercel.json (X-Frame-Options, CSP, etc.)
- [x] **7.5** favicon SVG con el logo de pulso
- [x] **7.6** 404 page personalizada
- [ ] **7.7** Deploy en Vercel → ver instrucciones abajo
- [ ] **7.8** Dominio oxipulse.dev apuntando al deploy

## Deploy en Vercel (manual)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desde la carpeta del proyecto
cd oxi-pulse-homepage
vercel

# 3. Seguir el wizard:
#    - Link to existing project? No → nuevo
#    - Project name: oxi-pulse-homepage
#    - Framework: Next.js (detectado automáticamente)
#    - Build command: npm run build
#    - Output dir: .next

# 4. Para deploy de producción
vercel --prod
```

### Dominio personalizado (oxipulse.dev)
En el dashboard de Vercel → Settings → Domains → añadir `oxipulse.dev`
Vercel genera los DNS records a apuntar en tu registrar.

---

## FASE 8 — Fase 2 (post-lanzamiento)

- [x] **8.1** `/blog` — sistema MDX con listado + posts individuales con next-mdx-remote
- [x] **8.2** `/community` — GitHub, issues, PR, licencia, nota sobre SecuryBlack
- [x] **8.3** Búsqueda con Pagefind — modal Cmd+K, indexa 16 páginas automáticamente en build
- [ ] **8.4** Internacionalización (ES/EN) si se requiere

---

## Orden de ejecución recomendado

```
Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 7 → Fase 5 → Fase 6 → Fase 8
```

El sitio es **lanzable públicamente** al terminar Fase 4.
Fase 5 en adelante mejora la documentación y comunidad.
