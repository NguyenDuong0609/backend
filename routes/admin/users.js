const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails, updateUser, deleteUser } = require('../../controllers/admin/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../../middlewares/auth');

const { isLogin } = require('../../middlewares/isLogin');
const { Register } = require('../../middlewares/admin');

router.post('/register', Register, registerUser);
router.post('/login', isLogin, loginUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/logout', isAuthenticatedUser, logout);
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);
router.get('/users/', isAuthenticatedUser, authorizeRoles('admin'), allUsers);
router.get('/user/:id', isAuthenticatedUser, getUserDetails);
router.put('/user/:id', isAuthenticatedUser, updateUser);
router.delete('/user/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;