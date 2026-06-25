import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Header, ImagePickerComponent } from "../components";
import * as Storage from "../utils/storage";
import { colors, spacing, borderRadius, typography } from "../utils/theme";

const CATEGORIES = ["Kopi", "Makanan", "Minuman Dingin", "Dessert", "Snack"];

export const AddProductScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORIES[0],
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (uri) => {
    setFormData((prev) => ({ ...prev, image: uri }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Validasi", "Nama menu tidak boleh kosong");
      return false;
    }
    if (!formData.price.trim()) {
      Alert.alert("Validasi", "Harga tidak boleh kosong");
      return false;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Validasi", "Harga harus berupa angka positif");
      return false;
    }
    if (!formData.category) {
      Alert.alert("Validasi", "Kategori harus dipilih");
      return false;
    }
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const newProduct = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
      };

      await Storage.addProduct(newProduct);
      Alert.alert("Sukses", "Menu berhasil ditambahkan", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Gagal menambahkan menu. Silakan coba lagi.");
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Tambah Menu"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Picker */}
          <View style={styles.section}>
            <ImagePickerComponent
              imageUri={formData.image}
              onImageSelect={handleImageSelect}
              onRemoveImage={handleRemoveImage}
            />
          </View>

          {/* Form Fields */}
          <View style={styles.section}>
            {/* Nama Menu */}
            <View style={styles.field}>
              <Text style={styles.label}>Nama Menu *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: Kopi Espresso"
                placeholderTextColor={colors.mediumGray}
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                maxLength={50}
              />
            </View>

            {/* Deskripsi */}
            <View style={styles.field}>
              <Text style={styles.label}>Deskripsi</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Deskripsi menu (opsional)"
                placeholderTextColor={colors.mediumGray}
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* Harga */}
            <View style={styles.field}>
              <Text style={styles.label}>Harga (Rp) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 25000"
                placeholderTextColor={colors.mediumGray}
                value={formData.price}
                onChangeText={(value) => handleInputChange("price", value)}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Kategori */}
            <View style={styles.field}>
              <Text style={styles.label}>Kategori *</Text>
              <View style={styles.categoryList}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      formData.category === category &&
                        styles.categoryOptionSelected,
                    ]}
                    onPress={() => handleInputChange("category", category)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        formData.category === category &&
                          styles.categoryOptionTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleAddProduct}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Menyimpan..." : "Simpan Menu"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: "600",
    marginBottom: spacing.md,
    color: colors.coffeeDeep,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.softBlack,
    backgroundColor: colors.lightGray,
  },
  textarea: {
    textAlignVertical: "top",
    paddingTop: spacing.md,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  categoryOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
    backgroundColor: colors.white,
  },
  categoryOptionSelected: {
    backgroundColor: colors.coffeeMedium,
    borderColor: colors.coffeeMedium,
  },
  categoryOptionText: {
    ...typography.body,
    color: colors.softBlack,
    fontWeight: "500",
  },
  categoryOptionTextSelected: {
    color: colors.cream,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.mediumGray,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.softBlack,
  },
  submitButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.coffeeMedium,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.cream,
  },
});
