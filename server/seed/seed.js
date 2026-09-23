// Loads the projects in ./data into MongoDB. Safe to run again: each project is
// matched by shortCode and updated, and its plots are replaced.
//
//   npm run seed

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Plot from '../models/Plot.js'
import Project from '../models/Project.js'
import { PROJECTS } from './data/projects.js'

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

    console.log(`${project.name} (${project.shortCode}): ${plots.length} shapes`)
  }

  await mongoose.disconnect()
  console.log('Seed complete')
}

seed().catch((error) => {
  console.error('Seed failed:', error.message)
  process.exit(1)
})
