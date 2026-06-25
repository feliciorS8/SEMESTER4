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

export default function LoginScreen({ onSwitch, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Peringatan", "Email dan password harus diisi.");
      return;
    }

    setLoading(true);
    const rawUsers = await AsyncStorage.getItem(USERS_KEY);
    const users = rawUsers ? JSON.parse(rawUsers) : {};
    const savedPassword = users[email];
    setLoading(false);

    if (!savedPassword || savedPassword !== password) {
      Alert.alert("Login gagal", "Email atau password tidak sesuai.");
      return;
    }

    await AsyncStorage.setItem("session", JSON.stringify({ email }));
    onLogin({ email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masuk ke Notes</Text>
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
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Memproses..." : "Masuk"}
        </Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text>Belum punya akun?</Text>
        <TouchableOpacity onPress={onSwitch}>
          <Text style={styles.switchText}> Daftar di sini</Text>
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
