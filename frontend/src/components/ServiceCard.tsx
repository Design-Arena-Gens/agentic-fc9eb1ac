import type { Service } from '../types'
import { ScrollReveal } from './ScrollReveal'

interface Props {
  service: Service
}

export function ServiceCard ({ service }: Props) {
  return (
    <ScrollReveal>
      <article className="neumorphic-surface depth-breathing" style={{ padding: '2.2rem', minHeight: '320px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div className="pill">{service.orderIndex.toString().padStart(2, '0')} · Zarvis Service</div>
        <h3 style={{ fontSize: '1.5rem' }}>{service.title}</h3>
        <p className="muted" style={{ flexGrow: 1 }}>{service.description}</p>
        {service.emphasis && <p style={{ color: 'var(--accent)', fontSize: '0.95rem', letterSpacing: '0.08em' }}>{service.emphasis}</p>}
      </article>
    </ScrollReveal>
  )
}
