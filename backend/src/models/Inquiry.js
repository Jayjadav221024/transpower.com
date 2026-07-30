/* RFQ submissions from the public "Request a B2B Quote" form. */
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name:     { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    email:    { type: String, required: [true, 'Email is required'], trim: true, lowercase: true, maxlength: 160 },
    phone:    { type: String, required: [true, 'Phone is required'], trim: true, maxlength: 40 },
    product:  { type: String, default: '', maxlength: 80 },
    quantity: { type: String, default: '', maxlength: 120 },
    message:  { type: String, default: '', maxlength: 4000 },
    status:   { type: String, enum: ['new', 'read'], default: 'new', index: true },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
