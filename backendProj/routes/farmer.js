const express = require("express");
const { response } = require("../app");
const farmerController = require("../Controllers/farmerController");
const multer = require("multer");

var router = express.Router();

// storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/uploads");
    },
    filename: function(req,file,cb){
        cb(null, Date.now()+"-"+file.originalname);
    },
});

const upload = multer({ storage });

// REGISTER FARMER
router.post("/register", upload.fields([
  { name: "farmPhoto", maxCount: 1 },
  { name: "addressProof", maxCount: 1 },
  { name: "adharCard", maxCount: 1 }
]), farmerController.registerFarmer);

// LOGIN FARMER
router.post("/login", farmerController.loginFarmer);

// GET ALL farmers
router.get("/", farmerController.getAllFarmers);

// GET farmer BY ID
router.get("/:id", farmerController.getFarmerById);

// CREATE farmer
router.post("/", farmerController.createFarmer);

// UPDATE farmer
router.put("/:id", farmerController.updateFarmer);

// DELETE farmer
router.delete("/:id", farmerController.deleteFarmer);

module.exports = router;
