const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { JWT_EXPIRES_IN, JWT_SECRET } = require('../config/config');
const User = require('./../models/user.model');

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};
const createSendToken = (user, statusCode, req, res) => {
  console.log('sending token');
  const token = signToken(user._id);
  res.status(statusCode).json({
    token
  });
};
module.exports.signin = catchAsync(async (req, res, next) => {
  console.log('body:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Could not find the user with given email', 404));
  }
  const pass = await bcrypt.hash(password, 12);
  console.log('pass:', pass);
  const isCorrect = await bcrypt.compare(password, user.password);

  console.log('isCorrect:', isCorrect);
  if (isCorrect) {
    createSendToken(user, 200, req, res);
  } else {
    next(new AppError('Please enter correct password', 400));
  }
});
