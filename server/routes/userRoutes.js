const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.get('/me', authController.protect, userController.getUser);
router.get('/:id', authController.protect, userController.getUser);

router.patch(
    '/me/profilePhoto',
    authController.protect,
    userController.uploadProfilePhoto,
    userController.resizeProfilePhoto,
    userController.updateProfilePhoto
);

router.get(
    '/me/following',
    authController.protect,
    userController.getFollowing
);
router.get(
    '/:id/following',
    authController.protect,
    userController.getFollowing
);

router.patch(
    '/me/following/:userId',
    authController.protect,
    userController.followOrUnfollow
);

module.exports = router;
