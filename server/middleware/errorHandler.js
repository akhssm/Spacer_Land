// Turns errors thrown in route handlers into JSON responses.
// Express 5 passes rejected promises here on its own.
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message })
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${error.path}` })
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with that key already exists', keys: error.keyValue })
  }

  console.error(error)
  res.status(500).json({ message: 'Something went wrong' })
}
