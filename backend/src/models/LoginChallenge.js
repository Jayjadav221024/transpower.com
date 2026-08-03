/* ==========================================================================
   A half-finished login: the password was correct, the emailed code has not
   been entered yet.

   No session exists while a challenge is open, so this row is the only thing
   standing between a correct password and the admin panel. The code itself is
   stored as a bcrypt hash — a six-digit number sitting in plaintext in the
   database would make the whole second factor pointless if the database ever
   leaked.
   ========================================================================== */
const mongoose = require('mongoose');

const CODE_TTL_MS   = 10 * 60 * 1000;
const MAX_ATTEMPTS  = 5;

const loginChallengeSchema = new mongoose.Schema(
  {
    /* Opaque handle held by the browser mid-login. `unique` builds the index. */
    challengeId: { type: String, required: true, unique: true },

    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },

    codeHash: { type: String, required: true },

    /* 'login'    — ordinary sign-in.
       'approval' — another admin approved this person's access request; they
                    still owe a code before any session is issued. */
    purpose: { type: String, enum: ['login', 'approval'], default: 'login' },

    attempts:  { type: Number, default: 0 },
    consumed:  { type: Boolean, default: false },

    /* Where the code was actually sent, masked, so the UI can say so without
       the server having to re-derive it. */
    sentToMasked: { type: String, default: '' },

    userAgent: { type: String, default: '' },
    ip:        { type: String, default: '' },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

/* Housekeeping only. Mongo's TTL monitor runs about once a minute, so the
   code must still compare expiresAt itself rather than trusting the sweep. */
loginChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

loginChallengeSchema.statics.CODE_TTL_MS  = CODE_TTL_MS;
loginChallengeSchema.statics.MAX_ATTEMPTS = MAX_ATTEMPTS;

/** True while the code can still be entered. */
loginChallengeSchema.methods.isOpen = function isOpen() {
  return !this.consumed
    && this.attempts < MAX_ATTEMPTS
    && this.expiresAt.getTime() > Date.now();
};

module.exports = mongoose.model('LoginChallenge', loginChallengeSchema);
module.exports.CODE_TTL_MS  = CODE_TTL_MS;
module.exports.MAX_ATTEMPTS = MAX_ATTEMPTS;
