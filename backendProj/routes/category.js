var express = require("express");
const { response } = require("../app");
const categoryController = require("../Controllers/categoryController");

var router = express.Router();

// GET ALL categorys
router.get("/", categoryController.getAllCategories);

// GET category BY ID
router.get("/:id", categoryController.getCategoryById);

// CREATE category
router.post("/", categoryController.createCategory);

// UPDATE category
router.put("/:id", categoryController.updateCategory);

// DELETE category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
