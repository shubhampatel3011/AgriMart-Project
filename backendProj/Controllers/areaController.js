const Area = require("../Models/areaTbl");

// CREATE AREA
exports.createArea = async (req, res) => {
  try {
    const result = await Area.create(req.body);

    res.status(200).json({
      message: "Area created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE AREA
exports.updateArea = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Area.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Area updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE AREA
exports.deleteArea = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Area.findByIdAndDelete(id);

    res.status(200).json({
      message: "Area deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET AREA BY ID
exports.getAreaById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Area.findById(id).populate("cityId");

    res.status(200).json({
      message: "Area fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL AREAS
exports.getAllAreas = async (req, res) => {
  try {
    const result = await Area.find().populate("cityId");

    res.status(200).json({
      message: "Areas fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
