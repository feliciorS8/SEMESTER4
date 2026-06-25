import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Storage, { migrateAsyncStorageToSQLite } from './storage';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import AddProductScreen from './screens/AddProductScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import TransactionScreen from './screens/TransactionScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountScreen from './screens/AccountScreen';
import CashierLoginScreen from './screens/CashierLoginScreen';
import {
  CategoryManagementScreen,
  DiscountManagementScreen,
  CashierManagementScreen,
  CustomerManagementScreen,
  PrinterSettingsScreen,
  QrisSettingsScreen,
} from './screens/ManagementScreens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Warna utama aplikasi
const PRIMARY = '#EE4D2D';
const PRIMARY_DARK = '#D73211';

// ===================== BOTTOM TAB NAVIGATOR =====================
function MainTabs({ products, categories, transactions, expenses, profile, setProfile, cart, setCart, setExpenses, activeCashier, onRefresh }) {
  const insets = useSafeAreaInsets();
  const bottomSpace = Math.max(insets.bottom, 18);
  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Kasir') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Checkout') {
            iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          } else if (route.name === 'Laporan') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Pengaturan') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'Checkout' && cartCount > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -10,
                  top: -8,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#FF3B30',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 4,
                }}>
                  <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800' }}>{cartCount}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: PRIMARY,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 58 + bottomSpace,
          paddingBottom: bottomSpace,
          paddingTop: 6,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Kasir">
        {(props) => (
          <DashboardScreen
            {...props}
            products={products}
            categories={categories}
            transactions={transactions}
            profile={profile}
            cart={cart}
            setCart={setCart}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Checkout">
        {(props) => (
          <TransactionScreen
            {...props}
            products={products}
            transactions={transactions}
            cart={cart}
            setCart={setCart}
            profile={profile}
            activeCashier={activeCashier}
            onRefresh={onRefresh}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Laporan">
        {(props) => (
          <TransactionHistoryScreen
            {...props}
            transactions={transactions}
            expenses={expenses}
            products={products}
            profile={profile}
            setExpenses={setExpenses}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Pengaturan">
        {(props) => (
          <SettingsScreen
            {...props}
            products={products}
            profile={profile}
            setProfile={setProfile}
            transactions={transactions}
            onRefresh={onRefresh}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const DEFAULT_PROFILE = {
  storeName: 'Kasir',
  ownerName: 'rrachel',
  phone: '08123456789',
  address: 'Jl. Contoh No. 1, Kota',
  email: 'feliciors8@gmail.com',
  category: 'Toko',
  qrisMerchant: 'rrachel shop',
  qrisImage: null,
  qrisActive: true,
};

const DEFAULT_CASHIERS = [
  { id: 'owner', name: 'rrachel', email: 'feliciors8@gmail.com', role: 'owner', phone: '08123456789', pin: '1234', active: true },
  { id: 'kasir-2', name: 'dija', email: 'kasir@example.com', role: 'kasir', phone: '081200000000', pin: '1234', active: true },
];

const DEFAULT_CATEGORIES = [
  { id: 'cat-home', name: 'Kebutuhan Rumah', icon: 'home', visible: true },
  { id: 'cat-food', name: 'Makanan', icon: 'fast-food', visible: true },
  { id: 'cat-drink', name: 'Minuman', icon: 'cafe', visible: true },
  { id: 'cat-basic', name: 'Sembako', icon: 'cart', visible: true },
  { id: 'cat-other', name: 'Lainnya', icon: 'pricetag', visible: true },
];

const DEFAULT_PRODUCTS = [
  {
    id: 'sample-air-mineral',
    name: 'Air Mineral 600ml',
    price: 3000,
    cost: 1500,
    stock: 99,
    description: 'Air mineral kemasan botol 600ml',
    category: 'Minuman',
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-beras',
    name: 'Beras Premium 5kg',
    price: 65000,
    cost: 56000,
    stock: 20,
    description: 'Beras putih pulen kemasan 5kg',
    category: 'Sembako',
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-es-jeruk',
    name: 'Es jeruk',
    price: 10000,
    cost: 5000,
    stock: 29,
    description: 'Minuman jeruk segar',
    category: 'Minuman',
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-mie',
    name: 'Mie Instan Goreng',
    price: 3500,
    cost: 2800,
    stock: 50,
    description: 'Mie instan goreng rasa original',
    category: 'Makanan',
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-sabun',
    name: 'Sabun Cuci Piring',
    price: 12000,
    cost: 8000,
    stock: 30,
    description: 'Sabun cuci piring jeruk nipis',
    category: 'Kebutuhan Rumah',
    image: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-udon',
    name: 'Udon',
    price: 50000,
    cost: 30000,
    stock: 29,
    description: 'Makanan siap saji',
    category: 'Makanan',
    image: null,
    createdAt: new Date().toISOString(),
  },
];

// ===================== MAIN APP =====================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [cashiers, setCashiers] = useState(DEFAULT_CASHIERS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCashierId, setActiveCashierId] = useState('owner');
  const [cart, setCart] = useState({});
  const activeCashier = cashiers.find((cashier) => cashier.id === activeCashierId) || cashiers[0] || DEFAULT_CASHIERS[0];

  // Flag agar tidak save sebelum data selesai di-load
  const isDataLoaded = useRef(false);

  // Load data dari SQLite saat app pertama dibuka
  const loadData = useCallback(async () => {
    try {
      await migrateAsyncStorageToSQLite();
      const [storedProducts, storedTransactions, storedExpenses, storedProfile, storedCashiers, storedActiveCashierId, storedCategories] = await Promise.all([
        Storage.getItem('umkm_products'),
        Storage.getItem('umkm_transactions'),
        Storage.getItem('umkm_expenses'),
        Storage.getItem('umkm_profile'),
        Storage.getItem('umkm_cashiers'),
        Storage.getItem('umkm_active_cashier_id'),
        Storage.getItem('umkm_categories'),
      ]);

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedCashiers) setCashiers(JSON.parse(storedCashiers));
      if (storedActiveCashierId) setActiveCashierId(storedActiveCashierId);
      if (storedCategories) setCategories(JSON.parse(storedCategories));
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      // Tandai data sudah di-load, baru boleh save
      isDataLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save data HANYA setelah data selesai di-load (mencegah overwrite data lama)
  useEffect(() => {
    if (isDataLoaded.current) {
      Storage.setItem('umkm_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (isDataLoaded.current) {
      Storage.setItem('umkm_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (isDataLoaded.current) {
      Storage.setItem('umkm_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    if (isDataLoaded.current) {
      Storage.setItem('umkm_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (isDataLoaded.current) {
      Storage.setItem('umkm_cashiers', JSON.stringify(cashiers));
    }
  }, [cashiers]);

  useEffect(() => {
    if (isDataLoaded.current) {
      Storage.setItem('umkm_active_cashier_id', activeCashierId);
    }
  }, [activeCashierId]);

  useEffect(() => {
    if (isDataLoaded.current) {
      Storage.setItem('umkm_categories', JSON.stringify(categories));
    }
  }, [categories]);

  const handleRefresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setIsLoading(false)} />
      </>
    );
  }

  const headerOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: PRIMARY },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main">
            {(props) => (
              <MainTabs
                {...props}
                products={products}
                categories={categories}
                transactions={transactions}
                expenses={expenses}
                profile={profile}
                setProfile={setProfile}
                cart={cart}
                setCart={setCart}
                setExpenses={setExpenses}
                activeCashier={activeCashier}
                onRefresh={handleRefresh}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AddProduct" options={{ ...headerOptions, title: 'Tambah Produk' }}>
            {(props) => (
              <AddProductScreen {...props} products={products} setProducts={setProducts} categories={categories} />
            )}
          </Stack.Screen>
          <Stack.Screen name="EditProduct" options={{ ...headerOptions, title: 'Edit Produk' }}>
            {(props) => (
              <AddProductScreen {...props} products={products} setProducts={setProducts} categories={categories} isEdit={true} />
            )}
          </Stack.Screen>
          <Stack.Screen name="ProductDetail" options={{ ...headerOptions, title: 'Detail Produk' }}>
            {(props) => (
              <ProductDetailScreen {...props} products={products} setProducts={setProducts} />
            )}
          </Stack.Screen>
          <Stack.Screen name="TransactionHistory" options={{ ...headerOptions, title: 'Riwayat Transaksi' }}>
            {(props) => (
              <TransactionHistoryScreen {...props} transactions={transactions} expenses={expenses} products={products} profile={profile} setExpenses={setExpenses} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Account" options={{ headerShown: false }}>
            {(props) => <AccountScreen {...props} profile={profile} setProfile={setProfile} activeCashier={activeCashier} setActiveCashierId={setActiveCashierId} />}
          </Stack.Screen>
          <Stack.Screen name="CashierLogin" options={{ headerShown: false }}>
            {(props) => <CashierLoginScreen {...props} cashiers={cashiers} setActiveCashierId={setActiveCashierId} />}
          </Stack.Screen>
          <Stack.Screen name="ManageCategories" options={{ headerShown: false }}>
            {(props) => <CategoryManagementScreen {...props} categories={categories} setCategories={setCategories} products={products} setProducts={setProducts} />}
          </Stack.Screen>
          <Stack.Screen name="ManageProducts" options={{ headerShown: false }}>
            {(props) => <ProductListScreen {...props} products={products} categories={categories} onRefresh={handleRefresh} />}
          </Stack.Screen>
          <Stack.Screen name="ManageDiscounts" options={{ headerShown: false }}>
            {(props) => <DiscountManagementScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="ManageCashiers" options={{ headerShown: false }}>
            {(props) => <CashierManagementScreen {...props} profile={profile} cashiers={cashiers} setCashiers={setCashiers} activeCashier={activeCashier} />}
          </Stack.Screen>
          <Stack.Screen name="ManageCustomers" options={{ headerShown: false }}>
            {(props) => <CustomerManagementScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="ManagePrinter" options={{ headerShown: false }}>
            {(props) => <PrinterSettingsScreen {...props} profile={profile} />}
          </Stack.Screen>
          <Stack.Screen name="ManageQris" options={{ headerShown: false }}>
            {(props) => <QrisSettingsScreen {...props} profile={profile} setProfile={setProfile} />}
          </Stack.Screen>
          <Stack.Screen name="EditProfile" options={{ ...headerOptions, title: 'Edit Profil' }}>
            {(props) => (
              <EditProfileScreen {...props} profile={profile} setProfile={setProfile} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
