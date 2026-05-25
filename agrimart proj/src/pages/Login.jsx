import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import hero3 from "@/assets/hero-3.jpg";
import { userApi } from "../api/services/userApi";

const Login = () => {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { login: contextLogin } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, allow only digits
    if (name === "phone") {
      const digitsOnly = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: digitsOnly.slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      
      const response = await userApi.loginUser(formData.email, formData.password);
      const userData = response.data.data;
      const { token, data } = response.data;

      sessionStorage.setItem("token", token);

      // Save user in context
      contextLogin(formData.email, formData.password, data);

      // Store user in context with userData from API
      contextLogin(formData.email, formData.password, userData);
      console.log("Login Data:", userData);
      toast.success(`Login successful! Welcome back, ${userData.Name || userData.username || "User"}.`);
      navigate(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(
        "Passwords do not match! Please enter the same password in both fields.",
      );
      return;
    }

    if (!formData.name || !formData.username || !formData.email || !formData.phone || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    // Client-side validation
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        Name: formData.name,
        username: formData.username,
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
      };
      
      console.log("Sending registration payload:", payload);

      const response = await userApi.registerUser(payload);

      toast.success("Registration successful! Please login to continue.");
      setTab("login");
      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    }
    catch (error) {
      console.error("Registration error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Full error:", JSON.stringify(error, null, 2));

      if (error.response) {
        const errorData = error.response.data;
        let message = errorData?.message || errorData?.error || "Registration failed";
        
        // If there are detailed validation errors, show them
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          message = errorData.errors.map(e => `${e.field}: ${e.message}`).join("\n");
        }
        
        toast.error(message);
      } else if (error.message === "Network Error") {
        toast.error("Cannot connect to server");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full max-w-sm mx-auto block px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none";

  return (
    <div
      className="min-h-screen relative flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: `url(${hero3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="container mx-auto max-w-md relative z-10">
        <h2 className="section-title text-white mb-8 text-center">
          {tab === "login" ? "Welcome Back" : "Join"}{" "}
          <span className="text-primary">AgriMart</span>
        </h2>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-8 border border-white/20 backdrop-blur">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-white/70"
              }`}
            >
              {t === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {tab === "login" ? (
          <form
            onSubmit={handleLogin}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 space-y-5 border border-white/20"
          >
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full text-lg" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (


// -------------- registration form ---------------------

          <form
            onSubmit={handleRegister}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 space-y-4 border border-white/20"
          >
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Phone
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter 10-digit phone"
                required
              />
              <p className="text-xs text-white/50 mt-1">{formData.phone.length}/10 digits</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Confirm password"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full text-lg">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
