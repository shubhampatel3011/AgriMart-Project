import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package, ShoppingBag, Users, MessageSquare,
  TrendingUp, AlertCircle, CheckCircle, Clock, ArrowRight, Loader
} from "lucide-react";
import { productApi } from "@/api/services/productApi";
import { orderApi } from "@/api/services/orderApi";
import { farmerApi } from "@/api/services/farmerApi";

const statusConfig = {
  Delivered: { icon: CheckCircle, cls: "bg-emerald-500/10 text-emerald-600" },
  Shipped: { icon: TrendingUp, cls: "bg-blue-500/10 text-blue-600" },
  Processing: { icon: Clock, cls: "bg-amber-500/10 text-amber-600" },
  Pending: { icon: Clock, cls: "bg-amber-500/10 text-amber-600" },
};

const quickLinks = [
  { to: "/admin/products", label: "Manage Products", icon: Package },
  { to: "/admin/orders", label: "View Orders", icon: ShoppingBag },
  { to: "/admin/farmers", label: "Farmer Requests", icon: Users },
  { to: "/admin/feedback", label: "Moderate Feedback", icon: MessageSquare },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    {
      label: "Total Products",
      value: "0",
      icon: Package,
      color: "bg-emerald-500/10 text-emerald-500",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Orders",
      value: "0",
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-500",
      border: "border-blue-500/20",
    },
    {
      label: "Registered Farmers",
      value: "0",
      icon: Users,
      color: "bg-amber-500/10 text-amber-500",
      border: "border-amber-500/20",
    },
    {
      label: "Pending Feedbacks",
      value: "0",
      icon: MessageSquare,
      color: "bg-purple-500/10 text-purple-500",
      border: "border-purple-500/20",
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsRes = await productApi.getProducts();
        const productCount = productsRes.data?.list?.length || 0;

        // Fetch orders
        const ordersRes = await orderApi.getOrders();
        const orders = ordersRes.data?.list || [];
        const orderCount = orders.length;

        // Fetch farmers
        const farmersRes = await farmerApi.getFarmers();
        const farmers = farmersRes.data?.data || [];
        const farmerCount = farmers.length;

        // Update stats
        setStats((prev) => [
          { ...prev[0], value: String(productCount) },
          { ...prev[1], value: String(orderCount) },
          { ...prev[2], value: String(farmerCount) },
          { ...prev[3], value: "0" }, // Pending feedbacks (no API yet)
        ]);

        // Get last 5 orders, sorted by date (most recent first)
        const sortedOrders = orders
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
          )
          .slice(0, 5);
        setRecentOrders(sortedOrders);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-foreground">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
          <p className="text-red-800 dark:text-red-400 text-sm font-semibold">
            {error}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-card rounded-2xl p-5 border ${s.border} shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-muted-foreground">
                {s.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}
              >
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="font-heading font-extrabold text-3xl text-foreground">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((ql) => (
            <Link
              key={ql.to}
              to={ql.to}
              className="flex items-center justify-between bg-card hover:bg-primary/5 border border-border hover:border-primary/30 rounded-xl p-4 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ql.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {ql.label}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-heading font-bold text-lg text-foreground">
            Recent Orders
          </h3>
          <Link
            to="/admin/orders"
            className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-5 h-5 text-primary animate-spin" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  {["Order ID", "Status", "Total Amount", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left font-semibold text-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const sc = statusConfig[o.status] || statusConfig.Pending;
                  const orderDate = new Date(
                    o.createdAt || o.date,
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={o._id || o.id}
                      className="border-b border-border hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-primary">
                        #{o._id?.slice(-4) || o.id}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc.cls}`}
                        >
                          <sc.icon className="w-3 h-3" />
                          {o.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        ₹{o.totalAmount || o.totalPrice || "0"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {orderDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Alert */}
      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-amber-800 dark:text-amber-400 text-sm">
            Pending farmer applications
          </div>
          <div className="text-amber-700 dark:text-amber-500 text-xs mt-0.5">
            Review and approve/reject new farmer registrations.{" "}
            <Link to="/admin/farmers" className="underline font-semibold">
              Go to Farmers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
