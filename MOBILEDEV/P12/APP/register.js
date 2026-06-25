import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "users";

export default function RegisterScreen({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan password harus diisi.");
      return;
    }

    setLoading(true);
    const rawUsers = await AsyncStorage.getItem(USERS_KEY);
    const users = rawUsers ? JSON.parse(rawUsers) : {};

    if (users[email]) {
      setLoading(false);
      Alert.alert("Registrasi gagal", "Email sudah terdaftar.");
      return;
    }

    users[email] = password;
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    setLoading(false);

    Alert.alert("Berhasil", "Akun berhasil dibuat. Silakan masuk.");
    onSwitch();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Memproses..." : "Daftar"}
        </Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Sudah punya akun?</Text>
        <TouchableOpacity onPress={onSwitch}>
          <Text style={styles.switchText}> Masuk di sini</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5F1E8",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1F3B72",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderColor: "#1F3B72",
    borderWidth: 1,
    color: "#1F3B72",
  },
  button: {
    backgroundColor: "#1F3B72",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
  },
  switchText: {
    color: "#1F3B72",
    fontWeight: "700",
  },
});
