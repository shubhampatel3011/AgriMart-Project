var express = require("express");
const { response } = require("../app");
const userController = require("../Controllers/userController");
const { verifyToken } = require("../middleware/auth");

var router = express.Router();

// Authentication Routes
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);

// GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);

// GET USER BY ID
router.get("/:id", userController.getUserById);

// CREATE USER
router.post("/", userController.createUser);

// UPDATE USER
router.put("/:id", userController.updateUser);

// DELETE USER
router.delete("/:id", userController.deleteUser);

module.exports = router;
