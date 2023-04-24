const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: [true, 'Post must belong to auser']
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    content: { type: String },
    images: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
