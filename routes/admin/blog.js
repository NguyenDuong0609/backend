const express = require('express');
const blogCtrl = require('../../controllers/admin/blogController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middlewares/auth');

const router = express.Router();

router.get('/blogs', isAuthenticatedUser, blogCtrl.getBlogs);
router.post('/blog', isAuthenticatedUser, blogCtrl.createBlog);
router.get('/blog/:id', isAuthenticatedUser, blogCtrl.getBlog);
router.put('/blog/:id', isAuthenticatedUser, blogCtrl.updateBlog);
router.delete('/blog/:id', isAuthenticatedUser, blogCtrl.deleteBog);

module.exports = router;