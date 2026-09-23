import { Router } from 'express'
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updatePlot,
  updateProject,
} from '../controllers/projects.js'

const router = Router()

// Reading is public: the viewer link needs it.
// Writing has no login yet; that arrives with the admin panel (Milestone 5).
router.get('/', listProjects)
router.post('/', createProject)
router.get('/:shortCode', getProject)
router.put('/:shortCode', updateProject)
router.delete('/:shortCode', deleteProject)
router.patch('/:shortCode/plots/:number', updatePlot)

export default router
