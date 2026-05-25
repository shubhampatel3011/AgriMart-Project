import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { productApi } from "../api/services/productApi";
import { orderApi } from "../api/services/orderApi";
import {
  User,
  Phone,
  Plus,
  Minus,
  MapPin,
  Home,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Package,

  ArrowLeft,
  X,
} from "lucide-react";

/* ─── helpers ─── */
const inputClass =
  "w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition";

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-center gap-0 mb-10 select-none">
    {["Order Quantity", "Delivery Address", "Confirm"].map((label, i) => {
      const num = i + 1;
      const active = step === num;
      const done = step > num;
      return (
        <div key={num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${done ? "bg-primary text-white" : active ? "bg-primary text-white ring-4 ring-primary/30" : "bg-muted text-muted-foreground"}`}
            >
              {done ? <CheckCircle2 className="w-5 h-5" /> : num}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${active || done ? "text-primary" : "text-muted-foreground"}`}
            >
              {label}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mx-1 mb-5 transition-all duration-300 ${
                step > i + 1 ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

/* ─── main component ─── */
const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, user } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const productId = searchParams.get("productId");
  const initialQty = Number(searchParams.get("quantity")) || 1;

  // const product = products.find((p) => p.id === productId);
  const [step, setStep] = useState(1);

  const [users, setUsers] = useState([]);

  const [quantity, setQuantity] = useState(initialQty);

  // Fetch product details on component mount or when productId changes
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts();
        const productData = response.data.list || [];

        // Find the product by ID
        const foundProduct = productData.find((p) => p._id === productId);

        if (foundProduct) {
          const location =
            foundProduct.farmer?.city && foundProduct.farmer?.state
              ? `${foundProduct.farmer.city}, ${foundProduct.farmer.state}`
              : foundProduct.location || "Unknown Location";

          console.log("Found Product:", foundProduct.name, {
            farmerCity: foundProduct.farmer?.city,
            farmerState: foundProduct.farmer?.state,
            productLocation: foundProduct.location,
            finalLocation: location,
          });

          // Transform the data to match component structure
          const transformedProduct = {
            id: foundProduct._id,
            name: foundProduct.name,
            description: foundProduct.description,
            price: foundProduct.price,
            quantity: foundProduct.quantity,
            category: foundProduct.category,
            image: foundProduct.productImage || "/placeholder-image.png",
            farmer:
              foundProduct.farmer?.farmerName ||
              foundProduct.farmerName ||
              "Unknown Farmer",
            location: location,
          };
          setProduct(transformedProduct);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  const [personal, setPersonal] = useState({
    name: user?.name || user?.Name || "",
    mobile: user?.phone || "",
  });
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* sync user data if user changes */
  useEffect(() => {
    if (user) {
      setPersonal({ 
        name: user.name || user.Name || "", 
        mobile: user.phone || user.mobile || "" 
      });
    }
  }, [user]);

  /* sync qty if URL changes */
  useEffect(() => {
    setQuantity(Math.max(1, Number(searchParams.get("quantity")) || 1));
  }, [searchParams]);

  /* ── Validation ── */
  const validateStep1 = () => {
    // No longer need to validate name/phone here since they come from user profile
    return true;
  };

  const validateStep2 = () => {
    if (!address.line1.trim()) {
      toast.error("Please enter your address line 1.");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }
    if (!address.state.trim()) {
      toast.error("Please enter your state.");
      return false;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Enter a valid 6-digit pincode.");
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    // Validation
    if (!product) {
      toast.error("Product information is missing");
      return;
    }
    if (quantity < 1) {
      toast.error("Please select a quantity");
      return;
    }
    if (!address.line1.trim() || !address.city.trim() || !address.state.trim()) {
      toast.error("Please fill in all address fields");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Enter a valid 6-digit pincode.");
      return;
    }
    if (!user || !user._id) {
      toast.error("Please login to place an order");
      return;
    }
    
    // Validate mobile number
    const mobileStr = String(user.phone || personal.mobile).replace(/\D/g, "");
    if (mobileStr.length !== 10) {
      toast.error("Invalid mobile number. Please provide a valid 10-digit number.");
      return;
    }
    
    // Validate user name
    if (!user.name && !user.Name && !personal.Name) {
      toast.error("User name is required");
      return;
    }

    // Check for duplicate order (same product with Processing status)
    try {
      setLoading(true);
      const userOrdersResponse = await orderApi.getUserOrders(user._id);
      const userOrders = userOrdersResponse.data?.data || [];
      
      // Check if user already has a Processing order for this product
      const duplicateOrder = userOrders.find(
        (order) =>
          String(order.productId?._id || order.productId) ===
            String(product.id) && order.orderStatus === 0,
      );
      
      if (duplicateOrder) {
        toast.error("This product order is already placed");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error checking duplicate orders:", error);
      // Continue anyway if check fails, don't block the user
    }

    try {
      setLoading(true);

      console.log("%c🛒 Placing Order", "color: #3b82f6; font-weight: bold;");

      // Extract numeric price from string (e.g., "₹50.00" → 50)
      const productPrice = parseFloat(String(product.price).replace(/[^0-9.]/g, ""));

      // Get and validate mobile number
      const mobileStr = String(user.phone || personal.mobile).replace(/\D/g, "");

      // Create order object matching backend orderTbl schema
      const newOrder = {
        userId: user._id,
        Name: user.name || user.Name || personal.name,
        email: user.email,
        mobile: user.mobile,
        productId: product.id,
        productName: product.name,
        productPrice: Number(productPrice),
        quantity: Number(quantity),
        totalPrice: Number(total),
        category: product.category,
        // Send address as object (not string) to match schema
        address: {
          line1: address.line1.trim(),
          line2: (address.line2 || "").trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          pincode: address.pincode.trim(),
        },
        orderStatus: 0,
        // Don't send orderDate - backend schema has default: Date.now
      };

      console.log("Order data being sent:", newOrder);

      // API calling to place the order
      const response = await orderApi.createOrders(newOrder);

      console.log(
        "%c✅ Order Placed Successfully",
        "color: #22c55e; font-weight: bold;",
      );
      console.log("Order ID:", response.data?.data?._id);

      toast.success(
        "🎉 Order placed successfully! We'll contact you shortly on " +
          (personal.mobile || user?.phone),
      );

      // Redirect to profile page after 1.5 seconds
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to place order");
      
      // Extract detailed error message from backend
      let errorMsg = "Failed to place the order. Please try again.";
      
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        // Handle validation error array from backend
        errorMsg = error.response.data.details.join(", ");
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      console.error("Detailed error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Price calc ── */
  const priceNum = product
    ? parseFloat(String(product.price).replace(/[^0-9.]/g, ""))
    : 0;
  const currency = product
    ? String(product.price)
        .replace(/[\d.,\s]/g, "")
        .trim() || "₹"
    : "₹";
  const total = (priceNum * quantity).toFixed(2);

  /* ─────────── STEP 1 ─────────── */
  const Step1 = (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground mb-1">
        Confirm Quantity
      </h2>

      {/* Product Name and Price */}
      {product && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 rounded-lg object-cover shrink-0"
          />
          <p className="font-semibold text-xl mt-2 text-primary">
            {product?.name}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {product?.category} · {product?.farmer}
          </p>
          <p className="text-primary font-bold mt-2">{product?.price} / kg</p>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <p className="text-muted-foreground text-sm mb-4">
          How many kilograms would you like to order?
        </p>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Quantity (kg)
        </label>
        <div className="flex items-center gap-4">
          <button
            id="step1-qty-decrease"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span
            id="step1-qty-value"
            className="text-2xl font-bold text-foreground w-12 text-center"
          >
            {quantity}
          </span>
          <button
            id="step1-qty-increase"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-muted-foreground text-sm mr-4">kg</span>
          {product && (
            <div className="ml-auto">
              <p className="text-sm text-muted-foreground">
                Total:{" "}
                <span className="text-foreground font-bold text-lg">
                  {currency} {total}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        id="step1-next"
        onClick={() => validateStep1() && setStep(2)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        Proceed to Delivery Address <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  /* ─────────── STEP 2 ─────────── */
  const Step2 = (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground mb-1">
        Delivery Address
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Where should we deliver your order?
      </p>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="addr-line1"
            className={inputClass + " pl-10"}
            placeholder="e.g. 32/B, Kachhi Society, Khed-Tasiya Road"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          Address Line 2{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          id="addr-line2"
          className={inputClass}
          placeholder="e.g. Near New Market Yard"
          value={address.line2}
          onChange={(e) => setAddress({ ...address, line2: e.target.value })}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1">
            City / District <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="addr-city"
              className={inputClass + " pl-10"}
              placeholder="Himatnagar"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            id="addr-state"
            className={inputClass}
            placeholder="Gujarat"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          Pincode <span className="text-red-500">*</span>
        </label>
        <input
          id="addr-pincode"
          className={inputClass}
          placeholder="383001"
          maxLength={6}
          value={address.pincode}
          onChange={(e) =>
            setAddress({
              ...address,
              pincode: e.target.value.replace(/\D/g, ""),
            })
          }
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep(1)}
          className="btn-primary flex items-center gap-1 flex-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          id="step2-next"
          onClick={() => validateStep2() && setStep(3)}
          className="btn-primary flex items-center justify-center gap-2 flex-1"
        >
          Review Order <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  /* ─────────── STEP 3 (Confirm) ─────────── */
  const Step3 = (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground mb-1">Order Summary</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Review your order before confirming.
      </p>

      {/* Product card */}
      {product && (
        <div className="flex gap-4 bg-primary/5 border border-primary/20 rounded-xl p-4 items-start">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">{product?.name}</p>
            <p className="text-xs text-muted-foreground mb-1">
              {product?.category}
            </p>
            <p className="text-sm">
              {product?.price} × {quantity} kg ={" "}
              <span className="font-bold text-primary">
                {currency} {total}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Details table */}
      <div className="bg-card border border-input rounded-xl overflow-hidden">
        {[
          ["Customer", product?.name || personal.name],
          ["Mobile", user?.mobile],
          [
            "Address",
            [
              address.line1,
              address.line2,
              address.city,
              address.state,
              address.pincode,
            ]
              .filter(Boolean)
              .join(", "),
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 px-5 py-3 border-b border-input last:border-b-0"
          >
            <span className="text-sm text-muted-foreground font-medium">
              {label}
            </span>
            <span className="text-sm text-foreground font-semibold text-right">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => setStep(2)}
          className="btn-primary flex items-center gap-1 flex-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          id="confirm-order-btn"
          onClick={handleConfirm}
          className="btn-primary flex items-center justify-center gap-2 flex-1"
        >
          <CheckCircle2 className="w-4 h-4" /> Confirm Order
        </button>
      </div>
    </div>
  );

  return (
    <div className="section-padding">
      <div className="container mx-auto max-w-xl">
        {/* ── Cancel / Back to Product ── */}
        <div className="flex items-center justify-between mb-6">
          <button
            id="back-to-product-btn"
            onClick={() =>
              productId
                ? navigate(`/products/${productId}`)
                : navigate("/products")
            }
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Product
          </button>

          <button
            id="cancel-order-btn"
            onClick={() => navigate("/products")}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all font-medium"
          >
            <X className="w-4 h-4" />
            Cancel Order
          </button>
        </div>

        <div className="text-center mb-2">
          <h1 className="section-title text-foreground">
            Place Your <span className="text-primary">Order</span>
          </h1>
          <p className="section-subtitle">Fresh from farm to your door</p>
        </div>

        <StepIndicator step={step} />

        <div className="bg-card rounded-2xl shadow-lg p-6 sm:p-8 border border-input">
          {step === 1 && Step1}
          {step === 2 && Step2}
          {step === 3 && Step3}
        </div>
      </div>
    </div>
  );
};

export default Booking;
