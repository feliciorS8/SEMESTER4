import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.box}>
      <Text style={styles.text}>Nilai Counter : {count}</Text>
      <Button title="Tambah" onPress={() => setCount(count + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginBottom: 40,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});