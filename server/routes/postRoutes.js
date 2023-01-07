const express = require('express');

const commentRoutes = require('./commentRoutes');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController.js');

const router = express.Router();

router.use('/:postId/comments', commentRoutes);

router.get('/feed', authController.protect, postController.getFeedPosts);
router.get('/', authController.protect, postController.getUserPosts);
router.get('/:userId', authController.protect, postController.getUserPosts);

router.post(
    '/',
    authController.protect,
    postController.uploadPostPhoto,
    postController.createPost
);

router.delete('/:postId', authController.protect, postController.deletePost);

router.patch(
    '/:id/likes',
    authController.protect,
    postController.likeUnlikePost
);

module.exports = router;
