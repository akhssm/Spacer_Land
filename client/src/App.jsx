import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Status from './pages/Status'

// Maps each URL to the page that should show for it.
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/status" element={<Status />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
