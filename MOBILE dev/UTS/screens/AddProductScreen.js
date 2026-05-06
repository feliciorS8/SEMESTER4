import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from '../components/Toast';

export default function AddProductScreen({ navigation, route, products, setProducts, isEdit }) {
  const editProduct = isEdit && route.params?.product ? route.params.product : null;

  const [name, setName] = useState(editProduct ? editProduct.name : '');
  const [price, setPrice] = useState(editProduct ? editProduct.price.toString() : '');
  const [stock, setStock] = useState(editProduct ? editProduct.stock.toString() : '');
  const [description, setDescription] = useState(editProduct ? editProduct.description : '');
  const [category, setCategory] = useState(editProduct ? editProduct.category : 'Makanan');
  const [image, setImage] = useState(editProduct ? editProduct.image : null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const categories = ['Makanan', 'Minuman', 'Pakaian', 'Elektronik', 'Kerajinan', 'Lainnya'];

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Izin akses galeri diperlukan!', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast('Izin akses kamera diperlukan!', 'error');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      showToast('Nama, harga, dan stok harus diisi!', 'error');
      return;
    }
    if (isNaN(Number(price)) || isNaN(Number(stock))) {
      showToast('Harga dan stok harus berupa angka!', 'error');
      return;
    }

    if (isEdit && editProduct) {
      const updated = products.map((p) =>
        p.id === editProduct.id
          ? { ...p, name: name.trim(), price: Number(price), stock: Number(stock), description: description.trim(), category, image }
          : p
      );
      setProducts(updated);
      showToast('Produk berhasil diperbarui! ✅');
      setTimeout(() => navigation.goBack(), 1500);
    } else {
      const newProduct = {
        id: Date.now().toString(),
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        description: description.trim(),
        category,
        image,
        createdAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
      showToast('Produk berhasil ditambahkan! 🎉');
      setTimeout(() => navigation.goBack(), 1500);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Toast visible={toastVisible} message={toastMsg} type={toastType} onHide={() => setToastVisible(false)} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image Picker Section */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Foto Produk</Text>
          <View style={styles.imageSection}>
            {image ? (
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <Image source={{ uri: image }} style={styles.imagePreview} />
                <View style={styles.imageEditBadge}>
                  <Ionicons name="pencil" size={14} color="#FFF" />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={36} color="#C7C7CC" />
                <Text style={styles.imagePlaceholderText}>Tambah Foto</Text>
              </View>
            )}
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imgBtn} onPress={pickImage} activeOpacity={0.7}>
                <Ionicons name="images-outline" size={20} color="#1E88E5" />
                <Text style={styles.imgBtnText}>Galeri</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imgBtn} onPress={takePhoto} activeOpacity={0.7}>
                <Ionicons name="camera-outline" size={20} color="#1E88E5" />
                <Text style={styles.imgBtnText}>Kamera</Text>
              </TouchableOpacity>
              {image && (
                <TouchableOpacity style={[styles.imgBtn, { borderColor: '#FF6B6B' }]} onPress={() => setImage(null)} activeOpacity={0.7}>
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                  <Text style={[styles.imgBtnText, { color: '#FF6B6B' }]}>Hapus</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Produk *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="pricetag-outline" size={18} color="#8E8E93" />
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Contoh: Nasi Goreng Spesial" placeholderTextColor="#C7C7CC" />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.catBtn, category === cat && styles.catBtnActive]} onPress={() => setCategory(cat)}>
                <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Harga (Rp) *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="cash-outline" size={18} color="#8E8E93" />
              <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="50000" keyboardType="numeric" placeholderTextColor="#C7C7CC" />
            </View>
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Stok *</Text>
            <View style={styles.inputBox}>
              <Ionicons name="layers-outline" size={18} color="#8E8E93" />
              <TextInput style={styles.input} value={stock} onChangeText={setStock} placeholder="100" keyboardType="numeric" placeholderTextColor="#C7C7CC" />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Deskripsi</Text>
          <View style={[styles.inputBox, { height: 100, alignItems: 'flex-start', paddingTop: 12 }]}>
            <Ionicons name="document-text-outline" size={18} color="#8E8E93" style={{ marginTop: 2 }} />
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={description} onChangeText={setDescription} placeholder="Deskripsi produk..." multiline placeholderTextColor="#C7C7CC" />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name={isEdit ? 'checkmark-circle' : 'add-circle'} size={22} color="#FFF" />
          <Text style={styles.saveBtnText}>{isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  scroll: { padding: 20, paddingBottom: 40 },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#1a1a2e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 14, height: 50, elevation: 2 },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1a1a2e' },
  row: { flexDirection: 'row' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', elevation: 1 },
  catBtnActive: { backgroundColor: '#1E88E5' },
  catBtnText: { fontSize: 13, fontWeight: '600', color: '#636366' },
  catBtnTextActive: { color: '#FFF' },
  imageSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, elevation: 2, alignItems: 'center' },
  imagePreview: { width: 140, height: 140, borderRadius: 16, backgroundColor: '#F2F2F7' },
  imageEditBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: '#1E88E5', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  imagePlaceholder: { width: 140, height: 140, borderRadius: 16, backgroundColor: '#F8F9FE', borderWidth: 2, borderColor: '#E5E5EA', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { fontSize: 12, color: '#C7C7CC', marginTop: 6, fontWeight: '500' },
  imageButtons: { flexDirection: 'row', marginTop: 14, gap: 10 },
  imgBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#1E88E5', gap: 6 },
  imgBtnText: { fontSize: 12, fontWeight: '600', color: '#1E88E5' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E88E5', borderRadius: 16, height: 54, marginTop: 10, elevation: 4, shadowColor: '#1E88E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginLeft: 8 },
});
