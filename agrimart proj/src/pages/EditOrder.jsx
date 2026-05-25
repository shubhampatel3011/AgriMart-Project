import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { orderApi } from "../api/services/orderApi";

const EditOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const [form, setForm] = useState({
    quantity: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  // Load order data on mount
  useEffect(() => {
    if (!user || !user._id) {
      setPageLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        console.log("Loading order with ID:", orderId);

        const response = await orderApi.getOrderById(orderId);
        const orderData = response?.data?.data;

        console.log("Fetched order:", orderData);

        if (orderData) {
          // Only allow editing if order status is "Processing" (0)
          if (orderData.orderStatus !== 0) {
            toast.error("This order can no longer be edited");
            navigate("/profile");
            return;
          }

          setOrder(orderData);
          setForm({
            quantity: orderData.quantity,
            address: {
              line1: orderData.address?.line1 || "",
              line2: orderData.address?.line2 || "",
              city: orderData.address?.city || "",
              state: orderData.address?.state || "",
              pincode: orderData.address?.pincode || "",
            },
          });
          setPageLoading(false);
        } else {
          toast.error("Order not found");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error(error.response?.data?.message || "Failed to load order");
        navigate("/profile");
      }
    };

    loadOrder();
  }, [orderId, user, navigate]);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const setAddressField = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: e.target.value },
    }));
  };

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(1, form.quantity + delta);
    setForm((prev) => ({ ...prev, quantity: newQty }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (form.quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    if (!form.address.line1.trim()) {
      toast.error("Address line 1 is required");
      return;
    }
    if (!form.address.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!form.address.state.trim()) {
      toast.error("State is required");
      return;
    }
    if (!/^\d{6}$/.test(form.address.pincode)) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      console.log("%c🔄 Updating Order", "color: #3b82f6; font-weight: bold;");
      console.log("Order ID:", orderId);

      // Prepare update data
      const updateData = {
        quantity: Number(form.quantity),
        address: {
          line1: form.address.line1.trim(),
          line2: form.address.line2.trim() || "",
          city: form.address.city.trim(),
          state: form.address.state.trim(),
          pincode: form.address.pincode.trim(),
        },
        // Recalculate total price
        totalPrice: Number((order.productPrice * form.quantity).toFixed(2)),
      };

      console.log("Update data:", updateData);

      const response = await orderApi.updateOrders(orderId, updateData);

      console.log("%c✅ Order Updated Successfully", "color: #22c55e; font-weight: bold;");
      console.log("Updated order:", response.data.data);

      toast.success("Order updated successfully!");

      // Redirect to profile after 1 second
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none transition-colors";

  if (!user || !user._id) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl font-bold">Please login to edit your order.</h2>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto section-padding">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Edit Order</h1>
              <p className="text-green-50 text-lg">Update your order details</p>
            </div>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardContent className="pt-8 text-center py-16">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading order...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
      </div>
    );
  }

  const totalPrice = (order.productPrice * form.quantity).toFixed(2);

  return (
    <div className="space-y-8 max-w-2xl mx-auto section-padding">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold">Edit Order</h1>
            <p className="text-blue-50 text-lg">Update quantity and delivery address</p>
          </div>
        </div>
      </div>

      {/* Order Details Card */}
      <Card className="shadow-lg">
        <CardContent className="pt-8">
          {/* Order Summary */}
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">Order #{order._id?.slice(-6).toUpperCase()}</p>
            <p className="font-semibold text-lg text-foreground">{order.productName}</p>
            <p className="text-sm text-muted-foreground mt-1">₹{order.productPrice}/kg</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity Section */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-3">
                Quantity (kg) *
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-2xl font-bold text-foreground w-12 text-center">
                  {form.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-muted-foreground text-sm mr-auto">kg</span>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="text-foreground font-bold text-lg">
                      ₹{totalPrice}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">Delivery Address</h3>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={form.address.line1}
                  onChange={setAddressField("line1")}
                  placeholder="e.g., 32/B, Kachhi Society"
                  className={inputCls}
                />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Address Line 2 (optional)
                </label>
                <input
                  type="text"
                  value={form.address.line2}
                  onChange={setAddressField("line2")}
                  placeholder="e.g., Near Market Yard"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    City / District *
                  </label>
                  <input
                    type="text"
                    value={form.address.city}
                    onChange={setAddressField("city")}
                    placeholder="e.g., Himatnagar"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    value={form.address.state}
                    onChange={setAddressField("state")}
                    placeholder="e.g., Gujarat"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={form.address.pincode}
                  onChange={setAddressField("pincode")}
                  placeholder="e.g., 383001"
                  maxLength={6}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-4">
              <p className="text-xs text-green-900 dark:text-green-300">
                <strong>ℹ️ Note:</strong> You can only edit orders that are in Processing status. Once accepted, orders cannot be modified.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Updating..." : "Update Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditOrder;
