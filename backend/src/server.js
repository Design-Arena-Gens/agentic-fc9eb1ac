import express from 'express'
import session from 'express-session'
import SQLiteStoreFactory from 'connect-sqlite3'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { fileURLToPath } from 'url'
import { config } from './config.js'
import { initialiseDatabase } from './db/index.js'
import authRoutes from './routes/auth.js'
import contentRoutes from './routes/content.js'
import { attachSessionUser } from './middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SQLiteStore = SQLiteStoreFactory(session)

async function bootstrap () {
  await initialiseDatabase()

  const app = express()

  app.use(helmet({
    contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false
  }))
  app.use(compression())
  app.use(express.json({ limit: '2mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (config.nodeEnv !== 'production') {
    app.use(cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true
    }))
  }

  app.use(session({
    store: new SQLiteStore({
      db: path.basename(config.sessionDatabase),
      dir: path.dirname(config.sessionDatabase)
    }),
    name: 'zarvis.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 8 // 8 hours
    }
  }))

  app.use(attachSessionUser)

  app.use('/api/auth', authRoutes)
  app.use('/api/content', contentRoutes)

  const staticDir = path.resolve(__dirname, '../public')
  app.use(express.static(staticDir))

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
  })

  app.get('*', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'))
  })

  app.listen(config.port, () => {
    console.log(`Zarvis API running on port ${config.port}`)
  })
}

bootstrap().catch(err => {
  console.error('Failed to start server', err)
  process.exit(1)
})
