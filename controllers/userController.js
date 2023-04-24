const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getUser = catchAsync(async (req, res, next) => {
  const postObj = {
    name: req.user.name,
    followers: req.user.followers.length,
    following: req.following.length
  };
});

module.exports.followUser = catchAsync(async (req, res, next) => {
  const other_user = await User.findByIdAndUpdate(req.params.userId, {
    $addToSet: { followers: req.user._id }
  });
  const user = await User.findByIdAndUpdate(req.params.userId, {
    $addToSet: { following: req.params.userId }
  });
  if (!other_user || !user) {
    return next(new AppError('Somthing went wrong', 409));
  }
  res
    .status(200)
    .json({ status: 'success', message: 'Following user successfully' });
});

module.exports.unfollowUser = catchAsync(async (req, res, next) => {
  const other_user = await User.findByIdAndUpdate(req.params.userId, {
    $pull: { followers: req.user._id }
  });
  const user = await User.findByIdAndUpdate(req.params.userId, {
    $pull: { following: req.params.userId }
  });
  if (!other_user || !user) {
    return next(new AppError('Somthing went wrong', 409));
  }
  res
    .status(200)
    .json({ status: 'success', message: 'unfollowing user successfully' });
});
