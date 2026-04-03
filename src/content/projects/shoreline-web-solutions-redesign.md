---
title: "Shoreline Web Solutions"
slug: "shoreline-web-solutions-redesign"
description: "A full rebuild of our own website — from a slow, template-era WordPress site to a hand-coded Astro.js system scoring 100 on desktop and 92 on mobile."
technologies: ["Astro.js", "Tailwind CSS v4", "Cloudflare Pages", "Structured Data", "PageSpeed Optimization"]
url: "https://shorelinewebsolutions.com"
featured: true
order: 2
---

## The Problem

There's a certain irony in a web performance company running a slow website. Ours was doing exactly that.

The original shorelinewebsolutions.com was built during an earlier phase of the business — functional, presentable, but built the way most small business sites are built: quickly, on a familiar platform, without rigorous attention to the technical signals that actually drive search visibility and conversion.

When we ran a baseline audit in early 2026, the numbers told the story clearly:

| Metric | Baseline |
|---|---|
| Performance (Mobile) | 73 |
| Largest Contentful Paint | 4.8s |
| First Contentful Paint | 2.9s |
| Total Blocking Time | 130ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 5.0s |
| Structured Data Items | 0 |

Zero structured data. An H1 containing only the business name with no keyword signal. A title tag missing location keywords entirely. Duplicate nav markup for desktop and mobile. No canonical tags, no Open Graph tags.

The site looked fine. It was technically broken where it mattered most — in the signals Google uses to decide whether to send anyone there in the first place.

We weren't practicing what we preached. That had to change.

---

## The Process

### Positioning First

Before touching a single component, we locked in the strategic foundation. The old site used generic agency language — "we build websites for small businesses." The rebuild needed language that communicated what we actually sell: outcomes, not deliverables.

The new positioning: **"We don't build websites. We build growth systems."**

Every page, every headline, every service description was rewritten around this frame. Services were renamed and reordered around business outcomes:

- *Built to Convert. Built to Last.* — Custom Web Development
- *Software That Fits the Way You Work.* — Custom Application Development
- *Do More. Touch Less.* — Automation Solutions
- *Get Found. Get Chosen. Get Ahead.* — SEO & Performance Optimization

### Stack Selection

The rebuild was written from scratch in **Astro.js** with **Tailwind CSS v4**. No WordPress. No page builder. No template.

Astro's island architecture means zero JavaScript ships to the browser unless explicitly needed. The entire homepage — hero, problem statement, service rows, testimonials, audit teaser, soft CTA — runs on static HTML and CSS with a single lightweight scroll-reveal observer. No framework overhead, no render-blocking scripts, no hydration penalty.

Tailwind v4's new `@theme` syntax allowed us to define brand tokens once in CSS and use them consistently across every component — colors, typography scale, spacing — without configuration files or plugin dependencies.

### SEO Infrastructure

Structured data was a first-class concern, not an afterthought. We built a reusable `StructuredData.astro` component that accepts a single schema object or an array, renders clean JSON-LD into the document head, and can be dropped into any page with a single line.

The homepage ships with:
- `LocalBusiness` schema (sitewide, injected via `Layout.astro`)
- `WebSite` schema with `SearchAction`
- `BreadcrumbList` on inner pages
- `Service` schema on each individual service page

Every page has a unique, keyword-rich title tag, meta description, canonical URL, Open Graph tags, and Twitter card metadata — generated from a single `SEO.astro` component that accepts props and handles the rest.

### Design System

The visual direction was built around the editorial aesthetic of modern developer tools — Linear, Vercel, Raycast. Dark background, tight typography, generous whitespace, no card grids.

Service content uses full-width stacked rows with scroll-triggered reveals. No carousels, no modals, no animated counters. The motion that exists — a CSS IntersectionObserver fade-up — is subtle and purposeful.

Typography is set in **Instrument Serif** (display) and **Inter** (body), loaded via Fontsource for zero external font requests at runtime.

### Infrastructure

The site is deployed on **Cloudflare Pages**, connected directly to the GitHub repository. Every push to `main` triggers an automatic build and deploy — no FTP, no manual uploads, no S3 bucket management.

Cloudflare's global CDN means assets are served from edge nodes closest to each visitor. The performance difference versus the previous AWS S3/CloudFront setup was immediate and measurable.

### The Audit Widget

One of the strategic differentiators on the new site is a free website audit tool at `/audit`. Visitors enter any URL and receive an instant report covering:

- PageSpeed score and Core Web Vitals
- SEO fundamentals (title, meta description, H1, image alt text, canonical)
- Structured data detection
- SSL/HTTPS status
- Mobile friendliness
- Open Graph tags

Results are ungated — no email required. The audit serves as both a lead generation tool and a proof-of-competence signal. If we can diagnose your site's problems in 60 seconds, imagine what we can do with full access.

---

## The Proof

We shipped the rebuild and ran PageSpeed Insights the same day. The results exceeded our targets on desktop and came within range on mobile:

| Metric | Before | After (Mobile) | After (Desktop) | Target |
|---|---|---|---|---|
| Performance | 73 | **92** | **100** | 95+ |
| Largest Contentful Paint | 4.8s | **2.6s** | **0.7s** | <1.5s |
| First Contentful Paint | 2.9s | **2.6s** | **0.7s** | <1.0s |
| Total Blocking Time | 130ms | **0ms** | **0ms** | <50ms |
| Cumulative Layout Shift | 0 | **0** | **0.011** | <0.1 |
| Speed Index | 5.0s | **3.1s** | **0.7s** | — |
| Accessibility | — | **95** | **95** | — |
| Best Practices | — | **100** | **100** | — |
| SEO Score | — | **100** | **100** | — |
| Structured Data Items | 0 | **7+** | **7+** | 7+ |

**Desktop Performance: 100. TBT: 0ms. SEO: 100.**

The 19-point mobile performance jump came from the infrastructure switch alone — before any image optimization or font loading tuning. The remaining mobile gap (FCP/LCP at 2.6s vs. the <1.5s target) is attributable to font rendering on throttled mobile connections and is the next optimization target.

The zero structured data problem is fully resolved. Every page now ships with relevant JSON-LD, making the site eligible for rich results in Google Search for the first time.

---

*Organic traffic and ranking data will be added at the 30 and 60-day marks as Google Search Console data accumulates.*
