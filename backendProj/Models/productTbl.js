const mongoose = require("mongoose");

const productTbl = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      trim: true,
      capitalize: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    quantity: {
      type: Number,
      min: [0, "Quantity cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    productImage: {
      type: String,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Farmer ID is required"],
    },

    farmerName: {
      type: String,
    },

    location: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false, // 0 - UnVerified , 1 - Verified
    },

    isActive: {
      type: Boolean,
      default: true, // 0 - InActive , 1 - Active
    },

    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("Product", productTbl);
