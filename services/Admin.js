const User = require('../models/user');
const Blog = require('../models/blog');
const Category = require("../models/category");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

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

const updateCategory = async(id, category, res) => {
    const updatedCategory = await Category.findOneAndUpdate(
        { _id: id },
        category,
        {
          new: true,
        }
      );
    res.status(200).json({ 
        success: true,
        updatedCategory 
    });
}

exports.Register =  async (name, email, password, role, res) => {
    try {
        const user = await User.create({
            name,
            email,
            password,
            role,
            avatar: {
                public_id: 'asd',
                url: 'asd'
            }
        });

        return user;
    } catch(e) {
        ErrorHandler(500, false, 'Duplicate user', res);
        return;
    }
};

exports.ChangePassword = async (oldPassword, password, req, res) => {
    try {
        // Check previous user password
        const user = await User.findById(req.user.id).select('+password');
        const isMatched = await user.comparePassword(oldPassword);
        if(!isMatched) {
            ErrorHandler(404, false, 'Old password is incorrect', res);
            return;
        }

        user.password = password;
        await user.save();

        return user;
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.UpdateProfile = async (newUserData, req, res) => {
    try {
        // Update avatar: TODO 
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (e) {
        ErrorHandler(500, false, 'Duplicated email', res);
        return;
    }
};

exports.GetUserDetails = async (id, req, res) => {
    try {
        const user = await User.findById(id);
        if(!user) {
            ErrorHandler(404, false, `User does not found with id: ${req.params.id}`, res);
            return;
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.UpdateUser = async (newUserData, req, res) => {
    try {
        // Update avatar: TODO 
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        if(!user) {
            ErrorHandler(404, false, `User does not found with id: ${req.params.id}`, res);
            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.DeleteUser = async (id, res) => {
    try {
        const user = await User.findById(id);

        if (!user) {
            ErrorHandler(404, false, `User does not found with id: ${id}`, res);
            return;
        }
    
        await user.remove();
    
        res.status(200).json({
            success: true
        })
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.GetCategories = async (res) => {
    try {
        await Category.find({}).exec((error, categories) => {
            if (error) {
                ErrorHandler(404, false, error, res);
                return;
            };
            if (categories) {
                const categoryList = createCategories(categories);
                res.status(200).json({ 
                    success: true,
                    categories 
                });
            }
        });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.GetCategoriesParent = async (res) => {
    try {
        await Category.find({ parentId: ""}).exec((error, category) => {
            if (error) {
                ErrorHandler(404, false, error, res);
                return;
            }
                if (category) {
                    res.status(200).json({ 
                        success: true,
                        category 
                    });
                }
        });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.AddCategory = async (categoryObj, req, res) => {
    try {
        if (req.file) {
            categoryObj.categoryImage =
              process.env.PORT + "/public/" + req.file.filename;
          }
        
          if (req.body.parentId) {
            categoryObj.parentId = req.body.parentId;
          }
        
          const cat = new Category(categoryObj);
          cat.save((error, category) => {
            if (error) {
                ErrorHandler(404, false, 'Duplicated', res);
                return;
            }
            if (category) {
                res.status(200).json({ 
                    success: true,
                    category 
                });
            }
          });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
}

exports.updateCategories = async (_id, name, parentId, type, slug, res) => {

    try {
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

          updateCategory(_id[id], category, res);
        } else {
          const category = {
            name,
            type,
            slug
          };
          if (parentId !== "") {
            category.parentId = parentId;
          }

          updateCategory(_id, category, res);
        }
    } catch (e) {
        ErrorHandler(400, false, "Duplicated", res);
        return;
    }
}

exports.DeleteCategory = async (id, res) => {
    try {
        const category = await Category.findById(id);

        if (!category) {
            ErrorHandler(404, false, `Category does not found with id: ${id}`, res);
            return;
        }

        await category.remove();

        res.status(200).json({
            success: true
        });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.GetBlogs = async (res) => {
    try {
        await Blog.find({}).populate('category','slug name').populate('user','name role').exec((error, blogs) => {
            if (error) {
                ErrorHandler(400, false, error, res);
                return;
            }
            if (blogs) {
              res.status(200).json({ success: true, blogs });
            }
          });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.GetBlog = async (id, res) => {
    try {
        await Blog.find({ _id: id }).exec((error, blog) => {
            if (error) {
                ErrorHandler(404, false, `Blog does not found with id: ${id}`, res);
                return;
            }
            if (blog) {
              res.status(200).json({ success: true, blog });
            }
          });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.AddBlog = async (blogObj, res) => {
    try {
        const blog = new Blog(blogObj);
        blog.save((error, blog) => {
            if (error) {
                ErrorHandler(404, false, 'Duplicated', res);
                return;
            };
            if (blog) {
                return res.status(201).json({ success: true, blog });
            }
        });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};

exports.UpdateBlog = async (blogObj, id, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(id, blogObj, { new: true });

        res.status(200).json({ success: true, blog });
    } catch (e) {
        ErrorHandler(400, false, 'Duplicated', res);
        return;
    }
};

exports.DeleteBlog = async (id, res) => {
    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            ErrorHandler(404, false, `Blog does not found with id: ${id}`, res);
            return;
        }
    
        await blog.remove();
    
        res.status(200).json({ success: true });
    } catch (e) {
        ErrorHandler(500, false, e.message, res);
        return;
    }
};