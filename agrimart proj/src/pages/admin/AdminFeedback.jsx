import { useState, useEffect } from "react";
import { Star, CheckCircle, Trash2, Search, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { feedbackApi } from "@/api/services/feedbackApi";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all feedbacks on component mount
  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  // Refetch feedbacks when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      console.log("AdminFeedback page focused, refetching...");
      fetchAllFeedbacks();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchAllFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getAllFeedback();
      const feedbacksData = response.data?.data || [];

      console.log("Fetched all feedbacks:", feedbacksData);

      setFeedbacks(feedbacksData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to fetch feedbacks");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFeedback = async (id) => {
    try {
      setActionLoading(id);
      await feedbackApi.updateFeedbackStatus(id, { status: "Approved" });

      toast.success("Feedback approved and visible on site.");

      // Update local state
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === id ? { ...f, status: "Approved" } : f))
      );
    } catch (error) {
      console.error("Error approving feedback:", error);
      
      let errorMsg = "Failed to approve feedback. Please try again.";
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      setActionLoading(id);
      await feedbackApi.updateFeedbackStatus(id, { status: "Deleted" });

      toast.success("Feedback removed.");

      // Update local state
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === id ? { ...f, status: "Deleted" } : f))
      );
    } catch (error) {
      console.error("Error deleting feedback:", error);
      
      let errorMsg = "Failed to delete feedback. Please try again.";
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = feedbacks.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.subject.toLowerCase().includes(search.toLowerCase()) ||
      f.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    Pending: feedbacks.filter((f) => f.status === "Pending").length,
    Approved: feedbacks.filter((f) => f.status === "Approved").length,
    Deleted: feedbacks.filter((f) => f.status === "Deleted").length,
  };

  const statusCls = {
    Approved: "bg-emerald-500/10 text-emerald-600",
    Pending: "bg-amber-500/10 text-amber-600",
    Deleted: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-foreground">Feedback</h2>
        <p className="text-muted-foreground text-sm">{feedbacks.length} total feedback submissions</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading feedbacks...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-600"><Star className="w-5 h-5" /></div>
              <div><div className="font-heading font-extrabold text-xl text-foreground">{counts.Pending}</div><div className="text-xs text-muted-foreground">Pending</div></div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600"><ThumbsUp className="w-5 h-5" /></div>
              <div><div className="font-heading font-extrabold text-xl text-foreground">{counts.Approved}</div><div className="text-xs text-muted-foreground">Approved</div></div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 text-red-600"><Trash2 className="w-5 h-5" /></div>
              <div><div className="font-heading font-extrabold text-xl text-foreground">{counts.Deleted}</div><div className="text-xs text-muted-foreground">Removed</div></div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                placeholder="Search feedback..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
            <div className="flex gap-2">
              {["All", "Pending", "Approved", "Deleted"].map((s) => (
                <button 
                  key={s} 
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Cards */}
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No feedback found.</div>
            )}
            {filtered.map((f) => (
              <div key={f._id} className={`bg-card rounded-2xl border shadow-sm p-5 ${f.status === "Deleted" ? "opacity-60 border-border" : "border-border"}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-heading font-bold text-foreground">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{f.email}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCls[f.status]}`}>{f.status}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= f.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                    <div className="font-semibold text-foreground text-sm mb-1">{f.subject}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{f.message}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {f.status !== "Deleted" && (
                    <div className="flex gap-2 flex-shrink-0">
                      {f.status === "Pending" && (
                        <button 
                          onClick={() => handleApproveFeedback(f._id)}
                          disabled={actionLoading === f._id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> 
                          {actionLoading === f._id ? "Approving..." : "Approve"}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteFeedback(f._id)}
                        disabled={actionLoading === f._id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> 
                        {actionLoading === f._id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFeedback;
