const mongoose = require("mongoose");

const cityTbl = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, "City name is required"],
      maxlength: [50, "City name cannot exceed 50 characters"],
      trim: true,
    },

    status: {
      type: Boolean,
      default: true, // 0 - InActive, 1 - Active
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("City", cityTbl);
