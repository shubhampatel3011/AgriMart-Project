const mongoose = require("mongoose");

const orderTbl = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    Name: {
      type: String,
      required: [true, "User name is required"],
    },

    email: {
      type: String,
      required: true,
      // unique: true,
      maxlength: 50,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use valid email"],
    },

    mobile: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Mobile number must be 10 digits",
      },
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    productName: {
      type: String,
      required: [true, "Product name is required"],
    },

    productPrice: {
      type: Number,
      required: [true, "Product price is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    address: {
      line1: { type: String, required: [true, "Address line 1 is required"] },
      line2: { type: String },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      pincode: { type: String, required: [true, "Pincode is required"] },
    },

    orderStatus: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
      // 0 - Generated
      // 1 - Accepted
      // 2 - Rejected
      // 3 - Cancel
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    updatedDate: {
      type: Date,
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("Order", orderTbl);
