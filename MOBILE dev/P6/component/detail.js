import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Button, ScrollView } from 'react-native';
import { MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';

const Detail = ({ route, navigation }) => {
  const { Mahasiswa } = route.params;

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${Mahasiswa.email}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${Mahasiswa.phone}`);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ height: 150, backgroundColor: '#0033ff' }} />
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{
            width: 120,
            height: 120,
            borderRadius: 120 / 2,
            marginTop: -50,
          }}
          source={{ uri: Mahasiswa.foto }}
        />
      </View>

      <View style={{ alignItems: 'center', margin: 15 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{Mahasiswa.nama}</Text>
        <Text style={{ fontSize: 14 }}>{Mahasiswa.program_studi}</Text>
      </View>

      <TouchableOpacity style={{ margin: 3 }} onPress={handleEmailPress}>
        <View style={{ flexDirection: 'row', padding: 8 }}>
          <MaterialIcons name="email" size={32} color="#006aff" />
          <Text style={styles.teks}>{Mahasiswa.email}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={{ margin: 3 }} onPress={handlePhonePress}>
        <View style={{ flexDirection: 'row', padding: 8 }}>
          <Entypo name="phone" size={32} color="#006aff" />
          <Text style={styles.teks}>{Mahasiswa.phone}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={{ margin: 3 }}>
        <View style={{ flexDirection: 'row', padding: 8 }}>
          <AntDesign name="idcard" size={32} color="#006aff" />
          <Text style={styles.teks}>{Mahasiswa.nim}</Text>
        </View>
      </TouchableOpacity>

      {/* Jadwal Pelajaran */}
      <View style={styles.jadwalContainer}>
        <Text style={styles.jadwalTitle}>Jadwal Pelajaran</Text>
        {Mahasiswa.jadwal && Mahasiswa.jadwal.map((item, index) => (
          <View key={index} style={styles.jadwalCard}>
            <View style={styles.jadwalHari}>
              <Text style={styles.jadwalHariText}>{item.hari}</Text>
            </View>
            <View style={styles.jadwalInfo}>
              <Text style={styles.jadwalMatkul}>{item.mataKuliah}</Text>
              <Text style={styles.jadwalJam}>{item.jam}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ padding: 10 }}>
        <Button title="GO BACK" onPress={() => navigation.navigate('Home')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  teks: {
    fontSize: 15,
    marginTop: 3,
    marginLeft: 5,
  },
  jadwalContainer: {
    margin: 10,
    marginTop: 15,
  },
  jadwalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  jadwalCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  jadwalHari: {
    backgroundColor: '#006aff',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  jadwalHariText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  jadwalInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  jadwalMatkul: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  jadwalJam: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
});

export default Detail;