const Payment = require("../Models/paymentTbl");

// CREATE PAYMENT
exports.createPayment = async (req, res) => {
  try {
    const result = await Payment.create(req.body);

    res.status(200).json({
      message: "Payment created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE PAYMENT
exports.updatePayment = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Payment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Payment updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE PAYMENT
exports.deletePayment = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Payment.findByIdAndDelete(id);

    res.status(200).json({
      message: "Payment deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET PAYMENT BY ID
exports.getPaymentById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Payment.findById(id).populate("orderId");

    res.status(200).json({
      message: "Payment fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL PAYMENTS
exports.getAllPayments = async (req, res) => {
  try {
    const result = await Payment.find().populate("orderId");

    res.status(200).json({
      message: "Payments fetched successfully",
      list: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
