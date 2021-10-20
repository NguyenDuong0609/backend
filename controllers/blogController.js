const Blog = require("../models/blog");

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
      const { id } = req.params;
      if (id) {
        await Blog.find({ _id: id }).exec((error, blog) => {
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
  createBlog: async (req, res) => {
    try {
      const blogObj = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category,
        user: req.user._id,
      };

      const blog = new Blog(blogObj);
      blog.save((error, blog) => {
        if (error) return res.json({ error: error });
        if (blog) {
          return res.status(201).json({ blog });
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateBlog: async (req, res) => {
    try {
      const { id } = req.params;

      const blogObj = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category,
        user: req.user._id,
      };

      const blog = await Blog.findByIdAndUpdate(id, blogObj, { new: true });

      res.status(200).json({ blog });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },
  deleteBog: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(400).json({ error: `Blog does not found with id: ${req.params.id}`});
      }

      await blog.remove();

      res.status(200).json({
        success: true,
        msg: "Delete Blog successfull"
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = blogController;
