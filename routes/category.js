const express = require('express');
const { getCategories, addCategory, updateCategories, deleteCategories } = require('../controllers/categoryController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function(req, file, cb) {
        cb(null, shortid.generate() + '-' + file.originalname)
    }
});

router.get('/category/categories', getCategories);
router.post('/category/create', addCategory);
router.put('/category/update', updateCategories);
router.delete('/category/delete', deleteCategories);

module.exports = router;