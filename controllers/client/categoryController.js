const Category = require("../../models/category");
const Blog = require("../../models/blog");

exports.getCategories = async (req, res) => {
  try {
    await Category.find({}).exec((error, categories) => {
      if (error) return res.status(400).json({ error });
      if (categories) {
        res.status(200).json({ categories });
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getCategory = async (req, res) => {

  try {
    const { slug } = req.params;
    if (slug) {
      await Category.find({ slug: slug })
        .exec((error, category) => {
          if (error) return res.status(400).json({ error });
          if (category) {
            const idCate = category[0]._id;
            
            Blog.find({ category: idCate }).populate('category','slug name').populate('user','name role')
              .exec((error, blog) => {
                if (error) return res.status(400).json({ error });
                if (blog) {
                  res.status(200).json({ blog });
                }
              });
          }
        });
    } else {
      return res.status(400).json({ error: "Params required" });
    }
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
};
