var express = require("express");
const { response } = require("../app");
const subCategoryController = require("../Controllers/subCategoryController");

var router = express.Router();

// GET ALL subCategorys
router.get("/", subCategoryController.getAllSubCategories);

// GET subCategory BY ID
router.get("/:id", subCategoryController.getSubCategoryById);

// CREATE subCategory
router.post("/", subCategoryController.createSubCategory);

// UPDATE subCategory
router.put("/:id", subCategoryController.updateSubCategory);

// DELETE subCategory
router.delete("/:id", subCategoryController.deleteSubCategory);

module.exports = router;
