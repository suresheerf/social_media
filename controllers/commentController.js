const mongoose = require('mongoose');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.body.comment) {
    return next(new AppError('Comment can not be empty', 400));
  }
  const commentObj = {
    postId: new mongoose.Types.ObjectId(req.params.postId),
    userId: req.user._id,
    content: req.body.comment
  };

  const comment = await Comment.create(commentObj);
  if (!comment) return next(new AppError('Something went wrong', 409));
  await Post.updateOne(
    { _id: comment.postId },
    { $push: { comments: comment._id } }
  );
  res.status(201).json({
    'Comment-ID': comment._id
  });
});
