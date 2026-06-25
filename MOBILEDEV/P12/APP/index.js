import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./login";
import RegisterScreen from "./register";
import NotesScreen from "./notes";

const SESSION_KEY = "session";

export default function MainApp() {
  const [session, setSession] = useState(null);
  const [authState, setAuthState] = useState("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      if (raw) {
        setSession(JSON.parse(raw));
      }
      setLoading(false);
    };

    getSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1f2937" />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }

  if (!session) {
    return authState === "register" ? (
      <RegisterScreen onSwitch={() => setAuthState("login")} />
    ) : (
      <LoginScreen
        onSwitch={() => setAuthState("register")}
        onLogin={setSession}
      />
    );
  }

  return <NotesScreen session={session} onLogout={() => setSession(null)} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  loadingText: {
    marginTop: 12,
    color: "#374151",
  },
});
