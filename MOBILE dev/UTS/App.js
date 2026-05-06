import React, { useState, useEffect, useCallback } from 'react';
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
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#6C63FF',
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

// ===================== MAIN APP =====================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState({
    storeName: 'Toko UMKM UTS dija',
    ownerName: 'khadija',
    phone: '08123456789',
    address: 'Jl. Contoh No. 1, Kota',
    category: 'Fashion',
  });

  // Load data from AsyncStorage
  const loadData = useCallback(async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const storedTransactions = await AsyncStorage.getItem('transactions');
      const storedProfile = await AsyncStorage.getItem('profile');

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedProfile) setProfile(JSON.parse(storedProfile));
    } catch (error) {
      console.log('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    AsyncStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setIsLoading(false)} />
      </>
    );
  }

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
          <Stack.Screen
            name="AddProduct"
            options={{
              headerShown: true,
              title: 'Tambah Produk',
              headerStyle: { backgroundColor: '#6C63FF' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            {(props) => (
              <AddProductScreen
                {...props}
                products={products}
                setProducts={setProducts}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="EditProduct"
            options={{
              headerShown: true,
              title: 'Edit Produk',
              headerStyle: { backgroundColor: '#6C63FF' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            {(props) => (
              <AddProductScreen
                {...props}
                products={products}
                setProducts={setProducts}
                isEdit={true}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="ProductDetail"
            options={{
              headerShown: true,
              title: 'Detail Produk',
              headerStyle: { backgroundColor: '#6C63FF' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            {(props) => (
              <ProductDetailScreen
                {...props}
                products={products}
                setProducts={setProducts}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="TransactionHistory"
            options={{
              headerShown: true,
              title: 'Riwayat Transaksi',
              headerStyle: { backgroundColor: '#6C63FF' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            {(props) => (
              <TransactionHistoryScreen
                {...props}
                transactions={transactions}
                products={products}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="EditProfile"
            options={{
              headerShown: true,
              title: 'Edit Profil',
              headerStyle: { backgroundColor: '#6C63FF' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            {(props) => (
              <EditProfileScreen
                {...props}
                profile={profile}
                setProfile={setProfile}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
