import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FarmerContext } from "@/context/FarmerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, User, ShoppingCart } from "lucide-react";
import { productApi } from "@/api/services/productApi";

const FarmerDashboard = () => {
  const { farmer } = useContext(FarmerContext);
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);

  console.log("Farmer Data:", farmer);

  // Fetch farmer's products count
  const fetchProductsCount = async () => {
    try {
      if (!farmer || !farmer._id) return;
      
      const response = await productApi.getFarmerProducts(farmer._id);
      const products = response.data?.data || [];
      setProductCount(products.length);
      
      console.log("Fetched farmer products count:", products.length);
    } catch (error) {
      console.error("Error fetching products count:", error);
      setProductCount(0);
    }
  };

  // Fetch products count on mount and when farmer changes
  useEffect(() => {
    fetchProductsCount();
  }, [farmer]);

  // Refetch products count when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      if (farmer && farmer._id) {
        console.log("Dashboard focused, refetching product count...");
        fetchProductsCount();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [farmer]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {farmer?.farmerName} !👋
        </h1>
        <p className="text-emerald-50 text-lg">
          Manage your farm and products from your dashboard
        </p>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Account Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600 mb-1">
              Approved ✓
            </p>
            <p className="text-sm text-muted-foreground">
              Your account is verified and active
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Contact Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {farmer?.contactNo}
            </p>
            <p className="text-sm text-muted-foreground">
              Phone number on file
            </p>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Email Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-emerald-600 mb-1 truncate">
              {farmer?.email}
            </p>
            <p className="text-sm text-muted-foreground">Account email</p>
          </CardContent>
        </Card>

        {/* Products Count */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600 mb-1">
              {productCount}
            </p>
            <p className="text-sm text-muted-foreground">Active products</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* My Products */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              My Products
            </h3>
            <p className="text-sm text-muted-foreground mb-6 mt-3">
              View and manage your products
            </p>
            <Button
              onClick={() => navigate("/farmer/products")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2"
            >
              View Products
            </Button>
          </CardContent>
        </Card>

        {/* Add Product */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Add Product
            </h3>
            <p className="text-sm text-muted-foreground mb-6 mt-3">
              Add a new product to sell
            </p>
            <Button
              onClick={() => navigate("/farmer/products/add")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2"
            >
              Add Product
            </Button>
          </CardContent>
        </Card>

        {/* My Orders */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              My Orders
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage customer orders for your products
            </p>
            <Button
              onClick={() => navigate("/farmer/orders")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              View Orders
            </Button>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Profile</h3>
            <p className="text-sm text-muted-foreground mb-6 mt-3">
              Update your profile details
            </p>
            <Button
              onClick={() => navigate("/farmer/profile")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;
