const Category = require('../models/category');
const Blog = require('../models/blog');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

exports.GetCategories = catchAsyncErrors( async (res) => {
    try {
        await Category.find({}).exec((error, categories) => {
            if (error) {
                ErrorHandler(404, false, `Category does not found`, res);
                return;
            }
            if (categories) {
              res.status(200).json({ success: true, categories });
            }
        });
    } catch(e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
});

exports.GetCategory = async (slug, res) => {
    try {
        await Category.find({ slug: slug })
            .exec((error, category) => {
            if (category.length == 0) {
                ErrorHandler(404, false, `Category does not found with id: ${slug}`, res);
                return;
            } else {
                const idCate = category[0]._id;
                
                Blog.find({ category: idCate }).populate('category','slug name').populate('user','name role')
                .exec((error, blog) => {
                    if (blog.length == 0) {
                        ErrorHandler(404, false, `Blogs does not found`, res);
                        return;
                    }
                    if (blog) {
                    res.status(200).json({ success: true, blog });
                    }
                });
            }
        });
    } catch(e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};