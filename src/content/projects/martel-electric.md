---
title: 'Martel Electric LLC'
slug: 'martel-electric'
description: 'A full website rebuild that took a Bootstrap-based electrician site from a 68 mobile PageSpeed score to 98, eliminated a 64.5-second mobile LCP, and hit a perfect 100 SEO score with 6 structured data schemas — all on Astro.js, Tailwind CSS, and Cloudflare Pages.'
technologies: ['Astro 5', 'Tailwind CSS 3', 'Cloudflare Pages', 'Web3Forms']
url: 'https://martel-electric-llc-v2.pages.dev'
client: 'Jeremy Martel'
location: 'Plainville, CT'
featured: true
order: 2
# When you have PageSpeed screenshots, drop them in /public/images/case-studies/
# and uncomment these lines:
# screenshotBefore: "/images/case-studies/martel-pagespeed-before.png"
# screenshotAfterDesktop: "/images/case-studies/martel-pagespeed-after-desktop.png"
# screenshotAfterMobile: "/images/case-studies/martel-pagespeed-after-mobile.png"
---

## The Problem

Martel Electric LLC had an existing website built with plain HTML, CSS, and Bootstrap. It functioned — pages loaded, the contact form worked, and the business information was there. But under the hood, the site had issues that were holding it back from showing up in local search results and converting visitors into leads.

The biggest problems were performance and SEO infrastructure. On mobile, the site scored a 68 on Google PageSpeed Insights with a Largest Contentful Paint (LCP) of 64.5 seconds — meaning the main content took over a minute to fully render on a mobile connection. Desktop scored 79 with an LCP of 1.8 seconds. The SEO score sat at 91 with several critical gaps: no structured data telling Google the business was an electrician, missing page-specific meta descriptions on inner pages, no sitemap, and no FAQ content targeting Google's AI Overview results.

The site loaded Bootstrap's full CSS and JavaScript framework from a CDN on every page, pulled fonts from Google Fonts via three separate external requests, and served unoptimized JPEG images with generic camera filenames like `IMG_6920.jpeg` that gave Google zero context about the content.

**The baseline told the full story:**

| Metric                   | Before (Desktop) | Before (Mobile) | Status                        |
| ------------------------ | ---------------- | --------------- | ----------------------------- |
| Performance Score        | 79               | 68              | Needs Improvement             |
| Largest Contentful Paint | 1.8s             | 64.5s           | Critical — target is <2.5s    |
| First Contentful Paint   | 1.5s             | 2.7s            | Needs Improvement             |
| Total Blocking Time      | 0ms              | 0ms             | Good                          |
| Cumulative Layout Shift  | 0.173            | 0               | Desktop needs improvement     |
| Speed Index              | 1.5s             | 4.3s            | Needs Improvement             |
| SEO Score                | 91               | 91              | Missing structured data & meta |
| Structured Data Types    | 0                | 0               | Not detected                  |

Jeremy Martel, the owner, built his business on 20+ years of quality electrical work and word-of-mouth referrals. The website needed to match that reputation — and actually help people find him when searching for an electrician in central Connecticut.

---

## The Process

### Platform Migration

We rebuilt the entire site from scratch using our standard production stack: Astro.js for static site generation, Tailwind CSS for styling, and Cloudflare Pages for hosting. This eliminated Bootstrap entirely — no more loading a full CSS framework just to use a grid system and a few button styles. Every byte of CSS on the new site is purpose-built for Martel Electric.

### Content Architecture

All existing content was carried over — services, project details, about page copy, contact information — and restructured across five clean pages: Homepage, Services, Projects, About, and Contact. Each page was built on a reusable Astro component architecture with a shared layout, SEO component, navigation, and footer, all pulling from a centralized data file. One source of truth, zero duplication.

### SEO Infrastructure

Every page received its own unique meta title, description, Open Graph tags, Twitter Card meta, and canonical URL — all generated automatically from the SEO component. Six JSON-LD structured data schemas were implemented across the site:

- **Electrician** schema on the homepage (business name, phone, address, service area, hours)
- **FAQPage** schema with four questions targeting Google AI Overviews
- **Service** schema with an OfferCatalog listing all service categories
- **CollectionPage** with ItemList for the projects gallery
- **ContactPage** and **AboutPage** schemas on their respective pages

FAQ sections were added on the homepage with concise answers designed for Google's AI Overview results — covering service areas, emergency availability, licensing, and pricing transparency.

A sitemap is auto-generated on every build via the @astrojs/sitemap integration, and a robots.txt points crawlers to it.

### Image Optimization

The original site had 53 images totaling 22MB, all served as uncompressed JPEGs with generic camera filenames. Every image was converted to WebP format, reducing total image weight to 10MB — a 55% reduction. Every file was renamed to a descriptive, SEO-friendly filename (e.g., `generac-generator-install-avon-ct.webp` instead of `IMG_6920.jpeg`).

For the homepage, multiple size variants were generated with responsive `srcset` and `sizes` attributes. The hero image serves a 768px version on mobile, 1280px on tablet, and the full resolution on desktop. Service card thumbnails serve 400px on mobile and 800px on desktop — cutting approximately 1.3MB from the mobile homepage payload alone.

