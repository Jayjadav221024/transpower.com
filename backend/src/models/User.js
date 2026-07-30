const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String, required: true, unique: true, trim: true,
      lowercase: true, minlength: 3, maxlength: 40,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    name:     { type: String, trim: true, default: '' },
    role:     { type: String, enum: ['admin', 'editor'], default: 'admin' },
  },
  { timestamps: true }
);

/* Hash on create and on any password change — never store plaintext. */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
