import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setError('Could not reach the API'))
  }, [])

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Plot Viewer</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {health ? (
        <p>
          API: {health.status} · Database: {health.database}
        </p>
      ) : (
        !error && <p>Checking API…</p>
      )}
    </main>
  )
}

export default App
