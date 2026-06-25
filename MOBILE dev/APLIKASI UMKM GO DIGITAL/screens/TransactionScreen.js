import React, { useMemo, useState } from 'react';
import { Alert, Linking, Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Storage from '../storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Toast from '../components/Toast';

const PURPLE = '#EE4D2D';
const BLUE_DARK = '#D73211';
const TEXT = '#151A26';
const MUTED = '#6F7480';

function productCode(product) {
  const initials = product.name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  return `${initials || 'PR'}${String(product.stock || 0).slice(0, 1)}`;
}

function calculateDiscount(subtotal, type, value) {
  const numeric = Number(value) || 0;
  if (type === 'percent') {
    return Math.min(subtotal, Math.round((subtotal * numeric) / 100));
  }
  return Math.min(subtotal, numeric);
}

function formatFullDate(value) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildReceiptHtml(receipt, profile) {
  const rows = (receipt?.items || []).map((item) => `
    <tr>
      <td>${item.qty}x ${item.name}</td>
      <td style="text-align:right;">Rp${Number(item.total || 0).toLocaleString('id-ID')}</td>
    </tr>
  `).join('');

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; color: #151A26; padding: 24px; }
          .receipt { max-width: 360px; margin: 0 auto; border: 1px solid #E4E7ED; border-radius: 14px; padding: 18px; }
          h1 { font-size: 20px; margin: 0 0 4px; }
          .muted { color: #6F7480; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          td { padding: 8px 0; border-bottom: 1px solid #EEF0F4; font-size: 13px; }
          .total { font-size: 22px; font-weight: 800; color: #D73211; margin-top: 16px; }
          .meta { display: flex; justify-content: space-between; font-size: 13px; margin-top: 10px; }
          .label { color: #6F7480; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <h1>${profile?.storeName || 'Kasir'}</h1>
          <div class="muted">${profile?.address || ''}</div>
          <div class="muted">ID: ${receipt?.id || '-'}</div>
          <div class="muted">${formatFullDate(receipt?.date)}</div>
          <div class="meta"><span class="label">Pemesan</span><strong>${receipt?.customerName || 'Pelanggan Umum'}</strong></div>
          <div class="meta"><span class="label">Dilayani oleh</span><strong>${receipt?.cashier || '-'}</strong></div>
          <table>${rows}</table>
          <div class="meta"><span>Subtotal</span><strong>Rp${Number(receipt?.subtotal || receipt?.total || 0).toLocaleString('id-ID')}</strong></div>
          <div class="meta"><span>Diskon</span><strong>Rp${Number(receipt?.discount || 0).toLocaleString('id-ID')}</strong></div>
          <div class="meta"><span>Metode</span><strong>${receipt?.method || '-'}</strong></div>
          <div class="total">Rp${Number(receipt?.total || 0).toLocaleString('id-ID')}</div>
          <div class="muted">Kembalian: Rp${Number(receipt?.change || 0).toLocaleString('id-ID')}</div>
        </div>
      </body>
    </html>
  `;
}

function CartItem({ item, product, onQtyChange, onToggleDiscount, onDiscountType, onDiscountValue }) {
  const subtotal = product.price * item.qty;
  const discount = item.showDiscount ? calculateDiscount(subtotal, item.discountType, item.discountValue) : 0;

  return (
    <View style={styles.cartCard}>
      <View style={styles.cartTop}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={styles.thumbText}>{productCode(product)}</Text>
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.itemPrice}>Rp{product.price.toLocaleString('id-ID')} x {item.qty}</Text>
          <Text style={styles.itemCategory}>{product.category}</Text>
        </View>
        <View style={styles.qtyControl}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onQtyChange(Math.max(0, item.qty - 1))}>
            <Ionicons name="remove" size={17} color="#4F5663" />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onQtyChange(Math.min(product.stock, item.qty + 1))}>
            <Ionicons name="add" size={17} color="#4F5663" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.subtotalRow}>
        <Text style={styles.subtotalLabel}>Subtotal:</Text>
        <Text style={styles.subtotalValue}>Rp{(subtotal - discount).toLocaleString('id-ID')}</Text>
      </View>

      <TouchableOpacity style={styles.discountToggle} onPress={onToggleDiscount} activeOpacity={0.85}>
        <Text style={styles.discountToggleText}>{item.showDiscount ? 'Tutup' : 'Tambahkan Diskon'}</Text>
      </TouchableOpacity>

      {item.showDiscount && (
        <View style={styles.discountBox}>
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Tipe</Text>
            <View style={styles.segment}>
              <TouchableOpacity
                style={[styles.segmentButton, item.discountType === 'nominal' && styles.segmentActive]}
                onPress={() => onDiscountType('nominal')}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, item.discountType === 'nominal' && styles.segmentTextActive]}>Nominal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentButton, item.discountType === 'percent' && styles.segmentActive]}
                onPress={() => onDiscountType('percent')}
                activeOpacity={0.85}
              >
                <Text style={[styles.segmentText, item.discountType === 'percent' && styles.segmentTextActive]}>%</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.discountRow}>
            <Text style={styles.discountLabel}>Nilai</Text>
            <TextInput
              style={styles.discountInput}
              value={String(item.discountValue || 0)}
              onChangeText={(text) => onDiscountValue(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.saveDiscountBtn} activeOpacity={0.85}>
            <Text style={styles.saveDiscountText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function TransactionScreen({ products, transactions, cart, setCart, profile, activeCashier, onRefresh }) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [method, setMethod] = useState('Tunai');
  const [customerName, setCustomerName] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [whatsapp, setWhatsapp] = useState('');

  const cartItems = useMemo(() => Object.values(cart)
    .map((item) => {
      const product = products.find((productItem) => productItem.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter(Boolean), [cart, products]);

  const totalItems = cartItems.reduce((sum, { item }) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, { item, product }) => sum + product.price * item.qty, 0);
  const totalDiscount = cartItems.reduce((sum, { item, product }) => {
    if (!item.showDiscount) return sum;
    return sum + calculateDiscount(product.price * item.qty, item.discountType, item.discountValue);
  }, 0);
  const totalAmount = Math.max(0, subtotal - totalDiscount);
  const receivedValue = Number(cashReceived || 0);
  const cashChange = method === 'Tunai' ? Math.max(0, receivedValue - totalAmount) : 0;
  const canProcessPayment = cartItems.length > 0 && (method !== 'Tunai' || receivedValue >= totalAmount);

  const updateCartItem = (productId, patch) => {
    setCart((current) => {
      const existing = current[productId];
      if (!existing) return current;
      if (patch.qty === 0) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: { ...existing, ...patch } };
    });
  };

  const clearCart = () => setCart({});

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      setToastMsg('Keranjang masih kosong');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    if (!canProcessPayment) {
      setToastMsg('Uang diterima belum cukup');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    const invalidStock = cartItems.find(({ item, product }) => item.qty > Number(product.stock || 0));
    if (invalidStock) {
      setToastMsg(`Stok ${invalidStock.product.name} tidak cukup`);
      setToastType('error');
      setToastVisible(true);
      return;
    }

    const now = new Date().toISOString();
    const receiptId = `#${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(transactions.length + 1).padStart(2, '0')}`;
    const newTransactions = cartItems.map(({ item, product }) => {
      const itemSubtotal = product.price * item.qty;
      const itemDiscount = item.showDiscount ? calculateDiscount(itemSubtotal, item.discountType, item.discountValue) : 0;
      const itemCost = Number(product.cost || 0) * item.qty;
      const itemTotal = itemSubtotal - itemDiscount;
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        productId: product.id,
        productName: product.name,
        qty: item.qty,
        price: product.price,
        cost: Number(product.cost || 0),
        discount: itemDiscount,
        total: itemTotal,
        profit: itemTotal - itemCost,
        customerName: customerName.trim() || 'Pelanggan Umum',
        paymentMethod: method,
        cashier: activeCashier?.name || profile?.ownerName || 'rrachel',
        cashierId: activeCashier?.id || 'owner',
        receiptId,
        date: now,
      };
    });

    try {
      const updatedProducts = products.map((product) => {
        const cartItem = cart[product.id];
        return cartItem ? { ...product, stock: Math.max(0, product.stock - cartItem.qty) } : product;
      });

      await Storage.setItem('umkm_transactions', JSON.stringify([...transactions, ...newTransactions]));
      await Storage.setItem('umkm_products', JSON.stringify(updatedProducts));
      await onRefresh?.();
      setSuccessReceipt({
        id: receiptId,
        date: now,
        customerName: customerName.trim() || 'Pelanggan Umum',
        subtotal,
        discount: totalDiscount,
        total: totalAmount,
        change: cashChange,
        received: method === 'Tunai' ? receivedValue : totalAmount,
        cashier: activeCashier?.name || profile?.ownerName || 'rrachel',
        method,
        items: cartItems.map(({ item, product }) => {
          const itemSubtotal = product.price * item.qty;
          const itemDiscount = item.showDiscount ? calculateDiscount(itemSubtotal, item.discountType, item.discountValue) : 0;
          return { name: product.name, qty: item.qty, total: itemSubtotal - itemDiscount };
        }),
      });
      setPaymentOpen(false);
    } catch (error) {
      setToastMsg('Gagal memproses pembayaran');
      setToastType('error');
      setToastVisible(true);
    }
  };

  const resetAfterSuccess = () => {
    setCart({});
    setCashReceived('');
    setCustomerName('');
    setWhatsapp('');
    setSuccessReceipt(null);
  };

  const sendWhatsappReceipt = () => {
    if (!whatsapp.trim()) {
      Alert.alert('Nomor WhatsApp kosong', 'Isi nomor WhatsApp customer terlebih dahulu.');
      return;
    }
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const itemLines = (successReceipt?.items || [])
      .map((item) => `${item.qty}x ${item.name} - Rp${Number(item.total || 0).toLocaleString('id-ID')}`)
      .join('\n');
    const receiptText = [
      'Struk pembayaran',
      `ID: ${successReceipt?.id}`,
      `Tanggal: ${formatFullDate(successReceipt?.date)}`,
      `Pemesan: ${successReceipt?.customerName || 'Pelanggan Umum'}`,
      `Dilayani oleh: ${successReceipt?.cashier}`,
      `Metode: ${successReceipt?.method}`,
      '',
      'Pesanan:',
      itemLines,
      '',
      `Subtotal: Rp${Number(successReceipt?.subtotal || 0).toLocaleString('id-ID')}`,
      `Diskon: Rp${Number(successReceipt?.discount || 0).toLocaleString('id-ID')}`,
      `Total: Rp${successReceipt?.total.toLocaleString('id-ID')}`,
      `Kembalian: Rp${successReceipt?.change.toLocaleString('id-ID')}`,
    ].join('\n');
    Linking.openURL(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(receiptText)}`);
  };

  const connectPrinter = async () => {
    if (!successReceipt) return;
    try {
      await Print.printAsync({ html: buildReceiptHtml(successReceipt, profile) });
    } catch (error) {
      Alert.alert('Printer belum tersedia', 'Expo membuka dialog print bawaan HP. Untuk printer Bluetooth thermal khusus tetap perlu library printer sesuai perangkat.');
    }
  };

  const downloadReceipt = async () => {
    if (!successReceipt) return;
    try {
      const file = await Print.printToFileAsync({ html: buildReceiptHtml(successReceipt, profile) });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Struk ${successReceipt.id}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Struk berhasil dibuat', file.uri);
      }
    } catch (error) {
      Alert.alert('Gagal membuat struk', 'Coba ulangi proses download struk.');
    }
  };

  const openPayment = () => {
    if (cartItems.length === 0) {
      setToastMsg('Keranjang masih kosong');
      setToastType('error');
      setToastVisible(true);
      return;
    }
    setPaymentOpen(true);
  };

  return (
    <View style={styles.container}>
      <Toast visible={toastVisible} message={toastMsg} type={toastType} onHide={() => setToastVisible(false)} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>{totalItems} item dalam keranjang</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.holdIcon} activeOpacity={0.85}>
            <Ionicons name="bookmark-outline" size={22} color={TEXT} />
          </TouchableOpacity>
          {totalItems > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearCart} activeOpacity={0.85}>
              <Ionicons name="trash-outline" size={19} color="#D1293B" />
              <Text style={styles.clearText}>Kosongkan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="bag-handle-outline" size={46} color="#A2A7B0" />
            <Text style={styles.emptyTitle}>Keranjang kosong</Text>
            <Text style={styles.emptySubtitle}>Tambahkan produk dari halaman Kasir</Text>
          </View>
        ) : (
          cartItems.map(({ item, product }) => (
            <CartItem
              key={product.id}
              item={item}
              product={product}
              onQtyChange={(qty) => updateCartItem(product.id, { qty })}
              onToggleDiscount={() => updateCartItem(product.id, { showDiscount: !item.showDiscount })}
              onDiscountType={(discountType) => updateCartItem(product.id, { discountType })}
              onDiscountValue={(discountValue) => updateCartItem(product.id, { discountValue: Number(discountValue || 0) })}
            />
          ))
        )}

        {cartItems.length > 0 && (
          <>
            <View style={styles.quotaBox}>
              <Ionicons name="stats-chart" size={25} color="#0E8F5A" />
              <View>
                <Text style={styles.quotaTitle}>Transaksi hari ini: {transactions.length}/30</Text>
                <Text style={styles.quotaText}>Sisa: {Math.max(0, 30 - transactions.length)} transaksi lagi</Text>
              </View>
            </View>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>Rp{subtotal.toLocaleString('id-ID')}</Text>
              </View>
              {totalDiscount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryMuted}>Diskon:</Text>
                  <Text style={styles.discountValue}>-Rp{totalDiscount.toLocaleString('id-ID')}</Text>
                </View>
              )}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>Rp{totalAmount.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            <View style={styles.paymentActions}>
              <TouchableOpacity style={styles.holdButton} activeOpacity={0.85}>
                <Ionicons name="pause" size={20} color={TEXT} />
                <Text style={styles.holdText}>Tahan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.payButton} onPress={openPayment} activeOpacity={0.85}>
                <Text style={styles.payText}>Proses Pembayaran</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <Modal visible={paymentOpen} animationType="slide" onRequestClose={() => setPaymentOpen(false)}>
        <View style={styles.paymentScreen}>
          <View style={styles.paymentHeader}>
            <TouchableOpacity onPress={() => setPaymentOpen(false)} style={styles.closeButton}>
              <Ionicons name="close" size={26} color="#5B6170" />
            </TouchableOpacity>
            <Text style={styles.paymentTitle}>Proses Pembayaran</Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView contentContainerStyle={styles.paymentContent} showsVerticalScrollIndicator={false}>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentSectionTitle}>Ringkasan Pesanan</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Subtotal:</Text>
                <Text style={styles.paymentValue}>Rp{subtotal.toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.paymentDivider} />
              <View style={styles.paymentRow}>
                <Text style={styles.paymentTotalLabel}>Total:</Text>
                <Text style={styles.paymentTotalValue}>Rp{totalAmount.toLocaleString('id-ID')}</Text>
              </View>
            </View>

            <View style={styles.paymentCard}>
              <Text style={styles.paymentSectionTitle}>Informasi Pelanggan</Text>
              <View style={styles.customerRow}>
                <View style={styles.customerInputBox}>
                  <Ionicons name="person-outline" size={20} color="#8E94A0" />
                  <TextInput
                    style={styles.customerNameInput}
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="Nama (Non-member)"
                    placeholderTextColor="#A4A8B1"
                  />
                </View>
                <TouchableOpacity style={styles.memberButton} activeOpacity={0.85}>
                  <Ionicons name="people-outline" size={21} color="#4F5663" />
                  <Text style={styles.memberText}>Member</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.paymentCard}>
              <Text style={styles.paymentSectionTitle}>Diskon Global</Text>
              <View style={styles.globalDiscountBox}>
                <View>
                  <Text style={styles.globalDiscountLabel}>Diskon Global:</Text>
                  <Text style={styles.globalDiscountText}>Pilih diskon (opsional)</Text>
                </View>
                <Text style={styles.changeText}>Ubah</Text>
              </View>
            </View>

            <View style={styles.paymentCard}>
              <Text style={styles.paymentSectionTitle}>Metode Pembayaran</Text>
              <View style={styles.methodGrid}>
                {[
                  { name: 'Tunai', icon: 'cash-outline' },
                  { name: 'QRIS', icon: 'qr-code-outline' },
                  { name: 'Transfer', icon: 'swap-horizontal-outline' },
                  { name: 'Kasbon', icon: 'time' },
                ].map((item) => {
                  const active = method === item.name;
                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[styles.methodButton, active && styles.methodButtonActive]}
                      onPress={() => setMethod(item.name)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name={item.icon} size={20} color={active ? BLUE_DARK : '#69707F'} />
                      <Text style={[styles.methodText, active && styles.methodTextActive]}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {method === 'Tunai' && (
              <View style={styles.paymentCard}>
                <Text style={styles.paymentSectionTitle}>Detail Pembayaran Tunai</Text>
                <Text style={styles.paymentLabel}>Uang Diterima:</Text>
                <TextInput
                  style={styles.cashInput}
                  value={cashReceived}
                  onChangeText={(text) => setCashReceived(text.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#A4A8B1"
                />
                <View style={styles.quickCashRow}>
                  <TouchableOpacity style={styles.quickCashButton} onPress={() => setCashReceived(String(totalAmount))}>
                    <Text style={styles.quickCashText}>Uang Pas</Text>
                  </TouchableOpacity>
                  {[50000, 100000].map((value) => (
                    <TouchableOpacity key={value} style={styles.quickCashButton} onPress={() => setCashReceived(String(value))}>
                      <Text style={styles.quickCashText}>{value.toLocaleString('id-ID')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {receivedValue >= totalAmount && (
                  <>
                    <View style={styles.paymentDivider} />
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Kembalian:</Text>
                      <Text style={styles.changeValue}>Rp{cashChange.toLocaleString('id-ID')}</Text>
                    </View>
                  </>
                )}
              </View>
            )}

            {method === 'QRIS' && (
              <View style={styles.paymentCard}>
                <Text style={styles.paymentSectionTitle}>Detail Pembayaran QRIS</Text>
                <View style={styles.qrisBox}>
                  {profile?.qrisImage ? (
                    <Image source={{ uri: profile.qrisImage }} style={styles.qrisImage} />
                  ) : (
                    <Ionicons name="qr-code-outline" size={76} color={BLUE_DARK} />
                  )}
                  <Text style={styles.qrisTitle}>QRIS siap dipindai</Text>
                  <Text style={styles.qrisText}>{profile?.qrisImage ? 'Pastikan customer sudah scan dan bayar sebelum proses pembayaran.' : 'Unggah gambar QRIS di Pengaturan agar barcode tampil di sini.'}</Text>
                </View>
              </View>
            )}

            <View style={styles.paymentCard}>
              <Text style={styles.paymentSectionTitle}>Kasir</Text>
              <View style={styles.cashierBox}>
                <View>
                  <Text style={styles.cashierName}>{activeCashier?.name || profile?.ownerName || 'rrachel'}</Text>
                  <Text style={styles.cashierRole}>{activeCashier?.role || 'owner'}</Text>
                </View>
                <Text style={styles.changeText}>Ubah</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.paymentFooter}>
            <TouchableOpacity
              style={[styles.processButton, !canProcessPayment && styles.processButtonDisabled]}
              onPress={handlePayment}
              activeOpacity={0.85}
            >
              <Text style={styles.processButtonText}>Proses Pembayaran - Rp{totalAmount.toLocaleString('id-ID')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={!!successReceipt} animationType="fade" onRequestClose={resetAfterSuccess}>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={42} color="#EE4D2D" />
            </View>
            <Text style={styles.successTitle}>Transaksi Berhasil!</Text>
            <View style={styles.receiptSummary}>
              <Text style={styles.receiptLabel}>Total Pembayaran</Text>
              <Text style={styles.receiptTotal}>Rp{successReceipt?.total.toLocaleString('id-ID')}</Text>
              <Text style={styles.receiptChange}>Kembalian: Rp{successReceipt?.change.toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptMuted}>Tanggal:</Text>
              <Text style={styles.receiptText}>{formatFullDate(successReceipt?.date)}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptMuted}>Pemesan:</Text>
              <Text style={styles.receiptText}>{successReceipt?.customerName || 'Pelanggan Umum'}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptMuted}>Metode:</Text>
              <Text style={styles.receiptText}>{successReceipt?.method}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptMuted}>Kasir:</Text>
              <Text style={styles.receiptText}>{successReceipt?.cashier}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptMuted}>ID Transaksi:</Text>
              <Text style={styles.receiptText}>{successReceipt?.id}</Text>
            </View>

            <Text style={styles.shareTitle}>Bagikan Struk</Text>
            <View style={styles.waInputBox}>
              <Ionicons name="call-outline" size={20} color="#69707F" />
              <TextInput
                style={styles.waInput}
                value={whatsapp}
                onChangeText={setWhatsapp}
                keyboardType="phone-pad"
                placeholder="Nomor WhatsApp (contoh: 0812...)"
                placeholderTextColor="#A4A8B1"
              />
            </View>
            <TouchableOpacity style={styles.whatsappButton} onPress={sendWhatsappReceipt} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={22} color="#FFF" />
              <Text style={styles.successButtonText}>Kirim Struk ke WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton} onPress={downloadReceipt} activeOpacity={0.85}>
              <Ionicons name="download-outline" size={22} color="#FFF" />
              <Text style={styles.successButtonText}>Download Struk</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />
            <Text style={styles.shareTitle}>Opsi Lainnya</Text>
            <TouchableOpacity style={styles.printerButton} onPress={connectPrinter} activeOpacity={0.85}>
              <Ionicons name="bluetooth" size={22} color="#EE4D2D" />
              <Text style={styles.printerButtonText}>Sambungkan Printer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={resetAfterSuccess} activeOpacity={0.85}>
              <Text style={styles.doneButtonText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FB' },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },
  headerTitle: { color: TEXT, fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: MUTED, fontSize: 14, marginTop: 6 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  holdIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#F0F1F4', justifyContent: 'center', alignItems: 'center' },
  clearButton: { height: 42, paddingHorizontal: 13, borderRadius: 10, backgroundColor: '#FFE3E6', flexDirection: 'row', alignItems: 'center', gap: 7 },
  clearText: { color: '#C73541', fontSize: 14, fontWeight: '800' },
  content: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 30 },
  cartCard: { backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E4E7ED', padding: 14, marginBottom: 14 },
  cartTop: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 58, height: 58, borderRadius: 9, marginRight: 12 },
  thumbPlaceholder: { width: 58, height: 58, borderRadius: 9, backgroundColor: '#FFF0EB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  thumbText: { color: BLUE_DARK, fontSize: 15, fontWeight: '800' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { color: TEXT, fontSize: 15, fontWeight: '800' },
  itemPrice: { color: PURPLE, fontSize: 14, fontWeight: '700', marginTop: 6 },
  itemCategory: { color: MUTED, fontSize: 12, marginTop: 3 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  qtyBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F2F5', justifyContent: 'center', alignItems: 'center' },
  qtyValue: { minWidth: 48, height: 34, textAlign: 'center', textAlignVertical: 'center', color: TEXT, fontSize: 17, fontWeight: '800', backgroundColor: '#F8F9FB', marginHorizontal: 6 },
  divider: { height: 1, backgroundColor: '#EEF0F4', marginTop: 14, marginBottom: 12 },
  subtotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtotalLabel: { color: '#4F5663', fontSize: 15 },
  subtotalValue: { color: TEXT, fontSize: 16, fontWeight: '800' },
  discountToggle: { alignSelf: 'flex-start', backgroundColor: '#F4F5F7', borderWidth: 1, borderColor: '#E3E6ED', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 10 },
  discountToggleText: { color: '#4F5663', fontSize: 13, fontWeight: '700' },
  discountBox: { borderWidth: 1, borderColor: '#E1E4EA', borderRadius: 10, backgroundColor: '#FAFBFD', padding: 12, marginTop: 12 },
  discountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  discountLabel: { color: '#4F5663', fontSize: 14 },
  segment: { flexDirection: 'row', backgroundColor: '#E8E9ED', borderRadius: 8, overflow: 'hidden' },
  segmentButton: { minWidth: 64, height: 36, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
  segmentActive: { backgroundColor: PURPLE },
  segmentText: { color: '#4F5663', fontSize: 13, fontWeight: '700' },
  segmentTextActive: { color: '#FFF' },
  discountInput: { width: 120, height: 38, borderRadius: 8, borderWidth: 1, borderColor: '#D6DAE2', backgroundColor: '#FFF', paddingHorizontal: 12, color: TEXT, fontSize: 15, textAlign: 'right' },
  saveDiscountBtn: { alignSelf: 'flex-end', height: 38, paddingHorizontal: 18, borderRadius: 8, backgroundColor: PURPLE, justifyContent: 'center' },
  saveDiscountText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  quotaBox: { borderRadius: 12, borderWidth: 1, borderColor: '#BDEFD8', backgroundColor: '#EFFFF7', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  quotaTitle: { color: '#1C6B47', fontSize: 13, fontWeight: '800' },
  quotaText: { color: '#3B6E56', fontSize: 13, marginTop: 4 },
  summary: { backgroundColor: '#FFF', borderRadius: 12, paddingVertical: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2, paddingVertical: 7 },
  summaryLabel: { color: '#4F5663', fontSize: 16 },
  summaryMuted: { color: MUTED, fontSize: 14 },
  summaryValue: { color: TEXT, fontSize: 16, fontWeight: '600' },
  discountValue: { color: '#C73541', fontSize: 14, fontWeight: '700' },
  summaryDivider: { height: 1, backgroundColor: '#EEF0F4', marginVertical: 4 },
  totalLabel: { color: TEXT, fontSize: 18, fontWeight: '800' },
  totalValue: { color: PURPLE, fontSize: 18, fontWeight: '800' },
  paymentActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  holdButton: { width: 118, height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#E0E3EA', backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  holdText: { color: TEXT, fontSize: 15, fontWeight: '800' },
  payButton: { flex: 1, height: 56, borderRadius: 12, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  payText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', minHeight: 420 },
  emptyTitle: { color: MUTED, fontSize: 17, fontWeight: '800', marginTop: 12 },
  emptySubtitle: { color: '#A2A7B0', fontSize: 13, marginTop: 6 },
  paymentScreen: { flex: 1, backgroundColor: '#F7F8FB' },
  paymentHeader: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },
  closeButton: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center' },
  paymentTitle: { color: TEXT, fontSize: 18, fontWeight: '800' },
  paymentContent: { padding: 16, paddingBottom: 96 },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E7ED',
    padding: 14,
    marginBottom: 14,
  },
  paymentSectionTitle: { color: TEXT, fontSize: 15, fontWeight: '800', marginBottom: 14 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentLabel: { color: '#4F5663', fontSize: 14 },
  paymentValue: { color: TEXT, fontSize: 15, fontWeight: '700' },
  paymentDivider: { height: 1, backgroundColor: '#EEF0F4', marginVertical: 12 },
  paymentTotalLabel: { color: TEXT, fontSize: 16, fontWeight: '800' },
  paymentTotalValue: { color: PURPLE, fontSize: 16, fontWeight: '800' },
  customerRow: { flexDirection: 'row', gap: 10 },
  customerInputBox: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DCE4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  customerNameInput: { flex: 1, marginLeft: 10, color: TEXT, fontSize: 14 },
  memberButton: {
    height: 48,
    minWidth: 104,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DCE4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  memberText: { color: '#4F5663', fontSize: 14, fontWeight: '700' },
  globalDiscountBox: {
    minHeight: 68,
    borderWidth: 1,
    borderColor: '#D8DCE4',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  globalDiscountLabel: { color: '#4F5663', fontSize: 13 },
  globalDiscountText: { color: MUTED, fontSize: 14, marginTop: 8 },
  changeText: { color: PURPLE, fontSize: 14, fontWeight: '700' },
  methodGrid: { flexDirection: 'row', gap: 8 },
  methodButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E3EA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  methodButtonActive: { backgroundColor: '#FFF0EB', borderColor: PURPLE },
  methodText: { color: '#4F5663', fontSize: 12, fontWeight: '700' },
  methodTextActive: { color: BLUE_DARK },
  qrisBox: { borderWidth: 1, borderColor: '#FFD0C4', backgroundColor: '#FFF7F4', borderRadius: 12, padding: 16, alignItems: 'center' },
  qrisImage: { width: 170, height: 170, borderRadius: 10, backgroundColor: '#FFF' },
  qrisTitle: { color: BLUE_DARK, fontSize: 15, fontWeight: '800', marginTop: 8 },
  qrisText: { color: '#4F5663', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 6 },
  cashInput: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DCE4',
    paddingHorizontal: 12,
    color: TEXT,
    fontSize: 15,
    marginTop: 10,
  },
  quickCashRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  quickCashButton: { flex: 1, height: 42, borderRadius: 9, backgroundColor: '#F0F1F4', justifyContent: 'center', alignItems: 'center' },
  quickCashText: { color: '#3F5578', fontSize: 13, fontWeight: '700' },
  changeValue: { color: '#19A765', fontSize: 15, fontWeight: '800' },
  cashierBox: {
    minHeight: 62,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DCE4',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cashierName: { color: TEXT, fontSize: 15, fontWeight: '800' },
  cashierRole: { color: MUTED, fontSize: 13, marginTop: 4 },
  paymentFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF0F4',
    padding: 16,
  },
  processButton: { height: 54, borderRadius: 12, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  processButtonDisabled: { backgroundColor: '#CBD0DA' },
  processButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.48)', justifyContent: 'center', padding: 18 },
  successModal: { backgroundColor: '#FFF', borderRadius: 18, padding: 20 },
  successIcon: { alignSelf: 'center', width: 78, height: 78, borderRadius: 39, backgroundColor: '#FFF0EB', alignItems: 'center', justifyContent: 'center' },
  successTitle: { color: TEXT, fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 16 },
  receiptSummary: { borderRadius: 12, borderWidth: 1, borderColor: '#E4E7ED', backgroundColor: '#FAFBFD', padding: 14, marginTop: 18 },
  receiptLabel: { color: MUTED, fontSize: 14 },
  receiptTotal: { color: TEXT, fontSize: 27, fontWeight: '800', marginTop: 8 },
  receiptChange: { color: '#4F5663', fontSize: 14, marginTop: 8 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginTop: 14 },
  receiptMuted: { color: MUTED, fontSize: 14 },
  receiptText: { flex: 1, color: TEXT, fontSize: 14, fontWeight: '700', textAlign: 'right' },
  shareTitle: { color: MUTED, fontSize: 14, fontWeight: '800', marginTop: 18, marginBottom: 10 },
  waInputBox: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DCE4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  waInput: { flex: 1, marginLeft: 10, color: TEXT, fontSize: 14 },
  whatsappButton: { height: 52, borderRadius: 10, backgroundColor: '#0B9D69', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 12 },
  downloadButton: { height: 52, borderRadius: 10, backgroundColor: '#1D2A3A', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 12 },
  successButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  modalDivider: { height: 1, backgroundColor: '#EEF0F4', marginTop: 16 },
  printerButton: { height: 50, borderRadius: 10, backgroundColor: '#DCEBFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  printerButtonText: { color: '#EE4D2D', fontSize: 15, fontWeight: '800' },
  doneButton: { height: 52, borderRadius: 10, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  doneButtonText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
