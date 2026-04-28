import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// === SCREEN 1: Tugas 1 (Hello World) ===
const Tugas1 = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Tugas 1</Text>
    <Text style={{ fontSize: 18 }}>Hello World</Text>
  </View>
);

// === SCREEN 2: Tugas 2 (contoh sederhana) ===
const Tugas2 = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Tugas 2</Text>
    <Text style={{ fontSize: 18 }}>Ini halaman kedua</Text>
  </View>
);

// === SCREEN 3: Tugas 3 - Daftar Belanja (full event handling) ===
const Tugas3 = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const tambahItem = () => {
    if (newItem.trim() === '') return;
    setItems([...items, { id: Date.now().toString(), nama: newItem }]);
    setNewItem('');
  };

  const hapusItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Daftar Belanja</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Masukkan item..."
          value={newItem}
          onChangeText={setNewItem}
        />
        <Button title="Tambah" onPress={tambahItem} color="#10b981" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={{ flex: 1, fontSize: 16 }}>{item.nama}</Text>
            <TouchableOpacity
              style={styles.hapusBtn}
              onPress={() => hapusItem(item.id)}
            >
              <Text style={styles.hapusText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Tugas3">
        <Drawer.Screen name="Tugas 1" component={Tugas1} />
        <Drawer.Screen name="Tugas 2" component={Tugas2} />
        <Drawer.Screen name="Tugas 3 - Daftar Belanja" component={Tugas3} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  itemRow: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 15, 
    marginBottom: 8, 
    borderRadius: 8, 
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 2
  },
  hapusBtn: { backgroundColor: '#ef4444', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  hapusText: { color: 'white', fontWeight: 'bold' },
});