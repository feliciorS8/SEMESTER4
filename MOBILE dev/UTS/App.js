import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import AddProductScreen from './screens/AddProductScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import TransactionScreen from './screens/TransactionScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Warna utama aplikasi
const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';

// ===================== BOTTOM TAB NAVIGATOR =====================
function MainTabs({ products, transactions, profile, onRefresh }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Produk') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Transaksi') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
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
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard">
        {(props) => (
          <DashboardScreen
            {...props}
            products={products}
            transactions={transactions}
            profile={profile}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Produk">
        {(props) => (
          <ProductListScreen
            {...props}
            products={products}
            onRefresh={onRefresh}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Transaksi">
        {(props) => (
          <TransactionScreen
            {...props}
            products={products}
            transactions={transactions}
            onRefresh={onRefresh}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Profil">
        {(props) => (
          <ProfileScreen
            {...props}
            profile={profile}
            transactions={transactions}
            onRefresh={onRefresh}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const DEFAULT_PROFILE = {
  storeName: 'Toko UMKM UTS dija',
  ownerName: 'khadija',
  phone: '08123456789',
  address: 'Jl. Contoh No. 1, Kota',
  category: 'Fashion',
};

// ===================== MAIN APP =====================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  // Flag agar tidak save sebelum data selesai di-load
  const isDataLoaded = useRef(false);

  // Load data dari AsyncStorage saat app pertama dibuka
  const loadData = useCallback(async () => {
    try {
      const [storedProducts, storedTransactions, storedProfile] = await Promise.all([
        AsyncStorage.getItem('umkm_products'),
        AsyncStorage.getItem('umkm_transactions'),
        AsyncStorage.getItem('umkm_profile'),
      ]);

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
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
      AsyncStorage.setItem('umkm_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (isDataLoaded.current) {
      AsyncStorage.setItem('umkm_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (isDataLoaded.current) {
      AsyncStorage.setItem('umkm_profile', JSON.stringify(profile));
    }
  }, [profile]);

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
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main">
            {(props) => (
              <MainTabs
                {...props}
                products={products}
                transactions={transactions}
                profile={profile}
                onRefresh={handleRefresh}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AddProduct" options={{ ...headerOptions, title: 'Tambah Produk' }}>
            {(props) => (
              <AddProductScreen {...props} products={products} setProducts={setProducts} />
            )}
          </Stack.Screen>
          <Stack.Screen name="EditProduct" options={{ ...headerOptions, title: 'Edit Produk' }}>
            {(props) => (
              <AddProductScreen {...props} products={products} setProducts={setProducts} isEdit={true} />
            )}
          </Stack.Screen>
          <Stack.Screen name="ProductDetail" options={{ ...headerOptions, title: 'Detail Produk' }}>
            {(props) => (
              <ProductDetailScreen {...props} products={products} setProducts={setProducts} />
            )}
          </Stack.Screen>
          <Stack.Screen name="TransactionHistory" options={{ ...headerOptions, title: 'Riwayat Transaksi' }}>
            {(props) => (
              <TransactionHistoryScreen {...props} transactions={transactions} products={products} />
            )}
          </Stack.Screen>
          <Stack.Screen name="EditProfile" options={{ ...headerOptions, title: 'Edit Profil' }}>
            {(props) => (
              <EditProfileScreen {...props} profile={profile} setProfile={setProfile} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
