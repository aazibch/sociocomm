const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const filterObject = require('../utils/filterObject.js');
const catchAsync = require('../middleware/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const filteredBody = filterObject(
        req.body,
        'firstName',
        'lastName',
        'email',
        'password',
        'passwordConfirmation',
        'occupation'
    );

    const newUser = await User.create(filteredBody);

    // Remove the password property.
    newUser.password = undefined;

    // send email if necessary.

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new AppError('Please provide an email address and password.', 400)
        );
    }

    const user = await User.findOne({ email })
        .select('+password')
        .populate('followers following');

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
        return next(new AppError('Incorrect email address or password.', 401));
    }

    const userObj = user.toObject();
    delete userObj.password;

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: userObj
        }
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError("You're not logged in.", 401));
    }

    let decodedToken;

    try {
        decodedToken = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );
    } catch (err) {
        return next(new AppError("You're not logged in.", 401));
    }

    const user = await User.findById(decodedToken.id);

    if (!user) return next(new AppError("You're not logged in.", 401));

    req.user = user;

    next();
});
