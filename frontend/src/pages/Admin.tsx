import { useEffect, useMemo, useState } from 'react'
import { useContent } from '../context/ContentContext'
import type { Service } from '../types'

type BlockKeys = Array<{ key: string, label: string, type?: 'textarea' | 'text' }>

const heroKeys: BlockKeys = [
  { key: 'hero.title', label: 'Hero Title' },
  { key: 'hero.subtitle', label: 'Hero Subtitle', type: 'textarea' },
  { key: 'hero.cta', label: 'Call to Action' }
]

const narrativeKeys: BlockKeys = [
  { key: 'narrative.section1.title', label: 'Narrative Section 1 Title' },
  { key: 'narrative.section1.body', label: 'Narrative Section 1 Body', type: 'textarea' },
  { key: 'narrative.section2.title', label: 'Narrative Section 2 Title' },
  { key: 'narrative.section2.body', label: 'Narrative Section 2 Body', type: 'textarea' },
  { key: 'narrative.section3.title', label: 'Narrative Section 3 Title' },
  { key: 'narrative.section3.body', label: 'Narrative Section 3 Body', type: 'textarea' },
  { key: 'experience.callout', label: 'Experience Callout', type: 'textarea' }
]

const approachKeys: BlockKeys = [
  { key: 'approach.title', label: 'Approach Title' },
  { key: 'approach.pillar1.title', label: 'Pillar 1 Title' },
  { key: 'approach.pillar1.body', label: 'Pillar 1 Body', type: 'textarea' },
  { key: 'approach.pillar2.title', label: 'Pillar 2 Title' },
  { key: 'approach.pillar2.body', label: 'Pillar 2 Body', type: 'textarea' },
  { key: 'approach.pillar3.title', label: 'Pillar 3 Title' },
  { key: 'approach.pillar3.body', label: 'Pillar 3 Body', type: 'textarea' }
]

const contactKeys: BlockKeys = [
  { key: 'contact.title', label: 'Contact Title' },
  { key: 'contact.subtitle', label: 'Contact Subtitle', type: 'textarea' },
  { key: 'contact.form.header', label: 'Contact Form Header' }
]

const settingsKeys = [
  { key: 'contact.email', label: 'Contact Email' },
  { key: 'contact.phone', label: 'Contact Phone' },
  { key: 'contact.address', label: 'Contact Address', type: 'textarea' },
  { key: 'contact.schedule', label: 'Engagement Window' }
]

function useBlockForm (keys: BlockKeys, source?: Record<string, { value: string }>) {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const initial = keys.reduce<Record<string, string>>((acc, item) => {
      acc[item.key] = source?.[item.key]?.value ?? ''
      return acc
    }, {})
    setValues(initial)
  }, [keys, source])

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  return { values, handleChange }
}

