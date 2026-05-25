var express = require("express");
const { response } = require("../app");
const thirdCategoryController = require("../Controllers/thirdCategoryController");

var router = express.Router();

// GET ALL thirdCategorys
router.get("/", thirdCategoryController.getAllThirdCategories);

// GET thirdCategory BY ID
router.get("/:id", thirdCategoryController.getThirdCategoryById);

// CREATE thirdCategory
router.post("/", thirdCategoryController.createThirdCategory);

// UPDATE thirdCategory
router.put("/:id", thirdCategoryController.updateThirdCategory);

// DELETE thirdCategory
router.delete("/:id", thirdCategoryController.deleteThirdCategory);

module.exports = router;