### Font Optimization

Three external requests to Google Fonts were replaced with self-hosted woff2 files for DM Serif Display and Plus Jakarta Sans. Eight font files totaling just 125KB are served directly from the same domain — eliminating DNS lookups, connection negotiation, and render-blocking stylesheet downloads.

### Contact Form

The contact form was rebuilt with Web3Forms for serverless form handling, including phone number auto-formatting, a character counter, async submission with loading state, and a success confirmation — all without any backend infrastructure.

### Projects Gallery

Seven featured projects were built with a lightbox modal system. Clicking any project card opens a detailed overlay showing the project location, duration, services provided, and a photo gallery. Clicking any photo inside the modal opens a full-screen image viewer with previous/next navigation and keyboard support. All built with vanilla JavaScript — no libraries.

### Analytics & Tracking

Google Analytics 4 was configured and integrated into every page through the shared SEO component, with Google Search Console integration planned for launch.

---

## The Proof

### Core Web Vitals — Before vs. After

| Metric                   | Before (Desktop) | Before (Mobile) | After Desktop | After Mobile | Change                |
| ------------------------ | ---------------- | --------------- | ------------- | ------------ | --------------------- |
| Performance Score        | 79               | 68              | **97**        | **98**       | +18 desktop, +30 mobile |
| Largest Contentful Paint | 1.8s             | 64.5s           | **0.8s**      | **1.7s**     | 38× faster mobile     |
| First Contentful Paint   | 1.5s             | 2.7s            | **0.3s**      | **1.2s**     | 5× faster desktop     |
| Total Blocking Time      | 0ms              | 0ms             | **100ms**     | **0ms**      | —                     |
| Cumulative Layout Shift  | 0.173            | 0               | **0.091**     | **0**        | 47% reduced desktop   |
| Speed Index              | 1.5s             | 4.3s            | **0.5s**      | **3.7s**     | 3× faster desktop     |
| SEO Score                | 91               | 91              | **100**       | **100**      | Perfect score         |
| Best Practices           | 100              | 100             | **100**       | **100**      | Maintained            |

### Technical Improvements

| Area                     | Before                          | After                                       |
| ------------------------ | ------------------------------- | ------------------------------------------- |
| Total Image Weight       | 22 MB                           | **10 MB** (55% reduction)                   |
| Image Format             | JPEG/PNG                        | **WebP** (all 53+ images)                   |
| Image Filenames          | Generic (IMG_XXXX)              | **SEO-descriptive**                         |
| External Font Requests   | 3 (Google Fonts CDN)            | **0** (self-hosted woff2)                   |
| Font File Size           | ~150KB+ (estimated CDN)         | **125KB** (local woff2)                     |
| CSS Framework            | Bootstrap 5 (full)              | **Tailwind CSS** (purged, purpose-built)    |
| Structured Data Schemas  | 0                               | **6**                                       |
| Sitemap                  | None                            | **Auto-generated**                          |
| Page-Specific Meta       | Partial (homepage only)         | **All 5 pages**                             |
| FAQ/AEO Sections         | None                            | **4 questions**                             |
| Responsive Images        | None                            | **srcset + sizes on homepage**              |
| Hosting                  | Hostinger                       | **Cloudflare Pages** (global CDN)           |

### What those numbers mean in practice

**Mobile 98 Performance** puts the site in the top tier globally. The original 64.5-second mobile LCP was the most dramatic fix — a site that takes over a minute to render its main content on mobile is essentially invisible to Google. That number is now 1.7 seconds, a 38× improvement.

**Perfect 100 SEO on both desktop and mobile** means every technical SEO signal Google looks for is present and correctly implemented — structured data, meta descriptions, canonical URLs, Open Graph tags, sitemap, and proper heading hierarchy.

**Six structured data schemas** give Google a complete picture of the business: what it is, where it operates, what services it offers, and answers to common questions. This enables Rich Results eligibility and positions the business for AI-powered search summaries that competitors without schema markup simply cannot access.

**Zero CLS on mobile** means the page never shifts as it loads — no frustrated users tapping the wrong element, no abandoned sessions from a janky mobile experience.

### Business outcomes

- **Professional anchor for every referral.** When someone recommends Jeremy, there's now a fast, professional destination that reinforces the recommendation rather than undermining it.
- **Built to be found.** Semantic HTML, validated schema, comprehensive metadata, and Cloudflare-edge performance give the site a strong technical foundation for local SEO across all of Connecticut.
- **Real project photos, not stock imagery.** Every image on the site is from actual Martel Electric jobs — generators, panels, security cameras, shed wiring, service upgrades — building trust with visitors who want to see real work.
- **Owned infrastructure.** The site runs on a modern stack that Jeremy's team controls — not a platform subject to pricing changes, feature deprecations, or template limitations.

### Pending — 30/60-Day GA4 Data

Search Console impressions, organic click-through rate, and contact form conversion data will be added here once a full month of post-launch traffic has accumulated. The technical foundation is in place — the organic growth story is already being written.
