import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "@/context/AdminContext";
import hero2 from "@/assets/hero-2.jpg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = adminLogin(email, password);
    if (ok) {
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } else {
      toast.error("Invalid credentials. Try admin@agrimart.com / admin123");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${hero2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />

      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-semibold group z-20"
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span>Back to Home</span>
      </Link>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/30 border border-primary/40 mb-4 backdrop-blur">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white drop-shadow-lg">AgriMart</h1>
          <p className="text-white/60 text-sm mt-1 tracking-widest uppercase font-semibold drop-shadow">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 backdrop-blur-lg shadow-2xl">
          <h2 className="font-heading font-bold text-xl text-white mb-1">Sign in to Admin</h2>
          <p className="text-white/60 text-sm mb-6">Enter your admin credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@agrimart.com"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition backdrop-blur"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition backdrop-blur"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur">
            <p className="text-xs text-white/60 text-center">
              Demo: <span className="text-white font-semibold">admin@agrimart.com</span> / <span className="text-white font-semibold">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
