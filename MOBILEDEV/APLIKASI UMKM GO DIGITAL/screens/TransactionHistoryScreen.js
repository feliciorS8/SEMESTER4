import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const BLUE = '#EE4D2D';
const TEXT = '#151A26';
const MUTED = '#6F7480';
const GREEN = '#16A765';
const RED = '#D64550';
const PAYMENT_METHODS = [
  { name: 'Tunai', icon: 'cash-outline', color: '#16A765', bg: '#DDFBEA' },
  { name: 'QRIS', icon: 'qr-code-outline', color: '#6865E8', bg: '#ECEBFF' },
  { name: 'Transfer', icon: 'swap-horizontal-outline', color: '#D99A18', bg: '#FFF4D9' },
  { name: 'Kasbon', icon: 'time', color: '#E14566', bg: '#FFE6EE' },
];

function formatRp(value) {
  return `Rp${Number(value || 0).toLocaleString('id-ID')}`;
}

function groupTransactions(transactions) {
  const map = {};
  transactions.forEach((item) => {
    const key = item.receiptId || item.id;
    if (!map[key]) {
      map[key] = {
        id: key,
        date: item.date,
        cashier: item.cashier || 'rrachel',
        customerName: item.customerName || 'Pelanggan Umum',
        paymentMethod: item.paymentMethod || 'Tunai',
        total: 0,
        items: [],
      };
    }
    map[key].total += item.total;
    map[key].items.push(item);
  });
  return Object.values(map).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function formatExportDate(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatExportTime(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatExportDay(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString('id-ID', { weekday: 'long' });
}

function Header({ title, actionLabel, onAction }) {
  return (
    <View style={styles.header}>
      <View style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#69707F" />
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.exportButton} onPress={onAction} activeOpacity={0.85}>
        <Ionicons name={actionLabel === 'Tambah' ? 'add' : 'download-outline'} size={18} color="#FFF" />
        <Text style={styles.exportText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

function Tabs({ active, onChange }) {
  const tabs = [
    { key: 'transactions', label: 'Transaksi', icon: 'receipt' },
    { key: 'expenses', label: 'Pengeluaran', icon: 'trending-down' },
    { key: 'report', label: 'Laporan', icon: 'analytics' },
  ];
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, active === tab.key && styles.tabActive]}
          onPress={() => onChange(tab.key)}
          activeOpacity={0.85}
        >
          <Ionicons name={tab.icon} size={17} color={active === tab.key ? '#FFF' : '#69707F'} />
          <Text style={[styles.tabText, active === tab.key && styles.tabTextActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TransactionCard({ group }) {
  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionTop}>
        <View style={styles.rowCenter}>
          <View style={styles.receiptIcon}>
            <Ionicons name="receipt" size={20} color={BLUE} />
          </View>
          <View>
            <Text style={styles.receiptId}>{group.id}</Text>
            <Text style={styles.dateText}>{new Date(group.date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.transactionTotal}>{formatRp(group.total)}</Text>
          <View style={styles.paymentPill}>
            <Ionicons name="cash-outline" size={15} color={GREEN} />
            <Text style={styles.paymentPillText}>{group.paymentMethod}</Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.transactionMeta}>
        <Text style={styles.metaText}>{group.items.length} item - {group.customerName}</Text>
        <View style={styles.cashierPill}>
          <Ionicons name="person-outline" size={15} color="#69707F" />
          <Text style={styles.metaText}>Kasir: {group.cashier}</Text>
        </View>
      </View>
      {group.items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemText}>{item.qty}x {item.productName}</Text>
          <Text style={styles.itemText}>{formatRp(item.total)}</Text>
        </View>
      ))}
    </View>
  );
}

function ExpenseModal({ visible, expense, onClose, onSave, onDelete }) {
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '');
  const [category, setCategory] = useState(expense?.category || 'Operasional');
  const [description, setDescription] = useState(expense?.description || '');
  const cats = ['Operasional', 'Gaji', 'Sewa', 'Bahan Baku', 'Listrik', 'Air', 'Internet'];

  React.useEffect(() => {
    setAmount(expense ? String(expense.amount) : '');
    setCategory(expense?.category || 'Operasional');
    setDescription(expense?.description || '');
  }, [expense, visible]);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{expense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#4F5663" />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Tanggal</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.inputText}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
          <Text style={styles.label}>Jumlah (Rp)</Text>
          <TextInput style={styles.input} value={amount} onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholder="25000" />
          <Text style={styles.label}>Kategori</Text>
          <TextInput style={styles.input} value={category} onChangeText={setCategory} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChips}>
            {cats.map((item) => (
              <TouchableOpacity key={item} style={styles.smallChip} onPress={() => setCategory(item)}>
                <Text style={styles.smallChipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.label}>Deskripsi (Opsional)</Text>
          <TextInput style={styles.textArea} value={description} onChangeText={setDescription} placeholder="Bayar token" multiline />
          {expense && (
            <TouchableOpacity style={styles.deleteExpense} onPress={() => onDelete(expense.id)}>
              <Text style={styles.deleteExpenseText}>Hapus Pengeluaran</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave({ id: expense?.id || Date.now().toString(), amount: Number(amount || 0), category, description, date: expense?.date || new Date().toISOString() })}
          >
            <Text style={styles.saveText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function TransactionHistoryScreen({ transactions, expenses = [], setExpenses, products }) {
  const [active, setActive] = useState('report');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const groups = useMemo(() => groupTransactions(transactions), [transactions]);
  const totalSales = transactions.reduce((sum, item) => sum + item.total, 0);
  const totalCost = transactions.reduce((sum, item) => sum + (Number(item.cost || 0) * Number(item.qty || 0)), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = transactions.reduce((sum, item) => sum + (Number(item.profit ?? (item.total - (Number(item.cost || 0) * Number(item.qty || 0))))), 0);
  const netProfit = grossProfit - totalExpenses;
  const soldByProduct = products.map((product) => {
    const sold = transactions.filter((trx) => trx.productId === product.id);
    const qty = sold.reduce((sum, item) => sum + item.qty, 0);
    const total = sold.reduce((sum, item) => sum + item.total, 0);
    const cost = sold.reduce((sum, item) => sum + (Number(item.cost || product.cost || 0) * Number(item.qty || 0)), 0);
    return { product, qty, total, cost, profit: total - cost };
  }).sort((a, b) => b.total - a.total);
  const lowStockProducts = products
    .filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0));
  const paymentSummary = PAYMENT_METHODS.map((method) => {
    const relatedGroups = groups.filter((group) => group.paymentMethod === method.name);
    return {
      ...method,
      count: relatedGroups.length,
      total: relatedGroups.reduce((sum, group) => sum + group.total, 0),
    };
  });

  const exportCsv = async () => {
    try {
      const header = ['Tanggal', 'Hari', 'Jam', 'ID Pesanan', 'Nama Pemesan', 'Pesanan', 'Metode Pembayaran', 'Dilayani Oleh', 'Total'];
      const rows = groups.map((group) => [
        formatExportDate(group.date),
        formatExportDay(group.date),
        formatExportTime(group.date),
        group.id,
        group.customerName || 'Pelanggan Umum',
        group.items.map((item) => `${item.qty}x ${item.productName}`).join(', '),
        group.paymentMethod || 'Tunai',
        group.cashier || 'rrachel',
        group.total,
      ]);
      const csv = `\uFEFF${[header, ...rows].map((row) => row.map(csvEscape).join(';')).join('\n')}`;
      const uri = `${FileSystem.cacheDirectory}laporan-penjualan.csv`;
      await FileSystem.writeAsStringAsync(uri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'text/csv', dialogTitle: 'Export Laporan Penjualan' });
      } else {
        Alert.alert('Export selesai', uri);
      }
    } catch (error) {
      Alert.alert('Export gagal', 'Coba ulangi export laporan.');
    }
  };

  const saveExpense = (expense) => {
    if (!setExpenses) return;
    setExpenses((current) => {
      const exists = current.some((item) => item.id === expense.id);
      return exists ? current.map((item) => (item.id === expense.id ? expense : item)) : [expense, ...current];
    });
    setModalOpen(false);
    setEditingExpense(null);
  };

  const deleteExpense = (id) => {
    if (!setExpenses) return;
    setExpenses((current) => current.filter((item) => item.id !== id));
    setModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title={active === 'expenses' ? 'Pengeluaran' : active === 'transactions' ? 'Transaksi' : 'Penjualan'}
        actionLabel={active === 'expenses' ? 'Tambah' : 'Export'}
        onAction={() => {
          if (active === 'expenses') {
            setEditingExpense(null);
            setModalOpen(true);
          } else {
            exportCsv();
          }
        }}
      />
      <Tabs active={active} onChange={setActive} />
      <View style={styles.filterBar}>
        <View>
          <Text style={styles.filterLabel}>FILTER AKTIF</Text>
          <Text style={styles.filterValue}>Hari Ini</Text>
        </View>
        <View style={styles.filterIcon}><Ionicons name="options-outline" size={22} color="#4F5663" /></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {active === 'transactions' && (
          groups.length === 0 ? <Empty icon="receipt-outline" text="Belum ada transaksi" /> : groups.map((group) => <TransactionCard key={group.id} group={group} />)
        )}

        {active === 'expenses' && (
          expenses.length === 0 ? <Empty icon="trending-down-outline" text="Belum ada pengeluaran" /> : expenses.map((item) => (
            <TouchableOpacity key={item.id} style={styles.expenseCard} onPress={() => { setEditingExpense(item); setModalOpen(true); }}>
              <View style={styles.expenseIcon}><Ionicons name="trending-down" size={21} color={RED} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.expenseTitle}>{item.category}</Text>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.expenseDesc}>{item.description || '-'}</Text>
              </View>
              <Text style={styles.expenseAmount}>{formatRp(item.amount)}</Text>
              <Ionicons name="chevron-forward" size={22} color="#A7ABB4" />
            </TouchableOpacity>
          ))
        )}

        {active === 'report' && (
          <>
            <View style={styles.statsGrid}>
              <Stat title="Total Penjualan" value={formatRp(totalSales)} icon="trending-up" />
              <Stat title="Keuntungan Kotor" value={formatRp(grossProfit)} icon="wallet" />
              <Stat title="Pengeluaran" value={formatRp(totalExpenses)} icon="trending-down" />
              <Stat title="Keuntungan Bersih" value={formatRp(netProfit)} icon="cash" />
              <Stat title="Transaksi" value={groups.length} icon="receipt" />
              <Stat title="Rata-rata/Trx" value={formatRp(groups.length ? totalSales / groups.length : 0)} icon="calculator" />
            </View>
            <View style={styles.reportCard}>
              <Text style={styles.sectionTitle}>Grafik Penjualan</Text>
              <View style={styles.chartBox}>
                <View style={[styles.bar, { height: Math.max(12, Math.min(130, totalSales / 500)) }]} />
              </View>
              <View style={styles.reportTotals}>
                <Text style={styles.reportSmall}>Total{'\n'}{formatRp(totalSales)}</Text>
                <Text style={styles.reportSmall}>Rata-rata{'\n'}{formatRp(groups.length ? totalSales / 24 : 0)}</Text>
                <Text style={styles.reportSmall}>Tertinggi{'\n'}{formatRp(totalSales)}</Text>
              </View>
            </View>
            <RankList title="Item Terjual" data={soldByProduct.filter((item) => item.qty > 0).slice(0, 3)} />
            <RankList title="Produk Tanpa Modal" data={products.filter((product) => !Number(product.cost || 0)).map((product) => ({ product, qty: 0, total: 0, cost: 0, profit: 0 })).slice(0, 6)} warning />
            <RankList title="Produk Terlaris" data={soldByProduct.slice(0, 3)} />
            <RankList title="Produk Paling Tidak Laku" data={[...soldByProduct].reverse().slice(0, 6)} />
            <LowStockList data={lowStockProducts} />
            <PaymentMethodReport data={paymentSummary} />
          </>
        )}
      </ScrollView>

      <ExpenseModal visible={modalOpen} expense={editingExpense} onClose={() => setModalOpen(false)} onSave={saveExpense} onDelete={deleteExpense} />
    </View>
  );
}

function Empty({ icon, text }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={44} color="#A7ABB4" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function Stat({ title, value, icon }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statIcon}><Ionicons name={icon} size={18} color={BLUE} /></View>
    </View>
  );
}

