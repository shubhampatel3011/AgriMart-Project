const SubCategory = require("../Models/subCategoryTbl");

// CREATE SUBCATEGORY
exports.createSubCategory = async (req, res) => {
  try {
    const result = await SubCategory.create(req.body);

    res.status(200).json({
      message: "SubCategory created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE SUBCATEGORY
exports.updateSubCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await SubCategory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "SubCategory updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE SUBCATEGORY
exports.deleteSubCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await SubCategory.findByIdAndDelete(id);

    res.status(200).json({
      message: "SubCategory deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET SUBCATEGORY BY ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await SubCategory.findById(id).populate("categoryId");

    res.status(200).json({
      message: "SubCategory fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL SUBCATEGORIES
exports.getAllSubCategories = async (req, res) => {
  try {
    const result = await SubCategory.find().populate("categoryId");

    res.status(200).json({
      message: "SubCategories fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
