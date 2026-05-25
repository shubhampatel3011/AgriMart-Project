var express = require("express");
const feedbackController = require("../Controllers/feedbackController");

var router = express.Router();

// GET ALL feedbacks (Admin)
router.get("/", feedbackController.getAllFeedback);

// GET APPROVED feedbacks (Public)
router.get("/approved", feedbackController.getApprovedFeedback);

// CREATE feedback
router.post("/", feedbackController.createFeedback);

// UPDATE feedback status (Admin)
router.put("/:id", feedbackController.updateFeedbackStatus);

// DELETE feedback (Admin)
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;
