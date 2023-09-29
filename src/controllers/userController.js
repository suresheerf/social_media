const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getUser = catchAsync(async (req, res, next) => {
  const user = {
    name: req.user.name,
    followers: req.user.followers.length,
    following: req.user.following.length,
  };
  res.status(200).json(user);
});

module.exports.followUser = catchAsync(async (req, res, next) => {
  const other_user = await User.findByIdAndUpdate(req.params.userId, {
    $addToSet: { followers: req.user._id },
  });
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { following: req.params.userId },
  });
  if (!other_user || !user) {
    return next(new AppError('Something went wrong', 409));
  }
  res.status(200).json({ status: 'success', message: 'Following user successfully' });
});

module.exports.unfollowUser = catchAsync(async (req, res, next) => {
  const other_user = await User.findByIdAndUpdate(req.params.userId, {
    $pull: { followers: req.user._id },
  });
  const user = await User.findByIdAndUpdate(req.user._id, {
    $pull: { following: req.params.userId },
  });
  if (!other_user || !user) {
    return next(new AppError('Something went wrong', 409));
  }
  res.status(200).json({ status: 'success', message: 'unfollowing user successfully' });
});
