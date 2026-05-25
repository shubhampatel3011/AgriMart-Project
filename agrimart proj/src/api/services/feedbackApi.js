import axiosClient from "../axiosClient";

export const feedbackApi = {
  // Create feedback
  createFeedback: (data) => axiosClient.post("/feedback", data),

  // Get all feedbacks (Admin)
  getAllFeedback: () => axiosClient.get("/feedback"),

  // Get approved feedbacks (Public)
  getApprovedFeedback: () => axiosClient.get("/feedback/approved"),

  // Update feedback status (Admin)
  updateFeedbackStatus: (id, data) => axiosClient.put(`/feedback/${id}`, data),

  // Delete feedback (Admin)
  deleteFeedback: (id) => axiosClient.delete(`/feedback/${id}`),
};
