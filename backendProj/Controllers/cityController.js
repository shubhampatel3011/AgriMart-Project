const City = require("../Models/cityTbl");

// CREATE CITY
exports.createCity = async (req, res) => {
  try {
    const result = await City.create(req.body);

    res.status(200).json({
      message: "City created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE CITY
exports.updateCity = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await City.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "City updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE CITY
exports.deleteCity = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await City.findByIdAndDelete(id);

    res.status(200).json({
      message: "City deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET CITY BY ID
exports.getCityById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await City.findById(id);

    res.status(200).json({
      message: "City fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL CITIES
exports.getAllCities = async (req, res) => {
  try {
    const result = await City.find();

    res.status(200).json({
      message: "Cities fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
