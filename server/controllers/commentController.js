const Post = require('../models/Post');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

exports.getComments = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) return next(new AppError('Post not found.', 404));

    res.json({
        status: 'success',
        data: {
            comments: post.comments
        }
    });
});

exports.createComment = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.postId);

    if (!post) return next(new AppError('Post not found.', 404));

    let newComment = {
        content: req.body.content,
        user: req.user.id
    };

    post.comments.push(newComment);
    await post.save();

    newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
        status: 'success',
        data: {
            comment: newComment
        }
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) return next(new AppError('Post not found.', 404));

    const comment = post.comments.id(req.params.commentId);

    if (!comment) return next(new AppError('Comment not found.', 404));

    if (comment.user.toString() !== req.user.id) {
        return next(
            new AppError('Not authorized to perform this action.', 403)
        );
    }

    comment.remove();
    await post.save();

    res.status(204).json({
        status: 'success',
        data: {
            comment: comment
        }
    });
});
