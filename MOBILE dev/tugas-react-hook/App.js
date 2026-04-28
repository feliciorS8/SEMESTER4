import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // pesan hanya boleh muncul jika tombol ditekan DAN counter > 0
    if (show && count > 0) {
      setMessage('Selamat Datang Mahasiswa STIKOM');
    } else {
      setMessage('');
    }
  }, [show, count]);

  const resetAll = () => {
    setCount(0);
    setShow(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>

      <Text style={styles.counter}>{count}</Text>

      {/* tombol icon tambah & kurang */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: 'green' }]}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.iconText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: 'red' }]}
          onPress={() => setCount(count - 1)}
        >
          <Text style={styles.iconText}>-</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Button title="Reset" onPress={resetAll} />
      </View>

      <View style={styles.row}>
        <Button
          title="Tampilkan Pesan"
          onPress={() => setShow(!show)}
        />
      </View>

      {message !== '' && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  counter: {
    fontSize: 40,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  iconBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
  },
});