import { Types } from 'mongoose';
import Comment from '../models/comment.model';
import Post from '../models/post.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

/**
 * @swagger
 * tags:
 *   name: comment
 *   description: api for comment management
 * /api/comment/{postId}:
 *   post:
 *     summery: signin api
 *     tags: [comment]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: awesome post
 *     responses:
 *       201:
 *         description: successful comment creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Comment-ID:
 *                   type: string
 *
 */

const createComment = catchAsync(async (req, res, next) => {
  if (!req.body.comment) {
    return next(new AppError('Comment can not be empty', 400));
  }
  const commentObj = {
    postId: new Types.ObjectId(req.params.postId),
    userId: req.user._id,
    content: req.body.comment,
  };

  const comment = await Comment.create(commentObj);
  if (!comment) return next(new AppError('Something went wrong', 409));
  await Post.updateOne({ _id: comment.postId }, { $push: { comments: comment._id } });
  res.status(201).json({
    'Comment-ID': comment._id,
  });
});

export default createComment;
