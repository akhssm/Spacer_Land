import Plot from '../models/Plot.js'
import Project from '../models/Project.js'
import Unit from '../models/Unit.js'
import { loadUnits } from './units.js'

// ---------- Converting between what the database stores and what the viewer expects ----------

// The viewer wants a plot's shape as a plain ring; the database stores a GeoJSON Polygon.
function plotToClient(plot) {
  const { geometry, project, _id, createdAt, updatedAt, ...rest } = plot.toObject({ versionKey: false })
  return { ...rest, polygon: geometry.coordinates[0] }
}

function plotFromClient(projectId, plot) {
  const { polygon, ...rest } = plot
  return { ...rest, project: projectId, geometry: { type: 'Polygon', coordinates: [polygon] } }
}

function projectToClient(project, plots) {
  const { _id, createdAt, updatedAt, location, layout, ...rest } = project.toObject({ versionKey: false })
  return {
    ...rest,
    location: location.coordinates,
    layout: {
      sample: layout.sample,
      overlay: layout.overlay?.url ? layout.overlay : undefined,
      boundary: layout.boundary,
      blocks: layout.blocks,
      cores: layout.cores,
      plots: plots.map(plotToClient),
    },
  }
}

function projectFromClient(body) {
  const { location, layout = {}, ...rest } = body
  const { plots, ...layoutFields } = layout
  return {
    ...rest,
    location: location && { type: 'Point', coordinates: location },
    layout: layoutFields,
  }
}

async function loadForClient(project) {
  const plots = await Plot.find({ project: project._id }).sort({ _id: 1 })
  return { ...projectToClient(project, plots), units: await loadUnits(project._id) }
}

// ---------- Route handlers ----------

// GET /api/projects: enough for a list of cards
export async function listProjects(req, res) {
  const projects = await Project.find().sort({ createdAt: 1 }).lean()
  const counts = await Plot.aggregate([
    { $match: { kind: 'plot' } },
    { $group: { _id: '$project', count: { $sum: 1 } } },
  ])
  const countById = new Map(counts.map((c) => [String(c._id), c.count]))

  res.json(
    projects.map((p) => ({
      shortCode: p.shortCode,
      name: p.name,
      type: p.type,
      unitLabel: p.unitLabel,
      city: p.city,
      description: p.description,
      theme: p.theme,
      unitCount: countById.get(String(p._id)) ?? 0,
    })),
  )
}

// GET /api/projects/:shortCode: the whole project, with every plot
export async function getProject(req, res) {
  const project = await Project.findOne({ shortCode: req.params.shortCode })
  if (!project) return res.status(404).json({ message: 'Project not found' })
  res.json(await loadForClient(project))
}

// POST /api/projects
export async function createProject(req, res) {
  const project = await Project.create(projectFromClient(req.body))
  const plots = req.body.layout?.plots ?? []
  if (plots.length) await Plot.insertMany(plots.map((plot) => plotFromClient(project._id, plot)))
  res.status(201).json(await loadForClient(project))
}

// PUT /api/projects/:shortCode. Only the fields sent are changed.
// If the body includes layout.plots, they replace all existing plots.
export async function updateProject(req, res) {
  const project = await Project.findOne({ shortCode: req.params.shortCode })
  if (!project) return res.status(404).json({ message: 'Project not found' })

  const { location, layout, ...fields } = req.body
  project.set(fields)
  if (location) project.set('location', { type: 'Point', coordinates: location })
  if (layout) {
    const { plots, ...layoutFields } = layout
    for (const [key, value] of Object.entries(layoutFields)) project.set(`layout.${key}`, value)
  }
  await project.save()

  const plots = layout?.plots
  if (plots) {
    await Plot.deleteMany({ project: project._id })
    if (plots.length) await Plot.insertMany(plots.map((plot) => plotFromClient(project._id, plot)))
  }
  res.json(await loadForClient(project))
}

// DELETE /api/projects/:shortCode
export async function deleteProject(req, res) {
  const project = await Project.findOneAndDelete({ shortCode: req.params.shortCode })
  if (!project) return res.status(404).json({ message: 'Project not found' })
  await Plot.deleteMany({ project: project._id })
  await Unit.deleteMany({ project: project._id })
  res.status(204).end()
}

// PATCH /api/projects/:shortCode/plots/:number: change one plot, typically its status
const EDITABLE_PLOT_FIELDS = [
  'status',
  'zone',
  'areaSqFt',
  'height',
  'bhk',
  'facing',
  'rooms',
  'plan',
  'description',
  'features',
  'images',
]

export async function updatePlot(req, res) {
  const project = await Project.findOne({ shortCode: req.params.shortCode })
  if (!project) return res.status(404).json({ message: 'Project not found' })

  const plot = await Plot.findOne({ project: project._id, number: req.params.number })
  if (!plot) return res.status(404).json({ message: 'Plot not found' })

  for (const field of EDITABLE_PLOT_FIELDS) {
    if (field in req.body) plot.set(field, req.body[field])
  }
  await plot.save()
  res.json(plotToClient(plot))
}
