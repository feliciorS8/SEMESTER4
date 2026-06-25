import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Storage from '../storage';
import Toast from '../components/Toast';

const PURPLE = '#EE4D2D';
const BLUE_DARK = '#D73211';
const TEXT = '#151A26';
const MUTED = '#6F7480';

function productCode(product) {
  const initials = product.name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  return `${initials || 'PR'}${String(product.stock || 0).slice(0, 1)}`;
}

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <View style={styles.productRow}>
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.thumb} />
      ) : (
        <View style={styles.thumbPlaceholder}>
          <Text style={styles.thumbText}>{productCode(product)}</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        {!!product.description && <Text style={styles.productDesc} numberOfLines={1}>{product.description}</Text>}
        <Text style={styles.productPrice}>Rp{product.price.toLocaleString('id-ID')}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.circleAction, styles.editAction]} onPress={onEdit} activeOpacity={0.85}>
          <Ionicons name="pencil" size={18} color="#EE4D2D" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleAction, styles.deleteAction]} onPress={onDelete} activeOpacity={0.85}>
          <Ionicons name="trash" size={18} color="#E73D4B" />
        </TouchableOpacity>
        <View style={styles.stockPill}>
          <Text style={styles.stockText}>Tersedia ({product.stock})</Text>
        </View>
      </View>
    </View>
  );
}

export default function ProductListScreen({ navigation, products, categories: managedCategories = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const categories = useMemo(() => {
    const source = managedCategories.length ? managedCategories : [
      { name: 'Kebutuhan Rumah', visible: true },
      { name: 'Makanan', visible: true },
      { name: 'Minuman', visible: true },
      { name: 'Sembako', visible: true },
    ];
    const defaults = source
      .filter((item) => item.visible !== false)
      .map((item) => item.name);
    const extras = products
      .map((item) => item.category)
      .filter((item) => item && !source.some((category) => category.name === item));
    return ['Semua', ...defaults, ...new Set(extras)];
  }, [managedCategories, products]);

  const filteredProducts = products.filter((product) => {
    const keyword = searchQuery.trim().toLowerCase();
    const matchSearch = !keyword || product.name.toLowerCase().includes(keyword);
    const matchCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const lowStock = products.filter((item) => item.stock > 0 && item.stock <= 5).length;
  const emptyStock = products.filter((item) => item.stock <= 0).length;

  const deleteProduct = (product) => {
    Alert.alert('Hapus Produk', `Hapus ${product.name}?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const remaining = products.filter((item) => item.id !== product.id);
          await Storage.setItem('umkm_products', JSON.stringify(remaining));
          await onRefresh?.();
          setToastMsg('Produk berhasil dihapus');
          setToastType('success');
          setToastVisible(true);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Toast visible={toastVisible} message={toastMsg} type={toastType} onHide={() => setToastVisible(false)} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Ionicons name="arrow-back" size={21} color="#69707F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produk</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct')} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={22} color="#69707F" />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari produk..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#A4A8B1"
        />
      </View>

      <View style={styles.categoryWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(item)}
              activeOpacity={0.85}
            >
              <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: PURPLE }]}>{products.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#C37A13' }]}>{lowStock}</Text>
          <Text style={styles.statLabel}>Stok Rendah</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#D1293B' }]}>{emptyStock}</Text>
          <Text style={styles.statLabel}>Stok Habis</Text>
        </View>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="cube-outline" size={44} color="#A2A7B0" />
          <Text style={styles.emptyTitle}>Belum ada produk</Text>
          <Text style={styles.emptySubtitle}>Tambahkan produk pertama Anda</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductRow
              product={item}
              onEdit={() => navigation.navigate('EditProduct', { product: item })}
              onDelete={() => deleteProduct(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FB' },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F2F5', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, marginLeft: 12, fontSize: 19, fontWeight: '800', color: TEXT },
  addButton: { height: 40, paddingHorizontal: 14, borderRadius: 10, backgroundColor: PURPLE, flexDirection: 'row', alignItems: 'center', gap: 6 },
  addText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  searchBox: {
    margin: 16,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F0F1F4',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, marginLeft: 12, color: TEXT, fontSize: 14 },
  categoryWrap: { backgroundColor: '#FFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EEF0F4' },
  categoryList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  categoryChip: { height: 38, paddingHorizontal: 14, borderRadius: 19, backgroundColor: '#F0F1F4', justifyContent: 'center' },
  categoryChipActive: { backgroundColor: PURPLE },
  categoryText: { color: '#4D5360', fontSize: 13, fontWeight: '700' },
  categoryTextActive: { color: '#FFF' },
  stats: { backgroundColor: '#FFF', minHeight: 72, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEF0F4' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 21, fontWeight: '800' },
  statLabel: { color: '#4F5663', fontSize: 12, marginTop: 3 },
  listContent: { padding: 14, paddingBottom: 30 },
  productRow: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4E7ED',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: { width: 62, height: 62, borderRadius: 9, marginRight: 12 },
  thumbPlaceholder: { width: 62, height: 62, borderRadius: 9, backgroundColor: '#FFF0EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  thumbText: { color: BLUE_DARK, fontSize: 15, fontWeight: '800' },
  productInfo: { flex: 1 },
  productName: { color: TEXT, fontSize: 14, fontWeight: '800' },
  productCategory: { color: MUTED, fontSize: 12, marginTop: 4 },
  productDesc: { color: MUTED, fontSize: 12, marginTop: 6 },
  productPrice: { color: PURPLE, fontSize: 15, fontWeight: '800', marginTop: 7 },
  actions: { alignItems: 'flex-end', alignSelf: 'stretch', justifyContent: 'space-between' },
  circleAction: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  editAction: { backgroundColor: '#FFF0EB' },
  deleteAction: { backgroundColor: '#FFE2E7', marginTop: 8 },
  stockPill: { backgroundColor: '#DDFBEA', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12, marginTop: 6 },
  stockText: { color: '#179757', fontSize: 11, fontWeight: '700' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { color: MUTED, fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptySubtitle: { color: '#A2A7B0', fontSize: 14, marginTop: 8 },
});
