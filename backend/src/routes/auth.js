import express from 'express'
import { ensureAuthenticated } from '../middleware/auth.js'
import { config } from '../config.js'

const router = express.Router()

const VALID_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const VALID_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    req.session.user = { username }
    return res.json({ message: 'Authenticated', user: { username } })
  }

  return res.status(401).json({ message: 'Invalid credentials' })
})

router.post('/logout', ensureAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' })
    }
    res.clearCookie('zarvis.sid', {
      httpOnly: true,
      sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
      secure: config.nodeEnv === 'production'
    })
    return res.json({ message: 'Logged out' })
  })
})

router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ authenticated: true, user: req.session.user })
  }
  return res.json({ authenticated: false })
})

export default router
