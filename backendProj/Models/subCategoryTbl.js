const mongoose = require("mongoose");

const subCategoryTbl = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    subCategory: {
      type: String,
      required: [true, "SubCategory name is required"],
      maxlength: [50, "SubCategory cannot exceed 50 characters"],
      trim: true,
    },

    icon: {
      type: String,
      maxlength: [50, "Icon cannot exceed 50 characters"],
    },

    status: {
      type: Boolean,
      default: true, // 0 - InActive, 1 - Active
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("SubCategory", subCategoryTbl);
