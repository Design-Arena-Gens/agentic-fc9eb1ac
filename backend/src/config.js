import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const dataDir = process.env.DATA_DIR || path.resolve(__dirname, '../data')

export const config = {
  port: process.env.PORT || 4000,
  sessionSecret: process.env.SESSION_SECRET || 'zarvis-ultra-secure-secret',
  dataDir,
  databaseFile: path.join(dataDir, process.env.DATABASE_FILE || 'zarvis.sqlite'),
  sessionDatabase: path.join(dataDir, process.env.SESSION_DB || 'sessions.sqlite'),
  nodeEnv: process.env.NODE_ENV || 'development'
}
