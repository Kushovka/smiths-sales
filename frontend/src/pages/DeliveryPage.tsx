import { useState } from 'react'
import { FaArrowRight, FaCar, FaCheck, FaClock, FaDollarSign, FaFileAlt, FaPhoneAlt, FaShieldAlt, FaTruck } from 'react-icons/fa'
import { Link } from 'react-router'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'
import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const benefits = [
  { icon: FaShieldAlt, title: 'Safe & reliable', text: 'Your vehicle is transported by trusted, insured carriers with a proven track record.' },
  { icon: FaDollarSign, title: 'Transparent pricing', text: 'Get a clear delivery quote upfront with no hidden fees.' },
  { icon: FaClock, title: 'Nationwide coverage', text: 'We deliver to all 50 states, including Alaska and Hawaii.' },
  { icon: FaFileAlt, title: 'Door-to-door service', text: 'Your vehicle is delivered directly to your home or preferred location.' },
]

const process = [
  ['Get a quote', 'Contact us with your ZIP code and the vehicle you’re interested in. We’ll provide a delivery quote and estimated timeframe.'],
  ['Schedule delivery', 'Once you’re ready, we’ll arrange transport with a trusted carrier and provide all the details.'],
  ['Vehicle transport', 'Your vehicle is picked up at our dealership and transported to your location.'],
  ['Receive your vehicle', 'Your vehicle is delivered directly to your driveway or preferred location. We’ll keep you updated every step of the way.'],
]

const questions = [
  ['How much does delivery cost?', 'Delivery cost depends on the destination and vehicle. Request a quote with your ZIP code and our team will follow up.'],
  ['How long does delivery take?', 'Timing varies by route and carrier availability. We’ll share an estimated timeframe when we discuss your quote.'],
  ['Do you deliver to Alaska and Hawaii?', 'Contact us with your destination. Our team can discuss options and prepare a custom quote.'],
  ['Is my vehicle insured during transport?', 'Ask us about carrier and transport details for your delivery before scheduling.'],
  ['What information do you need for a quote?', 'Send your destination city, state, ZIP code, and the vehicle you’re interested in.'],
  ['Can I track my vehicle during delivery?', 'We’ll share available delivery updates throughout the coordination process.'],
]

export const DeliveryPage = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const [quoteFormOpen, setQuoteFormOpen] = useState(false)
  const openQuoteForm = () => {
    setQuoteFormOpen(true)
    window.setTimeout(() => document.getElementById('delivery-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return <>
    <Seo title="Nationwide Vehicle Delivery" description="Coordinate vehicle delivery from Smith's Sales & Services in Commodore, Pennsylvania." />
    <main className="delivery-page">
      <section className="delivery-hero">
        <div className="delivery-hero-copy">
          <h1>Nationwide Vehicle Delivery</h1>
          <h2 className="delivery-hero-subtitle">Direct to Your Door</h2>
          <p className="delivery-hero-description">Have your vehicle delivered from Smith’s Sales &amp; Services in Commodore, PA directly to your home or preferred location. Contact us for a delivery quote and estimated timeframe.</p>
          <div className="delivery-actions">
          <a className="delivery-button delivery-button--red" href="#delivery-quote" onClick={(event) => { event.preventDefault(); openQuoteForm() }}><FaTruck />Get a Delivery Quote<FaArrowRight /></a>
            <Link className="delivery-button delivery-button--light" to="/inventory"><FaCar aria-hidden="true"/>Browse Our Inventory<FaArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="delivery-benefits delivery-wrap" aria-label="Delivery benefits">
        <div className="delivery-benefits-grid">{benefits.map(({ icon: Icon, title, text }) => <article key={title}><Icon aria-hidden="true"/><div><h2>{title}</h2><p>{text}</p></div></article>)}</div>
      </section>

      <section className="delivery-lot delivery-section">
        <img src="/images/dealership-about.webp" alt="Vehicles in front of Smith’s Sales & Services in Commodore" loading="lazy" />
        <div className="delivery-copy">
          <h2>From Our Lot to Your Driveway</h2>
          <p>Whether you’re across the state or across the country, we’ll arrange everything for a smooth and hassle-free delivery. We work with professional auto transport carriers to make sure your vehicle arrives safely and on time.</p>
          <ul>{['Available for all vehicle types', 'Insured, professional carriers', 'Flexible delivery options', 'Real-time updates throughout the process'].map((item) => <li key={item}><FaCheck />{item}</li>)}</ul>
        </div>
      </section>

      <section className="delivery-coverage delivery-section">
        <div className="delivery-copy">
          <h2>We Deliver to All 50 States</h2>
          <p>Our delivery network covers the entire United States, including Alaska and Hawaii. No matter where you are, we can get your vehicle to you.</p>
          <div className="delivery-note"><FaTruck aria-hidden="true"/><span>Need delivery to Alaska or Hawaii?<br />Contact us for a custom quote.</span></div>
        </div>
        <img className="delivery-map-image" src="/images/nationwide-delivery-map.webp" alt="Nationwide delivery routes from Commodore, Pennsylvania, across the United States, Alaska, and Hawaii" loading="lazy" />
      </section>

      <section className="delivery-process delivery-section">
        <h2>A Simple Delivery Process</h2>
        <div className="delivery-process-grid">{process.map(([title, text], i) => <article key={title}><span>{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section className="delivery-quote-section">
        <div className="delivery-quote-panel">
          <div><h2>Get a Delivery Quote Today</h2><p>Contact us for a delivery quote and estimated timeframe for your location. Our team is here to help make the process easy.</p>
            <div className="delivery-actions"><a className="delivery-button delivery-button--red" href="#delivery-quote" onClick={(event) => { event.preventDefault(); openQuoteForm() }}><FaTruck />Get a Delivery Quote<FaArrowRight /></a><a className="delivery-button delivery-button--dark" href={business.phoneHref} onClick={() => trackContactCta('phone_click', 'Delivery Quote Call')}><FaPhoneAlt />Call {business.phone}</a></div>
          </div>
        </div>
      </section>

      <section className="delivery-faq-section" aria-labelledby="delivery-faq-title">
        <div className="delivery-faq">
          <h2 id="delivery-faq-title">Frequently Asked Questions</h2>
          {questions.map(([question, answer], i) => <div className="delivery-faq-item" key={question}><button type="button" aria-expanded={openQuestion === i} onClick={() => setOpenQuestion(openQuestion === i ? null : i)}><span>{question}</span><span aria-hidden="true">{openQuestion === i ? '−' : '+'}</span></button>{openQuestion === i ? <p>{answer}</p> : null}</div>)}
        </div>
      </section>

      {quoteFormOpen ? <section className="delivery-form-area" id="delivery-quote"><LeadForm title="Get a Delivery Quote" messagePlaceholder="Destination city, state, ZIP code, and vehicle of interest" /></section> : null}
    </main>
  </>
}
