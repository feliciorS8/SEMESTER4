import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation, profile, setProfile }) {
  const [storeName, setStoreName] = useState(profile.storeName);
  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [category, setCategory] = useState(profile.category);

  const categories = ['Makanan & Minuman', 'Fashion', 'Elektronik', 'Kerajinan Tangan', 'Jasa', 'Lainnya'];

  const handleSave = () => {
    if (!storeName.trim() || !ownerName.trim()) {
      Alert.alert('Error', 'Nama toko dan pemilik harus diisi!');
      return;
    }
    setProfile({
      storeName: storeName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      category,
    });
    Alert.alert('Berhasil', 'Profil berhasil diperbarui!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 40 }}>🏪</Text>
          </View>
          <Text style={styles.avatarLabel}>Profil Toko UMKM</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Toko *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="storefront-outline" size={18} color="#8E8E93" />
            <TextInput style={styles.input} value={storeName} onChangeText={setStoreName} placeholder="Nama toko Anda" placeholderTextColor="#C7C7CC" />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Pemilik *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={18} color="#8E8E93" />
            <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} placeholder="Nama pemilik" placeholderTextColor="#C7C7CC" />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>No. Telepon</Text>
          <View style={styles.inputBox}>
            <Ionicons name="call-outline" size={18} color="#8E8E93" />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="08xxxxxxxxxx" keyboardType="phone-pad" placeholderTextColor="#C7C7CC" />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Alamat</Text>
          <View style={[styles.inputBox, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
            <Ionicons name="location-outline" size={18} color="#8E8E93" style={{ marginTop: 2 }} />
            <TextInput style={[styles.input, { height: 60, textAlignVertical: 'top' }]} value={address} onChangeText={setAddress} placeholder="Alamat lengkap" multiline placeholderTextColor="#C7C7CC" />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori Usaha</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.catBtn, category === cat && styles.catBtnActive]} onPress={() => setCategory(cat)}>
                <Text style={[styles.catBtnText, category === cat && styles.catBtnTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle" size={22} color="#FFF" />
          <Text style={styles.saveBtnText}>Simpan Profil</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  scroll: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(108,99,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(108,99,255,0.2)' },
  avatarLabel: { fontSize: 14, color: '#8E8E93', fontWeight: '500', marginTop: 10 },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: '#1a1a2e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 14, height: 50, elevation: 2 },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1a1a2e' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', elevation: 1 },
  catBtnActive: { backgroundColor: '#EE4D2D' },
  catBtnText: { fontSize: 12, fontWeight: '600', color: '#636366' },
  catBtnTextActive: { color: '#FFF' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EE4D2D', borderRadius: 16, height: 54, marginTop: 10, elevation: 4 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF', marginLeft: 8 },
});
