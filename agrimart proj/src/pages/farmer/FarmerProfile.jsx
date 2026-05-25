import { useState, useContext, useEffect } from "react";
import { ArrowLeft, Save, X, User, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FarmerContext } from "@/context/FarmerContext";
import { toast } from "sonner";

const FarmerProfile = () => {
  const { farmer, updateFarmer } = useContext(FarmerContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    farmerName: "",
    email: "",
    contactNo: "",
    address: "",
    city: "",
    state: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!farmer) {
      navigate("/farmer/login");
    }
  }, [farmer, navigate]);

  // Initialize form with farmer data
  useEffect(() => {
    if (farmer) {
      setFormData({
        farmerName: farmer.farmerName || "",
        email: farmer.email || "",
        contactNo: farmer.contactNo || "",
        address: farmer.address || "",
        city: farmer.city || "",
        state: farmer.state || "",
      });
    }
  }, [farmer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.farmerName.trim()) {
      toast.error("Farmer name is required");
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Valid email is required");
      return;
    }
    if (!formData.contactNo) {
      toast.error("Contact number is required");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.state.trim()) {
      toast.error("State is required");
      return;
    }

    try {
      setLoading(true);
      const success = await updateFarmer(formData);
      if (success) {
        toast.success("Profile updated successfully! ✅");
        navigate("/farmer/");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!farmer) return null;

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm " +
    "focus:ring-2 focus:ring-blue-500 outline-none transition-colors placeholder:text-gray-400";
  const labelCls = "block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/farmer/")}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-lg overflow-hidden">

        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-6 sm:px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-extrabold text-2xl mb-1">Edit Profile</h1>
              <p className="text-blue-100 text-sm">Update your personal details — saved to local storage</p>
            </div>
            <div className="text-5xl select-none">👤</div>
          </div>
        </div>

        {/* Avatar / status strip */}
        <div className="flex items-center gap-4 px-6 sm:px-8 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow shrink-0">
            {(formData.farmerName || "F").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground truncate">{formData.farmerName || "Farmer"}</p>
            <p className="text-xs text-muted-foreground truncate">{formData.email || "—"}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">

          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>
                Farmer Name <span className="text-red-500 normal-case">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Patel"
                  className={`${inputCls} pl-9`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Email <span className="text-red-500 normal-case">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="farmer@example.com"
                  className={`${inputCls} pl-9`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Contact & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>
                Contact Number <span className="text-red-500 normal-case">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className={`${inputCls} pl-9`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Address <span className="text-red-500 normal-case">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street / Village"
                  required
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Row 3: City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>City <span className="text-red-500 normal-case">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Himatnagar"
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>State <span className="text-red-500 normal-case">*</span></label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="e.g. Gujarat"
                required
                className={inputCls}
              />
            </div>
          </div>

          {/* Info note */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Your profile changes will be saved to the backend and synchronized across all pages.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => navigate("/farmer/")}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg border border-input hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-500/50 disabled:cursor-not-allowed font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerProfile;
