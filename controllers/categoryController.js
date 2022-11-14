const Category = require("../models/category");
const Blog = require("../models/blog");
const { GetCategories, GetCategory } = require("../services/Category");
const { getCategory } = require("../validations/categoryRequest");
const ErrorHandler = require('../utils/errorHandler');

exports.getCategories = async (req, res) => {
  try {
    GetCategories(res);
  } catch (error) {
    ErrorHandler(500, false, error.message, res);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const errors = await getCategory(req);
    if (errors.length) {
        ErrorHandler(402, false, errors, res);
        return;
    }

    const { slug } = req.params;
    GetCategory(slug, res);
  } catch (error) {
    ErrorHandler(500, false, error.message, res);
  }
};
