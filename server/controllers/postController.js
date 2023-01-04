const Post = require('../models/Post.js');
const User = require('../models/User.js');

const filterObject = require('../utils/filterObject.js');

/* CREATE */

exports.createPost = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        const filteredBody = filterObject(
            req.body,
            'description',
            'picturePath'
        );

        filteredBody.author = user._id;

        const newPost = await Post.create(filteredBody);

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({
            message: error.message
        });
    }
};

/* READ */
exports.getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId });
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

/* UPDATE */
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const likeIndex = post.likes.indexOf(
            (userId) => userId.toString() === req.params.userId
        );

        const likes = [...post.likes];
        if (likeIndex) {
            likes.splice(likeIndex, 1);
        } else {
            likes.push(req.params.userId);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
