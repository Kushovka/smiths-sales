import { Seo } from '../components/Seo'
import { teamPortraits } from '../data/team'

export const TeamPage = () => (
  <main>
    <Seo title="Our Team" description="Meet the people who make Smith's Sales & Services a friendly place to find and service a vehicle." />
    <section className="bg-[var(--color-background)]">
      <div className="delivery-hero team-hero">
        <div className="delivery-hero-copy">
          <h1>Meet the Team.</h1>
          <h2 className="delivery-hero-subtitle">Behind Smith&apos;s.</h2>
          <p className="delivery-hero-description">Meet the team behind Smith&apos;s Sales &amp; Services. We can help with your vehicle, service, warranty, and delivery questions.</p>
        </div>
      </div>
      <div className="team-gallery mt-8 px-5 py-8 sm:py-12 lg:mt-10 lg:py-16">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
          {teamPortraits.map((member, index) => (
            <article key={member.src} className="group overflow-hidden rounded-[14px] bg-[var(--color-surface)] shadow-[0_10px_26px_rgba(31,40,33,0.12)]">
              <div className="team-portrait relative aspect-[4/5] overflow-hidden">
                <img src={member.src} alt={member.alt} loading={index > 3 ? 'lazy' : 'eager'} className="absolute inset-0 h-full w-full object-contain object-bottom" />
              </div>
              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <h2 className="font-['Barlow_Condensed'] text-[25px] font-bold uppercase leading-none tracking-[-0.025em] text-[var(--color-primary)] sm:text-[29px]">{member.name}</h2>
                <p className="mt-1 text-[13px] font-medium text-[var(--color-accent)] sm:text-[14px]">{member.title}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
)
