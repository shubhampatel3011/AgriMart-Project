const mongoose = require("mongoose");

const thirdCategoryTbl = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "SubCategory is required"],
    },

    thirdCategory: {
      type: String,
      required: [true, "Third Category name is required"],
      maxlength: [50, "Third Category cannot exceed 50 characters"],
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

module.exports = mongoose.model("ThirdCategory", thirdCategoryTbl);
