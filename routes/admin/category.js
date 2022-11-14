const express = require('express');
const { getCategories, getCategoriesParent, getCategory, addCategory, updateCategories, deleteCategories } = require('../../controllers/admin/categoryController');
const { isAuthenticatedUser, authorizeRoles } = require('../../middlewares/auth');
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

router.get('/categories', isAuthenticatedUser, getCategories);
router.get('/categories-parent', isAuthenticatedUser, getCategoriesParent);
router.post('/category/create', isAuthenticatedUser, addCategory);
router.get('/category/:id', getCategory);
router.put('/category/update', isAuthenticatedUser, updateCategories);
router.delete('/category/delete/:id', deleteCategories);

module.exports = router;