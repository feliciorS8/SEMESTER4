import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '../components/Toast';

const categoryIcons = {
  'Makanan': '🍔', 'Minuman': '🥤', 'Pakaian': '👕',
  'Elektronik': '📱', 'Kerajinan': '🎨', 'Lainnya': '📦',
};

function ProductCard({ product, onPress, isSelectMode, isSelected, onToggle }) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={isSelectMode ? onToggle : onPress}
      onLongPress={!isSelectMode ? onToggle : undefined}
      activeOpacity={0.7}
    >
      {isSelectMode && (
        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
          {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
        </View>
      )}
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardEmoji}>
          <Text style={{ fontSize: 32 }}>{categoryIcons[product.category] || '📦'}</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.cardCategory}>{product.category}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
          <View style={[styles.stockBadge, product.stock < 5 && styles.stockLow]}>
            <Text style={[styles.stockText, product.stock < 5 && styles.stockLowText]}>Stok: {product.stock}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductListScreen({ navigation, products, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const categories = ['Semua', 'Makanan', 'Minuman', 'Pakaian', 'Elektronik', 'Kerajinan', 'Lainnya'];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
    if (!selectMode) setSelectMode(true);
    if (newSet.size === 0) setSelectMode(false);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
      setSelectMode(false);
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const deleteSelected = async () => {
    const count = selectedIds.size;
    const remaining = products.filter((p) => !selectedIds.has(p.id));
    await AsyncStorage.setItem('products', JSON.stringify(remaining));
    setSelectedIds(new Set());
    setSelectMode(false);
    onRefresh();
    setToastMsg(`${count} produk berhasil dihapus! 🗑️`);
    setToastType('success');
    setToastVisible(true);
  };

  const cancelSelect = () => {
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  return (
    <View style={styles.container}>
      <Toast visible={toastVisible} message={toastMsg} type={toastType} onHide={() => setToastVisible(false)} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Katalog Produk</Text>
            <Text style={styles.headerSub}>{products.length} produk tersedia</Text>
          </View>
          {products.length > 0 && (
            <TouchableOpacity
              style={[styles.selectBtn, selectMode && styles.selectBtnActive]}
              onPress={selectMode ? cancelSelect : () => setSelectMode(true)}
            >
              <Ionicons name={selectMode ? 'close' : 'checkmark-done-outline'} size={18} color={selectMode ? '#FF6B6B' : '#1E88E5'} />
              <Text style={[styles.selectBtnText, selectMode && { color: '#FF6B6B' }]}>
                {selectMode ? 'Batal' : 'Pilih'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Select Mode Actions */}
      {selectMode && (
        <View style={styles.selectBar}>
          <TouchableOpacity style={styles.selectBarBtn} onPress={selectAll}>
            <Ionicons name={selectedIds.size === filteredProducts.length ? 'checkbox' : 'square-outline'} size={20} color="#1E88E5" />
            <Text style={styles.selectBarText}>
              {selectedIds.size === filteredProducts.length ? 'Batal Semua' : 'Pilih Semua'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.selectCount}>{selectedIds.size} dipilih</Text>
          <TouchableOpacity
            style={[styles.deleteSelBtn, selectedIds.size === 0 && { opacity: 0.4 }]}
            onPress={selectedIds.size > 0 ? deleteSelected : undefined}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={18} color="#FFF" />
            <Text style={styles.deleteSelText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#8E8E93" />
        <TextInput style={styles.searchInput} placeholder="Cari produk..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#C7C7CC" />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.categoryRow}>
        <FlatList
          horizontal showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === item && styles.categoryChipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="cube-outline" size={56} color="#D1D1D6" />
          <Text style={styles.emptyText}>{products.length === 0 ? 'Belum ada produk' : 'Produk tidak ditemukan'}</Text>
          <Text style={styles.emptySubtext}>{products.length === 0 ? 'Tambahkan produk pertama Anda' : 'Coba kata kunci lain'}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              isSelectMode={selectMode}
              isSelected={selectedIds.has(item.id)}
              onToggle={() => toggleSelect(item.id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
      {!selectMode && (
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddProduct')} activeOpacity={0.8}>
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { backgroundColor: '#FFF', paddingTop: 55, paddingHorizontal: 20, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 5 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a2e' },
  headerSub: { fontSize: 13, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
  selectBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(30,136,229,0.08)', gap: 6 },
  selectBtnActive: { backgroundColor: 'rgba(255,107,107,0.08)' },
  selectBtnText: { fontSize: 13, fontWeight: '600', color: '#1E88E5' },
  selectBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, elevation: 3 },
  selectBarBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  selectBarText: { fontSize: 13, fontWeight: '600', color: '#1E88E5' },
  selectCount: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  deleteSelBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B6B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, gap: 6 },
  deleteSelText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 16, borderRadius: 14, paddingHorizontal: 14, height: 46, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1a1a2e' },
  categoryRow: { marginTop: 14, paddingLeft: 20 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 8, elevation: 1 },
  categoryChipActive: { backgroundColor: '#1E88E5' },
  categoryChipText: { fontSize: 12, fontWeight: '600', color: '#636366' },
  categoryChipTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', borderRadius: 16, marginTop: 12, flexDirection: 'row', padding: 14, elevation: 2 },
  cardSelected: { borderWidth: 2, borderColor: '#1E88E5', backgroundColor: 'rgba(30,136,229,0.04)' },
  checkbox: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: '#D1D1D6', justifyContent: 'center', alignItems: 'center', marginRight: 10, alignSelf: 'center' },
  checkboxChecked: { backgroundColor: '#1E88E5', borderColor: '#1E88E5' },
  cardImage: { width: 60, height: 60, borderRadius: 16, backgroundColor: '#F2F2F7', marginRight: 14 },
  cardEmoji: { width: 60, height: 60, borderRadius: 16, backgroundColor: '#F8F9FE', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardName: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  cardCategory: { fontSize: 11, color: '#8E8E93', marginTop: 2, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  cardPrice: { fontSize: 15, fontWeight: '800', color: '#1E88E5' },
  stockBadge: { backgroundColor: 'rgba(76,175,80,0.1)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  stockLow: { backgroundColor: 'rgba(255,107,107,0.1)' },
  stockText: { fontSize: 11, fontWeight: '600', color: '#4CAF50' },
  stockLowText: { color: '#FF6B6B' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#8E8E93', marginTop: 16 },
  emptySubtext: { fontSize: 13, color: '#C7C7CC', marginTop: 4 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 58, height: 58, borderRadius: 20, backgroundColor: '#1E88E5', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#1E88E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
});
