const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename:     { type: String, required: true, unique: true },
    originalName: { type: String, default: '' },
    url:          { type: String, required: true },
    mime:         { type: String, default: '' },
    size:         { type: Number, default: 0 },
    alt:          { type: String, default: '', maxlength: 200 },
    uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
