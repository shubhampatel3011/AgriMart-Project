const mongoose = require("mongoose");

const areaTbl = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [true, "City is required"],
    },

    city: {
      type: String,
      required: [true, "Area name is required"],
      maxlength: [50, "Area name cannot exceed 50 characters"],
      trim: true,
    },

    status: {
      type: Boolean,
      default: true, // 0 - InActive, 1 - Active
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("Area", areaTbl);
