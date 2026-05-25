import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { AdminContextProvider } from "./context/AdminContext";
import { UserContextProvider } from "./context/UserContext";
import { FarmerContextProvider } from "./context/FarmerContext";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminFarmers from "./pages/admin/AdminFarmers";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminUsers from "./pages/admin/AdminUsers";
import FarmerRoute from "./components/farmer/FarmerRoute";
import FarmerLayout from "./components/farmer/FarmerLayout";
import FarmerLogin from "./pages/farmer/FarmerLogin";
import FarmerRegister from "./pages/farmer/FarmerRegister";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import FarmerAddProduct from "./pages/farmer/FarmerAddProduct";
import FarmerEditProduct from "./pages/farmer/FarmerEditProduct";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import EditOrder from "./pages/EditOrder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminContextProvider>
      <UserContextProvider>
        <FarmerContextProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Admin login – no Navbar/Footer */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Farmer login and registration – no Navbar/Footer */}
                <Route path="/farmer/login" element={<FarmerLogin />} />
                <Route path="/farmer/register" element={<FarmerRegister />} />

                {/* Protected admin routes */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminLayout>
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="farmers" element={<AdminFarmers />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="feedback" element={<AdminFeedback />} />
                        </Routes>
                      </AdminLayout>
                    </AdminRoute>
                  }
                />

                {/* Protected farmer routes */}
                <Route
                  path="/farmer/*"
                  element={
                    <FarmerRoute>
                      <FarmerLayout>
                        <Routes>
                          <Route path="/" element={<FarmerDashboard />} />
                          <Route path="products" element={<FarmerProducts />} />
                          <Route path="products/add" element={<FarmerAddProduct />} />
                          <Route path="products/:productId" element={<FarmerEditProduct />} />
                          <Route path="profile" element={<FarmerProfile />} />
                          <Route path="orders" element={<FarmerOrders />} />
                        </Routes>
                      </FarmerLayout>
                    </FarmerRoute>
                  }
                />

                {/* Public site routes */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar />
                      <main className="min-h-screen">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:id" element={<ProductDetail />} />
                          <Route path="/booking" element={<Booking />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/edit-order/:orderId" element={<EditOrder />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/feedback" element={<Feedback />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FarmerContextProvider>
      </UserContextProvider>
    </AdminContextProvider>
  </QueryClientProvider>
);

export default App;
