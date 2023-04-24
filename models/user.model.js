const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: [true, 'Please pass user name'] },
    profilePic: { type: String },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email must be valid']
    },
    password: { type: String, require: [true, 'Please pass password'] },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
