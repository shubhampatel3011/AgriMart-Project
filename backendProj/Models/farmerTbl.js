const mongoose = require("mongoose");

const farmerTbl = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    farmerName: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
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

    contactNo: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Contact number must be 10 digits",
      },
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    addressProof: {
      type: String,
      maxlength: 255,
    },

    adharCard: {
      type: String,
      maxlength: 255,
    },

    farmPhoto: {
      type: String,
      maxlength: 255,
    },

    farmerPhoto: {
      type: String,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },

    isVerified: {
      type: Boolean,
      default: false, // 0 - UnVerified , 1 - Verified
    },

    entryDate: {
      type: Date,
      default: Date.now,
    },

    verifiedDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("Farmer", farmerTbl);
