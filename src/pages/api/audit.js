// src/pages/api/audit.js
export const prerender = false

export async function GET({ request }) {
  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get('url')

  if (!rawUrl) {
    return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let targetUrl = rawUrl.trim()
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl
  }

  try {
    const psiUrl = new URL(
      'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
    )
    psiUrl.searchParams.set('url', targetUrl)
    psiUrl.searchParams.set('strategy', 'mobile')
    psiUrl.searchParams.set('category', 'performance')
    psiUrl.searchParams.append('category', 'seo')
    psiUrl.searchParams.append('category', 'best-practices')
    psiUrl.searchParams.append('category', 'accessibility')

    if (import.meta.env.PAGESPEED_API_KEY) {
      psiUrl.searchParams.set('key', import.meta.env.PAGESPEED_API_KEY)
    }

    const [psiRes, htmlRes] = await Promise.allSettled([
      fetch(psiUrl.toString(), {
        signal: AbortSignal.timeout(25000),
      }),
      fetch(targetUrl, {
        headers: { 'User-Agent': 'ShorelineAuditBot/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
      }),
    ])

    // ── 3. Parse PageSpeed ──────────────────────────────────────
    let pagespeed = null

    if (psiRes.status === 'fulfilled' && psiRes.value.ok) {
      try {
        const psi = await psiRes.value.json()
        const lhr = psi.lighthouseResult || {}
        const cats = lhr.categories || {}
        const audits = lhr.audits || {}

        const safeScore = (key) => Math.round((cats[key]?.score || 0) * 100)
        const safeAuditScore = (key) =>
          Math.round((audits[key]?.score || 0) * 100)
        const safeDisplay = (key) => audits[key]?.displayValue || 'N/A'
        const safeNumeric = (key) => audits[key]?.numericValue || null
        const safeBool = (key) => audits[key]?.score === 1

        pagespeed = {
          scores: {
            performance: safeScore('performance'),
            seo: safeScore('seo'),
            bestPractices: safeScore('best-practices'),
            accessibility: safeScore('accessibility'),
          },
          coreWebVitals: {
            lcp: {
              value: safeDisplay('largest-contentful-paint'),
              score: safeAuditScore('largest-contentful-paint'),
              numericMs: safeNumeric('largest-contentful-paint'),
            },
            cls: {
              value: safeDisplay('cumulative-layout-shift'),
              score: safeAuditScore('cumulative-layout-shift'),
              numericValue: safeNumeric('cumulative-layout-shift'),
            },
            tbt: {
              value: safeDisplay('total-blocking-time'),
              score: safeAuditScore('total-blocking-time'),
              numericMs: safeNumeric('total-blocking-time'),
            },
            fcp: {
              value: safeDisplay('first-contentful-paint'),
              score: safeAuditScore('first-contentful-paint'),
              numericMs: safeNumeric('first-contentful-paint'),
            },
            si: {
              value: safeDisplay('speed-index'),
              score: safeAuditScore('speed-index'),
              numericMs: safeNumeric('speed-index'),
            },
          },
          mobile: {
            viewport: safeBool('viewport'),
            fontSize: safeBool('font-size'),
            tapTargets: safeBool('tap-targets'),
          },
          seoAudits: {
            hasTitle: safeBool('document-title'),
            hasMetaDescription: safeBool('meta-description'),
            isCrawlable: safeBool('is-crawlable'),
            hasCanonical: safeBool('canonical'),
            imageAlt: safeBool('image-alt'),
            linkText: safeBool('link-text'),
            httpStatusCode: safeBool('http-status-code'),
          },
          https: safeBool('is-on-https'),
        }
      } catch (parseErr) {
        console.log('PageSpeed parse error:', parseErr.message)
      }
    }

    // ── 4. Parse HTML ───────────────────────────────────────────
    let htmlAnalysis = null

    if (htmlRes.status === 'fulfilled' && htmlRes.value.ok) {
      try {
        const html = await htmlRes.value.text()
        const finalUrl = htmlRes.value.url

        // ── Structured data analysis ──────────────────────────
        const richResultEligibility = {
          LocalBusiness: {
            label: 'Local Business',
            description:
              'Enables your business to appear in local knowledge panels and map results.',
          },
          Organization: {
            label: 'Organization',
            description: 'Displays your brand info and logo in Google search.',
          },
          WebSite: {
            label: 'Sitelinks Searchbox',
            description:
              'Can add a search box directly in your Google listing.',
          },
          Product: {
            label: 'Product',
            description:
              'Shows price, availability, and reviews directly in search results.',
          },
          FAQPage: {
            label: 'FAQ',
            description:
              'Expands your search listing with collapsible Q&A directly on the results page.',
          },
          HowTo: {
            label: 'How-To',
            description:
              'Displays step-by-step instructions with images in search results.',
          },
          Article: {
            label: 'Article',
            description:
              'Eligible for Top Stories carousel and enhanced article display.',
          },
          BlogPosting: {
            label: 'Blog Post',
            description:
              'Eligible for Top Stories carousel and enhanced article display.',
          },
          Event: {
            label: 'Event',
            description:
              'Shows event dates, locations, and ticket info in search results.',
          },
          Review: {
            label: 'Review',
            description: 'Displays star ratings in search results.',
          },
          AggregateRating: {
            label: 'Star Ratings',
            description:
              'Shows aggregate star ratings directly in your search listing.',
          },
          BreadcrumbList: {
            label: 'Breadcrumbs',
            description:
              "Shows your site's navigation path in search results instead of just the URL.",
          },
          Service: {
            label: 'Service',
            description: 'Helps Google understand your specific services.',
          },
          Person: {
            label: 'Person',
            description: 'Displays personal information in knowledge panels.',
          },
          Recipe: {
            label: 'Recipe',
            description:
              'Shows cook time, ratings, and calories in search results.',
          },
          JobPosting: {
            label: 'Job Posting',
            description: 'Surfaces job listings directly in Google Jobs.',
          },
          Course: {
            label: 'Course',
            description: 'Displays course information in Google search.',
          },
          VideoObject: {
            label: 'Video',
            description:
              'Enables video thumbnails and timestamps in search results.',
          },
        }

        const jsonLdBlocks = extractAll(
          html,
          /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
        )

        const parsed = []
        const rawBlocks = []

        for (const block of jsonLdBlocks) {
          try {
            const obj = JSON.parse(block)
            rawBlocks.push(obj)
            if (obj['@graph']) {
              for (const item of obj['@graph']) {
                const types = Array.isArray(item['@type'])
                  ? item['@type']
                  : [item['@type']].filter(Boolean)
                parsed.push({ type: types, name: item.name || null })
              }
            } else {
              const types = Array.isArray(obj['@type'])
                ? obj['@type']
                : [obj['@type']].filter(Boolean)
              parsed.push({ type: types, name: obj.name || null })
            }
          } catch (e) {
            // malformed JSON-LD, skip
          }
        }

        // Determine which rich result types are present
        const allTypes = new Set(parsed.flatMap((p) => p.type))
        const eligibleResults = Object.entries(richResultEligibility)
          .filter(([type]) => allTypes.has(type))
          .map(([type, info]) => ({ type, ...info }))

        // Identify types found that aren't in our eligibility map (still report them)
        const unknownTypes = [...allTypes].filter(
          (t) => !richResultEligibility[t],
        )

        htmlAnalysis = {
          ssl: finalUrl.startsWith('https://'),
          finalUrl,
          title: extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
          metaDescription:
            extractAttr(
              html,
              /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
            ) ||
            extractAttr(
              html,
              /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i,
            ),
          h1Tags: extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(
            stripTags,
          ),
          h2Tags: extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi)
            .slice(0, 5)
            .map(stripTags),
          images: (() => {
            const imgTags = html.match(/<img[^>]*>/gi) || []
            const total = imgTags.length
            const withAlt = imgTags.filter((t) =>
              /alt=["'][^"']+["']/i.test(t),
            ).length
            return { total, withAlt, withoutAlt: total - withAlt }
          })(),
          hasViewport: /<meta[^>]*name=["']viewport["']/i.test(html),
          ogTitle: extractAttr(
            html,
            /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i,
          ),
          ogDescription: extractAttr(
            html,
            /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i,
          ),
          ogImage: extractAttr(
            html,
            /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i,
          ),
          structuredData: {
            count: parsed.length,
            types: parsed,
            eligibleRichResults: eligibleResults,
            unknownTypes,
            hasLocalBusiness: allTypes.has('LocalBusiness'),
            hasFAQ: allTypes.has('FAQPage'),
            hasBreadcrumbs: allTypes.has('BreadcrumbList'),
          },
          canonical: extractAttr(
            html,
            /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i,
          ),
        }
      } catch (htmlErr) {
        console.log('HTML parse error:', htmlErr.message)
      }
    }

    const result = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      pagespeed,
      htmlAnalysis,
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err) {
    console.log('AUDIT ENDPOINT ERROR:', err.message)
    return new Response(
      JSON.stringify({ error: 'Audit failed', message: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}

// ── Helpers ───────────────────────────────────────────────────

function extractTag(html, regex) {
  const match = html.match(regex)
  return match ? match[1].trim() : null
}

function extractAttr(html, regex) {
  const match = html.match(regex)
  return match ? match[1].trim() : null
}

function extractAll(html, regex) {
  const results = []
  let match
  while ((match = regex.exec(html)) !== null) {
    results.push(match[1].trim())
  }
  return results
}

function stripTags(str) {
  return str.replace(/<[^>]*>/g, '').trim()
}
