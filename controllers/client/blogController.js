const Blog = require("../../models/blog");

const blogController = {
  getBlogs: async (req, res) => {
    try {
      await Blog.find({}).populate('category','slug name').populate('user','name role').exec((error, blogs) => {
        if (error) return res.status(400).json({ error });
        if (blogs) {
          res.status(200).json({ blogs });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlog: async (req, res) => {
    try {
      const { slug } = req.params;

      if (slug) {
        await Blog.find({ slug: slug }).populate('category','slug name').populate('user','name role').exec((error, blog) => {
          if (error) return res.status(400).json({ error });
          if (blog) {
            res.status(200).json({ blog });
          }
        });
      } else {
        return res.status(400).json({ error: "Params required" });
      }
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = blogController;
