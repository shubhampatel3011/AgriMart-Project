import { useState, useContext } from "react";
import { Mail, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FarmerContext } from "@/context/FarmerContext";
import { farmerApi } from "../../api/services/farmerApi";

const FarmerLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(FarmerContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const setField = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Valid email is required");
      return;
    }
    if (!form.password || form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      console.log(
        "%c🚜 Farmer Login Attempt",
        "color: #3b82f6; font-weight: bold;",
      );
      console.log(`Email: ${form.email}`);
      console.log(
        `Password: ${form.password.substring(0, 2)}${"*".repeat(form.password.length - 2)}`,
      );

      // Call backend login API using farmerApi
      const response = await farmerApi.login(form.email, form.password);
      const data = response.data;
      const farmer = data.farmer || data.data || data;

      // CHECKING FARMER APPROVAL
      // Normalize values
      const isVerified =
        farmer.isVerified === true ||
        farmer.isVerified === "true" ||
        farmer.isVerified === 1;
      const status = (farmer.status || "").toLowerCase();

      // console.log("Approval Debug:", {
      //   isVerified: farmer.isVerified,
      //   status: farmer.status,
      // });

      if (status === "rejected") {
        toast.error("Your account has been rejected by the admin.");
        return;
      }

      if (!isVerified && status !== "approved") {
        toast.error("Your account is waiting for admin approval.");
        return;
      }

      console.log("%c✅ Farmer Login Successful", "color: #22c55e; font-weight: bold;");
      console.log("Farmer ID:", farmer._id);
      console.log("Farmer Name:", farmer.Name || farmer.farmerName);

      // Prepare farmer data
      const farmerData = {
        _id: farmer._id,
        farmerName: farmer.Name || farmer.farmerName,
        email: farmer.email,
        mobile: farmer.mobile || farmer.contactNo,
        contactNo: farmer.contactNo,
        address: farmer.address,
        city: farmer.city,
        state: farmer.state,
        isVerified: farmer.isVerified,
      };

      // Use FarmerContext login
      login(farmerData);

      toast.success(`Welcome, ${farmerData.farmerName}!`);

      // Redirect to farmer dashboard
      navigate("/farmer");
    } catch (error) {
      console.error('%c❌ Login Error', 'color: #ef4444; font-weight: bold;', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response) {
        // Backend returned an error response
        const message = error.response.data?.message || error.response.data?.error || 'Login failed';
        
        // Show different toast styles for different error types
        if (error.response.status === 403) {
          toast.error(message, { duration: 4000 }); // Longer display for approval messages
        } else {
          toast.error(message);
        }
      } else if (error.message === 'Network Error') {
        toast.error('Cannot connect to server. Please check if backend is running on http://localhost:3000');
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-4xl mb-2">🚜</div>
            <h1 className="font-heading font-extrabold text-2xl text-foreground">Farmer Login</h1>
            <p className="text-muted-foreground text-sm">Access your AgriMart farmer account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="Enter your email"
                  className={`pl-9 ${inputCls}`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={setField("password")}
                  placeholder="Enter your password"
                  className={`pl-9 ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">New farmer?</span>
            </div>
          </div>

          {/* Create Account Button */}
          <Link
            to="/farmer/register"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all text-center block"
          >
            Create Account
          </Link>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;
