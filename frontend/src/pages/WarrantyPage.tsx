import { FaArrowRight, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { LeadForm } from '../components/LeadForm'
import { Seo } from '../components/Seo'
import { business } from '../data/business'

const exclusions = [
  ['Wear & Maintenance', 'Normal wear and tear, routine maintenance, scheduled service, and maintenance-related failures.'],
  ['Consumable Components', 'Tires, brake pads, bulbs, filters, fluids, batteries, drive belts, and other wear or regularly replaced items.'],
  ['Cosmetic & Accessories', 'Cosmetic concerns, finish or appearance issues, and electrical accessories.'],
  ['Misuse or Modifications', 'Damage caused by misuse, negligence, improper operation, lack of maintenance, abuse, or unauthorized modifications.'],
]

export const WarrantyPage = () => (
  <>
    <Seo title="Warranty information" description={`Review limited warranty information and contact ${business.name} for coverage details on a specific vehicle.`} />
    <main className="warranty-page">
      <section className="warranty-container warranty-hero" aria-labelledby="warranty-title">
        <div className="warranty-hero-copy">
          <h1 id="warranty-title">90-Day / 3,000-Mile<br />Limited Warranty</h1>
          <p className="warranty-hero-lead">In addition to our return policy, qualifying vehicles include a limited warranty for major mechanical components. Coverage begins at delivery and ends after 90 calendar days or 3,000 additional miles, whichever comes first.</p>
          <div className="warranty-hero-actions">
            <a className="warranty-call-button" href={business.phoneHref}><FaPhoneAlt aria-hidden="true" />Call {business.phone}</a>
            <a className="warranty-ask-button" href="#warranty-form"><FaEnvelope aria-hidden="true" />Ask About Coverage <FaArrowRight aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="warranty-container warranty-guidance" aria-label="Limited warranty coverage">
        <article className="warranty-how">
          <h2>Limited Mechanical Protection</h2>
          <p>The limited warranty applies to substantial mechanical failure of qualifying major engine or drivetrain components that was not disclosed before the sale.</p>
        </article>
        <article className="warranty-questions">
          <h2>90 Days or 3,000 Miles</h2>
          <p>The coverage period starts on the delivery date and ends at the first of these limits: 90 calendar days or 3,000 additional miles.</p>
        </article>
        <article className="warranty-team">
          <h2>Seller’s Remedy</h2>
          <p>At the seller’s discretion, the remedy may be repair, replacement of covered components, or reimbursement of reasonable approved repair costs.</p>
        </article>
      </section>

      <section className="warranty-container warranty-info-section" aria-labelledby="warranty-exclusions-title">
        <div className="warranty-section-heading">
          <h2 id="warranty-exclusions-title">Important Limitations &amp; Exclusions</h2>
          <p>The limited warranty is non-transferable and does not extend beyond its stated time or mileage limits. The vehicle is otherwise sold subject to the written purchase documents.</p>
        </div>
        <div className="warranty-exclusion-grid">
          {exclusions.map(([title, description]) => <article className="warranty-info-card" key={title}><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="warranty-container warranty-info-columns" aria-label="Factory coverage and additional protection">
        <article className="warranty-info-panel">
          <h2>Factory Warranty Coverage</h2>
          <p>Some vehicles may still have remaining manufacturer warranty coverage. Eligibility depends on model year, original in-service date, mileage, and the manufacturer’s terms.</p>
          <ul>
            <li><strong>Coverage varies:</strong> Remaining factory coverage depends on the manufacturer, model, in-service date, mileage, and applicable warranty terms.</li>
            <li><strong>Covered components:</strong> Engine, transmission, drivetrain, electrical systems, and other components may be included under the applicable manufacturer warranty.</li>
            <li><strong>Authorized repairs:</strong> Covered repairs generally must follow the manufacturer’s procedures and authorized-service requirements.</li>
          </ul>
        </article>
        <article className="warranty-info-panel">
          <h2>Extended Warranty Options</h2>
          <p>Additional protection plans or service contracts may be available for qualifying vehicles at an additional cost.</p>
          <ul>
            <li>Depending on the vehicle and selected plan, coverage may extend beyond the included limited warranty or add mileage coverage.</li>
            <li>Options may be available for qualifying pre-owned vehicles.</li>
            <li>Price and availability depend on the vehicle’s age, mileage, condition, selected term, and coverage level. Plan terms determine covered items, exclusions, and limits.</li>
          </ul>
        </article>
      </section>

      <section className="warranty-container warranty-preowned" aria-labelledby="warranty-vehicle-title">
        <div>
          <h2 id="warranty-vehicle-title">Coverage Based on the Specific Vehicle</h2>
        </div>
        <div className="warranty-preowned-copy">
          <p>Original factory coverage may have expired because of a vehicle’s age or mileage. Available protection depends on its condition, age, mileage, service history, usage, and manufacturer-warranty status.</p>
          <p>Qualifying pre-owned vehicles include the 90-day / 3,000-mile limited warranty. Any vehicle-specific limitations, exclusions, or special conditions will be identified in the applicable purchase documents.</p>
        </div>
      </section>

      <section className="warranty-contact" id="warranty-form" aria-label="Request warranty information">
        <img className="warranty-contact-image" src="/images/warranty-truck.webp" alt="Truck in the Smith's Sales & Services lot" />
        <div className="warranty-contact-content">
          <div className="warranty-contact-intro">
            <h2>Tell us about the vehicle you’re interested in.</h2>
            <p>We’ll confirm warranty information, including any remaining factory coverage and available options.</p>
          </div>
          <LeadForm
            title="Send Warranty Request"
            variant="default"
            className="warranty-lead-form"
            markRequiredNameFields
            singleNameField
            showVehicleInterest
            phonePlaceholder="Phone*"
            messagePlaceholder={"Message (optional)\nI'm interested in warranty information for this vehicle."}
            actionAside={<a className="warranty-request-phone" href={business.phoneHref}>
              <FaPhoneAlt aria-hidden="true" />
              <span><small>Prefer to talk?</small><strong>{business.phone}</strong><small>Call or Text</small></span>
            </a>}
          />
        </div>
      </section>
    </main>
  </>
)
