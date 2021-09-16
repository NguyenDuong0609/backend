const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, allUsers, getUserDetails, updateUser, deleteUser } = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/password/forgot', forgotPassword);
// router.put('/password/reset/:token', resetPassword);
// router.get('/logout', logout);
// router.get('/me', isAuthenticatedUser, getUserProfile);
// router.put('/password/update', isAuthenticatedUser, updatePassword);
// router.put('/me/update', isAuthenticatedUser, updateProfile);
// router.get('/users/', isAuthenticatedUser, authorizeRoles('admin'), allUsers);
// router.get('/user/:id', getUserDetails);
// router.put('/user/:id', updateUser);
// router.delete('/user/:id', authorizeRoles('admin'), deleteUser);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/logout', logout);
router.get('/me', getUserProfile);
router.put('/password/update', updatePassword);
router.put('/me/update', updateProfile);
router.get('/users/', allUsers);
router.get('/user/:id', getUserDetails);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;