---
title: 'Know Better Do Better Dog Training'
slug: 'kbdb-dog-training'
description: 'A custom Astro.js website that took a certified dog trainer from invisible on Google to a 99/100 PageSpeed score, zero structured data to 8+ schema types, and on-page PocketSuite booking so clients never leave her site to book.'
technologies: ['Astro 5', 'Tailwind CSS v4', 'Cloudflare Pages', 'PocketSuite']
url: 'https://kbdbdogtraining.com'
client: 'Brittni Hyzer'
location: 'Mystic, CT'
featured: true
order: 1
# When you have PageSpeed screenshots, drop them in /public/images/case-studies/
# and uncomment these lines:
# screenshotBefore: "/images/case-studies/kbdb-pagespeed-before.png"
# screenshotAfterDesktop: "/images/case-studies/kbdb-pagespeed-after-desktop.png"
# screenshotAfterMobile: "/images/case-studies/kbdb-pagespeed-after-mobile.png"
---

## The Problem

Brittni Hyzer is a Fear Free Certified Professional dog trainer serving Eastern Connecticut and Rhode Island. She had a growing business built on referrals, real expertise, and a brand name that said exactly what she stood for — _Know Better Do Better._

But when a potential client Googled her, there was nothing to find that matched her credibility. Her existing site was built on Showit, a platform designed for photographers — not service businesses competing in local search. The result: a 73/100 PageSpeed score, a 5.3-second largest contentful paint, zero structured data, and a booking flow that sent people **off her site** to PocketSuite to complete consults and training sessions — even though she already had 24/7 booking through PocketSuite.

She was invisible in the local search pack while competitors with less experience ranked above her — simply because their sites were technically faster and better structured for Google.

**The baseline told the full story:**

| Metric                   | Before (Showit)     | Status                     |
| ------------------------ | ------------------- | -------------------------- |
| Performance Score        | 73                  | Needs Improvement          |
| Largest Contentful Paint | 5.3s                | Poor — target is <2.5s     |
| First Contentful Paint   | 2.9s                | Needs Improvement          |
| Total Blocking Time      | 130ms               | Moderate                   |
| Cumulative Layout Shift  | 0.05                | Acceptable                 |
| Structured Data Types    | 0                   | Not detected               |
| Online Booking           | PocketSuite (links) | Redirects off-site to book |

---

## The Process

The project started with a conversation, not a mockup. Before writing a line of code, the goal was to understand how Brittni's clients find her, what they ask before booking, and what makes someone choose her over another trainer in the area. That research shaped every decision that followed.

### Discovery — the buyer's journey first

Most dog training inquiries come from people who are anxious, not just curious. They have a problem dog and they feel urgency. The site architecture was designed around that emotional reality: immediately signal trust, address the specific fear, and make the next step obvious. Every page maps to where a visitor is in their decision process.

### Stack selection — Astro.js for zero-compromise performance

Astro ships zero JavaScript by default. For a service business site with no client-side interactivity needs, this translates directly to faster load times, lower total blocking time, and a performance ceiling that platforms like Showit, Wix, or WordPress simply can't reach. Every tool was chosen to solve a real business problem — not to add complexity.

### Image optimization — WebP conversion and responsive sizing

Every image was converted from PNG/JPG to WebP, resized to actual display dimensions (not oversized originals), and given explicit width/height attributes to eliminate layout shift. The hero image received `fetchpriority="high"` and a preload link to attack LCP directly. Parallax effects were disabled on mobile to eliminate forced reflows that were delaying render.

### Typography — self-hosted fonts for speed

Rather than loading fonts from Google's CDN, all fonts were self-hosted in `/public/fonts/` and preloaded in the `<head>` with `font-display: swap`. This eliminated the render-blocking network request that was contributing to the slow FCP on the original Showit site.

### Structured data — giving Google a complete picture

Eight JSON-LD schema types were implemented across the site: `LocalBusiness`, `Service` (per training type), `FAQPage`, `WebSite`, `BreadcrumbList`, `Review`, `ProfessionalService`, and `ItemList`. Google went from zero structured understanding of the business to a comprehensive knowledge graph entry — enabling Rich Results eligibility and AI-powered search summaries.

