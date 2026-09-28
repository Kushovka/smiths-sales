import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { FaArrowRight, FaBars, FaChevronDown, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaSearch, FaTimes } from 'react-icons/fa'
import { FiChevronRight, FiFileText, FiGrid, FiPhone, FiSearch, FiShield, FiTruck, FiUsers } from 'react-icons/fi'
import { listVehicles } from '../api/vehicles'
import { business } from '../data/business'
import type { Vehicle } from '../types/vehicle'
import { trackContactCta } from '../utils/ctaTracking'
import { formatPrice } from '../utils/format'

const desktopNavItems = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Guarantee', href: '/guarantee' },
  { label: 'Delivery', href: '/delivery' },
]

const mobileNavItems = [
  { label: 'Inventory', href: '/inventory', Icon: FiGrid },
  { label: 'Warranty', href: '/warranty', Icon: FiShield },
  { label: 'Guarantee', href: '/guarantee', Icon: FiFileText },
  { label: 'Delivery', href: '/delivery', Icon: FiTruck },
  { label: 'About', href: '/about', Icon: FiUsers },
  { label: 'Contact Us', href: '/contact', Icon: FiPhone },
  { label: 'Our Team', href: '/team', Icon: FiUsers },
]

const isBusinessOpenNow = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const weekday = parts.find((part) => part.type === 'weekday')?.value
  const hour = Number(parts.find((part) => part.type === 'hour')?.value)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value)
  const minutesToday = hour * 60 + minute

  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekday ?? '') && minutesToday >= 9 * 60 && minutesToday < 17 * 60
}

