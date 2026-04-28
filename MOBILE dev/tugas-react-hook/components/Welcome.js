import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Welcome() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show) {
      setMessage('Selamat Datang Mahasiswa STIKOM');
    } else {
      setMessage('');
    }
  }, [show]);

  return (
    <View style={styles.box}>
      <Button
        title="Tampilkan Pesan"
        onPress={() => setShow(!show)}
      />

      {message !== '' && (
        <Text style={styles.text}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
  },
  text: {
    marginTop: 15,
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
  },
});