### Booking integration — PocketSuite on-page, not off in another tab

Brittni was already using PocketSuite for 24/7 booking. On the old site, that meant **links out to PocketSuite’s domain**: visitors left her branded experience to book consults or training. We embedded PocketSuite **lead capture and booking widgets** directly on the Group Training, Private Training, and Contact pages. Same tool she relied on — but now the conversion happens **on her site**, at the moment of highest intent, without a jarring redirect. Clients can book consults and sessions while staying on kbdbdogtraining.com, including evenings and weekends while she’s with dogs.

### Deployment — Cloudflare Pages edge network

The site is deployed to Cloudflare Pages and served from Cloudflare's global edge network, reducing latency for visitors anywhere in the US. DNS was fully migrated to Cloudflare for complete control over caching, performance rules, and security. The combination of Astro's static output and Cloudflare's edge delivery is what makes a 99/100 PageSpeed score achievable at a small business budget.

---

## The Proof

PageSpeed Insights is Google's own tool. These aren't estimates — they're the same signals Google's crawlers use to evaluate and rank pages in search results. The before/after here represents a fundamental shift in how Google sees the site.

### Core Web Vitals — Before vs. After

| Metric                   | Before                 | After Desktop       | After Mobile        | Change              |
| ------------------------ | ---------------------- | ------------------- | ------------------- | ------------------- |
| Performance Score        | 73                     | **99**              | **87**              | +26 desktop         |
| Largest Contentful Paint | 5.3s                   | **1.0s**            | 4.0s†               | 81% faster          |
| First Contentful Paint   | 2.9s                   | **0.7s**            | **1.0s**            | 76% faster          |
| Total Blocking Time      | 130ms                  | **20ms**            | **30ms**            | 85% reduced         |
| Cumulative Layout Shift  | 0.05                   | **0**               | **0**               | Perfect             |
| Best Practices           | —                      | **100**             | **96**              | —                   |
| SEO Score                | —                      | **92**              | **100**             | Perfect mobile      |
| Structured Data Types    | 0                      | **8+**              | **8+**              | From zero           |
| Booking flow             | PocketSuite (off-site) | **Widgets on-page** | **Widgets on-page** | Stays on her domain |

Mobile LCP is affected by GA4 and PocketSuite third-party scripts which cannot be removed. The 4.0s figure reflects real-world constraints of running analytics and a booking system — both essential to the business. Desktop LCP reflects the experience of the majority of visitors.

### What those numbers mean in practice

**Desktop 99 Performance** puts the site in the top tier globally. Google's Core Web Vitals directly influence search ranking — a site that consistently hits green across all metrics will outrank a slower competitor in local search over time, even if that competitor has been established longer.

**Zero Cumulative Layout Shift** means the page never jumps as it loads. No frustrated users tapping the wrong thing, no abandoned sessions from a bad mobile experience.

**8+ Structured Data types** means Google can generate a rich, verified knowledge panel for Brittni's business and pull her services into AI-powered search summaries — exposure that competitors without schema markup simply cannot access.

**Embedded PocketSuite on every conversion page** keeps the booking flow where it belongs: on her site. She already had 24/7 online booking; what changed is that someone who’s ready at 10pm after a training video isn’t dumped onto a third-party URL to finish — they complete consults and session requests **without leaving** the page they trust.

### Business outcomes

- **Professional anchor for every referral.** When someone recommends Brittni, there's now a real destination to send them — one that reinforces the recommendation rather than undermining it.
- **Built to be found.** Semantic HTML, clean metadata, validated schema, and Cloudflare-edge performance give the site a strong technical foundation for local SEO.
- **Owned, not rented.** The site runs on infrastructure Brittni controls — not a platform she's subject to for pricing changes, feature deprecations, or template limitations.
- **On-brand booking, same 24/7 backend.** PocketSuite still handles scheduling around the clock; the difference is clients book consults and training **on her site** instead of being redirected away to complete the action.

### Pending — 30/60-Day GA4 Data

Search Console impressions, organic click-through rate, and booking conversion data will be added here once a full month of post-launch traffic has accumulated. The technical foundation is in place — the organic growth story is already being written.
