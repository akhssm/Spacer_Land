import mongoose from 'mongoose'
import { PLOT_STATUSES } from './Plot.js'

const { Schema } = mongoose

// One sellable unit: a flat on one floor of one tower. A tower is a flat
// position on the master plan (a Plot such as "B-06"); the units are that
// position on floors 1 to N.
const unitSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    block: { type: String, required: true, trim: true }, // "Block B"
    tower: { type: String, required: true, trim: true }, // the Plot number, "B-06"
    floor: { type: Number, required: true, min: 1 }, // 1 = first floor above the stilt
    number: { type: String, required: true, trim: true }, // "B-606"
    status: { type: String, enum: PLOT_STATUSES, default: 'available' },
  },
  { timestamps: true },
)

unitSchema.index({ project: 1, number: 1 }, { unique: true })
unitSchema.index({ project: 1, tower: 1, floor: 1 }, { unique: true })

export default mongoose.model('Unit', unitSchema)
