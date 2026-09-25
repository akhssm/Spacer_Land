// Loads the projects in ./data into MongoDB. Safe to run again: each project is
// matched by shortCode and updated, and its plots are replaced.
//
//   npm run seed

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { buildUnits } from '../lib/inventory.js'
import Plot from '../models/Plot.js'
import Project from '../models/Project.js'
import Unit from '../models/Unit.js'
import { PROJECTS } from './data/projects.js'

const SAMPLE_STATUSES = true

const STATUSES = ['available', 'hold', 'sold', 'reserved']

function hashOf(text) {
  let hash = 7
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 1000003
  return hash
}

// A fixed pseudo-random spread. Each tower leans towards one status (so the
// map shows towers of every colour), and the rest of its floors are mixed.
function sampleStatus(tower, floor) {
  const leaning = STATUSES[hashOf(tower) % STATUSES.length]
  const roll = hashOf(`${tower}/${floor}`) % 100
  if (roll < 55) return leaning
  return STATUSES[roll % STATUSES.length]
}

async function seed() {
  await connectDB()

  for (const data of PROJECTS) {
    const { location, layout, ...fields } = data
    const { plots, ...layoutFields } = layout

    const project = await Project.findOneAndUpdate(
      { shortCode: fields.shortCode },
      { ...fields, location: { type: 'Point', coordinates: location }, layout: layoutFields },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true },
    )

    await Plot.deleteMany({ project: project._id })
    await Plot.insertMany(
      plots.map(({ polygon, ...plot }) => ({
        ...plot,
        project: project._id,
        geometry: { type: 'Polygon', coordinates: [polygon] },
      })),
    )

    // One unit per flat position per floor, with sample statuses so the
    // inventory has something to show. Set SAMPLE_STATUSES to false for a
    // real launch, and every unit starts as available.
    await Unit.deleteMany({ project: project._id })
    const units = buildUnits(project._id, layoutFields.blocks ?? [], plots, SAMPLE_STATUSES ? sampleStatus : undefined)
    if (units.length) await Unit.insertMany(units)

    console.log(`${project.name} (${project.shortCode}): ${plots.length} shapes, ${units.length} units`)
  }

  await mongoose.disconnect()
  console.log('Seed complete')
}

seed().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})
