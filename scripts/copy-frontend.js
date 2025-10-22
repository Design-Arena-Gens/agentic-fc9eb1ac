const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const distDir = path.resolve(projectRoot, 'frontend', 'dist')
const publicDir = path.resolve(projectRoot, 'backend', 'public')

if (!fs.existsSync(distDir)) {
  console.error('Frontend dist directory not found. Run npm run build --workspace frontend first.')
  process.exit(1)
}

fs.rmSync(publicDir, { recursive: true, force: true })
fs.mkdirSync(publicDir, { recursive: true })

function copyRecursive (src, dest) {
  const stats = fs.statSync(src)
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(src).forEach(entry => {
      copyRecursive(path.join(src, entry), path.join(dest, entry))
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

copyRecursive(distDir, publicDir)

console.log('Frontend assets copied to backend public directory.')
