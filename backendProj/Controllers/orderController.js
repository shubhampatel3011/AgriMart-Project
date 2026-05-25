const Order = require("../Models/orderTbl");
const mongoose = require("mongoose");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    console.log("Creating order with data:", req.body);

    // Validate required fields
    const { userId, Name, mobile, productId, productName, productPrice, quantity, totalPrice, category, address } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    if (!Name || !Name.trim()) {
      return res.status(400).json({
        error: "User name is required",
      });
    }

    // Validate mobile - must be exactly 10 digits
    const mobileStr = String(mobile).replace(/\D/g, "");
    if (!mobileStr || mobileStr.length !== 10) {
      return res.status(400).json({
        error: "Mobile number must be a valid 10-digit number",
      });
    }

    if (!productId) {
      return res.status(400).json({
        error: "Product ID is required",
      });
    }

    if (!address || !address.line1 || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({
        error: "Complete address with line1, city, state, and pincode is required",
      });
    }

    // Prepare order data - ensure mobile is proper 10-digit number
    const orderData = {
      ...req.body,
      mobile: parseInt(mobileStr), // Ensure it's a 10-digit number
    };
    // Remove orderDate if provided (schema has default)
    delete orderData.orderDate;

    const result = await Order.create(orderData);

    console.log("Order created successfully:", result._id);

    res.status(201).json({
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create order error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.error("Validation errors:", messages);
      return res.status(400).json({
        error: "Validation failed",
        details: messages,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate order",
        details: "This order already exists",
      });
    }

    console.error("Full error object:", error);
    res.status(500).json({
      error: error.message || "Failed to create order",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// GET USER'S ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId || req.params.userId;

    console.log("Fetching orders for user:", userId);

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid User ID format",
      });
    }

    const orders = await Order.find({ userId: userId })
      .populate("userId")
      .populate("productId")
      .sort({ orderDate: -1 });

    console.log("Found orders count:", orders.length);

    res.status(200).json({
      message: "User orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// UPDATE ORDER
exports.updateOrder = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Updating order:", id);

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid Order ID format",
      });
    }

    const result = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId").populate("productId");

    if (!result) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    console.log("Order updated successfully:", result._id);

    res.status(200).json({
      message: "Order updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Deleting order:", id);

    const result = await Order.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    console.log("Order deleted successfully:", id);

    res.status(200).json({
      message: "Order deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Fetching order:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid Order ID format",
      });
    }

    const result = await Order.findById(id)
      .populate("userId")
      .populate("productId");

    if (!result) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Fetch order error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders");

    const result = await Order.find()
      .populate("userId")
      .populate("productId")
      .sort({ orderDate: -1 });

    console.log("Total orders count:", result.length);

    res.status(200).json({
      message: "Orders fetched successfully",
      list: result,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// GET FARMER'S ORDERS
exports.getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    console.log("Fetching orders for farmer:", farmerId);

    if (!farmerId) {
      return res.status(400).json({
        error: "Farmer ID is required",
      });
    }

    // Validate if farmerId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({
        error: "Invalid Farmer ID format",
      });
    }

    // Find all orders where the product's farmer matches the provided farmerId
    const orders = await Order.find()
      .populate({
        path: "productId",
        match: { farmer: farmerId }, // Only get products from this farmer
      })
      .populate("userId")
      .sort({ orderDate: -1 });

    // Filter out orders where productId was not populated (product doesn't belong to this farmer)
    const farmerOrders = orders.filter((order) => order.productId !== null);

    console.log("Found farmer orders count:", farmerOrders.length);

    res.status(200).json({
      message: "Farmer orders fetched successfully",
      data: farmerOrders,
    });
  } catch (error) {
    console.error("Fetch farmer orders error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};
