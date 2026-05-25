var express = require("express");
const { response } = require("../app");
const productController = require("../Controllers/productController");

var router = express.Router();

router.get("/my-products", productController.getFarmerProducts);

// GET ALL products
router.get("/", productController.getAllProducts);

// GET product BY ID
router.get("/:id", productController.getProductById);

// CREATE product
router.post("/", productController.createProduct);

// UPDATE product
router.put("/:id", productController.updateProduct);

// DELETE product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
