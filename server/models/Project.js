import mongoose from 'mongoose'

const { Schema } = mongoose

// A closed ring of [longitude, latitude] pairs. `default: undefined` stops
// Mongoose from inventing an empty array when a project has none.
const ring = { type: [[Number]], default: undefined }

const projectSchema = new Schema(
  {
    shortCode: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['plots', 'apartments', 'villas'], default: 'plots' },
    unitLabel: { type: String, default: 'Plot' },
    unitHeight: { type: Number, default: 3 }, // metres, for the 3D view
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    description: { type: String, trim: true },
    // GeoJSON Point, so MongoDB can answer "projects near here" later
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    whatsapp: { type: String, default: '' },
    zones: { type: [String], default: [] },
    theme: {
      accent: { type: String, default: '#75c217' },
    },
    brochure: {
      pages: { type: [String], default: [] }, // one image URL per page
    },
    // Pictures and videos shown by the Gallery button
    gallery: [
      {
        _id: false,
        kind: { type: String, enum: ['image', 'youtube'], default: 'image' },
        url: { type: String, required: true }, // image URL, or the YouTube video id
        caption: { type: String, default: '' },
      },
    ],
    layout: {
      sample: { type: Boolean, default: false },
      // The plan drawing draped over the map: image URL plus its four corners
      overlay: {
        url: String,
        coordinates: { type: [[Number]], default: undefined },
      },
      boundary: ring,
      // A block is one building: its footprint and how many floors sit on the stilt level
      blocks: [{ _id: false, name: String, polygon: ring, floors: Number }],
      // Lift and stair cores, drawn as taller boxes in the 3D view
      cores: [{ _id: false, zone: String, kind: String, polygon: ring }],
    },
    // Optional architect's 3D model (glTF/GLB) to show instead of the generated buildings
    model: {
      url: String,
      position: { type: [Number], default: undefined }, // [longitude, latitude] of the model's origin
      rotation: { type: Number, default: 0 }, // degrees clockwise from north
      scale: { type: Number, default: 1 },
    },
  },
  { timestamps: true },
)

projectSchema.index({ location: '2dsphere' })

export default mongoose.model('Project', projectSchema)
