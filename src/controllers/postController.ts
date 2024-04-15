import { Types } from 'mongoose';
import Post from '../models/post.model';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { HOST_URL } from '../config/config';

type PostObj = {
  userId: string;
  title: string;
  description: string;
  image?: string;
};

/**
 * @swagger
 * tags:
 *   name: post
 *   description: api for post management
 * /api/posts:
 *   post:
 *     summery: create new post
 *     tags: [post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: awesome post
 *               description:
 *                 type: string
 *                 example: post description
 *     responses:
 *       201:
 *         description: successful post creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Post-Id:
 *                   type: string
 *                 Title:
 *                   type: string
 *                 Description:
 *                   type: string
 *                 image:
 *                   type: string
 *                 Created Time:
 *                   type: string
 *                   format: date-time
 *
 */

export const createPost = catchAsync(async (req, res, next) => {
  if (!req.body.title) {
    return next(new AppError('Please pass post title', 400));
  }
  if (!req.body.description) {
    return next(new AppError('Please pass post description', 400));
  }
  console.log('req.files:', req.files);
  console.log('req.file:', req.file);

  const postObj: PostObj = {
    userId: req.user._id,
    title: req.body.title,
    description: req.body.description,
  };
  if (req.file) {
    postObj.image = `${HOST_URL}/${req.file.filename}`;
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

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summery: get post by id
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: get post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 likes:
 *                   type: number
 *                 comments:
 *                   type: number
 *
 */

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

/**
 * @swagger
 * /api/feed:
 *   get:
 *     summery: get feed
 *     tags: [post]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       desc:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       likes:
 *                         type: number
 *                       comments:
 *                         type: object
 *
 *
 */

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

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summery: delete a post
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post deletion
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
 *                   example: Post deleted successfully
 */

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

/**
 * @swagger
 * /api/like/{postId}:
 *   get:
 *     summery: like a post
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post like
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
 *                   example: Post liked successfully
 */

export const likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, {
    $addToSet: { likes: req.user._id },
    $pull: { unlikes: req.user._id },
  });
  if (!post) return next(new AppError('Could not find the post', 404));
  res.status(200).json({ status: 'success', message: 'Post liked successfully' });
});

/**
 * @swagger
 * /api/unlike/{postId}:
 *   get:
 *     summery: unlike a post
 *     tags: [post]
 *     parameters:
 *       - in: params
 *         name: postId
 *         type: string
 *         example: 64dc6a450b3f317aa89fc732
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: successful post unlike
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
 *                   example: Post disliked successfully
 */

export const unlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, {
    $addToSet: { unlikes: req.user._id },
    $pull: { likes: req.user._id },
  });
  if (!post) return next(new AppError('Could not find the post', 404));
  res.status(200).json({ status: 'success', message: 'Post disliked successfully' });
});
