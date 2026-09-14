const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc Create an inquiry on a property - protected
// @route POST /api/inquiries
const createInquiry = async (req, res, next) => {
  try {
    const { propertyId, message } = req.body;
    const inquiry = await Inquiry.create({ property: propertyId, sender: req.user._id, message });
    res.status(201).json(inquiry);
  } catch (err) {
    next(err);
  }
};

// @desc Get inquiries for properties owned by the logged-in user - protected
// @route GET /api/inquiries
const getMyInquiries = async (req, res, next) => {
  try {
    const myProperties = await Property.find({ owner: req.user._id }).select('_id');
    const propertyIds = myProperties.map((p) => p._id);
    const inquiries = await Inquiry.find({ property: { $in: propertyIds } })
      .populate('sender', 'name email')
      .populate('property', 'title');
    res.json(inquiries);
  } catch (err) {
    next(err);
  }
};

// @desc Delete an inquiry - protected
// @route DELETE /api/inquiries/:id
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    if (inquiry.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await inquiry.deleteOne();
    res.json({ message: 'Inquiry removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createInquiry, getMyInquiries, deleteInquiry };
