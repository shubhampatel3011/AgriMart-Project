import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useUser } from "@/context/UserContext";
import { productApi } from "../api/services/productApi";

const categories = ["All", "Vegetables", "Fruits", "Grains"];

const Products = () => {
  const { product } = useUser();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
    const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Re-fetch products when page comes into focus
  useEffect(() => {
    const handleFocus = () => {
      console.log("Products page focused, refetching...");
      fetchProducts();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getProducts();

      const productData = response.data.list || [];

      // Transform backend data to match component structure
      const transformedProducts = productData.map((product) => {
        const location = product.farmer?.address && product.farmer?.city && product.farmer?.state 
          ? `${product.farmer.address}, ${product.farmer.city}, ${product.farmer.state}` 
          : product.location || "Unknown Location";
        
        console.log("Product:", product.name, {
          farmerCity: product.farmer?.city,
          farmerState: product.farmer?.state,
          productLocation: product.location,
          finalLocation: location,
        });

        return {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category: product.category,
          image: product.productImage || "/placeholder-image.png",
          farmer: product.farmer?.farmerName || product.farmerName || "Unknown Farmer",
          location: location,
        };
      });
      console.log("Transformed Products:", transformedProducts);

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error while fetching the products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="section-padding">
      <div className="container mx-auto">
        <h2 className="section-title text-foreground">Our <span className="text-primary">Products</span></h2>
        <p className="section-subtitle">Browse fresh agricultural products from verified farmers</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  category === c ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-input hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">No products found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
