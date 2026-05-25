import { useState, useEffect } from "react";
import { CheckCircle, Clock, TrendingUp, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { orderApi } from "../../api/services/orderApi";

const statusOptions = ["Processing", "Accepted", "Rejected", "Cancelled"];

const statusConfig = {
  Delivered: { icon: CheckCircle, cls: "bg-emerald-500/10 text-emerald-600" },
  Accepted: { icon: CheckCircle, cls: "bg-emerald-500/10 text-emerald-600" },
  Shipped: { icon: TrendingUp, cls: "bg-blue-500/10 text-blue-600" },
  Processing: { icon: Clock, cls: "bg-amber-500/10 text-amber-600" },
  Rejected: { icon: Clock, cls: "bg-red-500/10 text-red-600" },
  Cancelled: { icon: Clock, cls: "bg-red-500/10 text-red-600" },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Re-fetch orders when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      console.log("Admin orders page focused, refetching...");
      fetchOrders();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching all orders...");

      const response = await orderApi.getOrders();
      const ordersData = response.data.list || [];

      console.log("Fetched orders:", ordersData);

      // Transform orders data for display
      const transformedOrders = ordersData.map((order) => {
        const statusMap = {
          0: "Processing",
          1: "Accepted",
          2: "Rejected",
          3: "Cancelled",
        };

        return {
          id: `#${order._id.slice(-6).toUpperCase()}`,
          buyer: order.Name,
          email: order.userId?.email || "No email",
          product: order.productName,
          quantity: `${order.quantity} kg`,
          totalPrice: `₹${order.totalPrice}`,
          date: new Date(order.orderDate).toLocaleDateString(),
          status: statusMap[order.orderStatus] || "Processing",
          _id: order._id,
          orderStatus: order.orderStatus,
          address: order.address,
          phone: order.mobile,
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusEnum = (statusText) => {
    const statusMap = {
      "Processing": 0,
      "Accepted": 1,
      "Rejected": 2,
      "Cancelled": 3,
    };
    return statusMap[statusText] || 0;
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (orderId, newStatus) => {
    try {
      const statusEnum = getStatusEnum(newStatus);
      await orderApi.updateOrders(orderId, { orderStatus: statusEnum });
      
      // Update local state
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus, orderStatus: statusEnum } : o));
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const confirmDelete = (order) => setDeleteTarget(order);

  const deleteOrder = async () => {
    try {
      await orderApi.deleteOrders(deleteTarget._id);
      
      // Remove from local state
      setOrders((prev) => prev.filter((o) => o._id !== deleteTarget._id));
      toast.success(`Order ${deleteTarget.id} deleted successfully`);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-foreground">Orders</h2>
        <p className="text-muted-foreground text-sm">{orders.length} total orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {statusOptions.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const { icon: Icon, cls } = statusConfig[s];
          return (
            <div key={s} className={`bg-card border border-border rounded-xl p-4 flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-xl text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Search by buyer, product, order ID..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div className="flex gap-2">
          {["All", ...statusOptions].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted border-b border-border">
                  {["Order ID", "Buyer", "Product", "Qty", "Total", "Date", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold text-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No orders found.</td></tr>
                )}
                {filtered.map((o) => {
                  const sc = statusConfig[o.status];
                  return (
                    <tr key={o._id} className="border-b border-border hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-4 font-semibold text-primary">{o.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground">{o.buyer}</div>
                        <div className="text-xs text-muted-foreground">{o.email}</div>
                      </td>
                      <td className="px-5 py-4 text-foreground">{o.product}</td>
                      <td className="px-5 py-4 text-muted-foreground">{o.quantity}</td>
                      <td className="px-5 py-4 font-semibold text-foreground">{o.totalPrice}</td>
                      <td className="px-5 py-4 text-muted-foreground">{o.date}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sc?.cls || 'bg-muted text-muted-foreground'}`}>
                          {sc && <sc.icon className="w-3 h-3" />}
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                            className="text-xs rounded-lg border border-input bg-background px-2 py-1.5 text-foreground focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                          >
                            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <button
                            onClick={() => confirmDelete(o)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-card rounded-2xl border border-input shadow-2xl w-200 max-w-sm p-7"
            style={{ maxWidth: "50%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground text-center mb-1">Delete Order</h3>
            <p className="text-muted-foreground text-sm text-center mb-6">
              Are you sure you want to delete order <span className="font-semibold text-foreground">{deleteTarget.id}</span>? <br></br> This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={deleteOrder}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
