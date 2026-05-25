import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapPin, User, ArrowLeft, Plus, Minus, ShoppingCart, LogIn, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { productApi } from "../api/services/productApi";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  // Re-fetch product when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      console.log("Product detail page focused, refetching...");
      fetchProductDetail();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts();
      const productData = response.data.list || [];
      
      // Find the product by ID (convert to string for comparison)
      const foundProduct = productData.find((p) => p._id === id);
      
      if (foundProduct) {
        const location = foundProduct.farmer?.address && foundProduct.farmer?.city && foundProduct.farmer?.state 
          ? `${foundProduct.farmer.address}, ${foundProduct.farmer.city}, ${foundProduct.farmer.state}` 
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
          farmer: foundProduct.farmer?.farmerName || foundProduct.farmerName || "Unknown Farmer",
          location: location,
        };
        setProduct(transformedProduct);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => q + 1);

  const handleBuyNow = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/booking?productId=${product.id}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-padding">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <button onClick={() => navigate("/products")} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full rounded-xl overflow-hidden shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <span className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded inline-block">
                {product.category}
              </span>
            </div>
            <h1 className="section-title text-foreground mb-4">{product.name}</h1>

            <div className="text-4xl font-bold text-primary mb-6">₹ {product.price}/Kg</div>

            <p className="text-muted-foreground text-lg mb-8">{product.description}</p>

            {/* Farmer and Location Info */}
            <div className="bg-card rounded-lg p-6 mb-8 border border-input">
              <h3 className="font-heading font-bold text-foreground mb-4">Farmer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Farmer</p>
                    <p className="font-semibold">{product.farmer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{product.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Select Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  id="qty-decrease"
                  onClick={decrease}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  id="qty-value"
                  className="text-2xl font-bold text-foreground w-12 text-center"
                >
                  {quantity}
                </span>
                <button
                  id="qty-increase"
                  onClick={increase}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-muted-foreground text-sm ml-2">kg</span>
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">₹ {(product.price * quantity).toFixed(2)}</span>
              </div>
              <p className="text-sm text-foreground font-bold mt-2">₹{product.price}/Kg × {quantity} Kg</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                id="buy-now-btn"
                onClick={handleBuyNow}
                className="btn-primary text-center flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </button>
              <button
                onClick={() => navigate("/products")}
                className="btn-primary text-center flex-1"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Login Required Modal ── */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl border border-input w-full max-w-sm p-8 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <LogIn className="w-7 h-7 text-primary" />
            </div>

            <h3 className="text-xl font-bold text-foreground text-center mb-2">
              Login Required
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-6">
              Please log in to place an order. Your selected product and quantity will be saved.
            </p>

            {/* Product reminder */}
            <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6">
              <ShoppingCart className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">₹{product.price}/Kg × {quantity} Kg = ₹{(product.price * quantity).toFixed(2)}</p>
              </div>
            </div>

            <Link
              id="login-to-buy-btn"
              to={`/login?redirect=/booking?productId=${product.id}%26quantity=${quantity}`}
              className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
            >
              <LogIn className="w-4 h-4" />
              Login to Continue
            </Link>
            <button
              onClick={() => setShowLoginModal(false)}
              className="btn-primary w-full text-center"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
