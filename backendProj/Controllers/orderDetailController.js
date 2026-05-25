const OrderDetail = require("../Models/orderDetailTbl");

// CREATE ORDER DETAIL
exports.createOrderDetail = async (req, res) => {
  try {
    const result = await OrderDetail.create(req.body);

    res.status(200).json({
      message: "Order detail created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE ORDER DETAIL
exports.updateOrderDetail = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await OrderDetail.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Order detail updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE ORDER DETAIL
exports.deleteOrderDetail = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await OrderDetail.findByIdAndDelete(id);

    res.status(200).json({
      message: "Order detail deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ORDER DETAIL BY ID
exports.getOrderDetailById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await OrderDetail.findById(id)
      .populate("orderId")
      .populate("productId");

    res.status(200).json({
      message: "Order detail fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL ORDER DETAILS
exports.getAllOrderDetails = async (req, res) => {
  try {
    const result = await OrderDetail.find()
      .populate("orderId")
      .populate("productId");

    res.status(200).json({
      message: "Order details fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
