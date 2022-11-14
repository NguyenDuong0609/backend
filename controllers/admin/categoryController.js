const Category = require("../../models/category");
const slugify = require("slugify");
const shortid = require("shortid");
const { create, update } = require("../../models/category");
const category = require("../../models/category");
const { GetCategories, GetCategoriesParent, AddCategory, updateCategories, DeleteCategory } = require('../../services/Admin');
const { addCategory, updateCategory, deleteCategory } = require('../../validations/admin');
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncErrors = require('../../middlewares/catchAsyncErrors');


exports.getCategories = async (req, res) => {
  try {
    GetCategories(res);
  } catch (error) {
      ErrorHandler(500, false, error.message, res);
  }
};

exports.getCategoriesParent = async (req, res) => {
  try {
    GetCategories(res);
  } catch (error) {
      ErrorHandler(500, false, error.message, res);
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

exports.addCategory = catchAsyncErrors( async (req, res, next) => {
  try {
    const errors = await addCategory(req);
    if (errors.length) {
      ErrorHandler(402, false, errors, res);
      return;
    }

    const categoryObj = {
      name: req.body.name,
      slug: req.body.slug,
      parentId: req.body.parentId,
    };
    AddCategory(categoryObj, req, res);
  } catch (e) {
    ErrorHandler(500, false, e.message, res);
  }
});

exports.updateCategories = async (req, res) => {
  try {
    const errors = await updateCategory(req);
    if (errors.length) {
      ErrorHandler(402, false, errors, res);
      return;
    }

    const { _id, name, parentId, type, slug } = req.body;
    updateCategories(_id, name, parentId, type, slug, res); 
  } catch (e) {
    ErrorHandler(500, false, e.message, res);
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
  try {
    const errors = deleteCategory(req);
    if (errors.length) {
        ErrorHandler(402, false, errors, res);
        return;
    }
    DeleteCategory(req.params.id, res);
  } catch (e) {

  }
};
