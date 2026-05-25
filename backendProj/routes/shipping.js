var express = require("express");
const { response } = require("../app");
const shippingController = require("../Controllers/shippingController");

var router = express.Router();

// GET ALL shippings
router.get("/", shippingController.getAllShippings);

// GET shipping BY ID
router.get("/:id", shippingController.getShippingById);

// CREATE shipping
router.post("/", shippingController.createShipping);

// UPDATE shipping
router.put("/:id", shippingController.updateShipping);

// DELETE shipping
router.delete("/:id", shippingController.deleteShipping);

module.exports = router;
