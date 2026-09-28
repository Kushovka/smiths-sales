import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaChevronLeft, FaChevronRight, FaExpand, FaSearchPlus, FaTimes } from 'react-icons/fa'
import { listVehicleImages } from '../api/vehicles'

type VehicleGalleryProps = {
  images: string[]
  imagesTotal?: number
  slug: string
  title: string
  onShowPhotos: () => void
  showAllPhotos: boolean
}

const loadBatchSize = 8

export const VehicleGallery = ({ images, imagesTotal, slug, title, onShowPhotos, showAllPhotos }: VehicleGalleryProps) => {
  const [active, setActive] = useState(0)
  const [loadedImages, setLoadedImages] = useState(images)
  const [totalImages, setTotalImages] = useState(imagesTotal || images.length)
  const [imageLoading, setImageLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [photosPortalReady, setPhotosPortalReady] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const currentImage = loadedImages[active] ?? loadedImages[0]
  const sideImages = loadedImages.map((image, index) => ({ image, index })).filter(({ index }) => index !== active).slice(0, 3)
  const photoGridTarget = document.getElementById('vehicle-photos-grid')

  useEffect(() => {
    setPhotosPortalReady(showAllPhotos)
  }, [showAllPhotos])

  useEffect(() => {
    setActive(0)
    setLoadedImages(images)
    setTotalImages(imagesTotal || images.length)
    setImageLoading(false)
    setLoadingMore(false)
    setZoomed(false)
  }, [images, imagesTotal, slug])

  const loadMoreImages = useCallback(async () => {
    if (loadingMore || loadedImages.length >= totalImages) return [] as string[]
    setLoadingMore(true)
    try {
      const response = await listVehicleImages(slug, loadedImages.length, loadBatchSize)
      const known = new Set(loadedImages)
      const additions = response.items.filter((image) => !known.has(image))
      setLoadedImages((current) => [...current, ...additions])
      setTotalImages(response.total)
      return additions
    } finally {
      setLoadingMore(false)
    }
  }, [loadedImages, loadingMore, slug, totalImages])

  const goTo = useCallback(async (index: number) => {
    const nextIndex = index < 0 ? totalImages - 1 : index >= totalImages ? 0 : index
    if (nextIndex < loadedImages.length) {
      setImageLoading(loadedImages[nextIndex] !== loadedImages[active])
      setActive(nextIndex)
      setZoomed(false)
      return
    }
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const response = await listVehicleImages(slug, loadedImages.length, Math.max(loadBatchSize, nextIndex - loadedImages.length + 1))
      const known = new Set(loadedImages)
      const additions = response.items.filter((image) => !known.has(image))
      setLoadedImages((current) => [...current, ...additions])
      setTotalImages(response.total)
      if (nextIndex < loadedImages.length + additions.length) {
        setImageLoading(additions[nextIndex - loadedImages.length] !== loadedImages[active])
        setActive(nextIndex)
        setZoomed(false)
      }
    } finally {
      setLoadingMore(false)
    }
  }, [active, loadedImages, loadingMore, slug, totalImages])

  const previous = useCallback(() => { void goTo(active - 1) }, [active, goTo])
  const next = useCallback(() => { void goTo(active + 1) }, [active, goTo])

  useEffect(() => {
    if (!lightbox) return undefined
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(false)
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightbox, next, previous])

  if (!currentImage) return <div className="min-h-[330px] bg-[var(--color-primary)]" />

  return <div className="lg:absolute lg:inset-x-8 lg:inset-y-5">
    <div className="grid h-[330px] grid-cols-1 grid-rows-[minmax(0,1fr)_88px] gap-1 overflow-hidden bg-[var(--color-background)] sm:h-[430px] sm:grid-cols-[minmax(0,2.25fr)_minmax(150px,1fr)] sm:grid-rows-3 lg:h-full" onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => { if (touchStartX === null) return; const delta = event.changedTouches[0].clientX - touchStartX; if (Math.abs(delta) > 48) { if (delta > 0) previous(); else next() }; setTouchStartX(null) }}>
      <div className="group relative row-start-1 min-h-0 overflow-hidden bg-[var(--color-primary)] sm:row-span-3">
        <button aria-label="Open main vehicle photo" className="block h-full w-full" onClick={() => setLightbox(true)} type="button">
          <img src={currentImage} alt={title} className={`h-full w-full object-cover transition-opacity duration-200 ${imageLoading ? 'opacity-60' : 'opacity-100'}`} onLoad={() => setImageLoading(false)} onError={() => setImageLoading(false)} />
        </button>
        {loadedImages.length > 1 ? <>
          <button aria-label="Previous image" className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/75 text-sm text-white transition hover:bg-[var(--color-button)] disabled:opacity-40" disabled={loadingMore} onClick={previous} type="button"><FaChevronLeft /></button>
          <button aria-label="Next image" className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/75 text-sm text-white transition hover:bg-[var(--color-button)] disabled:opacity-40" disabled={loadingMore} onClick={next} type="button"><FaChevronRight /></button>
        </> : null}
        <span className="absolute left-4 top-4 bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white">{active + 1} / {totalImages}</span>
        {loadingMore ? <span className="absolute bottom-4 left-4 bg-black/65 px-3 py-2 text-xs text-white">Loading photos…</span> : null}
        <button aria-label="View fullscreen gallery" className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/75 text-sm text-white transition hover:bg-[var(--color-button)]" type="button" onClick={() => setLightbox(true)}><FaExpand /></button>
      </div>
      {sideImages.map(({ image, index }, previewIndex) => <button key={`${image}-${index}`} aria-label={previewIndex === 2 && totalImages > 4 ? 'Show all vehicle photos' : `View photo ${index + 1}`} className="group relative hidden min-h-0 overflow-hidden bg-[var(--color-primary)] sm:block" type="button" onClick={() => { if (previewIndex === 2 && totalImages > 4) { onShowPhotos(); void loadMoreImages() } else { void goTo(index); setLightbox(true) } }}>
        <img src={image} alt={`${title}, photo ${index + 1}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" loading="lazy" />
        {previewIndex === 2 && totalImages > 4 ? <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/70 px-2 py-3 text-xs font-bold text-white"><FaExpand /> +{totalImages - 4} Photos</span> : null}
      </button>)}
      <div className="grid grid-cols-3 gap-1 sm:hidden">
        {sideImages.map(({ image, index }, previewIndex) => <button key={`${image}-${index}`} aria-label={previewIndex === 2 && totalImages > 4 ? 'Show all vehicle photos' : `View photo ${index + 1}`} className="relative min-w-0 overflow-hidden bg-[var(--color-primary)]" type="button" onClick={() => { if (previewIndex === 2 && totalImages > 4) { onShowPhotos(); void loadMoreImages() } else { void goTo(index); setLightbox(true) } }}><img src={image} alt={`${title}, photo ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />{previewIndex === 2 && totalImages > 4 ? <span className="absolute inset-0 grid place-items-center bg-black/60 text-xs font-bold text-white">+{totalImages - 4} Photos</span> : null}</button>)}
      </div>
    </div>
    {showAllPhotos && photosPortalReady && photoGridTarget ? createPortal(<div>
      <div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-[var(--color-primary)]">All photos</p><span className="text-xs text-[var(--color-muted)]">{loadedImages.length} of {totalImages}</span></div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">{loadedImages.map((image, index) => <button key={`${image}-${index}`} aria-label={`Show image ${index + 1}`} onClick={() => { void goTo(index); setLightbox(true) }} type="button" className={`aspect-[4/3] overflow-hidden border-2 bg-[var(--color-primary)] transition ${active === index ? 'border-[var(--color-accent)]' : 'border-transparent opacity-80 hover:opacity-100'}`}><img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" loading="lazy" /></button>)}</div>
      {loadedImages.length < totalImages ? <button className="mt-4 min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 text-sm font-medium text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-hover)] disabled:opacity-70" disabled={loadingMore} onClick={() => void loadMoreImages()} type="button">{loadingMore ? 'Loading photos…' : `Load ${Math.min(loadBatchSize, totalImages - loadedImages.length)} more photos (${loadedImages.length} of ${totalImages})`}</button> : null}
    </div>, photoGridTarget) : null}
    {lightbox ? <div className="fixed inset-0 z-[70] bg-black/95 p-4" onClick={(event) => { if (event.target === event.currentTarget) setLightbox(false) }}>
      <button aria-label="Close gallery" className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white transition hover:bg-white/20" onClick={() => setLightbox(false)} type="button"><FaTimes /></button>
      {totalImages > 1 ? <>
        <button aria-label="Previous image" className="absolute left-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white transition hover:bg-white/20 disabled:opacity-35" disabled={loadingMore} onClick={previous} type="button"><FaChevronLeft /></button>
        <button aria-label="Next image" className="absolute right-5 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white transition hover:bg-white/20 disabled:opacity-35" disabled={loadingMore} onClick={next} type="button"><FaChevronRight /></button>
      </> : null}
      <button aria-label={zoomed ? 'Zoom out' : 'Zoom in'} className="absolute bottom-5 left-1/2 z-10 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-sm text-white transition hover:bg-white/20" onClick={() => setZoomed((value) => !value)} type="button"><FaSearchPlus className={zoomed ? 'scale-90 opacity-70' : ''} /></button>
      <div className="flex h-full items-center justify-center overflow-auto px-8 py-12 sm:px-12"><img src={currentImage} alt={title} className={`${zoomed ? 'max-h-none max-w-none scale-150' : 'max-h-[84vh] w-full max-w-6xl'} object-contain transition duration-200 ${imageLoading ? 'opacity-55' : 'opacity-100'}`} onLoad={() => setImageLoading(false)} onError={() => setImageLoading(false)} onClick={() => setZoomed((value) => !value)} /></div>
      <span className="absolute bottom-5 right-5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white">{active + 1} / {totalImages}</span>
    </div> : null}
  </div>
}
