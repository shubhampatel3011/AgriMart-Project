import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/feedback", label: "Feedback" },
  { to: "/login", label: "Login/Register" },
  { to: "/farmer/register", label: "Farmer Register" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur shadow-md">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.png" alt="AgriMart" className="h-12 object-contain" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-1">
            {navLinks
              .filter((l) => {
                if (l.to === "/login") return !user;
                if (["/profile", "/feedback"].includes(l.to)) return !!user;
                return true;
              })
              .map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                      location.pathname === l.to
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
          </ul>

          {user && (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
                <span>{user?.name || user?.username || "User"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-t border-border">
          <ul className="flex flex-col p-4 gap-1">
            {navLinks
              .filter((l) => {
                if (l.to === "/login") return !user;
                if (["/profile", "/feedback"].includes(l.to)) return !!user;
                return true;
              })
              .map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-semibold transition-colors ${
                      location.pathname === l.to
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

            {user && (
              <>
                <li className="px-4 py-3 border-t border-border mt-2">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <span>{user?.name || "User"}</span>
                  </div>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted text-foreground font-semibold transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive font-semibold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
