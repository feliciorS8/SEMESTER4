import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "COFFEE_SHOP_MENU";

// Get all products
export const getAllProducts = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

// Add new product
export const addProduct = async (product) => {
  try {
    const allProducts = await getAllProducts();
    const newProduct = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...product,
    };
    const updatedProducts = [...allProducts, newProduct];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.find((product) => product.id === id);
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};

// Update product
export const updateProduct = async (id, updatedData) => {
  try {
    const allProducts = await getAllProducts();
    const updatedProducts = allProducts.map((product) =>
      product.id === id
        ? { ...product, ...updatedData, updatedAt: new Date().toISOString() }
        : product,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    return updatedProducts.find((p) => p.id === id);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const allProducts = await getAllProducts();
    const filteredProducts = allProducts.filter((product) => product.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Delete all products (for testing)
export const clearAllProducts = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing products:", error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter((product) => product.category === category);
  } catch (error) {
    console.error("Error getting products by category:", error);
    return [];
  }
};

// Get all unique categories
export const getAllCategories = async () => {
  try {
    const allProducts = await getAllProducts();
    const categories = [...new Set(allProducts.map((p) => p.category))];
    return categories;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};
