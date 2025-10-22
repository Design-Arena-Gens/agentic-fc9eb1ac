import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LoginModal } from './LoginModal'

export function Navbar () {
  const { authenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)

  const handleAccess = () => {
    if (authenticated) {
      navigate('/admin')
    } else {
      setModalOpen(true)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        background: 'rgba(224, 229, 236, 0.72)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
        <div className="page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 1rem' }}>
          <Link to="/" style={{ fontFamily: 'Zarvis Display', fontSize: '1.6rem', letterSpacing: '0.16em' }}>
            ZARVIS
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <Link to="/" className={location.pathname === '/' ? 'accent' : ''}>Experience</Link>
            <a href="#services">Services</a>
            <a href="#approach">Philosophy</a>
            <a href="#contact">Contact</a>
            <button className="neumorphic-button" onClick={handleAccess} style={{ paddingInline: '1.4rem' }}>
              {authenticated ? 'Console' : 'Sign In'}
            </button>
            {authenticated && (
              <button className="neumorphic-button" onClick={handleLogout} style={{ paddingInline: '1.4rem' }}>
                Sign Out
              </button>
            )}
          </nav>
        </div>
      </header>
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} onAuthenticated={() => navigate('/admin')} />
    </>
  )
}
