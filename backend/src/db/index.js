import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'
import { config } from '../config.js'

sqlite3.verbose()

function ensureDataDirectory () {
  if (!fs.existsSync(config.dataDir)) {
    fs.mkdirSync(config.dataDir, { recursive: true })
  }
}

ensureDataDirectory()

const database = new sqlite3.Database(config.databaseFile)

const run = (sql, params = []) => new Promise((resolve, reject) => {
  database.run(sql, params, function (err) {
    if (err) {
      reject(err)
    } else {
      resolve(this)
    }
  })
})

const get = (sql, params = []) => new Promise((resolve, reject) => {
  database.get(sql, params, function (err, row) {
    if (err) {
      reject(err)
    } else {
      resolve(row)
    }
  })
})

const all = (sql, params = []) => new Promise((resolve, reject) => {
  database.all(sql, params, function (err, rows) {
    if (err) {
      reject(err)
    } else {
      resolve(rows)
    }
  })
})

export async function initialiseDatabase () {
  await run(`
    CREATE TABLE IF NOT EXISTS content_blocks (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      type TEXT DEFAULT 'text',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      emphasis TEXT DEFAULT '',
      order_index INTEGER DEFAULT 0
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  const count = await get('SELECT COUNT(*) as count FROM content_blocks')
  if (!count || count.count === 0) {
    await seedContent()
  }
}

async function seedContent () {
  const contentSeeds = [
    ['hero.title', 'Zarvis'],
    ['hero.subtitle', 'Ultra-Luxury International Trade Artisans'],
    ['hero.cta', 'Engage the Command Console'],
    ['narrative.section1.title', 'Precision in Every Movement'],
    ['narrative.section1.body', 'From Geneva to Singapore, our trade frameworks operate with the discretion of a Swiss private bank and the elegance of Parisian haute couture.'],
    ['narrative.section2.title', 'An Orchestra of Trusted Partners'],
    ['narrative.section2.body', 'Our network weaves together artisans, financiers, and logistics commanders to choreograph bespoke trade experiences.'],
    ['narrative.section3.title', 'Uncompromised Security'],
    ['narrative.section3.body', 'Every interaction is protected by multi-layer protocols engineered for sovereign-level confidentiality.'],
    ['experience.callout', 'We design, execute, and safeguard the critical trade missions of the world’s most discerning clientele.'],
    ['approach.title', 'Our Command Philosophy'],
    ['approach.pillar1.title', 'Strategic Reconnaissance'],
    ['approach.pillar1.body', 'We invest deeply in understanding cultural, regulatory, and logistical terrain before recommending a single move.'],
    ['approach.pillar2.title', 'Orchestrated Precision'],
    ['approach.pillar2.body', 'Every operation is choreographed with a secure command console that synchs partners, routes, and contingencies in real time.'],
    ['approach.pillar3.title', 'Enduring Stewardship'],
    ['approach.pillar3.body', 'Beyond delivery, we remain embedded. Monitoring assets, refining circuitry, and ensuring each mission continues to perform flawlessly.'],
    ['contact.title', 'Command Console Access'],
    ['contact.subtitle', 'Initiate a secure briefing to align with the Zarvis command echelon.'],
    ['contact.form.header', 'Request a confidential engagement'],
    ['footer.tagline', 'Zarvis · International Trade Orchestration'],
    ['admin.welcome', 'Welcome to the Zarvis Command Console'],
    ['admin.subtitle', 'Adjust narratives, services, and contact coordinates with precision.']
  ]

  const serviceSeeds = [
    {
      title: 'Sovereign Trade Architecture',
      description: 'Multi-jurisdictional trade structures designed to maximize discretion, compliance, and fiscal efficiency across continents.',
      emphasis: 'Engineered for governments, royal households, and category-defining conglomerates.',
      order_index: 1
    },
    {
      title: 'Bespoke Asset Logistics',
      description: 'From haute horlogerie to rare earth payloads, we choreograph end-to-end logistics with air-gapped tracking and adaptive security escorts.',
      emphasis: 'Zero compromise transit with real-time telemetry and contingency orchestration.',
      order_index: 2
    },
    {
      title: 'Strategic Procurement Intelligence',
      description: 'We embed intelligence cells within procurement channels, ensuring acquisition strategies align with cultural nuance and market cadence.',
      emphasis: 'Synthesizing human insight with advanced analytics to surface hidden opportunities.',
      order_index: 3
    }
  ]

  const settingsSeeds = [
    ['contact.email', 'command@zarvis.global'],
    ['contact.phone', '+41 22 555 0199'],
    ['contact.address', 'Rue du Rhône 25, 1204 Genève'],
    ['contact.schedule', 'By private appointment only']
  ]

  const insertContent = database.prepare('INSERT INTO content_blocks (key, value) VALUES (?, ?)')
  const insertService = database.prepare('INSERT INTO services (title, description, emphasis, order_index) VALUES (?, ?, ?, ?)')
  const insertSetting = database.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')

  database.serialize(() => {
    contentSeeds.forEach(([key, value]) => insertContent.run(key, value))
    serviceSeeds.forEach(({ title, description, emphasis, order_index: orderIndex }) => {
      insertService.run(title, description, emphasis, orderIndex)
    })
    settingsSeeds.forEach(([key, value]) => insertSetting.run(key, value))
  })

  insertContent.finalize()
  insertService.finalize()
  insertSetting.finalize()
}

export const db = {
  run,
  get,
  all
}
