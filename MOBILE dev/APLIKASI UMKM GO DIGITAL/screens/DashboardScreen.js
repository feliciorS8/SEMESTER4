import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#EE4D2D';
const BG = '#F6F7FB';
const TEXT = '#151A26';
const MUTED = '#7A7F8D';

const fallbackCategories = [
  { name: 'Kebutuhan Rumah', icon: 'home', visible: true },
  { name: 'Makanan', icon: 'fast-food', visible: true },
  { name: 'Minuman', icon: 'cafe', visible: true },
  { name: 'Sembako', icon: 'cart', visible: true },
];

function productCode(product) {
  if (product.code) return product.code;
  const initials = product.name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  return `${initials || 'PR'}${String(product.stock || 0).slice(0, 1)}`;
}

function ProductCard({ product, onAdd, layout }) {
  const outOfStock = Number(product.stock || 0) <= 0;
  if (layout === 'list') {
    return (
      <View style={styles.listProductCard}>
        <View style={styles.listProductMedia}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          ) : (
            <View style={styles.productPlaceholder}>
              <Text style={styles.listProductCode}>{productCode(product)}</Text>
            </View>
          )}
        </View>
        <View style={styles.listProductInfo}>
          <Text style={styles.listProductName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.productStock}>Stok: {product.stock}</Text>
          <Text style={styles.productPrice}>Rp{product.price.toLocaleString('id-ID')}</Text>
        </View>
        <TouchableOpacity style={[styles.listAddBubble, outOfStock && styles.addDisabled]} onPress={outOfStock ? undefined : onAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.productCard}>
      <View style={styles.productMedia}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.productImage} />
        ) : (
          <View style={styles.productPlaceholder}>
            <Text style={styles.productCode}>{productCode(product)}</Text>
          </View>
        )}
        <TouchableOpacity style={[styles.addBubble, outOfStock && styles.addDisabled]} onPress={outOfStock ? undefined : onAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.productStock}>Stok: {product.stock}</Text>
      <Text style={styles.productPrice}>Rp{product.price.toLocaleString('id-ID')}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation, products, cart, setCart, profile, categories: managedCategories = [] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [layout, setLayout] = useState('grid');

  const categories = useMemo(() => {
    const source = managedCategories.length ? managedCategories : fallbackCategories;
    const base = source
      .filter((item) => item.visible !== false)
      .map((item) => ({ label: item.name, icon: item.icon || 'pricetag' }));
    const known = new Set(['Semua', ...source.map((item) => item.name)]);
    const extra = products
      .map((item) => item.category)
      .filter((item) => item && !known.has(item))
      .map((label) => ({ label, icon: 'pricetag' }));
    return [{ label: 'Semua', icon: null }, ...base, ...extra];
  }, [managedCategories, products]);

  const filteredProducts = products.filter((product) => {
    const keyword = search.trim().toLowerCase();
    const matchesSearch = !keyword || product.name.toLowerCase().includes(keyword);
    const matchesCategory = category === 'Semua' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (Number(product.stock || 0) <= 0) return;
    setCart((current) => {
      const existing = current[product.id];
      const currentQty = existing?.qty || 0;
      if (currentQty >= product.stock) return current;
      return {
        ...current,
        [product.id]: {
          productId: product.id,
          qty: currentQty + 1,
          discountType: existing?.discountType || 'nominal',
          discountValue: existing?.discountValue || 0,
          showDiscount: existing?.showDiscount || false,
        },
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>Kasir</Text>
        <TouchableOpacity style={styles.avatarButton} onPress={() => navigation.navigate('Account')} activeOpacity={0.85}>
          <Text style={styles.avatarText}>{(profile?.ownerName || 'R').charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9AA0AA" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Cari nama atau kode produk..."
            placeholderTextColor="#A4A8B1"
          />
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
          activeOpacity={0.85}
        >
          <Ionicons name={layout === 'grid' ? 'menu' : 'grid-outline'} size={22} color="#6F7480" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.scanButton} activeOpacity={0.85}>
          <Ionicons name="barcode-outline" size={20} color="#FFF" />
          <Text style={styles.scanText}>Scan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {categories.map((item) => {
            const active = category === item.label;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                onPress={() => setCategory(item.label)}
                activeOpacity={0.85}
              >
                {item.icon && <Ionicons name={item.icon} size={18} color={active ? '#FFF' : '#6F7480'} />}
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="storefront-outline" size={44} color="#B6BBC5" />
          <Text style={styles.emptyTitle}>Belum ada produk</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('AddProduct')} activeOpacity={0.85}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.emptyButtonText}>Tambah Produk</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          key={layout}
          numColumns={layout === 'grid' ? 2 : 1}
          renderItem={({ item }) => (
            <ProductCard product={item} layout={layout} onAdd={() => addToCart(item)} />
          )}
          columnWrapperStyle={layout === 'grid' ? styles.productRow : undefined}
          contentContainerStyle={styles.productsContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  topBar: {
    backgroundColor: '#FFF',
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { fontSize: 24, fontWeight: '800', color: TEXT },
  avatarButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  searchRow: {
    backgroundColor: '#FFF',
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#ECEEF3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, marginLeft: 9, color: TEXT, fontSize: 14 },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F7F8FA',
    borderWidth: 1,
    borderColor: '#ECEEF3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  categoryWrap: { backgroundColor: '#FFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EEF0F4' },
  categoryList: { paddingHorizontal: 18, paddingVertical: 12, gap: 8 },
  categoryChip: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E2E8',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryChipActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  categoryText: { color: '#6F7480', fontSize: 13, fontWeight: '700' },
  categoryTextActive: { color: '#FFF' },
  productsContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  productRow: { gap: 10 },
  productCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#1C2430',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  productMedia: { height: 88, borderRadius: 12, overflow: 'hidden', marginBottom: 10 },
  productImage: { width: '100%', height: '100%', borderRadius: 12 },
  productPlaceholder: { flex: 1, backgroundColor: '#FFF0EB', justifyContent: 'center', alignItems: 'center' },
  productCode: { color: '#D73211', fontSize: 22, fontWeight: '800' },
  addBubble: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addDisabled: { backgroundColor: '#C9CDD5' },
  productName: { color: TEXT, fontSize: 14, fontWeight: '800', minHeight: 34 },
  productStock: { color: '#A0A4AD', fontSize: 12, fontWeight: '600', marginTop: 3 },
  productPrice: { color: PURPLE, fontSize: 15, fontWeight: '800', marginTop: 8 },
  listProductCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEEF3',
    elevation: 1,
  },
  listProductMedia: { width: 74, height: 74, borderRadius: 12, overflow: 'hidden', marginRight: 14 },
  listProductCode: { color: '#D73211', fontSize: 19, fontWeight: '800' },
  listProductInfo: { flex: 1, minWidth: 0 },
  listProductName: { color: TEXT, fontSize: 15, fontWeight: '800' },
  listAddBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PURPLE,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyTitle: { color: MUTED, fontSize: 17, fontWeight: '700', marginTop: 12 },
  emptyButton: {
    marginTop: 18,
    backgroundColor: PURPLE,
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyButtonText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});
