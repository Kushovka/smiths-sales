import { FaArrowRight, FaCalendarAlt, FaClock, FaCommentAlt, FaMap, FaMapMarkerAlt, FaPhoneAlt, FaTruck, FaWrench } from 'react-icons/fa'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'
import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const phoneHref = business.phoneHref || business.contactHref

const topics = [
  { icon: FaCommentAlt, title: 'Vehicle questions', text: 'Ask about our inventory, pricing, or vehicle details.' },
  { icon: FaWrench, title: 'Warranty & returns', text: 'Get information about our warranty and return policy.' },
  { icon: FaTruck, title: 'Delivery inquiries', text: 'Request a delivery quote or ask about nationwide delivery.' },
  { icon: FaCalendarAlt, title: 'Schedule a visit', text: "Let us know when you'd like to stop by our dealership." },
]

export const ContactPage = () => (
  <main className="contact-page">
    <Seo title="Contact" description="Call, visit, or send a message to Smith's Sales & Services in Commodore, PA." />

    <section className="contact-details" aria-labelledby="contact-details-title">
      <div className="contact-container contact-details-grid">
        <div className="contact-information">
          <h1 id="contact-details-title">Call / Visit /<br />Send a Message</h1>
          <p className="contact-intro">Questions about a vehicle, warranty, delivery, or your visit?<br className="contact-wide-break" /> Call us, stop by the dealership, or send us a message.</p>

          <div className="contact-facts">
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="contact-fact" onClick={() => trackContactCta('directions_click', 'Contact Page Address')}>
              <FaMapMarkerAlt aria-hidden="true" /><span>{business.address}<br />{business.cityState} {business.postalCode}</span>
            </a>
            <a href={phoneHref} className="contact-fact" onClick={() => trackContactCta('phone_click', 'Contact Page Contact')}>
              <FaPhoneAlt aria-hidden="true" /><span>{business.phone}<br />Call or Text</span>
            </a>
            <div className="contact-fact"><FaClock aria-hidden="true" /><span>Monday to Friday: 9:00 AM to 5:00 PM<br />Saturday and Sunday: Closed</span></div>
          </div>

          <div className="contact-actions">
            <a href={phoneHref} className="contact-action contact-action-primary" onClick={() => trackContactCta('phone_click', 'Contact Page Call Now')}><FaPhoneAlt aria-hidden="true" /> Call Now <FaArrowRight aria-hidden="true" /></a>
            <a href={business.mapsUrl} target="_blank" rel="noreferrer" className="contact-action contact-action-secondary" onClick={() => trackContactCta('directions_click', 'Contact Page Directions')}><FaMap aria-hidden="true" /> Get Directions <FaArrowRight className="contact-action-arrow" aria-hidden="true" /></a>
          </div>
        </div>

        <div className="contact-message">
          <h2>Send Smith’s a Message</h2>
          <p className="contact-form-intro">Our team will get back to you as soon as possible.</p>
          <LeadForm title="Send Message" variant="contact" markRequiredNameFields phonePlaceholder="Phone number*" messagePlaceholder="Message (optional)" inquiryOptions={['Vehicle questions', 'Warranty & returns', 'Delivery inquiries', 'Schedule a visit', 'Other']} />
        </div>
      </div>
    </section>

    <section className="contact-topics" aria-label="How we can help">
      <div className="contact-container contact-topics-grid">
        {topics.map(({ icon: Icon, title, text }) => <article className="contact-topic" key={title}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </div>
    </section>

    <section className="contact-location" aria-labelledby="location-heading">
      <div className="contact-container">
        <div className="contact-location-top">
          <div className="contact-location-copy">
            <h2 id="location-heading">Find Smith’s Sales &amp; Services in Commodore, PA</h2>
            <p>We’re located right on PA-286 in Commodore, Pennsylvania. Stop by to see our inventory in person, meet our team, and experience the difference at Smith’s Sales &amp; Services.</p>
            <a className="contact-action contact-action-secondary contact-location-button" href={business.mapsUrl} target="_blank" rel="noreferrer" onClick={() => trackContactCta('directions_click', 'Contact Page Map Directions')}><FaMapMarkerAlt aria-hidden="true" /> Open in Google Maps <FaArrowRight aria-hidden="true" /></a>
          </div>
          <img className="contact-dealership-photo" src="/images/commodore-dealership.webp" alt="Smith's Sales & Services dealership in Commodore, Pennsylvania" />
        </div>
        <iframe title="Smith's Sales & Services map" className="contact-map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={business.mapEmbedUrl} />
      </div>
    </section>

  </main>
)
