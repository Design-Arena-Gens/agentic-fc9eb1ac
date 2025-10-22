import { useMemo, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { ScrollReveal } from '../components/ScrollReveal'
import { ServiceCard } from '../components/ServiceCard'

function HeroSection () {
  const { content } = useContent()
  const title = content?.blocks['hero.title']?.value ?? 'Zarvis'
  const subtitle = content?.blocks['hero.subtitle']?.value ?? 'Ultra-Luxury International Trade Artisans'
  const cta = content?.blocks['hero.cta']?.value ?? 'Engage the Command Console'

  return (
    <section className="page-shell" style={{ display: 'grid', gap: '2.5rem', alignItems: 'center', minHeight: '75vh', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <div>
        <span className="pill">Digital Sophistication</span>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginTop: '1rem', marginBottom: '1.5rem' }}>{title}</h1>
        <p className="muted" style={{ fontSize: '1.15rem', maxWidth: '560px', marginBottom: '2.5rem' }}>{subtitle}</p>
        <a className="neumorphic-button" href="#services">{cta}</a>
      </div>
      <div className="neumorphic-surface depth-breathing" style={{ padding: '3rem', display: 'grid', gap: '1.5rem' }}>
        <div className="glass-overlay" style={{ display: 'grid', gap: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Ambient Command Console</h3>
          <p className="muted">Light-sensitive surfaces track your presence, modulating shadow and depth to mirror the tactility of an artisan-crafted interface.</p>
          <p style={{ fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>Cursor-responsive lightfield · Scroll choreography · Secure surface transitions</p>
        </div>
      </div>
    </section>
  )
}

function NarrativeSection () {
  const { content } = useContent()

  const sections = useMemo(() => [
    'section1',
    'section2',
    'section3'
  ].map(key => ({
    title: content?.blocks[`narrative.${key}.title`]?.value ?? '',
    body: content?.blocks[`narrative.${key}.body`]?.value ?? ''
  })), [content])
  const callout = content?.blocks['experience.callout']?.value ?? ''

  return (
    <section className="page-shell" id="experience" style={{ display: 'grid', gap: '3rem' }}>
      <ScrollReveal>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '640px' }}>
          <span className="pill">Impeccable Execution</span>
          <h2 className="section-heading">Precision in Motion</h2>
          <p className="muted">Our clients entrust us with missions that demand sovereign-grade confidentiality and couture-level finesse.</p>
        </div>
      </ScrollReveal>
      <div className="surface-grid">
        {sections.map((section, idx) => (
          <ScrollReveal key={idx}>
            <article className="neumorphic-surface" style={{ padding: '2.2rem', display: 'grid', gap: '1rem' }}>
              <span className="badge">{(idx + 1).toString().padStart(2, '0')} · Narrative</span>
              <h3>{section.title}</h3>
              <p className="muted">{section.body}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal>
        <div className="neumorphic-surface depth-breathing" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>{callout}</h3>
          <p className="muted">Every engagement is orchestrated via encrypted channels, multi-factor authentication, and dynamic contingency scripts.</p>
        </div>
      </ScrollReveal>
    </section>
  )
}

function ServicesSection () {
  const { content } = useContent()
  const services = content?.services ?? []

  return (
    <section className="page-shell" id="services" style={{ display: 'grid', gap: '2.5rem' }}>
      <ScrollReveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="pill">Command Services</span>
          <h2 className="section-heading">Ultra-Luxury Trade Orchestration</h2>
          <p className="muted" style={{ maxWidth: '640px' }}>We compose trade architectures, logistics envelopes, and intelligence frameworks custom-tailored for sovereign entities and luxury houses.</p>
        </div>
      </ScrollReveal>
      <div className="surface-grid">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  )
}

function ApproachSection () {
  const { content } = useContent()
  const title = content?.blocks['approach.title']?.value ?? 'Our Command Philosophy'
  const pillars = useMemo(() => [1, 2, 3].map(index => ({
    title: content?.blocks[`approach.pillar${index}.title`]?.value ?? '',
    body: content?.blocks[`approach.pillar${index}.body`]?.value ?? ''
  })), [content])

  return (
    <section className="page-shell" id="approach" style={{ display: 'grid', gap: '2.5rem' }}>
      <ScrollReveal>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '720px' }}>
          <span className="pill">Command Doctrine</span>
          <h2 className="section-heading">{title}</h2>
          <p className="muted">Each mission flows through reconnaissance, orchestration, and enduring stewardship—ensuring every asset remains protected beyond its destination.</p>
        </div>
      </ScrollReveal>
      <div className="surface-grid">
        {pillars.map((pillar, idx) => (
          <ScrollReveal key={idx}>
            <article className="neumorphic-surface" style={{ padding: '2.4rem', display: 'grid', gap: '1rem' }}>
              <span className="badge">Pillar {(idx + 1).toString().padStart(2, '0')}</span>
              <h3>{pillar.title}</h3>
              <p className="muted">{pillar.body}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

function ContactSection () {
  const { content } = useContent()
  const title = content?.blocks['contact.title']?.value ?? 'Command Console Access'
  const subtitle = content?.blocks['contact.subtitle']?.value ?? 'Initiate a secure briefing to align with the Zarvis command echelon.'
  const formHeader = content?.blocks['contact.form.header']?.value ?? 'Request a confidential engagement'
  const settings = content?.settings ?? {}
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="page-shell" id="contact" style={{ display: 'grid', gap: '2.5rem' }}>
      <ScrollReveal>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '720px' }}>
          <span className="pill">Secure Liaison</span>
          <h2 className="section-heading">{title}</h2>
          <p className="muted">{subtitle}</p>
        </div>
      </ScrollReveal>
      <div className="surface-grid" style={{ alignItems: 'stretch' }}>
        <ScrollReveal>
          <div className="neumorphic-surface" style={{ padding: '2.5rem', display: 'grid', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem' }}>{formHeader}</h3>
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Name
                <input className="text-input" required placeholder="Your codename" />
              </label>
              <label>
                Contact
                <input className="text-input" required placeholder="Secure email or number" />
              </label>
              <label>
                Mission Brief
                <textarea className="text-area" required placeholder="Outline your objective and required orchestration." />
              </label>
              <button className="neumorphic-button" type="submit">Transmit Briefing</button>
              {submitted && <span className="muted" style={{ color: 'var(--accent)' }}>Transmission queued. A Zarvis liaison will initiate contact via secure channel.</span>}
            </form>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="neumorphic-surface depth-breathing" style={{ padding: '2.5rem', display: 'grid', gap: '1.2rem' }}>
            <h3>Zarvis Command Coordinates</h3>
            <div className="stack">
              <div>
                <span className="badge">Command Email</span>
                <p style={{ marginTop: '0.4rem' }}>{settings['contact.email']}</p>
              </div>
              <div>
                <span className="badge">Direct Line</span>
                <p style={{ marginTop: '0.4rem' }}>{settings['contact.phone']}</p>
              </div>
              <div>
                <span className="badge">Vault Address</span>
                <p style={{ marginTop: '0.4rem' }}>{settings['contact.address']}</p>
              </div>
              <div>
                <span className="badge">Engagement Window</span>
                <p style={{ marginTop: '0.4rem' }}>{settings['contact.schedule']}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function HomePage () {
  return (
    <main>
      <HeroSection />
      <div className="surface-divider" />
      <NarrativeSection />
      <div className="surface-divider" />
      <ServicesSection />
      <div className="surface-divider" />
      <ApproachSection />
      <div className="surface-divider" />
      <ContactSection />
    </main>
  )
}

export default HomePage
