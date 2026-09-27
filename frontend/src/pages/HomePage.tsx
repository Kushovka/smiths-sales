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

const featuredCutouts: Record<string, string> = {
  "2021-porsche-cayenne-turbo": "/images/featured-cars/porsche-cayenne.webp",
  "2019-tesla-model-x-performance": "/images/featured-cars/tesla-model-x.webp",
  "2020-audi-s8": "/images/featured-cars/audi-s8.webp",
  "2023-chevrolet-silverado-1500-rst-black-widow": "/images/featured-cars/chevrolet-silverado-1500.webp",
  "2024-ram-1500-trx-final-edition": "/images/featured-cars/ram-1500-trx.webp",
  "2019-mercedes-amg-g63": "/images/featured-cars/mercedes-amg-g63.webp",
  "2021-ford-f-150-raptor-supercrew": "/images/featured-cars/ford-f150-raptor.webp",
  "2020-chevrolet-corvette-stingray-2lt": "/images/featured-cars/chevrolet-corvette.webp",
  "2021-toyota-land-cruiser-urj200-22k": "/images/featured-cars/toyota-land-cruiser.webp",
  "2021-toyota-land-cruiser-urj200-23k": "/images/featured-cars/toyota-land-cruiser-23k.webp",
  "2025-toyota-land-cruiser-j250": "/images/featured-cars/toyota-land-cruiser-j250.webp",
  "2024-chevrolet-corvette-z06-convertible-3lz": "/images/featured-cars/corvette-z06-convertible.webp",
  "2024-chevrolet-corvette-stingray-3lt-z51": "/images/featured-cars/corvette-stingray-2024.webp",
  "2024-gmc-sierra-2500hd-denali-ultimate": "/images/featured-cars/gmc-sierra-2500hd.webp",
  "2023-cadillac-escalade-v": "/images/featured-cars/cadillac-escalade-v.webp",
  "2022-gmc-sierra-1500-limited-harley-davidson": "/images/featured-cars/gmc-sierra-1500.webp",
};

const FeaturedVehicleShowcase = ({ vehicle }: { vehicle: Vehicle }) => {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const image = featuredCutouts[vehicle.slug] ?? vehicle.images[0];
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
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);

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

  const featuredPageCount = Math.max(1, Math.ceil(featured.length / 4));
  const featuredStart = Math.min(featuredPage * 4, Math.max(0, featured.length - 4));
  const visibleFeaturedVehicles = featured.slice(featuredStart, featuredStart + 4);
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
        <div className="mx-auto w-full max-w-[1550px] px-6 py-12 sm:px-10 lg:px-12">
          <div className="max-w-[760px]">
            <h1 className="font-['Barlow_Condensed'] text-[clamp(3rem,7vw,7rem)] font-bold uppercase leading-[.9] tracking-[.025em] text-white">GOOD USED CARS.<br />NO NONSENSE.</h1>
            <p className="mt-4 max-w-[380px] text-[15px] leading-[1.55] text-white/90">Cars, trucks, and SUVs, inspected and ready for the road. Fair prices and honest service right here in Commodore, PA.</p>
            <Link to="/inventory" className="mt-6 inline-flex h-[52px] items-center gap-3 bg-[#f7f7f4] px-7 text-[15px] font-bold uppercase tracking-[.1em] text-[#191919] transition hover:bg-[#e8e8e3]">Browse inventory <FaArrowRight className="text-lg" /></Link>
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
          <span className="home-inventory-carousel__count" aria-live="polite">{String(Math.min(featuredPage + 1, featuredPageCount)).padStart(2, "0")} <i /> {String(featuredPageCount).padStart(2, "0")}</span>
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