const HeaderSearch = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const term = query.trim()
    if (term.length < 2) {
      setMatches([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    listVehicles({ q: term, pageSize: 3 })
      .then((response) => { if (!cancelled) setMatches(response.items) })
      .catch(() => { if (!cancelled) setMatches([]) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query])

  const viewSearch = () => {
    const term = query.trim()
    if (term) navigate(`/inventory?q=${encodeURIComponent(term)}`)
  }

  return <div className="relative w-full 2xl:max-w-[560px]">
    <div className="header-search-control flex h-[49px] items-center gap-0 overflow-hidden rounded-[8px] border border-[#d2cfcd] bg-[#fbfaf8] transition-colors focus-within:border-[#a9a3a0]">
    <label className="relative flex h-full min-w-0 flex-1 items-center gap-3 pl-3 2xl:gap-4 2xl:pl-4">
      <span className="sr-only">Search inventory</span>
      <FaSearch aria-hidden="true" className="shrink-0 text-[16px] text-[var(--color-button)] 2xl:text-[19px]" />
      <input
        className="h-9 min-w-0 w-full bg-transparent py-0 pr-1 text-[13px] text-[#191919] outline-none placeholder:text-[#77716e] 2xl:text-[14px]"
        type="text"
        inputMode="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); viewSearch() } if (event.key === 'Escape') setQuery('') }}
        placeholder="Search make, model, or keyword..."
      />
      {query ? <button type="button" aria-label="Clear inventory search" onClick={() => setQuery('')} className="grid h-9 w-9 shrink-0 place-items-center text-base text-[#77716e] transition hover:text-[#191919]"><FaTimes aria-hidden="true" /></button> : null}
    </label>
    <button type="button" onClick={viewSearch} className="header-search-submit inline-flex h-full shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-[var(--color-button)] px-4 text-[12px] font-bold text-white transition hover:bg-[var(--color-button-hover)] sm:px-5 2xl:px-6 2xl:text-[13px]">Search <FaArrowRight aria-hidden="true" className="text-[12px]" /></button>
    </div>
    {query.trim().length >= 2 ? <div className="absolute right-0 top-[calc(100%+0.6rem)] z-50 max-h-[min(480px,calc(100dvh-8rem))] w-[min(620px,calc(100vw-2.5rem))] overflow-y-auto rounded-[5px] bg-[#171717] text-white shadow-[0_22px_54px_rgba(0,0,0,0.38)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5"><span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">{loading ? 'Searching' : `${matches.length} matching vehicles`}</span><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-button)]" aria-hidden="true" /></div>
      {loading ? <p className="px-5 py-6 text-sm text-white/65">Looking through current inventory…</p> : matches.length ? <><div className="divide-y divide-white/10">{matches.map((vehicle) => <Link key={vehicle.id} to={`/inventory/${vehicle.slug}`} onClick={() => setQuery('')} className="group grid min-h-[92px] grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-white/[0.055] sm:min-h-[104px] sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:gap-4 sm:px-5 sm:py-3.5"><img src={vehicle.images[0]} alt="" className="h-[60px] w-[76px] shrink-0 object-cover sm:h-[78px] sm:w-[104px]" /><span className="min-w-0"><strong className="block truncate text-[14px] font-bold leading-tight text-white sm:text-[17px]">{vehicle.year} {vehicle.make} {vehicle.model}</strong><span className="mt-1 block truncate text-[11px] text-white/55 sm:text-[13px]">{vehicle.trim || 'Available now'}</span></span><span className="flex items-center gap-2 pl-1 text-right"><span className="whitespace-nowrap text-[12px] font-bold tabular-nums text-[#f06a6f] sm:text-[14px]">{formatPrice(vehicle.price)}</span><FaArrowRight aria-hidden="true" className="hidden text-[11px] text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white sm:block" /></span></Link>)}</div><button type="button" onClick={viewSearch} className="flex h-12 w-full items-center justify-between border-t border-white/10 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[var(--color-button)] sm:px-5"><span>Browse all matching vehicles</span><FaArrowRight aria-hidden="true" /></button></> : <p className="px-5 py-6 text-sm text-white/65">No vehicles match “{query.trim()}”.</p>}
    </div> : null}
  </div>
}

export const Header = () => {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isInventoryPage = pathname === '/inventory'
  const [desktopContactOpen, setDesktopContactOpen] = useState(false)
  const [desktopContactSuppressed, setDesktopContactSuppressed] = useState(false)
  const [businessOpen, setBusinessOpen] = useState(isBusinessOpenNow)
  const phoneHref = business.phoneHref || business.contactHref
  const displayPhone = business.phone.replace(/^\+1 (\d{3})-(\d{3})-(\d{4})$/, '($1) $2-$3')
  const closeDesktopContactMenu = () => {
    setDesktopContactOpen(false)
    setDesktopContactSuppressed(true)
  }

  useEffect(() => {
    const refreshBusinessStatus = () => setBusinessOpen(isBusinessOpenNow())
    const intervalId = window.setInterval(refreshBusinessStatus, 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <motion.header
      className="sticky inset-x-0 top-0 z-50 border-b border-black/10 bg-[#fbfaf7]"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="hidden min-h-[52px] items-center bg-[#111] text-white 2xl:flex">
        <div className="mx-auto flex w-full items-center justify-between px-[clamp(28px,3vw,64px)] text-[13px]">
          <div className="flex min-w-0 items-center">
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 whitespace-nowrap pr-6 text-white/90 hover:text-white" onClick={() => trackContactCta('directions_click', 'Top Bar Directions')}>
              <FaMapMarkerAlt className="text-[17px]" aria-hidden="true" />
              <span>{business.address}, {business.cityState} {business.postalCode}</span>
            </a>
            <i className="h-8 w-px bg-white/30" />
            <a href={phoneHref} className="flex items-center gap-3 whitespace-nowrap px-6 text-white/90 hover:text-white" onClick={() => trackContactCta('phone_click', 'Top Bar Phone')}>
              <FaPhoneAlt className="text-[15px]" aria-hidden="true" />
              <span>{displayPhone}</span>
            </a>
            <i className="h-8 w-px bg-white/30" />
            <div className="flex items-center gap-3 whitespace-nowrap px-6 text-white/90">
              <FaClock className="text-[16px]" aria-hidden="true" />
              <span>Mon - Fri: 9AM - 5PM <span className="px-2 text-white/50">|</span> Sat - Sun: Closed <span className="px-2 text-white/50">|</span></span>
              <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.04em]" aria-live="polite">
                <span className={`h-2 w-2 rounded-full ${businessOpen ? 'bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.9)]' : 'bg-red-500 shadow-[0_0_9px_rgba(239,68,68,0.9)]'}`} aria-hidden="true" />
                {businessOpen ? 'Open Now' : 'Closed Now'}
              </span>
            </div>
          </div>
          <p className="ml-6 whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.025em] text-white/90">Quality pre-owned vehicles <span className="px-2 text-white/50">|</span> Local &amp; Nationwide</p>
        </div>
      </div>

      <div className="mx-auto grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-x-5 px-5 sm:px-8 2xl:grid-cols-[auto_minmax(0,1fr)_auto] 2xl:gap-x-[clamp(24px,2vw,36px)] 2xl:min-h-[124px] 2xl:px-[clamp(28px,3vw,64px)]">
        <Link
          to="/"
          className="flex min-w-0 items-center focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-accent)]"
          onClick={() => setOpen(false)}
        >
          <img src="/images/smiths-sales-logo.webp" alt="Smith's Sales & Services" className="h-auto w-[128px] shrink-0 sm:w-[146px] 2xl:w-[clamp(175px,12.3vw,252px)]" />
        </Link>

        <div className="hidden min-w-0 2xl:flex 2xl:justify-center">
          <HeaderSearch />
        </div>

        <nav className="hidden min-w-0 items-center justify-end gap-[clamp(16px,1vw,22px)] 2xl:flex 2xl:w-max">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `whitespace-nowrap text-[16px] font-bold uppercase transition ${
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => {
              if (!desktopContactSuppressed) setDesktopContactOpen(true)
            }}
            onMouseLeave={() => {
              setDesktopContactOpen(false)
              setDesktopContactSuppressed(false)
            }}
          >
            <NavLink
              to="/contact"
              onClick={closeDesktopContactMenu}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 whitespace-nowrap text-[16px] font-bold uppercase transition ${
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text)] hover:text-[var(--color-accent)]'
                }`
              }
            >
              Contact <FaChevronDown className={`text-[9px] transition-transform duration-200 ${desktopContactOpen ? 'rotate-180' : ''}`} />
            </NavLink>
            <div className={`absolute right-[-0.75rem] top-full z-50 w-48 border border-[var(--color-border)] bg-[var(--color-surface)] p-2 transition duration-200 ${desktopContactOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'}`}>
              <NavLink to="/contact" onClick={closeDesktopContactMenu} className={({ isActive }) => `block px-3 py-2.5 text-[15px] font-bold uppercase transition ${isActive ? 'bg-[var(--color-background)] text-[var(--color-accent)]' : 'text-[var(--color-text)] hover:bg-[var(--color-background)] hover:text-[var(--color-accent)]'}`}>Contact Us</NavLink>
              <NavLink to="/about" onClick={closeDesktopContactMenu} className={({ isActive }) => `block px-3 py-2.5 text-[15px] font-bold uppercase transition ${isActive ? 'bg-[var(--color-background)] text-[var(--color-accent)]' : 'text-[var(--color-text)] hover:bg-[var(--color-background)] hover:text-[var(--color-accent)]'}`}>About</NavLink>
              <NavLink to="/team" onClick={closeDesktopContactMenu} className={({ isActive }) => `block px-3 py-2.5 text-[15px] font-bold uppercase transition ${isActive ? 'bg-[var(--color-background)] text-[var(--color-accent)]' : 'text-[var(--color-text)] hover:bg-[var(--color-background)] hover:text-[var(--color-accent)]'}`}>Our Team</NavLink>
            </div>
          </div>
        </nav>

        <div className="flex h-full items-center gap-3 2xl:hidden">
          <a href={phoneHref} onClick={() => trackContactCta('phone_click', 'Mobile Header Call')} className="site-button grid h-10 w-10 place-items-center bg-[var(--color-button)] text-white" aria-label={`Call ${business.phone}`}><FaPhoneAlt /></a>
          <button
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center border border-[var(--color-primary)] text-[var(--color-primary)]"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {!isInventoryPage ? <div className="border-t border-black/10 px-5 py-2.5 2xl:hidden sm:px-8"><HeaderSearch /></div> : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            className="mobile-menu-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-[#090909]/90 p-2.5 xl:hidden sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => { if (event.target === event.currentTarget) setOpen(false) }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="mobile-menu-panel flex h-[calc(100dvh-20px)] max-h-[1280px] w-full max-w-[520px] flex-col overflow-y-auto rounded-[10px] bg-[#fbf9f7] px-6 pb-6 pt-5 text-[#171717] shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:h-[calc(100dvh-32px)] sm:px-[38px] sm:pb-7 sm:pt-6"
              initial={{ y: 12, scale: 0.99 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 8, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-start justify-between">
                <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
                  <img src="/images/smiths-sales-logo.webp" alt="Smith's Sales & Services" className="h-auto w-[190px] sm:w-[245px]" />
                </Link>
                <button
                  aria-label="Close menu"
                  className="grid h-10 w-10 shrink-0 place-items-center text-[28px] text-[#151515] transition hover:text-[var(--color-button)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-button)]"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <FaTimes />
                </button>
              </div>

              <nav aria-label="Main navigation" className="mt-7 shrink-0">
                {mobileNavItems.map(({ label, href, Icon }) => (
                  <NavLink
                    key={href}
                    to={href}
                    onClick={() => setOpen(false)}
                    className="mobile-menu-item group flex min-h-[68px] items-center gap-5 border-b border-[#e7e3e0] text-[18px] font-semibold tracking-[-0.02em] transition sm:min-h-[88px] sm:gap-7 sm:text-[20px]"
                  >
                    <Icon aria-hidden="true" className="h-[25px] w-[25px] shrink-0 stroke-[1.8] sm:h-[29px] sm:w-[29px]" />
                    <span className="flex-1">{label}</span>
                    <FiChevronRight aria-hidden="true" className="h-[20px] w-[20px] shrink-0 stroke-[1.8] transition-transform group-hover:translate-x-0.5" />
                  </NavLink>
                ))}
              </nav>

              <Link
                to="/inventory"
                className="site-button mt-5 inline-flex min-h-[62px] shrink-0 items-center justify-center gap-4 rounded-[8px] bg-[var(--color-button)] px-4 text-white transition hover:bg-[var(--color-button-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-button)] sm:mt-5 sm:min-h-[84px] sm:gap-5"
                onClick={() => setOpen(false)}
              >
                <FiSearch aria-hidden="true" className="h-6 w-6 stroke-[1.8]" />
                <span>Search Inventory</span>
                <FaArrowRight aria-hidden="true" className="text-[18px]" />
              </Link>

              <div className="mt-3 grid shrink-0 grid-cols-2 gap-3 sm:mt-6 sm:gap-4">
                <a href={phoneHref} target={business.phoneHref ? undefined : '_blank'} rel={business.phoneHref ? undefined : 'noreferrer'} className="mobile-menu-contact grid min-h-[76px] grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 rounded-[8px] border border-[#dedad7] px-2.5 text-[#171717] transition hover:border-[var(--color-button)] sm:min-h-[94px] sm:gap-4 sm:px-4" onClick={() => { setOpen(false); trackContactCta('phone_click', 'Mobile Menu Contact') }}>
                  <FiPhone aria-hidden="true" className="h-6 w-6 shrink-0 stroke-[1.8]" />
                  <span className="min-w-0"><strong className="mobile-menu-contact-title block text-[14px] font-semibold sm:text-[17px]">Call Now</strong><span className="mobile-menu-contact-detail mt-0.5 block text-[11px] leading-tight text-[#66615e] sm:text-[14px]">{displayPhone}</span></span>
                </a>
                <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="mobile-menu-contact grid min-h-[76px] grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 rounded-[8px] border border-[#dedad7] px-2.5 text-[#171717] transition hover:border-[var(--color-button)] sm:min-h-[94px] sm:gap-4 sm:px-4" onClick={() => { setOpen(false); trackContactCta('directions_click', 'Mobile Menu Directions') }}>
                  <FaMapMarkerAlt aria-hidden="true" className="shrink-0 text-[24px]" />
                  <span className="min-w-0"><strong className="mobile-menu-contact-title block text-[14px] font-semibold sm:text-[17px]">Directions</strong><span className="mobile-menu-contact-detail mt-0.5 block text-[11px] leading-tight text-[#66615e] sm:text-[14px]">{business.cityState}</span></span>
                </a>
              </div>

              <div className={`mt-5 flex shrink-0 flex-col gap-3 rounded-[8px] px-4 py-3.5 text-[14px] leading-[1.5] sm:mt-8 sm:px-5 sm:py-5 sm:text-[16px] ${businessOpen ? 'bg-[#eaf1eb] text-[#304b35]' : 'bg-[#f3e9e8] text-[#75413e]'}`}>
                <div className="flex items-center gap-4">
                  <FaClock aria-hidden="true" className={`shrink-0 text-[22px] ${businessOpen ? 'text-[#55765b]' : 'text-[#a26762]'}`} />
                  <p>Mon - Fri: 9AM - 5PM<br />Sat - Sun: Closed</p>
                </div>
                <span className={`w-full text-center text-[11px] font-semibold tracking-[0.04em] sm:text-xs ${businessOpen ? 'text-[#55765b]' : 'text-[#a26762]'}`} aria-live="polite">
                  {businessOpen ? 'OPEN NOW' : 'CLOSED NOW'}
                </span>
              </div>

            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
