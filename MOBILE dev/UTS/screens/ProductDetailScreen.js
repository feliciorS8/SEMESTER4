import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from '../components/Toast';

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={18} color="#6C63FF" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ProductDetailScreen({ navigation, route, products, setProducts }) {
  const { productId } = route.params;
  const product = products.find((p) => p.id === productId);
  const [toastVisible, setToastVisible] = useState(false);

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={56} color="#FF6B6B" />
        <Text style={styles.emptyText}>Produk tidak ditemukan</Text>
      </View>
    );
  }

  const categoryIcons = {
    'Makanan': '🍔', 'Minuman': '🥤', 'Pakaian': '👕',
    'Elektronik': '📱', 'Kerajinan': '🎨', 'Lainnya': '📦',
  };

  const handleDelete = () => {
    setProducts(products.filter((p) => p.id !== productId));
    setToastVisible(true);
    setTimeout(() => navigation.goBack(), 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Toast visible={toastVisible} message="Produk berhasil dihapus! 🗑️" type="success" onHide={() => setToastVisible(false)} />

      <View style={styles.emojiHeader}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.productImage} />
        ) : (
          <Text style={{ fontSize: 64 }}>{categoryIcons[product.category] || '📦'}</Text>
        )}
        <View style={styles.categoryTag}>
          <Text style={styles.categoryTagText}>{product.category}</Text>
        </View>
      </View>

      <View style={styles.nameSection}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow icon="layers-outline" label="Stok Tersedia" value={`${product.stock} unit`} />
        <InfoRow icon="pricetag-outline" label="Kategori" value={product.category} />
        <InfoRow icon="calendar-outline" label="Ditambahkan" value={new Date(product.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} />
      </View>

      {product.description ? (
        <View style={styles.descCard}>
          <Text style={styles.descTitle}>Deskripsi</Text>
          <Text style={styles.descText}>{product.description}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProduct', { product })} activeOpacity={0.8}>
          <Ionicons name="create-outline" size={20} color="#FFF" />
          <Text style={styles.editBtnText}>Edit Produk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE' },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#8E8E93', marginTop: 12 },
  emojiHeader: { backgroundColor: '#FFF', alignItems: 'center', paddingVertical: 30, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 3 },
  productImage: { width: 160, height: 160, borderRadius: 20, backgroundColor: '#F2F2F7' },
  categoryTag: { backgroundColor: 'rgba(108,99,255,0.1)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  categoryTagText: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },
  nameSection: { paddingHorizontal: 20, paddingTop: 20 },
  productName: { fontSize: 24, fontWeight: '800', color: '#1a1a2e' },
  productPrice: { fontSize: 22, fontWeight: '800', color: '#6C63FF', marginTop: 6 },
  infoCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 20, borderRadius: 16, padding: 16, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  infoLeft: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { fontSize: 14, color: '#636366', marginLeft: 10, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  descCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 14, borderRadius: 16, padding: 16, elevation: 2 },
  descTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  descText: { fontSize: 14, color: '#636366', lineHeight: 22 },
  actions: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 24, gap: 12 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6C63FF', borderRadius: 16, height: 54, elevation: 4 },
  editBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF', marginLeft: 8 },
  deleteBtn: { width: 54, height: 54, borderRadius: 16, backgroundColor: 'rgba(255,107,107,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,107,107,0.3)' },
});
