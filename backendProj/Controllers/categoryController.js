const Category = require("../Models/categoryTbl");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const result = await Category.create(req.body);

    res.status(200).json({
      message: "Category created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Category updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET CATEGORY BY ID
exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Category.findById(id);

    res.status(200).json({
      message: "Category fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
  try {
    const result = await Category.find();

    res.status(200).json({
      message: "Categories fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
