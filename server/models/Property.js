const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    listingType: { type: String, enum: ['sale', 'rent'], default: 'sale' },
    propertyType: { type: String, enum: ['house', 'apartment', 'plot', 'commercial'], default: 'house' },
    location: { type: String, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaSqft: { type: Number, default: 0 },
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
