const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.createPost = catchAsync(async (req, res, next) => {
  const postObj = {
    userId: req.user._id,
    title: req.body.title,
    description: req.body.description
  };

  const post = await Post.create(postObj);
  if (!post) return next(new AppError('Something went wrong', 409));
  res.status(201).json(post);
});
module.exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError('Could not find the post', 404));
  res.status(200).json({ status: 'success', post });
});

module.exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.aggregate([
    {
      $match: {
        userId: req.user._id
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: 'comments',
        foreignField: '_id',
        as: 'comments'
      }
    },
    {
      $addFields: {
        desc: '$description',
        likes: { $size: '$likes' }
      }
    },
    {
      $project: {
        title: 1,
        desc: 1,
        created_at: 1,
        comments: 1,
        likes: 1
      }
    }
  ]);

  res.status(200).json({ status: 'success', posts });
});

module.exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.deleteOne({ _id: req.params.postId });
  if (!post) return next(new AppError('Could not find the post', 404));
  res
    .status(200)
    .json({ status: 'success', message: 'Post deleted successfully' });
});

module.exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, {
    $addToset: { likes: req.user._id },
    $pull: { unlikes: req.user._id }
  });
  if (!post) return next(new AppError('Could not find the post', 404));
  res
    .status(200)
    .json({ status: 'success', message: 'Post liked successfully' });
});

module.exports.unlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, {
    $addToset: { unlikes: req.user._id },
    $pull: { likes: reqq.user._id }
  });
  if (!post) return next(new AppError('Could not find the post', 404));
  res
    .status(200)
    .json({ status: 'success', message: 'Post unliked successfully' });
});
