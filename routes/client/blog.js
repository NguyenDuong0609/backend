const express = require('express');
const blogCtrl = require('../../controllers/client/blogController');

const router = express.Router();

router.get('/blogs', blogCtrl.getBlogs);
router.get('/blog/:slug', blogCtrl.getBlog);

module.exports = router;