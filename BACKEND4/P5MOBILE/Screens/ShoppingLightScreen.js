import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function ShoppingListScreen() {
  const [item, setItem] = useState('');
  const [list, setList] = useState([
    { id: '1', name: 'Kopi' },
    { id: '2', name: 'Susu' },
  ]);

  const handleAdd = () => {
    if (item.trim()) {
      setList([...list, { id: Date.now().toString(), name: item }]);
      setItem(''); 
    }
  };

  const handleDelete = (id) => {
    setList(list.filter((listItem) => listItem.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Belanja</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Masukkan item..."
          value={item}
          onChangeText={setItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.buttonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemText}>{`${index + 1}. ${item.name}`}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#2b9d5c',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff6b4a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
});
