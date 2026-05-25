import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { FarmerContext } from "@/context/FarmerContext";
import { toast } from "sonner";

const FarmerLayout = ({ children }) => {
  const { farmer, logout } = useContext(FarmerContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;
    
    if (path === "/farmer" || path === "/farmer/") {
      return "Dashboard";
    } else if (path === "/farmer/products") {
      return "My Products";
    } else if (path === "/farmer/products/add") {
      return "Add Product";
    } else if (path.startsWith("/farmer/products/") && path !== "/farmer/products/add") {
      return "Edit Product";
    } else if (path === "/farmer/profile") {
      return "Profile";
    } else if (path === "/farmer/orders") {
      return "My Orders";
    }
    return "Dashboard";
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/farmer/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AgriMart" className="h-10 object-contain" />
              <span className="text-sm font-semibold text-muted-foreground">| {getPageName()}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-foreground">
                {farmer?.farmerName}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-8">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default FarmerLayout;
