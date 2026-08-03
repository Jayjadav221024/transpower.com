/* ==========================================================================
   A second admin asking the admin who currently holds the panel to let them in.

   The requester has already proved their password before a row lands here — it
   is an approval step, not an authentication step. `ticket` is the opaque
   handle the requester polls with; it is the only thing they hold until the
   request is approved, at which point it is exchanged for a real session.
   ========================================================================== */
const mongoose = require('mongoose');

const REQUEST_TTL_MS = 5 * 60 * 1000;

const accessRequestSchema = new mongoose.Schema(
  {
    /* `unique` already builds the index. */
    ticket: { type: String, required: true, unique: true },

    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    name:     { type: String, default: '' },

    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'expired', 'claimed'],
      default: 'pending',
      index: true,
    },

    /* Who answered, for the audit trail in the requester's message. */
    decidedBy:     { type: String, default: '' },
    decidedAt:     { type: Date },

    userAgent: { type: String, default: '' },
    ip:        { type: String, default: '' },

    /* Indexed by the TTL declaration below, so no `index: true` here. */
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

/* Housekeeping only — code must still check expiresAt, because Mongo's TTL
   monitor runs about once a minute and a stale row could otherwise be
   approved after it should have lapsed. */
accessRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

accessRequestSchema.statics.REQUEST_TTL_MS = REQUEST_TTL_MS;

/** Requests still awaiting an answer. */
accessRequestSchema.statics.findPending = function findPending() {
  return this.find({ status: 'pending', expiresAt: { $gt: new Date() } })
    .sort({ createdAt: 1 })
    .lean();
};

module.exports = mongoose.model('AccessRequest', accessRequestSchema);
module.exports.REQUEST_TTL_MS = REQUEST_TTL_MS;
