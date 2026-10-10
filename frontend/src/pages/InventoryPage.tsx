import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaArrowRight, FaChevronDown, FaChevronLeft, FaChevronRight, FaThLarge, FaList, FaSlidersH, FaSearch, FaTimes, FaTachometerAlt, FaRoad, FaCogs } from 'react-icons/fa'
import { getVehicleFilters, listVehicles } from '../api/vehicles'
import { Seo } from '../components/Seo'
import { VehicleGridSkeleton } from '../components/Skeletons'
import type { Vehicle } from '../types/vehicle'
import { formatNumber, formatPrice } from '../utils/format'

type SortKey = 'price-low' | 'price-high' | 'year' | 'mileage'
type ViewMode = 'grid' | 'list'
const PAGE_SIZE = 12
const toNumber = (value: string) => value === '' ? undefined : Number(value)
const numberValue = (value?: number) => value?.toString() ?? ''
const queryNumber = (value: string | null) => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}
const selectClass = 'mt-1 h-10 w-full border border-white/15 bg-[#090909] px-3 text-[12px] text-[#fffdf8] outline-none transition focus:border-[var(--color-accent)]'
const filterLabel = 'block text-[10px] font-bold uppercase tracking-[0.12em] text-white/70'

const InventoryVehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return <article className="inventory-vehicle-card group flex min-w-0 flex-col overflow-hidden rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-200 hover:border-[var(--color-primary)]">
    <div className="relative">
      <Link to={`/inventory/${vehicle.slug}`} aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="relative block aspect-[1.72/1] overflow-hidden bg-[var(--color-primary)]">
        <img src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" />
        <span className="absolute left-2 top-2 bg-[var(--color-primary)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#fffdf8]">{vehicle.bodyType}</span>
      </Link>
    </div>
    <div className="flex flex-1 flex-col px-4 pb-3 pt-3 sm:px-5">
      <Link to={`/inventory/${vehicle.slug}`} className="text-[var(--color-text)]">
        <h3 className="text-[23px] font-bold leading-[1.02] sm:text-[25px]">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p className="mt-1 truncate text-[14px] leading-5 text-[var(--color-muted)]">{vehicle.trim}</p>
      </Link>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="inventory-vehicle-price text-[30px] font-bold leading-none tracking-tight text-[var(--color-text)] sm:text-[32px]">{formatPrice(vehicle.price)}</p>
        <Link aria-label={`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`} to={`/inventory/${vehicle.slug}`} className="grid h-9 w-9 shrink-0 place-items-center text-xl text-[var(--color-text)] transition hover:translate-x-0.5 hover:text-[var(--color-accent)]"><FaArrowRight /></Link>
      </div>
      {vehicle.stockNumber ? <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.11em] text-[var(--color-muted)]">Stock #{vehicle.stockNumber}</p> : null}
      <div className="mt-2 flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--color-divider)] pt-2 text-[12px] text-[var(--color-muted)]">
        <span className="inline-flex items-center gap-1.5"><FaTachometerAlt className="text-[14px] text-[var(--color-text)]" />{formatNumber(vehicle.mileage)} mi</span>
        <span className="inline-flex items-center gap-1.5"><FaRoad className="text-[14px] text-[var(--color-text)]" />{vehicle.drivetrain}</span>
        {vehicle.transmission ? <span className="inline-flex items-center gap-1.5"><FaCogs className="text-[14px] text-[var(--color-text)]" />{vehicle.transmission}</span> : null}
      </div>
    </div>
  </article>
}

