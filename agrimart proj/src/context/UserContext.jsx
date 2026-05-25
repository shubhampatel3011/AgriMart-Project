import { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts } from "@/data/products";
import { userApi } from "@/api/services/userApi";

const UserContext = createContext(null);
const USER_STORAGE_KEY = "agrimart_user";

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to restore user session:", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (usernameOrEmail, password, userData = null) => {
    // If userData provided from API, use it; otherwise create mock userData
    if (usernameOrEmail && password) {
      let newUserData;
      
      if (userData) {
        // Use backend userData and ensure all properties are preserved
        newUserData = {
          ...userData,
          // Normalize Name to name for consistency
          name: userData.Name || userData.name || userData.username,
          username: userData.username || userData.name || userData.Name,
        };
      } else {
        // Fallback for mock data
        newUserData = { 
          email: usernameOrEmail, 
          name: usernameOrEmail.split("@")[0], 
          username: usernameOrEmail.split("@")[0] 
        };
      }
      
      setUser(newUserData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUserData));
      return true;
    }
    return false;
  };

  const register = (userData) => {
    // Registration would normally persist to backend
    return true;
  };

  const updateProfile = async (updatedData) => {
    // Update in backend and persist to localStorage
    if (user) {
      try {
        // Map frontend field names to backend field names
        const backendData = {
          Name: updatedData.name || user.Name || user.name,
          username: updatedData.username || user.username,
          email: updatedData.email || user.email,
          mobile: updatedData.mobile || user.mobile,
        };

        // Call backend API to update user
        const response = await userApi.updateUser(user._id || user.id, backendData);
        
        // Update local state with the response from backend
        const updatedUser = {
          ...user,
          ...response.data.data,
          // Normalize Name to name for consistency
          name: response.data.data.Name || response.data.data.name,
          username: response.data.data.username,
          email: response.data.data.email,
          mobile: response.data.data.mobile,
        };

        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        return true;
      } catch (error) {
        console.error("Error updating profile:", error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem("token");
    setUser(null);
  };

  const addProduct = (productData) => {
    const newProduct = { ...productData, id: Date.now() };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, productData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProducts = () => products;

  return (
    <UserContext.Provider value={{ user, login, register, logout, updateProfile, products, addProduct, updateProduct, deleteProduct, getProducts, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
