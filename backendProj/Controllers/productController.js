const Product = require("../Models/productTbl");
const mongoose = require("mongoose");

// GET FARMER'S PRODUCTS
exports.getFarmerProducts = async (req, res) => {
  try {
    // Get farmerId from query params or request body
    const farmerId = req.query.farmerId || req.body.farmerId || req.params.farmerId;

    console.log("getFarmerProducts - Received farmerId:", farmerId);

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

    const products = await Product.find({ farmer: farmerId }).populate("farmer");

    console.log("Found products count:", products.length);

    res.status(200).json({
      message: "Farmer products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Fetch Farmer Products Error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    // Get farmerId from request body or headers
    const farmerId = req.body.farmerId || req.body.farmer;

    if (!farmerId) {
      return res.status(400).json({
        error: "Farmer ID is required",
      });
    }

    // Create product with farmer ID
    const productData = {
      ...req.body,
      farmer: farmerId,
    };

    const result = await Product.create(productData);

    res.status(200).json({
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid Product ID format",
      });
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    console.log("Updating product:", id);
    console.log("Update data:", req.body);

    const result = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("farmer");

    console.log("Product updated successfully:", result);

    res.status(200).json({
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Product.findById(id).populate("farmer");

    res.status(200).json({
      message: "Product fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
const products = await Product.find().populate("farmer");
    res.status(200).json({
      message: "Products fetched successfully",
      list: products,
    });
  } catch (error) {
    console.error("Fetch Product Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
