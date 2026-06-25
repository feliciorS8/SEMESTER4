import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddNoteModal from "./add";
import EditNoteModal from "./edit";

const SERVICE_NOTE_KEY = (email) => `notes:${email}`;
const SETTINGS_KEY = (email) => `settings:${email}`;

export default function NotesScreen({ session, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    fetchNotes();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY(session.email));
    if (raw) {
      const settings = JSON.parse(raw);
      setNotificationEnabled(settings.notificationEnabled ?? false);
    }
  };

  const saveSettings = async (enabled) => {
    await AsyncStorage.setItem(
      SETTINGS_KEY(session.email),
      JSON.stringify({ notificationEnabled: enabled }),
    );
    setNotificationEnabled(enabled);
  };

  const fetchNotes = async () => {
    setLoading(true);
    const raw = await AsyncStorage.getItem(SERVICE_NOTE_KEY(session.email));
    const storedNotes = raw ? JSON.parse(raw) : [];
    setNotes(storedNotes.sort((a, b) => b.created_at - a.created_at));
    setLoading(false);
  };

  const saveNotes = async (noteList) => {
    const sortedList = [...noteList].sort(
      (a, b) => b.created_at - a.created_at,
    );
    await AsyncStorage.setItem(
      SERVICE_NOTE_KEY(session.email),
      JSON.stringify(sortedList),
    );
    setNotes(sortedList);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const openCreate = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert("Peringatan", "Judul dan catatan harus diisi.");
      return;
    }

    if (selectedNote) {
      const updated = notes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, title, content, updated_at: Date.now() }
          : note,
      );
      await saveNotes(updated);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
        created_at: Date.now(),
      };
      await saveNotes([newNote, ...notes]);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleDelete = async (noteId) => {
    const filtered = notes.filter((note) => note.id !== noteId);
    await saveNotes(filtered);
  };

  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem("session");
    onLogout();
  };

  const toggleNotifications = async () => {
    await saveSettings(!notificationEnabled);
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <View style={styles.noteActions}>
          <TouchableOpacity
            onPress={() => openEdit(item)}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>Ubah</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={[styles.smallButton, styles.deleteButton]}
          >
            <Text style={styles.smallButtonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.noteContent}>{item.content}</Text>
      <Text style={styles.noteDate}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Catatan Saya</Text>
        <TouchableOpacity
          onPress={handleLogoutPress}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Pengaturan Pengguna</Text>
        <Text style={styles.settingLabel}>Email pengguna</Text>
        <Text style={styles.settingValue}>{session.email}</Text>
        <Text style={styles.settingLabel}>Notifikasi email / WA</Text>
        <Text style={styles.settingValue}>
          {notificationEnabled ? "Hidup" : "Mati"}
        </Text>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            notificationEnabled ? styles.disableButton : styles.enableButton,
          ]}
          onPress={toggleNotifications}
        >
          <Text style={styles.notificationButtonText}>
            {notificationEnabled ? "Matikan Notifikasi" : "Hidupkan Notifikasi"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Text style={styles.addButtonText}>+ Tambah Catatan</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.statusText}>Memuat catatan...</Text>
      ) : notes.length === 0 ? (
        <Text style={styles.statusText}>
          Belum ada catatan. Tekan tambah untuk membuat catatan baru.
        </Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNote}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          {selectedNote ? (
            <EditNoteModal
              title={title}
              content={content}
              onChangeTitle={setTitle}
              onChangeContent={setContent}
              onCancel={() => setModalVisible(false)}
              onSave={handleSave}
            />
          ) : (
            <AddNoteModal
              title={title}
              content={content}
              onChangeTitle={setTitle}
              onChangeContent={setContent}
              onCancel={() => setModalVisible(false)}
              onSave={handleSave}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1E8",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F3B72",
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },
  settingLabel: {
    color: "#6b7280",
    marginTop: 8,
  },
  settingValue: {
    color: "#111827",
    fontWeight: "600",
    marginBottom: 8,
  },
  notificationButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  enableButton: {
    backgroundColor: "#1F3B72",
  },
  disableButton: {
    backgroundColor: "#5E5C7F",
  },
  notificationButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#1F3B72",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  statusText: {
    textAlign: "center",
    marginTop: 24,
    color: "#4b5563",
  },
  listContainer: {
    paddingBottom: 24,
  },
  noteCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  noteActions: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  smallButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  noteContent: {
    color: "#4b5563",
    marginBottom: 12,
  },
  noteDate: {
    color: "#9ca3af",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(31, 59, 114, 0.45)",
    padding: 20,
  },
});
