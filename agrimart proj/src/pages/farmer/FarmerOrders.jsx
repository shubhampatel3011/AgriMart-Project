import { useContext, useState, useEffect } from "react";
import { FarmerContext } from "@/context/FarmerContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, TrendingUp, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { orderApi } from "../../api/services/orderApi";

const FarmerOrders = () => {
  const { farmer } = useContext(FarmerContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Status mapping
  const statusMap = {
    0: { label: "Processing", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    1: { label: "Accepted", color: "bg-green-100 text-green-800", icon: CheckCircle },
    2: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
    3: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: XCircle },
  };

  useEffect(() => {
    if (farmer && farmer._id) {
      console.log("Farmer ID:", farmer._id);
      fetchFarmerOrders();
    }
  }, [farmer]);

  // Re-fetch orders when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      if (farmer && farmer._id) {
        console.log("Page focused, refetching orders...");
        fetchFarmerOrders();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [farmer]);

  const fetchFarmerOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders for farmer:", farmer._id);

      const response = await orderApi.getFarmerOrders(farmer._id);
      const ordersData = response.data?.data || [];

      console.log("Fetched farmer orders:", ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching farmer orders:", error);
      toast.error(error.response?.data?.error || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      console.log("Updating order status:", orderId, "to", newStatus);

      const response = await orderApi.updateOrders(orderId, {
        orderStatus: Number(newStatus),
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: Number(newStatus) }
            : order
        )
      );

      toast.success(`Order ${newStatus === 1 ? "accepted" : "rejected"} successfully`);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.orderStatus === Number(filterStatus);
  });

  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.orderStatus === 0).length,
    accepted: orders.filter((o) => o.orderStatus === 1).length,
    rejected: orders.filter((o) => o.orderStatus === 2).length,
  };

  if (!farmer || !farmer._id) {
    return (
      <div className="section-padding text-center py-16">
        <h2 className="text-2xl font-bold text-foreground">Please login to view orders</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
        </div>
        <p className="text-muted-foreground">Manage orders for your products</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-yellow-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-yellow-700">Processing</p>
              <p className="text-3xl font-bold text-yellow-700">{stats.processing}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-green-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700">Accepted</p>
              <p className="text-3xl font-bold text-green-700">{stats.accepted}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-red-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-700">Rejected</p>
              <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Filter by status:</span>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="0">Processing</SelectItem>
            <SelectItem value="1">Accepted</SelectItem>
            <SelectItem value="2">Rejected</SelectItem>
            <SelectItem value="3">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading ? (
        <Card className="shadow-lg">
          <CardContent className="pt-8 text-center py-16">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              <span className="text-muted-foreground">Loading orders...</span>
            </div>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="pt-8 text-center py-16">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {filterStatus === "all"
                ? "You don't have any orders yet"
                : `No ${statusMap[filterStatus]?.label.toLowerCase()} orders`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = statusMap[order.orderStatus]?.icon || Clock;
            return (
              <Card key={order._id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left side - Order Info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          ORDER ID
                        </p>
                        <p className="text-sm font-mono text-foreground">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          PRODUCT
                        </p>
                        <p className="font-semibold text-foreground">
                          {order.productId?.name || order.productName}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{order.productPrice}/kg
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            QUANTITY
                          </p>
                          <p className="text-lg font-bold text-foreground">
                            {order.quantity} <span className="text-xs font-normal">kg</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            TOTAL PRICE
                          </p>
                          <p className="text-lg font-bold text-green-600">₹{order.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Customer & Status */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          CUSTOMER NAME
                        </p>
                        <p className="font-semibold text-foreground">{order.Name}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          MOBILE
                        </p>
                        <p className="font-semibold text-foreground">{order.mobile}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          ORDER DATE
                        </p>
                        <p className="text-sm text-foreground">
                          {new Date(order.orderDate).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">
                          STATUS
                        </p>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                            statusMap[order.orderStatus]?.color
                          }`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusMap[order.orderStatus]?.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-4"></div>

                  {/* Delivery Address */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      DELIVERY ADDRESS
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm">
                      <p className="text-foreground">
                        {order.address?.line1}
                        {order.address?.line2 && `, ${order.address.line2}`}
                      </p>
                      <p className="text-muted-foreground">
                        {order.address?.city}, {order.address?.state} {order.address?.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.orderStatus === 0 && (
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleStatusUpdate(order._id, 2)
                        }
                        disabled={updating === order._id}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        {updating === order._id ? "Rejecting..." : "Reject Order"}
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() =>
                          handleStatusUpdate(order._id, 1)
                        }
                        disabled={updating === order._id}
                      >
                        {updating === order._id ? "Accepting..." : "Accept Order"}
                      </Button>
                    </div>
                  )}

                  {order.orderStatus !== 0 && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Order status cannot be changed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
