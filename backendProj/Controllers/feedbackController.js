const Feedback = require("../Models/feedbackTbl");

// CREATE FEEDBACK
exports.createFeedback = async (req, res) => {
  try {
    console.log("Creating feedback with data:", req.body);

    const { name, email, subject, message, rating } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        error: "Subject is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5",
      });
    }

    const feedbackData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      rating: parseInt(rating),
      status: "Pending",
    };

    const result = await Feedback.create(feedbackData);

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create Feedback Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL FEEDBACKS (Admin)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Feedbacks fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    console.error("Get All Feedback Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET APPROVED FEEDBACKS (Public - for Feedback.jsx)
exports.getApprovedFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ status: "Approved" }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Approved feedbacks fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    console.error("Get Approved Feedback Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE FEEDBACK STATUS (Admin)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Approved", "Deleted"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be Pending, Approved, or Deleted",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        error: "Feedback not found",
      });
    }

    res.status(200).json({
      message: "Feedback status updated successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Update Feedback Status Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE FEEDBACK
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        error: "Feedback not found",
      });
    }

    res.status(200).json({
      message: "Feedback deleted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Delete Feedback Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};
