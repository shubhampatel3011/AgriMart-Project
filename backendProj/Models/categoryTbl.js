const mongoose = require("mongoose");

const categoryTbl = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },

    icon: {
      type: String,
      maxlength: 50,
    },

    status: {
      type: Boolean,
      default: true, // 0 - InActive, 1 - Active
    },
  },
  { timestamps: false },
);

module.exports = mongoose.model("Category", categoryTbl);
