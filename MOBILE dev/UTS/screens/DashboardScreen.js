import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function StatCard({ icon, iconColor, bgColor, label, value }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: iconColor }]}>
      <View style={[styles.statIconBox, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function QuickAction({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function RecentItem({ item, product }) {
  const productName = product ? product.name : 'Produk Dihapus';
  return (
    <View style={styles.recentItem}>
      <View style={styles.recentLeft}>
        <View style={styles.recentDot} />
        <View>
          <Text style={styles.recentName}>{productName}</Text>
          <Text style={styles.recentDate}>
            {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>
      <View style={styles.recentRight}>
        <Text style={styles.recentQty}>{item.qty}x</Text>
        <Text style={styles.recentTotal}>Rp {item.total.toLocaleString('id-ID')}</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen({ navigation, products, transactions, profile }) {
  const totalProducts = products.length;
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalItemsSold = transactions.reduce((sum, t) => sum + t.qty, 0);
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Selamat Datang 👋</Text>
            <Text style={styles.storeName}>{profile.storeName}</Text>
          </View>
          <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('TransactionHistory')}>
            <Ionicons name="time-outline" size={22} color="#6C63FF" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.statsGrid}>
          <StatCard icon="cube" iconColor="#6C63FF" bgColor="rgba(108,99,255,0.1)" label="Total Produk" value={totalProducts} />
          <StatCard icon="receipt" iconColor="#00CED1" bgColor="rgba(0,206,209,0.1)" label="Transaksi" value={totalTransactions} />
          <StatCard icon="cash" iconColor="#4CAF50" bgColor="rgba(76,175,80,0.1)" label="Pendapatan" value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} />
          <StatCard icon="trending-up" iconColor="#FF6B6B" bgColor="rgba(255,107,107,0.1)" label="Item Terjual" value={totalItemsSold} />
        </View>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickActions}>
          <QuickAction icon="add-circle" label="Tambah Produk" color="#6C63FF" onPress={() => navigation.navigate('AddProduct')} />
          <QuickAction icon="cart" label="Buat Transaksi" color="#00CED1" onPress={() => navigation.navigate('Transaksi')} />
          <QuickAction icon="list" label="Riwayat" color="#FF6B6B" onPress={() => navigation.navigate('TransactionHistory')} />
          <QuickAction icon="person" label="Profil" color="#4CAF50" onPress={() => navigation.navigate('Profil')} />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
          {transactions.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          )}
        </View>
        {recentTransactions.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={48} color="#D1D1D6" />
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
            <Text style={styles.emptySubtext}>Mulai catat transaksi pertama Anda</Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentTransactions.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return <RecentItem key={item.id} item={item} product={product} />;
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { backgroundColor: '#FFF', paddingTop: 55, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 5 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, color: '#8E8E93', fontWeight: '500' },
  storeName: { fontSize: 22, fontWeight: '800', color: '#1a1a2e', marginTop: 4 },
  historyBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(108,99,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: (width - 52) / 2, backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 3, elevation: 2 },
  statIconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  statInfo: { flex: 1 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#1a1a2e' },
  statLabel: { fontSize: 11, color: '#8E8E93', marginTop: 2, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginTop: 24, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontSize: 13, color: '#6C63FF', fontWeight: '600', marginTop: 24 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', width: (width - 60) / 4 },
  quickActionIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionLabel: { fontSize: 11, color: '#636366', fontWeight: '600', textAlign: 'center' },
  emptyBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 40, alignItems: 'center', marginTop: 4 },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#8E8E93', marginTop: 12 },
  emptySubtext: { fontSize: 12, color: '#C7C7CC', marginTop: 4 },
  recentList: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', marginTop: 4 },
  recentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  recentLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  recentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6C63FF', marginRight: 12 },
  recentName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  recentDate: { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  recentRight: { alignItems: 'flex-end' },
  recentQty: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
  recentTotal: { fontSize: 14, fontWeight: '700', color: '#4CAF50', marginTop: 2 },
});
