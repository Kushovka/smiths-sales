import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from 'vite'

const siteUrl = 'https://smithssales.net'
const outputRoot = path.resolve('dist')
const baseHtml = await readFile(path.join(outputRoot, 'index.html'), 'utf8')
const pages = [
  { path: '/inventory', title: 'Used Car Inventory', description: "Browse used cars, SUVs, trucks, and crossovers at Smith's Sales & Services in Commodore, PA." },
  { path: '/delivery', title: 'Nationwide Vehicle Delivery', description: "Coordinate vehicle delivery from Smith's Sales & Services in Commodore, Pennsylvania." },
  { path: '/guarantee', title: '72-Hour / 250-Mile Money-Back Guarantee', description: "Review the return policy, process, and conditions for qualifying vehicles at Smith's Sales & Services." },
  { path: '/warranty', title: 'Warranty information', description: "Review limited warranty information and contact Smith's Sales & Services for coverage details on a specific vehicle." },
  { path: '/about', title: "About Smith's Sales & Services", description: "Meet Smith's Sales & Services, located in Commodore, Pennsylvania." },
  { path: '/team', title: 'Our Team', description: "Meet the people who make Smith's Sales & Services a friendly place to find and service a vehicle." },
  { path: '/contact', title: 'Contact', description: "Call, visit, or send a message to Smith's Sales & Services in Commodore, PA." },
  { path: '/privacy-policy', title: 'Privacy Policy', description: "Read the Smith's Sales & Services privacy policy for website leads, cookies, analytics, and dealership communication." },
  { path: '/terms', title: 'Terms', description: "Review Smith's Sales & Services website terms for inventory, pricing, warranty, and website use." },
]

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
const upsertMeta = (html, key, value, kind = 'name') => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta\\s+[^>]*${kind}=["']${escapedKey}["'][^>]*>`, 'i')
  const tag = `<meta ${kind}="${escapeHtml(key)}" content="${escapeHtml(value)}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}
const upsertCanonical = (html, url) => {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`
  const pattern = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}
const setPageHead = (html, { path: pagePath, title, description, image = '/images/smiths-sales-hero.webp', schema, type = 'website' }) => {
  const fullTitle = title.includes("Smith's Sales & Services") ? title : `${title} | Smith's Sales & Services`
  const canonical = `${siteUrl}${pagePath === '/' ? '/' : `${pagePath.replace(/\/+$/, '')}/`}`
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`
  let result = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`)
  result = upsertMeta(result, 'description', description)
  result = upsertMeta(result, 'robots', 'index, follow')
  result = upsertMeta(result, 'og:type', type, 'property')
  result = upsertMeta(result, 'og:title', fullTitle, 'property')
  result = upsertMeta(result, 'og:description', description, 'property')
  result = upsertMeta(result, 'og:url', canonical, 'property')
  result = upsertMeta(result, 'og:image', absoluteImage, 'property')
  result = upsertMeta(result, 'twitter:card', 'summary_large_image')
  result = upsertCanonical(result, canonical)
  if (schema) {
    const json = JSON.stringify(schema).replaceAll('<', '\\u003c')
    result = result.replace('</head>', `  <script id="page-schema-json" type="application/ld+json">${json}</script>\n  </head>`)
  }
  return result
}

for (const page of pages) {
  const html = setPageHead(baseHtml, page)
  const destination = path.join(outputRoot, page.path.slice(1), 'index.html')
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, html)
}

const env = loadEnv('production', process.cwd(), 'VITE_')
const configuredApi = (env.VITE_API_URL || 'http://127.0.0.1:8001').replace(/\/+$/, '')
const apiBase = configuredApi.startsWith('/') ? `${siteUrl}${configuredApi}` : configuredApi
let prerenderedVehicles = 0
try {
  const vehicles = []
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${apiBase}/vehicles?page=${page}&page_size=50`, { signal: AbortSignal.timeout(4000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const inventory = await response.json()
    vehicles.push(...(inventory.items ?? []))
    if (vehicles.length >= inventory.total || !inventory.items?.length) break
  }
  for (const vehicle of vehicles) {
    if (!vehicle.slug || vehicle.status?.toLowerCase() === 'hidden') continue
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`
    const description = vehicle.description || vehicle.short_description || `${title} for sale at Smith's Sales & Services in Commodore, PA.`
    const canonicalPath = `/inventory/${vehicle.slug}/`
    const canonical = `${siteUrl}${canonicalPath}`
    const image = vehicle.images?.[0] || '/images/vehicle-photo-coming-soon.webp'
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Vehicle',
      name: title,
      url: canonical,
      image: [image.startsWith('http') ? image : `${siteUrl}${image}`],
      description,
      brand: { '@type': 'Brand', name: vehicle.make },
      model: vehicle.model,
      vehicleModelDate: String(vehicle.year),
      mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'SMI' },
      ...(vehicle.price > 0 ? { offers: { '@type': 'Offer', url: canonical, price: vehicle.price, priceCurrency: 'USD', availability: vehicle.status?.toLowerCase() === 'sold' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', seller: { '@id': `${siteUrl}/#dealership` } } } : {}),
    }
    const html = setPageHead(baseHtml, { path: canonicalPath, title, description, image, schema, type: 'product' })
    const destination = path.join(outputRoot, 'inventory', vehicle.slug, 'index.html')
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, html)
    prerenderedVehicles += 1
  }
} catch (error) {
  console.warn(`SEO build: inventory could not be pre-rendered (${error.message}); vehicle pages will use client-rendered metadata.`)
}

console.log(`SEO build: generated HTML metadata for ${pages.length} static routes and ${prerenderedVehicles} vehicle routes.`)
