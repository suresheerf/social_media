import User from '../models/user.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

/**
 * @swagger
 * tags:
 *   name: user
 *   description: api for user management
 * /api/user:
 *   get:
 *     summery: get user
 *     tags: [user]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 followers:
 *                   type: number
 *                 following:
 *                   type: number
 *
 */
export const getUser = catchAsync(async (req, res, next) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    followers: req.user.followers.length,
    following: req.user.following.length,
  };
  res.status(200).json(user);
});

/**
 * @swagger
 * /api/follow/{userId}:
 *   post:
 *     summery: get user
 *     tags: [user]
 *     parameters:
 *       - in: params
 *         name: userId
 *         type: string
 *         example: 64dc65bc0b3f317aa89fc728
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Following user successfully
 *
 */

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

/**
 * @swagger
 * /api/unfollow/{userId}:
 *   post:
 *     summery: get user
 *     tags: [user]
 *     parameters:
 *       - in: params
 *         name: userId
 *         type: string
 *         example: 64dc65bc0b3f317aa89fc728
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Following user successfully
 *
 */

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
