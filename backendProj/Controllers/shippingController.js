const Shipping = require("../Models/shippingTbl");

// CREATE SHIPPING
exports.createShipping = async (req, res) => {
  try {
    const result = await Shipping.create(req.body);

    res.status(200).json({
      message: "Shipping created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE SHIPPING
exports.updateShipping = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Shipping.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Shipping updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE SHIPPING
exports.deleteShipping = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Shipping.findByIdAndDelete(id);

    res.status(200).json({
      message: "Shipping deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET SHIPPING BY ID
exports.getShippingById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Shipping.findById(id)
      .populate("userId")
      .populate("cityId")
      .populate("areaId");

    res.status(200).json({
      message: "Shipping fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL SHIPPING ENTRIES
exports.getAllShippings = async (req, res) => {
  try {
    const result = await Shipping.find()
      .populate("userId")
      .populate("cityId")
      .populate("areaId");

    res.status(200).json({
      message: "Shippings fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
