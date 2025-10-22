import { useContent } from '../context/ContentContext'

export function Footer () {
  const { content } = useContent()
  const tagline = content?.blocks['footer.tagline']?.value ?? 'Zarvis · International Trade Orchestration'
  const email = content?.settings['contact.email'] ?? 'command@zarvis.global'
  const phone = content?.settings['contact.phone'] ?? '+41 22 555 0199'

  return (
    <footer style={{ marginTop: '4rem', padding: '2rem 1.5rem 3rem', textAlign: 'center' }}>
      <div className="page-shell" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
        <span className="pill">Secure Channel</span>
        <h3 style={{ fontSize: '1.4rem' }}>{tagline}</h3>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <span>{email}</span>
          <span>{phone}</span>
        </div>
        <small style={{ color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} Zarvis Command Holdings. All rights reserved.
        </small>
      </div>
    </footer>
  )
}
