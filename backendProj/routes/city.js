const express = require("express");
const { response } = require("../app");
const cityController = require("../controllers/cityController");

var router = express.Router();

// GET ALL citys
router.get("/", cityController.getAllCities);

// GET city BY ID
router.get("/:id", cityController.getCityById);

// CREATE city
router.post("/", cityController.createCity);

// UPDATE city
router.put("/:id", cityController.updateCity);

// DELETE city
router.delete("/:id", cityController.deleteCity);

module.exports = router;
