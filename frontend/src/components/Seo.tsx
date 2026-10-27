import { useEffect } from 'react'
import { business } from '../data/business'

type SeoProps = {
  title: string
  description: string
  schema?: Record<string, unknown>
  image?: string
  openGraphType?: 'website' | 'product'
}

export const siteUrl = 'https://smithssales.net'

const upsertMeta = (selector: string, attributes: Record<string, string>, content: string) => {
  let meta = document.querySelector<HTMLMetaElement>(selector)
  if (!meta) {
    meta = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => meta?.setAttribute(key, value))
    document.head.appendChild(meta)
  }
  meta.content = content
}

export const Seo = ({ title, description, schema, image = '/images/smiths-sales-hero-1894.webp', openGraphType = 'website' }: SeoProps) => {
  useEffect(() => {
    const pageTitle = title.includes(business.name) ? title : `${title} | ${business.name}`
    const canonicalUrl = `${siteUrl}${window.location.pathname}`
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
    document.title = pageTitle
    upsertMeta('meta[name="description"]', { name: 'description' }, description)
    upsertMeta('meta[name="robots"]', { name: 'robots' }, 'index, follow')
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, openGraphType)
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, pageTitle)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description)
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl)
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl)
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, pageTitle)
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl)

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    const existing = document.querySelector('#page-schema-json')
    existing?.remove()

    if (schema) {
      const script = document.createElement('script')
      script.id = 'page-schema-json'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    }

  }, [description, image, openGraphType, schema, title])

  return null
}
