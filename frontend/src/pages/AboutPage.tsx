import { FaArrowRight, FaFileAlt, FaHandshake, FaHeadset, FaMapMarkerAlt, FaPhoneAlt, FaShieldAlt, FaTruck, FaUsers, FaWrench } from 'react-icons/fa'
import { Link } from 'react-router'
import { Seo } from '../components/Seo'
import { business } from '../data/business'

const values = [
  { icon: FaHandshake, title: 'Honest deals', text: 'Straightforward pricing and clear answers.' },
  { icon: FaUsers, title: 'Friendly team', text: 'A knowledgeable team ready to help.' },
  { icon: FaShieldAlt, title: 'Quality vehicles', text: 'Pre-owned vehicles inspected with care.' },
  { icon: FaMapMarkerAlt, title: 'Serving drivers', text: 'Based in Commodore, Pennsylvania.' },
]

const benefits = [
  { icon: FaFileAlt, title: 'Clear information', text: 'Know what to expect as you shop.' },
  { icon: FaWrench, title: 'Inspected vehicles', text: 'Quality pre-owned vehicles, carefully inspected.' },
  { icon: FaTruck, title: 'Vehicle delivery', text: 'Ask our team about delivery options.' },
  { icon: FaHeadset, title: 'Here to help', text: 'Our team can help before and after your visit.' },
]

export const AboutPage = () => (
  <div className="about-page">
    <Seo title="About Smith's Sales & Services" description="Meet Smith's Sales & Services, located in Commodore, Pennsylvania." />

    <section className="about-hero">
      <div className="about-hero-copy">
        <h1>Local Dealership<br />Nationwide Reach</h1>
        <p>Smith&apos;s Sales &amp; Services is a local dealership in Commodore, PA. Explore quality pre-owned vehicles and get straightforward help from our team.</p>
        <div className="about-actions">
          <Link className="about-button about-button--red" to="/inventory">Browse Our Inventory <FaArrowRight /></Link>
          <Link className="about-button" to="/contact">Contact Us <FaArrowRight /></Link>
        </div>
      </div>
    </section>

    <section className="about-values" aria-label="What you can expect">
      <div className="about-values-grid">
        {values.map(({ icon: Icon, title, text }) => <article key={title}>
          <Icon aria-hidden="true" /><div><h2>{title}</h2><p>{text}</p></div>
        </article>)}
      </div>
    </section>

    <section className="about-story">
      <img src="/images/commodore-dealership.webp" alt="The Smith's Sales & Services lot along PA-286" />
      <div className="about-story-copy">
        <h2>Built on Hard Work and a Commitment to Our Customers</h2>
        <p>Smith&apos;s Sales &amp; Services is located in Commodore, Pennsylvania. We help drivers shop for pre-owned vehicles with clear information, attentive service, and a straightforward buying experience.</p>
      </div>
    </section>

    <section className="about-why">
      <div className="about-why-copy">
        <h2>A Better Car Buying Experience</h2>
        <p>Buying a vehicle should be straightforward. Our team is here to make each step clear, whether you&apos;re visiting the lot or shopping from home.</p>
        <Link className="about-button about-button--red" to="/inventory">Shop Our Inventory <FaArrowRight /></Link>
      </div>
      <div className="about-benefits">
        {benefits.map(({ icon: Icon, title, text }) => <article key={title}>
          <Icon aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div>
        </article>)}
      </div>
    </section>

    <section className="about-cta">
      <div>
        <h2>Find Your Next Vehicle Today</h2>
        <p>Browse our inventory or contact our team with any questions. We&apos;re here to help you find the right vehicle.</p>
        <div className="about-actions">
          <Link className="about-button about-button--red" to="/inventory">Shop Our Inventory <FaArrowRight /></Link>
          <a className="about-button about-button--dark" href={business.phoneHref}><FaPhoneAlt /> Call {business.phone}</a>
        </div>
      </div>
    </section>

    <section className="about-location">
      <div className="about-location-main">
        <div className="about-location-copy">
          <h2>Visit Us in<br />Commodore, PA</h2>
          <p>We&apos;re located at {business.address}, {business.cityState} {business.postalCode}. Stop by to see our inventory and meet our team.</p>
          <a className="about-button" href={business.mapsUrl} target="_blank" rel="noreferrer"><FaMapMarkerAlt /> View on Map <FaArrowRight /></a>
        </div>
        <img src="/images/dealership-about.webp" alt="Smith's Sales & Services on PA-286 in Commodore" />
      </div>
      <div className="about-location-facts">
        <div><strong>Quality inventory</strong><span>A selection of inspected pre-owned vehicles.</span></div>
        <div><strong>Local dealership</strong><span>Located in Commodore, Pennsylvania.</span></div>
        <div><strong>Convenient location</strong><span>Find us at 12018 PA-286.</span></div>
        <div><strong>Personal service</strong><span>Our team is ready to help.</span></div>
      </div>
    </section>

  </div>
)
