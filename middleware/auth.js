const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { JWT_SECRET } = require('../config/config');

module.exports.protect = catchAsync(async (req, res, next) => {
  console.log('inside protect');
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not logged in! please login to get access', 401));
  }

  const decode = await promisify(jwt.verify)(token, JWT_SECRET);
  console.log('decode:', decode);
  const user = await User.findById(decode.id);
  console.log('after user finding');
  if (!user) return next(new AppError('user has been deleted', 400));
  console.log('user:', user);

  req.user = user;
  res.locals.user = user;
  next();
});
