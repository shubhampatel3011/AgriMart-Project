var express = require("express");
const { response } = require("../app");
const areaController = require("../Controllers/areaController");

var router = express.Router();

// GET ALL AREAS
router.get("/", areaController.getAllAreas);

// GET AREA BY ID
router.get("/:id", areaController.getAreaById);

// CREATE AREA
router.post("/", areaController.createArea);

// UPDATE AREA
router.put("/:id", areaController.updateArea);

// DELETE AREA
router.delete("/:id", areaController.deleteArea);

module.exports = router;
