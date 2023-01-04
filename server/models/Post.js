const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        description: String
    },
    {
        timestamps: true
    }
);

const postSchema = mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        description: String,
        picturePath: String,
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: {
            type: [commentSchema]
        }
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
