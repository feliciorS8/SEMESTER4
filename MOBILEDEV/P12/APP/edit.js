import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function EditNoteModal({
  title,
  content,
  onChangeTitle,
  onChangeContent,
  onCancel,
  onSave,
}) {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Ubah Catatan</Text>
      <TextInput
        style={styles.input}
        placeholder="Judul"
        value={title}
        onChangeText={onChangeTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Isi catatan"
        value={content}
        onChangeText={onChangeContent}
        multiline
      />
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.modalButtonText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={onSave}
        >
          <Text style={styles.modalButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    minWidth: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1F3B72",
  },
  input: {
    backgroundColor: "#F5F1E8",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderColor: "#1F3B72",
    borderWidth: 1,
    color: "#1F3B72",
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#9ca3af",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#10b981",
  },
  modalButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
