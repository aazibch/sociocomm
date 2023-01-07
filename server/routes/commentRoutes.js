const express = require('express');
const router = express.Router({ mergeParams: true });

const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

router.get('/', authController.protect, commentController.getComments);
router.post('/', authController.protect, commentController.createComment);
router.delete(
    '/:commentId',
    authController.protect,
    commentController.deleteComment
);

module.exports = router;
