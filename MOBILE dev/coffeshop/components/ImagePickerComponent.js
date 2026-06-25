import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
} from "../utils/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const ImagePickerComponent = ({
  imageUri,
  onImageSelect,
  onRemoveImage,
}) => {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        onImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memilih gambar. Silakan coba lagi.");
      console.error("Image picker error:", error);
    }
  };

  const takePicture = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "granted") {
        Alert.alert("Permission", "Kami memerlukan izin akses kamera.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        onImageSelect(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal membuka kamera. Silakan coba lagi.");
      console.error("Camera error:", error);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Pilih Sumber Gambar",
      "Dari mana Anda ingin mengambil gambar?",
      [
        { text: "Galeri", onPress: pickImage },
        { text: "Kamera", onPress: takePicture },
        { text: "Batal", onPress: () => {} },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto Menu</Text>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[styles.actionButton, styles.removeBtn]}
            onPress={onRemoveImage}
          >
            <Icon name="trash-can" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.changeBtn]}
            onPress={showImageOptions}
          >
            <Icon name="pencil" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.imagePlaceholder, shadows.light]}
          onPress={showImageOptions}
        >
          <Icon name="camera-plus" size={48} color={colors.coffeeMedium} />
          <Text style={styles.placeholderText}>Tambahkan Foto Menu</Text>
          <Text style={styles.placeholderSubText}>
            Pilih dari galeri atau ambil foto baru
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.body,
    marginBottom: spacing.md,
    fontWeight: "600",
  },
  imageContainer: {
    width: "100%",
    height: 250,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    backgroundColor: colors.lightGray,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  actionButton: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  removeBtn: {
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: colors.error,
  },
  changeBtn: {
    bottom: spacing.md,
    right: spacing.md + 55,
    backgroundColor: colors.info,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.coffeeMedium,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cream,
  },
  placeholderText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.coffeeMedium,
  },
  placeholderSubText: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.darkGray,
  },
});
