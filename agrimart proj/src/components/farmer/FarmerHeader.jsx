import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FarmerContext } from "@/context/FarmerContext";
import { useContext } from "react";
import { toast } from "sonner";

const FarmerHeader = ({ title = "Farmer Dashboard" }) => {
  const { logout } = useContext(FarmerContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="AgriMart" className="h-11 object-contain" />
          </Link>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 font-semibold text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default FarmerHeader;
