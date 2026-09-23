// Calls to the backend. In development Vite forwards /api to the Express server;
// in production VITE_API_URL points at the live API.
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const error = new Error(body.message || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  return response.json()
}

export const fetchProjects = () => request('/api/projects')
export const fetchProject = (shortCode) => request(`/api/projects/${encodeURIComponent(shortCode)}`)
