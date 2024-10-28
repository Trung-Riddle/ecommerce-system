const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roles = ['user', 'seller', 'admin'];

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: roles, default: 'user' },
    active: {
      type: Boolean,
      default: true
    },
    otp: String,
    otpExpires: Date,
    refreshToken: String
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

  