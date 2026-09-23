import mongoose from 'mongoose'

const { Schema } = mongoose

export const PLOT_STATUSES = ['available', 'sold', 'hold', 'reserved']

// One shape on the map: a plot, a flat, or an amenity such as a play area.
const plotSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    number: { type: String, required: true, trim: true }, // "12", "B-06", "Club House"
    kind: { type: String, enum: ['plot', 'amenity'], default: 'plot' },
    zone: { type: String, trim: true },
    status: { type: String, enum: PLOT_STATUSES, default: 'available' },
    areaSqFt: Number, // the saleable area printed on the plan
    height: Number, // metres in 3D; falls back to the project's unitHeight
    bhk: String, // "2 BHK"
    facing: String, // "East"
    rooms: [{ _id: false, name: String, size: String }],
    plan: String, // floor-plan image URL
    // GeoJSON Polygon: an array of rings, each a closed list of [longitude, latitude]
    geometry: {
      type: { type: String, enum: ['Polygon'], default: 'Polygon' },
      coordinates: { type: [[[Number]]], required: true },
    },
  },
  { timestamps: true },
)

plotSchema.index({ project: 1, number: 1 }, { unique: true })
plotSchema.index({ geometry: '2dsphere' })

export default mongoose.model('Plot', plotSchema)
