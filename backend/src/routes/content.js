import express from 'express'
import { db } from '../db/index.js'
import { ensureAuthenticated } from '../middleware/auth.js'

const router = express.Router()

async function fetchContentBlocks () {
  const rows = await db.all('SELECT key, value, type FROM content_blocks ORDER BY key ASC')
  return rows.reduce((acc, row) => {
    acc[row.key] = { value: row.value, type: row.type }
    return acc
  }, {})
}

async function fetchServices () {
  const rows = await db.all('SELECT id, title, description, emphasis, order_index as orderIndex FROM services ORDER BY order_index ASC, id ASC')
  return rows
}

async function fetchSettings () {
  const rows = await db.all('SELECT key, value FROM settings ORDER BY key ASC')
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})
}

router.get('/', async (req, res) => {
  try {
    const [blocks, services, settings] = await Promise.all([
      fetchContentBlocks(),
      fetchServices(),
      fetchSettings()
    ])

    res.json({
      blocks,
      services,
      settings
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve content', error: error.message })
  }
})

router.put('/blocks', ensureAuthenticated, async (req, res) => {
  const { updates } = req.body
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ message: 'Invalid payload' })
  }

  const entries = Object.entries(updates)
  try {
    await db.run('BEGIN')
    for (const [key, value] of entries) {
      await db.run(
        `INSERT INTO content_blocks (key, value, type, updated_at)
         VALUES (?, ?, 'text', CURRENT_TIMESTAMP)
         ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP`
        , [key, value]
      )
    }
    await db.run('COMMIT')
    const blocks = await fetchContentBlocks()
    res.json({ message: 'Content updated', blocks })
  } catch (error) {
    await db.run('ROLLBACK')
    res.status(500).json({ message: 'Failed to update content blocks', error: error.message })
  }
})

router.post('/services', ensureAuthenticated, async (req, res) => {
  const { title, description, emphasis, orderIndex = 0 } = req.body
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' })
  }

  try {
    const result = await db.run(
      'INSERT INTO services (title, description, emphasis, order_index) VALUES (?, ?, ?, ?)',
      [title, description, emphasis || '', orderIndex]
    )
    const service = await db.get('SELECT id, title, description, emphasis, order_index as orderIndex FROM services WHERE id = ?', [result.lastID])
    res.status(201).json({ message: 'Service created', service })
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error: error.message })
  }
})

router.put('/services/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params
  const { title, description, emphasis, orderIndex } = req.body

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' })
  }

  try {
    await db.run(
      `UPDATE services SET title = ?, description = ?, emphasis = ?, order_index = ? WHERE id = ?`,
      [title, description, emphasis || '', orderIndex ?? 0, id]
    )
    const service = await db.get('SELECT id, title, description, emphasis, order_index as orderIndex FROM services WHERE id = ?', [id])
    res.json({ message: 'Service updated', service })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service', error: error.message })
  }
})

router.delete('/services/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params
  try {
    await db.run('DELETE FROM services WHERE id = ?', [id])
    res.json({ message: 'Service removed', id: Number(id) })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service', error: error.message })
  }
})

router.put('/settings', ensureAuthenticated, async (req, res) => {
  const { updates } = req.body
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ message: 'Invalid payload' })
  }

  const entries = Object.entries(updates)
  try {
    await db.run('BEGIN')
    for (const [key, value] of entries) {
      await db.run(
        `INSERT INTO settings (key, value)
         VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [key, value]
      )
    }
    await db.run('COMMIT')
    const settings = await fetchSettings()
    res.json({ message: 'Settings updated', settings })
  } catch (error) {
    await db.run('ROLLBACK')
    res.status(500).json({ message: 'Failed to update settings', error: error.message })
  }
})

export default router
