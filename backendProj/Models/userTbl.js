const mongoose = require("mongoose");

const userTbl = new mongoose.Schema(
  {
    userType: {
      type: Number,
      enum: [0, 1, 2, 3], // 0-Admin, 1-Kitchen, 2-Delivery, 3-Customer
      required: true,
      default: 3,
    },

    Name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use valid email"],
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Remove any spaces, dashes, or parentheses for validation
          const cleanNumber = v.replace(/[\s\-()]/g, '');
          return /^[0-9]{10}$/.test(cleanNumber);
        },
        message: "Mobile number must be exactly 10 digits",
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
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

module.exports = mongoose.model("User", userTbl);
