import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const PURPLE = '#EE4D2D';
const BLUE_DARK = '#D73211';
const TEXT = '#151A26';
const MUTED = '#6F7480';
const GREEN = '#16A765';
const RED = '#E73D4B';
const BLUE_SOFT = '#FFF0EB';
const RED_SOFT = '#FFE2E7';

const defaultCategories = [
  { id: 'cat-home', name: 'Kebutuhan Rumah', icon: 'home', visible: true },
  { id: 'cat-food', name: 'Makanan', icon: 'fast-food', visible: true },
  { id: 'cat-drink', name: 'Minuman', icon: 'cafe', visible: true },
  { id: 'cat-basic', name: 'Sembako', icon: 'cart', visible: true },
  { id: 'cat-other', name: 'Lainnya', icon: 'pricetag', visible: true },
];

const categoryIcons = [
  { name: 'Kebutuhan Rumah', icon: 'home' },
  { name: 'Makanan', icon: 'fast-food' },
  { name: 'Minuman', icon: 'cafe' },
  { name: 'Sembako', icon: 'cart' },
  { name: 'Lainnya', icon: 'pricetag' },
];

function imageFromAsset(asset) {
  if (asset?.base64) {
    return `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
  }
  return asset?.uri || null;
}

function Header({ navigation, title, addColor = PURPLE, showAdd = true, close = false, onAdd }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
        <Ionicons name={close ? 'close' : 'arrow-back'} size={21} color="#69707F" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {showAdd ? (
        <TouchableOpacity style={[styles.addButton, { backgroundColor: addColor }]} onPress={onAdd} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addText}>Tambah</Text>
        </TouchableOpacity>
      ) : <View style={styles.headerSpacer} />}
    </View>
  );
}

function Stats({ items }) {
  return (
    <View style={styles.statsCard}>
      {items.map((item) => (
        <View key={item.label} style={styles.statItem}>
          <Text style={[styles.statValue, item.color && { color: item.color }]}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function CircleAction({ icon, color, bg, onPress }) {
  return (
    <TouchableOpacity style={[styles.circleAction, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon} size={17} color={color} />
    </TouchableOpacity>
  );
}

export function CategoryManagementScreen({ navigation, categories = defaultCategories, setCategories, products = [], setProducts }) {
  const [editingCategory, setEditingCategory] = useState(undefined);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('pricetag');
  const categoryList = categories.length ? categories : defaultCategories;
  const visibleCount = categoryList.filter((item) => item.visible !== false).length;
  const hiddenCount = categoryList.length - visibleCount;

  const openAdd = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryIcon('pricetag');
  };

  const openEdit = (item) => {
    setEditingCategory(item);
    setCategoryName(item.name);
    setCategoryIcon(item.icon || 'pricetag');
  };

  const closeEditor = () => {
    setEditingCategory(undefined);
    setCategoryName('');
    setCategoryIcon('pricetag');
  };

  const saveCategory = () => {
    const name = categoryName.trim();
    if (!name) {
      Alert.alert('Nama kategori kosong', 'Isi nama kategori terlebih dahulu.');
      return;
    }
    const duplicated = categoryList.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.id !== editingCategory?.id);
    if (duplicated) {
      Alert.alert('Kategori sudah ada', 'Gunakan nama kategori lain.');
      return;
    }
    if (editingCategory) {
      setCategories?.(categoryList.map((item) => item.id === editingCategory.id ? { ...item, name, icon: categoryIcon } : item));
      if (editingCategory.name !== name) {
        setProducts?.(products.map((product) => product.category === editingCategory.name ? { ...product, category: name } : product));
      }
    } else {
      setCategories?.([
        ...categoryList,
        { id: `cat-${Date.now()}`, name, icon: categoryIcon, visible: true },
      ]);
    }
    closeEditor();
  };

  const toggleCategory = (item, value) => {
    setCategories?.(categoryList.map((category) => category.id === item.id ? { ...category, visible: value } : category));
  };

  const deleteCategory = (item) => {
    const usedCount = products.filter((product) => product.category === item.name).length;
    Alert.alert(
      'Hapus Kategori',
      usedCount ? `${usedCount} produk di kategori ini akan dipindahkan ke Lainnya.` : `Hapus kategori ${item.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            const hasOther = categoryList.some((category) => category.name === 'Lainnya' && category.id !== item.id);
            const nextCategories = categoryList.filter((category) => category.id !== item.id);
            setCategories?.(hasOther ? nextCategories : [...nextCategories, { id: 'cat-other', name: 'Lainnya', icon: 'pricetag', visible: true }]);
            setProducts?.(products.map((product) => product.category === item.name ? { ...product, category: 'Lainnya' } : product));
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <Header navigation={navigation} title="Kelola Kategori" addColor={GREEN} onAdd={openAdd} />
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <Stats items={[
          { value: categoryList.length, label: 'Total Kategori' },
          { value: visibleCount, label: 'Terlihat', color: GREEN },
          { value: hiddenCount, label: 'Tersembunyi' },
        ]} />

        {categoryList.map((item) => (
          <View key={item.name} style={styles.categoryCard}>
            <View style={styles.categoryLeft}>
              <View style={styles.categoryIcon}>
                <Ionicons name={item.icon || 'pricetag'} size={22} color="#FFF" />
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.visible !== false ? 'Terlihat' : 'Tersembunyi'}</Text>
              </View>
            </View>
            <View style={styles.rowActions}>
              <View style={styles.switchWrap}>
                <Switch
                  value={item.visible !== false}
                  onValueChange={(value) => toggleCategory(item, value)}
                  trackColor={{ false: '#E6E8EE', true: '#BFEFDB' }}
                  thumbColor={item.visible !== false ? '#19B884' : '#FFF'}
                />
                <Text style={styles.tinyLabel}>Tampil</Text>
              </View>
              <CircleAction icon="pencil" color="#EE4D2D" bg={BLUE_SOFT} onPress={() => openEdit(item)} />
              <CircleAction icon="trash" color={RED} bg={RED_SOFT} onPress={() => deleteCategory(item)} />
            </View>
          </View>
        ))}
      </ScrollView>
      <Modal transparent visible={editingCategory !== undefined} animationType="fade" onRequestClose={closeEditor}>
        <View style={styles.modalOverlay}>
          <View style={styles.categoryModal}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</Text>
              <TouchableOpacity onPress={closeEditor}>
                <Ionicons name="close" size={25} color="#4F5663" />
              </TouchableOpacity>
            </View>
            <Text style={styles.formLabel}>Nama Kategori</Text>
            <TextInput
              style={styles.inputLine}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Contoh: Kopi"
              placeholderTextColor="#A4A8B1"
            />
            <Text style={styles.formLabel}>Ikon</Text>
            <View style={styles.iconGrid}>
              {categoryIcons.map((item) => (
                <TouchableOpacity
                  key={item.icon}
                  style={[styles.iconChoice, categoryIcon === item.icon && styles.iconChoiceActive]}
                  onPress={() => setCategoryIcon(item.icon)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={item.icon} size={21} color={categoryIcon === item.icon ? '#FFF' : PURPLE} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveCategory} activeOpacity={0.85}>
              <Text style={styles.saveText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function DiscountManagementScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Header navigation={navigation} title="Kelola Diskon" addColor={GREEN} />
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <Stats items={[
          { value: 0, label: 'Total Diskon' },
          { value: 0, label: 'Aktif', color: GREEN },
          { value: 0, label: 'Nominal', color: BLUE_DARK },
        ]} />
        <View style={styles.centerEmpty}>
          <Ionicons name="pricetag-outline" size={58} color="#9AA3AF" />
          <Text style={styles.emptyTitle}>Belum ada diskon</Text>
          <Text style={styles.emptySubtitle}>Tambah diskon pertama Anda</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export function CashierManagementScreen({ navigation, profile, cashiers = [], setCashiers, activeCashier }) {
  const [active, setActive] = useState(true);
  const ownerName = activeCashier?.name || profile?.ownerName || 'rrachel';
  const email = activeCashier?.email || profile?.email || 'feliciors8@gmail.com';
  const addCashier = () => {
    const nextNumber = cashiers.length + 1;
    setCashiers?.([...cashiers, {
      id: `kasir-${Date.now()}`,
      name: `kasir ${nextNumber}`,
      email: `kasir${nextNumber}@example.com`,
      role: 'kasir',
      phone: '081200000000',
      pin: '1234',
      active: true,
    }]);
  };

  return (
    <View style={styles.screen}>
      <Header navigation={navigation} title="Kelola Kasir" />
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.activeBox}>
          <Text style={styles.activeLabel}>Kasir Aktif (Sedang Bertugas)</Text>
          <Text style={styles.activeName}>{ownerName}</Text>
          <Text style={styles.activeMeta}>owner - {email}</Text>
        </View>

        <View style={styles.largeSearch}>
          <Ionicons name="search" size={22} color="#69707F" />
          <TextInput style={styles.searchInput} placeholder="Cari kasir..." placeholderTextColor="#A4A8B1" />
        </View>

        <Stats items={[
          { value: 1, label: 'Total Kasir' },
          { value: active ? 1 : 0, label: 'Aktif', color: GREEN },
        ]} />

        <TouchableOpacity style={styles.addCashierMini} onPress={addCashier}>
          <Ionicons name="add" size={17} color="#FFF" />
          <Text style={styles.addCashierMiniText}>Tambah Kasir Demo</Text>
        </TouchableOpacity>

        {(cashiers.length ? cashiers : [{ id: 'owner', name: ownerName, email, role: 'owner', phone: '08123456789', active: true }]).map((cashier) => (
          <View key={cashier.id} style={styles.cashierCard}>
            <View style={styles.cashierAvatar}>
              <Ionicons name="person-circle" size={42} color="#FFF" />
            </View>
            <View style={styles.cashierInfo}>
              <Text style={styles.cardTitle}>{cashier.name}</Text>
              <Text style={styles.cardSubtitle}>{cashier.email}</Text>
              <Text style={styles.cardSubtitle}>{cashier.phone} - {cashier.role}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{cashier.active ? 'Aktif' : 'Nonaktif'}</Text>
              </View>
            </View>
            <View style={styles.rowActions}>
              <Switch
                value={cashier.active}
                onValueChange={(value) => {
                  setCashiers?.(cashiers.map((item) => item.id === cashier.id ? { ...item, active: value } : item));
                  if (cashier.id === 'owner') setActive(value);
                }}
                trackColor={{ false: '#E6E8EE', true: '#BFEFDB' }}
                thumbColor={cashier.active ? '#19B884' : '#FFF'}
              />
              <CircleAction icon="pencil" color="#EE4D2D" bg={BLUE_SOFT} />
              <CircleAction icon="trash" color={RED} bg={RED_SOFT} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function CustomerManagementScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Header navigation={navigation} title="Kelola Pelanggan" />
      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.searchWithCog}>
          <View style={[styles.largeSearch, { flex: 1, marginTop: 0 }]}>
            <Ionicons name="search" size={22} color="#69707F" />
            <TextInput style={styles.searchInput} placeholder="Cari pelanggan..." placeholderTextColor="#A4A8B1" />
          </View>
          <TouchableOpacity style={styles.cogButton} activeOpacity={0.85}>
            <Ionicons name="settings-outline" size={23} color="#505765" />
          </TouchableOpacity>
        </View>

        <Stats items={[
          { value: 0, label: 'Total' },
          { value: 0, label: 'Aktif', color: GREEN },
          { value: 0, label: 'VIP', color: '#D69212' },
          { value: 0, label: 'Baru', color: '#2B6EDC' },
        ]} />

        <View style={styles.centerEmpty}>
          <Ionicons name="people-outline" size={58} color="#9AA3AF" />
          <Text style={styles.emptyTitle}>Belum ada pelanggan</Text>
          <TouchableOpacity style={styles.primaryWideButton} activeOpacity={0.85}>
            <Text style={styles.primaryWideText}>Tambah Pelanggan Pertama</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export function PrinterSettingsScreen({ navigation, profile }) {
  const [paper, setPaper] = useState('80mm');
  const [logo, setLogo] = useState(true);
  const [payment, setPayment] = useState(true);

  return (
    <View style={styles.screen}>
      <Header navigation={navigation} title="Kelola Printer" showAdd={false} close />
      <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBox}>
          <Ionicons name="bluetooth" size={20} color="#A8202C" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.warningTitle}>Status Printer</Text>
            <Text style={styles.warningText}>Tidak Terhubung</Text>
          </View>
          <TouchableOpacity style={styles.connectButton} activeOpacity={0.85}>
            <Text style={styles.connectText}>Hubungkan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paperBox}>
          <Text style={styles.formLabel}>Ukuran Kertas</Text>
          <View style={styles.paperOptions}>
            {['58mm', '80mm'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.paperOption, paper === item && styles.paperOptionActive]}
                onPress={() => setPaper(item)}
                activeOpacity={0.85}
              >
                <Text style={[styles.paperText, paper === item && styles.paperTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ToggleRow title="Cetak Logo" subtitle="Tampilkan logo toko di struk" value={logo} onValueChange={setLogo} />
        <DashedUpload icon="camera" title="Tambah Logo Struk" subtitle="Ketuk untuk memilih dari galeri atau ambil foto baru" />
        <ToggleRow title="Metode Pembayaran" subtitle="Tampilkan info metode pembayaran" value={payment} onValueChange={setPayment} />

        <View style={styles.formRowBetween}>
          <Text style={styles.formLabel}>Header Struk</Text>
          <View />
        </View>
        <View style={styles.textArea}>
          <Text style={styles.textAreaText}>
            {profile?.address || 'Jl. Bengawan'}{'\n'}
            Tel: {profile?.phone || '08123456789'}{'\n'}
            feliciors8@gmail.com
          </Text>
        </View>
        <Text style={styles.noteText}>Header struk mengikuti profil toko.</Text>

        <TouchableOpacity style={styles.secondaryWideButton} activeOpacity={0.85}>
          <Ionicons name="eye-outline" size={20} color="#3B4351" />
          <Text style={styles.secondaryWideText}>Preview Struk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.disabledButton} activeOpacity={0.85}>
          <Text style={styles.disabledButtonText}>Simpan Pengaturan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function QrisSettingsScreen({ navigation, profile, setProfile }) {
  const [active, setActive] = useState(profile?.qrisActive ?? true);
  const [merchant, setMerchant] = useState(profile?.qrisMerchant || profile?.storeName || '');
  const [qrisImage, setQrisImage] = useState(profile?.qrisImage || null);

  const pickQris = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.25,
      base64: true,
    });
    if (!result.canceled) {
      const nextImage = imageFromAsset(result.assets[0]);
      if (nextImage) setQrisImage(nextImage);
    }
  };

  const saveQris = () => {
    setProfile?.({ ...profile, qrisActive: active, qrisMerchant: merchant, qrisImage });
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <Header navigation={navigation} title="Kelola QRIS" showAdd={false} close />
      <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <View style={styles.qrisStatus}>
          <View>
            <Text style={styles.qrisTitle}>Status QRIS</Text>
            <Text style={styles.cardSubtitle}>{qrisImage ? 'QRIS sudah diunggah' : 'Belum ada QRIS'}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Aktif</Text>
          </View>
        </View>

        <Text style={styles.formLabel}>Nama Merchant</Text>
        <TextInput style={styles.inputLine} value={merchant} onChangeText={setMerchant} />

        <Text style={styles.formLabel}>Gambar QRIS</Text>
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.85} onPress={pickQris}>
          {qrisImage ? (
            <Image source={{ uri: qrisImage }} style={styles.qrisPreview} />
          ) : (
            <>
              <View style={styles.uploadIcon}>
                <Ionicons name="cloud-upload-outline" size={28} color="#6F7480" />
              </View>
              <Text style={styles.uploadTitle}>Unggah Gambar QRIS</Text>
              <Text style={styles.uploadSubtitle}>Tap untuk memilih gambar</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.noteText}>Unggah gambar QR Code QRIS dari aplikasi bank atau payment gateway Anda</Text>

        <ToggleRow title="Aktifkan QRIS" subtitle="Tampilkan opsi pembayaran QRIS di checkout" value={active} onValueChange={setActive} />

        <TouchableOpacity style={[styles.disabledButton, { backgroundColor: PURPLE }]} activeOpacity={0.85} onPress={saveQris}>
          <Text style={styles.disabledButtonText}>Simpan Pengaturan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ToggleRow({ title, subtitle, value, onValueChange }) {
  return (
    <View style={styles.toggleRow}>
      <View>
        <Text style={styles.formLabel}>{title}</Text>
        <Text style={styles.toggleSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E6E8EE', true: '#BFEFDB' }}
        thumbColor={value ? '#64C9BE' : '#FFF'}
      />
    </View>
  );
}

function DashedUpload({ icon, title, subtitle }) {
  return (
    <TouchableOpacity style={styles.uploadBox} activeOpacity={0.85}>
      <View style={styles.uploadIcon}>
        <Ionicons name={icon} size={28} color="#6F7480" />
      </View>
      <Text style={styles.uploadTitle}>{title}</Text>
      <Text style={styles.uploadSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FB' },
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
  headerSpacer: { width: 40 },
  addButton: { height: 40, paddingHorizontal: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  addText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  pageContent: { padding: 14, paddingBottom: 34 },
  formContent: { padding: 18, paddingBottom: 34, backgroundColor: '#FFF' },
  statsCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E7ED',
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: TEXT, fontSize: 21, fontWeight: '800' },
  statLabel: { color: '#4F5663', fontSize: 12, marginTop: 3 },
  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7ED',
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryLeft: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
  categoryIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTitle: { color: TEXT, fontSize: 15, fontWeight: '800' },
  cardSubtitle: { color: MUTED, fontSize: 12, marginTop: 4 },
  rowActions: { flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: 6 },
  switchWrap: { alignItems: 'center' },
  tinyLabel: { color: MUTED, fontSize: 11, marginTop: 2 },
  circleAction: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'center', padding: 20 },
  categoryModal: { backgroundColor: '#FFF', borderRadius: 16, padding: 16 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sheetTitle: { color: TEXT, fontSize: 18, fontWeight: '800' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  iconChoice: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF0EB', borderWidth: 1, borderColor: '#FFD2C7', justifyContent: 'center', alignItems: 'center' },
  iconChoiceActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  saveButton: { height: 48, borderRadius: 10, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  saveText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  centerEmpty: { flex: 1, minHeight: 430, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { color: MUTED, fontSize: 17, fontWeight: '600', marginTop: 12 },
  emptySubtitle: { color: '#A2A7B0', fontSize: 14, marginTop: 10 },
  activeBox: {
    backgroundColor: '#EEFFF5',
    borderWidth: 1,
    borderColor: '#BEEFD3',
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
  },
  activeLabel: { color: '#2E7D50', fontSize: 14, fontWeight: '700' },
  activeName: { color: '#1F4F33', fontSize: 16, fontWeight: '800', marginTop: 10 },
  activeMeta: { color: '#2E7D50', fontSize: 13, marginTop: 5 },
  largeSearch: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F0F1F4',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, color: TEXT },
  cashierCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4E7ED',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cashierAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFD0C4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cashierInfo: { flex: 1 },
  addCashierMini: { alignSelf: 'flex-start', height: 36, borderRadius: 9, paddingHorizontal: 12, backgroundColor: PURPLE, flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  addCashierMiniText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  statusPill: { alignSelf: 'flex-start', backgroundColor: '#DDFBEA', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, marginTop: 8 },
  statusPillText: { color: '#179757', fontSize: 12, fontWeight: '700' },
  searchWithCog: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  cogButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DCE0E7', justifyContent: 'center', alignItems: 'center' },
  primaryWideButton: { marginTop: 24, height: 48, minWidth: 260, borderRadius: 10, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  primaryWideText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  warningBox: { backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#F1CCCC', borderRadius: 12, padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  warningTitle: { color: '#8D2931', fontSize: 14, fontWeight: '700' },
  warningText: { color: '#B02C37', fontSize: 13, marginTop: 6 },
  connectButton: { backgroundColor: '#EE4D2D', borderRadius: 9, height: 38, paddingHorizontal: 14, justifyContent: 'center' },
  connectText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  paperBox: { backgroundColor: '#F8F9FB', borderWidth: 1, borderColor: '#E3E6ED', borderRadius: 12, padding: 13, marginBottom: 18 },
  formLabel: { color: '#3F4654', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  paperOptions: { flexDirection: 'row' },
  paperOption: { flex: 1, height: 46, borderRadius: 8, borderWidth: 1, borderColor: '#E0E3EA', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  paperOptionActive: { borderColor: PURPLE, backgroundColor: '#FFF0EB' },
  paperText: { color: '#5B6170', fontSize: 14, fontWeight: '700' },
  paperTextActive: { color: BLUE_DARK },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  toggleSubtitle: { color: MUTED, fontSize: 12, marginTop: -3 },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DC',
    borderRadius: 12,
    minHeight: 142,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  uploadIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#EEF0F4', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  qrisPreview: { width: 190, height: 190, borderRadius: 12, backgroundColor: '#FFF' },
  uploadTitle: { color: '#606776', fontSize: 15, fontWeight: '700' },
  uploadSubtitle: { color: '#A2A7B0', fontSize: 12, marginTop: 6 },
  formRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  textArea: { minHeight: 96, borderRadius: 8, borderWidth: 1, borderColor: '#DEE2E8', padding: 12, justifyContent: 'center' },
  textAreaText: { color: MUTED, fontSize: 14, lineHeight: 21 },
  noteText: { color: MUTED, fontSize: 12, lineHeight: 18, marginTop: 7, marginBottom: 15 },
  secondaryWideButton: { height: 50, borderRadius: 10, backgroundColor: '#F0F1F4', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 6 },
  secondaryWideText: { color: '#3B4351', fontSize: 15, fontWeight: '800' },
  disabledButton: { height: 54, borderRadius: 10, backgroundColor: '#CCD1DB', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 14 },
  disabledButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  qrisStatus: { backgroundColor: '#F7F8FB', borderRadius: 12, padding: 16, marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  qrisTitle: { color: TEXT, fontSize: 18, fontWeight: '500', marginBottom: 12 },
  inputLine: { height: 46, borderRadius: 8, borderWidth: 1, borderColor: '#CDD1D8', paddingHorizontal: 12, fontSize: 14, color: TEXT, marginBottom: 16 },
});