function AdminPage () {
  const { content, updateBlocks, updateSettings, createService, updateService, deleteService } = useContent()
  const [message, setMessage] = useState<string | null>(null)
  const { values: heroValues, handleChange: handleHeroChange } = useBlockForm(heroKeys, content?.blocks)
  const { values: narrativeValues, handleChange: handleNarrativeChange } = useBlockForm(narrativeKeys, content?.blocks)
  const { values: approachValues, handleChange: handleApproachChange } = useBlockForm(approachKeys, content?.blocks)
  const { values: contactValues, handleChange: handleContactChange } = useBlockForm(contactKeys, content?.blocks)

  const [settingsValues, setSettingsValues] = useState<Record<string, string>>({})
  const [serviceDraft, setServiceDraft] = useState<Omit<Service, 'id'>>({ title: '', description: '', emphasis: '', orderIndex: 1 })
  const [serviceFeedback, setServiceFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!content?.settings) return
    const next = settingsKeys.reduce<Record<string, string>>((acc, item) => {
      acc[item.key] = content.settings[item.key] ?? ''
      return acc
    }, {})
    setSettingsValues(next)
  }, [content?.settings])

  const blockSections = useMemo(() => ([
    { title: 'Hero Narrative', keys: heroKeys, values: heroValues, onChange: handleHeroChange },
    { title: 'Experience Narrative', keys: narrativeKeys, values: narrativeValues, onChange: handleNarrativeChange },
    { title: 'Command Philosophy', keys: approachKeys, values: approachValues, onChange: handleApproachChange },
    { title: 'Contact Narratives', keys: contactKeys, values: contactValues, onChange: handleContactChange }
  ]), [heroValues, narrativeValues, approachValues, contactValues])

  const handleBlockSave = async (values: Record<string, string>) => {
    await updateBlocks(values)
    setMessage('Narratives updated with precision.')
    setTimeout(() => setMessage(null), 4000)
  }

  const handleSettingsChange = (key: string, value: string) => {
    setSettingsValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSettingsSave = async () => {
    await updateSettings(settingsValues)
    setMessage('Command coordinates recalibrated.')
    setTimeout(() => setMessage(null), 4000)
  }

  const handleServiceDraftChange = (field: keyof Omit<Service, 'id'>, value: string) => {
    setServiceDraft(prev => ({
      ...prev,
      [field]: field === 'orderIndex' ? Number(value) : value
    }))
  }

  const handleCreateService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!serviceDraft.title || !serviceDraft.description) {
      setServiceFeedback('Title and description are required.')
      return
    }
    await createService(serviceDraft)
    setServiceDraft({ title: '', description: '', emphasis: '', orderIndex: serviceDraft.orderIndex + 1 })
    setServiceFeedback('Service added to orchestration suite.')
    setTimeout(() => setServiceFeedback(null), 3000)
  }

  const services = content?.services ?? []

  return (
    <main className="page-shell" style={{ display: 'grid', gap: '3rem' }}>
      <div className="neumorphic-surface" style={{ padding: '2.5rem', display: 'grid', gap: '1rem' }}>
        <span className="pill">Zarvis Command Console</span>
        <h1>{content?.blocks['admin.welcome']?.value ?? 'Welcome to the Zarvis Command Console'}</h1>
        <p className="muted">{content?.blocks['admin.subtitle']?.value ?? 'Adjust narratives, services, and contact coordinates with precision.'}</p>
        {message && <div className="badge">{message}</div>}
      </div>

      {blockSections.map(section => (
        <section key={section.title} className="neumorphic-surface" style={{ padding: '2.5rem', display: 'grid', gap: '1.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>{section.title}</h2>
            <p className="muted">Craft the precise tone and detail of the public narrative.</p>
          </div>
          <form className="form-grid" onSubmit={async event => {
            event.preventDefault()
            await handleBlockSave(section.values)
          }}>
            {section.keys.map(item => (
              <label key={item.key}>
                {item.label}
                {item.type === 'textarea'
                  ? (
                    <textarea
                      className="text-area"
                      value={section.values[item.key] ?? ''}
                      onChange={event => section.onChange(item.key, event.target.value)}
                    />
                    )
                  : (
                    <input
                      className="text-input"
                      value={section.values[item.key] ?? ''}
                      onChange={event => section.onChange(item.key, event.target.value)}
                    />
                    )}
              </label>
            ))}
            <button className="neumorphic-button" type="submit">Commit Narrative Update</button>
          </form>
        </section>
      ))}

      <section className="neumorphic-surface" style={{ padding: '2.5rem', display: 'grid', gap: '1.5rem' }}>
        <div>
          <h2>Command Coordinates</h2>
          <p className="muted">Update operational contact channels and briefing address.</p>
        </div>
        <form className="form-grid" onSubmit={event => { event.preventDefault(); void handleSettingsSave() }}>
          {settingsKeys.map(item => (
            <label key={item.key}>
              {item.label}
              {item.type === 'textarea'
                ? (
                  <textarea className="text-area" value={settingsValues[item.key] ?? ''} onChange={event => handleSettingsChange(item.key, event.target.value)} />
                  )
                : (
                  <input className="text-input" value={settingsValues[item.key] ?? ''} onChange={event => handleSettingsChange(item.key, event.target.value)} />
                  )}
            </label>
          ))}
          <button className="neumorphic-button" type="submit">Update Coordinates</button>
        </form>
      </section>

      <section className="neumorphic-surface" style={{ padding: '2.5rem', display: 'grid', gap: '1.5rem' }}>
        <div>
          <h2>Service Orchestration</h2>
          <p className="muted">Arrange the suite of Zarvis services and update their choreography.</p>
        </div>
        <div className="glass-overlay" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Description</th>
                <th>Emphasis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <ServiceRow key={service.id} service={service} onUpdate={updateService} onDelete={deleteService} />
              ))}
            </tbody>
          </table>
        </div>

        <form className="form-grid" onSubmit={handleCreateService} style={{ marginTop: '1rem' }}>
          <h3>Add Service</h3>
          <label>
            Title
            <input className="text-input" value={serviceDraft.title} onChange={event => handleServiceDraftChange('title', event.target.value)} />
          </label>
          <label>
            Description
            <textarea className="text-area" value={serviceDraft.description} onChange={event => handleServiceDraftChange('description', event.target.value)} />
          </label>
          <label>
            Emphasis
            <textarea className="text-area" value={serviceDraft.emphasis} onChange={event => handleServiceDraftChange('emphasis', event.target.value)} />
          </label>
          <label>
            Order Index
            <input className="text-input" type="number" value={serviceDraft.orderIndex} onChange={event => handleServiceDraftChange('orderIndex', event.target.value)} />
          </label>
          <button className="neumorphic-button" type="submit">Add Service</button>
          {serviceFeedback && <span className="muted" style={{ color: 'var(--accent)' }}>{serviceFeedback}</span>}
        </form>
      </section>
    </main>
  )
}

