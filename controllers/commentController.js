const mongoose = require('mongoose');
const Comment = require('../models/comment.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.createComment = catchAsync(async (req, res, next) => {
  const commentObj = {
    postId: new mongoose.Types.ObjectId(req.params.postId),
    userId: req.user._id,
    content: req.body.comment
  };

  const comment = await Comment.create(commentObj);
  if (!comment) return next(new AppError('Something went wrong', 409));
  res.status(201).json({
    status: 'success',
    message: 'Comment created successfully',
    comment
  });
});
