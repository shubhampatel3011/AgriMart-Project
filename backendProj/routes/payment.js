var express = require("express");
const { response } = require("../app");
const paymentController = require("../Controllers/paymentController");

var router = express.Router();

// GET ALL payments
router.get("/", paymentController.getAllPayments);

// GET payment BY ID
router.get("/:id", paymentController.getPaymentById);

// CREATE payment
router.post("/", paymentController.createPayment);

// UPDATE payment
router.put("/:id", paymentController.updatePayment);

// DELETE payment
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
