import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FarmerContext } from "@/context/FarmerContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { productApi } from "@/api/services/productApi";

const FarmerEditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { farmer, updateProduct } = useContext(FarmerContext);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "Vegetables",
    image: null,
  });

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Seeds",
    "Dairy",
    "Spices",
    "Herbs",
    "Other",
  ];

  // Load product data on mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Wait for farmer to be available
        if (!farmer || !farmer._id) {
          console.warn("Farmer data not available yet");
          setPageLoading(false);
          return;
        }

        console.log("Loading product with ID:", productId, "for farmer:", farmer._id);

        const response = await productApi.getFarmerProducts(farmer._id);
        const products = response?.data?.data || [];

        console.log("Fetched products:", products);

        const product = products.find(
          (p) => String(p._id) === String(productId),
        );

        if (product) {
          console.log("Product found:", product);
          setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            quantity: product.quantity || "",
            category: product.category || "Vegetables",
            image: null,
          });
          setPreview(product.productImage || null);
          setPageLoading(false);
        } else {
          console.warn("Product not found with ID:", productId);
          toast.error("Product not found");
          setPageLoading(false);
          navigate("/farmer/products");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error(error.response?.data?.message || "Failed to load product");
        setPageLoading(false);
      }
    };

    // Only load if farmer is available
    if (farmer && farmer._id) {
      loadProduct();
    }
  }, [productId, farmer, navigate]);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, GIF, and WebP images are allowed");
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!form.price || form.price <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!form.quantity || form.quantity <= 0) {
      toast.error("Valid quantity is required");
      return;
    }
    if (!preview) {
      toast.error("Product image is required");
      return;
    }

    try {
      setLoading(true);

      console.log("%c🚜 Updating Product", "color: #3b82f6; font-weight: bold;");
      console.log("Product Name:", form.name);

      // Prepare JSON data (not FormData for now)
      const updateData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        category: form.category,
        productImage: preview, // Send the current preview/image URL
      };
      
      // Update product via API
      const response = await productApi.updateProducts(productId, updateData);

      console.log("%c✅ Product Updated Successfully", "color: #22c55e; font-weight: bold;");
      console.log("Product ID:", productId);
      console.log("Updated product:", response.data.data);

      // Update the product in FarmerContext so it reflects everywhere
      const updatedProduct = response.data.data;
      updateProduct(productId, updatedProduct);
      
      toast.success("Product updated successfully!");

      // Redirect to products page after 1 second
      setTimeout(() => navigate("/farmer/products"), 1000);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none transition-colors";

  // Handle case where farmer is not loaded yet
  if (!farmer || !farmer._id) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Edit Product</h1>
              <p className="text-emerald-50 text-lg">Update your agricultural product details</p>
            </div>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardContent className="pt-8 text-center py-16">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
              <span className="text-muted-foreground">Loading farmer data...</span>
              <p className="text-xs text-muted-foreground mt-2">Please wait while we load your information</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Edit Product</h1>
              <p className="text-emerald-50 text-lg">Update your agricultural product details</p>
            </div>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardContent className="pt-8 text-center py-16">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
              <span className="text-muted-foreground">Loading product...</span>
              <p className="text-xs text-muted-foreground mt-2">Fetching product details from server</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/farmer/products")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold">Edit Product</h1>
            <p className="text-emerald-50 text-lg">Update your agricultural product details</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="shadow-lg">
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name, Price, Quantity, Category */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="e.g., Organic Tomatoes"
                  className={inputCls}
                />
              </div>

              {/* Price and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Price per kg (₹) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={setField("price")}
                    placeholder="50"
                    min="0"
                    step="0.01"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Quantity (kg) *
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={setField("quantity")}
                    placeholder="100"
                    min="0"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={setField("category")}
                  className={inputCls}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={setField("description")}
                placeholder="Describe your product details, quality, and benefits..."
                rows="5"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Image Upload Section */}
            <div className="border-t border-border pt-6">
              <label className="block text-xs font-semibold text-foreground mb-3">
                Product Image *
              </label>
              {preview && (
                <div className="mb-4 relative">
                  <img
                    src={preview}
                    alt="Product"
                    className="w-full h-64 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                <div className="text-center">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <span className="text-sm font-medium text-foreground">Update Product Image</span>
                  <span className="text-xs text-muted-foreground block mt-1">
                    JPG, PNG, GIF, WebP up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Info Box */}
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg p-4">
              <p className="text-xs text-emerald-900 dark:text-emerald-300">
                <strong>💡 Tip:</strong> Keep your product information up-to-date to attract more customers.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/farmer/products")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerEditProduct;
