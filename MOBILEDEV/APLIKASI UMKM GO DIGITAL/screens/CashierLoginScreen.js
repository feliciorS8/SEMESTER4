import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#EE4D2D';
const TEXT = '#151A26';
const MUTED = '#6F7480';

export default function CashierLoginScreen({ navigation, cashiers = [], setActiveCashierId }) {
  const activeCashiers = cashiers.filter((cashier) => cashier.active !== false);
  const [selectedId, setSelectedId] = useState(activeCashiers[0]?.id || 'owner');
  const [pin, setPin] = useState('');

  const login = () => {
    const cashier = activeCashiers.find((item) => item.id === selectedId);
    if (!cashier) {
      Alert.alert('Kasir tidak tersedia', 'Pilih kasir yang aktif.');
      return;
    }
    if ((cashier.pin || '1234') !== pin) {
      Alert.alert('PIN salah', 'PIN demo default adalah 1234.');
      return;
    }
    setActiveCashierId?.(cashier.id);
    navigation.navigate('Main', { screen: 'Kasir' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login Kasir</Text>
        <Text style={styles.subtitle}>Pilih kasir yang sedang bertugas</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeCashiers.map((cashier) => {
          const selected = selectedId === cashier.id;
          return (
            <TouchableOpacity
              key={cashier.id}
              style={[styles.cashierCard, selected && styles.cashierCardActive]}
              onPress={() => setSelectedId(cashier.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.avatar, selected && styles.avatarActive]}>
                <Text style={styles.avatarText}>{cashier.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cashierName}>{cashier.name}</Text>
                <Text style={styles.cashierMeta}>{cashier.role} - {cashier.email}</Text>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={22} color={ORANGE} />}
            </TouchableOpacity>
          );
        })}

        <Text style={styles.label}>PIN Kasir</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#9AA3AF" />
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={(text) => setPin(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            secureTextEntry
            placeholder="Masukkan PIN"
            placeholderTextColor="#A8AFBA"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={login} activeOpacity={0.85}>
          <Text style={styles.loginText}>Masuk</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FB' },
  header: { backgroundColor: '#FFF', paddingTop: 58, paddingHorizontal: 20, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: '#EEF0F4' },
  title: { color: TEXT, fontSize: 24, fontWeight: '800' },
  subtitle: { color: MUTED, fontSize: 14, marginTop: 6 },
  content: { padding: 18, paddingBottom: 34 },
  cashierCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E4E7ED', borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  cashierCardActive: { borderColor: ORANGE, backgroundColor: '#FFF7F4' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#D4D7DE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarActive: { backgroundColor: ORANGE },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  cashierName: { color: TEXT, fontSize: 15, fontWeight: '800' },
  cashierMeta: { color: MUTED, fontSize: 12, marginTop: 4 },
  label: { color: '#4F5663', fontSize: 13, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  inputBox: { height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#DDE1E8', backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  input: { flex: 1, marginLeft: 10, color: TEXT, fontSize: 15 },
  loginButton: { height: 52, borderRadius: 12, backgroundColor: ORANGE, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  loginText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
