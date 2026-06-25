import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PURPLE = '#EE4D2D';
const TEXT = '#151A26';
const MUTED = '#6F7480';

const manageItems = [
  { title: 'Kelola Kategori', subtitle: 'Tambah, edit, dan hapus kategori', icon: 'pricetag', route: 'ManageCategories' },
  { title: 'Kelola Produk', subtitle: 'Tambah, edit, dan hapus', icon: 'cube', route: 'ManageProducts' },
  { title: 'Kelola Diskon', subtitle: 'Atur jenis dan nilai diskon', icon: 'ticket', route: 'ManageDiscounts' },
  { title: 'Kelola Kasir', subtitle: 'Tambah, edit, dan hapus data kasir', icon: 'people', route: 'ManageCashiers' },
  { title: 'Kelola Pelanggan', subtitle: 'Tambah, edit, dan hapus data pelanggan', icon: 'person', route: 'ManageCustomers' },
  { title: 'Kelola Printer', subtitle: 'Atur printer, header, dan footer', icon: 'print', route: 'ManagePrinter' },
  { title: 'Kelola QRIS', subtitle: 'Atur kode QRIS untuk pembayaran digital', icon: 'qr-code', route: 'ManageQris' },
];

function SettingItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.itemLeft}>
        <Ionicons name={item.icon} size={23} color={PURPLE} />
        <View style={styles.itemText}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A7ABB4" />
    </TouchableOpacity>
  );
}

function BusinessTab({ profile, setProfile }) {
  const baseline = {
    storeName: profile?.storeName || 'rrachel shop',
    address: profile?.address || 'Jl.Bengawan',
    phone: profile?.phone || '08123456789',
    email: profile?.email || 'feliciors8@gmail.com',
  };
  const [storeName, setStoreName] = useState(baseline.storeName);
  const [address, setAddress] = useState(baseline.address);
  const [phone, setPhone] = useState(baseline.phone);
  const [email, setEmail] = useState(baseline.email);
  const isChanged =
    storeName !== baseline.storeName ||
    address !== baseline.address ||
    phone !== baseline.phone ||
    email !== baseline.email;

  useEffect(() => {
    setStoreName(baseline.storeName);
    setAddress(baseline.address);
    setPhone(baseline.phone);
    setEmail(baseline.email);
  }, [profile]);

  const reset = () => {
    setStoreName(baseline.storeName);
    setAddress(baseline.address);
    setPhone(baseline.phone);
    setEmail(baseline.email);
  };

  const save = () => {
    setProfile?.({
      ...profile,
      storeName: storeName.trim() || 'rrachel shop',
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    Alert.alert('Berhasil', 'Data bisnis berhasil disimpan.');
  };

  return (
    <>
      <View style={styles.businessCard}>
        <Text style={styles.fieldLabel}>Nama Bisnis</Text>
        <TextInput style={styles.businessInput} value={storeName} onChangeText={setStoreName} />
        <Text style={styles.fieldLabel}>Alamat Bisnis</Text>
        <TextInput style={styles.businessInput} value={address} onChangeText={setAddress} />
        <Text style={styles.fieldLabel}>Nomor Telepon</Text>
        <TextInput style={styles.businessInput} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text style={styles.fieldLabel}>Email</Text>
        <TextInput style={styles.businessInput} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      </View>

      <View style={styles.businessFooter}>
        <TouchableOpacity style={styles.cancelButton} onPress={reset} activeOpacity={0.85}>
          <Text style={styles.cancelText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveChangesButton, !isChanged && styles.saveChangesDisabled]}
          onPress={save}
          disabled={!isChanged}
          activeOpacity={0.85}
        >
          <Text style={styles.saveChangesText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default function SettingsScreen({ navigation, profile, setProfile }) {
  const [tab, setTab] = useState('Kelola');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Kasir')} activeOpacity={0.85}>
          <Ionicons name="arrow-back" size={21} color="#69707F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.segment}>
          {['Kelola', 'Bisnis', 'Aplikasi'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.segmentItem, tab === item && styles.segmentItemActive]}
              onPress={() => setTab(item)}
              activeOpacity={0.85}
            >
              <Text style={[styles.segmentText, tab === item && styles.segmentTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.syncCard} activeOpacity={0.85}>
          <Ionicons name="cloud-upload-outline" size={22} color="#34699A" />
          <View style={styles.syncTextWrap}>
            <Text style={styles.syncTitle}>Sinkronisasi Cloud</Text>
            <Text style={styles.syncText}>
              Data tersimpan di perangkat Anda. Ketuk untuk mulai sinkronisasi.
              <Text style={styles.syncStrong}> Terakhir: Belum pernah</Text>
            </Text>
          </View>
        </TouchableOpacity>

        {tab === 'Kelola' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Kelola Data</Text>
            {manageItems.map((item) => (
              <SettingItem
                key={item.route}
                item={item}
                onPress={() => navigation.navigate(item.route)}
              />
            ))}
          </View>
        )}

        {tab === 'Bisnis' && <BusinessTab profile={profile} setProfile={setProfile} />}

        {tab === 'Aplikasi' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Aplikasi</Text>
            <SettingItem item={{ title: 'Mode Tampilan', subtitle: 'Gunakan tampilan standar kasir', icon: 'phone-portrait' }} />
            <SettingItem item={{ title: 'Tentang Aplikasi', subtitle: 'UMKM Go Digital', icon: 'information-circle' }} />
          </View>
        )}
      </ScrollView>
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
  headerTitle: { marginLeft: 12, fontSize: 18, fontWeight: '800', color: TEXT },
  content: { padding: 14, paddingBottom: 30 },
  segment: { flexDirection: 'row', backgroundColor: '#EFF1F5', borderRadius: 12, padding: 4 },
  segmentItem: { flex: 1, height: 38, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  segmentItemActive: { backgroundColor: PURPLE },
  segmentText: { color: '#424856', fontSize: 13, fontWeight: '700' },
  segmentTextActive: { color: '#FFF' },
  syncCard: {
    marginTop: 14,
    backgroundColor: '#EAF5FF',
    borderWidth: 1,
    borderColor: '#D5E9FA',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  syncTextWrap: { flex: 1, marginLeft: 10 },
  syncTitle: { color: '#274A70', fontSize: 12, fontWeight: '800' },
  syncText: { color: '#315D85', fontSize: 11, lineHeight: 16, marginTop: 4 },
  syncStrong: { fontWeight: '800' },
  sectionCard: {
    marginTop: 18,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E6E8EE',
  },
  sectionTitle: { color: TEXT, fontSize: 14, fontWeight: '800', marginBottom: 10 },
  settingItem: {
    minHeight: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  itemText: { flex: 1, marginLeft: 12 },
  itemTitle: { color: TEXT, fontSize: 14, fontWeight: '700' },
  itemSubtitle: { color: MUTED, fontSize: 11, marginTop: 3 },
  businessCard: {
    marginTop: 18,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E8EE',
  },
  fieldLabel: { color: '#4F5663', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  businessInput: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE1E8',
    backgroundColor: '#FAFBFD',
    paddingHorizontal: 14,
    color: TEXT,
    fontSize: 15,
    marginBottom: 16,
  },
  businessFooter: {
    marginTop: 280,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E8EAF0',
    padding: 14,
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#F1F2F5', justifyContent: 'center', alignItems: 'center' },
  cancelText: { color: MUTED, fontSize: 15, fontWeight: '800' },
  saveChangesButton: { flex: 1, height: 48, borderRadius: 12, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  saveChangesDisabled: { backgroundColor: '#CBD0DA' },
  saveChangesText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
