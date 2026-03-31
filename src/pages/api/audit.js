// src/pages/api/audit.js
export const prerender = false

export async function GET({ request }) {
  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get("url")

  if (!rawUrl) {
    return new Response(JSON.stringify({ error: "Missing ?url= parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  let targetUrl = rawUrl.trim()
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl
  }

  try {
    // ── 1. Build PageSpeed URL ──────────────────────────────────
    const psiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed")
    psiUrl.searchParams.set("url", targetUrl)
    psiUrl.searchParams.set("strategy", "mobile")
    psiUrl.searchParams.set("category", "performance")
    psiUrl.searchParams.append("category", "seo")
    psiUrl.searchParams.append("category", "best-practices")
    psiUrl.searchParams.append("category", "accessibility")

    if (import.meta.env.PAGESPEED_API_KEY) {
      psiUrl.searchParams.set("key", import.meta.env.PAGESPEED_API_KEY)
    }

    // ── 2. Fetch both in parallel ───────────────────────────────
    const [psiRes, htmlRes] = await Promise.allSettled([
      fetch(psiUrl.toString()),
      fetch(targetUrl, {
        headers: { "User-Agent": "ShorelineAuditBot/1.0" },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      }),
    ])

    // ── 3. Parse PageSpeed ──────────────────────────────────────
    let pagespeed = null

    if (psiRes.status === "fulfilled" && psiRes.value.ok) {
      try {
        const psi = await psiRes.value.json()
        const lhr = psi.lighthouseResult || {}
        const cats = lhr.categories || {}
        const audits = lhr.audits || {}

        const safeScore = (key) => Math.round((cats[key]?.score || 0) * 100)
        const safeAuditScore = (key) => Math.round((audits[key]?.score || 0) * 100)
        const safeDisplay = (key) => audits[key]?.displayValue || "N/A"
        const safeNumeric = (key) => audits[key]?.numericValue || null
        const safeBool = (key) => audits[key]?.score === 1

        pagespeed = {
          scores: {
            performance: safeScore("performance"),
            seo: safeScore("seo"),
            bestPractices: safeScore("best-practices"),
            accessibility: safeScore("accessibility"),
          },
          coreWebVitals: {
            lcp: {
              value: safeDisplay("largest-contentful-paint"),
              score: safeAuditScore("largest-contentful-paint"),
              numericMs: safeNumeric("largest-contentful-paint"),
            },
            cls: {
              value: safeDisplay("cumulative-layout-shift"),
              score: safeAuditScore("cumulative-layout-shift"),
              numericValue: safeNumeric("cumulative-layout-shift"),
            },
            tbt: {
              value: safeDisplay("total-blocking-time"),
              score: safeAuditScore("total-blocking-time"),
              numericMs: safeNumeric("total-blocking-time"),
            },
            fcp: {
              value: safeDisplay("first-contentful-paint"),
              score: safeAuditScore("first-contentful-paint"),
              numericMs: safeNumeric("first-contentful-paint"),
            },
            si: {
              value: safeDisplay("speed-index"),
              score: safeAuditScore("speed-index"),
              numericMs: safeNumeric("speed-index"),
            },
          },
          mobile: {
            viewport: safeBool("viewport"),
            fontSize: safeBool("font-size"),
            tapTargets: safeBool("tap-targets"),
          },
          seoAudits: {
            hasTitle: safeBool("document-title"),
            hasMetaDescription: safeBool("meta-description"),
            isCrawlable: safeBool("is-crawlable"),
            hasCanonical: safeBool("canonical"),
            imageAlt: safeBool("image-alt"),
            linkText: safeBool("link-text"),
            httpStatusCode: safeBool("http-status-code"),
          },
          https: safeBool("is-on-https"),
        }

        console.log("PageSpeed parsed OK — performance:", pagespeed.scores.performance)
      } catch (parseErr) {
        console.log("PageSpeed parse error:", parseErr.message)
      }
    } else {
      const status = psiRes.status === "fulfilled" ? psiRes.value.status : "rejected"
      const reason = psiRes.status === "rejected" ? psiRes.reason?.message : ""
      console.log("PageSpeed fetch failed:", status, reason)
    }

    // ── 4. Parse HTML ───────────────────────────────────────────
    let htmlAnalysis = null

    if (htmlRes.status === "fulfilled" && htmlRes.value.ok) {
      try {
        const html = await htmlRes.value.text()
        const finalUrl = htmlRes.value.url

        htmlAnalysis = {
          ssl: finalUrl.startsWith("https://"),
          finalUrl: finalUrl,
          title: extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
          metaDescription:
            extractAttr(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
            extractAttr(html, /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i),
          h1Tags: extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(stripTags),
          h2Tags: extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).slice(0, 5).map(stripTags),
          images: (() => {
            const imgTags = html.match(/<img[^>]*>/gi) || []
            const total = imgTags.length
            const withAlt = imgTags.filter((t) => /alt=["'][^"']+["']/i.test(t)).length
            return { total: total, withAlt: withAlt, withoutAlt: total - withAlt }
          })(),
          hasViewport: /<meta[^>]*name=["']viewport["']/i.test(html),
          ogTitle: extractAttr(html, /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i),
          ogDescription: extractAttr(html, /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i),
          ogImage: extractAttr(html, /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i),
          structuredData: (() => {
            const jsonLdBlocks = extractAll(html, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
            const parsed = []
            for (const block of jsonLdBlocks) {
              try {
                const obj = JSON.parse(block)
                if (obj["@graph"]) {
                  for (const item of obj["@graph"]) {
                    parsed.push({ type: item["@type"], name: item.name || null })
                  }
                } else {
                  parsed.push({ type: obj["@type"], name: obj.name || null })
                }
              } catch (e) {
                // malformed JSON-LD, skip
              }
            }
            return { count: parsed.length, types: parsed }
          })(),
          canonical: extractAttr(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i),
        }

        console.log("HTML parsed OK")
      } catch (htmlErr) {
        console.log("HTML parse error:", htmlErr.message)
      }
    }

    // ── 5. Respond ──────────────────────────────────────────────
    const result = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      pagespeed: pagespeed,
      htmlAnalysis: htmlAnalysis,
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    })

  } catch (err) {
    console.log("AUDIT ENDPOINT ERROR:", err.message)
    return new Response(
      JSON.stringify({ error: "Audit failed", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
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
  return str.replace(/<[^>]*>/g, "").trim()
}