interface ServiceRowProps {
  service: Service
  onUpdate: (id: number, payload: Partial<Service>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

function ServiceRow ({ service, onUpdate, onDelete }: ServiceRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Service>(service)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    setDraft(service)
  }, [service])

  const handleChange = (field: keyof Service, value: string) => {
    setDraft(prev => ({
      ...prev,
      [field]: field === 'orderIndex' ? Number(value) : value
    }))
  }

  const handleSave = async () => {
    await onUpdate(service.id, draft)
    setEditing(false)
    setStatus('Updated')
    setTimeout(() => setStatus(null), 2000)
  }

  const handleDelete = async () => {
    await onDelete(service.id)
  }

  return (
    <tr>
      <td>
        {editing
          ? <input className="text-input" type="number" style={{ maxWidth: '70px' }} value={draft.orderIndex} onChange={event => handleChange('orderIndex', event.target.value)} />
          : service.orderIndex}
      </td>
      <td>
        {editing
          ? <input className="text-input" value={draft.title} onChange={event => handleChange('title', event.target.value)} />
          : service.title}
      </td>
      <td>
        {editing
          ? <textarea className="text-area" value={draft.description} onChange={event => handleChange('description', event.target.value)} />
          : service.description}
      </td>
      <td>
        {editing
          ? <textarea className="text-area" value={draft.emphasis} onChange={event => handleChange('emphasis', event.target.value)} />
          : service.emphasis}
      </td>
      <td style={{ display: 'flex', gap: '0.5rem' }}>
        {editing ? (
          <>
            <button className="neumorphic-button" type="button" onClick={handleSave}>Save</button>
            <button className="neumorphic-button" type="button" onClick={() => { setEditing(false); setDraft(service) }}>Cancel</button>
          </>
        ) : (
          <>
            <button className="neumorphic-button" type="button" onClick={() => setEditing(true)}>Edit</button>
            <button className="neumorphic-button" type="button" onClick={handleDelete}>Delete</button>
          </>
        )}
        {status && <span className="badge">{status}</span>}
      </td>
    </tr>
  )
}

export default AdminPage
