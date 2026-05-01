# OxiPulse Homepage

Official website for [OxiPulse](https://oxipulse.dev) — an ultralight, open-source server monitoring agent written in Rust by [SecuryBlack](https://securyblack.com).

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styles | Tailwind CSS v4 |
| Animations | Framer Motion |
| Deployment | Cloudflare Workers via OpenNext |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/install` | Installation guide (Linux, Windows) |
| `/docs` | Documentation (Introduction, Quick Start, Configuration, Metrics, Offline Buffer, Auto-Update, Contributing) |
| `/changelog` | Release history |
| `/blog` | Engineering blog |
| `/community` | Community & links |

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
npm run lint
```

## Deploy (Cloudflare Workers)

```bash
npx opennextjs-cloudflare build   # Builds Next.js + OpenNext adapter
npx wrangler deploy               # Deploys to Cloudflare Workers
```

The site deploys automatically on every push to `main` via Cloudflare CI/CD.

## Adding a blog post

Edit `lib/blog-data.ts` and add a new entry to the `posts` array. No filesystem or MDX pipeline required — content is bundled at build time.

## Project structure

```
app/                  Pages and routes (Next.js App Router)
components/
  layout/             Navbar, Footer, Docs sidebar
  sections/           Homepage sections (Hero, Features, etc.)
  ui/                 Shared UI components (Button, Badge, CodeBlock, ...)
lib/                  Data and utilities (blog, changelog)
public/               Static assets
content/blog/         Legacy MDX files (superseded by lib/blog-data.ts)
```

## License

This repository uses a dual license:

- **Source code** (components, scripts, styles) — [MIT](./LICENSE)
- **Written content, documentation and Markdown files** (`.md`, `.mdx`) — [CC BY 4.0](./LICENSE-CONTENT)

© 2025 [SecuryBlack](https://securyblack.com)
