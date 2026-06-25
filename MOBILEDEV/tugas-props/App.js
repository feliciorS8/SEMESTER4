import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import DATA from './components/data';

const Item = ({ nama, telp, foto }) => (
  <View style={styles.item}>
    <Image source={{ uri: foto }} style={styles.foto} />
    <View>
      <Text style={styles.nama}>{nama}</Text>
      <Text style={styles.telp}>{telp}</Text>
    </View>
  </View>
);

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kontak Pemuda Kradenan Rebound</Text>

      {DATA.map((item) => (
        <Item
          key={item.id}
          nama={item.nama}
          telp={item.telp}
          foto={item.foto}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    paddingTop: 35,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#eee',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bbb',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#888',
  },
  foto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  nama: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  telp: {
    color: 'blue',
    marginTop: 3,
  },
});