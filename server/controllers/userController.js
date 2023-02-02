const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/User.js');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

exports.getUser = catchAsync(async (req, res, next) => {
    if (!req.params.id)
        return res.status(200).json({
            status: 'success',
            data: {
                user: req.user
            }
        });

    const userId = req.params.id || req.user.id;

    const user = await User.findById(userId);

    if (!user) return new AppError('User not found.', 404);

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

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

exports.uploadProfilePhoto = upload.single('profilePhoto');

exports.resizeProfilePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    // Saving filename to multer properties because it's needed in .updateProfilePhoto.
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;

    await sharp(req.file.buffer)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/assets/profilePhotos/${req.file.filename}`);

    next();
});

exports.updateProfilePhoto = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePhoto: req.file.filename },
        {
            runValidators: true,
            new: true
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

exports.getFollowing = catchAsync(async (req, res, next) => {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId).populate('following');

    res.status(200).json({
        status: 'success',
        data: {
            following: user.following
        }
    });
});

exports.followOrUnfollow = catchAsync(async (req, res, next) => {
    const loggedInUser = req.user;
    const targetUser = await User.findById(req.params.userId);
    let action;

    if (!targetUser) return next(new AppError('User not found.', 404));

    const followingTarget = loggedInUser.following.some((userId) => {
        return userId.toString() === targetUser.id;
    });

    if (!followingTarget) {
        action = 'followed';
        loggedInUser.following.push(targetUser.id);
        targetUser.followers.push(loggedInUser.id);
    } else {
        action = 'unfollowed';
        loggedInUser.following = loggedInUser.following.filter(
            (userId) => userId.toString() !== targetUser.id
        );

        targetUser.followers = targetUser.followers.filter(
            (userId) => userId.toString() !== loggedInUser.id
        );
    }

    await loggedInUser.save({ validateBeforeSave: false });
    await targetUser.save({ validateBeforeSave: false });

    return res.status(201).json({
        status: 'success',
        action,
        data: {
            user: targetUser
        }
    });
});
