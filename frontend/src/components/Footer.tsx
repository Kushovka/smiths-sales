import { Link } from 'react-router'
import { FaArrowRight, FaClock, FaMapMarkerAlt, FaPhoneAlt, FaShieldAlt, FaTruck, FaWrench } from 'react-icons/fa'

import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const columns = [
  { title: 'Inventory', links: [['View All Inventory', '/inventory']] },
  { title: 'Sales & Services', links: [['Warranty', '/warranty'], ['Delivery', '/delivery']] },
  { title: 'About', links: [['About Us', '/about'], ['Our Team', '/team']] },
  { title: 'Support', links: [['Contact Us', '/contact'], ['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms']] },
]

export const Footer = () => (
  <footer className="home-footer">
    <div className="home-footer-container">
      <div className="home-footer-main">
        <section className="home-footer-intro" aria-label="Smith's Sales & Services">
          <Link to="/" className="home-footer-logo"><img src="/images/smiths-sales-logo-dark.webp" alt="Smith's Sales & Services" /></Link>
          <p>Used cars and services from a local Pennsylvania dealer. Quality vehicles, honest service, and a team that&apos;s always happy to help.</p>
          <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="home-footer-contact-line" onClick={() => trackContactCta('directions_click', 'Footer Address')}><FaMapMarkerAlt /><span>{business.address}<br />{business.cityState} {business.postalCode}<br /><u>View on Google Maps <FaArrowRight /></u></span></a>
          <a href={business.phoneHref} className="home-footer-contact-line" onClick={() => trackContactCta('phone_click', 'Footer Call')}><FaPhoneAlt /><span>{business.phone}<br /><u>Call or Text <FaArrowRight /></u></span></a>
          <div className="home-footer-contact-line"><FaClock /><span><b>Mon-Fri:</b> 9:00 AM to 5:00 PM<br /><b>Saturday:</b> Closed<br /><b>Sunday:</b> Closed</span></div>
        </section>
        {columns.map((column) => <nav className="home-footer-column" aria-label={`${column.title} links`} key={column.title}>
          <h2>{column.title}</h2><i />
          {column.links.map(([label, href]) => <Link to={href} key={href}>{label}</Link>)}
        </nav>)}
        <section className="home-footer-visit">
          <div className="home-footer-cta">
            <h2>Stay in the loop</h2>
            <p>Questions about a vehicle or our services? We&apos;re here to help.</p>
            <Link to="/contact#contact-form" className="home-footer-cta-button" onClick={() => trackContactCta('form_open', 'Footer Contact Form')}>
              Contact us <FaArrowRight aria-hidden="true" />
            </Link>
            <div className="home-footer-benefits" aria-label="Our services">
              <div><FaShieldAlt aria-hidden="true" /><span>Inspected<br />vehicles</span></div>
              <div><FaWrench aria-hidden="true" /><span>Local<br />service</span></div>
              <div><FaTruck aria-hidden="true" /><span>Delivery<br />available</span></div>
            </div>
          </div>
          <h2>Visit Smith&apos;s</h2>
          <p>{business.address}<br />{business.cityState} {business.postalCode}</p>
          <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="home-footer-map" onClick={() => trackContactCta('directions_click', 'Footer Map')}>
            <iframe title="Map to Smith's Sales & Services" loading="lazy" src={business.mapEmbedUrl} tabIndex={-1} />
            <span>Get directions <FaArrowRight /></span>
          </a>
        </section>
      </div>
      <div className="home-footer-bottom">
        <span>© 2026 Smith&apos;s Sales &amp; Services. All rights reserved.</span>
        <div>{[['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms']].map(([label, href]) => <Link key={label} to={href}>{label}</Link>)}</div>
      </div>
    </div>
  </footer>
)
