const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: [true, 'Please pass user name'] },
    profilePic: { type: String },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email must be valid'],
    },
    password: { type: String, require: [true, 'Please pass password'] },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
  return isCorrect;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
