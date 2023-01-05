const express = require('express');

const authController = require('../controllers/authController');

const postController = require('../controllers/postController.js');

const router = express.Router();

router.get('/feed', authController.protect, postController.getFeedPosts);
router.get('/', authController.protect, postController.getUserPosts);
router.get('/:userId', authController.protect, postController.getUserPosts);

router.post(
    '/',
    authController.protect,
    postController.uploadPostPhoto,
    postController.createPost
);

/* UPDATE */
router.patch(
    '/:id/likes',
    authController.protect,
    postController.likeUnlikePost
);

module.exports = router;
