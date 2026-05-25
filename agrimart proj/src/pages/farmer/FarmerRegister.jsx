import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, MapPin, User, Lock, Upload, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { farmerApi } from "../../api/services/farmerApi";

const FarmerRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    farmerName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
  });

  const [documents, setDocuments] = useState({
    farmPhoto: null,
    addressProof: null,
    adharCard: null,
  });

  const [previews, setPreviews] = useState({
    farmPhoto: null,
  });

  const setField = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type for images
    if (["farmPhoto"].includes(field)) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, GIF, and WebP images are allowed");
        return;
      }
    }

    setDocuments(prev => ({ ...prev, [field]: file }));

    // Show preview for images
    if (["farmPhoto"].includes(field)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews(prev => ({ ...prev, [field]: event.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreview = (field) => {
    setDocuments(prev => ({ ...prev, [field]: null }));
    setPreviews(prev => ({ ...prev, [field]: null }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.farmerName.trim()) {
      toast.error("Farmer name is required");
      return;
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Valid email is required");
      return;
    }
    if (!form.contactNo || !/^[0-9]{10}$/.test(form.contactNo.toString())) {
      toast.error("Phone number must be 10 digits");
      return;
    }
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!form.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!form.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!form.state.trim()) {
      toast.error("State is required");
      return;
    }
    if (!documents.farmPhoto) {
      toast.error("Farm photo is required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("farmerName", form.farmerName);
      formData.append("email", form.email);
      formData.append("contactNo", parseInt(form.contactNo));
      formData.append("password", form.password);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("isVerified", false); // Set to pending approval

      if (documents.farmPhoto) formData.append("farmPhoto", documents.farmPhoto);
      if (documents.addressProof) formData.append("addressProof", documents.addressProof);
      if (documents.adharCard) formData.append("adharCard", documents.adharCard);

      console.log('Registering Farmer', 'color: #3b82f6; font-weight: bold;');
      
      const response = await farmerApi.registerFarmer(formData);

      toast.success("Registration successful! Your details are pending admin approval.");
      console.log('Farmer Registered', 'color: #22c55e; font-weight: bold;');
      console.log('Farmer ID:', response.data?.data?._id);
      
      // Redirect to login
      setTimeout(() => navigate("/farmer/login"), 500);
    }
    catch (error) {
      console.error('Registration error:', error);
      
      if(error.response){
        const message= error.response.data?.message || error.response.data?.error || "Registration failed";
        toast.error(message);
      } else if(error.message === "Network Error"){
        toast.error("Cannot connect to server");
      } else {
        toast.error("Something went wrong")
      }
    }
    finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-heading font-extrabold text-3xl text-foreground">Farmer Registration</h1>
            <p className="text-muted-foreground">Join AgriMart as a farmer. Register for admin approval.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Farmer Name *</label>
                  <input
                    type="text"
                    value={form.farmerName}
                    onChange={setField("farmerName")}
                    placeholder="Enter your name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="Enter your email"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={form.contactNo}
                  onChange={setField("contactNo")}
                  placeholder="10-digit phone number"
                  maxLength="10"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground">Location Information</h3>
              
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Address *</label>
                <textarea
                  value={form.address}
                  onChange={setField("address")}
                  placeholder="Enter your farm address"
                  className={`${inputCls} h-20 resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={setField("city")}
                    placeholder="e.g., Himatnagar"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">State *</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={setField("state")}
                    placeholder="e.g., Gujarat"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground">Documents</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Farm Photo */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Farm Photo *</label>
                  {previews.farmPhoto && (
                    <div className="mb-2 relative">
                      <img src={previews.farmPhoto} alt="Farm" className="w-full h-24 object-cover rounded-lg border border-border" />
                      <button
                        type="button"
                        onClick={() => removePreview("farmPhoto")}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload("farmPhoto")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Address Proof (Optional)</label>
                  <label className="flex items-center justify-center border border-border rounded-lg p-2 cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="file"
                      onChange={handleFileUpload("addressProof")}
                      className="hidden"
                    />
                    <span className="text-xs text-muted-foreground">{documents.addressProof?.name || "Choose file"}</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Aadhar Card (Optional)</label>
                  <label className="flex items-center justify-center border border-border rounded-lg p-2 cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="file"
                      onChange={handleFileUpload("adharCard")}
                      className="hidden"
                    />
                    <span className="text-xs text-muted-foreground">{documents.adharCard?.name || "Choose file"}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground">Security</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={setField("password")}
                    placeholder="At least 6 characters"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Confirm Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={setField("confirmPassword")}
                    placeholder="Re-enter password"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3">
              <p className="text-xs text-amber-900 dark:text-amber-300">
                <strong>Note:</strong> Your registration will be reviewed by the admin team. You'll be able to add products as soon as admin team approve your registration details.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register as Farmer"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already registered? 
              <Link to="/farmer/login" className="text-primary hover:underline font-semibold ml-1">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegister;
