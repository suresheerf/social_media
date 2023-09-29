import User from '../models/user.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const getUser = catchAsync(async (req, res, next) => {
  const user = {
    name: req.user.name,
    followers: req.user.followers.length,
    following: req.user.following.length,
  };
  res.status(200).json(user);
});

export const followUser = catchAsync(async (req, res, next) => {
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

export const unfollowUser = catchAsync(async (req, res, next) => {
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
