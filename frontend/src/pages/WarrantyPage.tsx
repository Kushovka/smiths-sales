import { useState } from 'react'
import { FaArrowRight, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { LeadForm } from '../components/LeadForm'
import { LeadFormDialog } from '../components/LeadFormDialog'
import { Seo } from '../components/Seo'
import { business } from '../data/business'
import { trackContactCta } from '../utils/ctaTracking'

const exclusions = [
  ['Wear & Maintenance', 'Normal wear and tear, routine maintenance, scheduled service, and maintenance-related failures.'],
  ['Consumable Components', 'Tires, brake pads, bulbs, filters, fluids, batteries, drive belts, and other wear or regularly replaced items.'],
  ['Cosmetic & Accessories', 'Cosmetic concerns, finish or appearance issues, and electrical accessories.'],
  ['Misuse or Modifications', 'Damage caused by misuse, negligence, improper operation, lack of maintenance, abuse, or unauthorized modifications.'],
]

export const WarrantyPage = () => {
  const [inquiryOpen, setInquiryOpen] = useState(false)

  return <>
    <Seo title="Warranty information" description={`Every vehicle sold by ${business.name} includes the same 90-day / 3,000-mile limited warranty. Review coverage and exclusions.`} />
    <main className="warranty-page">
      <section className="warranty-container warranty-hero" aria-labelledby="warranty-title">
        <div className="warranty-hero-copy">
          <h1 id="warranty-title">90-Day / 3,000-Mile<br />Limited Warranty</h1>
          <p className="warranty-hero-lead">Every vehicle we sell includes the same limited warranty for covered major mechanical components. Coverage begins at delivery and ends after 90 calendar days or 3,000 additional miles, whichever comes first.</p>
          <div className="warranty-hero-actions">
            <a className="warranty-call-button" href={business.phoneHref} onClick={() => trackContactCta('phone_click', 'Warranty Page Call')}><FaPhoneAlt aria-hidden="true" />Call {business.phone}</a>
            <button type="button" className="warranty-ask-button" onClick={() => { trackContactCta('contact_form_click', 'Warranty Ask About Coverage'); setInquiryOpen(true) }}><FaEnvelope aria-hidden="true" />Ask About Coverage <FaArrowRight aria-hidden="true" /></button>
          </div>
        </div>
      </section>

      <section className="warranty-container warranty-guidance" aria-label="Limited warranty coverage">
        <article className="warranty-how">
          <h2>Limited Mechanical Protection</h2>
          <p>The limited warranty applies to substantial mechanical failure of covered major engine or drivetrain components that was not disclosed before the sale. It is included with every vehicle we sell.</p>
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
          <p>Our 90-day / 3,000-mile limited warranty is included with every vehicle. Any remaining manufacturer warranty is separate and follows the manufacturer’s written terms.</p>
          <ul>
            <li><strong>Manufacturer coverage:</strong> Any remaining factory warranty is separate from our included limited warranty and is governed by the manufacturer’s written terms.</li>
            <li><strong>Covered components:</strong> Engine, transmission, drivetrain, electrical systems, and other components may be included under the applicable manufacturer warranty.</li>
            <li><strong>Authorized repairs:</strong> Covered repairs generally must follow the manufacturer’s procedures and authorized-service requirements.</li>
          </ul>
        </article>
        <article className="warranty-info-panel">
          <h2>Extended Warranty Options</h2>
          <p>Optional extended protection plans or service contracts are separate from the limited warranty included with every vehicle and may be purchased at an additional cost.</p>
          <ul>
            <li>Each optional plan has its own written coverage, term, exclusions, and limits.</li>
            <li>Ask our team for details about optional plans and their cost.</li>
          </ul>
        </article>
      </section>

      <section className="warranty-container warranty-preowned" aria-labelledby="warranty-vehicle-title">
        <div>
          <h2 id="warranty-vehicle-title">One Limited Warranty for Every Vehicle</h2>
        </div>
        <div className="warranty-preowned-copy">
          <p>Every vehicle sold by Smith’s Sales &amp; Services comes with the same 90-day / 3,000-mile limited warranty, starting at delivery. The warranty’s covered components and standard exclusions are explained above and in the written warranty provided at purchase.</p>
          <p>Any remaining factory warranty or optional extended service contract is separate and follows its own written terms. It does not change the limited warranty included with every vehicle.</p>
        </div>
      </section>

      <section className="warranty-contact" id="warranty-form" aria-label="Request warranty information">
        <img className="warranty-contact-image" src="/images/warranty-truck.webp" alt="Truck in the Smith's Sales & Services lot" />
        <div className="warranty-contact-content">
          <div className="warranty-contact-intro">
            <h2>Tell us about the vehicle you’re interested in.</h2>
            <p>Every vehicle includes our 90-day / 3,000-mile limited warranty. Contact us with questions about its terms or optional extended coverage.</p>
          </div>
          <LeadForm
            title="Send Warranty Request"
            variant="default"
            className="warranty-lead-form"
            markRequiredNameFields
            singleNameField
            showVehicleInterest
            phonePlaceholder="Phone*"
            messagePlaceholder="Message (optional)"
            actionAside={<a className="warranty-request-phone" href={business.phoneHref} onClick={() => trackContactCta('phone_click', 'Warranty Form Phone')}>
              <FaPhoneAlt aria-hidden="true" />
              <span><small>Prefer to talk?</small><strong>{business.phone}</strong><small>Call or Text</small></span>
            </a>}
          />
        </div>
      </section>
    </main>
    <LeadFormDialog open={inquiryOpen} onClose={() => setInquiryOpen(false)} dialogTitle="Ask About Coverage" formProps={{
      title: 'Send Warranty Request',
      variant: 'default',
      className: 'warranty-lead-form',
      markRequiredNameFields: true,
      singleNameField: true,
      showVehicleInterest: true,
      phonePlaceholder: 'Phone*',
      messagePlaceholder: 'Message (optional)',
      actionAside: <a className="warranty-request-phone" href={business.phoneHref} onClick={() => trackContactCta('phone_click', 'Warranty Dialog Phone')}>
        <FaPhoneAlt aria-hidden="true" />
        <span><small>Prefer to talk?</small><strong>{business.phone}</strong><small>Call or Text</small></span>
      </a>,
    }} />
  </>
}
