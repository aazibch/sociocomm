const express = require('express');

const authController = require('../controllers/authController');
const uploadImage = require('../middleware/uploadImage');

const postController = require('../controllers/postController.js');

const router = express.Router();

/* CREATE */
router.post(
    '/',
    authController.protect,
    uploadImage,
    postController.createPost
);

/* READ */
router.get('/', authController.protect, postController.getFeedPosts);
router.get(
    '/:userId/posts',
    authController.protect,
    postController.getUserPosts
);

/* UPDATE */
router.patch('/:id/like', authController.protect, postController.likePost);

module.exports = router;