const InventoryVehicleListItem = ({ vehicle }: { vehicle: Vehicle }) => (
  <article className="group grid min-w-0 gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:border-[var(--color-primary)] sm:grid-cols-[170px_minmax(0,1fr)_auto] sm:items-center sm:p-4">
    <Link to={`/inventory/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-primary)] sm:aspect-[5/3]"><img src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" loading="lazy" /><span className="absolute left-0 top-0 bg-[var(--color-primary)] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#fffdf8]">{vehicle.bodyType}</span></Link>
    <div className="min-w-0">{vehicle.stockNumber ? <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-[var(--color-muted)]">Stock #{vehicle.stockNumber}</p> : null}<h3 className="mt-1.5 text-[30px] font-bold leading-none text-[var(--color-text)]">{vehicle.year} {vehicle.make} {vehicle.model}</h3><p className="mt-1.5 truncate text-[14px] text-[var(--color-muted)]">{vehicle.trim}</p><p className="mt-3 text-[13px] leading-[1.45] text-[var(--color-muted)]">{formatNumber(vehicle.mileage)} mi <span className="px-1 text-[var(--color-accent)]">•</span> {vehicle.drivetrain} <span className="px-1 text-[var(--color-accent)]">•</span> {vehicle.transmission}</p></div>
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-[var(--color-divider)] pt-3 sm:block sm:border-t-0 sm:pt-0 sm:text-right"><p className="text-[36px] font-bold leading-none tracking-tight text-[var(--color-primary)]">{formatPrice(vehicle.price)}</p><Link to={`/inventory/${vehicle.slug}`} className="site-button inline-flex h-10 items-center justify-center bg-[var(--color-primary)] px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[var(--color-accent)]">View details</Link></div>
  </article>
)

export const InventoryPage = () => {
  const [searchParams] = useSearchParams()
  const resultsRef = useRef<HTMLDivElement | null>(null)
  const [make, setMake] = useState(() => searchParams.get('make') ?? '')
  const [model, setModel] = useState(() => searchParams.get('model') ?? '')
  const [yearFrom, setYearFrom] = useState<number | undefined>(() => queryNumber(searchParams.get('yearFrom')))
  const [priceMin, setPriceMin] = useState<number | undefined>(() => queryNumber(searchParams.get('priceMin')))
  const [priceMax, setPriceMax] = useState<number | undefined>(() => queryNumber(searchParams.get('priceMax')))
  const [bodyType, setBodyType] = useState(() => searchParams.get('bodyType') ?? '')
  const [transmission, setTransmission] = useState('')
  const [drivetrain, setDrivetrain] = useState('')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sort, setSort] = useState<SortKey>('year')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<Vehicle[]>([])
  const [total, setTotal] = useState(0)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [inventoryError, setInventoryError] = useState(false)
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [bodyTypes, setBodyTypes] = useState<string[]>([])
  const [transmissions, setTransmissions] = useState<string[]>([])
  const [drivetrains, setDrivetrains] = useState<string[]>([])
  const [prices, setPrices] = useState<number[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setSearch(searchParams.get('q') ?? '')
    setBodyType(searchParams.get('bodyType') ?? '')
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    getVehicleFilters().then((filters) => { if (!cancelled) { setMakes(filters.makes); setModels(filters.models); setYears(filters.years); setBodyTypes(filters.bodyTypes); setTransmissions(filters.transmissions); setDrivetrains(filters.drivetrains); setPrices(filters.prices); setPriceMin((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current); setPriceMax((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current) } }).catch(() => undefined)
    return () => { cancelled = true }
  }, [])
  useEffect(() => {
    let cancelled = false
    getVehicleFilters(make).then((filters) => { if (!cancelled) { setModels(filters.models); setPrices(filters.prices); setPriceMin((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current); setPriceMax((current) => current !== undefined && !filters.prices.includes(current) ? undefined : current) } }).catch(() => { if (!cancelled) setModels([]) })
    return () => { cancelled = true }
  }, [make])
  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => { if (!cancelled) setLoading(true) })
    listVehicles({ make, model, q: search, yearFrom, bodyType, transmission, drivetrain, priceMin, priceMax, page, pageSize: PAGE_SIZE, sort: sort === 'price-low' ? 'price_asc' : sort === 'price-high' ? 'price_desc' : sort === 'mileage' ? 'mileage_asc' : 'year_desc' })
      .then((response) => { if (!cancelled) { setItems(response.items); setTotal(response.total); setInventoryError(false) } })
      .catch(() => { if (!cancelled) { setItems([]); setTotal(0); setInventoryError(true) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [bodyType, drivetrain, make, model, page, priceMax, priceMin, search, sort, transmission, yearFrom])

  useEffect(() => {
    let cancelled = false
    setCategoryCounts(null)
    const countFilters = { make, model, q: search, yearFrom, transmission, drivetrain, priceMin, priceMax, page: 1, pageSize: 1 }
    Promise.all([
      listVehicles(countFilters),
      ...bodyTypes.map((type) => listVehicles({ ...countFilters, bodyType: type })),
    ]).then(([allVehicles, ...typeResponses]) => {
      if (cancelled) return
      const counts: Record<string, number> = { all: allVehicles.total }
      bodyTypes.forEach((type, index) => { counts[type] = typeResponses[index]?.total ?? 0 })
      setCategoryCounts(counts)
    }).catch(() => { if (!cancelled) setCategoryCounts(null) })
    return () => { cancelled = true }
  }, [bodyTypes, drivetrain, make, model, priceMax, priceMin, search, transmission, yearFrom])

  const resetFilters = () => { setPage(1); setMake(''); setModel(''); setSearch(''); setYearFrom(undefined); setPriceMin(undefined); setPriceMax(undefined); setBodyType(''); setTransmission(''); setDrivetrain('') }
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const goToPage = (nextPage: number) => { setPage(Math.min(totalPages, Math.max(1, nextPage))); window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0) }
  const filterChange = <T,>(setter: (value: T) => void, value: T) => { setPage(1); setter(value) }
  const filters = <aside className={`${filtersOpen ? 'block' : 'hidden'} h-fit rounded-[3px] bg-[var(--color-primary)] p-5 text-white`}>
    <button type="button" className="flex min-h-11 w-full items-center justify-between gap-3 text-left lg:hidden" aria-expanded={filtersOpen} aria-controls="inventory-filters" onClick={() => setFiltersOpen((open) => !open)}>
      <span className="flex items-center gap-2"><FaSlidersH className="text-[var(--color-button)]" /><span className="text-[11px] font-bold uppercase tracking-[0.15em]">Filter inventory</span></span>
      <FaChevronDown className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className="hidden items-center gap-2 border-b border-white/15 pb-4 lg:flex"><FaSlidersH className="text-[var(--color-button)]" /><h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">Filter inventory</h2></div>
    <div id="inventory-filters" className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
    <div className="mt-5 space-y-4">
      <label className={filterLabel}>Make<select className={selectClass} value={make} onChange={(event) => { filterChange(setMake, event.target.value); setModel('') }}><option value="">All makes</option>{makes.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Model<select className={selectClass} value={model} disabled={!make} onChange={(event) => filterChange(setModel, event.target.value)}><option value="">{make ? 'All models' : 'Select make'}</option>{models.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Price<select className={selectClass} value={numberValue(priceMin)} onChange={(event) => { const price = toNumber(event.target.value); filterChange(setPriceMin, price); filterChange(setPriceMax, price) }}><option value="">Any price</option>{prices.map((price) => <option key={price} value={price}>{formatPrice(price)}</option>)}</select></label>
      <label className={filterLabel}>Year<select className={selectClass} value={numberValue(yearFrom)} onChange={(event) => filterChange(setYearFrom, toNumber(event.target.value))}><option value="">Any year</option>{years.map((item) => <option key={item} value={item}>{item}+</option>)}</select></label>
      <label className={filterLabel}>Body type<select className={selectClass} value={bodyType} onChange={(event) => filterChange(setBodyType, event.target.value)}><option value="">All body types</option>{bodyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Drivetrain<select className={selectClass} value={drivetrain} onChange={(event) => filterChange(setDrivetrain, event.target.value)}><option value="">All drivetrains</option>{drivetrains.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className={filterLabel}>Transmission<select className={selectClass} value={transmission} onChange={(event) => filterChange(setTransmission, event.target.value)}><option value="">All transmissions</option>{transmissions.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <button className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 bg-[var(--color-button)] text-[13px] font-bold uppercase tracking-[0.04em] transition hover:bg-[var(--color-button-hover)] active:translate-y-px" onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} type="button"><FaSlidersH className="text-base" /> Apply filters</button>
    <button className="mt-3 w-full text-center text-[13px] font-semibold text-white/85 underline underline-offset-4 transition hover:text-white" onClick={resetFilters} type="button">Clear all</button>
    </div>
  </aside>

  return <>
    <Seo title="Used Car Inventory" description="Browse used cars, SUVs, trucks, and crossovers at Smith's Sales & Services in Commodore, PA." />
    <section className="inventory-page bg-[var(--color-background)] px-5 pb-10 pt-5 sm:px-8 sm:pt-6 lg:px-[clamp(24px,3vw,48px)] lg:pt-5"><div className="mx-auto w-full max-w-[1600px]">
      <div className="flex flex-col gap-2 border-b border-[var(--color-divider)] pb-3 xl:flex-row xl:items-center">
        <label className="relative block min-w-0 flex-1"><span className="sr-only">Search make, model, or keyword</span><FaSearch aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[var(--color-text)]" /><input className="h-12 w-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-12 pr-10 text-[13px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]" value={search} onChange={(event) => filterChange(setSearch, event.target.value)} placeholder="Search year, make, model, or keyword..." />{search ? <button type="button" aria-label="Clear vehicle search" onClick={() => filterChange(setSearch, '')} className="absolute right-0 top-0 grid h-12 w-10 place-items-center text-[var(--color-muted)]"><FaTimes /></button> : null}</label>
        <button className="h-12 shrink-0 bg-[var(--color-button)] px-8 text-[15px] font-bold text-white transition hover:bg-[var(--color-button-hover)]" type="button" onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Search</button>
        <button type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-[var(--color-primary)] px-7 text-[15px] font-bold text-white"><FaSlidersH className="text-lg" /> Filters ({[make, model, bodyType, transmission, drivetrain, yearFrom, priceMin].filter(Boolean).length})</button>
        <label className="flex h-12 shrink-0 items-center gap-3 border-l border-[var(--color-divider)] pl-5 text-[14px] font-bold">Sort by<span className="relative inline-flex"><select className="h-10 appearance-none border border-[var(--color-border)] bg-[var(--color-surface)] px-3 pr-10 text-[13px] font-semibold outline-none focus:border-[var(--color-primary)]" value={sort} onChange={(event) => filterChange(setSort, event.target.value as SortKey)}><option value="year">Newest first</option><option value="price-low">Price low-high</option><option value="price-high">Price high-low</option><option value="mileage">Lowest mileage</option></select><FaChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[var(--color-text)]" /></span></label>
        <span className="hidden shrink-0 px-2 text-[12px] text-[var(--color-muted)] sm:block">{loading ? 'Loading' : `${total} vehicles`}</span>
        <div className="inventory-view-toggle flex h-12 shrink-0 items-center border border-[var(--color-divider)]" aria-label="Choose inventory view"><button type="button" aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className={`grid h-11 w-12 place-items-center text-xl transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${viewMode === 'grid' ? 'bg-[var(--color-button)] text-white' : 'text-[var(--color-text)] hover:bg-[var(--color-section)]'}`}><FaThLarge /></button><button type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className={`grid h-11 w-12 place-items-center text-xl transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${viewMode === 'list' ? 'bg-[var(--color-button)] text-white' : 'text-[var(--color-text)] hover:bg-[var(--color-section)]'}`}><FaList /></button></div>
      </div>
      {filtersOpen ? <div className="py-3">{filters}</div> : null}
      <div>
        <div className="relative">
        <nav aria-label="Vehicle categories" className="flex gap-0 overflow-x-auto border-b border-[var(--color-divider)] pt-3 text-[14px]">
          <button type="button" onClick={() => { filterChange(setBodyType, ''); setMake(''); setModel('') }} className={`shrink-0 border-b-2 px-4 py-3 font-bold ${!bodyType && !make ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-text)]'}`}>All Vehicles <span className="ml-2 font-normal">{categoryCounts?.all ?? '-'}</span></button>
          {bodyTypes.map((type) => <button key={type} type="button" onClick={() => { filterChange(setBodyType, type); setMake(''); setModel('') }} className={`shrink-0 border-b-2 border-l border-[var(--color-divider)] px-5 py-3 font-bold ${bodyType === type ? 'border-b-[var(--color-accent)] text-[var(--color-accent)]' : 'border-b-transparent text-[var(--color-text)]'}`}>{type}<span className="ml-2 font-normal text-[var(--color-muted)]">{categoryCounts?.[type] ?? '-'}</span></button>)}
        </nav>
        </div>
        <p className="flex items-center justify-end gap-1.5 pt-1.5 text-[10px] font-medium text-[var(--color-muted)] sm:hidden">Swipe to see more vehicle types <FaChevronRight aria-hidden="true" className="inventory-swipe-hint-arrow text-[9px] text-[var(--color-accent)]" /></p>
      </div>
      <div ref={resultsRef} className="mt-3 min-w-0 scroll-mt-[calc(var(--header-height)+1rem)]">
        <div className="mb-3 flex justify-end pt-2 text-[11px] text-[var(--color-muted)] sm:hidden">{loading ? 'Loading vehicles' : `${total} vehicles`}</div>
        <div className={viewMode === 'grid' ? 'grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'grid gap-3'}>{loading ? <VehicleGridSkeleton count={PAGE_SIZE} /> : inventoryError ? <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center text-sm text-[var(--color-muted)]">Inventory is temporarily unavailable. Please try again later or call us for current vehicles.</div> : items.length ? items.map((vehicle) => viewMode === 'grid' ? <InventoryVehicleCard key={vehicle.id} vehicle={vehicle} /> : <InventoryVehicleListItem key={vehicle.id} vehicle={vehicle} />) : <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center text-sm text-[var(--color-muted)]">No vehicles match these filters right now.</div>}</div>
        {!loading && totalPages > 1 ? <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"><div className="flex items-center justify-center gap-1.5"><button aria-label="Previous page" className="grid h-8 w-8 place-items-center border border-[var(--color-border)] transition hover:bg-[var(--color-section)] disabled:opacity-35" disabled={page === 1} onClick={() => goToPage(page - 1)} type="button"><FaChevronLeft /></button>{pageNumbers.map((pageNumber) => <button key={pageNumber} aria-label={`Page ${pageNumber}`} className={`grid h-8 min-w-8 place-items-center px-2 text-[11px] ${pageNumber === page ? 'bg-[var(--color-primary)] text-white' : 'hover:bg-[var(--color-section)]'}`} onClick={() => goToPage(pageNumber)} type="button">{pageNumber}</button>)}<button aria-label="Next page" className="grid h-8 w-8 place-items-center border border-[var(--color-border)] transition hover:bg-[var(--color-section)] disabled:opacity-35" disabled={page === totalPages} onClick={() => goToPage(page + 1)} type="button"><FaChevronRight /></button></div><p className="text-center text-[10px] text-[var(--color-muted)] sm:absolute sm:right-0">Showing {((page - 1) * PAGE_SIZE) + 1}-{Math.min(page * PAGE_SIZE, total)} of {total} vehicles</p></div> : null}
      </div></div>
    </section>
  </>
}
