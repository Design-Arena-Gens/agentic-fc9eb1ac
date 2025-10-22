export function ensureAuthenticated (req, res, next) {
  if (req.session && req.session.user) {
    return next()
  }
  return res.status(401).json({ message: 'Unauthorized' })
}

export function attachSessionUser (req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user
  }
  next()
}
