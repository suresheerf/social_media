import { Types } from 'mongoose';
import Post from '../models/post.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { PORT } from '../config/config';

type PostObj = {
  userId: string;
  title: string;
  description: string;
  image?: string;
};

export const createPost = catchAsync(async (req, res, next) => {
  if (!req.body.title) {
    return next(new AppError('Please pass post title', 400));
  }
  if (!req.body.description) {
    return next(new AppError('Please pass post description', 400));
  }
  const postObj: PostObj = {
    userId: req.user._id,
    title: req.body.title,
    description: req.body.description,
  };
  if (req.file) {
    postObj.image = `http://localhost:${PORT}/${req.file.filename}`;
  }

  console.log('postObj: ', postObj);

  const post = await Post.create(postObj);
  if (!post) return next(new AppError('Something went wrong', 409));
  res.status(201).json({
    'Post-Id': post._id,
    Title: post.title,
    Description: post.description,
    image: post.image,
    'Created Time': post.createdAt,
  });
});
export const getPost = catchAsync(async (req, res, next) => {
  const post = await Post.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.params.postId),
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        likes: { $size: '$likes' },
        comments: { $size: '$comments' },
      },
    },
  ]);
  console.log('hfgh');
  if (post.length === 0) return next(new AppError('Could not find the post', 404));
  res.status(200).json(post[0]);
});

export const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.aggregate([
    {
      $match: {
        userId: req.user._id,
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: 'comments',
        foreignField: '_id',
        as: 'comments',
      },
    },
    {
      $addFields: {
        desc: '$description',
        likes: { $size: '$likes' },
        created_at: '$createdAt',
        id: '$_id',
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        id: 1,
        title: 1,
        desc: 1,
        created_at: 1,
        comments: 1,
        likes: 1,
      },
    },
  ]);

  res.status(200).json({ status: 'success', posts });
});

export const getFeed = catchAsync(async (req, res, next) => {
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: 'comments',
        localField: 'comments',
        foreignField: '_id',
        as: 'comments',
      },
    },
    {
      $addFields: {
        desc: '$description',
        likes: { $size: '$likes' },
        created_at: '$createdAt',
        id: '$_id',
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        id: 1,
        title: 1,
        desc: 1,
        created_at: 1,
        comments: 1,
        likes: 1,
      },
    },
  ]);

  res.status(200).json({ status: 'success', posts });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  console.log('post:', post);
  if (!post) return next(new AppError('Could not find the post', 404));

  if (post.userId?.toString() !== req.user._id.toString()) {
    return next(new AppError('you can not delete others post', 401));
  }
  await Post.findByIdAndDelete(req.params.postId);
  res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
});

export const likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, {
    $addToSet: { likes: req.user._id },
    $pull: { unlikes: req.user._id },
  });
  if (!post) return next(new AppError('Could not find the post', 404));
  res.status(200).json({ status: 'success', message: 'Post liked successfully' });
});

export const unlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, {
    $addToSet: { unlikes: req.user._id },
    $pull: { likes: req.user._id },
  });
  if (!post) return next(new AppError('Could not find the post', 404));
  res.status(200).json({ status: 'success', message: 'Post unliked successfully' });
});
