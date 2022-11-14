const Blog = require("../../models/blog");
const { GetBlogs, GetBlog, AddBlog, UpdateBlog, DeleteBlog } = require("../../services/Admin");
const ErrorHandler = require('../../utils/errorHandler');
const { getBlog, addBlog, updateBlog, deleteBlog } = require('../../validations/admin');

const blogController = {
  getBlogs: async (req, res) => {
    try {
      GetBlogs(res);
    } catch (err) {
      ErrorHandler(500, false, error.message, res);
    }
  },
  getBlog: async (req, res) => {
    try {
      const errors = getBlog(req);
      if (errors.length) {
          ErrorHandler(402, false, errors, res);
          return;
      }

      const { id } = req.params;
      GetBlog(id, res);
    } catch (error) {
      ErrorHandler(500, false, error, res);
      return;
    }
  },
  createBlog: async (req, res) => {
    try {
      const errors = await addBlog(req);
      if (errors.length) {
          ErrorHandler(402, false, errors, res);
          return;
      }

      const blogObj = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category,
        user: req.user._id,
      };

      AddBlog(blogObj, res);
    } catch (err) {
      ErrorHandler(500, false, err, res);
      return;
    }
  },
  updateBlog: async (req, res) => {
    try {
      const errors = await updateBlog(req);
      if (errors.length) {
          ErrorHandler(402, false, errors, res);
          return;
      }
      const { id } = req.params;

      const blogObj = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category,
        user: req.user._id,
      };

      UpdateBlog(blogObj, id, res);
    } catch (err) {
      ErrorHandler(500, false, err, res);
      return;
    }
  },
  deleteBog: async (req, res) => {
    try {
      const errors = await deleteBlog(req);

      if (errors.length) {
          ErrorHandler(402, false, errors, res);
          return;
      }
      DeleteBlog(req.params.id, res);
    } catch (err) {
      ErrorHandler(500, false, err, res);
      return;
    }
  },
};

module.exports = blogController;
