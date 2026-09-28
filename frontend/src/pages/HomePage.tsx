import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import { FaArrowLeft, FaArrowRight, FaCarSide, FaClock, FaCog, FaMapMarkerAlt, FaPhoneAlt, FaRoad, FaShieldAlt, FaTag, FaWrench } from "react-icons/fa";
import { listVehicles } from "../api/vehicles";
import { Button } from "../components/Button";
import { ReviewCarousel } from "../components/ReviewCarousel";
import { Seo } from "../components/Seo";
import { business } from "../data/business";
import type { Vehicle } from "../types/vehicle";
import { formatNumber, formatPrice } from "../utils/format";
import { autoDealerSchema } from "../utils/schema";

const FeaturedVehicleShowcase = ({ vehicle }: { vehicle: Vehicle }) => {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const image = vehicle.images[0];
  return (
    <article className="home-inventory-card group">
      <Link
        to={`/inventory/${vehicle.slug}`}
        className="home-inventory-card__image"
        aria-label={`View details for ${title}`}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
        />
        {vehicle.status?.toLowerCase() === "new arrival" ? <span className="home-inventory-card__badge">New arrival</span> : null}
      </Link>
      <div className="home-inventory-card__body">
        <div>
          <div className="home-inventory-card__meta"><span>{vehicle.bodyType}</span>{vehicle.stockNumber ? <span>#{vehicle.stockNumber}</span> : null}</div>
          <h3>{title}</h3>
          <p className="home-inventory-card__trim">{vehicle.trim || '\u00a0'}</p>
          <p className="home-inventory-card__price">{formatPrice(vehicle.price)}</p>
          <div className="home-inventory-card__specs">
            <span><FaRoad />{formatNumber(vehicle.mileage)} mi</span>
            {vehicle.engine ? <span><FaCog />{vehicle.engine}</span> : null}
            {vehicle.drivetrain ? <span><FaCarSide />{vehicle.drivetrain}</span> : null}
          </div>
        </div>
        <Link to={`/inventory/${vehicle.slug}`} className="home-inventory-card__cta" aria-label={`View ${title}`}><FaArrowRight /></Link>
      </div>
    </article>
  );
};

const vehicleCategories = [
  { key: "trucks", title: "Trucks", matches: (vehicle: Vehicle) => /truck|pickup/i.test(vehicle.bodyType) || /silverado|sierra|f-150|ram 1500|raptor/i.test(`${vehicle.make} ${vehicle.model}`) },
  { key: "suvs", title: "SUVs", matches: (vehicle: Vehicle) => /suv/i.test(vehicle.bodyType) || /explorer|wrangler|land cruiser|escalade|cayenne|model x|g-class|g63/i.test(`${vehicle.make} ${vehicle.model}`) },
  { key: "cars", title: "Cars", matches: (vehicle: Vehicle) => !/corvette/i.test(`${vehicle.make} ${vehicle.model}`) && (/car|sedan|coupe|convertible|sports/i.test(vehicle.bodyType) || /camry|audi s8/i.test(`${vehicle.make} ${vehicle.model}`)) },
  { key: "specialty", title: "Specialty", query: "Corvette", matches: (vehicle: Vehicle) => /special|other|custom|exotic|corvette/i.test(`${vehicle.bodyType} ${vehicle.make} ${vehicle.model}`) },
];

const VehicleTypeChooser = ({ vehicles, loading }: { vehicles: Vehicle[]; loading: boolean }) => (
  <section className="vehicle-type-chooser" aria-labelledby="vehicle-type-title">
    <div className="vehicle-type-chooser__inner">
      <div className="vehicle-type-chooser__intro">
        <h2 id="vehicle-type-title">Find the Right Vehicle</h2>
        <p className="vehicle-type-chooser__description">Explore our selection of quality used cars, trucks, and SUVs. Every vehicle is inspected and ready for the road.</p>
        <Link className="vehicle-type-chooser__all" to="/inventory">View all inventory <FaArrowRight /></Link>
      </div>
      <div className="vehicle-type-chooser__cards">
        {vehicleCategories.map((category) => {
          const matchingVehicles = vehicles.filter(category.matches);
          const categoryVehicle = matchingVehicles[0];
          const representative = matchingVehicles[0];
          const bodyType = categoryVehicle?.bodyType;
          const href = category.query && matchingVehicles.length
            ? `/inventory?q=${encodeURIComponent(category.query)}`
            : bodyType ? `/inventory?bodyType=${encodeURIComponent(bodyType)}` : "/inventory";
          return (
            <Link className="vehicle-type-card" key={category.key} to={href}>
              {representative?.images[0] ? <img src={representative.images[0]} alt={`${category.title} from the current inventory`} loading="lazy" /> : <span className="vehicle-type-card__empty" />}
              <span className="vehicle-type-card__shade" />
              <span className="vehicle-type-card__title">{category.title}<FaArrowRight /></span>
              <span className="vehicle-type-card__footer">
                <i />
                <span>View {category.title}{!loading && matchingVehicles.length > 0 ? ` (${matchingVehicles.length})` : ""}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

const HomeAboutSection = () => (
  <section className="home-about-section" aria-labelledby="home-about-title">
    <div className="home-about__panel">
      <div className="home-about__photo">
        <img src="/images/dealership-about.webp" alt="Smith's Sales & Services dealership and vehicle lot in Commodore, Pennsylvania" loading="lazy" />
        <span className="home-about__location"><FaMapMarkerAlt />Commodore, PA</span>
      </div>
      <div className="home-about__content">
        <div className="home-about__story">
          <h2 id="home-about-title">A Local Dealership You Can Count On.</h2>
          <p className="home-about__description">Smith&apos;s Sales &amp; Services is a used car dealership in Commodore, Pennsylvania. Explore our selection of quality vehicles, see clear pricing, and reach a local team before or after your visit.</p>
          <Link to="/about" className="home-about__learn">Learn more <FaArrowRight /></Link>
        </div>
        <div className="home-about__benefits" aria-label="What you can expect">
          <div className="home-about__benefit"><FaShieldAlt /><div><h3>Quality vehicles</h3><p>Inspected and road-ready.</p></div></div>
          <div className="home-about__benefit"><FaTag /><div><h3>Fair pricing</h3><p>Vehicle prices listed up front.</p></div></div>
          <div className="home-about__benefit"><FaWrench /><div><h3>Local service</h3><p>Here in Commodore, PA.</p></div></div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedVehiclesSkeleton = () => (
  <div className="home-inventory-grid" aria-label="Loading featured vehicles">
    {Array.from({ length: 4 }).map((_, index) => <div className="h-[220px] animate-pulse bg-[#e5e5e0]" key={index} />)}
  </div>
);

export const HomePage = () => {
  const prefersReducedMotion = useReducedMotion();
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [featuredPage, setFeaturedPage] = useState(0);
  const [isMobileFeatured, setIsMobileFeatured] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 640px)');
    const updateMobileLayout = () => setIsMobileFeatured(mobileQuery.matches);
    mobileQuery.addEventListener('change', updateMobileLayout);
    return () => mobileQuery.removeEventListener('change', updateMobileLayout);
  }, []);

  useEffect(() => {
    let cancelled = false;

    listVehicles({ pageSize: 12 })
      .then(async (firstPage) => {
        const pageCount = Math.ceil(firstPage.total / firstPage.pageSize);
        if (pageCount === 1) return firstPage;

        const remainingPages = await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, index) => listVehicles({ page: index + 2, pageSize: firstPage.pageSize })),
        );

        return {
          ...firstPage,
          items: [firstPage, ...remainingPages].flatMap((page) => page.items),
        };
      })
      .then((response) => {
        if (!cancelled) {
          setFeatured(response.items);
          setFeaturedError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFeatured([]);
          setFeaturedError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setFeaturedLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredPageCount = Math.max(1, isMobileFeatured ? featured.length : Math.ceil(featured.length / 4));
  const activeFeaturedPage = featuredPage % featuredPageCount;
  const featuredStart = isMobileFeatured
    ? (featured.length ? activeFeaturedPage : 0)
    : Math.min(activeFeaturedPage * 4, Math.max(0, featured.length - 4));
  const visibleFeaturedVehicles = isMobileFeatured
    ? Array.from({ length: Math.min(4, featured.length) }, (_, index) => featured[(featuredStart + index) % featured.length])
    : featured.slice(featuredStart, featuredStart + 4);
  const changeFeaturedPage = (direction: -1 | 1) => {
    setFeaturedPage((current) => (current + direction + featuredPageCount) % featuredPageCount);
  };
  return (
    <>
      <Seo
        title="Used Cars in Commodore, PA"
        description="Smith's Sales & Services is a local dealership in Commodore, PA. Browse inventory, call the lot, or get directions."
        schema={autoDealerSchema}
      />

      <section className="home-hero relative isolate flex min-h-[475px] items-center overflow-hidden bg-[#090909] text-white lg:h-[min(500px,calc(100svh-90px))] lg:min-h-[460px]">
        <img
          src="/images/smiths-sales-hero.webp"
          alt="Smith's Sales & Services dealership and vehicle lot in Commodore, Pennsylvania"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,8,8,.95)_0%,rgba(8,8,8,.86)_24%,rgba(8,8,8,.22)_43%,rgba(8,8,8,.015)_68%),linear-gradient(0deg,rgba(8,8,8,.08),rgba(8,8,8,0)),linear-gradient(rgba(8,8,8,.28),rgba(8,8,8,.28))]" />
        <div className="mx-auto w-full max-w-[1750px] px-6 py-12 sm:px-10 lg:px-12">
          <div className="max-w-[1250px]">
            <h1 className="w-fit max-w-full text-[clamp(3rem,7vw,7rem)] font-bold uppercase leading-[.9] tracking-[.025em] text-white">GOOD USED CARS.<br />NO NONSENSE.</h1>
            <p className="mt-4 max-w-[380px] text-[15px] leading-[1.55] text-white/90">Cars, trucks, and SUVs, inspected and ready for the road. Fair prices and honest service right here in Commodore, PA.</p>
          <Link to="/inventory" className="site-button mt-6 inline-flex h-[52px] items-center gap-3 bg-[#f7f7f4] px-7 text-[15px] font-bold uppercase tracking-[.1em] text-[#191919] transition hover:bg-[#e8e8e3]">Browse inventory <FaArrowRight className="text-lg" /></Link>
          </div>
        </div>
      </section>

      <motion.section
        className="home-inventory-carousel"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: prefersReducedMotion ? 0.1 : 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="home-inventory-carousel__label">
          <p>Featured<br />vehicles</p>
          <div className="home-inventory-carousel__controls">
            <button type="button" aria-label="Show previous featured vehicles" disabled={featuredPageCount <= 1} onClick={() => changeFeaturedPage(-1)}><FaArrowLeft /></button>
            <button type="button" aria-label="Show next featured vehicles" disabled={featuredPageCount <= 1} onClick={() => changeFeaturedPage(1)}><FaArrowRight /></button>
          </div>
          <span className="home-inventory-carousel__count" aria-live="polite">{String(activeFeaturedPage + 1).padStart(2, "0")} <i /> {String(featuredPageCount).padStart(2, "0")}</span>
        </div>
        <div className="home-inventory-carousel__content">
          {featuredLoading ? <FeaturedVehiclesSkeleton /> : featuredError ? (
            <div className="featured-vehicles-message">Inventory is temporarily unavailable. Please try again later or call us for current vehicles.</div>
          ) : visibleFeaturedVehicles.length ? (
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={featuredPage}
                className="home-inventory-grid"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: prefersReducedMotion ? 0.08 : 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {visibleFeaturedVehicles.map((vehicle) => <FeaturedVehicleShowcase key={vehicle.id} vehicle={vehicle} />)}
              </motion.div>
            </AnimatePresence>
          ) : <div className="featured-vehicles-message">No featured vehicles are available right now. Please check the full inventory or call us.</div>}
        </div>
      </motion.section>

      <VehicleTypeChooser vehicles={featured} loading={featuredLoading} />

      <HomeAboutSection />

      <ReviewCarousel />

      <section className="visit-dealership-section">
        <div className="visit-dealership-block">
          <div className="visit-dealership-content">
            <h2>Come See Us in Commodore.</h2>
            <p className="visit-dealership-description">
              We’re a local used car dealership in Commodore, Pennsylvania. Stop by, call us, or get directions. We’re happy to help.
            </p>
            <div className="visit-dealership-contact-row">
              <div><FaMapMarkerAlt /><p><strong>{business.address}</strong><span>{business.cityState} {business.postalCode}</span></p></div>
              <a href={business.phoneHref}><FaPhoneAlt /><p><strong>{business.phone}</strong><span>Give us a call</span></p></a>
            </div>
            <div className="visit-dealership-actions">
              <Button href={business.mapsUrl} className="visit-dealership-button visit-dealership-button--primary">Get directions <FaArrowRight /></Button>
              <Button href="/contact" variant="secondary" className="visit-dealership-button visit-dealership-button--secondary">Contact us <FaArrowRight /></Button>
            </div>
          </div>
          <div className="visit-dealership-photo">
            <img src="/images/commodore-dealership.webp" alt="Smith's Sales & Services dealership and vehicle lot in Commodore, Pennsylvania" loading="lazy" />
          </div>
        </div>
        <div className="visit-dealership-info" aria-label="Dealership hours and information">
          <div><FaClock /><p><strong>Monday to Friday</strong><span>9:00 AM to 5:00 PM</span></p></div>
          <div><FaClock /><p><strong>Saturday and Sunday</strong><span>Closed</span></p></div>
          <div><FaMapMarkerAlt /><p><strong>Commodore, Pennsylvania</strong><span>{`${business.address}, ${business.cityState} ${business.postalCode}`}</span></p></div>
          <div><FaCarSide /><p><strong>Quality vehicles</strong><span>Inspected and road-ready.</span></p></div>
        </div>
      </section>
    </>
  );
};
