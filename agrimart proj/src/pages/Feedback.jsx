import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { feedbackApi } from "../api/services/feedbackApi";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Fetch approved feedbacks on component mount
  useEffect(() => {
    fetchApprovedFeedbacks();
  }, []);

  // Refetch feedbacks when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      console.log("Feedback page focused, refetching reviews...");
      fetchApprovedFeedbacks();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchApprovedFeedbacks = async () => {
    try {
      setFeedbacksLoading(true);
      const response = await feedbackApi.getApprovedFeedback();
      const feedbacksData = response.data?.data || [];

      console.log("Fetched approved feedbacks:", feedbacksData);

      setFeedbacks(feedbacksData);
    } catch (error) {
      console.error("Error fetching approved feedbacks:", error);
      setFeedbacks([]);
    } finally {
      setFeedbacksLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const feedbackPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        rating: rating,
      };

      console.log("Submitting feedback:", feedbackPayload);

      await feedbackApi.createFeedback(feedbackPayload);

      toast.success("Thank you for your feedback! Your review will be visible after approval.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setRating(0);

      // Refetch feedbacks to show the newly submitted one if it's approved
      setTimeout(() => {
        fetchApprovedFeedbacks();
      }, 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      
      let errorMsg = "Failed to submit feedback. Please try again.";
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none";

  return (
    <div className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <h2 className="section-title text-foreground">Share Your <span className="text-primary">Feedback</span></h2>
        <p className="section-subtitle">Help us improve AgriMart with your valuable feedback</p>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-lg p-8 space-y-5 mb-12">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Name</label>
              <input 
                className={inputClass} 
                placeholder="Your name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
              <input 
                type="email" 
                className={inputClass} 
                placeholder="Your email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Subject</label>
            <input 
              className={inputClass} 
              placeholder="Feedback subject" 
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Message</label>
            <textarea 
              className={`${inputClass} h-28 resize-none`} 
              placeholder="Your message..." 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star className={`w-8 h-8 transition-colors ${s <= (hover || rating) ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {/* Approved Reviews */}
        <h3 className="font-heading font-bold text-2xl text-foreground mb-6">Recent Reviews</h3>
        {feedbacksLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No reviews yet. Be the first to share your feedback!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-card rounded-xl p-6 shadow-md card-hover">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-foreground">{feedback.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= feedback.rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{feedback.subject}</p>
                <p className="text-muted-foreground">{feedback.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
