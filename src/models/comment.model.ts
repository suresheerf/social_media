import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: [true, 'Post must belong to a user'],
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    content: { type: String },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
