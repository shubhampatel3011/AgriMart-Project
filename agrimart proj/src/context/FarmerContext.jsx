import { createContext, useState, useEffect } from "react";
import { farmerApi } from "@/api/services/farmerApi";

export const FarmerContext = createContext();

const FARMER_STORAGE_KEY = "agrimart_farmer";

export const FarmerContextProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize by restoring from sessionStorage
  useEffect(() => {
    try {
      const storedFarmer = sessionStorage.getItem(FARMER_STORAGE_KEY);
      if (storedFarmer) {
        setFarmer(JSON.parse(storedFarmer));
      }
      // Start with no products
      setProducts([]);
    } catch (err) {
      setError("Failed to load farmer data");
      setProducts([]);
      sessionStorage.removeItem(FARMER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (farmerData) => {
    setFarmer(farmerData);
    sessionStorage.setItem(FARMER_STORAGE_KEY, JSON.stringify(farmerData));
    setError(null);
  };

  const logout = () => {
    setFarmer(null);
    setProducts([]);
    sessionStorage.removeItem(FARMER_STORAGE_KEY);
    setError(null);
  };

  const updateFarmer = async (farmerData) => {
    if (!farmer) {
      setError("No farmer logged in");
      return false;
    }
    
    try {
      // Call backend API to update farmer
      const response = await farmerApi.updateFarmers(farmer._id || farmer.id, farmerData);
      
      // Update local state with the response from backend
      const updatedFarmer = {
        ...farmer,
        ...response.data.data,
      };

      setFarmer(updatedFarmer);
      sessionStorage.setItem(FARMER_STORAGE_KEY, JSON.stringify(updatedFarmer));
      setError(null);
      return true;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update profile";
      setError(errorMsg);
      console.error("Error updating farmer profile:", err);
      return false;
    }
  };

  const addProduct = async (productData) => { 
    try {
      const response = await productApi.addProduct(productData);
      const newProduct = response.data.data;

      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error("Add product error:", error);
    }
  };

  const updateProduct = (productId, updatedProduct) => {
    const updatedProducts = products.map(p => p._id === productId ? { ...p, ...updatedProduct } : p);
    setProducts(updatedProducts);
  };

  const deleteProduct = async (id) => {
    try {
      await productApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <FarmerContext.Provider value={{
      farmer,
      products,
      loading,
      error,
      login,
      logout,
      updateFarmer,
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </FarmerContext.Provider>
  );
};
