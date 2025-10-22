import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Props {
  open: boolean
  onClose: () => void
  onAuthenticated?: () => void
}

export function LoginModal ({ open, onClose, onAuthenticated }: Props) {
  const { login, loading } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await login(username, password)
      setError(null)
      onClose()
      if (onAuthenticated) {
        onAuthenticated()
      }
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28, 31, 43, 0.45)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}
    >
      <div className="neumorphic-surface" style={{ padding: '2.5rem', width: 'min(420px, 90%)', position: 'relative' }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close login"
          className="neumorphic-button"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '42px',
            height: '42px'
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '1rem' }}>Command Authentication</h2>
        <p className="muted" style={{ marginBottom: '2rem' }}>Authority access requires the Zarvis credentials issued to you.</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Username
            <input className="text-input" value={username} onChange={event => setUsername(event.target.value)} autoFocus />
          </label>
          <label>
            Password
            <input className="text-input" type="password" value={password} onChange={event => setPassword(event.target.value)} />
          </label>
          {error && <span className="muted" style={{ color: '#b33', fontSize: '0.9rem' }}>{error}</span>}
          <button className="neumorphic-button" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Enter Console'}
          </button>
        </form>
      </div>
    </div>
  )
}
