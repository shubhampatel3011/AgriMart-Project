const ThirdCategory = require("../Models/thirdCategoryTbl");

// CREATE THIRD CATEGORY
exports.createThirdCategory = async (req, res) => {
  try {
    const result = await ThirdCategory.create(req.body);

    res.status(200).json({
      message: "ThirdCategory created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE THIRD CATEGORY
exports.updateThirdCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await ThirdCategory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "ThirdCategory updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE THIRD CATEGORY
exports.deleteThirdCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await ThirdCategory.findByIdAndDelete(id);

    res.status(200).json({
      message: "ThirdCategory deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET THIRD CATEGORY BY ID
exports.getThirdCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await ThirdCategory.findById(id)
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json({
      message: "ThirdCategory fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL THIRD CATEGORIES
exports.getAllThirdCategories = async (req, res) => {
  try {
    const result = await ThirdCategory.find()
      .populate("categoryId")
      .populate("subCategoryId");

    res.status(200).json({
      message: "ThirdCategories fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
