import { useEffect } from 'react'
import { business } from '../data/business'

type SeoProps = {
  title: string
  description: string
  schema?: Record<string, unknown>
}

export const Seo = ({ title, description, schema }: SeoProps) => {
  useEffect(() => {
    document.title = `${title} | ${business.name}`

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description

    const existing = document.querySelector('#schema-json')
    existing?.remove()

    if (schema) {
      const script = document.createElement('script')
      script.id = 'schema-json'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    }
  }, [description, schema, title])

  return null
}
