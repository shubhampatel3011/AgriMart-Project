const mongoose = require("mongoose");

const shippingTbl = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
      trim: true,
    },

    mobileNo: {
      type: Number,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Mobile number must be 10 digits",
      },
    },

    alternateMobileNo: {
      type: Number,
      validate: {
        validator: function (v) {
          return !v || /^[0-9]{10}$/.test(v);
        },
        message: "Alternate mobile must be 10 digits",
      },
    },

    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^[0-9]{6}$/, "Pincode must be 6 digits"],
    },

    locality: {
      type: String,
      required: [true, "Locality is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [true, "City is required"],
    },

    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: [true, "Area is required"],
    },

    nearLandMark: {
      type: String,
      maxlength: [50, "Landmark cannot exceed 50 characters"],
    },

    addressType: {
      type: String,
      maxlength: [50, "Address type cannot exceed 50 characters"],
    },

    entryDate: {
      type: Date,
      default: Date.now,
    },

    isDefault: {
      type: Boolean,
      default: false, // 0 - No Default, 1 - Default
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("Shipping", shippingTbl);
