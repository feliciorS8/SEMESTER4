import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function TransactionCard({ transaction, product }) {
  const productName = product ? product.name : transaction.productName || 'Produk Dihapus';
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="receipt-outline" size={20} color="#6C63FF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardProduct} numberOfLines={1}>{productName}</Text>
            <Text style={styles.cardCustomer}>{transaction.customerName}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardTotal}>Rp {transaction.total.toLocaleString('id-ID')}</Text>
          <Text style={styles.cardQty}>{transaction.qty} x Rp {transaction.price.toLocaleString('id-ID')}</Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
        <Text style={styles.cardDate}>
          {new Date(transaction.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
        <Text style={styles.cardTime}>
          {new Date(transaction.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

export default function TransactionHistoryScreen({ transactions, products }) {
  const [filter, setFilter] = useState('all');

  const now = new Date();
  const filteredTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((t) => {
      if (filter === 'today') {
        const d = new Date(t.date);
        return d.toDateString() === now.toDateString();
      }
      if (filter === 'week') {
        const d = new Date(t.date);
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }
      return true;
    });

  const totalFiltered = filteredTransactions.reduce((s, t) => s + t.total, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Pendapatan</Text>
        <Text style={styles.summaryValue}>Rp {totalFiltered.toLocaleString('id-ID')}</Text>
        <Text style={styles.summaryCount}>{filteredTransactions.length} transaksi</Text>
      </View>

      <View style={styles.filterRow}>
        {[{ key: 'all', label: 'Semua' }, { key: 'today', label: 'Hari Ini' }, { key: 'week', label: '7 Hari' }].map((f) => (
          <TouchableOpacity key={f.key} style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="receipt-outline" size={56} color="#D1D1D6" />
          <Text style={styles.emptyText}>Belum ada transaksi</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const product = products.find((p) => p.id === item.productId);
            return <TransactionCard transaction={item} product={product} />;
          }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  summaryCard: { backgroundColor: '#6C63FF', marginHorizontal: 20, marginTop: 16, borderRadius: 20, padding: 24, alignItems: 'center', elevation: 6 },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  summaryValue: { fontSize: 28, fontWeight: '800', color: '#FFF', marginTop: 4 },
  summaryCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6, fontWeight: '500' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, marginBottom: 8, gap: 8 },
  filterBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', elevation: 1 },
  filterBtnActive: { backgroundColor: '#1a1a2e' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#636366' },
  filterTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginTop: 10, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(108,99,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardProduct: { fontSize: 14, fontWeight: '700', color: '#1a1a2e' },
  cardCustomer: { fontSize: 11, color: '#8E8E93', marginTop: 2, fontWeight: '500' },
  cardRight: { alignItems: 'flex-end' },
  cardTotal: { fontSize: 15, fontWeight: '800', color: '#4CAF50' },
  cardQty: { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  cardDate: { fontSize: 11, color: '#8E8E93', marginLeft: 6, flex: 1 },
  cardTime: { fontSize: 11, color: '#8E8E93', fontWeight: '600' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 15, fontWeight: '600', color: '#8E8E93', marginTop: 12 },
});