function RankList({ title, data, warning }) {
  return (
    <View style={styles.reportCard}>
      <View style={styles.rankHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {warning && <Text style={styles.warningText}>{data.length} produk belum diisi modal</Text>}
        </View>
        <View style={styles.rankBadge}><Text style={styles.rankBadgeText}>Top {Math.min(3, data.length)}</Text></View>
      </View>
      {data.map((item, index) => (
        <View key={`${item.product.id}-${index}`} style={styles.rankItem}>
          <View style={styles.rankNumber}><Text style={styles.rankNumberText}>#{index + 1}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rankName}>{item.product.name}</Text>
            <Text style={styles.rankSub}>{item.product.category} - {item.qty} terjual</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.rankTotal}>{formatRp(item.total)}</Text>
            <Text style={styles.rankSub}>{Number(item.product.cost || 0) ? `Untung: ${formatRp(item.profit || 0)}` : 'Modal: belum diisi'}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function LowStockList({ data }) {
  return (
    <View style={styles.reportCard}>
      <View style={styles.rankHeader}>
        <Text style={styles.sectionTitle}>Stok Menipis</Text>
        <View style={styles.warningBadge}><Text style={styles.warningBadgeText}>{data.length} Produk</Text></View>
      </View>
      {data.length === 0 ? (
        <View style={styles.lowStockEmpty}>
          <Ionicons name="cube-outline" size={44} color="#9AA3AF" />
          <Text style={styles.emptyText}>Tidak ada produk stok rendah</Text>
        </View>
      ) : (
        data.map((product) => (
          <View key={product.id} style={styles.stockRow}>
            <View style={styles.stockIcon}><Ionicons name="cube-outline" size={18} color={BLUE} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rankName}>{product.name}</Text>
              <Text style={styles.rankSub}>{product.category}</Text>
            </View>
            <Text style={styles.stockQty}>Sisa {product.stock}</Text>
          </View>
        ))
      )}
    </View>
  );
}

function PaymentMethodReport({ data }) {
  const totalAll = data.reduce((sum, item) => sum + item.total, 0);
  return (
    <View style={styles.reportCard}>
      <View style={styles.rankHeader}>
        <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
        <View style={styles.periodPill}><Text style={styles.periodText}>Periode: Hari Ini</Text></View>
      </View>
      {data.map((item) => (
        <View key={item.name} style={styles.paymentMethodRow}>
          <View style={[styles.methodIcon, { backgroundColor: item.bg }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodName}>{item.name}</Text>
            <Text style={styles.rankSub}>{item.count} transaksi</Text>
          </View>
          <Text style={styles.methodTotal}>{formatRp(item.total)}</Text>
          <Ionicons name="chevron-down" size={18} color="#A7ABB4" />
        </View>
      ))}
      <View style={styles.paymentTotalRow}>
        <Text style={styles.metaText}>Total Semua Metode</Text>
        <Text style={styles.methodTotal}>{formatRp(totalAll)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FB' },
  header: { backgroundColor: '#FFF', paddingTop: 50, paddingHorizontal: 18, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEF0F4' },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F1F2F5', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, marginLeft: 12, color: TEXT, fontSize: 20, fontWeight: '800' },
  exportButton: { height: 40, borderRadius: 10, backgroundColor: GREEN, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 7 },
  exportText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  tabs: { backgroundColor: '#FFF', flexDirection: 'row', padding: 14, gap: 10 },
  tab: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#F0F1F4', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  tabActive: { backgroundColor: BLUE },
  tabText: { color: '#4F5663', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: '#FFF' },
  filterBar: { backgroundColor: '#FFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EEF0F4', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterLabel: { color: MUTED, fontSize: 11, letterSpacing: 1 },
  filterValue: { color: TEXT, fontSize: 13, fontWeight: '700', marginTop: 4 },
  filterIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E0E3EA', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 34 },
  transactionCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E4E7ED', borderRadius: 14, padding: 14, marginBottom: 14 },
  transactionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  receiptIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFF0EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  receiptId: { color: TEXT, fontSize: 16, fontWeight: '800' },
  dateText: { color: MUTED, fontSize: 12, marginTop: 4 },
  transactionTotal: { color: TEXT, fontSize: 18, fontWeight: '800' },
  paymentPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DDFBEA', borderRadius: 18, paddingHorizontal: 10, paddingVertical: 5, marginTop: 6, gap: 5 },
  paymentPillText: { color: GREEN, fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#EEF0F4', marginVertical: 14 },
  transactionMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cashierPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, backgroundColor: '#F1F2F5', paddingHorizontal: 10, paddingVertical: 6, gap: 5 },
  metaText: { color: '#4F5663', fontSize: 13 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  itemText: { color: '#2F3540', fontSize: 14 },
  expenseCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E4E7ED', borderRadius: 14, padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  expenseIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFE3E6', alignItems: 'center', justifyContent: 'center' },
  expenseTitle: { color: TEXT, fontSize: 16, fontWeight: '800' },
  expenseDesc: { color: MUTED, fontSize: 13, marginTop: 4 },
  expenseAmount: { color: RED, fontSize: 16, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '48%', minHeight: 112, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E4E7ED', borderRadius: 12, padding: 14 },
  statTitle: { color: MUTED, fontSize: 12 },
  statValue: { color: TEXT, fontSize: 16, fontWeight: '800', marginTop: 16 },
  statIcon: { position: 'absolute', right: 14, top: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF0EB', justifyContent: 'center', alignItems: 'center' },
  reportCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E4E7ED', borderRadius: 14, padding: 16, marginTop: 16 },
  sectionTitle: { color: TEXT, fontSize: 16, fontWeight: '800' },
  chartBox: { height: 180, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 28, backgroundColor: GREEN, borderRadius: 8, borderWidth: 2, borderColor: '#F9C74F' },
  reportTotals: { borderTopWidth: 1, borderTopColor: '#EEF0F4', marginTop: 18, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  reportSmall: { color: '#4F5663', fontSize: 12, lineHeight: 20 },
  rankHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  rankBadge: { backgroundColor: '#DDFBEA', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  rankBadgeText: { color: GREEN, fontSize: 11, fontWeight: '800' },
  rankItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEF0F4' },
  rankNumber: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF0EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankNumberText: { color: BLUE, fontSize: 12, fontWeight: '800' },
  rankName: { color: TEXT, fontSize: 13, fontWeight: '700' },
  rankSub: { color: MUTED, fontSize: 11, marginTop: 3 },
  rankTotal: { color: TEXT, fontSize: 13, fontWeight: '800' },
  warningText: { color: '#B57A10', fontSize: 11, marginTop: 6 },
  warningBadge: { backgroundColor: '#FFF4D9', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  warningBadgeText: { color: '#B57A10', fontSize: 11, fontWeight: '800' },
  lowStockEmpty: { minHeight: 160, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEF0F4', marginTop: 12 },
  stockRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEF0F4' },
  stockIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF0EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stockQty: { color: '#B57A10', fontSize: 13, fontWeight: '800' },
  periodPill: { backgroundColor: '#F1F2F5', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  periodText: { color: '#4F5663', fontSize: 11, fontWeight: '700' },
  paymentMethodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#EEF0F4', gap: 12 },
  methodIcon: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  methodName: { color: TEXT, fontSize: 14, fontWeight: '700' },
  methodTotal: { color: TEXT, fontSize: 14, fontWeight: '800' },
  paymentTotalRow: { borderTopWidth: 1, borderTopColor: '#EEF0F4', paddingTop: 14, marginTop: 4, flexDirection: 'row', justifyContent: 'space-between' },
  empty: { minHeight: 420, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: MUTED, fontSize: 15, fontWeight: '700', marginTop: 10 },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  sheetTitle: { color: TEXT, fontSize: 20, fontWeight: '800' },
  label: { color: '#4F5663', fontSize: 13, marginBottom: 8 },
  readonlyInput: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#DDE1E8', backgroundColor: '#FAFBFD', justifyContent: 'center', paddingHorizontal: 14, marginBottom: 16 },
  input: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#DDE1E8', backgroundColor: '#FAFBFD', paddingHorizontal: 14, color: TEXT, fontSize: 15, marginBottom: 16 },
  inputText: { color: TEXT, fontSize: 15 },
  categoryChips: { gap: 8, marginTop: -6, marginBottom: 16 },
  smallChip: { backgroundColor: '#F0F1F4', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 7 },
  smallChipText: { color: '#4F5663', fontSize: 12, fontWeight: '700' },
  textArea: { minHeight: 110, borderRadius: 12, borderWidth: 1, borderColor: '#DDE1E8', backgroundColor: '#FAFBFD', paddingHorizontal: 14, paddingTop: 12, color: TEXT, fontSize: 15, marginBottom: 16, textAlignVertical: 'top' },
  deleteExpense: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#F2C5CB', backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  deleteExpenseText: { color: RED, fontSize: 15, fontWeight: '800' },
  saveButton: { height: 52, borderRadius: 12, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center' },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
