import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import mahasiswas from '../assets/mahasiswa';

const Home = ({ navigation }) => {
  const [data, setData] = useState(mahasiswas);

  const listMahasiswa = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardUtama}
        onPress={() => navigation.navigate('Detail', { Mahasiswa: item })}
      >
        <View style={styles.cardView}>
          <Image
            style={{ width: 50, height: 50, borderRadius: 50 / 2 }}
            source={{ uri: item.foto }}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.teks}>{item.nama}</Text>
            <Text style={styles.teks}>{item.program_studi}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <FlatList
        data={data}
        renderItem={listMahasiswa}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardUtama: {
    margin: 2,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardView: {
    flexDirection: 'row',
    padding: 6,
  },
  teks: {
    fontSize: 16,
  },
});

export default Home;