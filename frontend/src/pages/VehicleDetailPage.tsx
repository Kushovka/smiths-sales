import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaCarSide, FaCheck, FaChair, FaChevronLeft, FaChevronRight, FaClock, FaCogs, FaCog, FaCommentAlt, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaRoad, FaTachometerAlt, FaTint } from 'react-icons/fa'
import { getVehicle, listVehicles } from '../api/vehicles'
import { Button } from '../components/Button'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'
import { VehicleDetailSkeleton } from '../components/Skeletons'
import { VehicleGallery } from '../components/VehicleGallery'
import { business } from '../data/business'
import type { Vehicle } from '../types/vehicle'
import { trackContactCta } from '../utils/ctaTracking'
import { formatNumber, formatPrice } from '../utils/format'
import { trackViewContent } from '../utils/metaPixel'

const phoneHref = business.phoneHref || business.contactHref
const hasListingValue = (value: string | number) => String(value).trim() !== '' && !/^not listed$/i.test(String(value).trim())

const featuresFromListingInfo = (content: string) => content
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('- '))
  .map((line) => line.slice(2).trim())
  .filter((item) => !/^(chassis:|vin:|\d+[\d,.]*k? miles$|.*\b(engine|transmission|dual-clutch|tiptronic|single-speed|v8|v6|v12|inline|turbodiesel|twin-turbocharged|supercharged)\b|.*\b(paint|metallic|upholstery|interior|leather)\b)/i.test(item))

const Feature = ({ feature }: { feature: string }) => (
  <p className="flex items-start gap-3 text-[13px] leading-5 text-[var(--color-text)]"><span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--color-button)] text-[9px] text-white"><FaCheck /></span>{feature}</p>
)

const RelatedVehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
  <article className="inventory-vehicle-card group flex min-w-0 flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
    <Link to={`/inventory/${vehicle.slug}`} aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="block aspect-[1.72/1] overflow-hidden bg-[var(--color-primary)]">
      <img src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" />
    </Link>
    <div className="flex flex-1 flex-col px-4 pb-3 pt-3 sm:px-5">
      <Link to={`/inventory/${vehicle.slug}`} className="text-[var(--color-text)]">
        <h3 className="text-[23px] font-bold leading-[1.02] sm:text-[25px]">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p className="mt-1 truncate text-[14px] leading-5 text-[var(--color-muted)]">{vehicle.trim}</p>
      </Link>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="inventory-vehicle-price text-[30px] font-bold leading-none tracking-tight text-[var(--color-text)] sm:text-[32px]">{formatPrice(vehicle.price)}</p>
        <Link aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`} to={`/inventory/${vehicle.slug}`} className="grid h-9 w-9 shrink-0 place-items-center text-xl text-[var(--color-text)] transition hover:translate-x-0.5 hover:text-[var(--color-accent)]"><FaArrowRight /></Link>
      </div>
      <div className="mt-2 flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--color-divider)] pt-2 text-[12px] text-[var(--color-muted)]">
        <span className="inline-flex items-center gap-1.5"><FaTachometerAlt className="text-[14px] text-[var(--color-text)]" />{formatNumber(vehicle.mileage)} mi</span>
        <span className="inline-flex items-center gap-1.5"><FaRoad className="text-[14px] text-[var(--color-text)]" />{vehicle.drivetrain}</span>
        {vehicle.transmission ? <span className="inline-flex items-center gap-1.5"><FaCog className="text-[14px] text-[var(--color-text)]" />{vehicle.transmission}</span> : null}
      </div>
    </div>
  </article>
)

const RelatedVehiclesCarousel = ({ vehicles }: { vehicles: Vehicle[] }) => {
  const [start, setStart] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [visibleCount, setVisibleCount] = useState(() => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
  useEffect(() => {
    const resize = () => setVisibleCount(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  if (!vehicles.length) return null
  const visible = Array.from({ length: Math.min(visibleCount, vehicles.length) }, (_, index) => vehicles[(start + index) % vehicles.length])
  const move = (step: 1 | -1) => {
    setDirection(step)
    setStart((current) => (current + step + vehicles.length) % vehicles.length)
  }
  return <section aria-labelledby="related-vehicles-title" className="border-t border-[var(--color-divider)] bg-[var(--color-background)] px-5 py-8 sm:px-7 lg:px-9 lg:py-10">
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">More to explore</p><h2 id="related-vehicles-title" className="mt-1 text-[30px] font-bold leading-none text-[var(--color-primary)] sm:text-[36px]">You may also like</h2></div>
        {vehicles.length > 1 ? <div className="flex shrink-0 gap-2"><button type="button" aria-label="Previous recommended vehicles" onClick={() => move(-1)} className="grid h-11 w-11 place-items-center border border-[var(--color-primary)] text-lg text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"><FaChevronLeft /></button><button type="button" aria-label="Next recommended vehicles" onClick={() => move(1)} className="grid h-11 w-11 place-items-center border border-[var(--color-primary)] text-lg text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"><FaChevronRight /></button></div> : null}
      </div>
      <div className={`grid gap-4 ${visible.length >= 3 ? 'lg:grid-cols-3' : visible.length === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
        {visible.map((vehicle, index) => <motion.div key={`${vehicle.id}-${start}-${index}`} initial={{ opacity: 0, x: direction * 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}><RelatedVehicleCard vehicle={vehicle} /></motion.div>)}
      </div>
    </div>
  </section>
}

const PriceCard = ({ vehicle }: { vehicle: Vehicle }) => <aside className="flex flex-col bg-[var(--color-background)] px-5 py-4 sm:px-7 sm:py-5 lg:px-8 lg:py-5">
  <Link to="/inventory" className="mb-4 inline-flex min-h-8 w-fit items-center gap-2 text-[14px] font-bold text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"><FaArrowLeft aria-hidden="true" className="text-base text-[var(--color-button)]" /> Back to inventory</Link>
  <h1 className="text-[32px] font-bold uppercase leading-[.91] tracking-[-0.025em] text-[var(--color-primary)] sm:text-[38px] lg:text-[42px]">{vehicle.year} {vehicle.make}<br />{vehicle.model} {vehicle.trim}</h1>
  <p className="mt-2 text-[12px] leading-5 text-[var(--color-muted)]">{vehicle.engine} <span className="px-1 text-[var(--color-border)]">|</span> {vehicle.drivetrain} <span className="px-1 text-[var(--color-border)]">|</span> {vehicle.transmission}</p>
  <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-[46px] font-bold leading-none tracking-[-0.025em] text-[var(--color-accent)] sm:text-[54px]">{formatPrice(vehicle.price)}</p>{vehicle.stockNumber || hasListingValue(vehicle.vin) ? <div className="border-l border-[var(--color-divider)] pl-3 text-[10px] leading-5 text-[var(--color-text)]">{vehicle.stockNumber ? <p>Stock&nbsp; #{vehicle.stockNumber}</p> : null}{hasListingValue(vehicle.vin) ? <p className="max-w-[180px] truncate" title={vehicle.vin}>VIN&nbsp; {vehicle.vin}</p> : null}</div> : null}</div>
  <a href={phoneHref} className="site-button mt-4 flex min-h-[56px] items-center justify-center gap-3 bg-[var(--color-button)] px-4 text-[16px] font-bold text-white transition hover:bg-[var(--color-button-hover)]" onClick={() => trackContactCta('phone_click', 'Vehicle Price Card Phone')}><FaPhoneAlt aria-hidden="true" className="text-lg" /> Call&nbsp; {business.phone} <FaArrowRight aria-hidden="true" className="text-lg" /></a>
  <div className="mt-1.5 grid grid-cols-2 gap-2"><a href={`sms:${business.phone.replace(/[^\d+]/g, '')}`} className="site-button flex min-h-[50px] items-center justify-center gap-2 border border-[var(--color-border)] bg-transparent text-[14px] font-bold text-[var(--color-text)] transition hover:bg-[var(--color-hover)]" onClick={() => trackContactCta('sms_click', 'Vehicle Price Card Text')}><FaCommentAlt className="text-base" /> Text Us</a><a href="#request-info" className="site-button flex min-h-[50px] items-center justify-center gap-2 border border-[var(--color-border)] bg-transparent text-[14px] font-bold text-[var(--color-text)] transition hover:bg-[var(--color-hover)]" onClick={() => trackContactCta('contact_form_click', 'Vehicle Price Card Request Info')}><FaEnvelope className="text-base" /> Request Info</a></div>
  <div className="mt-3 grid grid-cols-2 divide-x divide-[var(--color-divider)] border border-[var(--color-divider)] bg-[var(--color-surface)] py-2.5"><a href={business.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5 px-3 text-[13px] font-semibold text-[var(--color-text)]"><FaMapMarkerAlt className="shrink-0 text-lg" /><span>{business.shortLocation}<small className="mt-0.5 block text-[11px] font-medium text-[var(--color-muted)]">View on Map →</small></span></a><div className="flex items-center justify-center gap-2.5 px-3 text-[12px] font-medium leading-4 text-[var(--color-muted)]"><FaClock className="shrink-0 text-lg text-[var(--color-text)]" /><span>Monday to Friday: 9AM to 5PM<br />Saturday and Sunday: Closed</span></div></div>
</aside>

const VehicleQuickFacts = ({ vehicle }: { vehicle: Vehicle }) => {
  const facts = [
    { label: 'Mileage', value: `${formatNumber(vehicle.mileage)} mi`, icon: FaTachometerAlt },
    { label: 'Body type', value: vehicle.bodyType, icon: FaCarSide },
    { label: 'Drivetrain', value: vehicle.drivetrain, icon: FaRoad },
    { label: 'Engine', value: vehicle.engine, icon: FaCogs },
    { label: 'Transmission', value: vehicle.transmission, icon: FaCog },
    { label: 'Exterior color', value: vehicle.exteriorColor, icon: FaTint },
    { label: 'Interior color', value: vehicle.interiorColor, icon: FaChair },
  ].filter((fact) => hasListingValue(fact.value))
  return <dl className="grid grid-cols-2 bg-[var(--color-primary)] px-5 text-white sm:grid-cols-3 lg:grid-cols-7 lg:px-8">{facts.map(({ label, value, icon: Icon }, index) => <div key={label} className={`flex min-h-[78px] items-center justify-center gap-3 py-3 ${index > 0 ? 'border-l border-white/25 pl-3 sm:pl-5 lg:pl-6' : ''}`}><Icon className="shrink-0 text-xl text-white" /><div className="min-w-0"><dd className="text-[12px] font-semibold leading-[1.2] sm:text-[13px]">{value}</dd><dt className="mt-0.5 text-[10px] text-white/75">{label}</dt></div></div>)}</dl>
}

export const VehicleDetailPage = () => {
  const { slug } = useParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [recommendations, setRecommendations] = useState<Vehicle[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [detailView, setDetailView] = useState<'overview' | 'photos'>(() => window.location.hash === '#photos' ? 'photos' : 'overview')
  const showPhotos = () => {
    setDetailView('photos')
    window.history.replaceState(null, '', '#photos')
    window.setTimeout(() => document.getElementById('photos')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }
  useEffect(() => {
    let cancelled = false
    getVehicle(slug ?? '')
      .then(async (item) => {
        const [listingDescription, listingInfo] = await Promise.all([
          fetch(`/listing-descriptions/${item.slug}.txt`).then((response) => response.ok ? response.text() : '').catch(() => ''),
          fetch(`/listing-info/${item.slug}.txt`).then((response) => response.ok ? response.text() : '').catch(() => ''),
        ])
        if (!cancelled) {
          const sourceFeatures = featuresFromListingInfo(listingInfo)
          setVehicle({
            ...item,
            description: listingDescription.trim() || item.description,
            features: sourceFeatures.length ? sourceFeatures : item.features,
          })
          setLoadError(false)
          trackViewContent(item.id, `${item.year} ${item.make} ${item.model} ${item.trim}`, item.price)
        }
      })
      .catch(() => { if (!cancelled) { setVehicle(null); setLoadError(true) } })
      .finally(() => { if (!cancelled) setLoaded(true) })
    return () => { cancelled = true }
  }, [slug])
  useEffect(() => {
    if (!vehicle || vehicle.slug !== slug) return
    let cancelled = false
    listVehicles({ pageSize: 8, sort: 'year_desc' })
      .then(({ items }) => {
        const candidates = items.filter((item) => item.id !== vehicle.id && item.slug !== vehicle.slug)
        const score = (item: Vehicle) =>
          (item.bodyType.toLowerCase() === vehicle.bodyType.toLowerCase() ? 3 : 0)
          + (item.make.toLowerCase() === vehicle.make.toLowerCase() ? 2 : 0)
          + (vehicle.price > 0 && Math.abs(item.price - vehicle.price) / vehicle.price < 0.3 ? 1 : 0)
        candidates.sort((a, b) => score(b) - score(a))
        if (!cancelled) setRecommendations(candidates.slice(0, 6))
      })
      .catch(() => { if (!cancelled) setRecommendations([]) })
    return () => { cancelled = true }
  }, [slug, vehicle])
  const title = useMemo(() => vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}` : '', [vehicle])
  if (!vehicle && loaded && loadError) return <section className="section soft-band"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"><div className="surface-card p-8"><h1 className="text-3xl text-[var(--color-text)]">Vehicle details are temporarily unavailable</h1><p className="mt-3 text-[var(--color-muted)]">Please try again later or call us for current vehicle information.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/inventory" variant="secondary">Back to Inventory</Button><Button href={phoneHref}><FaPhoneAlt /> Contact</Button></div></div></div></section>
  if (!vehicle) return <VehicleDetailSkeleton />
  const specs = [['Year', String(vehicle.year)], ['Make', vehicle.make], ['Model', vehicle.model], ['Body type', vehicle.bodyType], ['Engine', vehicle.engine], ['Transmission', vehicle.transmission], ['Drivetrain', vehicle.drivetrain], ['Mileage', `${formatNumber(vehicle.mileage)} mi`], ['Exterior color', vehicle.exteriorColor], ['Interior color', vehicle.interiorColor]].filter(([, value]) => hasListingValue(value))
  return <><Seo title={title} description={`${title} for sale at Smith's Sales & Services in Commodore, PA. Call or request info today.`} schema={{ '@context': 'https://schema.org', '@type': 'Vehicle', name: title, brand: vehicle.make, model: vehicle.model, vehicleModelDate: vehicle.year, mileageFromOdometer: `${vehicle.mileage} MI`, ...(vehicle.price > 0 ? { offers: { '@type': 'Offer', price: vehicle.price, priceCurrency: 'USD' } } : {}) }} /><main className="bg-[var(--color-background)]">
    <section className="grid gap-0 py-5 sm:py-6 lg:grid-cols-[minmax(0,2fr)_minmax(380px,1fr)] lg:py-8">
      <div id="vehicle-gallery" className="relative px-4 sm:px-5 lg:min-h-[430px] lg:px-0"><VehicleGallery images={vehicle.images} imagesTotal={vehicle.imagesTotal} slug={vehicle.slug} title={title} onShowPhotos={showPhotos} showAllPhotos={detailView === 'photos'} /></div>
      <PriceCard vehicle={vehicle} />
    </section>
    <VehicleQuickFacts vehicle={vehicle} />
    <section className="px-5 py-5 sm:px-7 lg:px-9 lg:py-6"><div className="mx-auto grid max-w-[1800px] gap-7 lg:grid-cols-[170px_minmax(0,1.15fr)_minmax(360px,.95fr)] lg:gap-8">
      <nav aria-label="Vehicle details" className="flex gap-2 overflow-x-auto border-b border-[var(--color-divider)] pb-3 text-[12px] lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:h-fit lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-r lg:pb-0 lg:pr-3">
        <a href="#overview" onClick={() => { setDetailView('overview'); window.history.replaceState(null, '', '#overview') }} className={`shrink-0 border-l-2 px-4 py-3 ${detailView === 'overview' ? 'border-[var(--color-accent)] bg-[var(--color-section)] font-medium text-[var(--color-accent)]' : 'border-transparent hover:bg-[var(--color-section)]'}`}>Overview</a><a href="#photos" onClick={(event) => { event.preventDefault(); showPhotos() }} className={`shrink-0 border-l-2 px-4 py-3 ${detailView === 'photos' ? 'border-[var(--color-accent)] bg-[var(--color-section)] font-medium text-[var(--color-accent)]' : 'border-transparent hover:bg-[var(--color-section)]'}`}>Photos</a>
      </nav>
      <div className="min-w-0">
        {detailView === 'photos' ? <section id="photos" className="scroll-mt-24"><h2 className="text-[32px] font-bold leading-none tracking-[-0.02em] text-[var(--color-primary)] sm:text-[36px]">Photos</h2><div id="vehicle-photos-grid" className="mt-4" /></section> : <article id="overview" className="scroll-mt-24"><h2 className="text-[32px] font-bold leading-none tracking-[-0.02em] text-[var(--color-primary)] sm:text-[36px]">Vehicle overview</h2><p id="description" className="mt-3 whitespace-pre-line text-[14px] leading-[1.55] text-[var(--color-muted)]">{vehicle.description}</p></article>}
        <section id="specifications" className="mt-7 scroll-mt-24 border-t border-[var(--color-divider)] pt-3"><h2 className="text-[24px] font-bold leading-none text-[var(--color-primary)]">Specifications</h2><dl className="mt-3 grid grid-cols-1 gap-x-7 sm:grid-cols-2">{specs.map(([label, value]) => <div key={label} className="grid grid-cols-[minmax(95px,.7fr)_minmax(0,1.3fr)] gap-3 border border-[var(--color-divider)] bg-[var(--color-surface)] px-3 py-1.5 text-[11px] leading-4 even:bg-transparent"><dt className="text-[var(--color-text)]">{label}</dt><dd className="min-w-0 truncate text-[var(--color-muted)]">{value}</dd></div>)}</dl></section>
      </div>
      <aside className="min-w-0">
        <section id="features" className="scroll-mt-24"><h2 className="border-b border-[var(--color-divider)] pb-2 text-[28px] font-bold leading-none text-[var(--color-primary)]">Key features</h2><div className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">{vehicle.features.map((feature) => <Feature key={feature} feature={feature} />)}</div></section>
        <section id="location-contact" className="mt-7 scroll-mt-24 border border-[var(--color-divider)] bg-[var(--color-surface)] p-3"><h2 className="mb-2 text-[24px] font-bold leading-none text-[var(--color-primary)]">Location</h2><div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]"><img src="/images/commodore-dealership.webp" alt="Smith's Sales & Services dealership in Commodore, Pennsylvania" className="h-[150px] w-full object-cover" /><div className="grid gap-3 sm:grid-cols-2 sm:items-start"><div className="flex items-start gap-2.5 text-[11px] leading-4"><FaMapMarkerAlt className="mt-0.5 shrink-0 text-base" /><div>{business.address}<br />{business.cityState} {business.postalCode}<a href={business.mapsUrl} target="_blank" rel="noreferrer" className="mt-1 block font-semibold text-[var(--color-accent)] underline underline-offset-2">View on Map →</a></div></div><div className="grid gap-4 text-[11px] leading-4"><a href={phoneHref} className="flex items-start gap-2.5 font-semibold"><FaPhoneAlt className="mt-0.5 shrink-0 text-base" />{business.phone}</a><p className="flex items-start gap-2.5"><FaClock className="mt-0.5 shrink-0 text-base" /><span>Monday to Friday: 9AM to 5PM<br />Saturday and Sunday: Closed</span></p></div></div></div></section>
        <section id="request-info" className="vehicle-inquiry mt-5 grid gap-6 p-5 text-white sm:p-6">
          <div><h2 className="text-[34px] font-bold leading-none sm:text-[40px]">Get more information</h2><p className="mt-3 text-[14px] leading-6 text-white/75">Have a question or want to schedule a time to see this vehicle? Send us a message and we’ll get back to you shortly.</p></div>
          <LeadForm title="Send Inquiry" vehicleId={vehicle.id} vehicleName={title} vehicleValue={vehicle.price} variant="vehicle" className="vehicle-inquiry-form" messageDefaultValue={`I'm interested in the ${title}. Please contact me with more information.`} />
        </section>
      </aside>
    </div></section>
    <RelatedVehiclesCarousel vehicles={recommendations} />
  </main><div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 shadow-sm lg:hidden"><div className="mx-auto flex max-w-7xl items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-sm text-[var(--color-text)]">{title}</p><p className="font-medium text-[var(--color-primary)]">{formatPrice(vehicle.price)}</p></div><a href={phoneHref} className="site-button inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--color-primary)] text-xl text-white" aria-label="Contact about this vehicle" onClick={() => trackContactCta('phone_click', 'Vehicle Sticky Contact')}><FaPhoneAlt /></a><a href="#request-info" className="site-button inline-flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--color-button)] text-xl text-white" aria-label="Request info about this vehicle" onClick={() => trackContactCta('contact_form_click', 'Vehicle Sticky Request Info')}><FaArrowRight /></a></div></div></>
}
