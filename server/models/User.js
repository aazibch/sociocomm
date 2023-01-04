const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            type: String,
            validate: [
                validator.isEmail,
                'Please provide a valid email address.'
            ],
            required: true,
            maxlength: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
            select: false
        },
        passwordConfirmation: {
            type: String,
            required: true,
            validate: {
                validator: function (val) {
                    return val === this.password;
                },
                message: 'Passwords do not match.'
            }
        },
        profilePhoto: {
            type: String,
            default: 'default.jpeg'
        },
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        occupation: String,
        passwordChangeDate: Date
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirmation = undefined;

    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangeDate = Date.now() - 1000;
    next();
});

userSchema.methods.isPasswordCorrect = async function (
    inputPass,
    encryptedPass
) {
    return await bcrypt.compare(inputPass, encryptedPass);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
