import { User, Mail, Phone, Edit, ShieldCheck, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/services/orderApi";

const Profile = () => {
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    username: "",
  });

  // Fetch user's orders on component mount or when user changes
  useEffect(() => {
    if (user && user._id) {
      fetchUserOrders();
    } else {
      setOrdersLoading(false);
    }
  }, [user]);

  // Re-fetch orders when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      if (user && user._id) {
        console.log("Profile page focused, refetching orders...");
        fetchUserOrders();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      console.log("Fetching orders for user:", user._id);

      const response = await orderApi.getUserOrders(user._id);
      const ordersData = response.data.data || [];

      console.log("Fetched orders:", ordersData);

      // Transform orders data for display
      const transformedOrders = ordersData.map((order) => {
        // Map orderStatus number to readable status
        const statusMap = {
          0: "Processing",
          1: "Accepted",
          2: "Rejected",
          3: "Cancelled",
        };

        return {
          id: `#${order._id.slice(-6).toUpperCase()}`,
          product: order.productName,
          qty: `${order.quantity} kg`,
          date: new Date(order.orderDate).toLocaleDateString(),
          status: statusMap[order.orderStatus] || "Processing",
          _id: order._id,
          orderStatus: order.orderStatus,
          totalPrice: order.totalPrice,
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      // Don't show error toast on initial load, silently fail
      if (ordersLoading === false) {
        toast.error("Failed to fetch orders");
      }
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId, orderProduct) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete the order for "${orderProduct}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setOrdersLoading(true);
      console.log("Deleting order:", orderId);

      await orderApi.deleteOrders(orderId);

      toast.success("Order deleted successfully!");
      
      // Refresh orders list
      await fetchUserOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      
      let errorMsg = "Failed to delete order. Please try again.";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      toast.error(errorMsg);
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.name || user.Name || "",
        email: user.email || "",
        mobile: user.mobile || user.phone || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error updating profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl font-bold">Please login to view your profile.</h2>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container mx-auto max-w-5xl">
        <h2 className="section-title text-foreground">My <span className="text-primary">Profile</span></h2>
  
        {/* Profile Card */}
        <div className="bg-card rounded-xl shadow-lg p-8 mb-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 justify-center md:justify-start">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg border border-border hover:bg-muted font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-heading font-bold text-2xl text-foreground">{user.name || user.Name}</h3>
                <div className="flex flex-col md:flex-row gap-3 mt-2 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1 justify-center md:justify-start">
                    <Mail className="w-4 h-4" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1 justify-center md:justify-start">
                    <Phone className="w-4 h-4" /> {user.mobile || "No mobile added"}
                  </span>
                  <span className="flex items-center gap-1 justify-center md:justify-start">
                    <User className="w-4 h-4" /> @{user.username}
                  </span>
                  <span className="flex items-center gap-1 justify-center md:justify-start">
                    <ShieldCheck className="w-4 h-4" /> Buyer
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn-primary flex items-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          )}
        </div>

      {/* Order History */}
      <div className="bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-heading font-bold text-xl text-foreground">Order History</h3>
          <p className="text-muted-foreground text-sm mt-1">{orders.length} order(s)</p>
        </div>
        {ordersLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-muted-foreground text-lg font-medium">No orders yet</p>
            <p className="text-muted-foreground text-sm">Start ordering fresh products from our farmers</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  {["Order ID", "Product", "Quantity", "Date", "Status", "Action"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-primary">{o.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{o.product}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{o.qty}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{o.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        o.status === "Delivered" ? "bg-emerald-500/10 text-emerald-600" :
                        o.status === "Accepted" ? "bg-blue-500/10 text-blue-600" :
                        o.status === "Processing" ? "bg-amber-500/10 text-amber-600" :
                        "bg-red-500/10 text-red-600"
                      }`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {o.status === "Processing" ? (
                          <button
                            onClick={() => navigate(`/edit-order/${o._id}`)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Cannot edit</span>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(o._id, o.product)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;
