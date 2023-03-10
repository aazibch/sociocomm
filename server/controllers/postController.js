const multer = require('multer');
const sharp = require('sharp');
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const catchAsync = require('../middleware/catchAsync');

const filterObject = require('../utils/filterObject.js');
const AppError = require('../utils/AppError.js');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, next) => {
    if (file.mimetype.startsWith('image')) {
        return next(null, true);
    }

    next(
        new AppError('Not an image. Only image formats are accepted.', 400),
        false
    );
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPostImage = upload.single('postImage');

exports.formatPostImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    // Saving filename to multer properties because it's needed in .createPost.
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;

    await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/assets/postImages/${req.file.filename}`);

    next();
});

exports.createPost = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;

    if (req.file) {
        req.body.postImage = req.file.filename;
    }

    let post = await Post.create(req.body);

    post = post.toObject();
    post.user = req.user;

    res.status(201).json({
        status: 'success',
        data: {
            post
        }
    });
});

exports.getFeedPosts = catchAsync(async (req, res) => {
    const feedUsers = [...req.user.following, req.user.id];

    const posts = await Post.find({
        user: {
            $in: feedUsers
        }
    })
        .sort('-createdAt')
        .populate('user');

    res.status(200).json({
        status: 'success',
        data: {
            posts
        }
    });
});

exports.getUserPosts = catchAsync(async (req, res) => {
    const userId = req.params.userId || req.user.id;

    const posts = await Post.find({
        user: userId
    }).populate('comments.user user');

    res.status(200).json({
        status: 'success',
        data: {
            posts
        }
    });
});

exports.likeUnlikePost = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);

    const likeIndex = post.likedBy.findIndex((userId) => {
        return userId.toString() === req.user.id;
    });

    const likes = [...post.likedBy];

    if (likeIndex >= 0) {
        likes.splice(likeIndex, 1);
    } else {
        likes.push(req.user.id);
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { likedBy: likes },
        { new: true }
    ).populate('user');

    res.status(200).json({
        status: 'success',
        data: {
            post: updatedPost
        }
    });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);

    if (!post) {
        return next(new AppError('Post not found.', 404));
    }

    if (post.user.toString() !== req.user.id) {
        return next(
            new AppError('Not authorized to perform this action.', 403)
        );
    }

    await post.remove();

    res.status(204).json({
        status: 'success',
        data: {
            post: post
        }
    });
});
