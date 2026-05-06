import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileInfoCard({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIcon}>
          <Ionicons name={icon} size={18} color="#6C63FF" />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function StatBox({ value, label, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, { color }]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation, profile, transactions, onRefresh }) {
  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0);
  const totalTx = transactions.length;

  const handleClearData = () => {
    Alert.alert('Reset Data', 'Semua data produk dan transaksi akan dihapus. Lanjutkan?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['products', 'transactions']);
          onRefresh();
          Alert.alert('Berhasil', 'Semua data telah direset.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 40 }}>🏪</Text>
        </View>
        <Text style={styles.storeName}>{profile.storeName}</Text>
        <Text style={styles.ownerName}>{profile.ownerName}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{profile.category}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.statsRow}>
          <StatBox value={totalTx} label="Transaksi" color="#6C63FF" />
          <View style={styles.statDivider} />
          <StatBox value={`Rp ${(totalRevenue / 1000).toFixed(0)}K`} label="Pendapatan" color="#4CAF50" />
        </View>

        <View style={styles.infoCard}>
          <ProfileInfoCard icon="call-outline" label="Telepon" value={profile.phone} />
          <ProfileInfoCard icon="location-outline" label="Alamat" value={profile.address} />
          <ProfileInfoCard icon="briefcase-outline" label="Kategori" value={profile.category} />
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.8}>
          <Ionicons name="create-outline" size={20} color="#FFF" />
          <Text style={styles.editBtnText}>Edit Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={handleClearData} activeOpacity={0.8}>
          <Ionicons name="refresh-outline" size={20} color="#FF6B6B" />
          <Text style={styles.resetBtnText}>Reset Semua Data</Text>
        </TouchableOpacity>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Tentang Aplikasi</Text>
          <Text style={styles.aboutText}>UMKM Go Digital v1.0.0</Text>
          <Text style={styles.aboutText}>Aplikasi digitalisasi UMKM untuk mengelola produk, transaksi, dan bisnis dalam satu platform.</Text>
          <Text style={styles.aboutText}>UTS Mobile Development - React Native</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { backgroundColor: '#FFF', paddingTop: 55, paddingBottom: 24, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  avatar: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(108,99,255,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(108,99,255,0.2)' },
  storeName: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginTop: 12 },
  ownerName: { fontSize: 14, color: '#8E8E93', fontWeight: '500', marginTop: 2 },
  categoryBadge: { backgroundColor: 'rgba(108,99,255,0.1)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  categoryText: { fontSize: 12, fontWeight: '700', color: '#6C63FF' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  statsRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 20, elevation: 2, alignItems: 'center' },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxValue: { fontSize: 22, fontWeight: '800' },
  statBoxLabel: { fontSize: 12, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
  statDivider: { width: 1, height: 40, backgroundColor: '#F2F2F7' },
  infoCard: { backgroundColor: '#FFF', borderRadius: 16, marginTop: 16, padding: 4, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  infoLeft: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(108,99,255,0.08)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  infoLabel: { fontSize: 13, color: '#636366', fontWeight: '500' },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#1a1a2e', maxWidth: '45%' },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6C63FF', borderRadius: 16, height: 54, marginTop: 20, elevation: 4 },
  editBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF', marginLeft: 8 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,107,107,0.08)', borderRadius: 16, height: 50, marginTop: 12, borderWidth: 1.5, borderColor: 'rgba(255,107,107,0.2)' },
  resetBtnText: { fontSize: 14, fontWeight: '600', color: '#FF6B6B', marginLeft: 8 },
  aboutCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginTop: 20, elevation: 2 },
  aboutTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  aboutText: { fontSize: 12, color: '#8E8E93', lineHeight: 20 },
});
