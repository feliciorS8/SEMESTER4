import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import HelloUser from './components/HelloUser';
import Counter from './components/Counter';

export default function App() {
  const [name, setName] = useState('Sony');
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <HelloUser name={name} />
      <Button title='Ganti Nama' onPress={() => setName('Panca')} />
      
      <Counter value={count} />
      <Button title='Tambah' onPress={() => setCount(count + 1)} />
      <Button title='Kurang' onPress={() => setCount(count - 1)} />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});