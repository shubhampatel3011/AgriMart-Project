import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FarmerContext } from "@/context/FarmerContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Edit, Package } from "lucide-react";
import { toast } from "sonner";
import { productApi } from "../../api/services/productApi";

const FarmerProducts = () => {
  const navigate = useNavigate();
  const { farmer } = useContext(FarmerContext);
  const [products, setProducts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (farmer && farmer._id) {
      console.log("Farmer ID:", farmer._id);
      fetchProducts();
    } else {
      console.warn("Farmer not loaded or farmer._id missing:", farmer);
    }
  }, [farmer]);

  // Re-fetch products when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      if (farmer && farmer._id) {
        console.log("Page focused, refetching products...");
        fetchProducts();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [farmer]);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getFarmerProducts(farmer._id);

      const productData = response.data.data || [];

      // Transform backend data to match component structure
      const transformedProducts = productData.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
        addedBy: product.farmerName || "Unknown Farmer",
        location: product.location || "Unknown Location",
        image: product.productImage || "/placeholder-image.png",
      }));
      // console.log(transformedProducts);

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error while fetching the products:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to fetch products");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productApi.deleteProducts(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/farmer")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Products</h1>
            <p className="text-muted-foreground">Manage your agricultural products</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate("/farmer/products/add")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Package className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-semibold text-muted-foreground mb-2">No Products Yet</p>
            <p className="text-sm text-muted-foreground mb-6">Start by adding your first product</p>
            <Button 
              onClick={() => navigate("/farmer/products/add")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="h-40 bg-muted overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <CardContent className="pt-4">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>

                {/* Product Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price per kg:</span>
                    <span className="font-bold text-emerald-600">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Quantity:</span>
                    <span className="font-semibold">{product.quantity} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="text-sm text-foreground">{product.location}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/farmer/products/${product.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {deleteConfirm === product.id ? (
                    <div className="flex-1 flex gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDelete(product.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => setDeleteConfirm(product.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProducts;
