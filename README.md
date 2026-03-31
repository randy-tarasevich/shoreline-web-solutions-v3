# Shoreline Web Solutions

Custom website for [shorelinewebsolutions.com](https://shorelinewebsolutions.com) — rebuilt from the ground up with SEO-first architecture, performance-optimized static rendering, and outcome-driven messaging.

## Tech Stack

- **Astro 5** — Static site generation with hybrid SSR for API endpoints
- **Tailwind CSS v4** — Utility-first styling via Vite plugin
- **Cloudflare Pages** — Hosting with serverless functions for SSR routes
- **Vanilla JS** — No client-side frameworks. Scroll reveal + mobile menu only.

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── global/          # Header, Footer, SEO, StructuredData
│   ├── home/            # Hero, ProblemStatement, ServiceRow, etc.
│   └── audit/           # AuditWidget (interactive island)
├── layouts/
│   └── Layout.astro     # Base HTML shell, wraps every page
├── pages/
│   ├── index.astro      # Homepage
│   ├── audit.astro      # Free audit tool
│   ├── services/        # Service pages
│   └── api/
│       └── audit.js     # SSR endpoint for audit widget
├── content/             # Content collections (services, projects, blog)
├── styles/
│   └── global.css       # Tailwind directives + brand tokens
└── assets/images/       # Processed by Astro Image component
```

## Deployment

Deployed to Cloudflare Pages via GitHub integration.

```bash
git push origin main    # auto-deploys
```

## PageSpeed API Key (Optional)

The audit widget works without an API key but has lower rate limits.
For production, copy `.env.example` to `.env` and add your key:

```
PAGESPEED_API_KEY=your_key_here
```

## License

© 2026 Shoreline Web Solutions. All rights reserved.
