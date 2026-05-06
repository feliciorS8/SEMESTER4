import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '../components/Toast';

function ProductSelector({ product, qty, onQtyChange, onRemove }) {
  const categoryIcons = {
    'Makanan': '🍔', 'Minuman': '🥤', 'Pakaian': '👕',
    'Elektronik': '📱', 'Kerajinan': '🎨', 'Lainnya': '📦',
  };
  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemLeft}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={{ width: 40, height: 40, borderRadius: 10 }} />
        ) : (
          <Text style={{ fontSize: 28 }}>{categoryIcons[product.category] || '📦'}</Text>
        )}
        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.cartItemPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
        </View>
      </View>
      <View style={styles.qtyControl}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => onQtyChange(Math.max(0, qty - 1))}>
          <Ionicons name="remove" size={16} color="#6C63FF" />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => onQtyChange(Math.min(product.stock, qty + 1))}>
          <Ionicons name="add" size={16} color="#6C63FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TransactionScreen({ navigation, products, transactions, onRefresh }) {
  const [cart, setCart] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const updateQty = (productId, qty) => {
    if (qty === 0) {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    } else {
      setCart({ ...cart, [productId]: qty });
    }
  };

  const cartItems = Object.entries(cart).map(([productId, qty]) => {
    const product = products.find((p) => p.id === productId);
    return product ? { product, qty } : null;
  }).filter(Boolean);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setToastMsg('Pilih produk terlebih dahulu!');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    const newTransactions = cartItems.map((item) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      productId: item.product.id,
      productName: item.product.name,
      qty: item.qty,
      price: item.product.price,
      total: item.product.price * item.qty,
      customerName: customerName.trim() || 'Pelanggan Umum',
      date: new Date().toISOString(),
    }));

    try {
      const allTransactions = [...transactions, ...newTransactions];
      await AsyncStorage.setItem('transactions', JSON.stringify(allTransactions));

      // Update stock
      const updatedProducts = products.map((p) => {
        const cartQty = cart[p.id];
        if (cartQty) return { ...p, stock: p.stock - cartQty };
        return p;
      });
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));

      setToastMsg(`Transaksi Rp ${totalAmount.toLocaleString('id-ID')} berhasil dicatat! 🎉`);
      setToastType('success');
      setToastVisible(true);
      setCart({});
      setCustomerName('');
      onRefresh();
    } catch (error) {
      setToastMsg('Gagal menyimpan transaksi');
      setToastType('error');
      setToastVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Toast visible={toastVisible} message={toastMsg} type={toastType} onHide={() => setToastVisible(false)} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buat Transaksi</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
          <Ionicons name="time-outline" size={22} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
        <View style={styles.customerBox}>
          <Ionicons name="person-outline" size={18} color="#8E8E93" />
          <TextInput style={styles.customerInput} value={customerName} onChangeText={setCustomerName} placeholder="Nama pelanggan (opsional)" placeholderTextColor="#C7C7CC" />
        </View>

        <Text style={styles.sectionTitle}>Pilih Produk</Text>
        {products.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cube-outline" size={48} color="#D1D1D6" />
            <Text style={styles.emptyText}>Belum ada produk</Text>
            <TouchableOpacity style={styles.addProductBtn} onPress={() => navigation.navigate('AddProduct')}>
              <Text style={styles.addProductBtnText}>+ Tambah Produk</Text>
            </TouchableOpacity>
          </View>
        ) : (
          products.filter(p => p.stock > 0).map((product) => (
            <ProductSelector
              key={product.id}
              product={product}
              qty={cart[product.id] || 0}
              onQtyChange={(qty) => updateQty(product.id, qty)}
            />
          ))
        )}
      </ScrollView>

      {totalItems > 0 && (
        <View style={styles.checkoutBar}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutItems}>{totalItems} item</Text>
            <Text style={styles.checkoutTotal}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
            <Text style={styles.checkoutBtnText}>Bayar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { backgroundColor: '#FFF', paddingTop: 55, paddingHorizontal: 20, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a2e' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  customerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 14, height: 50, elevation: 2 },
  customerInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1a1a2e' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginTop: 20, marginBottom: 12 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2 },
  cartItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cartItemInfo: { marginLeft: 12, flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  cartItemPrice: { fontSize: 13, color: '#6C63FF', fontWeight: '700', marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FE', borderRadius: 12, padding: 4 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 1 },
  qtyText: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginHorizontal: 12 },
  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#8E8E93', marginTop: 12 },
  addProductBtn: { backgroundColor: 'rgba(108,99,255,0.1)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 12 },
  addProductBtnText: { fontSize: 13, fontWeight: '700', color: '#6C63FF' },
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 30, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 20 },
  checkoutInfo: {},
  checkoutItems: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
  checkoutTotal: { fontSize: 20, fontWeight: '800', color: '#1a1a2e', marginTop: 2 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6C63FF', borderRadius: 16, paddingHorizontal: 28, paddingVertical: 14, elevation: 4 },
  checkoutBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginLeft: 8 },
});
