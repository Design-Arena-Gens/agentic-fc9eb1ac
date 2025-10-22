import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import HomePage from './pages/Home'
import AdminPage from './pages/Admin'
import { useAmbientLight } from './hooks/useAmbientLight'

function ProtectedRoute ({ children }: { children: JSX.Element }) {
  const { authenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="page-shell" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div className="neumorphic-surface" style={{ padding: '2rem 3rem', textAlign: 'center' }}>
          <span className="pill">Initializing</span>
          <h2 style={{ marginTop: '1rem' }}>Calibrating Secure Console</h2>
          <p className="muted">Authenticating your command clearance…</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return children
}

function Shell () {
  useAmbientLight()

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App () {
  return (
    <AuthProvider>
      <ContentProvider>
        <Shell />
      </ContentProvider>
    </AuthProvider>
  )
}
