const Property = require('../models/Property');

// @desc Get all properties (with optional filters) - public
// @route GET /api/properties
const getProperties = async (req, res, next) => {
  try {
    const { location, listingType, propertyType, minPrice, maxPrice } = req.query;
    const filter = {};
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (listingType) filter.listingType = listingType;
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter).populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    next(err);
  }
};

// @desc Get single property - public
// @route GET /api/properties/:id
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    next(err);
  }
};

// @desc Create property - protected
// @route POST /api/properties
const createProperty = async (req, res, next) => {
  try {
    const property = await Property.create({ ...req.body, owner: req.user._id });
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
};

// @desc Update property - protected, owner only
// @route PUT /api/properties/:id
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }
    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (err) {
    next(err);
  }
};

// @desc Delete property - protected, owner only
// @route DELETE /api/properties/:id
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
