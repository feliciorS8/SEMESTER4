// Sample data untuk testing
export const sampleProducts = [
  {
    id: "1",
    name: "Espresso",
    description: "Kopi espresso murni dengan ekstraksi sempurna",
    price: 18000,
    category: "Kopi",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Espresso dengan susu steamed dan foam yang creamy",
    price: 25000,
    category: "Kopi",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Latte",
    description: "Kopi latte yang smooth dan creamy",
    price: 26000,
    category: "Kopi",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Iced Americano",
    description: "Espresso dengan es dan air dingin",
    price: 22000,
    category: "Minuman Dingin",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Affogato",
    description: "Es krim vanilla dengan espresso panas di atas",
    price: 28000,
    category: "Dessert",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Croissant",
    description: "Pastry butter yang crispy dan lezat",
    price: 35000,
    category: "Makanan",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Chocolate Cake Slice",
    description: "Potongan kue coklat yang moist dan enak",
    price: 45000,
    category: "Makanan",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Tiramisu",
    description: "Tiramisu classic dengan mascarpone dan kopi",
    price: 42000,
    category: "Dessert",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Brownie",
    description: "Brownies fudgy yang teksturnya perfect",
    price: 30000,
    category: "Snack",
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Iced Coffee",
    description: "Kopi cincau dengan es batu",
    price: 20000,
    category: "Minuman Dingin",
    image: null,
    createdAt: new Date().toISOString(),
  },
];

// Fungsi untuk load sample data ke AsyncStorage
export const loadSampleData = async () => {
  try {
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    await AsyncStorage.setItem(
      "COFFEE_SHOP_MENU",
      JSON.stringify(sampleProducts),
    );
    console.log("Sample data loaded successfully");
  } catch (error) {
    console.error("Error loading sample data:", error);
  }
};
