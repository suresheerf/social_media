import { Types } from 'mongoose';
import Comment from '../models/comment.model';
import Post from '../models/post.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

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
