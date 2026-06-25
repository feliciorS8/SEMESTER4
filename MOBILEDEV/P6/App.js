import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './component/home';
import Detail from './component/detail';

const Stack = createStackNavigator();

function SplashScreen({ navigation }) {
  setTimeout(() => {
    navigation.replace('Home');
  }, 3000);

  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashEmoji}>🎓</Text>
      <Text style={styles.splashTitle}>Data Mahasiswa</Text>
      <Text style={styles.splashSub}>Loading...</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'Data Mahasiswa' }} />
        <Stack.Screen name="Detail" component={Detail} options={{ title: 'Detail Mahasiswa' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0033ff',
  },
  splashEmoji: {
    fontSize: 80,
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  splashSub: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});
