const Blog = require("../models/blog");
const { GetBlogs, GetBlog } = require("../services/Blog");
const { getBlog } = require("../validations/blogRequest");
const ErrorHandler = require('../utils/errorHandler');

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
      const errors = await getBlog(req);
      if (errors.length) {
          ErrorHandler(402, false, errors, res);
          return;
      }
      const { slug } = req.params;

      GetBlog(slug, res);
    } catch (error) {
      ErrorHandler(500, false, error.message, res);
    }
  },
};

module.exports = blogController;
