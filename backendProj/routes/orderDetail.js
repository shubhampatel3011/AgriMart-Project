var express = require("express");
const { response } = require("../app");
const orderDetailController = require("../Controllers/orderDetailController");

var router = express.Router();

// GET ALL orderDetails
router.get("/", orderDetailController.getAllOrderDetails);

// GET orderDetail BY ID
router.get("/:id", orderDetailController.getOrderDetailById);

// CREATE orderDetail
router.post("/", orderDetailController.createOrderDetail);

// UPDATE orderDetail
router.put("/:id", orderDetailController.updateOrderDetail);

// DELETE orderDetail
router.delete("/:id", orderDetailController.deleteOrderDetail);

module.exports = router;
