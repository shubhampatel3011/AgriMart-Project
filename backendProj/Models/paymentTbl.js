const mongoose = require("mongoose");

const paymentTbl = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },

    transactionNo: {
      type: String,
      required: [true, "Transaction number is required"],
      maxlength: [20, "Transaction number cannot exceed 20 characters"],
      trim: true,
    },

    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
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

    screenShot: {
      type: String,
      maxlength: [50, "Screenshot name cannot exceed 50 characters"],
    },

    isApproved: {
      type: Boolean,
      default: false, // 0 - Not Approve , 1 - Approve
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("Payment", paymentTbl);
