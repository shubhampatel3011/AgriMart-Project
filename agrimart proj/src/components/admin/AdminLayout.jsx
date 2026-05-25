import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingBag, Users, MessageSquare,
  LogOut, Leaf, Menu, X, ChevronRight, UserRound
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/farmers", label: "Farmers", icon: Users },
  { to: "/admin/users", label: "Users", icon: UserRound },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout } = useAdmin();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-heading font-extrabold text-white text-lg leading-none">AgriMart</div>
          <div className="text-xs text-white/50 font-semibold tracking-widest uppercase">Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => {
          const active = location.pathname === item.to ||
            (item.to !== "/admin" && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${
                active
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">A</span>
          </div>
          <div>
            <div className="text-white text-sm font-semibold leading-none">Admin</div>
            <div className="text-white/40 text-xs mt-0.5">admin@agrimart.com</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold text-sm transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f1a0f] flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1a0f] flex flex-col lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border flex-shrink-0">
          <button
            className="lg:hidden text-foreground p-2 rounded-lg hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="font-heading font-bold text-foreground text-lg">
              {navItems.find(n =>
                location.pathname === n.to ||
                (n.to !== "/admin" && location.pathname.startsWith(n.to))
              )?.label ?? "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-muted"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
