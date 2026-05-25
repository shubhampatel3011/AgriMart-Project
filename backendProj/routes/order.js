var express = require("express");
const { response } = require("../app");
const orderController = require("../Controllers/orderController");

var router = express.Router();

// GET ALL orders
router.get("/", orderController.getAllOrders);

// GET farmer orders
router.get("/farmer/:farmerId", orderController.getFarmerOrders);

// GET user orders
router.get("/user/:userId", orderController.getUserOrders);

// GET order BY ID
router.get("/:id", orderController.getOrderById);

// CREATE order
router.post("/", orderController.createOrder);

// UPDATE order
router.put("/:id", orderController.updateOrder);

// DELETE order
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
