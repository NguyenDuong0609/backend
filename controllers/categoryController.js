const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");
const { create, update } = require("../models/category");
const category = require("../models/category");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.getCategories = async (req, res) => {
  try {
    await Category.find({}).exec((error, categories) => {
      if (error) return res.status(400).json({ error });
      if (categories) {
        const categoryList = createCategories(categories);
        res.status(200).json({ categories });
      }
    });
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.getCategoriesParent = async (req, res) => {
  try {
    await Category.find({ parentId: ""}).exec((error, category) => {
      if (error) return res.status(400).json({ error });
        if (category) {
          res.status(200).json({ category });
        }
    })
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
}

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      await Category.find({ _id: id }).exec((error, category) => {
        if (error) return res.status(400).json({ error });
        if (category) {
          res.status(200).json({ category });
        }
      });
    } else {
      return res.status(400).json({ error: "Params required" });
    }
  } catch (error) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: req.body.slug,
    parentId: req.body.parentId,
  };

  if (req.file) {
    categoryObj.categoryImage =
      process.env.PORT + "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.json({ error: "Duplicated" });
    if (category) {
      return res.status(201).json({ category });
    }
  });
};

exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type, slug } = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    const category = {
      name: name[i],
      type: type[i],
      slug: slug[i]
    };
    if (parentId[i] !== "") {
      category.parentId = parentId[i];
    }

    try {
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    } catch (error) {
      return res.status(400).json({ error: "Duplicated" });
    }
  } else {
    const category = {
      name,
      type,
      slug
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }

    try {
      const updatedCategory = await Category.findOneAndUpdate(
        { _id },
        category,
        {
          new: true,
        }
      );
      res.status(200).json({ updatedCategory });
    } catch (error) {
      return res.status(400).json({ error: "Duplicated" });
    }
  }
};

exports.deleteCategories = async (req, res) => {
  // try {
  //   const { ids } = req.body;
  //   const deletedCategories = [];
  //   for (let i = 0; i < ids.length; i++) {
  //     const deleteCategory = await Category.findOneAndDelete({
  //       _id: ids[i]._id,
  //     });
  //     deletedCategories.push(deleteCategory);
  //   }
  //   if (deletedCategories.length == ids.length) {
  //     res.status(201).json({ message: "Categories removed" });
  //   } else {
  //     res.status(400).json({ message: "Some thing went wrong" });
  //   }
  // } catch (error) {
  //   return res.status(500).json({ msg: error.message });
  // }

  const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler(`Category does not found with id: ${req.params.id}`))
    }

    await category.remove();

    res.status(200).json({
        success: true
    })
};
