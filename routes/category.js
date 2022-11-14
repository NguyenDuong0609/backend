const express = require('express');
const { getCategories, getCategory } = require('../controllers/categoryController');
const router = express.Router();

router.get('/categories', getCategories);
router.get('/category/:slug', getCategory);

module.exports = router;