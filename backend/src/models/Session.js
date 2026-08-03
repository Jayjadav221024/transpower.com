/* ==========================================================================
   One row per signed-in admin.

   The JWT alone cannot enforce "one admin at a time" — it is stateless, so a
   token stays valid until it expires and there is no way to revoke it. Each
   token therefore carries a `jti` matching a row here, and every admin request
   checks that row still exists. Deleting it signs that admin out immediately.

   A session is considered ACTIVE while `lastSeenAt` is within IDLE_TIMEOUT_MS.
   That is the escape hatch: an admin who closes the browser without logging
   out stops holding the lock 15 minutes later, so nobody is locked out for
   good.
   ========================================================================== */
const mongoose = require('mongoose');

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

const sessionSchema = new mongoose.Schema(
  {
    /* The JWT's jti claim. `unique` already builds the index. */
    jti:  { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    /* Denormalised so the "who is signed in" message never needs a join. */
    username: { type: String, required: true },
    name:     { type: String, default: '' },

    /* Refreshed by the heartbeat on every authenticated request. Indexed by
       the TTL declaration below, so no `index: true` here. */
    lastSeenAt: { type: Date, default: Date.now },

    /* false for the admin who took the lock first, true for anyone let in by
       an approved access request. Only used for display. */
    grantedByApproval: { type: Boolean, default: false },

    userAgent: { type: String, default: '' },
    ip:        { type: String, default: '' },
  },
  { timestamps: true }
);

/* Mongo drops the row 7 days after last activity, matching the token TTL, so
   abandoned sessions cannot accumulate forever. */
sessionSchema.index({ lastSeenAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

sessionSchema.statics.IDLE_TIMEOUT_MS = IDLE_TIMEOUT_MS;

/** Sessions still holding the lock — anything idle longer is treated as gone. */
sessionSchema.statics.findActive = function findActive() {
  return this.find({ lastSeenAt: { $gte: new Date(Date.now() - IDLE_TIMEOUT_MS) } })
    .sort({ createdAt: 1 })
    .lean();
};

module.exports = mongoose.model('Session', sessionSchema);
module.exports.IDLE_TIMEOUT_MS = IDLE_TIMEOUT_MS;
