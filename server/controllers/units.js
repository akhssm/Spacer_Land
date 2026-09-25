import Project from '../models/Project.js'
import Unit from '../models/Unit.js'

export function unitToClient({ block, tower, floor, number, status }) {
  return { block, tower, floor, number, status }
}

export async function loadUnits(projectId) {
  const units = await Unit.find({ project: projectId }).sort({ block: 1, tower: 1, floor: 1 }).lean()
  return units.map(unitToClient)
}

// GET /api/projects/:shortCode/units: every unit with its status
export async function listUnits(req, res) {
  const project = await Project.findOne({ shortCode: req.params.shortCode })
  if (!project) return res.status(404).json({ message: 'Project not found' })
  res.json(await loadUnits(project._id))
}

// GET /api/projects/:shortCode/inventory: counts per block, tower and floor
export async function inventorySummary(req, res) {
  const project = await Project.findOne({ shortCode: req.params.shortCode })
  if (!project) return res.status(404).json({ message: 'Project not found' })

  const rows = await Unit.aggregate([
    { $match: { project: project._id } },
    { $group: { _id: { block: '$block', tower: '$tower', floor: '$floor', status: '$status' }, count: { $sum: 1 } } },
  ])

  // Nest the counts: blocks -> towers -> floors, each with a status tally
  const blank = () => ({ available: 0, hold: 0, sold: 0, reserved: 0 })
  const blocks = {}
  for (const { _id: key, count } of rows) {
    const block = (blocks[key.block] ??= { total: blank(), towers: {}, floors: {} })
    const tower = (block.towers[key.tower] ??= { total: blank(), floors: {} })
    block.total[key.status] += count
    tower.total[key.status] += count
    tower.floors[key.floor] = key.status
    ;(block.floors[key.floor] ??= blank())[key.status] += count
  }
  res.json(blocks)
}

// PATCH /api/projects/:shortCode/units/:number: change one unit's status
export async function updateUnit(req, res) {
  const project = await Project.findOne({ shortCode: req.params.shortCode })
  if (!project) return res.status(404).json({ message: 'Project not found' })

  const unit = await Unit.findOne({ project: project._id, number: req.params.number })
  if (!unit) return res.status(404).json({ message: 'Unit not found' })

  if ('status' in req.body) unit.status = req.body.status
  await unit.save()
  res.json(unitToClient(unit))
}
