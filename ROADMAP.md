# CupraFlow Homepage â€” Hoja de Ruta

> **Stack:** Next.js 15 Â· Tailwind CSS v4 Â· MDX Â· Framer Motion Â· Shiki
> **Dominio:** CupraFlow.dev
> **Paleta:** `#B87333` (primary) Â· `#0E0E0E` (bg) Â· `#F0F0F0` (text)

---

## FASE 1 â€” Esqueleto del proyecto

- [x] **1.1** Init Next.js 15 con App Router y TypeScript
- [x] **1.2** Configurar Tailwind CSS v4
- [x] **1.3** Definir design tokens (colores, tipografÃ­a, espaciado) en CSS vars
- [x] **1.4** Instalar dependencias: Framer Motion, Shiki, next-mdx-remote, lucide-react
- [x] **1.5** Estructura de carpetas (`/app`, `/components`, `/content`, `/lib`)
- [x] **1.6** Fuente tipogrÃ¡fica: Inter o Geist (variable fonts)
- [x] **1.7** Configurar metadata global (og:image, favicon, SEO base)

---

## FASE 2 â€” Componentes base (Design System)

- [x] **2.1** `<Layout>` â€” wrapper con nav + footer
- [x] **2.2** `<Navbar>` â€” logo + links + CTA "Get Started" (responsive, scroll-aware)
- [x] **2.3** `<Footer>` â€” links, "An open-source project by SecuryBlack", GitHub
- [x] **2.4** `<Button>` â€” variantes: primary, ghost, outline + soporte href/Link
- [x] **2.5** `<Badge>` â€” variantes: primary, neutral, success, warning + dot indicator
- [x] **2.6** `<CodeBlock>` â€” copy button, header tipo terminal, mono font
- [x] **2.7** `<Card>` â€” props: hover, glow

---

## FASE 3 â€” Landing Page (`/`)

- [x] **3.1** `<Hero>` â€” tagline + descripciÃ³n + install snippet + CTA buttons
- [x] **3.2** `<PulseAnimation>` â€” animaciÃ³n SVG ECG animada con glow
- [x] **3.3** `<StatsBar>` â€” integrado en Hero: 2MB Â· <0.1% CPU Â· gRPC Â· Rust
- [x] **3.4** `<Features>` â€” 6 cards con iconos y animaciones stagger
- [x] **3.5** `<HowItWorks>` â€” diagrama Server â†’ Agent â†’ gRPC â†’ Dashboard
- [x] **3.6** `<InstallSection>` â€” tabs Linux/Windows con pasos numerados
- [x] **3.7** `<OpenSourceSection>` â€” Apache 2.0, GitHub, self-hostable
- [x] **3.8** `<CTASection>` â€” bloque final con pulse animation

---

## FASE 4 â€” PÃ¡gina de instalaciÃ³n (`/install`)

- [x] **4.1** Instrucciones Linux (curl + systemd)
- [x] **4.2** Instrucciones Windows (PowerShell + Windows Service)
- [x] **4.3** ConfiguraciÃ³n de token / endpoint OTLP + tabla de variables de entorno
- [x] **4.4** VerificaciÃ³n post-instalaciÃ³n + gestiÃ³n del servicio (start/stop/logs)
- [x] **4.5** Arquitecturas soportadas (x86_64, ARM64) + tabla de plataformas
- [x] **4.6** Uninstall + Next steps cards

---

## FASE 5 â€” Docs (`/docs`)

- [x] **5.1** Sistema de rutas para docs con layout propio
- [x] **5.2** Sidebar sticky con highlight de ruta activa + drawer mÃ³vil
- [x] **5.3** `Introduction` â€” quÃ© es CupraFlow, arquitectura, licencia
- [x] **5.4** `Quick Start` â€” instalar y tener datos en 5 minutos
- [x] **5.5** `Configuration` â€” tabla de env vars + config.toml + systemd override
- [x] **5.6** `Metrics` â€” tabla de mÃ©tricas OTLP + payload example + detalles por SO
- [x] **5.7** `Offline Buffer` â€” flujo, ubicaciones, lÃ­mites de disco
- [x] **5.8** `Auto-Update` â€” flujo, logs, deshabilitar, pinning de versiÃ³n
- [x] **5.9** `Contributing` â€” setup local, estructura, PR guide, licencia

---

## FASE 6 â€” Changelog (`/changelog`)

- [x] **6.1** Datos de releases en `lib/changelog.ts` (fÃ¡cil de actualizar)
- [x] **6.2** Timeline visual con versiones, badges, secciones Added/Fixed/Changed

---

## FASE 7 â€” SEO, Performance y Deploy

- [x] **7.1** og:image dinÃ¡mico con Next.js ImageResponse (edge runtime)
- [x] **7.2** sitemap.xml automÃ¡tico
- [x] **7.3** robots.txt
- [x] **7.4** Security headers en vercel.json (X-Frame-Options, CSP, etc.)
- [x] **7.5** favicon SVG con el logo de pulso
- [x] **7.6** 404 page personalizada
- [ ] **7.7** Deploy en Vercel â†’ ver instrucciones abajo
- [ ] **7.8** Dominio CupraFlow.dev apuntando al deploy

## Deploy en Vercel (manual)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desde la carpeta del proyecto
cd oxi-pulse-homepage
vercel

# 3. Seguir el wizard:
#    - Link to existing project? No â†’ nuevo
#    - Project name: oxi-pulse-homepage
#    - Framework: Next.js (detectado automÃ¡ticamente)
#    - Build command: npm run build
#    - Output dir: .next

# 4. Para deploy de producciÃ³n
vercel --prod
```

### Dominio personalizado (CupraFlow.dev)
En el dashboard de Vercel â†’ Settings â†’ Domains â†’ aÃ±adir `CupraFlow.dev`
Vercel genera los DNS records a apuntar en tu registrar.

---

## FASE 8 â€” Fase 2 (post-lanzamiento)

- [x] **8.1** `/blog` â€” sistema MDX con listado + posts individuales con next-mdx-remote
- [x] **8.2** `/community` â€” GitHub, issues, PR, licencia, nota sobre SecuryBlack
- [x] **8.3** BÃºsqueda con Pagefind â€” modal Cmd+K, indexa 16 pÃ¡ginas automÃ¡ticamente en build
- [ ] **8.4** InternacionalizaciÃ³n (ES/EN) si se requiere

---

## Orden de ejecuciÃ³n recomendado

```
Fase 1 â†’ Fase 2 â†’ Fase 3 â†’ Fase 4 â†’ Fase 7 â†’ Fase 5 â†’ Fase 6 â†’ Fase 8
```

El sitio es **lanzable pÃºblicamente** al terminar Fase 4.
Fase 5 en adelante mejora la documentaciÃ³n y comunidad.
