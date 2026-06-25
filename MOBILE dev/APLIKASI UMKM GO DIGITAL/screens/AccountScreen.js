import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#EE4D2D';
const TEXT = '#151A26';
const MUTED = '#6F7480';

function Field({ icon, value, onChangeText, placeholder, secure }) {
  return (
    <View style={styles.inputBox}>
      <Ionicons name={icon} size={22} color="#9AA3AF" />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8AFBA"
        secureTextEntry={secure}
      />
      {secure && <Ionicons name="eye-outline" size={22} color="#9AA3AF" />}
    </View>
  );
}

export default function AccountScreen({ navigation, profile, setProfile, activeCashier }) {
  const [name, setName] = useState(activeCashier?.name || profile?.ownerName || 'rrachel');
  const [email, setEmail] = useState(activeCashier?.email || profile?.email || 'feliciors8@gmail.com');
  const [whatsapp, setWhatsapp] = useState(activeCashier?.phone || profile?.phone || '08123456789');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const save = () => {
    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Password tidak sama', 'Konfirmasi password baru belum cocok.');
      return;
    }
    setProfile({ ...profile, ownerName: name.trim() || profile.ownerName, phone: whatsapp.trim() || profile.phone });
    Alert.alert('Berhasil', 'Profil akun kasir disimpan.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#69707F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil Akun</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Pribadi</Text>
          <Text style={styles.label}>Nama</Text>
          <Field icon="person-outline" value={name} onChangeText={setName} />
          <Text style={styles.label}>Email</Text>
          <Field icon="mail-outline" value={email} onChangeText={setEmail} />
          <Text style={styles.label}>WhatsApp</Text>
          <Field icon="logo-whatsapp" value={whatsapp} onChangeText={setWhatsapp} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Keamanan</Text>
          <Text style={styles.label}>Password Lama</Text>
          <Field icon="lock-closed-outline" value={oldPassword} onChangeText={setOldPassword} placeholder="Masukkan password lama" secure />
          <Text style={styles.label}>Password Baru</Text>
          <Field icon="lock-closed-outline" value={newPassword} onChangeText={setNewPassword} placeholder="Masukkan password baru" secure />
          <Text style={styles.label}>Konfirmasi Password Baru</Text>
          <Field icon="lock-closed-outline" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Ulangi password baru" secure />
          <Text style={styles.note}>Kosongkan semua field password jika tidak ingin mengubah password.</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('CashierLogin')}>
          <Ionicons name="log-out-outline" size={22} color="#E54B57" />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FB' },
  header: { backgroundColor: '#FFF', paddingTop: 50, paddingHorizontal: 18, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEF0F4' },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F1F2F5', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { marginLeft: 14, color: TEXT, fontSize: 20, fontWeight: '800' },
  content: { padding: 18, paddingBottom: 34 },
  card: { backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E4E7ED', padding: 16, marginBottom: 18 },
  cardTitle: { color: TEXT, fontSize: 17, fontWeight: '800', marginBottom: 18 },
  label: { color: '#4F5663', fontSize: 13, marginBottom: 8 },
  inputBox: { height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#DDE1E8', backgroundColor: '#FAFBFD', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 16 },
  input: { flex: 1, marginLeft: 12, color: TEXT, fontSize: 15 },
  note: { color: MUTED, fontSize: 12, lineHeight: 18 },
  saveButton: { height: 52, borderRadius: 12, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center' },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  logoutButton: { height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#F1C9CE', backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 16 },
  logoutText: { color: '#E54B57', fontSize: 15, fontWeight: '800' },
});
