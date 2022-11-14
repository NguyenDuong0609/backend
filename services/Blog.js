const Category = require('../models/category');
const Blog = require('../models/blog');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const blog = require('../models/blog');

exports.GetBlogs = catchAsyncErrors( async (res) => {
    try {
        await Blog.find({}).populate('category','slug name').populate('user','name role').exec((error, blogs) => {
            if (blog.length == 0) {
                ErrorHandler(404, false, `Blog does not found`, res);
                return;
            } else {
                res.status(200).json({ success: true, blogs });
            }
        });
    } catch(e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
});

exports.GetBlog = async (slug, res) => {
    try {
        await Blog.find({ slug: slug }).populate('category','slug name').populate('user','name role').exec((error, blog) => {
            if (blog.length == 0) {
                ErrorHandler(404, false, `Blog does not found`, res);
                return;
            } else {
                res.status(200).json({ success: true, blog });
            }
        });
    } catch(e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};