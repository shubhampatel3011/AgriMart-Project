import { useState, useEffect } from "react";
import { Pencil, Trash2, Search, X, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { productApi } from "../../api/services/productApi";

const categories = ["Vegetables", "Fruits", "Grains"];

const emptyForm = () => ({
  image: "",
  name: "",
  price: "",
  category: "Vegetables",
  description: "",
  farmer: "",
  location: "",
});

const AdminProducts = () => {
  const { products: items, updateProduct, deleteProduct } = useUser();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [products, setProducts] = useState([]);

  const filtered = products.filter((p) => {
    // debugger;
    const matchSearch =
      p.name.toLowerCase().includes(search) 
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getProducts();

      const productData = response.data.list || [];

      // Transform backend data to match component structure
      const transformedProducts = productData.map((product) => ({
        id: product._id, // important for key
        image: product.productImage || "/placeholder-image.png",
        name: product.name,
        price: product.price,
        Quantity: product.Quantity,
        category: product.category,
        farmer: product.farmerName || "Unknown Farmer",
        location: product.location || "Unknown Location",
      }));
      console.log(transformedProducts);

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error while fetching the products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      farmer: p.farmer,
      location: p.location,
    });
    setImagePreview(p.image || null);
    setModal("edit");
  };
  const closeModal = () => {
    setModal(null);
    setEditTarget(null);
    setImagePreview(null);
  };

  const setField = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setForm((f) => ({ ...f, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.farmer || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }
    if (modal === "edit" && editTarget) {
      updateProduct(editTarget.id, form);
      toast.success("Product updated successfully!");
    }
    closeModal();
  };

   const handleDelete = async () => {
    try {
      await productApi.deleteProducts(deleteId);
      toast.success("Product deleted successfully");
      // Refresh the product list from the backend
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteId(null);
    }
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-foreground">
            Products
          </h2>
          <p className="text-muted-foreground text-sm">
            {items.length} products listed
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search products or farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex gap-2">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${catFilter === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b border-border">
                {[
                  "Product",
                  "Category",
                  "Price/Kg",
                  "Farmer",
                  "Location",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No products found.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border hover:bg-muted/40 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <span className="font-semibold text-foreground">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {p.price}/Kg
                  </td>
                  <td className="px-5 py-4 text-foreground">{p.farmer}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {p.location}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-foreground">
                Edit Product
              </h3>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Product Image
                </label>
                <div className="relative">
                  {imagePreview && (
                    <div className="mb-3 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, image: "" }));
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground mb-2" />
                    <span className="text-sm font-semibold text-foreground">
                      Click to upload image
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, GIF (max 2MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Product Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={setField("name")}
                    className={inputCls}
                    placeholder="e.g. Fresh Tomatoes"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Price/Kg *
                  </label>
                  <input
                    value={form.price}
                    onChange={setField("price")}
                    className={inputCls}
                    placeholder="e.g. ₹40/kg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Farmer Name *
                  </label>
                  <input
                    value={form.farmer}
                    onChange={setField("farmer")}
                    className={inputCls}
                    placeholder="e.g. Rajesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Location *
                  </label>
                  <input
                    value={form.location}
                    onChange={setField("location")}
                    className={inputCls}
                    placeholder="e.g. Punjab"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={setField("category")}
                  className={inputCls}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={setField("description")}
                  className={`${inputCls} h-24 resize-none`}
                  placeholder="Short product description..."
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-border p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-2">
              Delete Product?
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
